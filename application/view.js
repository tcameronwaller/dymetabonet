/**
 * Interface to select file, check and extract information about metabolic
 * entities and sets, and restore state of the application.
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
        // Display current file selection.
        if (!self.determineFile()) {
            // Application does not have a current file selection.
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
        // File selector needs to be accessible always to change file selection.
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
                // Remove the current file selection from the application state.
                Action.removeAttribute("file", self.model);
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
                // clean model of metabolism.
                Action.loadExtractMetabolicEntitiesSets(self.model);
                // Remove the current file selection from the application state.
                Action.removeAttribute("file", self.model);
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
                // Remove the current file selection from the application state.
                Action.removeAttribute("file", self.model);
            });
            self.container.appendChild(self.restoration);
            //self.container.appendChild(self.document.createElement("br"));
        }
    }
    /**
     * Determines whether or not the application state has a current file
     * selection.
     */
    determineFile() {
        return this.model.file;
    }
}

/**
 * Interface to save and restore the state of the application.
 */
class StateView {
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
            values: ["state", "set"],
            attribute: "id",
            elements: self.top.children
        });
        // Create container for interface within top.
        if (!self.document.getElementById("state")) {
            self.container = self.document.createElement("div");
            self.container.setAttribute("id", "state");
            self.top.appendChild(self.container);
        } else {
            self.container = self.document.getElementById("state");
        }
        // Remove all contents of container.
        General.removeDocumentChildren(self.container);
        //
        // Create and activate button to restore application to initial state.
        self.restoration = self.document.createElement("button");
        self.restoration.textContent = "Restore";
        self.restoration.addEventListener("click", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Restore application to initial state.
            Action.initializeApplication(self.model);
        });
        self.container.appendChild(self.restoration);
        self.container.appendChild(self.document.createElement("br"));
        // Create and activate button to save current state of application.
        self.save = self.document.createElement("button");
        self.save.textContent = "Save";
        self.save.addEventListener("click", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Save current state of application.
            Action.saveState(self.model);
        });
        self.container.appendChild(self.save);
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
        // TODO: Eventually, I think I'll need to organize stuff in separate methods...
        // TODO: I'll need to manage references to "this" and "self" with these methods...
        // Set reference to current instance of class to transfer across changes
        // in scope.
        var self = this;
        // Reference model of application's state.
        self.model = model;
        // Reference document object model.
        self.document = document;
        // Initialize container for interface.
        self.initializeContainer(self);
        // Create aspects of interface that do not depend on data.
        // Initialize table for summary of sets' cardinalities.
        self.initializeSummaryTable(self);
        // Restore the table for summary of sets' cardinalitites.
        self.restoreSummaryTable(self);

        console.log("new SetView");
        console.log("entity: " + self.model.setViewEntity);
        console.log("filter: " + self.model.setViewFilter);
    }
    /**
     * Initializes the container for the interface.
     * @param {Object} setView Instance of set view interface.
     */
    initializeContainer(setView) {
        // Set reference to current instance of class to transfer across changes
        // in scope.
        var self = setView;
        // Create and set references to elements for interface.
        // Select view in document object model.
        self.view = self.document.getElementById("view");
        // Remove any extraneous content within view.
        // Initialization of the state view already removes extraneous
        // content from view.
        General.filterRemoveDocumentElements({
            values: ["top", "bottom"],
            attribute: "id",
            elements: self.view.children
        });
        // Create container for interfaces within top of view.
        // Initialization of the state view already creates the top container.
        if (!self.document.getElementById("top")) {
            self.top = self.document.createElement("div");
            self.top.setAttribute("id", "top");
            self.view.appendChild(self.top);
        } else {
            self.top = self.document.getElementById("top");
        }
        // Remove any extraneous content within top.
        General.filterRemoveDocumentElements({
            values: ["state", "set"],
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
        // Set reference to current instance of class to transfer across changes
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
            // TODO: Create entity selector, filter selector, and reset button...
            // TODO: All of these control elements need listeners to drive actions to modify app state.
            // Create and activate entity selector.
            self.createActivateEntitySelector("metabolite", self);
            self.createActivateEntitySelector("reaction", self);
            // Create and activate filter selector.
            self.createActivateFilterSelector(self);
            // Create and activate reset button.

            // TODO: Still need reset button...

            // Create table's body.
            self.tableBody = self.document.createElement("tbody");
            self.table.appendChild(self.tableBody);
        } else {
            // Interface's container includes a table element.
            // Establish references to existing elements.
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
                .document.getElementById("set-view-entity-metabolite");
            self.reactionSelector = self
                .document.getElementById("set-view-entity-reaction");
            self.filterSelector = self
                .document.getElementById("set-view-filter");
            // TODO: Still need reset button...
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
        // Set reference to current instance of class to transfer across changes
        // in scope.
        var self = setView;
        // Create entity selector.
        var entitySelector = entity + "Selector";
        var identifier = "set-view-entity-" + entity;
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
            Action.changeSetViewEntity(self.model);
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
        // Set reference to current instance of class to transfer across changes
        // in scope.
        var self = setView;
        // Create filter selector.
        var identifier = "set-view-filter";
        self.filterSelector = self.document.createElement("input");
        self.tableHeadRowCellValue.appendChild(self.filterSelector);
        self.filterSelector.setAttribute("id", identifier);
        self.filterSelector.setAttribute("type", "checkbox");
        self.filterSelector.setAttribute("value", "filter");
        self.filterSelector.classList.add("filter");
        self.filterSelector.addEventListener("change", function (event) {
            // Element on which the event originated is event.currentTarget.
            // Change current selection of filter in application's state.
            //var value = self.filterSelector.checked;
            //Action.submitSetViewFilter(value, self.model);
            Action.changeSetViewFilter(self.model);
        });
        var filterLabel = self.document.createElement("label");
        self.tableHeadRowCellValue.appendChild(filterLabel);
        filterLabel.setAttribute("for", identifier);
        filterLabel.textContent = "filter";
    }
    /**
     * Restores the table to summarize sets' cardinalities.
     * @param {Object} setView Instance of set view interface.
     */
    restoreSummaryTable(setView) {
        // Set reference to current instance of class to transfer across changes
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

    }
    /**
     * Determines whether or not the application state has a current selection
     * of entity that matches a specific type of entity.
     * @param {string} match Type of entity, metabolite or reaction, to find
     * match with entity selection in application's state.
     * @param {Object} setView Instance of set view interface.
     */
    determineEntityMatch(match, setView) {
        // Set reference to current instance of class to transfer across changes
        // in scope.
        var self = setView;
        return self.model.setViewEntity === match;
    }
    /**
     * Determines the current filter selection in the application's state.
     * @param {Object} setView Instance of set view interface.
     */
    determineFilter(setView) {
        // Set reference to current instance of class to transfer across changes
        // in scope.
        var self = setView;
        return self.model.setViewFilter;
    }

}