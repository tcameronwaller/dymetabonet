/**
 * Interface for check, conversion, and load of state of the application.
 */
class SourceView {
    /**
     * Initializes an instance of class State.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    constructor(model) {

        // Reference current instance of class for changes in scope.
        var self = this;
        // Reference model of application's state.
        self.model = model;
        // Select document object model.
        self.document = document;
        // Select view in document object model.
        self.view = self.document.getElementById("view");
        // Remove any containers within view other than container for source
        // interface.
        General.filterDocumentElements("source", "id", self.view.children);
        // Create container for source interface within view.
        if (!self.document.getElementById("source")) {
            self.container = self.document.createElement("div");
            self.container.setAttribute("id", "source");
            self.view.appendChild(self.container);
        } else {
            self.container = self.document.getElementById("source");
        }
        // Remove all contents of container.
        General.removeDocumentChildren(self.container);
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
        self.facade.textContent = "File";
        self.facade.addEventListener("click", function (event) {
            // Element on which the event originated is event.currentTarget.
            self.selector.click();
        });
        self.container.appendChild(self.facade);
        self.container.appendChild(self.document.createElement("br"));
        // Create and activate interface controls according to file selection.
        if (self.determineFile()) {
            // Application has a current file selection.
            // Create and activate button to check a raw model of metabolism.
            // TODO: Create check button and tie to functionality eventually.
            // Create and activate button to derive metabolic entities and sets from
            // a raw model of metabolism.
            // TODO: Do this now...
            self.extractor = self.document.createElement("button");
            self.extractor.textContent = "Extract";
            self.extractor.addEventListener("click", function (event) {
                // Element on which the event originated is event.currentTarget.
                // TODO: Call the assemble (rename extract) function and pass it the file.
                //Action.submitFile(event.currentTarget.files[0], self.model);
            });


            // Create and activate button to load application state.
        }
        //        <button id="assemble-model">Assemble</button><br>
        //        <button id="load-model">Load</button>






    }
    /**
     * Determines whether or not model has a file.
     */
    determineFile() {
        return this.model.file;
    }

}