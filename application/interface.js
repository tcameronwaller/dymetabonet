
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
 * Creates an input element with a label.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.className Name of the class.
 * @param {string} parameters.identifier Identifier of the input element.
 * @param {string} parameters.name Name of the group.
 * @param {string} parameters.value Value for the element.
 * @param {string} parameters.text Text for the label.
 * @param {string} parameters.type Type of the input element.
 * @returns {Object} Label element with an input element.
 */
function createLabelInputElement({
    className,
    identifier,
    name,
    value,
    text,
    type
} = {}) {
    var input = document.createElement("input");
    input.setAttribute("class", className);
    input.setAttribute("id", identifier);
    input.setAttribute("name", name);
    input.setAttribute("type", type);
    input.setAttribute("value", value);
    var label = document.createElement("label");
    label.setAttribute("for", identifier);
    label.appendChild(input);
    label.appendChild(
        document.createTextNode(text)
    );
    return label;
}

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

    // Initialize and control attribute interface.
    initializeAttributeInterface(model);
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
// Attribute Interface
////////////////////////////////////////////////////////////////////////////////

/**
 * Initializes the attribute menu and attribute menu table.
 */
function initializeAttributeMenu() {
    // This function executes upon initialization of the program after assembly
    // or load of a metabolic model.

    // This function does not activate some control elements, because the
    // handlers for these control elements require data objects.

    // Create container for attribute menu.
    var attributeView = document.getElementById("attribute");
    var attributeMenu = document.createElement("div");
    attributeMenu.setAttribute("id", "attribute-menu");
    attributeView.appendChild(attributeMenu);
    // Create attribute menu table.
    var attributeMenuTable = document.createElement("table");
    attributeMenuTable.setAttribute("id", "attribute-menu-table");
    // Create header.
    var head = document.createElement("thead");
    var headRow = document.createElement("tr");
    headRow
        .appendChild(createElementWithText({text: "Attribute", type: "th"}))
        .setAttribute("class", "attribute-menu-table-column-attribute");
    // TODO: Also display the total count of reactions or metabolites... that'll be different than the total of the counts for each property.
    var summaryHead = document.createElement("th");
    summaryHead.setAttribute("class", "attribute-menu-table-column-summary");
    // Create entity selector with default value of metabolite.
    var metaboliteRadioLabel = createLabelInputElement({
        className: "attribute-menu-entity",
        identifier: "attribute-menu-entity-metabolite",
        name: "attribute-menu-entity",
        value: "metabolite",
        text: "Metabolite",
        type: "radio"
    });
    var metaboliteRadio = metaboliteRadioLabel.getElementsByTagName("input")[0];
    metaboliteRadio.setAttribute("checked", true);
    summaryHead.appendChild(metaboliteRadioLabel);
    var reactionRadioLabel = createLabelInputElement({
        className: "attribute-menu-entity",
        identifier: "attribute-menu-entity-reaction",
        name: "attribute-menu-entity",
        value: "reaction",
        text: "Reaction",
        type: "radio"
    });
    summaryHead.appendChild(reactionRadioLabel);
    // Create filter check box.
    var filterCheckLabel = createLabelInputElement({
        className: "attribute-menu-filter",
        identifier: "attribute-menu-filter",
        name: "attribute-menu-filter",
        value: "filter",
        text: "Filter",
        type: "checkbox"
    });
    summaryHead.appendChild(filterCheckLabel);
    // Create reset button.
    var resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.setAttribute("id", "attribute-menu-reset");
    summaryHead.appendChild(resetButton);
    // Append header to table.
    headRow.appendChild(summaryHead);
    head.appendChild(headRow);
    attributeMenuTable.appendChild(head);
    // Create body.
    var body = document.createElement("tbody");
    attributeMenuTable.appendChild(body);
    // Append attribute menu table to attribute menu.
    attributeMenu.appendChild(attributeMenuTable);
}

