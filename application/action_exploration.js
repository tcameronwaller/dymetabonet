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
* Actions that modify the application's state.
* This class does not store any attributes and does not require instantiation.
* This class stores methods that control actions that modify the application's
* state.
* The methods require a reference to the instance of the state.
* These methods also call external methods as necessary.
*/
class ActionExploration {

  // TODO: I DON'T KNOW HOW TO HANDLE THE SIMULATION FOR DRAG INTERACTIONS...
  // TODO: WILL THE D3 DRAG EVENT PROPAGATE WITH UPDATE'S TO THE STATE?

  // TODO: New actions...
  // TODO: initialize simulation
  // TODO: initialize simulation's progress
  // TODO: restore simulation's progress... always relative to TOTAL, not % before draw
  // TODO: determine whether to draw the network's diagram on basis of simulation's progress
  // TODO: restore ExplorationView (just create new to update as usual)... call this when necessary

  // TODO: Re-initialize the simulation whenever the subnetwork changes
  // TODO: but not with other, irrelevant changes to state
  // TODO: Application should always be working on simulation for the current subnetwork
  // TODO: no more requirement to force draw for large networks.

  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeControls() {
    // Initialize controls.
    var simulationDimensions = ActionExploration
    .createInitialSimulationDimensions();
    var simulationProgress = ActionExploration
    .createInitialSimulationProgress();
    var simulation = {};
    var entitySelection = ActionExploration.createInitialEntitySelection();
    // Compile information.
    var variablesValues = {
      simulationDimensions: simulationDimensions,
      simulationProgress: simulationProgress,
      simulation: simulation,
      entitySelection: entitySelection
    };
    // Return information.
    return variablesValues;
  }
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
  * Creates initial entity selection.
  * @returns {Object} Information about an entity selection.
  */
  static createInitialEntitySelection() {
    // Initialize controls.
    var type = "";
    var node = "";
    var candidate = "";
    var entity = "";
    // Compile information.
    var information = {
      type: type,
      node: node,
      candidate: candidate,
      entity: entity
    };
    // Return information.
    return information;
  }
  /**
  * Changes the simulation's dimensions.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.length Length factor in pixels.
  * @param {number} parameters.width Container's width in pixels.
  * @param {number} parameters.height Container's height in pixels.
  * @param {Object} state Application's state.
  */
  static changeSimulationDimensions({length, width, height, state} = {}) {
    // Determine novel simulation's dimensions.
    var simulationDimensions = {
      length: length,
      width: width,
      height: height
    };
    // Initiate novel simulation.
    // TODO: There are a lot of steps below... simplify into a function...
    //var simulationControls = ActionExploration.initiateNovelSimulation({});

    // Initialize simulation's progress.
    var simulationProgress = ActionExploration.initializeSimulationProgress({
      alpha: 1,
      alphaDecay: 0.013,
      alphaMinimum: 0.001,
      factor: 0.9
    });
    // Initiate simulation.
    var simulation = ActionExploration.createInitiateSimulation({
      alpha: 1,
      alphaDecay: 0.013,
      velocityDecay: 0.15,
      alphaTarget: 0,
      alphaMinimum: 0.001,
      length: length,
      width: width,
      height: height,
      nodesRecords: state.subnetworkNodesRecords,
      linksRecords: state.subnetworkLinksRecords,
      state: state
    });
    // Restore simulation's progress.
    ActionExploration.monitorSimulationProgress(simulation, state);

    // TODO: This is the part where I need to initialize "tick" and "end" events for the simulation...

    // Compile variables' values.
    var novelVariablesValues = {
      simulationDimensions: simulationDimensions,
      simulationProgress: simulationProgress,
      simulation: simulation
    };
    var variablesValues = novelVariablesValues;
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }

  static initiateNovelSimulation()

  // TODO: 2. determine whether view's dimensions differ from those in state's variables
  // TODO: 3. if view's dimensions differ from state's variables, then it's necessary to re-initialize
  // TODO: ... force simulation...


  // TODO: simulation needs to call appropriate actions on ticks and end events
  // TODO: these include restoreSimulationProgress and restoreExplorationView

