/**
 * Interface to select file, check and extract information about metabolic
 * entities and sets, and restore application's state.
 */
class SourceView {
    /**
     * Initializes an instance of the class.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    constructor(model) {
        // Reference current instance of class to transfer across changes in
        // scope.
        var self = this;
        // Reference model of application's state.
        self.model = model;
        // Reference document object model.
        self.document = document;
        // Select view in document object model.
        self.view = self.document.getElementById("view");
        // Remove any extraneous content within view.
        General.filterRemoveDocumentElements({
            values: ["source"],
            attribute: "id",
            elements: self.view.children
        });
        // Create container for interface within view.
        if (!self.document.getElementById("source")) {
            self.container = self.document.createElement("div");
            self.container.setAttribute("id", "source");
            self.view.appendChild(self.container);
        } else {
            self.container = self.document.getElementById("source");
        }
        // Remove all contents of container.
        General.removeDocumentChildren(self.container);
        //
        // Display current selection of file.
        if (!self.determineFile()) {
            // Application does not have a current selection of file.
            self.fileName = "Please select a file.";
        } else {
            // Application has a current file selection.
            self.fileName = self.model.file.name;
        }
        self.fileLabel = self.document.createElement("span");
        self.fileLabel.textContent = self.fileName;
        self.container.appendChild(self.fileLabel);
        self.container.appendChild(self.document.createElement("br"));
        // Create and activate file selector.
        // File selector needs to be accessible always to change selection of
        // file.
        //if (!self.container.querySelector("input")) {}
        self.selector = self.document.createElement("input");
        self.selector.setAttribute("type", "file");
        self.selector.addEventListener("change", function (event) {
            // Element on which the event originated is event.currentTarget.
            Action.submitFile(event.currentTarget.files[0], self.model);
        });
        self.container.appendChild(self.selector);
        // Display a facade, any element, to control the file selector.
        // Alternatively use a label that references the file selector.
        self.facade = self.document.createElement("button");
        self.facade.textContent = "Select";
        self.facade.addEventListener("click", function (event) {
            // Element on which the event originated is event.currentTarget.
            self.selector.click();
        });
        self.container.appendChild(self.facade);
        self.container.appendChild(self.document.createElement("br"));
        // Create and activate interface controls according to file selection.
        if (self.determineFile()) {
            // Application state has a current file selection.
            // Create and activate button to check and clean a raw model of
            // metabolism.
            self.clean = self.document.createElement("button");
            self.clean.textContent = "Clean";
            self.clean.addEventListener("click", function (event) {
                // Element on which the event originated is event.currentTarget.
                // Check and clean a raw model of metabolism.
                Action.loadCheckMetabolicEntitiesSets(self.model);
            });
            self.container.appendChild(self.clean);
            //self.container.appendChild(self.document.createElement("br"));
            // Create and activate button to extract information about metabolic
            // entities and sets from a raw model of metabolism.
            self.extractor = self.document.createElement("button");
            self.extractor.textContent = "Extract";
            self.extractor.addEventListener("click", function (event) {
                // Element on which the event originated is event.currentTarget.
                // Extract information about metabolic entities and sets from a
                // clean model of metabolism and use this information to
                // initialize the application.
                Action.loadExtractInitializeMetabolicEntitiesSets(self.model);
            });
            self.container.appendChild(self.extractor);
            //self.container.appendChild(self.document.createElement("br"));
            // Create and activate button to restore application to a state from
            // a persistent representation.
            self.restoration = self.document.createElement("button");
            self.restoration.textContent = "Restore";
            self.restoration.addEventListener("click", function (event) {
                // Element on which the event originated is event.currentTarget.
                // Restore state from persistent representation.
                Action.loadRestoreState(self.model);
            });
            self.container.appendChild(self.restoration);
            //self.container.appendChild(self.document.createElement("br"));
        }
    }
    /**
     * Determines whether or not the application's state has information about a
     * file.
     */
    determineFile() {
        return this.model.file;
    }
}

/**
 * Interface to save and restore a persistent state of the application.
 */
