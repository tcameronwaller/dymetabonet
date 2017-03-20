
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

function manageInterface() {

    d3.select("#load")
        .on("click", function () {
            // Load data from file in JSON format.
            // Create objects that associate with these data.
            d3.json(("../model/homo-sapiens/" + "model_sets_network.json"),
                function (error, model) {
                    if (error) throw error;
                    // Call function to explore model.
                    exploreModel(model);

                    document
                        .getElementById("submit-process")
                        .addEventListener(
                            "click", function (event) {
                                return controlProcessQuery(event, model);
                            }
                            );
                });
        });

    document
        .getElementById("query-queue-add")
        .addEventListener("click", addQueryStep);
}

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

    console.log("Process Network for " + process);
    var collection = collectProcessReactionsMetabolites({
        process: process,
        combination: "and",
        collection: extractInitialCollectionFromModel(model),
        model: model
    });
    visualizeNetwork(collection, model);
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
