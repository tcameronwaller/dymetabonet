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

  // TODO: ActionQuery is a bit special...
  // TODO: Only actions that execute queries really need to re-derive dependent state variables...
  // TODO: ... well, that isn't actually correct. As written, changeCombination might actually need to back up to call ActionSubnetwork.deriveState().
  // TODO: It might be better to follow the pattern for all other view's deriveState procedures.

// 1. application initiation...
// ... initial controls, create subnetwork's initial elements accordingly
// ... derive downstream dependent state (primarily exploration view)
// 2. changeCombination...
// ... create subnetwork's initial elements accordingly
// ... derive downstream dependent state (primarily exploration view)
// 3.

// Maybe the a single execute procedure could call the derive State to execute the correct query and then derive state?

  // Direct actions.

  // TODO: changeCombination needs to reset the variable to re-initialize subnetwork's elements.
  // TODO: changeCombination needs to call deriveState to actually re-initialize subnetwork's elements and restore downstream variables.

  /**
  * Changes the selection of combination in query view.
  * @param {string} combination Method of combination, union or difference.
  * @param {Object} state Application's state.
  */
  static changeCombination(combination, state) {
    // Initialize controls for query view.
    var queryViewControls = ActionQuery.initializeSubordinateControls();
    // Compile variables' values.
    var novelVariablesValues = {
      queryCombination: combination
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      queryViewControls
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of type of controls in query view.
  * @param {string} type Type of query, rogue, proximity, or path.
  * @param {Object} state Application's state.
  */
  static changeType(type, state) {
    // Compile variables' values.
    var novelVariablesValues = {
      queryType: type
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of focus for rogue query.
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
      queryRogueFocus: record
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of focus for proximity query.
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
      queryProximityFocus: record
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of direction for proximity query.
  * @param {Object} state Application's state.
  */
  static changeProximityDirection(state) {
    // Determine direction.
    if (state.queryProximityDirection === "successors") {
      var direction = "neighbors";
    } else if (state.queryProximityDirection === "neighbors") {
      var direction = "predecessors";
    } else if (state.queryProximityDirection === "predecessors") {
      var direction = "successors";
    }
    // Compile variables' values.
    var novelVariablesValues = {
      queryProximityDirection: direction
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of depth for proximity query.
  * @param {number} depth Depth in links to which to traverse.
  * @param {Object} state Application's state.
  */
  static changeProximityDepth(depth, state) {
    // Compile variables' values.
    var novelVariablesValues = {
      queryProximityDepth: depth
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of source for path query.
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
      queryPathSource: record
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of target for path query.
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
      queryPathTarget: record
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of direction for path query.
  * @param {Object} state Application's state.
  */
  static changePathDirection(state) {
    // Determine direction.
    if (state.queryPathDirection === "forward") {
      var direction = "both";
    } else if (state.queryPathDirection === "both") {
      var direction = "reverse";
    } else if (state.queryPathDirection === "reverse") {
      var direction = "forward";
    }
    // Compile variables' values.
    var novelVariablesValues = {
      queryPathDirection: direction
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of count for a query's method.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.count Count of paths to collect between each pair
  * of targets.
  * @param {string} parameters.type Type of method for query, path or
  * connection.
  * @param {Object} parameters.state Application's state.
  */
  static changeTypeCount({count, type, state} = {}) {
    // Determine type of query.
    if (type === "path") {
      var variableName = "queryPathCount";
    } else if (type === "connection") {
      var variableName = "queryConnectionCount";
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
  * Changes the selection of target for connection query.
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
      queryConnectionTarget: record
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Includes a node in the targets for connection query.
  * @param {Object} state Application's state.
  */
  static includeConnectionTarget(state) {
    // Determine whether there is a valid candidate for inclusion.
    if (state.queryConnectionTarget.identifier.length > 0) {
      // Determine whether collection of targets includes the node.
      var match = state
      .queryConnectionTargets.find(function (record) {
        return (
          (
            record.identifier === state
            .queryConnectionTarget.identifier
          ) &&
          (record.type === state.queryConnectionTarget.type)
        );
      });
      if (!match) {
        // Create record.
        var record = {
          identifier: state.queryConnectionTarget.identifier,
          type: state.queryConnectionTarget.type
        };
        // Include record in collection.
        var queryConnectionTargets = state
        .queryConnectionTargets.concat(record);
      } else {
        var tranversalConnectionTargets = state
        .queryConnectionTargets;
      }
      // Restore candidate.
      var queryConnectionTarget = {identifier: "", type: ""};
      // Compile variables' values.
      var novelVariablesValues = {
        queryConnectionTargets: queryConnectionTargets,
        queryConnectionTarget: queryConnectionTarget
      };
      var variablesValues = Object.assign(novelVariablesValues);
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }

  // TODO: Execute all queries from the same root procedure...
  // TODO: Determine query type from the queryType state variable.
  // TODO: The subordinate, specific query procedures need to check (Model methods) that state is ready for each type of query
  // TODO: these action procedures are the gate-keepers. they only execute query and deriveState if appropriate.

  // TODO: The query procedure needs to pass novel variables' values to the application's state.
  // TODO: Then the query needs to call deriveState to actually execute the query and update the subnetwork.

  // TODO: executeQuery(state) {}

  /**
  * Executes rogue query and combination on the network.
  * @param {Object} state Application's state.
  */
  static executeRogueCombination(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determineRogueQuery(state)) {
      var subnetworkElements = Query.combineRogueNodeNetwork({
        focus: state.queryRogueFocus.identifier,
        combination: state.queryCombination,
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Initialize controls for query view.
      var queryViewControls = ActionQuery.initializeControls();
      // Compile variables' values.
      var variablesValues = Object.assign(
        subnetworkElements,
        queryViewControls
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Executes rogue query and union on the network.
  * @param {Object} state Application's state.
  */
  static executeRogueUnion(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determineRogueQuery(state)) {
      var subnetworkElements = Query.combineRogueNodeNetwork({
        focus: state.queryRogueFocus.identifier,
        combination: "union",
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Initialize controls for query view.
      var queryViewControls = ActionQuery.initializeControls();
      // Initialize controls for pompt view.
      var prompt = ActionPrompt.initializeControls();
      // Compile variables' values.
      var novelVariablesValues = {
        prompt: prompt
      };
      var variablesValues = Object.assign(
        novelVariablesValues,
        subnetworkElements,
        queryViewControls
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Executes proximity query and combination on the network.
  * @param {Object} state Application's state.
  */
  static executeProximityCombination(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determineProximityQuery(state)) {
      var subnetworkElements = Query.combineProximityNetwork({
        focus: state.queryProximityFocus.identifier,
        direction: state.queryProximityDirection,
        depth: state.queryProximityDepth,
        combination: state.queryCombination,
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Derive dependent state.
      var dependentStateVariables = ActionExploration.deriveState({
        simulationDimensions: state.simulationDimensions,
        previousSimulation: state.simulation,
        subnetworkNodesRecords: subnetworkElements.subnetworkNodesRecords,
        subnetworkLinksRecords: subnetworkElements.subnetworkLinksRecords,
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
        subnetworkElements,
        dependentStateVariables
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Executes proximity query expansion to depth of one and combination by
  * union.
  * @param {Object} state Application's state.
  */
  static executeProximityExpansion(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determineProximityQuery(state)) {
      var subnetworkElements = Query.combineProximityNetwork({
        focus: state.prompt.reference.identifier,
        direction: "neighbors",
        depth: 1,
        combination: "union",
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Initialize controls for query view.
      var queryViewControls = ActionQuery.initializeControls();
      // Remove any prompt view.
      var prompt = ActionPrompt.initializeControls();
      // Compile variables' values.
      var novelVariablesValues = {
        prompt: prompt
      };
      var variablesValues = Object.assign(
        novelVariablesValues,
        subnetworkElements,
        queryViewControls
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Executes path query and combination on the network.
  * @param {Object} state Application's state.
  */
  static executePathCombination(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determinePathQuery(state)) {
      var subnetworkElements = Query.combinePathNetwork({
        source: state.queryPathSource.identifier,
        target: state.queryPathTarget.identifier,
        direction: state.queryPathDirection,
        count: state.queryPathCount,
        combination: state.queryCombination,
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Derive dependent state.
      var dependentStateVariables = ActionExploration.deriveState({
        simulationDimensions: state.simulationDimensions,
        previousSimulation: state.simulation,
        subnetworkNodesRecords: subnetworkElements.subnetworkNodesRecords,
        subnetworkLinksRecords: subnetworkElements.subnetworkLinksRecords,
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
        subnetworkElements,
        dependentStateVariables
      );
      // Submit variables' values to the application's state.
      ActionGeneral.submitStateVariablesValues({
        variablesValues: variablesValues,
        state: state
      });
    }
  }
  /**
  * Excludes a node from targets for connection query.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  */
  static excludeConnectionTarget({identifier, type, state} = {}) {
    var queryConnectionTargets = state
    .queryConnectionTargets.filter(function (record) {
      return !((record.identifier === identifier) && (record.type === type));
    });
    // Compile variables' values.
    var novelVariablesValues = {
      queryConnectionTargets: queryConnectionTargets
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Executes connection query and combination on the network.
  * @param {Object} state Application's state.
  */
  static executeConnectionCombination(state) {
    // Determine whether application's state includes valid variables for
    // procedure.
    if (Model.determineConnectionQuery(state)) {
      // Extract targets.
      var targets = General
      .collectValueFromObjects("identifier", state.queryConnectionTargets);
      var subnetworkElements = Query.combineConnectionNetwork({
        targets: targets,
        count: state.queryConnectionCount,
        combination: state.queryCombination,
        subnetworkNodesRecords: state.subnetworkNodesRecords,
        subnetworkLinksRecords: state.subnetworkLinksRecords,
        networkNodesRecords: state.networkNodesRecords,
        networkLinksRecords: state.networkLinksRecords
      });
      // Derive dependent state.
      var dependentStateVariables = ActionExploration.deriveState({
        simulationDimensions: state.simulationDimensions,
        previousSimulation: state.simulation,
        subnetworkNodesRecords: subnetworkElements.subnetworkNodesRecords,
        subnetworkLinksRecords: subnetworkElements.subnetworkLinksRecords,
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
        subnetworkElements,
        dependentStateVariables
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
    var subnetworkRestoration = true;
    var queryCombination = "difference";
    var queryType = "rogue";
    var queryProximityDirection = "successors";
    var queryProximityDepth = 1;
    var queryPathDirection = "forward";
    var queryPathCount = 1;
    var queryConnectionCount = 1;
    var subordinateControls = ActionQuery.initializeSubordinateControls();
    // Compile information.
    var novelVariablesValues = {
      subnetworkRestoration: subnetworkRestoration,
      queryCombination: queryCombination,
      queryType: queryType,
      queryProximityDirection: queryProximityDirection,
      queryProximityDepth: queryProximityDepth,
      queryPathDirection: queryPathDirection,
      queryPathCount: queryPathCount,
      queryConnectionCount: queryConnectionCount
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
    var queryRogueFocus = {identifier: "", type: ""};
    var queryProximityFocus = {identifier: "", type: ""};
    var queryPathSource = {identifier: "", type: ""};
    var queryPathTarget = {identifier: "", type: ""};
    var queryConnectionTarget = {identifier: "", type: ""};
    var queryConnectionTargets = [];
    // Compile information.
    var variablesValues = {
      queryRogueFocus: queryRogueFocus,
      queryProximityFocus: queryProximityFocus,
      queryPathSource: queryPathSource,
      queryPathTarget: queryPathTarget,
      queryConnectionTarget: queryConnectionTarget,
      queryConnectionTargets: queryConnectionTargets
    };
    // Return information.
    return variablesValues;
  }


  // subnetworkRestoration = true/false

  // TODO: deriveState needs new state variable for whether to initialize the subnetwork's elements
  // TODO: deriveState needs to restore the subnetwork's elements.
  // TODO: ... 1. whether to initialize or preserve subnetwork's elements
  // TODO: ... 2. execute appropriate query (if ready) and combine to subnetwork as appropriate
  // TODO: deriveState needs to pass subnetwork information to downstream process, in particular exploration view


  /**
  * Derives application's dependent state from controls relevant to view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @param {boolean} parameters.subnetworkRestoration Whether to restore the
  * subnetwork to its initial elements.
  * @param {string} queryCombination Method of combination, union or difference.
  * @param {Object<boolean>} parameters.viewsRestoration Information about
  * whether to restore each view.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Values of application's variables.
  */
  static deriveState({networkNodesRecords, networkLinksRecords, subnetworkRestoration, queryCombination, viewsRestoration, state} = {}) {
    // Derive state relevant to view.
    // Restore subnetwork's elements.
    if (subnetworkRestoration) {
      // Restore subnetwork to initial elements.
      // Consider combination strategy.
      if (queryCombination === "union") {
        var subnetworkElements = {
          subnetworkNodesRecords: [],
          subnetworkLinksRecords: []
        };
      } else if (queryCombination === "difference") {
        var subnetworkElements = Network.copyNetworkElementsRecords({
          networkNodesRecords: networkNodesRecords,
          networkLinksRecords: networkLinksRecords
        });
      }
    } else {
      // Preserve any current elements in subnetwork.
      // Execute query and combine elements to subnetwork.

      // TODO: Call a separate procedure to manage...
    }
    // Initialize controls for query view.
    // TODO: only do this when appropriate... for example, maybe after query execution
    var subordinateControls = ActionQuery.initializeSubordinateControls();
    // Determine summary information about subnetwork.
    var subnetworkSummary = Network.determineSubnetworkSummary({
      subnetworkNodesRecords: subnetworkElements.subnetworkNodesRecords,
      subnetworkLinksRecords: subnetworkElements.subnetworkLinksRecords
    });
    // Determine which views to restore.
    var novelViewsRestoration = ActionInterface.changeViewsRestoration({
      views: [
        "query",
        "measurement",
        "summary",
        "exploration"
      ],
      type: true,
      viewsRestoration: viewsRestoration
    });
    // Derive dependent state.
    var dependentStateVariables = ActionExploration.deriveState({
      simulationDimensions: state.simulationDimensions,
      previousSimulation: state.simulation,
      subnetworkNodesRecords: subnetworkElements.subnetworkNodesRecords,
      subnetworkLinksRecords: subnetworkElements.subnetworkLinksRecords,
      viewsRestoration: novelViewsRestoration,
      state: state
    });
    // Compile information.
    var novelVariablesValues = {
      subnetworkSummary: subnetworkSummary
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      subnetworkElements,
      subordinateControls,
      dependentStateVariables
    );
    // Return information.
    return variablesValues;
  }
}
