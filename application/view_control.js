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
* Interface to contain other interfaces for controls.
*/
class ViewControl {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of ViewInterface's class.
  * @param {Object} parameters.panelView Instance of ViewPanel's class.
  * @param {Object} parameters.tipView Instance of ViewTip's class.
  * @param {Object} parameters.promptView Instance of ViewPrompt's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({interfaceView, panelView, tipView, promptView, state, documentReference} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = interfaceView;
    self.panelView = panelView;
    self.tipView = tipView;
    self.promptView = promptView;
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
      identifier: "control",
      target: self.panelView.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create and activate tabs.
      self.createActivateTabs(self);
    } else {
      // Container is not empty.
      // Set references to content.
      // Tabs.
      self.stateTab = self.document.getElementById("state-tab");
      self.filterTab = self.document.getElementById("filter-tab");
      self.simplificationTab = self
      .document.getElementById("simplification-tab");
      self.traversalTab = self.document.getElementById("traversal-tab");
      self.measurementTab = self.document.getElementById("measurement-tab");
    }
  }
  /**
  * Creates and activates tabs.
  * @param {Object} self Instance of a class.
  */
  createActivateTabs(self) {
    var tabs = Model.determineControlTabs(self.state);
    tabs.forEach(function (category) {
      self.createActivateTab({
        category: category,
        self: self
      });
    });
  }
  /**
  * Creates and activates a tab.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Category of tab.
  * @param {Object} parameters.self Instance of a class.
  */
  createActivateTab({category, self} = {}) {
    // Create container.
    var identifier = ViewControl.createTabIdentifier(category);
    var reference = ViewControl.createTabReference(category);
    self[reference] = self.document.createElement("div");
    self.container.appendChild(self[reference]);
    var label = View.createAppendSpanText({
      text: category,
      parent: self[reference],
      documentReference: self.document
    });
    // Assign attributes.
    self[reference].setAttribute("id", identifier);
    self[reference].setAttribute("name", category);
    self[reference].classList.add("tab");
    self[reference].classList.add("normal");
    // Activate behavior.
    self[reference].addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionControl.changeView({
        category: event.currentTarget.getAttribute("name"),
        state: self.state
      });
    });
    self[reference].addEventListener("mouseenter", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      event.currentTarget.classList.remove("normal");
      event.currentTarget.classList.add("emphasis");
    });
    self[reference].addEventListener("mouseleave", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      event.currentTarget.classList.remove("emphasis");
      event.currentTarget.classList.add("normal");
    });
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Determine which subordinate views to create, activate, and restore.
    // Multiple subordinate views within control view can be active
    // simultaneously.
    if (Model.determineControlState(self.state)) {
      new ViewState({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        controlView: self,
        state: self.state,
        documentReference: self.document
      });
    } else {
      View.removeExistElement("state", self.document);
    }
    if (Model.determineControlFilter(self.state)) {
      new ViewFilter({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        controlView: self,
        state: self.state,
        documentReference: self.document
      });
    } else {
      View.removeExistElement("filter", self.document);
    }
    if (Model.determineControlSimplification(self.state)) {
      new ViewContext({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        controlView: self,
        state: self.state,
        documentReference: self.document
      });
    } else {
      View.removeExistElement("simplification", self.document);
    }
    if (Model.determineControlTraversal(self.state)) {
      new ViewQuery({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        controlView: self,
        state: self.state,
        documentReference: self.document
      });
    } else {
      View.removeExistElement("traversal", self.document);
    }
    if (Model.determineControlMeasurement(self.state)) {
      new ViewMeasurement({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        controlView: self,
        state: self.state,
        documentReference: self.document
      });
    } else {
      View.removeExistElement("measurement", self.document);
    }
  }
  /**
  * Creates identifier for a tab.
  * @param {string} category Category for a tab.
  * @returns {string} Identifier for a tab.
  */
  static createTabIdentifier(category) {
    return (category + "-tab");
  }
  /**
  * Creates reference for a tab.
  * @param {string} category Category for a tab.
  * @returns {string} Reference for a tab.
  */
  static createTabReference(category) {
    return (category + "Tab");
  }
}
