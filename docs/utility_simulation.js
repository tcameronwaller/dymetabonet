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
* Functionality of utility for creating and monitoring simulations of forces for
* optimization of positions of nodes and links in network's diagram.
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
*/
class Simulation {

  /**
  * Creates initial simulation's dimensions.
  * @returns {Object} Information about simulation's dimensions.
  */
  static createInitialSimulationDimensions() {
    var length = 0;
    var width = 0;
    var height = 0;
    // Compile information.
    var information = {
      length: length,
      width: width,
      height: height
    };
    // Return information.
    return information;
  }
  /**
  * Creates initial simulation's progress.
  * @returns {Object} Information about simulation's progress.
  */
  static createInitialSimulationProgress() {
    var count = 0;
    var total = 0;
    var preparation = 0;
    var completion = false;
    // Compile information.
    var information = {
      count: count,
      total: total,
      preparation: preparation,
      completion: completion
    };
    // Return information.
    return information;
  }
  /**
  * Creates an empty simulation.
  * @returns {Object} References to novel simulation and its controls.
  */
  static createEmptySimulation() {
    // Initiate simulation.
    var simulation = {};
    // Return information.
    return simulation;
  }
  /**
  * Creates a novel simulation to determine the optimal positions of nodes and
  * links in network's diagram.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.length Length factor in pixels.
  * @param {number} parameters.width Container's width in pixels.
  * @param {number} parameters.height Container's height in pixels.
  * @param {Array<Object>} parameters.nodesRecords Information about network's
  * nodes.
  * @param {Array<Object>} parameters.linksRecords Information about network's
  * links.
  * @returns {Object} References to novel simulation and its controls.
  */
  static createNovelPositionSimulation({length, width, height, nodesRecords, linksRecords} = {}) {
    // Initialize simulation's progress.
    var simulationProgress = Simulation.initializeSimulationProgress({
      alpha: 1,
      alphaDecay: 0.013,
      alphaMinimum: 0.001,
      factor: 0.9
    });
    // Initiate simulation.
    var novelSimulation = Simulation.createSimulation({
      alpha: 1,
      alphaDecay: 0.013,
      velocityDecay: 0.15,
      alphaTarget: 0,
      alphaMinimum: 0.001,
      length: length,
      width: width,
      height: height,
      nodesRecords: nodesRecords,
      linksRecords: linksRecords
    });
    // Compile information.
    var variablesValues = {
      simulationProgress: simulationProgress,
      simulation: novelSimulation
    };
    // Return information.
    return variablesValues;
  }
  /**
  * Terminates a simulation.
  * @param {Object} simulation Reference to simulation.
  */
  static terminateSimulation(simulation) {
    // The simulation that creates the positions of nodes and links in the
    // network's diagram is an important and persistent part of the
    // application's state.
    // It is important to manage a single relevant simulation to avoid
    // continuations of previous simulations after changes to the application's
    // state.
    // This force simulation depends both on the subnetwork's elements and on
    // the dimensions of the view within the document object model.
    // Determine whether the application's state has a previous simulation.
    if (Simulation.determineSimulation(simulation)) {
      // Stop the simulation.
      simulation.on("tick", null).on("end", null);
      simulation.stop();
    }
  }
  /**
  * Determines whether a simulation is valid.
  * @param {Object} simulation Reference to simulation.
  * @returns {boolean} Whether the simulation is valid.
  */
  static determineSimulation(simulation) {
    return (
      simulation.hasOwnProperty("alpha") &&
      simulation.hasOwnProperty("alphaDecay") &&
      simulation.hasOwnProperty("alphaMin") &&
      simulation.hasOwnProperty("alphaTarget") &&
      simulation.hasOwnProperty("find") &&
      simulation.hasOwnProperty("force") &&
      simulation.hasOwnProperty("nodes") &&
      simulation.hasOwnProperty("on") &&
      simulation.hasOwnProperty("restart") &&
      simulation.hasOwnProperty("stop") &&
      simulation.hasOwnProperty("tick") &&
      simulation.hasOwnProperty("velocityDecay")
    );
  }
  /**
  * Initializes a force simulation's progress.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.alpha Value of alpha, 0-1.
  * @param {number} parameters.alphaDecay Value of alpha's decay rate, 0-1.
  * @param {number} parameters.alphaMinimum Value of minimal alpha, 0-1.
  * @param {number} parameters.factor Preparatory proportion of total'
  * iterations.
  * @returns {Object} Information about simulation's progress.
  */
  static initializeSimulationProgress({alpha, alphaDecay, alphaMinimum, factor} = {}) {
    // Initiate counter for simulation's iterations.
    var count = 0;
    // Assume that alpha's target is less than alpha's minimum.
    // Compute an estimate of the simulation's total iterations.
    var total = Math.round(Simulation.determineSimulationTotalIterations({
      alpha: alpha,
      alphaDecay: alphaDecay,
      alphaMinimum: alphaMinimum
    }));
    // Compute iterations to complete before creating visual representations.
    var preparation = Math.round(total * factor);
    // Compile information.
    var information = {
      count: count,
      total: total,
      preparation: preparation,
      completion: false
    };
    // Return information.
    return information;
  }
  /**
  * Determines total iterations for a simulation.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.alpha Value of alpha, 0-1.
  * @param {number} parameters.alphaDecay Value of alpha's decay rate, 0-1.
  * @param {number} parameters.alphaMinimum Value of minimal alpha, 0-1.
  * @returns {number} Count of simulation's total iterations.
  */
  static determineSimulationTotalIterations({alpha, alphaDecay, alphaMinimum} = {}) {
    return ((Math.log10(alphaMinimum)) / (Math.log10(alpha - alphaDecay)));
  }
  /**
  * Creates a simulation of forces to determine positions of network's nodes and
  * links in a node-link diagram.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.alpha Value of alpha, 0-1.
  * @param {number} parameters.alphaDecay Value of alpha's decay rate, 0-1.
  * @param {number} parameters.velocityDecay Value of velocity's decay rate,
  * 0-1.
  * @param {number} parameters.alphaTarget Value of alpha's target, 0-1.
  * @param {number} parameters.alphaMinimum Value of minimal alpha, 0-1.
  * @param {number} parameters.length Length factor in pixels.
  * @param {number} parameters.width Container's width in pixels.
  * @param {number} parameters.height Container's height in pixels.
  * @param {Array<Object>} parameters.nodesRecords Information about network's
  * nodes.
  * @param {Array<Object>} parameters.linksRecords Information about network's
  * links.
  * @returns {Object} Reference to simulation.
  */
  static createSimulation({alpha, alphaDecay, velocityDecay, alphaTarget, alphaMinimum, length, width, height, nodesRecords, linksRecords} = {}) {
    // Create novel simulation.
    // Initiate the force simulation.
    // The force method assigns a specific force simulation to the name.
    // Collision force prevents overlap and occlusion of nodes.
    // The center force causes nodes to behave strangely when user repositions
    // them manually.
    // The force simulation assigns positions to the nodes, recording
    // coordinates of these positions in novel attributes within nodes' records.
    // These coordinates are accessible in the original data that associates
    // with node elements.
    // Any elements with access to the nodes' data, such as nodes' marks and
    // labels, also have access to the coordinates of these positions.
    // The visual representation of the subnetwork's elements in the network's
    // diagram constitutes an important and persistent part of the application's
    // state.
    var simulation = d3.forceSimulation()
    .alpha(alpha)
    .alphaDecay(alphaDecay)
    .velocityDecay(velocityDecay)
    .alphaTarget(alphaTarget)
    .alphaMin(alphaMinimum)
    .nodes(nodesRecords)
    .force("center", d3.forceCenter()
      .x(width / 2)
      .y(height / 2)
    )
    .force("collision", d3.forceCollide()
      .radius(function (element, index, nodes) {
        if (element.type === "metabolite") {
          return length;
        } else if (element.type === "reaction") {
          return (length * 3);
        }
      })
      .strength(0.7)
      .iterations(1)
    )
    .force("charge", d3.forceManyBody()
      .theta(0.3)
      .strength(-500)
      .distanceMin(1)
      .distanceMax(length * 10)
    )
    .force("link", d3.forceLink()
      .links(linksRecords)
      .id(function (element, index, nodes) {
        return element.identifier;
      })
      .distance(4 * length)
      //.strength()
      //.iterations()
    )
    .force("positionX", d3.forceX()
      .x(width / 2)
      .strength(0.00007)
    )
    .force("positionY", d3.forceY()
      .y(height / 2)
      .strength(0.025)
    )
    .stop();
    // Return simulation.
    return simulation;
  }
  /**
  * Confines positions of network's nodes within boundaries of container.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.nodesRecords Information about network's
  * nodes.
  * @param {number} parameters.width Container's width in pixels.
  * @param {number} parameters.height Container's height in pixels.
  */
  static confineSimulationPositions({nodesRecords, width, height} = {}) {
    // Iterate on records for network's entities.
    return nodesRecords.map(function (nodeRecord) {
      // Confine record's positions within container.
      var x = Simulation.confineSimulationPosition({
        position: nodeRecord.x,
        radius: 0,
        boundary: width
      });
      var y = Simulation.confineSimulationPosition({
        position: nodeRecord.y,
        radius: 0,
        boundary: height
      });
      var novelEntries = {
        x: x,
        y: y
      };
      return Object.assign(nodeRecord, novelEntries);
    });
  }
  /**
  * Confines a position within a boundary.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.position A position to confine.
  * @param {number} parameters.radius Radius around position.
  * @param {number} parameters.boundary Boundary within which to confine
  * position.
  * @returns {number} Position within boundary.
  */
  static confineSimulationPosition({position, radius, boundary} = {}) {
    return Math.max(radius, Math.min(boundary - radius, position));
  }
  /**
  * Determines a simulation's progress as a proportion.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.count Count of simulation's iterations.
  * @param {number} parameters.target Target count of simulation's iterations.
  * @returns {number} Proportion of simulation's progress.
  */
  static determineSimulationProgressProportion({count, target} = {}) {
    return (Math.round((count / target) * 100) / 100);
  }

  /**
  * Creates and initiates a novel simulation to support interactivity with nodes
  * and links in network's diagram.
  * @param {Object} state Application's state.
  * @returns {Object} Reference to simulation.
  */
  static initiateNovelInteractionSimulation(state) {}

}