/**
 * Initializes the attribute interface.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function initializeAttributeInterface(model) {
    // This function executes upon initialization of the program after assembly
    // or load of a metabolic model.
    // Initialize attribute menu.
    // Create attribute menu.
    initializeAttributeMenu();
    // Assemble attribute index.
    // The attribute index will mediate information exchange between the views
    // for attribute menu, sets, and entities.
    var attributeIndex = createAttributeIndex(model.entities.reactions);
    console.log("attributeIndex");
    console.log(attributeIndex);
    // Create attribute summary from attribute index.
    var attributeSummary = createAttributeSummary(attributeIndex, model);
    // Initiate control of attribute menu.
    controlAttributeMenu({
        entity: "metabolite",
        filter: false,
        originalAttributeSummary: attributeSummary,
        currentAttributeIndex: attributeIndex,
        originalAttributeIndex: attributeIndex,
        model: model
    });
    // Activate reset button.
    document
        .getElementById("attribute-menu-reset")
        .addEventListener("click", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Execute operation.
            controlAttributeMenu({
                entity: "metabolite",
                filter: false,
                originalAttributeSummary: attributeSummary,
                currentAttributeIndex: attributeIndex,
                originalAttributeIndex: attributeIndex,
                model: model
            });
        });
    //testD3EventListeners([]);
}

// TODO: This works!
function testD3EventListeners(queue) {
    var submit = d3
        .select("#attribute-menu-submit");
    // Remove any existing event listeners and handlers from bars.
    submit
        .on("click", null);
    // Assign event listeners and handlers to bars.
    submit
        .on("click", function (data, index, nodes) {
            var newQueue = [].concat(queue, "a");
            console.log("queue");
            console.log(newQueue);
            testD3EventListeners(newQueue);
        });
}

/**
 * Sorts the attribute summary by magnitudes of values of attributes.
 * @param {Array<Object<string>>} attributeSummary Summary of attribute index
 * with counts of entities with each value of each attribute.
 * @returns {Array<Object<string>>} Summary of attribute index with values in
 * ascending order.
 */
function sortAttributeValueMagnitudes(attributeSummary) {
    return attributeSummary.map(function (attributeRecord) {
        return {
            attribute: attributeRecord.attribute,
            values: attributeRecord
                .values
                .slice()
                .sort(function (value1, value2) {
                    return value1.magnitude - value2.magnitude;
                })
        };
    });
}

/**
 * Counts incremental sums of magnitudes for each value of each attribute.
 * @param {Array<Object<string>>} attributeSummary Summary of attribute index
 * with counts of entities with each value of each attribute.
 * @returns {Array<Object<string>>} Summary of attribute index with incremental
 * counts.
 */
function countIncrementalEntityAttributeValues(attributeSummary) {
    return attributeSummary.map(function (attributeRecord) {
        var incrementalValues = attributeRecord
            .values
            .reduce(function (collection, record, index) {
                // Calculate incremental count.
                if (index > 0) {
                    // Current record is not the first of the collection.
                    // Increment the magnitude on the base from the previous record.
                    var base = collection[index - 1].base +
                        collection[index - 1].magnitude;
                } else {
                    // Current record is the first of the collection.
                    // Initialize the increment at zero.
                    var base = 0;
                }
                // The only value to change in the record is the base.
                var newBase = {
                    base: base
                };
                // Copy existing values in the record and introduce new value.
                var newRecord = Object.assign({}, record, newBase);
                return [].concat(collection, newRecord);
            }, []);
        // Determine total sum of counts of all values of the attribute.
        var total = incrementalValues[incrementalValues.length - 1].base +
            incrementalValues[incrementalValues.length - 1].magnitude;
        var incrementalTotalValues = incrementalValues.map(function (record) {
            var newTotal = {
                total: total
            };
            // Copy existing values in the record and introduce new value.
            var newRecord = Object.assign({}, record, newTotal);
            return newRecord;
        });
        var newValues = {
            values: incrementalTotalValues
        };
        // Copy existing values in the record and introduce new value.
        return Object.assign({}, attributeRecord, newValues);
    });
}

/**
 * Determines the magnitudes of attribute values from the counts of entities
 * with those values.
 * @param {string} entity The entity, metabolite or reaction, of the current
 * selection.
 * @param {Array<Object<string>>} attributeSummary Summary of attribute index
 * with counts of entities with each value of each attribute.
 * @returns {Array<Object<string>>} Summary of attribute index with general
 * magnitudes from counts of entities.
 */
function determineEntityValueMagnitudes(entity, attributeSummary) {
    return attributeSummary.map(function (attributeRecord) {
        // Determine magnitude according to current selection of entity.
        var magnitudeValues = attributeRecord
            .values
            .map(function (valueRecord) {
                var newMagnitude = {
                    magnitude: valueRecord[entity]
                };
                // Copy existing values in the record and introduce new value.
                return Object.assign({}, valueRecord, newMagnitude);
            });
        var newValues = {
            values: magnitudeValues
        };
        // Copy existing values in the record and introduce new value.
        return Object.assign({}, attributeRecord, newValues);
    });
}

