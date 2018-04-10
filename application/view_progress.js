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
* Interface to represent simulation's progress.
*/
class ViewProgress {
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
      identifier: "notice",
      type: "graph",
      target: self.explorationView.graph,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create message.
      self.createMessage(self);
    } else {
      // Container is not empty.
      // Set references to content.
      self.textContainer = self.container.getElementsByTagName("text").item(0);
    }
  }
  /**
  * Creates a message.
  * @param {Object} self Instance of a class.
  */
  createMessage(self) {
    // Create text container.
    self.textContainer = self
    .document.createElementNS("http://www.w3.org/2000/svg", "text");
    self.container.appendChild(self.textContainer);
    // Restore position.
    self.textContainer
    .setAttribute("x", (String(self.explorationView.graphWidth / 2) + "px"));
    self.textContainer
    .setAttribute("y", (String(self.explorationView.graphHeight / 2) + "px"));
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Estimate simulation's progress.
    var progress = Simulation.determineSimulationProgressProportion({
      count: self.state.simulationProgress.count,
      target: self.state.simulationProgress.preparation
    });
    // Restore message.
    var message = ("progress: " + (progress * 100).toFixed() + "%");
    self.textContainer.textContent = message;
  }
}
