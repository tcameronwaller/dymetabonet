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
  * @param {Object} parameters.state Application's state.
  */
  static changeSimulationDimensions({length, width, height, state} = {}) {
    // Determine novel simulation's dimensions.
    var simulationDimensions = {
      length: length,
      width: width,
      height: height
    };
    // Initiate novel simulation.
    var simulationControls = ActionExploration
    .createInitiateMonitorNovelPositionSimulation({
      length: length,
      width: width,
      height: height,
      nodesRecords: state.subnetworkNodesRecords,
      linksRecords: state.subnetworkLinksRecords,
      previousSimulation: state.simulation,
      state: state
    });





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
  * @param {Object} parameters.previousSimulation Reference to simulation.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} References to novel simulation and its controls.
  */
  static createInitiateMonitorNovelPositionSimulation({length, width, height, nodesRecords, linksRecords, previousSimulation, state} = {}) {
    // Terminate any previous simulation.
    Simulation.terminateSimulation(previousSimulation);
    // Create novel simulation and its controls.
    var simulationControls = Simulation.createNovelPositionSimulation({
      length: length,
      width: width,
      height: height,
      nodesRecords: nodesRecords,
      linksRecords: linksRecords
    });
    // Monitor simulation's progress.
    ActionExploration.monitorSimulationProgress({
      width: width,
      height: height,
      simulation: simulationControls.simulation,
      state: state
    });
    // Initiate simulation.
    simulationControls.simulation.restart();

    // Compile information.

    // TODO: do this...

  }

  // TODO: simulation needs to call appropriate actions on ticks and end events
  // TODO: these include restoreSimulationProgress and restoreExplorationView

  /**
  * Monitors the simulation's progress.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.width Container's width in pixels.
  * @param {number} parameters.height Container's height in pixels.
  * @param {Object} parameters.simulation Reference to simulation.
  * @param {Object} parameters.state Application's state.
  */
  static monitorSimulationProgress({width, height, simulation, state} = {}) {
    simulation
    .on("tick", function () {
      // TODO: update references to variables such as graph dimensions...

      // Execute behavior during simulation's progress.
      // Confine positions within container.
      // TODO: Should I return new nodesRecords from this function?
      ActionExploration.confinePositions({
        records: state.subnetworkNodesRecords,
        width: width,
        height: height
      });
      // Restore simulation's progress.
    })
    .on("end", function () {
      // Restore simulation's progress.
      // Execute behavior upon simulation's completion.
      // Confine positions within container.
      ActionExploration.confinePositions({
        records: state.subnetworkNodesRecords,
        width: width,
        height: height
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
