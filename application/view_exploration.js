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
      type: "standard",
      target: self.interfaceView.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create graphical container.
      self.createGraph(self);
    } else {
      // Container is not empty.
      // Set references to content.
      self.graph = self.container.getElementsByTagName("svg").item(0);
      self.graphWidth = General.determineElementDimension(self.graph, "width");
      self.graphHeight = General
      .determineElementDimension(self.graph, "height");
    }
  }
  /**
  * Creates a graphical container.
  * @param {Object} self Instance of a class.
  */
  createGraph(self) {
    // Create graphical container.
    self.graph = View.createGraph({
      parent: self.container,
      documentReference: self.document
    });
    // Determine graphs' dimensions.
    self.graphWidth = General.determineElementDimension(self.graph, "width");
    self.graphHeight = General.determineElementDimension(self.graph, "height");
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Determine which subordinate views to create, activate, and restore.
    // Determine whether subnetwork has any elements to represent and whether
    // simulation is ready for positions in network's diagram.
    if (Model.determineSubnetworkNodes(self.state)) {
      // Create scales for the visual representation of network's elements.
      // These scales also inform the simulation.
      self.createDimensionScales(self);
      // Determine whether view's current dimensions match state's variable for
      // simulation's dimensions.
      var match = Model.determineViewSimulationDimensions({
        length: self.scaleLength,
        width: self.graphWidth,
        height: self.graphHeight,
        state: self.state
      });
      if (match) {
        // Determine whether simulation's preparation is complete to represent
        // positions of network's elements.
        if (Model.determineSimulationPreparation(self.state)) {
          // Create topology view.
          View.removeExistElement("progress", self.document);
          View.removeExistElement("notice", self.document);
          if (false) {
            new ViewTopology({
              interfaceView: self.interfaceView,
              tipView: self.tipView,
              promptView: self.promptView,
              explorationView: self,
              state: self.state,
              documentReference: self.document,
              windowReference: self.window
            });
          }
        } else {
          // Create notice view.
          View.removeExistElement("notice", self.document);
          View.removeExistElement("topology", self.document);
          console.log("creating progress view");
          new ViewProgress({
            interfaceView: self.interfaceView,
            tipView: self.tipView,
            promptView: self.promptView,
            explorationView: self,
            state: self.state,
            documentReference: self.document
          });
        }
      } else {
        // Change state's variable for simulation's dimensions.
        ActionExploration.changeSimulationDimensions({
          length: self.scaleLength,
          width: self.graphWidth,
          height: self.graphHeight,
          state: self.state
        });
      }
    } else {
      // Create notice view.
      View.removeExistElement("progress", self.document);
      View.removeExistElement("topology", self.document);
      console.log("creating notice view");
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
  /**
  * Creates scales for visual representation of network's elements.
  * @param {Object} self Instance of a class.
  */
  createDimensionScales(self) {
    // The optimal dimensions for visual marks that represent network's elements
    // depend on the dimensions of the graphical container and on the count of
    // elements.
    // Define scales' domain on the basis of the ratio of the graphical
    // container's width to the count of nodes.
    var domainRatios = [0.3, 1, 5, 10, 15, 25, 50, 100, 150];
    // Define scale for lengths of visual marks.
    // Domain's unit is pixel for ratio of graphical container's width to count
    // of nodes.
    // Range's unit is pixel for dimension of graphical elements.
    //domain: range
    //0-0.3: 1
    //0.3-1: 3
    //1-5: 5
    //5-10: 7
    //10-15: 10
    //15-25: 15
    //25-50: 25
    //50-100: 30
    //100-150: 35
    //150-10000: 50
    var lengthScale = d3
    .scaleThreshold()
    .domain(domainRatios)
    .range([1, 2, 3, 5, 7, 10, 15, 20, 30, 40]);
    // Compute ratio for scales' domain.
    self.scaleDimensionRatio = (
      self.graphWidth / self.state.subnetworkNodesRecords.length
    );
    // Compute dimensions from scale.
    self.scaleLength = lengthScale(self.scaleDimensionRatio);
  }
}
