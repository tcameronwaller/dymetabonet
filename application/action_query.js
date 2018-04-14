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
class ActionQuery {

  // Direct actions.

  /**
  * Restores values of application's variables for controls relevant to view.
  * @param {Object} state Application's state.
  */
  static restoreControls(state) {
    // Initialize view's controls.
    var controls = ActionQuery.initializeSubordinateControls();
    // Derive dependent state.
    var dependentStateVariables = ActionQuery.deriveState({
      combination: state.traversalCombination,
      networkNodesRecords: state.networkNodesRecords,
      networkLinksRecords: state.networkLinksRecords,
      state: state
    });
    // Determine which views to restore.
    var viewsRestoration = ActionInterface.changeViewsRestoration({
      skips: [],
      viewsRestoration: state.viewsRestoration
    });
    // Compile variables' values.
    var novelVariablesValues = {
      viewsRestoration: viewsRestoration
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      controls,
      dependentStateVariables
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of combination in traversal view.
  * @param {string} combination Method of combination, union or difference.
  * @param {Object} state Application's state.
  */
  static changeCombination(combination, state) {
    // Initialize controls for traversal view.
    var traversalViewControls = ActionQuery.initializeSubordinateControls();
    // Compile variables' values.
    var novelVariablesValues = {
      traversalCombination: combination
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      traversalViewControls
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of type of controls in traversal view.
  * @param {string} type Type of traversal, rogue, proximity, or path.
  * @param {Object} state Application's state.
  */
  static changeType(type, state) {
    // Compile variables' values.
    var novelVariablesValues = {
      traversalType: type
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of focus for rogue traversal.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  */
  static changeRogueFocus({identifier, type, state} = {}) {
    // Create record.
    var record = {
      identifier: identifier,
      type: type
    };
    // Compile variables' values.
    var novelVariablesValues = {
      traversalRogueFocus: record
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Executes rogue traversal and combination on the network.
  * @param {Object} state Application's state.
  */
  static executeRogueCombination(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determineRogueTraversal(state)) {
      var subnetworkElements = Traversal.combineRogueNodeNetwork({
        focus: state.traversalRogueFocus.identifier,
        combination: state.traversalCombination,
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Initialize controls for traversal view.
      var traversalViewControls = ActionQuery.initializeControls();
      // Compile variables' values.
      var variablesValues = Object.assign(
        subnetworkElements,
        traversalViewControls
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Executes rogue traversal and union on the network.
  * @param {Object} state Application's state.
  */
  static executeRogueUnion(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determineRogueTraversal(state)) {
      var subnetworkElements = Traversal.combineRogueNodeNetwork({
        focus: state.traversalRogueFocus.identifier,
        combination: "union",
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Initialize controls for traversal view.
      var traversalViewControls = ActionQuery.initializeControls();
      // Initialize controls for pompt view.
      var prompt = ActionPrompt.initializeControls();
      // Compile variables' values.
      var novelVariablesValues = {
        prompt: prompt
      };
      var variablesValues = Object.assign(
        novelVariablesValues,
        subnetworkElements,
        traversalViewControls
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Changes the selection of focus for proximity traversal.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  */
  static changeProximityFocus({identifier, type, state} = {}) {
    // Create record.
    var record = {
      identifier: identifier,
      type: type
    };
    // Compile variables' values.
    var novelVariablesValues = {
      traversalProximityFocus: record
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of direction for proximity traversal.
  * @param {Object} state Application's state.
  */
  static changeProximityDirection(state) {
    // Determine direction.
    if (state.traversalProximityDirection === "successors") {
      var direction = "neighbors";
    } else if (state.traversalProximityDirection === "neighbors") {
      var direction = "predecessors";
    } else if (state.traversalProximityDirection === "predecessors") {
      var direction = "successors";
    }
    // Compile variables' values.
    var novelVariablesValues = {
      traversalProximityDirection: direction
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of depth for proximity traversal.
  * @param {number} depth Depth in links to which to traverse.
  * @param {Object} state Application's state.
  */
  static changeProximityDepth(depth, state) {
    // Compile variables' values.
    var novelVariablesValues = {
      traversalProximityDepth: depth
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }

  // TODO: All query executions should call ActionExploration.deriveState()...

  /**
  * Executes proximity traversal and combination on the network.
  * @param {Object} state Application's state.
  */
  static executeProximityCombination(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determineProximityTraversal(state)) {
      var subnetworkElements = Traversal.combineProximityNetwork({
        focus: state.traversalProximityFocus.identifier,
        direction: state.traversalProximityDirection,
        depth: state.traversalProximityDepth,
        combination: state.traversalCombination,
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Initialize controls for traversal view.
      var traversalViewControls = ActionQuery.initializeControls();
      // Compile variables' values.
      var variablesValues = Object.assign(
        subnetworkElements,
        traversalViewControls
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Executes proximity traversal expansion to depth of one and combination by
  * union.
  * @param {Object} state Application's state.
  */
  static executeProximityExpansion(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determineProximityTraversal(state)) {
      var subnetworkElements = Traversal.combineProximityNetwork({
        focus: state.prompt.reference.identifier,
        direction: "neighbors",
        depth: 1,
        combination: "union",
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Initialize controls for traversal view.
      var traversalViewControls = ActionQuery.initializeControls();
      // Remove any prompt view.
      var prompt = ActionPrompt.initializeControls();
      // Compile variables' values.
      var novelVariablesValues = {
        prompt: prompt
      };
      var variablesValues = Object.assign(
        novelVariablesValues,
        subnetworkElements,
        traversalViewControls
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Changes the selection of source for path traversal.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  */
  static changePathSource({identifier, type, state} = {}) {
    // Create record.
    var record = {
      identifier: identifier,
      type: type
    };
    // Compile variables' values.
    var novelVariablesValues = {
      traversalPathSource: record
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of target for path traversal.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  */
  static changePathTarget({identifier, type, state} = {}) {
    // Create record.
    var record = {
      identifier: identifier,
      type: type
    };
    // Compile variables' values.
    var novelVariablesValues = {
      traversalPathTarget: record
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of direction for path traversal.
  * @param {Object} state Application's state.
  */
  static changePathDirection(state) {
    // Determine direction.
    if (state.traversalPathDirection === "forward") {
      var direction = "both";
    } else if (state.traversalPathDirection === "both") {
      var direction = "reverse";
    } else if (state.traversalPathDirection === "reverse") {
      var direction = "forward";
    }
    // Compile variables' values.
    var novelVariablesValues = {
      traversalPathDirection: direction
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of count for a traversal's method.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.count Count of paths to collect between each pair
  * of targets.
  * @param {string} parameters.type Type of method for traversal, path or
  * connection.
  * @param {Object} parameters.state Application's state.
  */
  static changeTypeCount({count, type, state} = {}) {
    // Determine type of traversal.
    if (type === "path") {
      var variableName = "traversalPathCount";
    } else if (type === "connection") {
      var variableName = "traversalConnectionCount";
    }
    // Compile variables' values.
    var novelVariablesValues = {
      [variableName]: count
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Executes path traversal and combination on the network.
  * @param {Object} state Application's state.
  */
  static executePathCombination(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determinePathTraversal(state)) {
      var subnetworkElements = Traversal.combinePathNetwork({
        source: state.traversalPathSource.identifier,
        target: state.traversalPathTarget.identifier,
        direction: state.traversalPathDirection,
        count: state.traversalPathCount,
        combination: state.traversalCombination,
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Initialize controls for traversal view.
      var traversalViewControls = ActionQuery.initializeControls();
      // Compile variables' values.
      var variablesValues = Object.assign(
        subnetworkElements,
        traversalViewControls
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Changes the selection of target for connection traversal.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  */
  static changeConnectionTarget({identifier, type, state} = {}) {
    // Create record.
    var record = {
      identifier: identifier,
      type: type
    };
    // Compile variables' values.
    var novelVariablesValues = {
      traversalConnectionTarget: record
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Includes a node in the targets for connection traversal.
  * @param {Object} state Application's state.
  */
  static includeConnectionTarget(state) {
    // Determine whether there is a valid candidate for inclusion.
    if (state.traversalConnectionTarget.identifier.length > 0) {
      // Determine whether collection of targets includes the node.
      var match = state
      .traversalConnectionTargets.find(function (record) {
        return (
          (
            record.identifier === state
            .traversalConnectionTarget.identifier
          ) &&
          (record.type === state.traversalConnectionTarget.type)
        );
      });
      if (!match) {
        // Create record.
        var record = {
          identifier: state.traversalConnectionTarget.identifier,
          type: state.traversalConnectionTarget.type
        };
        // Include record in collection.
        var traversalConnectionTargets = state
        .traversalConnectionTargets.concat(record);
      } else {
        var tranversalConnectionTargets = state
        .traversalConnectionTargets;
      }
      // Restore candidate.
      var traversalConnectionTarget = {identifier: "", type: ""};
      // Compile variables' values.
      var novelVariablesValues = {
        traversalConnectionTargets: traversalConnectionTargets,
        traversalConnectionTarget: traversalConnectionTarget
      };
      var variablesValues = Object.assign(novelVariablesValues);
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Excludes a node from targets for connection traversal.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  */
  static excludeConnectionTarget({identifier, type, state} = {}) {
    var traversalConnectionTargets = state
    .traversalConnectionTargets.filter(function (record) {
      return !((record.identifier === identifier) && (record.type === type));
    });
    // Compile variables' values.
    var novelVariablesValues = {
      traversalConnectionTargets: traversalConnectionTargets
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Executes connection traversal and combination on the network.
  * @param {Object} state Application's state.
  */
  static executeConnectionCombination(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determineConnectionTraversal(state)) {
      // Extract targets.
      var targets = General
      .collectValueFromObjects("identifier", state.traversalConnectionTargets);
      var subnetworkElements = Traversal.combineConnectionNetwork({
        targets: targets,
        count: state.traversalConnectionCount,
        combination: state.traversalCombination,
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Initialize controls for traversal view.
      var traversalViewControls = ActionQuery.initializeControls();
      // Compile variables' values.
      var variablesValues = Object.assign(
        subnetworkElements,
        traversalViewControls
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }

  // Indirect actions.

  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeControls() {
    // Initialize controls.
    var traversalCombination = "difference";
    var traversalType = "rogue";
    var traversalProximityDirection = "successors";
    var traversalProximityDepth = 1;
    var traversalPathDirection = "forward";
    var traversalPathCount = 1;
    var traversalConnectionCount = 1;
    var subordinateControls = ActionQuery.initializeSubordinateControls();
    // Compile information.
    var novelVariablesValues = {
      traversalCombination: traversalCombination,
      traversalType: traversalType,
      traversalProximityDirection: traversalProximityDirection,
      traversalProximityDepth: traversalProximityDepth,
      traversalPathDirection: traversalPathDirection,
      traversalPathCount: traversalPathCount,
      traversalConnectionCount: traversalConnectionCount
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
    // Subordinate controls depend on query's combination and require
    // initialization upon change of query's combination.
    // Initialize controls.
    var traversalRogueFocus = {identifier: "", type: ""};
    var traversalProximityFocus = {identifier: "", type: ""};
    var traversalPathSource = {identifier: "", type: ""};
    var traversalPathTarget = {identifier: "", type: ""};
    var traversalConnectionTarget = {identifier: "", type: ""};
    var traversalConnectionTargets = [];
    // Compile information.
    var variablesValues = {
      traversalRogueFocus: traversalRogueFocus,
      traversalProximityFocus: traversalProximityFocus,
      traversalPathSource: traversalPathSource,
      traversalPathTarget: traversalPathTarget,
      traversalConnectionTarget: traversalConnectionTarget,
      traversalConnectionTargets: traversalConnectionTargets
    };
    // Return information.
    return variablesValues;
  }
  /**
  * Derives application's dependent state from controls relevant to view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.combination Method of combination, union or
  * difference.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Values of application's variables.
  */
  static deriveState({combination, networkNodesRecords, networkLinksRecords, state} = {}) {
    // Derive state relevant to view.
    // Initialize controls for query view.
    var subordinateControls = ActionQuery.initializeSubordinateControls();
    // Create subnetwork's elements.
    if (combination === "union") {
      var subnetworkElements = {
        subnetworkNodesRecords: [],
        subnetworkLinksRecords: []
      };
    } else if (combination === "difference") {
      var subnetworkElements = Network.copyNetworkElementsRecords({
        networkNodesRecords: networkNodesRecords,
        networkLinksRecords: networkLinksRecords
      });
    }
    // Derive dependent state.
    var dependentStateVariables = ActionExploration.deriveState({
      simulationDimensions: state.simulationDimensions,
      previousSimulation: state.simulation,
      subnetworkNodesRecords: subnetworkElements.subnetworkNodesRecords,
      subnetworkLinksRecords: subnetworkElements.subnetworkLinksRecords,
      state: state
    });
    // Compile information.
    var novelVariablesValues = {};
    var variablesValues = Object.assign(
      novelVariablesValues,
      subordinateControls,
      subnetworkElements,
      dependentStateVariables
    );
    // Return information.
    return variablesValues;
  }

}
