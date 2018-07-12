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

  // TODO: I don't think I need to restore state with each iteration of the simulation...
  // TODO: D3 handles updates to the associated data

  // TODO: actually... I do need to restore state for the sake of the progress view, I think.

  // TODO: I DON'T KNOW HOW TO HANDLE THE SIMULATION FOR DRAG INTERACTIONS...
  // TODO: WILL THE D3 DRAG EVENT PROPAGATE WITH UPDATE'S TO THE STATE?

  // TODO: Re-initialize the simulation whenever the subnetwork changes
  // TODO: but not with other, irrelevant changes to state
  // TODO: Application should always be working on simulation for the current subnetwork
  // TODO: no more requirement to force draw for large networks.

  // Direct actions.

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
    // Derive dependent state.
    var dependentStateVariables = ActionExploration.deriveState({
      simulationDimensions: simulationDimensions,
      forceNetworkDiagram: state.forceNetworkDiagram,
      subnetworkNodesRecords: state.subnetworkNodesRecords,
      subnetworkLinksRecords: state.subnetworkLinksRecords,
      viewsRestoration: state.viewsRestoration,
      state: state
    });
    // Compile variables' values.
    var novelVariablesValues = {
      simulationDimensions: simulationDimensions
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      dependentStateVariables
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Restores information about simulation's progress.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.completion Whether simulation is complete.
  * @param {Object} parameters.state Application's state.
  */
  static restoreSimulationProgress({completion, state} = {}) {
    // Allow records for nodes and links to mutate with simulation's iterations.
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
    // Change whether to force representation of network's diagram.
    var forceNetworkDiagram = true;
    // Derive dependent state.
    var dependentStateVariables = ActionExploration.deriveState({
      simulationDimensions: state.simulationDimensions,
      forceNetworkDiagram: forceNetworkDiagram,
      subnetworkNodesRecords: state.subnetworkNodesRecords,
      subnetworkLinksRecords: state.subnetworkLinksRecords,
      viewsRestoration: state.viewsRestoration,
      state: state
    });
    // Compile variables' values.
    var novelVariablesValues = {
      simulationDimensions: simulationDimensions
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      dependentStateVariables
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }

  // Indirect actions.

  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeControls() {
    // Initialize controls.
    var simulationDimensions = Simulation.createInitialSimulationDimensions();
    // Create novel simulation and its controls.
    var simulation = Simulation.createEmptySimulation();
    var simulationProgress = Simulation.createInitialSimulationProgress();
    var simulationNodesRecords = [];
    var simulationLinksRecords = [];
    // Initialize subordinate controls.
    var subordinateControls = ActionExploration.initializeSubordinateControls();
    // Compile information.
    var novelVariablesValues = {
      simulationDimensions: simulationDimensions,
      simulation: simulation,
      simulationProgress: simulationProgress,
      simulationNodesRecords: simulationNodesRecords,
      simulationLinksRecords: simulationLinksRecords
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      subordinateControls
    );
    // Return information.
    return variablesValues;
  }
  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeSubordinateControls() {
    var forceNetworkDiagram = false;
    var entitySelection = ActionExploration.createInitialEntitySelection();
    // Compile information.
    var variablesValues = {
      forceNetworkDiagram: forceNetworkDiagram,
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
  * Derives application's dependent state from controls relevant to view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.simulationDimensions Dimensions of elements and
  * container for simulation.
  * @param {boolean} parameters.forceNetworkDiagram Whether to represent a
  * diagram even for a large network.
  * @param {Array<Object>} parameters.subnetworkNodesRecords Information about
  * subnetwork's nodes.
  * @param {Array<Object>} parameters.subnetworkLinksRecords Information about
  * subnetwork's links.
  * @param {Object<boolean>} parameters.viewsRestoration Information about
  * whether to restore each view.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Values of application's variables.
  */
  static deriveState({simulationDimensions, forceNetworkDiagram, subnetworkNodesRecords, subnetworkLinksRecords, viewsRestoration, state} = {}) {
    // Derive state relevant to view.
    // Determine whether to create novel simulation.
    // It is necessary to terminate any previous simulations when creating a
    // novel simulation.
    var simulationControlsRecords = ActionExploration.determineNovelSimulation({
      forceNetworkDiagram: forceNetworkDiagram,
      simulationDimensions: simulationDimensions,
      nodesRecords: subnetworkNodesRecords,
      linksRecords: subnetworkLinksRecords,
      previousSimulation: state.simulation,
      state: state
    });
    // Determine which views to restore.
    var novelViewsRestoration = ActionInterface.changeViewsRestoration({
      views: [
        "exploration",
        "notice",
        "progress",
        "topology"
      ],
      type: true,
      viewsRestoration: viewsRestoration
    });
    // Derive dependent state.
    // TODO: Maybe tipView and promptView are dependent on ExplorationView?
    var dependentStateVariables = {};
    // Compile information.
    var novelVariablesValues = {
      viewsRestoration: novelViewsRestoration
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      simulationControlsRecords,
      dependentStateVariables
    );
    // Return information.
    return variablesValues;
  }



  /**
  * Determines whether to create a novel simulation.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.forceNetworkDiagram Whether to represent a
  * diagram even for a large network.
  * @param {Object} parameters.simulationDimensions Dimensions of elements and
  * container for simulation.
  * @param {Array<Object>} parameters.nodesRecords Information about network's
  * nodes.
  * @param {Array<Object>} parameters.linksRecords Information about network's
  * links.
  * @param {Object} parameters.previousSimulation Reference to simulation.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} References to novel simulation and its controls and
  * records.
  */
  static determineNovelSimulation({forceNetworkDiagram, simulationDimensions, nodesRecords, linksRecords, previousSimulation, state} = {}) {
    // Determine whether to create a novel simulation for network's diagram.
    var temporaryState = {
      forceNetworkDiagram: forceNetworkDiagram,
      subnetworkNodesRecords: nodesRecords
    };
    if (Model.determineNetworkDiagram(temporaryState)) {
      // Create novel simulation.
      var simulationControlsRecords = ActionExploration
      .createInitiateMonitorNovelPositionSimulation({
        simulationDimensions: simulationDimensions,
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
    var simulation = Simulation.createEmptySimulation();
    var simulationProgress = Simulation.createInitialSimulationProgress();
    // Compile information.
    var novelVariablesValues = {
      simulationNodesRecords: simulationNodesRecords,
      simulationLinksRecords: simulationLinksRecords,
      simulation: simulation,
      simulationProgress: simulationProgress
    };
    var variablesValues = Object.assign(
      novelVariablesValues
    );
    // Return information.
    return variablesValues;
  }
  /**
  * Creates a novel simulation to determine the optimal positions of nodes and
  * links in network's diagram.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.simulationDimensions Dimensions of elements and
  * container for simulation.
  * @param {Array<Object>} parameters.nodesRecords Information about network's
  * nodes.
  * @param {Array<Object>} parameters.linksRecords Information about network's
  * links.
  * @param {Object} parameters.previousSimulation Reference to simulation.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} References to novel simulation and its controls and
  * records.
  */
  static createInitiateMonitorNovelPositionSimulation({simulationDimensions, nodesRecords, linksRecords, previousSimulation, state} = {}) {
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
      length: simulationDimensions.length,
      width: simulationDimensions.width,
      height: simulationDimensions.height,
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



  // TODO: need updates...

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