/**
 * Prepares the attribute summary for immediate visual representation according
 * to user selection of entity.
 * @param {string} entity The entity, metabolite or reaction, of the current
 * selection.
 * @param {Array<Object<string>>} attributeSummary Summary of attribute index
 * with counts of entities with each value of each attribute.
 * @returns {Array<Object<string>>} Summary of attribute index with
 * entity-specific magnitudes, records in ascending order of magnitude,
 * incremental sums of magnitudes, and total sums of magnitudes.
 */
function prepareAttributeSummary(entity, attributeSummary) {
    // Prepare the attribute summary for visual representation.
    // Determine magnitudes for visualization from the counts of the specific
    // entity from selection.
    var attributeSummaryMagnitudes = determineEntityValueMagnitudes(
        entity, attributeSummary
    );
    // Sort attribute values by magnitudes.
    // For readability, place values with lesser magnitudes before values with
    // greater magnitudes.
    // As the sort depends on the entity selection, it is necessary to sort with
    // each update.
    var attributeSummarySort = sortAttributeValueMagnitudes(
        attributeSummaryMagnitudes
    );
    // Calculate incremental sums of magnitudes in attribute summary.
    // These sums are necessary for positions of bar stacks.
    var attributeSummaryIncrement = countIncrementalEntityAttributeValues(
        attributeSummarySort
    );
    return attributeSummaryIncrement;
}

/**
 * Activates interactive elements to specify entity for attribute menu.
 * @param {Object} parameters Destructured object of parameters.
 * @param {boolean} parameters.filter Option to represent in attribute menu only
 * those entities that pass current filters on the attribute index.
 * @param {Array<Object<string>>} parameters.originalAttributeSummary Summary of
 * attribute index with counts of entities with each value of each attribute.
 * @param {Array<Object<string>>} parameters.currentAttributeIndex Index of
 * attributes of metabolites and reactions, including only those entities that
 * pass current filters on the attribute index.
 * @param {Array<Object<string>>} parameters.originalAttributeIndex Index of
 * attributes of metabolites and reactions.
 * @param {Object<Object>>} parameters.model Information about entities and
 * relations in a metabolic model.
 */
function activateAttributeMenuEntitySelectors({
    filter,
    originalAttributeSummary,
    currentAttributeIndex,
    originalAttributeIndex,
    model
} = {}) {
    // It is necessary to restore the event listeners and handlers for the
    // entity selectors every time the parameters change.
    // Due to this iterative activation, it is necessary to remove the listeners
    // and handlers after each execution to avoid replication of listeners and
    // handlers.
    // Activate event listeners and handlers.
    var entitySelectors = document
        .getElementById("attribute-menu")
        .getElementsByClassName("attribute-menu-entity");
    Array.from(entitySelectors).forEach(function (radio) {
        radio.addEventListener("change", function handleEvent(event) {
            // Element on which the event originated is event.currentTarget.
            // Classes of this element are event.currentTarget.className.
            // Remove event listeners and handlers for all elements in the
            // group after first execution of the operation.
            // Since the selector involves multiple individual radio buttons, it
            // is necessary to remove event listeners and handlers for all of
            // these.
            // Only the current target of the event has access to the handler
            // function by name when the function's name is not in the global
            // scope.
            // An option is to declare the handler function in the global scope.
            // Another option is to clone each element, discarding all event
            // listeners and handlers.
            Array.from(entitySelectors).forEach(function (radio) {
                var oldElement = radio;
                var newElement = oldElement.cloneNode(true);
                oldElement.parentNode.replaceChild(newElement, oldElement);
            });
            // Determine entity selection.
            var entity = determineRadioGroupValue(entitySelectors);
            // Restore attribute menu with current entity selection.
            controlAttributeMenu({
                entity: entity,
                filter: filter,
                originalAttributeSummary: originalAttributeSummary,
                currentAttributeIndex: currentAttributeIndex,
                originalAttributeIndex: originalAttributeIndex,
                model: model
            });
        });
    });
}