class PersistenceView {
    /**
     * Initializes an instance of the class.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    constructor (model) {
        // Reference current instance of class to transfer across changes in
        // scope.
        var self = this;
        // Reference model of application's state.
        self.model = model;
        // Reference document object model.
        self.document = document;
        // Select view in document object model.
        self.view = self.document.getElementById("view");
        // Remove any extraneous content within view.
        General.filterRemoveDocumentElements({
            values: ["top", "bottom"],
            attribute: "id",
            elements: self.view.children
        });
        // Create container for interfaces within top of view.
        if (!self.document.getElementById("top")) {
            self.top = self.document.createElement("div");
            self.top.setAttribute("id", "top");
            self.view.appendChild(self.top);
        } else {
            self.top = self.document.getElementById("top");
        }
        // Remove any extraneous content within top.
        General.filterRemoveDocumentElements({
            values: ["persistence", "set"],
            attribute: "id",
            elements: self.top.children
        });
        // Create container for interface within top.
        if (!self.document.getElementById("persistence")) {
            self.container = self.document.createElement("div");
            self.container.setAttribute("id", "persistence");
            self.top.appendChild(self.container);
        } else {
            self.container = self.document.getElementById("persistence");
        }
        // Remove all contents of container.
        General.removeDocumentChildren(self.container);
        //
        // Create and activate button to restore application to initial state.
        self.restoration = self.document.createElement("button");
        self.container.appendChild(self.restoration);
        self.restoration.textContent = "Restore";
        self.restoration.addEventListener("click", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Restore application to initial state.
            Action.initializeApplication(self.model);
        });
        self.container.appendChild(self.document.createElement("br"));
        // Create and activate button to save current state of application.
        self.save = self.document.createElement("button");
        self.container.appendChild(self.save);
        self.save.textContent = "Save";
        self.save.addEventListener("click", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Save current state of application.
            Action.saveState(self.model);
        });
        //self.container.appendChild(self.document.createElement("br"));
    }
}

/**
 * Interface to represent summary of sets of metabolic entities and to select
 * filters for these entities.
 */
class SetView {
    /**
     * Initializes an instance of the class.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    constructor (model) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = this;
        // Set reference to model of application's state.
        self.model = model;
        // Set reference to document object model (DOM).
        self.document = document;
        // Initialize container for interface.
        self.initializeContainer(self);
        // Create aspects of interface that do not depend on data.
        // Initialize table for summary of sets' cardinalities.
        self.initializeSummaryTable(self);
        // Restore the table for summary of sets' cardinalitites.
        self.restoreSummaryTable(self);

        console.log("new SetView");
        console.log(self.model.valuesSelections);
        console.log(self.model.currentEntitiesAttributes);
        console.log(self.model.setsSummary);
    }
    /**
     * Initializes the container for the interface.
     * @param {Object} setView Instance of set view interface.
     */
    initializeContainer(setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;
        // Create and set references to elements for interface.
        // Select view in document object model.
        self.view = self.document.getElementById("view");
        // Remove any extraneous content within view.
        // Initialization of the persistence view already removes extraneous
        // content from view.
        General.filterRemoveDocumentElements({
            values: ["top", "bottom"],
            attribute: "id",
            elements: self.view.children
        });
        // Create container for interfaces within top of view.
        // Initialization of the persistence view already creates the top
        // container.
        if (!self.document.getElementById("top")) {
            self.top = self.document.createElement("div");
            self.top.setAttribute("id", "top");
            self.view.appendChild(self.top);
        } else {
            self.top = self.document.getElementById("top");
        }
        // Remove any extraneous content within top.
        General.filterRemoveDocumentElements({
            values: ["persistence", "set"],
            attribute: "id",
            elements: self.top.children
        });
        // Create container for interface within top.
        // Set reference to current interface's container.
        if (!self.document.getElementById("set")) {
            self.container = self.document.createElement("div");
            self.container.setAttribute("id", "set");
            self.top.appendChild(self.container);
        } else {
            self.container = self.document.getElementById("set");
        }
    }
    /**
     * Initializes the table to summarize sets' cardinalities.
     * Creates new elements that do not exist and do not vary with data.
     * Sets references to elements that already exist.
     * @param {Object} setView Instance of set view interface.
     */
    initializeSummaryTable(setView) {
        // As their actions do not change and they have access to the dynamic
        // model, it is only necessary to define event handlers upon initiation
        // of control elements.
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;
        // Create and set references to elements for interface.
        // Initialize table.
        // Set references to table, table's head, table's head value cell,
        // entity selectors, filter selector, and table's body.
        if (!self.container.getElementsByTagName("table").item(0)) {
            // Interface's container does not include a table element.
            // Create table.
            self.table = self.document.createElement("table");
            self.container.appendChild(self.table);
            // Create table's header.
            self.tableHead = self.document.createElement("thead");
            self.table.appendChild(self.tableHead);
            var tableHeadRow = self.document.createElement("tr");
            self.tableHead.appendChild(tableHeadRow);
            var tableHeadRowCellAttribute = self.document.createElement("th");
            tableHeadRow.appendChild(tableHeadRowCellAttribute);
            tableHeadRowCellAttribute.textContent = "Attribute";
            tableHeadRowCellAttribute.classList.add("attribute");
            self.tableHeadRowCellValue = self.document.createElement("th");
            tableHeadRow.appendChild(self.tableHeadRowCellValue);
            self.tableHeadRowCellValue.classList.add("value");
            // Create and activate entity selector.
            self.createActivateEntitySelector("metabolite", self);
            self.createActivateEntitySelector("reaction", self);
            // Create and activate filter selector.
            self.createActivateFilterSelector(self);
            // Create and activate reset button.
            self.createActivateReset(self);
            // Create table's body.
            self.tableBody = self.document.createElement("tbody");
            self.table.appendChild(self.tableBody);
        } else {
            // Interface's container includes a table element.
            // Establish references to existing elements.
            // References are only necessary for elements that depend on the
            // application's state.
            self.table = self.container.getElementsByTagName("table").item(0);
            self.tableHead = self
                .container.getElementsByTagName("thead").item(0);
            self.tableHead = self
                .container.getElementsByTagName("thead").item(0);
            var tableHeadRow = self
                .tableHead.getElementsByTagName("tr").item(0);
            self.tableHeadRowCellValue = tableHeadRow
                .getElementsByClassName("value").item(0);
            self.metaboliteSelector = self
                .document.getElementById("sets-summary-entity-metabolite");
            self.reactionSelector = self
                .document.getElementById("sets-summary-entity-reaction");
            self.filterSelector = self
                .document.getElementById("sets-summary-filter");
            self.tableBody = self
                .container.getElementsByTagName("tbody").item(0);
        }
    }
    /**
     * Creates and activates selectors for the type of entity in the set view.
     * @param {string} entity Type of entity, metabolite or reaction, for which
     * to create and activate selector.
     * @param {Object} setView Instance of set view interface.
     */
    createActivateEntitySelector(entity, setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;
        // Create entity selector.
        var entitySelector = entity + "Selector";
        var identifier = "sets-summary-entity-" + entity;
        self[entitySelector] = self.document.createElement("input");
        self.tableHeadRowCellValue.appendChild(self[entitySelector]);
        self[entitySelector].setAttribute("id", identifier);
        self[entitySelector].setAttribute("type", "radio");
        self[entitySelector].setAttribute("value", entity);
        self[entitySelector].setAttribute("name", "entity");
        self[entitySelector].classList.add("entity");
        self[entitySelector].addEventListener("change", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Change current selection of entity in application's state.
            //var radios = self
            //    .tableHeadRowCellValue.getElementsByClassName("entity");
            //var value = General.determineRadioGroupValue(radios);
            //Action.submitSetViewEntity(value, self.model);
            Action.changeSetsSummaryEntity(self.model);
        });
        var entityLabel = self.document.createElement("label");
        self.tableHeadRowCellValue.appendChild(entityLabel);
        entityLabel.setAttribute("for", identifier);
        entityLabel.textContent = entity;
    }
    /**
     * Creates and activates selector for filter in the set view.
     * @param {Object} setView Instance of set view interface.
     */
    createActivateFilterSelector(setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;
        // Create and activate filter selector.
        var identifier = "sets-summary-filter";
        self.filterSelector = self.document.createElement("input");
        self.tableHeadRowCellValue.appendChild(self.filterSelector);
        self.filterSelector.setAttribute("id", identifier);
        self.filterSelector.setAttribute("type", "checkbox");
        self.filterSelector.setAttribute("value", "filter");
        self.filterSelector.classList.add("filter");
        self.filterSelector.addEventListener("change", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Change current selection of filter in application's state.
            Action.changeSetsSummaryFilter(self.model);
        });
        var filterLabel = self.document.createElement("label");
        self.tableHeadRowCellValue.appendChild(filterLabel);
        filterLabel.setAttribute("for", identifier);
        filterLabel.textContent = "filter";
    }
    /**
     * Creates and activates button to reset sets' summary for set view.
     * @param {Object} setView Instance of set view interface.
     */
    createActivateReset(setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;
        // Create and activate button to restore application to initial state.
        self.reset = self.document.createElement("button");
        self.tableHeadRowCellValue.appendChild(self.reset);
        self.reset.textContent = "reset";
        self.reset.addEventListener("click", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Restore sets' summary to initial state.
            Action.restoreSetsSummary(self.model);
        });
    }
    /**
     * Restores the table to summarize sets' cardinalities.
     * @param {Object} setView Instance of set view interface.
     */
    restoreSummaryTable(setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;
        // Update entity selector according to application's state.
        self.metaboliteSelector.checked = self
            .determineEntityMatch("metabolite", self);
        self.reactionSelector.checked = self
            .determineEntityMatch("reaction", self);
        // Update filter selector according to application's state.
        self.filterSelector.checked = self.determineFilter(self);

        // TODO: Create table elements for set cardinalities according to current set cardinalitites in application state...
        // TODO: At first, just re-create the table every time... probably not too much of a problem, especially with D3.

        // Create and activate data-dependent set's summary in summary table.
        self.createActivateSummaryBody(self);
    }
    /**
     * Creates and activates body of summary table.
     * @param {Object} setView Instance of set view interface.
     */
    createActivateSummaryBody(setView) {

        // TODO: Attribute Search Menu
        // TODO: Fix width of attribute headers so they don't change when attribute search menus appear.
        // TODO: Handle text overflow of options in search menu.
        // TODO: Handle scrolling through options in search menu.
        // TODO: Include some indicator of selection status in options in search menu.

        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;
        // Select summary table's body.
        var body = d3.select(self.tableBody);
        // Append rows to table with association to data.
        var dataRows = body.selectAll("tr").data(self.model.setsSummary);
        dataRows.exit().remove();
        var newRows = dataRows.enter().append("tr");
        var rows = newRows.merge(dataRows);
        // Append cells to table with association to data.
        var dataCells = rows.selectAll("td").data(function (element, index) {
            // Organize data for table cells in each row.
            return [].concat(
                {
                    type: "attribute",
                    attribute: element.attribute,
                    values: element.values
                },
                {
                    type: "value",
                    attribute: element.attribute,
                    values: element.values
                }
            );
        });
        dataCells.exit().remove();
        var newCells = dataCells.enter().append("td");
        var cells = newCells.merge(dataCells);

        // Cells for data's attributes.
        // Select cells for data's attributes.
        self.tableBodyCellsAttributes = cells.filter(function (data, index) {
            return data.type === "attribute";
        });
        self.createActivateSummaryBodyCellsAttributes(self);

        // Cells for data's values.
        // Select cells for data's values.
        self.tableBodyCellsValues = cells.filter(function (data, index) {
            return data.type === "value";
        });
        self.createActivateSummaryBodyCellsValues(self);
    }
    /**
     * Creates and activates cells for data's attributes in body of summary
     * table.
     * @param {Object} setView Instance of set view interface.
     */
    createActivateSummaryBodyCellsAttributes(setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;

        // Assign attributes to cells for attributes.
        self.tableBodyCellsAttributes
            .attr("id", function (data, index) {
                return "set-view-attribute-" + data.attribute;
            })
            .classed("attribute", true);

        // TODO: I should not do this...
        // TODO: Instead, I want to create search menus for anything (one at a time) with a selection flag in the model of app's state.
        // Remove search menus from any previous user interaction.
        //self.tableBodyCellsAttributes.selectAll(".search").remove();

        // Append label containers to cells for attributes.
        // These label containers need access to the same data as their parent
        // cells without any transformation.
        // Append label containers to the enter selection to avoid replication
        // of these containers upon restorations to the table.
        var dataLabels = self.tableBodyCellsAttributes
            .selectAll("div").data(function (element, index) {
                return [element];
            });
        dataLabels.exit().remove();
        var newLabels = dataLabels.enter().append("div");
        self.tableBodyCellsAttributesLabels = newLabels.merge(dataLabels);
        // Append text content to labels.
        self.tableBodyCellsAttributesLabels.text(function (data) {
            return data.attribute;
        });
        // Activate cells.
        //self.activateSummaryBodyCellsAttributes(self);
    }
    /**
     * Activates cells for data's attributes in body of summary
     * table.
     * @param {Object} setView Instance of set view interface.
     */
    activateSummaryBodyCellsAttributes(setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;

        // TODO: If the search fields change the width of the attribute menu cells, it will be necessary to redraw the menu altogether...
        // TODO: Maybe fix the width of the cells?
        // TODO: How to handle text overflow in the options for the search field?
        // Remove any existing event listeners and handlers from cells.
        self.tableBodyCellsAttributesLabels
            .on("click", null);
        // Assign event listeners and handlers to cells.
        self.tableBodyCellsAttributesLabels
            .on("click", function (data, index, nodes) {
                // Restoration of attribute menu removes search menus for attribute
                // values from any previous user interaction.
                // Also, after creation of the search menu, subsequent selection of
                // the attribute head removes it.
                // There is not a risk of replication of the search menu.
                // It is unnecessary to use D3's selectAll or data methods or enter
                // and exit selections to append and remove elements of the search
                // menu.
                // D3 append method propagates data.
                // Access data bound to selection by selection.data().
                // Select the attribute cell.
                var attributeCell = d3.select(nodes[index].parentElement);
                var attributeSearch = attributeCell.select(".search");
                // Determine whether or not the attribute head already has a search
                // menu.
                if (attributeSearch.empty()) {
                    // Attribute head does not have a search menu.
                    // Create and activate a search field.
                    // Append a search menu to the attribute cell.
                    var attributeSearch = attributeCell.append("div");
                    attributeSearch.classed("search", true);
                    // Append a data list to the search menu.
                    var attributeValueList = attributeSearch.append("datalist");
                    attributeValueList
                        .attr("id", function (data, index) {
                            return "attribute-" + data.attribute + "-values";
                        });
                    // Append options to the data list.
                    var attributeValues = attributeValueList
                        .selectAll("option")
                        .data(function (element, index) {
                            return element.values;
                        });
                    attributeValues.exit().remove();
                    var newAttributeValues = attributeValues
                        .enter()
                        .append("option");
                    attributeValues = newAttributeValues
                        .merge(attributeValues);
                    attributeValues.attr("value", function (data, index) {
                        return data.name;
                    });
                    // Append search text field to the search menu.
                    var attributeSearchField = attributeSearch.append("input");
                    attributeSearchField
                        .attr("autocomplete", "off")
                        .attr("id", function (data, index) {
                            return "attribute-" + data.attribute + "-search";
                        })
                        .attr("list", function (data, index) {
                            return "attribute-" + data.attribute + "-values";
                        })
                        .attr("type", "search");
                    // Assign event listeners and handlers to search menu.
                    // Option elements from datalist element do not report events.
                    // Respond to event on input search text field and then find
                    // relevant information from the options in the datalist.
                    attributeSearchField
                        .on("change", function (data, index, nodes) {
                            // TODO: Use the value of the input field and compare against the list options.
                            // TODO: Only perform selection event if the value of the field matches an option from the datalist.
                            // TODO: http://stackoverflow.com/questions/30022728/perform-action-when-clicking-html5-datalist-option
                            // Assume that each attribute value has a unique name.
                            var selection = nodes[index].value;
                            var attributeValues = d3
                                .select(nodes[index].list)
                                .selectAll("option");
                            var attributeValue = attributeValues
                                .filter(function (data, index) {
                                    return data.name === selection;
                                });
                            if (!attributeValue.empty()) {
                                controlAttributeMenuSelection({
                                    value: attributeValue.data()[0].identifier,
                                    attribute: attributeValue.data()[0].attribute,
                                    entity: entity,
                                    filter: filter,
                                    originalAttributeSummary:
                                    originalAttributeSummary,
                                    originalAttributeIndex: originalAttributeIndex,
                                    model: model
                                });
                            }
                        });
                } else {
                    // Attribute head has a search menu.
                    // Remove the search menu.
                    attributeSearch.remove();
                }
            });
    }
    /**
     * Creates and activates cells for data's values in body of summary table.
     * @param {Object} setView Instance of set view interface.
     */
    createActivateSummaryBodyCellsValues(setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;

        // TODO: Format bars according to their selection status in the model of app state.
        // TODO: Use bar's attribute and value to look-up selection status in model.


        // Assign attributes to cells in value column.
        self.tableBodyCellsValues.classed("value", true);
        // Append graphical containers to cells for values.
        // The graphical containers need access to the same data as their parent
        // cells without any transformation.
        // Append graphical containers to the enter selection to avoid replication
        // of these containers upon restorations to the table.
        var dataValueCellGraphs = self.tableBodyCellsValues
            .selectAll("svg")
            .data(function (element, index) {
                return [element];
            });
        dataValueCellGraphs.exit().remove();
        var newValueCellGraphs = dataValueCellGraphs.enter().append("svg");
        var valueCellGraphs = newValueCellGraphs.merge(dataValueCellGraphs);
        valueCellGraphs.classed("graph", true);
        // Determine the width of graphical containers.
        var graphWidth = parseFloat(
            window.getComputedStyle(
                self.tableBody.getElementsByClassName("graph").item(0)
            ).width.replace("px", "")
        );
        // Append rectangles to graphical containers in cells for values.
        var dataValueCellBars = valueCellGraphs
            .selectAll("rect")
            .data(function (element, index) {
                // Organize data for rectangles.
                return element.values;
            });
        dataValueCellBars.exit().remove();
        var newValueCellBars = dataValueCellBars.enter().append("rect");
        self.tableBodyCellsValuesGraphBars = newValueCellBars
            .merge(dataValueCellBars);
        // Assign attributes to rectangles.
        self.tableBodyCellsValuesGraphBars
            .attr("id", function (data, index) {
                return "set-view-attribute-" +
                    data.attribute +
                    "-value-" +
                    data.identifier;
            })
            .classed("bar", true)
            .classed("normal", function (data, index) {
                var match = self.determineValueAttributeMatchSelections({
                    value: data.value,
                    attribute: data.attribute,
                    setView: self
                });
                return !match;
            })
            .classed("emphasis", function (data, index) {
                var match = self.determineValueAttributeMatchSelections({
                    value: data.value,
                    attribute: data.attribute,
                    setView: self
                });
                return match;
            })
            .attr("title", function (data, index) {
                return data.value;
            });
        // Assign position and dimension to rectangles.
        self.tableBodyCellsValuesGraphBars
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
                return scale(data.count);
            });
        // Activate cells for data's values.
        self.activateSummaryBodyCellsValues(self);
    }
    /**
     * Activates cells for data's values in body of summary table.
     * @param {Object} setView Instance of set view interface.
     */
    activateSummaryBodyCellsValues(setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;

        // Remove any existing event listeners and handlers from bars.
        self.tableBodyCellsValuesGraphBars
            .on("click", null);
        // Assign event listeners and handlers to bars.
        self.tableBodyCellsValuesGraphBars
            .on("click", function (data, index, nodes) {
                Action.selectSetViewValue({
                    value: data.value,
                    attribute: data.attribute,
                    model: self.model
                });
            });
    }
    /**
     * Determines whether or not the application state has a current selection
     * of entity that matches a specific type of entity.
     * @param {string} match Type of entity, metabolite or reaction, to find
     * match with entity selection in application's state.
     * @param {Object} setView Instance of set view interface.
     */
    determineEntityMatch(match, setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;
        return self.model.setsSummaryEntity === match;
    }
    /**
     * Determines the current filter selection in the application's state.
     * @param {Object} setView Instance of set view interface.
     */
    determineFilter(setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;
        return self.model.setsSummaryFilter;
    }
    /**
     * Determines whether or not a value and attribute match a current
     * selection.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.value Value of attribute of interest.
     * @param {string} parameters.attribute Attribute of interest.
     * @returns {boolean} Whether or not the value and attribute match a current
     * selection.
     */
    determineValueAttributeMatchSelections({value, attribute, setView}) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;
        // Determine whether or not current selections include a selection for
        // the attribute and value.
        var match = self
            .model
            .valuesSelections
            .find(function (selection) {
                return (
                    selection.attribute === attribute &&
                    selection.value === value
                );
            });
        if (match) {
            // Current selections include the attribute and value.
            return true;
        } else {
            // Current selections do not include the attribute and value.
            return false;
        }
    }
}

