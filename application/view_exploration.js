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
    self.panelView = self.state.views.panel;
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
      classNames: ["container"],
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
    // Determine whether to create network's diagram.
    if (Model.determineNetworkDiagram(self.state)) {
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
      if (!match) {
        // Change state's variable for simulation's dimensions.
        ActionExploration.changeSimulationDimensions({
          length: self.scaleLength,
          width: self.graphWidth,
          height: self.graphHeight,
          state: self.state
        });
      }
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
    //0.3-1: 2
    //1-5: 3
    //5-10: 5
    //10-15: 7
    //15-25: 10
    //25-50: 15
    //50-100: 20
    //100-150: 30
    //150-10000: 40
    var lengthScale = d3
    .scaleThreshold()
    .domain(domainRatios)
    .range([1, 2, 3, 5, 7, 10, 15, 20, 30, 40]);
    // Define scale for thickness of visual marks.
    // Domain's unit is pixel for ratio of graphical container's width to count
    // of nodes.
    // Range's unit is pixel for dimension of graphical elements.
    //domain: range
    //0-0.3: 0.03
    //0.3-1: 0.05
    //1-5: 0.1
    //5-10: 0.3
    //10-15: 0.5
    //15-25: 0.7
    //25-50: 1
    //50-100: 2
    //100-150: 3
    //150-10000: 5
    var thicknessScale = d3
    .scaleThreshold()
    .domain(domainRatios)
    .range([0.05, 0.07, 0.1, 0.3, 0.5, 0.7, 1, 2, 3, 5]);
    // Define scale for size of font in annotations.
    // Domain's unit is pixel for ratio of graphical container's width to count
    // of nodes.
    // Range's unit is pixel for dimension of font characters.
    //domain: range
    //0-0.3: 1
    //0.3-1: 2
    //1-5: 3
    //5-10: 4
    //10-15: 5
    //15-25: 7
    //25-50: 10
    //50-100: 11
    //100-150: 13
    //150-10000: 15
    var fontScale = d3
    .scaleThreshold()
    .domain(domainRatios)
    .range([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
    // Compute ratio for scales' domain.
    var ratio = (self.graphWidth / self.state.subnetworkNodesRecords.length);
    // Compute dimensions from scale.
    self.scaleLength = lengthScale(ratio);
    self.scaleThickness = thicknessScale(ratio);
    self.scaleFont = fontScale(ratio);
  }
}
