
////////////////////////////////////////////////////////////////////////////////
// General Utility
////////////////////////////////////////////////////////////////////////////////

/**
 * Removes an element's parent element.
 * @param {Object} element Element in the Document Object Model.
 */
function removeParentElement(element) {
    element
        .parentElement
        .parentElement
        .removeChild(element.parentElement);
}

/**
 * Removes an element's child elements.
 * @param {Object} element Element in the Document Object Model.
 */
function removeChildElements(element) {
    Array
        .from(element.children)
        .forEach(function (child) {
            element.removeChild(child);
        })
}

/**
 * Determines the value of the only active radio button in a group.
 * @param {Object} radios Live collection of radio buttons in the Document
 * Object Model (DOM).
 * @returns {string} Value of the only active radio button from the group.
 */
function determineRadioGroupValue(radios) {
    // Assume that only a single radio button in the group is active.
    return Array.prototype.filter.call(radios, function (radio) {
        return radio.checked;
    })[0].value;
}


////////////////////////////////////////////////////////////////////////////////
// Query Interface
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

function testElementIteration(event) {
    // Select all steps in the query's queue.
    var collection = document
        .getElementById("query_temporary")
        .getElementsByClassName("test-iteration");
    var result = Array.prototype.reduce.call(collection, function (accumulator, element) {
        if (!accumulator.includes(element.textContent)) {
            // Method concat does not modify the original array.
            // Method concat returns a new array.
            // It is necessary to store this new array or return it
            // directly.
            return accumulator.concat(element.textContent);
        } else {
            return accumulator;
        }
    }, []);
    console.log(result);
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
        .getElementById("submit-query")
        .addEventListener(
            "click", function (event) {
                return controlQuery(event, model);
            }
        );
    Array.from(
        document
            .getElementById("query-assembly")
            .getElementsByClassName("type")
    )
        .forEach(function (radio) {
            radio.addEventListener("change", function (event) {
                // Element on which the event originated is event.currentTarget.
                updateQueryAssembly();
            });
        });
}

/**
 * Updates the interface for assembly of query steps by the type of step.
 */
function updateQueryAssembly() {
    // Remove any existing components of the interface for query assembly.
    removeChildElements(document.getElementById("query-assembly-details"));
    // Append elements to query assembly interface according to the type of
    // query.
    appendQueryAssembly();
}

/**
 * Appends elements to the interface for assembly of query steps.
 */
function appendQueryAssembly() {
    var queryType = determineRadioGroupValue(
        document
            .getElementById("query-assembly")
            .getElementsByClassName("type")
    );
    console.log(queryType);
    var queryAssemblyDetails = document
        .getElementById("query-assembly-details");
    if (queryType === "attribute") {
        // Append elements to interface for assembly of query by attribute.
        // Create text field.
        // <input class="query-step" id="compartment-text" type="text">
        var textField = document.createElement("input");
        textField.setAttribute("class", "text");
        textField.setAttribute("type", "text");
        queryAssemblyDetails.appendChild(textField);
        queryAssemblyDetails.appendChild(document.createElement("br"));

        // TODO: This might be a good point to bind the datalist to the text field.


    } else if (queryType === "topology") {
        // TODO: Eventually fill in the interface for topological queries.
    }
}















/**
 * Applies a function recursively to a live collection of elements in the
 * document object model (DOM).
 * @param {Object} elements Live collection of elements in the DOM.
 * @param {Function} applyFunction Function to apply on elements in the
 * collection.
 */
function applyToDocumentCollection(elements, applyFunction) {
    // Assign a class to elements in the collection to organize a queue for
    // recursive iteration.
    elements.classList.add("recursive-iteration-queue");
    // Select all elements that are in the queue for recursive iteration.
    // Assume that the class name of the queue is unique in the document.
    // The collection is live, so loss of the class will remove a step from
    // the queue.
    var queue = document
        .getElementsByClassName("recursive-iteration-queue");
    // Call recursive function to act on each element in the queue.
    applyToDocumentCollectionQueue(queue, applyFunction);
}

/**
 * Applies a function recursively to steps or elements in a queue.
 * @param {Object} queue Live collection of elements in the DOM.
 * @param {Function} applyFunction Function to apply on elements in the
 * collection.
 */
function applyToDocumentCollectionQueue(queue, applyFunction) {
    // Apply function to next element in the queue.
    applyFunction(queue[0]);
    // Remove queue class from next element to remove it from the queue.
    queue[0].classList.remove("recursive-iteration-queue");
    // If the queue is not empty, call recursive function to act on each element
    // in the queue.
    if (queue[0]) {
        applyToDocumentCollectionQueue(queue, applyFunction);
    }
}




// TODO: I need this version of a reduce method to extract information from elements for my query steps.

/**
 * Accumulates a value or object by recursive application of a function to a
 * live collection of elements in the document object model (DOM).
 * @param {Object} parameters Destructured object of parameters.
 * @param {Object} parameters.elements Live collection of elements in the DOM.
 * @param {Object} parameters.accumulator The value that accumulates from
 * iterative application of the function to the elements.
 * @param {Object} parameters.initialValue The initial value for the
 * accumulator.
 * @param {Object} parameters.operation The operation or function to apply on
 * elements.
 * @returns {Object} Identifiers of initial elements for the query step.

 */
function accumulateFromDocumentCollection({elements, collection, model} = {}) {
    // Assign a class to elements in the collection to organize a queue for
    // recursive iteration.
    elements.classList.add("recursive-iteration-queue");
    // Select all elements that are in the queue for recursive iteration.
    // Assume that the class name of the queue is unique in the document.
    // The collection is live, so loss of the class will remove a step from
    // the queue.
    var queue = document
        .getElementsByClassName("recursive-iteration-queue");
    // Call recursive function to act on each element in the queue.
    applyToDocumentCollectionQueue(queue, applyFunction);
}