// TODO: EntityView should give information about counts of metabolites and
// TODO: reactions in current selection (pass filters from SetView).
// TODO: EntityView should display controls to define network:
// TODO: compartmentalization, replications, submit button (since it takes a while).
// TODO: Don't worry about giving any sort of warning about size threshold...
// TODO: just tell the user counts of metabolites and reactions and let user
// TODO: initiate assembly.
/**
 * Interface to control network's assembly, selection, and visual
 * representation.
 */
class AssemblyView {
    /**
     * Initializes an instance of the class.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    constructor (model) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = this;
        // Set reference to model of application's state.
        self.model = model;
        // Set reference to document object model (DOM).
        self.document = document;
        // Initialize container for interface.
        self.initializeContainer(self);
        // Initialize interface for control of network's assembly.
        self.initializeAssemblyControls(self);
        // Restore interface for control of network's assembly.
        self.restoreAssemblyControls(self);

    }
    /**
     * Initializes the container for the interface.
     * @param {Object} view Instance of interface's current view.
     */
    initializeContainer(view) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = view;
        // Create and set references to elements for interface.
        // Select view in document object model.
        self.view = self.document.getElementById("view");
        // Remove any extraneous content within view.
        // Initialization of the persistence view already removes extraneous
        // content from view.
        General.filterRemoveDocumentElements({
            values: ["top", "bottom"],
            attribute: "id",
            elements: self.view.children
        });
        // Create container for interfaces within bottom of view.
        if (!self.document.getElementById("bottom")) {
            self.bottom = self.document.createElement("div");
            self.view.appendChild(self.bottom);
            self.bottom.setAttribute("id", "bottom");
        } else {
            self.bottom = self.document.getElementById("bottom");
        }
        // Remove any extraneous content within bottom.
        General.filterRemoveDocumentElements({
            values: ["control", "topology"],
            attribute: "id",
            elements: self.bottom.children
        });
        // Create container for interfaces that control network's assembly and
        // visual representation.
        if (!self.document.getElementById("control")) {
            self.control = self.document.createElement("div");
            self.bottom.appendChild(self.control);
            self.control.setAttribute("id", "control");
        } else {
            self.control = self.document.getElementById("control");
        }
        // Remove any extraneous content within control view.
        General.filterRemoveDocumentElements({
            values: ["assembly", "traversal"],
            attribute: "id",
            elements: self.control.children
        });
        // Create container for interface within control view.
        // Set reference to current interface's container.
        if (!self.document.getElementById("assembly")) {
            self.container = self.document.createElement("div");
            self.control.appendChild(self.container);
            self.container.setAttribute("id", "assembly");
        } else {
            self.container = self.document.getElementById("assembly");
        }
    }
    /**
     * Initializes the interface for control of network's assembly.
     * Creates new elements that do not exist and do not vary with data.
     * Sets references to elements that already exist.
     * @param {Object} view Instance of interface's current view.
     */
    initializeAssemblyControls(view) {
        // As their actions do not change and they have access to the dynamic
        // model, it is only necessary to define event handlers upon initiation
        // of control elements.
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = view;
        // Create and set references to elements for interface.
        // Initialize interface.
        if (!self.document.getElementById("assembly").hasChildNodes()) {
            // Interface's container does not include child elements for control
            // of network's assembly.
            // Create interface.
            // Create and activate reset button.
            self.createActivateReset(self);
            // Create and activate assemble button.
            self.createActivateAssemble(self);
            self.container.appendChild(self.document.createElement("br"));
            // Create and activate compartmentalization selector.
            self.createActivateCompartmentalizationSelector(self);
            self.container.appendChild(self.document.createElement("br"));
            // Create and activate list of replications.
            // Temporarily make the list viewable constantly.
            self.replication = self.document.createElement("div");
            self.container.appendChild(self.replication);
            self.replication.setAttribute("id", "replication");
            // Create table.
            var table = self.document.createElement("table");
            self.replication.appendChild(table);
            // Create table's header.
            var tableHead = self.document.createElement("thead");
            table.appendChild(tableHead);
            var tableHeadRow = self.document.createElement("tr");
            tableHead.appendChild(tableHeadRow);
            var tableHeadRowCellName = self.document.createElement("th");
            tableHeadRow.appendChild(tableHeadRowCellName);
            tableHeadRowCellName.textContent = "Name";
            var tableHeadRowCellRemove = self.document.createElement("th");
            tableHeadRow.appendChild(tableHeadRowCellRemove);
            tableHeadRowCellRemove.textContent = "Remove";
            // Create table's body.
            self.replicationTableBody = self.document.createElement("tbody");
            table.appendChild(self.replicationTableBody);
        } else {
            // Interface's container includes interface for control of network's
            // assembly.
            // Establish references to existing elements.
            // References are only necessary for elements that depend on the
            // application's state.
            self.compartmentalizationSelector = self
                .document.getElementById("compartmentalization");
            self.replication = self
                .document.getElementById("replication");
            self.replicationTableBody = self
                .replication.getElementsByTagName("tbody").item(0);
        }
    }
    /**
     * Creates and activates button to restore controls for network's assembly
     * to initial state.
     * @param {Object} view Instance of interface's current view.
     */
    createActivateReset(view) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = view;
        // Create and activate button to restore controls for network's assembly
        // to initial state.
        self.reset = self.document.createElement("button");
        self.container.appendChild(self.reset);
        self.reset.textContent = "reset";
        self.reset.addEventListener("click", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Restore controls for network's assembly to initial state.
            Action.restoreNetworkAssembly(self.model);
        });
    }
    /**
     * Creates and activates button to assemble network's nodes and links for
     * entity view.
     * @param {Object} view Instance of interface's current view.
     */
    createActivateAssemble(view) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = view;
        // Create and activate button to assemble network's nodes and links.
        self.assemble = self.document.createElement("button");
        self.container.appendChild(self.assemble);
        self.assemble.textContent = "assemble";
        self.assemble.addEventListener("click", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Assemble network's nodes and links.
            Action.createNetwork(self.model);
        });
    }
    /**
     * Creates and activates selector for compartmentalization in the network's
     * assembly.
     * @param {Object} view Instance of interface's current view.
     */
    createActivateCompartmentalizationSelector(view) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = view;
        // Create and activate compartmentalization selector.
        var identifier = "compartmentalization";
        self.compartmentalizationSelector = self
            .document.createElement("input");
        self.container.appendChild(self.compartmentalizationSelector);
        self.compartmentalizationSelector.setAttribute("id", identifier);
        self.compartmentalizationSelector.setAttribute("type", "checkbox");
        self
            .compartmentalizationSelector
            .setAttribute("value", "compartmentalization");
        self
            .compartmentalizationSelector
            .addEventListener("change", function (event) {
                // Element on which the event originated is event.currentTarget.
                // Change current selection of compartmentalization in
                // application's state.
                Action.changeCompartmentalization(self.model);
            });
        var label = self.document.createElement("label");
        self.container.appendChild(label);
        label.setAttribute("for", identifier);
        label.textContent = "compartmentalization";
    }
    /**
     * Restores the interface for control of network's assembly.
     * @param {Object} view Instance of interface's current view.
     */
    restoreAssemblyControls(view) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = view;
        // Restore compartmentalization selector according to application's
        // state.
        self.compartmentalizationSelector.checked = self
            .determineCompartmentalization(self);
        // Create and activate data-dependent summary of replications.
        self.createActivateReplicationsSummary(self);
    }
    /**
     * Creates and activates body of table for replications' summary.
     * @param {Object} view Instance of interface's current view.
     */
    createActivateReplicationsSummary(view) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = view;
        // Select summary table's body.
        var body = d3.select(self.replicationTableBody);
        // Append rows to table with association to data.
        var dataRows = body.selectAll("tr").data(self.model.replications);
        dataRows.exit().remove();
        var newRows = dataRows.enter().append("tr");
        var rows = newRows.merge(dataRows);
        // Append cells to table with association to data.
        var dataCells = rows.selectAll("td").data(function (element, index) {
            // Organize data for table cells in each row.
            return [].concat(
                {
                    type: "name",
                    value: element
                },
                {
                    type: "removal",
                    values: element
                }
            );
        });
        dataCells.exit().remove();
        var newCells = dataCells.enter().append("td");
        var cells = newCells.merge(dataCells);
        self.replicationsTableBodyCells = cells;

        // Cells for data's name.
        self.createReplicationsSummaryNames(self);

        // Cells for data's values.
        // Select cells for data's values.
        self.replicationTableBodyCellsRemovals = cells
            .filter(function (data, index) {
                return data.type === "removal";
            });
        //self.createActivateReplicationsSummaryRemovals(self);
    }

    /**
     * Creates cells for data's names in replications' summary.
     * @param {Object} view Instance of interface's current view.
     */
    createReplicationsSummaryNames(view) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = view;
        // Select cells for data's name.
        self.replicationTableBodyCellsNames = self
            .replicationsTableBodyCells.filter(function (data, index) {
                return data.type === "name";
            });
        // Assign attributes to cells for attributes.
        // TODO: Access the actual names of the metabolites from the records for metabolites in the app's model.
        self.replicationTableBodyCellsNames.text(function (data) {
            return data.value;
        });
    }
    /**
     * Creates and activates cells for data's values in body of summary table.
     * @param {Object} setView Instance of set view interface.
     */
    createActivateReplicationsSummaryRemovals(view) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;

        // TODO: Format bars according to their selection status in the model of app state.
        // TODO: Use bar's attribute and value to look-up selection status in model.


        // Assign attributes to cells in value column.
        self.tableBodyCellsValues.classed("value", true);
        // Append graphical containers to cells for values.
        // The graphical containers need access to the same data as their parent
        // cells without any transformation.
        // Append graphical containers to the enter selection to avoid replication
        // of these containers upon restorations to the table.
        var dataValueCellGraphs = self.tableBodyCellsValues
            .selectAll("svg")
            .data(function (element, index) {
                return [element];
            });
        dataValueCellGraphs.exit().remove();
        var newValueCellGraphs = dataValueCellGraphs.enter().append("svg");
        var valueCellGraphs = newValueCellGraphs.merge(dataValueCellGraphs);
        valueCellGraphs.classed("graph", true);
        // Determine the width of graphical containers.
        var graphWidth = parseFloat(
            window.getComputedStyle(
                self.tableBody.getElementsByClassName("graph").item(0)
            ).width.replace("px", "")
        );
        // Append rectangles to graphical containers in cells for values.
        var dataValueCellBars = valueCellGraphs
            .selectAll("rect")
            .data(function (element, index) {
                // Organize data for rectangles.
                return element.values;
            });
        dataValueCellBars.exit().remove();
        var newValueCellBars = dataValueCellBars.enter().append("rect");
        self.tableBodyCellsValuesGraphBars = newValueCellBars
            .merge(dataValueCellBars);
        // Assign attributes to rectangles.
        self.tableBodyCellsValuesGraphBars
            .attr("id", function (data, index) {
                return "set-view-attribute-" +
                    data.attribute +
                    "-value-" +
                    data.identifier;
            })
            .classed("bar", true)
            .classed("normal", function (data, index) {
                var match = self.determineValueAttributeMatchSelections({
                    value: data.value,
                    attribute: data.attribute,
                    setView: self
                });
                return !match;
            })
            .classed("emphasis", function (data, index) {
                var match = self.determineValueAttributeMatchSelections({
                    value: data.value,
                    attribute: data.attribute,
                    setView: self
                });
                return match;
            })
            .attr("title", function (data, index) {
                return data.value;
            });
        // Assign position and dimension to rectangles.
        self.tableBodyCellsValuesGraphBars
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
                return scale(data.count);
            });
        // Activate cells for data's values.
        self.activateSummaryBodyCellsValues(self);
    }
    /**
     * Activates cells for data's values in body of summary table.
     * @param {Object} setView Instance of set view interface.
     */
    activateSummaryBodyCellsValues(setView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = setView;

        // Remove any existing event listeners and handlers from bars.
        self.tableBodyCellsValuesGraphBars
            .on("click", null);
        // Assign event listeners and handlers to bars.
        self.tableBodyCellsValuesGraphBars
            .on("click", function (data, index, nodes) {
                Action.selectSetViewValue({
                    value: data.value,
                    attribute: data.attribute,
                    model: self.model
                });
            });
    }





    /**
     * Determines the current value of compartmentalization in the application's
     * state.
     * @param {Object} view Instance of interface's current view.
     */
    determineCompartmentalization(view) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = view;
        return self.model.compartmentalization;
    }
    /**
     * Determines whether or not the application state has a subnetwork.
     */
    determineSubnetwork() {
        return (
            !(this.model.entityViewSubNetworkNodes === null) &&
            !(this.model.entityViewSubNetworkLinks === null)
        );
    }


}

