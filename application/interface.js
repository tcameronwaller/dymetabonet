
////////////////////////////////////////////////////////////////////////////////
// General Utility
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a new element with text content.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.text Text content for the child element.
 * @param {string} parameters.type Type of new element.
 * @returns {Object} Element with text content.
 */
function createElementWithText({text, type} = {}) {
    var element = document.createElement(type);
    element.textContent = text;
    return element;
}

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
    return Array.from(radios).filter(function (radio) {
        return radio.checked;
    })[0].value;
}

/**
 * Removes any selection of radio buttons in a group.
 * @param {Object} radios Live collection of radio buttons in the Document
 * Object Model (DOM).
 */
function removeRadioGroupSelection(radios) {
    return Array.from(radios).forEach(function (radio) {
        radio.checked = false;
    });
}

/**
 * Emphasizes or deemphasizes an element of class tab.
 * @param {Object} element Element of class tab in the Document Object Model.
 */
function emphasizeDeemphasizeTab(tab) {
    // Toggle display style of the tab.
    if (!tab.classList.contains("emphasis")) {
        tab.classList.add("emphasis");
    } else if (tab.classList.contains("emphasis")) {
        tab.classList.remove("emphasis");
    }
}

/**
 * Displays or hides the child element of class panel of a parent element of
 * class tab.
 * @param {Object} element Element of class tab in the Document Object Model.
 */
function displayHideChildPanel(tab) {
    var panel = document.getElementById(tab.id.split("-")[0] + "-panel");
    // Toggle display style of the panel.
    if (panel.classList.contains("hide")) {
        panel.classList.remove("hide");
        panel.classList.add("show");
    } else if (panel.classList.contains("show")) {
        panel.classList.remove("show");
        panel.classList.add("hide");
    }
}

/**
 * Creates a radio button with a label for a step in a queue.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.className Name of the class.
 * @param {string} parameters.name Name of the radio button's group.
 * @param {string} parameters.value Value for the radio button.
 * @param {string} parameters.text Text for the radio button's label.
 * @returns {Object} Label element with a radio button input element.
 */