/**
 * Accumulates an object by recursive application of a function to to steps or
 * elements in a queue.
 * @param {Object} queue Live collection of elements in the DOM.
 * @param {Function} applyFunction Function to apply on elements in the
 * collection.
 */
function accumulateFromDocumentCollectionQueue(queue, applyFunction) {
    // Apply function to next element in the queue.
    applyFunction(queue[0]);
    // Remove queue class from next element to remove it from the queue.
    queue[0].classList.remove("recursive-iteration-queue");
    // If the queue is not empty, call recursive function to act on each element
    // in the queue.
    if (queue[0]) {
        applyToDocumentCollectionQueue(queue, applyFunction);
    }
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

/**
 * Controls the execution of all steps in the queue for the query.
 * @param {Object} event Record of event from Document Object Model.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function controlQuery(event, model) {
    var queryDetails = extractQueryDetails();

    // TODO: I will need to determine whether the user enters a value for a process, a compartment, or a reaction type (transport, reaction).

    // Apply a control function to each step in the queue for the query.
    //applyToDocumentCollection(queryQueueSteps, controlQueryStep);

    // Call recursive function to act on each member of the queue.
    //controlQueryStep({
    //    queue: queryQueue,
    //    collection: extractInitialCollectionFromModel(model),
    //    model: model
    //});
}

/**
 * Extracts details for steps in the query from elements in the Document Object
 * Model.
 */
function extractQueryDetails() {
    // Select all steps in the query's queue.
    var queryQueueSteps = document
        .getElementById("query-queue")
        .getElementsByClassName("query-step");
    var queryStepDetails = Array
        .prototype
        .map
        .call(queryQueueSteps, extractQueryStepDetails);
    console.log(queryStepDetails);
}

/**
 * Extracts details for a single step in the query from elements in the Document
 * Object Model.
 */
function extractQueryStepDetails(stepElement) {
    return {
        combination: determineRadioGroupValue(
            stepElement.getElementsByClassName("combination")
        ),
        type: "attribute",
        value: stepElement.getElementsByClassName("text")[0].value
    };
    // Determine the value of the text field.
}





/**
 * Controls the execution of all steps in the queue for the query.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.queue Elements that remain in the queue for
 * recursive iteration.
 * @param {Object<string, Array<string>>} parameters.collection Identifiers of
 * metabolites and reactions in the query's current collection.
 * @param {Object} parameters.model Information about entities and relations in
 * a metabolic model.
 * @returns {Array<string>>} Identifiers of initial elements for the query step.
 */
function controlQueryQueueStep({queue, collection, model} = {}) {}


// TODO: Use this function to organize the functionality for handling a single step from the query.
// TODO: Use this function to execute a single step right after adding it to the queue.
function controlQueryStep() {}

/**
 * Creates a radio button with a label for a step in a queue.
 * @param {string} className Name of the class.
 * @param {string} name Name of the radio button's group.
 * @param {string} value Value for the radio button.
 * @param {string} text Text for the radio button's label.
 * @returns {Object} Label element with a radio button input element.
 */
function createLabelRadioButton(className, name, value, text) {
    var label = document.createElement("label");
    var input = document.createElement("input");
    input.setAttribute("class", className);
    input.setAttribute("name", name);
    input.setAttribute("type", "radio");
    input.setAttribute("value", value);
    label.appendChild(input);
    label.appendChild(
        document.createTextNode(text)
    );
    return label;
}






// TODO: Do not include input elements in the iterable query steps in the queue.
// TODO: Only include input elements in views at the bottom of the queue for adding new steps.
// TODO: When adding the new step to the queue, include a concise description of the step with non-input elements.
// TODO: For example, use <p> and <div> elements to style a concise description of the step.




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

    // Create element for query step.
    var step = document.createElement("div");
    step.setAttribute("class", "query-step");
    var header = document.createElement("h3");
    header.appendChild(document.createTextNode("Step " + stepCount));
    step.appendChild(header);
    // Create radio buttons for combination strategy.
    step.appendChild(
        createLabelRadioButton(
            "combination", "combination-step-" + stepCount, "and", "and"
        )
    );
    step.appendChild(
        createLabelRadioButton(
            "combination", "combination-step-" + stepCount, "or", "or"
        )
    );
    step.appendChild(
        createLabelRadioButton(
            "combination", "combination-step-" + stepCount, "not", "not"
        )
    );
    step.appendChild(document.createElement("br"));
    // Create text field.
    // <input class="query-step" id="compartment-text" type="text">
    var textField = document.createElement("input");
    textField.setAttribute("class", "text");
    textField.setAttribute("type", "text");
    step.appendChild(textField);
    step.appendChild(document.createElement("br"));
    // Create button to remove step from queue.
    var button = document.createElement("button");
    button.setAttribute("class", "remove-query-step");
    button.setAttribute("type", "button");
    // TODO: After removing a query element, I should update the step count for the step labels.
    // TODO: Maybe the event should trigger a specific container function that calls the general removeParentElement function along with another function to update query step counts.
    button.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        removeParentElement(event.currentTarget);
    });
    button.appendChild(document.createTextNode("X"));
    step.appendChild(button);
    // Append step element to the query queue.
    document
        .getElementById("query-queue")
        .appendChild(step);

    // TODO: Update Step Count headers after deleting an intermediate step.

    // Activate delete buttons in query steps.
    //document
    //    .getElementById("query-queue")
    //    .querySelectorAll("div.query-step > button.remove")
    //    .forEach(function (element) {
    //        element.addEventListener("click", removeParentElement);
    //    });
}
