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
* Interface to contain other interfaces for exploration.
*/
class ViewExploration {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of ViewInterface's class.
  * @param {Object} parameters.tipView Instance of ViewTip's class.
  * @param {Object} parameters.promptView Instance of ViewPrompt's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.windowReference Reference to browser's window.
  */
  constructor ({interfaceView, tipView, promptView, state, documentReference, windowReference} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to browser's window.
    self.window = windowReference;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = interfaceView;
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
      identifier: "exploration",
      target: self.interfaceView.container,
      position: "beforeend",
      documentReference: self.document
    });
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Terminate any previous simulations from topology view.
    ViewTopology.terminatePreviousSimulation(self.state);
    // Determine which subordinate views to create, activate, and restore.
    // Determine whether to represent subnetwork's elements in a visual diagram.
    // Represent if counts of subnetwork's elements are not excessive or if user
    // specified to force representation.
    if (
      Model.determineForceTopology(self.state) ||
      Model.determineSubnetworkScale(self.state)
    ) {
      View.removeExistElement("gate", self.document);
      new ViewTopology({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        explorationView: self,
        state: self.state,
        documentReference: self.document,
        windowReference: self.window
      });
    } else {
      View.removeExistElement("topology", self.document);
      new ViewNotice({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        explorationView: self,
        state: self.state,
        documentReference: self.document
      });
    }
  }
}
