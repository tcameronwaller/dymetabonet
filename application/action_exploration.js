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
    var forceNetworkDiagram = false;
    var simulationDimensions = Simulation.createInitialSimulationDimensions();
    var simulationProgress = Simulation.createInitialSimulationProgress();
    var simulation = {};
    var simulationNodesRecords = [];
    var simulationLinksRecords = [];
    var entitySelection = ActionExploration.createInitialEntitySelection();
    // Compile information.
    var variablesValues = {
      forceNetworkDiagram: forceNetworkDiagram,
      simulationDimensions: simulationDimensions,
      simulationProgress: simulationProgress,
      simulation: simulation,
      simulationNodesRecords: simulationNodesRecords,
      simulationLinksRecords: simulationLinksRecords,
      entitySelection: entitySelection
    };
    // Return information.
    return variablesValues;
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
    // Determine whether to create novel simulation.
    var simulationControlsRecords = ActionExploration.determineNovelSimulation({
      length: length,
      width: width,
      height: height,
      nodesRecords: state.subnetworkNodesRecords,
      linksRecords: state.subnetworkLinksRecords,
      previousSimulation: state.simulation,
      state: state
    });
    // Determine which views to restore.
    var viewsRestoration = ActionInterface.changeViewsRestoration({
      skips: ["interface", "panel", "tip", "prompt", "summary", "control"],
      viewsRestoration: state.viewsRestoration
    });
    // Compile variables' values.
    var novelVariablesValues = {
      simulationDimensions: simulationDimensions,
      viewsRestoration: viewsRestoration
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      simulationControlsRecords
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Determines whether to create a novel simulation.
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
  * @returns {Object} References to novel simulation and its controls and
  * records.
  */
  static determineNovelSimulation({length, width, height, nodesRecords, linksRecords, previousSimulation, state} = {}) {
    // Determine whether to create a novel simulation for network's diagram.
    if (Model.determineNetworkDiagram(state)) {
      // Create novel simulation.
      var simulationControlsRecords = ActionExploration
      .createInitiateMonitorNovelPositionSimulation({
        length: length,
        width: width,
        height: height,
        nodesRecords: nodesRecords,
        linksRecords: linksRecords,
        previousSimulation: previousSimulation,
        state: state
      });
    } else {
      // Create empty simulation.
      var simulationControlsRecords = ActionExploration
      .initializeSimulationControlsRecords({
        nodesRecords: nodesRecords,
        linksRecords: linksRecords,
        previousSimulation: previousSimulation,
        state: state
      });
    }
    return simulationControlsRecords;
  }
  /**
  * Initializes a simulation, its controls, and records.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.nodesRecords Information about network's
  * nodes.
  * @param {Array<Object>} parameters.linksRecords Information about network's
  * links.
  * @param {Object} parameters.previousSimulation Reference to simulation.
  * @returns {Object} References to novel simulation and its controls and
  * records.
  */
  static initializeSimulationControlsRecords({nodesRecords, linksRecords, previousSimulation} = {}) {
    // Terminate any previous simulation.
    Simulation.terminateSimulation(previousSimulation);
    // Copy records for simulation.
    // These records will be mutable and will accept changes from the
    // simulation.
    var simulationNodesRecords = General
    .copyDeepArrayElements(nodesRecords, true);
    var simulationLinksRecords = General
    .copyDeepArrayElements(linksRecords, true);
    // Create novel simulation and its controls.
    var simulationControls = Simulation.createEmptySimulation();
    // Compile information.
    var novelVariablesValues = {
      simulationNodesRecords: simulationNodesRecords,
      simulationLinksRecords: simulationLinksRecords
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      simulationControls
    );
    // Return information.
    return variablesValues;
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
  * @returns {Object} References to novel simulation and its controls and
  * records.
  */
  static createInitiateMonitorNovelPositionSimulation({length, width, height, nodesRecords, linksRecords, previousSimulation, state} = {}) {
    // Terminate any previous simulation.
    Simulation.terminateSimulation(previousSimulation);
    // Copy records for simulation.
    // These records will be mutable and will accept changes from the
    // simulation.
    var simulationNodesRecords = General
    .copyDeepArrayElements(nodesRecords, true);
    var simulationLinksRecords = General
    .copyDeepArrayElements(linksRecords, true);
    // Create novel simulation and its controls.
    var simulationControls = Simulation.createNovelPositionSimulation({
      length: length,
      width: width,
      height: height,
      nodesRecords: simulationNodesRecords,
      linksRecords: simulationLinksRecords
    });
    // Monitor simulation's progress.
    ActionExploration.monitorSimulationProgress({
      simulation: simulationControls.simulation,
      state: state
    });
    // Initiate simulation.
    simulationControls.simulation.restart();
    // Compile information.
    var novelVariablesValues = {
      simulationNodesRecords: simulationNodesRecords,
      simulationLinksRecords: simulationLinksRecords
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      simulationControls
    );
    // Return information.
    return variablesValues;
  }
  /**
  * Monitors the simulation's progress.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.simulation Reference to simulation.
  * @param {Object} parameters.state Application's state.
  */
  static monitorSimulationProgress({simulation, state} = {}) {
    simulation
    .on("tick", function () {
      // Execute behavior during simulation's progress.
      // Restore simulation's progress.
      ActionExploration.restoreSimulationProgress({
        completion: false,
        state: state
      });
    })
    .on("end", function () {
      // Execute behavior upon simulation's completion.
      // Restore simulation's progress.
      ActionExploration.restoreSimulationProgress({
        completion: true,
        state: state
      });
    });
  }
  /**
  * Restores information about simulation's progress.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.completion Whether simulation is complete.
  * @param {Object} parameters.state Application's state.
  */
  static restoreSimulationProgress({completion, state} = {}) {
    // Confine positions within container.
    var simulationNodesRecords = Simulation.confineSimulationPositions({
      nodesRecords: state.simulationNodesRecords,
      width: state.simulationDimensions.width,
      height: state.simulationDimensions.height
    });
    // Restore simulation's progress.
    var novelCount = state.simulationProgress.count + 1;
    var novelEntries = {
      count: novelCount,
      completion: completion
    };
    var novelProgress = Object.assign(state.simulationProgress, novelEntries);
    // Determine whether simulation is complete.
    if (!completion) {
      // Restore only the minimal portion of application's state and interface.
      // Determine which views to restore.
      var viewsRestoration = ActionInterface.changeViewsRestoration({
        skips: ["interface", "panel", "tip", "prompt", "summary", "control"],
        viewsRestoration: state.viewsRestoration
      });
    } else {
      // Restore the entire application's state and interface.
      // Determine which views to restore.
      var viewsRestoration = ActionInterface.changeViewsRestoration({
        skips: [],
        viewsRestoration: state.viewsRestoration
      });
    }
    // Compile variables' values.
    var novelVariablesValues = {
      simulationNodesRecords: simulationNodesRecords,
      simulationProgress: novelProgress,
      viewsRestoration: viewsRestoration
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
  * Forces the representation of the network's diagram.
  * @param {Object} state Application's state.
  */
  static forceNetworkDiagram(state) {
    // Compile variables' values.
    var novelVariablesValues = {
      forceNetworkDiagram: true
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
