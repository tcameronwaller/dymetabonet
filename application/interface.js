
////////////////////////////////////////////////////////////////////////////////
// Query portion
////////////////////////////////////////////////////////////////////////////////



/**
 * Use D3 to create elements in DOM with associative data.
 * @param {d3 selection} selection D3 selection of HTML element within which to create elements with associative data.
 * @param {string} element Type of HTML element to create with associative data.
 * @param {array or accessor function} accessData Accessible data in array or accessor function for these values in
 * the selection.
 * @return {d3 selection} D3 selection of elements that the function created with associative data.
 */
function createDataElements(selection, element, accessData) {
    var elements = selection.selectAll(element)
        .data(accessData);
    elements
        .exit()
        .remove();
    var elementsEnter = elements
        .enter()
        .append(element);
    elements = elementsEnter
        .merge(elements);
    return elements;
}

/**
 * Script for query portion.
 * Use an immediately-invoked function expression (IIFE) to establish scope in a convenient container.
 * An alternative style would be to declare the function and subsequently call it.
 */
function initializeQueryInterface() {
    // Create single instance objects of each view's class.
    // Pass instance objects as arguments to classes that need to interact with them.
    // This strategy avoids creation of replicate instances of each class and enables instances to communicate together.
    //var explorationView = new ExplorationView();
    //var navigationView = new NavigationView(explorationView);
    //var queryView = new QueryView(navigationView);

    // TODO: Allow the user to select the directory path and file of the metabolic model.
    // TODO: readdirSync from Node.js might work.
    createDataElements(
        d3.select("#selector"),
        "option",
        ["model_h-sapiens_recon-2.json"]
    )
        .text(function (d) {
            return d
        });

    d3.select("#assemble")
        .on("click", function () {
            //console.log(d3.event);
            //console.log(d3.event.srcElement.value);
            //console.log(d3.event.target.value);
            //self.dataFile = d3.event.target.value;
            //console.log(this.node().value);
            var dataFile = d3.select("#selector").node().value;

            // Load data from file in JSON format.
            // Create objects that associate with these data.
            d3.json(("../model/homo-sapiens/" + dataFile),
                function (error, modelInitial) {
                    if (error) throw error;
                    // Call function to assemble model.
                    assembleModel(modelInitial);
                });
        });
}

/**
 * Controls model assembly in response to user interaction.
 * @param {Object} event Record of event from Document Object Model.
 */
function controlModelAssembly(event) {
    // Obtain a single file object from the file selector.
    var file = document.getElementById("file-selector").files[0];
    // Create a file reader object.
    var reader = new FileReader();
    // Specify operation to perform after file loads.
    reader.onload = function (event) {
        // Element on which the event originated is event.currentTarget.
        // After load, the file reader's result attribute contains the file's
        // contents, according to the read method.

        // Assemble metabolic model.
        var model = assembleModel(JSON.parse(event.currentTarget.result));
        summarizeModel(model);
        // Initialize interface for metabolic model.
        initializeInterfaceForModel(model);
    };
    // Read file as text.
    reader.readAsText(file);
}

/**
 * Controls model load in response to user interaction.
 * @param {Object} event Record of event from Document Object Model.
 */
function controlModelLoad(event) {
    // Obtain a single file object from the file selector.
    var file = document.getElementById("file-selector").files[0];
    // Create a file reader object.
    var reader = new FileReader();
    // Specify operation to perform after file loads.
    reader.onload = function (event) {
        // Element on which the event originated is event.currentTarget.
        // After load, the file reader's result attribute contains the file's
        // contents, according to the read method.

        // Load metabolic model.
        var model = JSON.parse(event.currentTarget.result);
        summarizeModel(model);
        // Initialize interface for metabolic model.
        initializeInterfaceForModel(model);
    };
    // Read file as text.
    reader.readAsText(file);
}

/**
 * Initializes the interface to support behavior independent of data for
 * metabolic model.
 */
function initializeInterface() {

    // TODO: Activate all DOM behavior that is independent of the model data.
    // TODO: Make it obvious (styling) which aspects of the interface are inactive prior to loading model data.
    // TODO: Maybe change classes once I activate these elements in initializeInterfaceForModel().

    // Activate button for assembly of metabolic model from data in file.
    document
        .getElementById("assemble-model")
        .addEventListener("click", controlModelAssembly);
    // Activate button for load of metabolic model from assembly in file.
    document
        .getElementById("load-model")
        .addEventListener("click", controlModelLoad);

    //TODO:
    document
        .getElementById("query-queue-add")
        .addEventListener("click", addQueryStep);

}

