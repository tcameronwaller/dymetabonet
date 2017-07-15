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
        General.filterDocumentElements({
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
        General.filterDocumentElements({
            values: ["state", "set", "entity"],
            attribute: "id",
            elements: self.view.children
        });
        // Create container for interface within view.
        if (!self.document.getElementById("top")) {
            self.top = self.document.createElement("div");
            self.top.setAttribute("id", "top");
            self.view.appendChild(self.top);
        } else {
            self.top = self.document.getElementById("top");
        }
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
            Action.createPersistentState(self.model);
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
        // Reference current instance of class to transfer across changes in
        // scope.
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



        // TODO: Scrap below here, I think...
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
            Action.createPersistentState(self.model);
        });
        self.container.appendChild(self.save);
        //self.container.appendChild(self.document.createElement("br"));
    }
    /**
     * Initializes the container for the interface.
     * @param {Object} setView Instance of set view interface.
     */
    initializeContainer(setView) {
        // Reference current instance of class to transfer across changes in
        // scope.
        var self = setView;
        // Select view in document object model.
        self.view = self.document.getElementById("view");
        // Remove any extraneous content within view.
        // Initialization of the state view already removes extraneous
        // content from view.
        General.filterDocumentElements({
            values: ["state", "set", "entity"],
            attribute: "id",
            elements: self.view.children
        });
        // Create container for interface within view.
        // Initialization of the state view already creates the top container.
        if (!self.document.getElementById("top")) {
            self.top = self.document.createElement("div");
            self.top.setAttribute("id", "top");
            self.view.appendChild(self.top);
        } else {
            self.top = self.document.getElementById("top");
        }
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
     * @param {Object} setView Instance of set view interface.
     */
    initializeSummaryTable(setView) {
        // Reference current instance of class to transfer across changes in
        // scope.
        var self = setView;
        // Initialize table.
        if (!self.container.getElementsByTagName("table").item(0)) {
            // Interface's container does not include a table element.
            // Create table.
            self.table = self.document.createElement("table");
            self.container.appendChild(self.table);
            // Create table's header.
            var tableHead = self.document.createElement("thead");
            self.table.appendChild(tableHead);
            var tableHeadRow = self.document.createElement("tr");
            tableHead.appendChild(tableHeadRow);
            var tableHeadAttributeCell = self.document.createElement("th");
            tableHeadRow.appendChild(tableHeadAttributeCell);
            tableHeadAttributeCell.textContent = "Attribute";
            tableHeadAttributeCell.classList.add("attribute");
            var tableHeadValueCell = self.document.createElement("th");
            tableHeadRow.appendChild(tableHeadValueCell);
            tableHeadValueCell.classList.add("value");

            // Create table's body.
            var tableBody = self.document.createElement("tbody");
            self.table.appendChild(tableBody);


        }



    }


}