/**
 * Activates interactive elements to specify filter for attribute menu.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.entity The entity, metabolite or reaction, of the
 * current selection.
 * @param {Array<Object<string>>} parameters.originalAttributeSummary Summary of
 * attribute index with counts of entities with each value of each attribute.
 * @param {Array<Object<string>>} parameters.currentAttributeIndex Index of
 * attributes of metabolites and reactions, including only those entities that
 * pass current filters on the attribute index.
 * @param {Array<Object<string>>} parameters.originalAttributeIndex Index of
 * attributes of metabolites and reactions.
 * @param {Object<Object>>} parameters.model Information about entities and
 * relations in a metabolic model.
 */
function activateAttributeMenuFilterSelector({
    entity,
    originalAttributeSummary,
    currentAttributeIndex,
    originalAttributeIndex,
    model
} = {}) {
    // It is necessary to restore the event listener and handler for the filter
    // selector every time the parameters change.
    // Due to this iterative activation, it is necessary to remove the listeners
    // and handlers after each execution to avoid replication of listeners and
    // handlers.
    // I think an alternative option might be to use the once option of
    // addEventListener.
    // Activate event listener and handler.
    var filterSelector = document.getElementById("attribute-menu-filter");
    filterSelector.addEventListener("change", function handleEvent(event) {
        // Element on which the event originated is event.currentTarget.
        // Determine filter selection.
        var filter = filterSelector.checked;
        // Restore attribute menu with current filter selection.
        controlAttributeMenu({
            entity: entity,
            filter: filter,
            originalAttributeSummary: originalAttributeSummary,
            currentAttributeIndex: currentAttributeIndex,
            originalAttributeIndex: originalAttributeIndex,
            model: model
        });
        // Remove event listener and handler after first execution of
        // operation.
        event.currentTarget.removeEventListener(event.type, handleEvent);
    });
}

/**
 * Creates and activates the attribute summary table for user interaction.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.entity The entity, metabolite or reaction, of the
 * current selection.
 * @param {boolean} parameters.filter Option to represent in attribute menu only
 * those entities that pass current filters on the attribute index.
 * @param {Array<Object<string>>} parameters.currentAttributeSummary Summary of
 * attribute index with counts of entities with each value of each attribute.
 * @param {Array<Object<string>>} parameters.originalAttributeSummary Summary of
 * attribute index with counts of entities with each value of each attribute.
 * @param {Array<Object<string>>} parameters.currentAttributeIndex Index of
 * attributes of metabolites and reactions, including only those entities that
 * pass current filters on the attribute index.
 * @param {Array<Object<string>>} parameters.originalAttributeIndex Index of
 * attributes of metabolites and reactions.
 * @param {Object<Object>>} parameters.model Information about entities and
 * relations in a metabolic model.
 */