/**
 * Initializes the interface to support behavior dependent on data for metabolic
 * model.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function initializeInterfaceForModel(model) {

    // TODO: Maybe change classes and styles of elements once I activate them.

    document
        .getElementById("submit-temp-query")
        .addEventListener(
            "click", function (event) {
                return controlProcessQuery(event, model);
            }
        );

}

// TODO: I need a recursive function that accepts an array of objects.
// TODO: Each object in the array includes all information relevant to a single query step from the queue.
// TODO: The function will recursively apply the appropriate function(s) for each query step from the queue.


/**
 * Controls query by metabolic process.
 * @param {Object} event Record of event from Document Object Model.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function controlProcessQuery(event, model) {
    // Element on which the event originated is event.currentTarget.
    var process = document.getElementById("process-text").value;
    // Methionine and cysteine metabolism
    var compartment = document.getElementById("compartment-text").value;
    // c, m, e, n

    console.log(
        "Process Network for " + process +
        " within compartment " + compartment
    );
    var collection1 = collectProcessReactionsMetabolites({
        process: process,
        combination: "and",
        collection: extractInitialCollectionFromModel(model),
        model: model
    });
    var collection2 = collectCompartmentReactionsMetabolites({
        compartment: compartment,
        combination: "and",
        collection: collection1,
        model: model
    });
    console.log(collection2);
    visualizeNetwork(collection2, model);
}






// TODO: I will need to re-write this function to handle the NodeList of radio buttons properly.
// TODO: use NodeList.forEach() to return the value of whichever is checked.
// TODO
/**
 * Determines the value of the only active radio button in a group.
 * @param {Array<Object>} radios Group of radio buttons.
 * @returns {string} Value of the only active radio button from the group.
 */
function determineRadioGroupValue(radios) {
    // Assume that only a single radio button in the group is active.
    return radios.filter(function (radio) {
        return radio.checked;
    })[0].value;
}





/**
 * Creates a radio button with a label for a step in a queue.
 * @param {number} stepCount Count of the step in the queue.
 * @param {string} labelText Text for the radio button's label.
 * @param {string} inputValue Value for the radio button.
 */
function createLabelRadioButton(stepCount, labelText, inputValue) {
    var label = document.createElement("label");
    label.appendChild(
        document.createTextNode(labelText)
    );
    var input = document.createElement("input");
    input.setAttribute("name", "step-" + stepCount + "-type");
    input.setAttribute("type", "radio");
    input.setAttribute("value", inputValue);

    // TODO: Attach an event listener for the radio button.
    // TODO: The listener function will need to determine the parent query step of the currentTarget to modify the correct step.

    //input.addEventListener("change", respondTypeChange);
    label.appendChild(input);
    return label;
}

/**
 * Removes the parent element of the element that triggered the event.
 * @param {Object} event Record of event from Document Object Model.
 */
function removeParentElement(event) {
    // Element on which the event originated is event.currentTarget.
    event
        .currentTarget
        .parentElement
        .parentElement
        .removeChild(event.currentTarget.parentElement);

    // TODO: After removing a query element, I should update the step count for the step label and for the names of groups of radio buttons.
    // TODO: Maybe the event should trigger a specific container function that calls the general removeParentElement function along with another function to update query step counts.

}

/**
 * Appends one additional query step to the query queue.
 * @param {Object} event Record of event from Document Object Model.
 */
function addQueryStep(event) {
    // Element on which the event originated is event.currentTarget.

    // Determine the count of the new step in the query queue.
    var steps = document
            .getElementById("query-queue")
            .getElementsByClassName("query-step");
    var stepCount = steps.length + 1;

    // Create element for query step and append it to the query queue.
    var step = document.createElement("div");
    step.setAttribute("class", "query-step");
    var header = document.createElement("h3");
    header.appendChild(document.createTextNode("Step " + stepCount));
    step.appendChild(header);
    step.appendChild(
        createLabelRadioButton(stepCount, "Attribute:", "attribute")
    );
    step.appendChild(
        createLabelRadioButton(stepCount, "Identity:", "identity")
    );
    step.appendChild(
        createLabelRadioButton(stepCount, "Topology:", "topology")
    );
    step.appendChild(document.createElement("br"));
    var button = document.createElement("button");
    button.setAttribute("class", "remove");
    button.setAttribute("type", "button");
    //button.addEventListener("click", removeParentElement);
    button.appendChild(document.createTextNode("Remove"));
    step.appendChild(button);
    document
        .getElementById("query-queue")
        .appendChild(step);

    // TODO: Update Step Count headers after deleting an intermediate step.

    // Activate delete buttons in query steps.
    document
        .getElementById("query-queue")
        .querySelectorAll("div.query-step > button.remove")
        .forEach(function (element) {
            element.addEventListener("click", removeParentElement);
        });
}
