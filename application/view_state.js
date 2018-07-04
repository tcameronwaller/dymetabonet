/*
This file is part of project Profondeur
(https://github.com/tcameronwaller/profondeur/).

Profondeur supports visual exploration and analysis of metabolic networks.
Copyright (C) 2018 Thomas Cameron Waller

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.
If not, see <http://www.gnu.org/licenses/>.

Thomas Cameron Waller
tcameronwaller@gmail.com
Department of Biochemistry
University of Utah
Room 5520C, Emma Eccles Jones Medical Research Building
15 North Medical Drive East
Salt Lake City, Utah 84112
United States of America
*/

/**
* Interface to control load and save of application's state.
*/
class ViewState {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({documentReference, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = self.state.views.interface;
    self.tipView = self.state.views.tip;
    self.promptView = self.state.views.prompt;
    self.controlView = self.state.views.control;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes, creates and activates, view's content and behavior that does
  * not vary with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "state",
      type: "standard",
      target: self.controlView.stateTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create and activate button to restore view.
      self.createActivateRestorationButton(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate button and label to select source file.
      self.createActivateLoadButton(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate button to save application's state.
      self.createActivateSaveButton(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate button to execute temporary procedure, for
      // convenience in development.
      self.createActivateExecutionButton(self);
    } else {
      // Container is not empty.
      // Set references to content.
      self.sourceLabel = self.container.getElementsByTagName("span").item(0);
    }
  }
  /**
  * Creates and activates button to restore view's controls.
  * @param {Object} self Instance of a class.
  */
  createActivateRestorationButton(self) {
    var restore = View.createButton({
      text: "restore",
      parent: self.container,
      documentReference: self.document
    });
    restore.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionState.restoreControlsLoadRestoreSourceState(self.state);
    });
  }
  /**
  * Creates and activates button to select file to load.
  * @param {Object} self Instance of a class.
  */
  createActivateLoadButton(self) {
    // Load
    // Create and activate file selector.
    var load = View.createFileLoadFacade({
      suffix: ".json",
      parent: self.container,
      documentReference: self.document
    });
    load.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionState.changeSource({
        source: event.currentTarget.files[0],
        state: self.state
      });
    });
    // Create text.
    self.sourceLabel = self.document.createElement("span");
    self.container.appendChild(self.sourceLabel);
  }
  /**
  * Creates and activates button to save application's state.
  * @param {Object} self Instance of a class.
  */
  createActivateSaveButton(self) {
    var save = View.createButton({
      text: "save",
      parent: self.container,
      documentReference: self.document
    });
    save.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionState.saveState(self.state);
    });
  }
  /**
  * Creates and activates button to execute temporary procedure.
  * @param {Object} self Instance of a class.
  */
  createActivateExecutionButton(self) {
    var execute = View.createButton({
      text: "execute",
      parent: self.container,
      documentReference: self.document
    });
    execute.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionState.executeProcedure(self.state);
    });
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Create view's variant elements.
    // Activate variant behavior of view's elements.
    self.restoreSourceLabel(self);
  }
  /**
  * Restores source's label.
  * @param {Object} self Instance of a class.
  */
  restoreSourceLabel(self) {
    // Determine whether the application's state includes a source file.
    if (Model.determineSourceState(self.state)) {
      // Application's state includes a source file.
      var text = self.state.source.name;
    } else {
      // Application's state does not include a source file.
      var text = "select file...";
    }
    self.sourceLabel.textContent = text;
  }
}