function createActivateAttributeSummaryTable({
    entity,
    filter,
    currentAttributeSummary,
    originalAttributeSummary,
    currentAttributeIndex,
    originalAttributeIndex,
    model
} = {}) {

    // TODO: Attribute Summary
    // TODO: Modify data included in attribute summary.
    // TODO: Record information about selections in the attribute summary.
    // TODO: Consider current status before changing in order to toggle selection on and off.
    // TODO: Record selection at both the attribute level and the value level to facilitate subsequent parsing.

    // TODO: Filter attribute index.
    // TODO: Extract selection details from attribute summary.
    // TODO: Filter original attribute index (always) according to selection details.

    // TODO: Value Bars
    // TODO: Bars need identifiers so they are selectable.
    // TODO: Construct these identifiers from the id of the value... something like "attribute-menu-attribute-compartment" or
    // TODO: "attribute-menu-value-c"/"attribute-menu-value-cytosol"... I think use the id so that process is more concise.
    // TODO: Determine style classes of bars according to their selection status in the attribute summary.

    // TODO: Attribute Search
    // TODO: Upon selection of attribute headers, create auto-complete search fields.

    // TODO: I need to initialize the classes of all rects with each run of createAttributeSummaryTable.
    // TODO: ... yeah, I think that'll be necessary.


    // Parameters
    // While entity and filter parameters are no longer necessary to create the
    // attribute menu table, it is necessary to pass the current values of these
    // parameters to restore the attribute menu.
    // Create the table on the basis of the current attribute summary.
    // Record information from user selection within the original attribute
    // summary.

    console.log("currentAttributeSummary within create table");
    console.log(currentAttributeSummary);

    // Select body of attribute menu table.
    var body = d3
        .select("#attribute-menu-table")
        .select("tbody");
    // Append rows to table.
    var rows = body.selectAll("tr").data(currentAttributeSummary);
    rows.exit().remove();
    var newRows = rows.enter().append("tr");
    rows = newRows.merge(rows);
    // Append cells to table.
    var cells = rows.selectAll("td").data(function (element, index) {
        // Organize data for table columns.
        return [].concat(
            {
                type: "attribute",
                value: element.attribute
            },
            {
                type: "summary",
                value: element.values
            }
        );
    });
    cells.exit().remove();
    var newCells = cells.enter().append("td");
    cells = newCells.merge(cells);
    // Assign attributes to cells in attribute column.
    var attributeCells = cells
        .filter(function (data, index) {
            return data.type === "attribute";
        });
    attributeCells
        .attr("id", function (data, index) {
            console.log("data within attributeCells");
            console.log(data);
            var attribute = data.attribute;
            return "attribute-menu-attribute-" + attribute;
        })
        .classed("attribute-menu-table-cells-column-attribute", true)
        .text(function (data) {
            return data.value;
        });
    // Assign attributes to cells in summary column.
    var summaryCells = cells
        .filter(function (data, index) {
            return data.type === "summary";
        });
    summaryCells
        .classed("attribute-menu-table-cells-column-summary", true);
    // Append graphical containers in cells in summary column.
    // The graphical containers need access to the same data as their parent
    // cells without any transformation.
    // Append graphical containers to the enter selection to avoid replication
    // of these containers upon restorations to the table.
    var summaryCellGraphs = summaryCells
        .selectAll("svg")
        .data(function (element, index) {
            return [element];
        });
    summaryCellGraphs.exit().remove();
    var newSummaryCellGraphs = summaryCellGraphs.enter().append("svg");
    summaryCellGraphs = newSummaryCellGraphs.merge(summaryCellGraphs);
    summaryCellGraphs
        .attr("class", "attribute-menu-table-cell-graph");
    // Determine the width of graphical containers.
    var graphWidth = parseFloat(
        window.getComputedStyle(
            document.getElementsByClassName("attribute-menu-table-cell-graph")
                .item(0)
        )
            .width
            .replace("px", "")
    );
    // Append rectangles to graphical containers in summary column.
    var summaryCellBars = summaryCellGraphs
        .selectAll("rect")
        .data(function (element, index) {
            // Organize data for rectangles.
            return element.value;
        });
    summaryCellBars.exit().remove();
    var newSummaryCellBars = summaryCellBars.enter().append("rect");
    summaryCellBars = newSummaryCellBars.merge(summaryCellBars);
    // Assign attributes to rectangles.
    summaryCellBars
        .attr("id", function (data, index) {
            return "attribute-menu-attribute-" +
                data.attribute +
                "-value-" +
                data.identifier;
        })
        .classed("attribute-menu-attribute-value-bar", true)
        .classed(
            "attribute-menu-attribute-value-bar-selection",
            function (data, index) {
                return data.selection;
            }
            )
        .attr("title", function (data, index) {
            return data.value;
        });
    // Assign position and dimension to rectangles.
    summaryCellBars
        .attr("x", function (data, index) {
            // Determine scale according to attribute total.
            var scale = d3
                .scaleLinear()
                .domain([0, data.total])
                .range([0, graphWidth]);
            return scale(data.base);
        })
        .attr("width", function (data, index) {
            // Determine scale according to attribute total.
            var scale = d3
                .scaleLinear()
                .domain([0, data.total])
                .range([0, graphWidth]);
            return scale(data.magnitude);
        });
    // TODO: I think that the event handling should be in another function.
    // TODO: I'll need to re-call this function after every interaction (so that the filter queue updates properly).
    // Remove any existing event listeners and handlers from bars.
    summaryCellBars
        .on("click", null);
    // Assign event listeners and handlers to bars.
    summaryCellBars
        .on("click", function (data, index, nodes) {
            // TODO: Create newAttributeSummary with indicator of the new selection.
            //var newAttributeSummary =
            var attribute = data.attribute;
            var value = data.identifier;
            var selection = data.selection;
            console.log("selection");
            console.log(attribute);
            console.log(value);
            console.log(selection);
            // Record new selection in attribute summary.
            selectAttributeMenu({
                value: value,
                attribute: attribute,
                attributeSummary: originalAttributeSummary
            });

            // TODO: Compose function to copy the entire originalAttributeSummary but indicate selection of the specific
            // TODO: attribute and value.

            //originalAttributeSummary[attribute]

            //var newFilterQueue = composeFilterQueue(
            //    value, attribute, filterQueue
            //);
            //console.log("filter queue");
            //console.log(newFilterQueue);
            //controlAttributeTable(newFilterQueue, entity, attributeSummary);
        });
}

