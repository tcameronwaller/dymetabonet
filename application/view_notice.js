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
* Interface to control whether to force representation of subnetwork.
*/
class ViewNotice {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of ViewInterface's class.
  * @param {Object} parameters.tipView Instance of ViewTip's class.
  * @param {Object} parameters.promptView Instance of ViewPrompt's class.
  * @param {Object} parameters.explorationView Instance of ViewExploration's
  * class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({interfaceView, tipView, promptView, explorationView, state, documentReference} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = interfaceView;
    self.tipView = tipView;
    self.promptView = promptView;
    self.explorationView = explorationView;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
  }
  /**
  * Initializes, creates and activates, view's content and behavior that does
  * not vary with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "notice",
      target: self.explorationView.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create text.
      var textContainer = self.document.createElement("span");
      self.container.appendChild(textContainer);
      var message = (
        "There are not any elements in subnetwork. Get some!"
      );
      textContainer.textContent = message;
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate buttons.
      self.force = View.createButton({
        text: "force draw",
        parent: self.container,
        documentReference: self.document
      });
      self.force.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        ActionExploration.changeForceTopology(self.state);
      });
    } else {
      // Container is not empty.
      // Set references to content.
    }
  }
}