function createLabelRadioButton({className, name, value, text} = {}) {
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

////////////////////////////////////////////////////////////////////////////////
// General Interface
////////////////////////////////////////////////////////////////////////////////

/**
 * Initializes the interface to support behavior independent of data for
 * metabolic model.
 */
function initializeInterface() {
    // Activate elements of the Document Object Model for all behavior that is
    // independent of the model data.

    // Activate button for assembly of metabolic model from data in file.
    document
        .getElementById("assemble-model")
        .addEventListener("click", controlModelAssembly);
    // Activate button for load of metabolic model from assembly in file.
    document
        .getElementById("load-model")
        .addEventListener("click", controlModelLoad);
    // Temporarily during development, assemble or load model by default.
    //assembleDefaultModel();
    loadDefaultModel();
}

/**
 * Initializes the interface to support behavior dependent on data for metabolic
 * model.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function controlInterface(model) {
    // TODO: Maybe change classes and styles of elements once I activate them.

    // Assemble set index.
    // The set index will be a means of data exchange between the views for
    // attribute sets and attribute relations.
    var setIndex = createSetIndex(model.entities.reactions);

    // Initialize query interface.
    controlSetInterface(setIndex, model);
}

////////////////////////////////////////////////////////////////////////////////
// Model Interface
////////////////////////////////////////////////////////////////////////////////

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
        controlInterface(model);
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
        controlInterface(model);
    };
    // Read file as text.
    reader.readAsText(file);
}

/**
 * Assemble model by default.
 */
function assembleDefaultModel() {
    // Load data from file in JSON format.
    d3.json(
        ("../model/homo-sapiens/model_h-sapiens_recon-2.json"),
        function (error, data) {
            if (error) {
                throw error;
            }
            // Call function to assemble model.
            var model = assembleModel(data);
            summarizeModel(model);
            controlInterface(model);
        }
    );
}

/**
 * Load model by default.
 */
function loadDefaultModel() {
    // Load data from file in JSON format.
    d3.json(
        ("../model/homo-sapiens/model_sets_network.json"),
        function (error, model) {
            if (error) {
                throw error;
            }
            // Call function to assemble model.
            summarizeModel(model);
            controlInterface(model);
        }
    );
}

////////////////////////////////////////////////////////////////////////////////
// Set Interface
////////////////////////////////////////////////////////////////////////////////

/**
 * Controls the set interface.
 * @param {Array<Object<string>>} setIndex Attribute set index for metabolites
 * and reactions.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function controlSetInterface(setIndex, model) {
    // TODO: Move setIndex creation here...

    console.log("setIndex");
    console.log(setIndex);

    // Create information summary for set menu.
    // TODO: Eventually store information about user interaction/selection within the setSummary. Record information about selections for inclusion or exclusion.
    var setSummary = createSetSummary(setIndex, model);
    console.log("setSummary");
    console.log(setSummary);

    // Create set menu.
    var setMenu = controlSetMenu(setSummary, setIndex, model);
}

// TODO: Before I can create the set menu, I need to create the necessary data structure to associate with it.
function controlSetMenu(setSummary, setIndex, model) {
    initializeSetMenu();
    updateSetMenu(setSummary, model);
}

/**
 * Initializes the visual representation of the attribute set summary.
 */
function initializeSetMenu() {
    // Create container for set menu.
    var setView = document.getElementById("set");
    var setMenu = document.createElement("div");
    setMenu.setAttribute("id", "set-menu");
    setView.appendChild(setMenu);
    // Create set menu table.
    var setMenuTable = document.createElement("table");
    setMenuTable.setAttribute("id", "set-menu-table");
    // Create header.
    var head = document.createElement("thead");
    var headRow = document.createElement("tr");
    headRow
        .appendChild(createElementWithText({text: "Attribute", type: "th"}))
        .setAttribute("class", "set-menu-table-column-attribute");
    // TODO: Introduce buttons to the head row to select between reactions or metabolites.
    // TODO: Also display the total count of reactions or metabolites... that'll be different than the total of the counts for each property.
    var summaryHead = document.createElement("th");
    summaryHead.setAttribute("class", "set-menu-table-column-summary");
    // Metabolite entity label.
    var metaboliteLabel = document.createElement("span");
    metaboliteLabel.textContent = "metabolites";
    metaboliteLabel.setAttribute("id", "set-menu-table-entity-metabolites");
    // TODO: I'll need some sort of toggle event handler for the the selection of entities.
    metaboliteLabel.setAttribute("class", "set-menu-table-entity-selection");
    summaryHead.appendChild(metaboliteLabel);
    // Spacer.
    summaryHead
        .appendChild(createElementWithText({text: "...or...", type: "span"}));
    // Reaction entity label.
    var reactionLabel = document.createElement("span");
    reactionLabel.textContent = "reactions";
    reactionLabel.setAttribute("id", "set-menu-table-entity-reactions");
    summaryHead.appendChild(reactionLabel);
    // Append header to table.
    headRow.appendChild(summaryHead);
    head.appendChild(headRow);
    setMenuTable.appendChild(head);
    // Create body.
    var body = document.createElement("tbody");
    setMenuTable.appendChild(body);
    // Append set menu table to set menu.
    setMenu.appendChild(setMenuTable);

    // Append row for first step of query queue.
    //appendQueryStep(extractQueueSummary(queue));
}

// TODO: User interaction will modify the setSummary and the value of the entity.
// TODO: According to these values, create the set menu.
function updateSetMenu(setSummary, entity, model) {

    // TODO: Translate the setSummary so that it is ready for creating the bar charts.
    // TODO: Maybe in the initial preparation of setSummary, use names of compartments and processes, not identifiers.
    // TODO: In order to do that, I'll probably need to iterate over the attributes and values separately after the initial counting and such.

    // TODO: Sort the attributes and values (probably put smallest values first for ease in readability.
    // TODO: Determine the incremental sums of counts for the stacked bar charts.


    // Select body of set menu table.
    var body = d3
        .select("#set-menu-table")
        .select("tbody");
    // Append rows to table.
    var rows = body
        .selectAll("tr")
        .data(setSummary)
        .enter()
        .append("tr");
    // Append cells to table.
    var cells = rows
        .selectAll("td")
        .data(function (element, index) {
            // Organize data for table columns.
            // TODO: Maybe customize the data a little to simplify selection?
            // TODO: Introduce some sort of flag for the columns?
            return [].concat(
                {
                    class: "set-menu-table-column-attribute",
                    type: "attribute",
                    value: element.attribute
                },
                {
                    class: "set-menu-table-column-summary",
                    type: "summary",
                    value: element.values
                });
        })
        .enter()
        .append("td");
    // Assign class to cells.
    cells
        .attr("class", function (data) {
            return data.class;
        });
    // Append text content of cells in attribute column.
    var attributeCells = cells
        .filter(function (data, index) {
            return data.type === "attribute";
        });
    attributeCells
        .text(function (data) {
            return data.value;
        });
    // Append graphical containers in cells in summary column.
    var summaryCells = cells
        .filter(function (data, index) {
            return data.type === "summary";
        });
    var summaryCellGraphs = summaryCells
        .append("svg");
    summaryCellGraphs
        .attr("class", "set-menu-table-cell-graph");
    // Determine the width of graphical containers.
    var graphWidth = parseFloat(
        window.getComputedStyle(
            document.getElementsByClassName("set-menu-table-cell-graph")
                .item(0)
        )
            .width
            .replace("px", "")
    );
    console.log("graphWidth");
    console.log(graphWidth);
    // TODO: Define scale function(s)... I'll need a separate scale for each row.
    // TODO: Append rectangles for each value of the data.
    // TODO: Format rectangles according to data... I'll need to set both x positions and widths.
    // TODO: https://github.com/d3/d3/blob/master/API.md#stacks
    // TODO: http://www.adeveloperdiary.com/d3-js/create-stacked-bar-chart-using-d3-js/

    // Define scale functions for bar charts.
    //var metaboliteScale = d3
    //    .scaleLinear()
    //    .domain([0, queue[0].countMetabolites])
    //    .range([0, 0.99*svgWidth]);
    // Append bar chart for metabolites.
    //var metaboliteBarCellSVGs = barCellSVGs
    //    .filter(function (data, index) {
    //        return (data.subtype === "metabolite");
    //    });
    //var metaboliteBars = metaboliteBarCellSVGs
    //    .append("rect");
    //metaboliteBars
    //    .attr("width", function (data, index) {
    //        return metaboliteScale(data.value);
    //    })
    //    .attr("class", "query-queue-table-cell-bars-metabolite");
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
 * Initializes the query interface.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function controlQueryInterface(model) {
    // Create query queue.
    var queue = initializeQueryQueue(model)
    initializeVisualQueryQueue(queue);

    // Create query builder.
    appendQueryBuilderCombination();
    appendQueryBuilderType();
    activateQueryBuilderType(model);
    appendQueryBuilderAdd();
    activateQueryBuilderAdd(queue, model);
}

////////////////////////////////////////////////////////////////////////////////
// Query Builder Interface

/**
 * Appends elements to specify combination strategy to build queries.
 */
function appendQueryBuilderCombination() {
    // Create header.
    var builderHead = document.createElement("h3");
    builderHead.textContent = "Builder";
    var builder = document.getElementById("query-builder")
    builder.appendChild(builderHead);
    // Create options for combination strategy.
    var combination = document.createElement("div");
    // Create radio buttons for combination strategy.
    combination.appendChild(
        createLabelRadioButton({
            className: "query-combination-radio",
            name: "combination",
            value: "and",
            text: "and (-)"
        })
    );
    combination.appendChild(
        createLabelRadioButton({
            className: "query-combination-radio",
            name: "combination",
            value: "or",
            text: "or (+)"
        })
    );
    combination.appendChild(
        createLabelRadioButton({
            className: "query-combination-radio",
            name: "combination",
            value: "not",
            text: "not (x)"
        })
    );
    builder.appendChild(combination);
}

/**
 * Appends elements to specify query type to build queries.
 */
function appendQueryBuilderType() {
    // Create options for query type.
    var type = document.createElement("div");
    // Create radio buttons for query type.
    type.appendChild(
        createLabelRadioButton({
            className: "query-type-radio",
            name: "type",
            value: "attribute",
            text: "attribute"
        })
    );
    type.appendChild(
        createLabelRadioButton({
            className: "query-type-radio",
            name: "type",
            value: "topology",
            text: "topology"
        })
    );
    document.getElementById("query-builder").appendChild(type);
}

/**
 * Activates interactive elements to specify query type.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function activateQueryBuilderType(model) {
    // Activate event listeners.
    Array.from(
        document
            .getElementById("query-builder")
            .getElementsByClassName("query-type-radio")
    )
        .forEach(function (radio) {
            radio.addEventListener("change", function (event) {
                // Element on which the event originated is event.currentTarget.
                appendQueryBuilderDetail(model);
            });
        });
}

/**
 * Determines all possible attribute selections from a metabolic model.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function determineAttributeReference(model) {
    var metabolites = Object.values(model.sets.metabolites)
        .map(function (metabolite) {
            return metabolite.name + " (metabolite name)";
        });
    var reactions = Object.values(model.network.nodes.reactions)
        .map(function (reaction) {
            return reaction.name + " (reaction name)";
        });
    var compartments = Object.values(model.sets.compartments)
        .map(function (compartment) {
            return compartment.name + " (compartment name)";
        });
    var processes = Object.values(model.sets.processes).map(function (process) {
        return process.name + " (process name)";
    });
    var extras = [
        "undefined (process name)",
        "conversion (reaction type)",
        "transport (reaction type)",
        "irreversible (reaction direction)",
        "reversible (reaction direction)"
    ];
    // TODO: Include metabolites and reactions as they become relevant.
    return [].concat(compartments, processes, extras);
}

/**
 * Appends elements to build specific query steps.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function appendQueryBuilderDetail(model) {
    var builder = document.getElementById("query-builder");
    // Remove any existing components of the interface for query builder detail.
    if (document.getElementById("query-builder-detail")) {
        var queryBuilderDetail = document
            .getElementById("query-builder-detail");
        removeChildElements(queryBuilderDetail);
    } else {
        var queryBuilderDetail = document.createElement("div");
        queryBuilderDetail.setAttribute("id", "query-builder-detail");
        builder.insertBefore(
            queryBuilderDetail, document.getElementById("control-query")
        );
    }
    // Determine type of query.
    var queryType = determineRadioGroupValue(
        builder
            .getElementsByClassName("query-type-radio")
    );
    // Append elements to query assembly interface according to the type of
    // query.
    if (queryType === "attribute") {
        // Append elements to interface for assembly of query by attribute.
        // Determine list of attributes for reference.
        // TODO: The attribute reference list should be different for different combination strategies (and, or, not).
        var attributeReference = determineAttributeReference(model);
        // Create reference list for text field.
        var attributeList = document.createElement("datalist");
        attributeList.setAttribute("id", "attribute-options");
        attributeReference.forEach(function (element) {
            var option = document.createElement("option");
            option.setAttribute("value", element);
            attributeList.appendChild(option);
        });
        queryBuilderDetail.appendChild(attributeList);
        // Create text field.
        var textField = document.createElement("input");
        textField.setAttribute("autocomplete", "off");
        textField.setAttribute("class", "text");
        textField.setAttribute("id", "attribute-text");
        textField.setAttribute("list", "attribute-options");
        textField.setAttribute("type", "search");
        queryBuilderDetail.appendChild(textField);
        queryBuilderDetail.appendChild(document.createElement("br"));
    } else if (queryType === "topology") {
        // TODO: Eventually fill in the interface for topological queries.
    }
}

/**
 * Appends elements to add a new query step to the queue.
 */
function appendQueryBuilderAdd() {
    var builder = document.getElementById("query-builder");
    // Create button to add query step to queue.
    var add = document.createElement("button");
    add.setAttribute("id", "control-query");
    add.setAttribute("type", "button");
    add.textContent = "+";
    builder.appendChild(add);
}

/**
 * Activates interactive elements to add a new query step to the queue.
 * @param {Array<Object>} queue Details for steps in the query's queue.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function activateQueryBuilderAdd(queue, model) {
    // Activate event listeners.
    document
        .getElementById("control-query")
        .addEventListener("click", function handleEvent(event) {
            // Element on which the event originated is event.currentTarget.
            // Execute operation.
            controlQuery(queue, model);
            // Remove event listener after first execution of operation.
            event.currentTarget.removeEventListener(event.type, handleEvent);
        });
}

////////////////////////////////////////////////////////////////////////////////
// Query Queue Interface

/**
 * Initializes the query queue.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Array<Object>} queue Details for steps in the query's queue.
 */
function initializeQueryQueue(model) {
    // Initialize query queue.
    var step = {
        collection: extractInitialCollectionFromModel(model),
        complete: true,
        type: "source",
        criterion: "model"
    };
    // Return initial query queue for use in query assembly and execution.
    return [].concat(step);
}

/**
 * Confirms that the query assembly interface is complete with all necessary
 * details.
 */
function confirmQueryAssembly() {
    // TODO: Return true/false whether or not the query step has complete/appropriate parameters.
}

/**
 * Extracts details from the query assembly interface.
 * @returns {Object} Details of the query step from the query assembly
 * interface.
 */
function extractQueryAssemblyDetails() {
    var queryAssembly = document.getElementById("query-builder");
    var combination = determineRadioGroupValue(
        queryAssembly.getElementsByClassName("query-combination-radio")
    );
    var type = determineRadioGroupValue(
        queryAssembly.getElementsByClassName("query-type-radio")
    );
    if (type === "attribute") {
        var text = document.getElementById("attribute-text").value;
        var value = text.slice(0, (text.lastIndexOf("(") - 1));
        var entityAttribute = text
            .slice((text.lastIndexOf("(") + 1), text.lastIndexOf(")"));
        var entity = entityAttribute.split(" ")[0];
        var attribute = entityAttribute.split(" ")[1];
        return {
            attribute: attribute,
            combination: combination,
            complete: false,
            criterion: value,
            entity: entity,
            type: type,
            value: value
        };
    } else if (type === "topology") {
        // TODO: Extract details for a topological query.
    }
}

// TODO: This might still be useful for reading details from steps in the query queue.
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
 * Determines the identifier for an entity with a specific name.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.name Name of an entity.
 * @param {string} parameters.entity Type of entity.
 * @param {Object} parameters.model Information about entities and relations in
 * a metabolic model.
 * @returns {string} Identifier of entity with specific name.
 */
function determineEntityIdentifierFromName({name, entity, model} = {}) {
    // Assume that there is a single record for each entity with each name.
    if (entity === "compartment") {
        return Object.keys(model.sets.compartments)
            .filter(function (identifier) {
                return model.sets.compartments[identifier].name === name;
            })[0];
    } else if (entity === "metabolite") {
        // TODO: Return identifier for compartmental or general metabolite, depending on how you implement the query function for metabolite.
    } else if (entity === "process") {
        return Object.keys(model.sets.processes).filter(function (identifier) {
            return model.sets.processes[identifier].name === name;
        })[0];
    } else if (entity === "reaction") {
        return Object.keys(model.network.nodes.reactions)
            .filter(function (identifier) {
                return model
                        .network
                        .nodes
                        .reactions[identifier]
                        .name === "name";
            })[0];
    }
}

/**
 * Executes all steps in the query and stores results of each step with queue
 * details.
 * @param {Array<Object>} queue Details for steps in the query's queue.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Array<Object>} Details and collections for each step in query
 * queue.
 */
function executeQuery(queue, model) {
    return queue.map(function (step, index) {
        if (!step.complete) {
            // Query step is not complete.
            // Execute query step and record collection and summary.
            // Determine previous collection.
            // Use collection from previous step.
            var oldCollection = queue[index - 1].collection;
            // Determine type of query step.
            if (step.type === "attribute") {
                // Determine identifier from entity name.
                var identifier = determineEntityIdentifierFromName({
                    name: step.value,
                    entity: step.entity,
                    model: model
                });
                if (
                    step.entity === "compartment" && step.attribute === "name"
                ) {
                    // Execute query by compartment name.
                    var newCollection = collectCompartmentReactionsMetabolites({
                        compartment: identifier,
                        combination: step.combination,
                        collection: oldCollection,
                        model: model
                    });
                } else if (
                    step.entity === "metabolite" && step.attribute === "name"
                ) {
                    // Execute query by metabolite name.
                } else if (
                    step.entity === "process" && step.attribute === "name"
                ) {
                    // Execute query by process name.
                    var newCollection = collectProcessReactionsMetabolites({
                        process: identifier,
                        combination: step.combination,
                        collection: oldCollection,
                        model: model
                    });
                } else if (
                    step.entity === "reaction" && step.attribute === "name"
                ) {
                    // Execute query by reaction name.
                }
                // Return a new record for the query step.
                return {
                    attribute: step.attribute,
                    collection: newCollection,
                    combination: step.combination,
                    complete: true,
                    criterion: step.criterion,
                    entity: step.entity,
                    type: step.type,
                    value: step.value
                };
            } else if (step.type === "topology") {
                // TODO: Execute a topology query.
            }
        } else {
            // Query step is complete.
            // Return copy of query step.
            if (step.type === "source") {
                return {
                    collection: step.collection,
                    complete: step.complete,
                    type: step.type,
                    criterion: step.criterion
                };
            } else if (step.type === "attribute") {
                return {
                    attribute: step.attribute,
                    collection: step.collection,
                    combination: step.combination,
                    complete: step.complete,
                    criterion: step.criterion,
                    entity: step.entity,
                    type: step.type,
                    value: step.value
                };
            } else if (step.type === "topology") {
                // TODO: Return a copy of the object for a topology query step.
            }
        }
    });
}

/**
 * Extracts a summary of each query queue step for the query queue table.
 * @param {Array<Object>} queue Details for steps in the query's queue.
 * @returns {Array<Object>} Summary of each step in query queue.
 */
function extractQueueSummary(queue) {
    var combinationSymbol = {
        and: "-",
        or: "+",
        not: "x"
    };
    // Extract information from query queue for query queue table.
    return queue.map(function (step, index) {
        if (step.combination) {
            var combination = combinationSymbol[step.combination];
        } else {
            var combination = "...";
        }
        return {
            combination: combination,
            countMetabolites: step.collection.metabolites.length,
            countReactions: step.collection.reactions.length,
            countStep: index,
            criterion: step.criterion,
        };
    });
}

/**
 * Appends an additional query step to the query queue according to details from
 * the query assembly interface.
 * @param {Array<Object>} queue Summary of details for steps in the query's
 * queue.
 */
function appendQueryStep(queue) {
    // TODO: Once the user can remove steps, I'll need to handle the exit selection.

    // Select query queue table body.
    var body = d3
        .select("#query-queue")
        .select("table")
        .select("tbody");
    // Append query queue table rows.
    var rows = body
        .selectAll("tr")
        .data(queue)
        .enter()
        .append("tr");
    // Append query queue table cells.
    var cells = rows
        .selectAll("td")
        .data(function (step, index) {
            // Organize data for table columns.
            if (step.countStep === 0) {
                var removeType = "empty";
            } else if (step.countStep > 0) {
                var removeType = "button";
            }
            return [].concat(
                {
                    class: "query-queue-table-column-step",
                    type: "text",
                    value: step.countStep.toString()
                },
                {
                    class: "query-queue-table-column-combination",
                    type: "text",
                    value: step.combination
                },
                {
                    class: "query-queue-table-column-criterion",
                    type: "text",
                    value: step.criterion
                },
                {
                    class: "query-queue-table-column-metabolites",
                    subtype: "metabolite",
                    type: "bar",
                    value: step.countMetabolites
                },
                {
                    class: "query-queue-table-column-reactions",
                    subtype: "reaction",
                    type: "bar",
                    value: step.countReactions
                },
                {
                    class: "query-queue-table-column-remove",
                    type: removeType,
                    value: ""
                });
        })
        .enter()
        .append("td");
    cells
        .attr("class", function (data) {
            return data.class;
        });
    // Append text content of cells.
    var textCells = cells
        .filter(function (data, index) {
            return (data.type === "text");
        });
    textCells
        .text(function (data) {
            return data.value;
        });
    // Append graphical container for bar cells.
    var barCells = cells
        .filter(function (data, index) {
            return (data.type === "bar");
        });
    var barCellSVGs = barCells
        .append("svg");
    barCellSVGs
        .attr("class", "query-queue-table-cell-svg");
    // Determine the width of graphical container.
    var svgWidth = parseFloat(
        window.getComputedStyle(
            document.getElementsByClassName("query-queue-table-cell-svg")
                .item(0)
        )
            .width
            .replace("px", "")
    );
    // Define scale functions for bar chart for metabolites.
    var metaboliteScale = d3
        .scaleLinear()
        .domain([0, queue[0].countMetabolites])
        .range([0, 0.99*svgWidth]);
    // Append bar chart for metabolites.
    var metaboliteBarCellSVGs = barCellSVGs
        .filter(function (data, index) {
            return (data.subtype === "metabolite");
        });
    var metaboliteBars = metaboliteBarCellSVGs
        .append("rect");
    metaboliteBars
        .attr("width", function (data, index) {
            return metaboliteScale(data.value);
        })
        .attr("class", "query-queue-table-cell-bars-metabolite");
    // Define scale functions for bar chart for reactions.
    var reactionScale = d3
        .scaleLinear()
        .domain([0, queue[0].countReactions])
        .range([0, 0.99*svgWidth]);
    // Append bar chart for reactions.
    var reactionBarCellSVGs = barCellSVGs
        .filter(function (data, index) {
            return (data.subtype === "reaction");
        });
    var reactionBars = reactionBarCellSVGs
        .append("rect");
    reactionBars
        .attr("width", function (data, index) {
            return reactionScale(data.value);
        })
        .attr("class", "query-queue-table-cell-bars-reaction");

    // Append button content of remove cells.
    var removeCells = cells
        .filter(function (data, index) {
            return (data.type === "button");
        });
    var removeCellButtons = removeCells
        .append("button");
    removeCellButtons
        .text("x");
    // TODO: Activate event listeners for the remove buttons on each row.
    // TODO: Handle the removal properly, updating the table by D3.

}

/**
 * Controls the operations for appending additional query steps to the query
 * queue and executing these steps.
 * @param {Array<Object>} queue Details for steps in the query's queue.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function controlQuery(queue, model) {

    // TODO: Enable user to remove a single step from the query queue.
    // TODO: Set complete flag to false for all steps downstream of the modification.


    // TODO: Enable user to remove all steps from the query by a reset.

    // TODO: Implement query step confirmation.
    // TODO: Only execute the entire controlQuery process if the query step is complete.
    // Confirm that the query assembly interface is complete with all necessary
    // details.
    // If not then display an error message using alert.
    confirmQueryAssembly();

    // Extract information from query assembly interface.
    var queryStepDetails = extractQueryAssemblyDetails();
    var newQueue = [].concat(queue, queryStepDetails);

    // Remove contents of query assembly interface.
    removeRadioGroupSelection(
        document
            .getElementById("query-builder")
            .getElementsByClassName("query-combination-radio")
    );
    removeRadioGroupSelection(
        document
            .getElementById("query-builder")
            .getElementsByClassName("query-type-radio")
    );
    removeChildElements(document.getElementById("query-builder-detail"));

    // Execute all steps in query and store summaries of query results for each
    // step within the queue.
    var queueResults = executeQuery(newQueue, model);
    console.log(queueResults);

    // After each execution of controlQuery in the event handler, remove the
    // previous event listener and add a new event listener with new parameters.
    activateQueryBuilderAdd(queueResults, model);

    // Append a new step element to the query queue with representations for the
    // details of the query step.
    appendQueryStep(extractQueueSummary(queueResults));

    // Visualize the network that the query produces.
    visualizeNetwork(queueResults[queueResults.length - 1].collection, model);
}

////////////////////////////////////////////////////////////////////////////////
// Temporary Scrap


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


// TODO: Keep this function for now for the sake of reference.
// TODO: Some aspects might be useful in constructing the new query interface.
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