/**
 * Selects a single value of an attribute and returns a deep copy of the
 * remainder of the attribute summary.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.value The identifier of a value of an attribute of
 * the current selection.
 * @param {string} parameters.attribute The attribute of the current selection.
 * @param {Array<Object<string>>} parameters.attributeSummary Summary of
 * attribute index with counts of entities with each value of each attribute.
 */
function selectAttributeMenu({value, attribute, attributeSummary} = {}) {
    return attributeSummary.map(function (attributeRecord) {
        // Change the selection statuses of the attribute and the value of the
        // current selection in the new version of the attribute summary.
        if (!attributeRecord.attribute === attribute) {
            // Current attribute record does not match the attribute of the
            // current selection.
            // Copy the attribute record and records for all of its values.
            var attributeValues = attributeRecord
                .values
                .map(function (valueRecord) {
                    // Copy existing values in the record.
                    return Object.assign({}, valueRecord);
                });
            var newRecord = {
                values: attributeValues
            };
            // Copy existing values in the record and introduce new value.
            return Object.assign({}, attributeRecord, newRecord);
        } else {
            // Current attribute record matches the attribute of the current
            // selection.
            // Copy the value records of the attribute, changing the selection
            // status of the value that matches the current selection.
            var attributeValues = attributeRecord
                .values
                .map(function (valueRecord) {
                    // Change the selection status of the value of the current
                    // selection.
                    if (!valueRecord.identifier === value) {
                        // Current value record does not match the value of the
                        // current selection.
                        // Copy existing values in the record.
                        return Object.assign({}, valueRecord);
                    } else {
                        // Current value record matches the value of the current
                        // selection.
                        if (!valueRecord.selection) {
                            // Status of old selection is false.
                            var selection = true;
                        } else {
                            // Status of old selection is true.
                            var selection = false;
                        }
                        var newSelection = {
                            selection: selection
                        };
                        // Copy existing values in the record and introduce new
                        // value.
                        var newRecord = Object
                            .assign({}, valueRecord, newSelection);
                        return newRecord;
                    }
                });
            // Copy the attribute record, changing its selection status if
            // appropriate.
            // The selection status of the attribute record is true if any of
            // its values have a selection status of true.
            // TODO: The selection status of the attribute record is more complex...
            // TODO: Attribute record needs a true selection status if any of its values have a true selection status.
            // TODO: Use an array.any? probably to check all values in the attribute.
            // Current attribute record matches the attribute of the current
            // selection.
            // Change the selection status of the attribute.
            if (!attributeRecord.selection) {
                // Status of selection in the old record is false.
                var attributeSelection
            }
            var newRecord = {
                values: attributeValues
            };
            // Copy existing values in the record and introduce new value.
            return Object.assign({}, attributeRecord, newRecord);

        }
    };
}

/**
 * Controls the attribute menu with user interaction.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.entity The entity, metabolite or reaction, of the
 * current selection.
 * @param {boolean} parameters.filter Option to represent in attribute menu only
 * those entities that pass current filters on the attribute index.
 * @param {Array<Object<string>>} parameters.originalAttributeSummary Summary of
 * attribute index with counts of entities with each value of each attribute.
 * @param {Array<Object<string>>} parameters.currentAttributeIndex Index of
 * attributes of metabolites and reactions, including only those entities that
 * pass current filters on the attribute index.
 * @param {Array<Object<string>>} parameters.originalAttributeIndex Index of
 * attributes of metabolites and reactions.
 * @param {Object<Object>>} parameters.model Information about entities and
 * relations in a metabolic model.
 */
function controlAttributeMenu({
        entity,
        filter,
        originalAttributeSummary,
        currentAttributeIndex,
        originalAttributeIndex,
        model
    } = {}) {

    console.log("called controlAttributeMenu");
    console.log("originalAttributeSummary within control menu");
    console.log(originalAttributeSummary);
    // Execution
    // This function executes upon initialization of the program after assembly
    // or load of a metabolic model, upon change to entity selection, upon
    // change to filter selection, upon selection of a value from the attribute
    // menu, and upon reset of the attribute menu.
    // Parameters
    // The original attribute index specifies the attributes of all metabolites
    // and reactions in the metabolic model.
    // The original attribute summary is always a comprehensive summary of the
    // original attribute index.
    // The original attribute summary also stores information about all user
    // selections from the attribute menu.
    // The current attribute index includes only those records from the original
    // attribute index that pass filters of current selections.
    // The current attribute index passes information from selections in the
    // attribute menu to other views.
    // If the filter option is true, then the attribute menu only represents
    // entities from the current attribute index.
    // The current attribute summary is a summary of the current attribute
    // index.
    // Procedure
    // Prepare attribute summary according to selection of filter option.
    if (!filter) {
        // The filter selection is to represent in the attribute menu all
        // entities, regardless of whether or not they pass current filters on the
        // attribute index.
        var currentAttributeSummary = originalAttributeSummary;
    } else {
        // The filter selection is to represent in the attribute menu only those
        // entities that pass current filters on the attribute index.
        var currentAttributeSummary = createAttributeSummary(
            currentAttributeIndex, model
        );
    }
    // Prepare attribute summary for visualization according to the current
    // entity selection.
    var readyAttributeSummary = prepareAttributeSummary(
        entity, currentAttributeSummary
    );
    // Create visual representation of attribute summary.
    createActivateAttributeSummaryTable({
        entity: entity,
        filter: filter,
        currentAttributeSummary: readyAttributeSummary,
        originalAttributeSummary: originalAttributeSummary,
        currentAttributeIndex: currentAttributeIndex,
        originalAttributeIndex: originalAttributeIndex,
        model: model
    });
    // Activate entity selector.
    activateAttributeMenuEntitySelectors({
        filter: filter,
        originalAttributeSummary: originalAttributeSummary,
        currentAttributeIndex: currentAttributeIndex,
        originalAttributeIndex: originalAttributeIndex,
        model: model
    });
    // Activate filter selector.
    activateAttributeMenuFilterSelector({
        entity: entity,
        originalAttributeSummary: originalAttributeSummary,
        currentAttributeIndex: currentAttributeIndex,
        originalAttributeIndex: originalAttributeIndex,
        model: model
    });
}










////////////////////////////////////////////////////////////////////////////////
// Scrap?



/**
 * Prepares the attribute summary for immediate visual representation according
 * to user selection of entity.
 * @param {string} entity The entity, metabolite or reaction, of the current
 * selection.
 * @param {Array<Object<string>>} filterQueue Queue of filters to apply to the
 * attribute index.
 * @returns {Array<Object<string>>} Queue of filters to apply to the attribute
 * index.
 */
function composeFilterQueue(value, attribute, filterQueue) {
    var selection = "temporary...";
    var newFilter = {
        attribute: attribute,
        selection: selection,
        value: value
    };
    var newFilterQueue = [].concat(filterQueue, newFilter);
    return newFilterQueue;
}


// TODO: Make the name of this function more specific to what it does.
// TODO: Consider a name like controlAttributeSelection.
/**
 * Controls the attribute table recursively with user interaction.
 * @param {Array<Object<string>>} filterQueue Queue of filters to apply to the
 * attribute index.
 * @param {string} entity The entity, metabolite or reaction, of the current
 * selection.
 * @param {Array<Object<string>>} attributeSummary Summary of attribute index
 * with counts of entities with each value of each attribute.
 */
function controlAttributeTable(filterQueue, entity, attributeSummary) {

    // This function executes upon initial program execution, upon a change to
    // the selection of entity, and upon a change to the attribute index and
    // attribute summary.
    // The purpose of this function is to support iterative user interaction to
    // select values of attributes from the attribute menu.
    // These selections compose the filter queue.


    // TODO: Append rectangles for each value of the data.
    // TODO: Format rectangles according to data... I'll need to set both x positions and widths.


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


    // TODO: Activate the submit button with the current version of the filterQueue.
    // TODO: The submit button should call a separate filter function that then calls controlAttributeMenu with the new attribute index.
    // TODO: I'm not sure it'll work to return the filterQueue from this function directly.


}









////////////////////////////////////////////////////////////////////////////////
// Query Interface
////////////////////////////////////////////////////////////////////////////////

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