/**
 * Interface to represent the topology of the network of relations between
 * metabolic entities.
 */
class TopologyView {
    /**
     * Initializes an instance of the class.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    constructor (model) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = this;
        // Set reference to model of application's state.
        self.model = model;
        // Set reference to document object model (DOM).
        self.document = document;
        // Initialize container for interface.
        self.initializeContainer(self);
    }
    /**
     * Initializes the container for the interface.
     * @param {Object} topologyView Instance of entity view interface.
     */
    initializeContainer(topologyView) {
        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = topologyView;
        // Create and set references to elements for interface.
        // Select view in document object model.
        self.view = self.document.getElementById("view");
        // Remove any extraneous content within view.
        // Initialization of the persistence view already removes extraneous
        // content from view.
        General.filterRemoveDocumentElements({
            values: ["top", "bottom"],
            attribute: "id",
            elements: self.view.children
        });
        // Create container for interfaces within bottom of view.
        if (!self.document.getElementById("bottom")) {
            self.bottom = self.document.createElement("div");
            self.view.appendChild(self.bottom);
            self.bottom.setAttribute("id", "bottom");
        } else {
            self.bottom = self.document.getElementById("bottom");
        }
        // Remove any extraneous content within bottom.
        General.filterRemoveDocumentElements({
            values: ["control", "topology"],
            attribute: "id",
            elements: self.bottom.children
        });
        // Create container for interface within bottom.
        // Set reference to current interface's container.
        if (!self.document.getElementById("topology")) {
            self.container = self.document.createElement("div");
            self.bottom.appendChild(self.container);
            self.container.setAttribute("id", "topology");
        } else {
            self.container = self.document.getElementById("topology");
        }
    }