  /**
  * Creates and initiates a simulation of forces to determine positions of
  * network's nodes and links in a node-link diagram.
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
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Reference to simulation.
  */
  static createInitiateSimulation({alpha, alphaDecay, velocityDecay, alphaTarget, alphaMinimum, length, width, height, nodesRecords, linksRecords, state} = {}) {
    // Terminate any previous simulation.
    ActionExploration.terminateSimulation(state);
    // Create and initiate novel simulation.
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
    );
    // Return simulation.
    return simulation;
  }
  /**
  * Terminates any previous simulation in the application's state.
  * @param {Object} state Application's state.
  */
  static terminateSimulation(state) {
    // The simulation that creates the positions of nodes and links in the
    // network's diagram is an important and persistent part of the
    // application's state.
    // It is important to manage a single relevant simulation to avoid
    // continuations of previous simulations after changes to the application's
    // state.
    // This force simulation depends both on the subnetwork's elements and on
    // the dimensions of the view within the document object model.
    // Determine whether the application's state has a previous simulation.
    if (Model.determineSimulation(state)) {
      // Stop the previous simulation.
      // Replace the simulation in the application's state.
      state.simulation.on("tick", null).on("end", null);
      state.simulation.stop();
    }
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
    var total = ActionExploration.determineSimulationTotalIterations({
      alpha: alpha,
      alphaDecay: alphaDecay,
      alphaMinimum: alphaMinimum
    });
    // Compute iterations to complete before creating visual representations.
    var preparation = (total * factor);
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
  * Monitors the simulation's progress.
  * @param {Object} simulation Reference to simulation.
  * @param {Object} state Application's state.
  */
  static monitorSimulationProgress(simulation, state) {
    simulation
    .on("tick", function () {
      // Execute behavior during simulation's progress.
      // Confine positions within container.
      ActionExploration.confinePositions({
        records: self.nodesRecords,
        graphWidth: self.graphWidth,
        graphHeight: self.graphHeight
      });
      // Restore simulation's progress.
    })
    .on("end", function () {
      // Restore simulation's progress.
      // Execute behavior upon simulation's completion.
      // Confine positions within container.
      ActionExploration.confinePositions({
        records: self.nodesRecords,
        graphWidth: self.graphWidth,
        graphHeight: self.graphHeight
      });
      // Restore simulation's progress.

      // TODO: Designate simulation as complete so that TopologyView will know to refine representations of directionality on reactions' nodes and such.
      // TODO: within simulationProgress set completion to true
      // TODO: 



      // Prepare for subsequent restorations to positions in network's diagram.
      // Respond to simulation's progress and completion.
      // To restore positions in network's diagrams, respond to simulation in a
      // way to promote interactivity.
      self.progressSimulationRestorePositions(self);
    });
  }

  static confinePositions({} = {}) {}


  static restoreSimulationProgress() {}

  static determineDrawTopology() {}

  static restoreExplorationView() {}


  // TODO: State's variable to force draw topology will no longer be necessary...

  /**
  * Changes the selection of whether to force representation of subnetwork's
  * topology.
  * @param {Object} state Application's state.
  */
  static changeForceTopology(state) {
    // Determine whether to force topology.
    if (state.forceTopology) {
      var forceTopology = false;
    } else {
      var forceTopology = true;
    }
    // Compile variables' values.
    var novelVariablesValues = {
      forceTopology: forceTopology
    };
    var variablesValues = novelVariablesValues;
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }


  /**
  * Responds to a selection on the network's diagram.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.horizontalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.verticalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {Object} parameters.state Application's state.
  */
  static selectNetworkDiagram({horizontalPosition, verticalPosition, state} = {}) {
    // Change information about prompt view.
    var prompt = ActionPrompt.changeInformation({
      type: "network-diagram",
      reference: {},
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      horizontalShift: 0,
      verticalShift: 0,
      permanence: true,
      state: state
    });
    // Remove any entity selection.
    var entitySelection = ActionExploration.createInitialEntitySelection();
    // Compile variables' values.
    var novelVariablesValues = {
      prompt: prompt,
      entitySelection: entitySelection
    };
    var variablesValues = Object.assign(
      novelVariablesValues
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Responds to a selection on a network's node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {number} parameters.horizontalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.verticalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.horizontalShift Horizontal shift in pixels
  * relative to reference point.
  * @param {number} parameters.verticalShift Horizontal shift in pixels relative
  * to reference point.
  * @param {Object} parameters.state Application's state.
  */
  static selectNetworkNode({identifier, type, horizontalPosition, verticalPosition, horizontalShift, verticalShift, state} = {}) {
    // Determine novel information about entity selection.
    var entitySelection = ActionExploration.changeEntitySelection({
      identifier: identifier,
      type: type,
      state: state
    });
    // Determine whether to create prompt.
    // Determine whether node's entity has a selection.
    var selection = (
      (type === entitySelection.type) && (identifier === entitySelection.node)
    );
    if (selection) {
      // Create prompt for the network's node.
      // Compile reference information for prompt view.
      var reference = {
        identifier: identifier,
        type: type
      };
      // Change information about prompt view.
      var prompt = ActionPrompt.changeInformation({
        type: "network-node-abbreviation",
        reference: reference,
        horizontalPosition: horizontalPosition,
        verticalPosition: verticalPosition,
        horizontalShift: horizontalShift,
        verticalShift: verticalShift,
        permanence: false,
        state: state
      });
    } else {
      // Do not create prompt for the network's node.
      // Remove any prompt view.
      var prompt = ActionPrompt.initializeControls();
    }
    // Compile variables' values.
    var novelVariablesValues = {
      entitySelection: entitySelection,
      prompt: prompt
    };
    var variablesValues = Object.assign(
      novelVariablesValues
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of a node's entity.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Information about an entity selection.
  */
  static changeEntitySelection({identifier, type, state} = {}) {
    // Determine novel selection's information.
    if ((identifier.length > 0) && (type.length > 0)) {
      // Access information.
      if (type === "metabolite") {
        var node = state.networkNodesMetabolites[identifier];
        var candidate = state.candidatesMetabolites[node.candidate];
        var entity = state.metabolites[candidate.metabolite];
      } else if (type === "reaction") {
        var node = state.networkNodesReactions[identifier];
        var candidate = state.candidatesReactions[node.candidate];
        var entity = state.reactions[candidate.reaction];
      }
      if (candidate.identifier === state.entitySelection.candidate) {
        var entitySelection = ActionExploration.createInitialEntitySelection();
      } else {
        var entitySelection = {
          type: type,
          node: node.identifier,
          candidate: candidate.identifier,
          entity: entity.identifier
        };
      }
    } else {
      var entitySelection = ActionExploration.createInitialEntitySelection();
    }
    // Return information.
    return entitySelection;
  }
  /**
  * Responds to a hover on a network's node with selection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {number} parameters.horizontalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.verticalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.horizontalShift Horizontal shift in pixels
  * relative to reference point.
  * @param {number} parameters.verticalShift Horizontal shift in pixels relative
  * to reference point.
  * @param {Object} parameters.state Application's state.
  */
  static hoverSelectNetworkNode({identifier, type, horizontalPosition, verticalPosition, horizontalShift, verticalShift, state} = {}) {
    // Compile reference information for prompt view.
    var reference = {
      identifier: identifier,
      type: type
    };
    // Change information about prompt view.
    var prompt = ActionPrompt.changeInformation({
      type: "network-node-abbreviation",
      reference: reference,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      horizontalShift: horizontalShift,
      verticalShift: verticalShift,
      state: state
    });
    // Compile variables' values.
    var novelVariablesValues = {
      prompt: prompt
    };
    var variablesValues = Object.assign(
      novelVariablesValues
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }

  static lockAllNodesPositions() {
    // probably more efficient to just call same function on all nodes?
  }
  static unlockAllNodesPositions() {
    // probably more efficient to just call same function on all nodes?
  }
  static lockPromptNodePosition() {
    // call Action.lockNodePosition for prompt's node
    // then submit to app's state.
  }
  static unlockPromptNodePosition() {
    // call Action.unlockNodePosition for prompt's node
    // then submit to app's state.
  }
  static lockNodePosition() {
    // make this an indirect action that doesn't submit to app's state.
    // modify records for subnetwork's nodes and then return
  }
  static unlockNodePosition() {
    // make this an indirect action that doesn't submit to app's state.
    // modify records for subnetwork's nodes and then return
  }
  static removePromptNode() {}

}