    drawNetwork(entityView) {

        // TODO: How can I accommodate networks of different scales?
        // TODO: I think I'll need variables for node and link dimensions as well as force parameters.
        // TODO: I can scale the radius of reactions by the number of metabolite nodes (in current network definition) they connect to.


        // Set reference to class' current instance to transfer across changes
        // in scope.
        var self = entityView;

        // Create graphical container for network visualization.
        // Create graphical container with D3 so that styles in CSS will control
        // dimensions.
        if (!self.container.getElementsByTagName("svg").item(0)) {
            var networkGraph = d3.select(self.container).append("svg");
            self.networkGraph = self
                .container.getElementsByTagName("svg").item(0);
        } else {
            self.networkGraph = self
                .container.getElementsByTagName("svg").item(0);
            var networkGraph = d3.select(self.networkGraph);
        }

        // Determine the dimensions of the graphical container.
        var graphWidth = parseFloat(
            window.getComputedStyle(self.networkGraph).width.replace("px", "")
        );
        var graphHeight = parseFloat(
            window.getComputedStyle(self.networkGraph).height.replace("px", "")
        );

        // Create links.
        // Create links before nodes so that nodes will appear over the links.
        // Contain all links within a single group.
        var linkGroup = networkGraph.append("g");
        var dataLinks = linkGroup
            .selectAll("line").data(self.model.entityViewSubNetworkLinks);
        dataLinks.exit().remove();
        var newLinks = dataLinks.enter().append("line");
        var links = newLinks.merge(dataLinks);
        links.classed("link", true);

        // Create nodes.
        // Contain all nodes within a single group.
        var nodeGroup = networkGraph.append("g");
        var dataNodes = nodeGroup
            .selectAll("circle").data(self.model.entityViewSubNetworkNodes);
        dataNodes.exit().remove();
        var newNodes = dataNodes.enter().append("circle");
        var nodes = newNodes.merge(dataNodes);
        nodes.classed("node", true);
        nodes.classed("metabolite", function (data) {
            return data.entity === "metabolite";
        });
        nodes.classed("reaction", function (data) {
            return data.entity === "reaction";
        });

        // Initiate the force simulation.
        // The force method assigns a specific force simulation to the name.
        // Collision force prevents overlap and occlusion of nodes.
        // The center force causes nodes to behave strangely when user repositions
        // them manually.
        var simulation = d3.forceSimulation()
            .nodes(self.model.entityViewSubNetworkNodes)
            .force("center", d3.forceCenter()
                .x(graphWidth / 2)
                .y(graphHeight / 2)
            )
            .force("collision", d3.forceCollide()
                .radius(function (data) {
                    if (data.entity === "metabolite") {
                        return 10;
                    } else if (data.entity === "reaction") {
                        return 20;
                    }
                })
                .strength(0.9)
                .iterations(1)
            )
            .force("charge", d3.forceManyBody()
                .strength(-250)
                .distanceMin(1)
                .distanceMax(200)
            )
            .force("link", d3.forceLink()
                .links(self.model.entityViewSubNetworkLinks)
                .id(function (d) {
                    return d.identifier;
                })
                .distance(7)
            )
            //.force("positionX", d3.forceX()
            //    .x(graphWidth / 2)
            //    .strength(0.1)
            //)
            //.force("positionY", d3.forceY()
            //    .y(graphWidth / 2)
            //    .strength(0.1)
            //)
            .on("tick", restoreNodePositions);

        // Declare function to increment the force simulation.
        // Impose constraints on node positions (d.x and d.y) according to dimensions of bounding SVG element.
        var radius = 9;
        function restoreNodePositions() {
            nodes
                .attr("cx", function (d) {
                    return d.x = Math.max(radius, Math.min(graphWidth - radius, d.x));
                })
                .attr("cy", function (d) {
                    return d.y = Math.max(radius, Math.min(graphHeight - radius, d.y));
                });
            links
                .attr("x1", function (d) {return d.source.x;})
                .attr("y1", function (d) {return d.source.y;})
                .attr("x2", function (d) {return d.target.x;})
                .attr("y2", function (d) {return d.target.y;});
        };

    }

}