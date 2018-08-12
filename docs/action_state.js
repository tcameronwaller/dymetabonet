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
class ActionState {

  // Direct actions.

  /**
  * Determines whether to restore view's controls or to load information from
  * source and restore application's state from this information.
  * @param {Object} state Application's state.
  */
  static restoreControlsLoadRestoreSourceState(state) {
    // Determine whether the application's state includes a source file.
    if (Model.determineSourceState(state)) {
      // Application's state includes a source file.
      General.loadParseTextPassObject({
        file: state.sourceState,
        format: "json",
        call: ActionState.restoreSourceState,
        parameters: {state: state}
      });
    } else {
      // Application's state does not include a source file.
      // Restore application to initial state.
      ActionState.restoreControls(state);
    }
  }
  /**
  * Changes the source of information from file.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.source Reference to file object.
  * @param {Object} parameters.state Application's state.
  */
  static changeSource({source, state} = {}) {
    ActionGeneral.submitStateVariableValue({
      value: source,
      variable: "sourceState",
      state: state
    });
  }
  /**
  * Saves to file on client's system a persistent representation of the
  * application's state.
  * @param {Object} state Application's state.
  */
  static saveState(state) {
    var persistence = ActionState.createPersistence(state);
    console.log("application's state...");
    console.log(persistence);
    // Initialize values that do not persist properly.
    var interfaceControls = ActionInterface.initializeControls();
    var stateControls = ActionState.initializeControls();
    var exploration = ActionExploration.initializeControls();
    // Compile information.
    var novelVariablesValues = {
      views: interfaceControls.views,
      sourceState: stateControls.sourceState,
      simulation: exploration.simulation
    };
    var variablesValues = Object.assign(
      persistence,
      novelVariablesValues,
    );
    General.saveObject("state.json", variablesValues);
  }
  /**
  * Executes a temporary procedure.
  * @param {Object} state Application's state.
  */
  static executeProcedure(state) {
    // Initiate process timer.
    //console.time("timer");
    var startTime = window.performance.now();
    // Execute process.

    console.log(Object.keys(state.metabolites).length);
    console.log(Object.keys(state.reactions).length);
    console.log(Object.keys(state.compartments).length);
    console.log(Object.keys(state.processes).length);



    // Terminate process timer.
    //console.timeEnd("timer");
    var endTime = window.performance.now();
    var duration = Math.round(endTime - startTime);
    console.log("process duration: " + duration + " milliseconds");
  }

  // Indirect actions.

  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeControls() {
    // Initialize controls.
    var sourceState = {};
    // Compile information.
    var variablesValues = {
      sourceState: sourceState
    };
    // Return information.
    return variablesValues;
  }
  /**
  * Restores values of application's variables for controls relevant to view.
  * @param {Object} state Application's state.
  */
  static restoreControls(state) {
    // Initialize values of application's controls.
    var controls = ActionGeneral.initializeApplicationControlsValues(state);
    // Copy information about application's state.
    var stateCopy = ActionState.createPersistence(state);
    // Replace information about relevant controls.
    var novelState = Object.assign(
      stateCopy,
      controls
    );
    // Derive dependent state.
    var dependentStateVariables = ActionState.deriveState({
      viewsRestoration: novelState.viewsRestoration,
      state: novelState
    });
    // Compile variables' values.
    var novelVariablesValues = {};
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
  * Restores the application to a state from a persistent source.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.data Persistent source of information about
  * application's state.
  * @param {Object} parameters.state Application's state.
  */
  static restoreSourceState({data, state} = {}) {
    // Remove any information about source from the application's state.
    var sourceState = {};
    // Compile variables' values.
    var novelVariablesValues = {
      sourceState: sourceState
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      data
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Derives application's dependent state from controls relevant to view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<boolean>} parameters.viewsRestoration Information about
  * whether to restore each view.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Values of application's variables.
  */
  static deriveState({viewsRestoration, state} = {}) {
    // Derive state relevant to view.
    // Determine which views to restore.
    var novelViewsRestoration = ActionInterface.changeViewsRestoration({
      views: [
        "network",
        "filter",
        "context",
        "subnetwork",
        "query",
        "measurement",
        "summary",
        "exploration",
        "notice",
        "progress",
        "topology"
      ],
      type: true,
      viewsRestoration: viewsRestoration
    });
    // Derive dependent state.
    var dependentStateVariables = ActionNetwork.deriveState({
      metabolites: state.metabolites,
      reactions: state.reactions,
      compartments: state.compartments,
      processes: state.processes,
      viewsRestoration: novelViewsRestoration,
      state: state
    });
    // Compile information.
    var novelVariablesValues = {};
    var variablesValues = Object.assign(
      novelVariablesValues,
      dependentStateVariables
    );
    // Return information.
    return variablesValues;
  }
  /**
  * Creates persistent representation of the application's state.
  * @param {Object} state Application's state.
  * @returns {Object} Persistent representation of the application's state.
  */
  static createPersistence(state) {
    return state.variablesNames.reduce(function (collection, variableName) {
      var entry = {
        [variableName]: state[variableName]
      };
      return Object.assign({}, collection, entry);
    }, {});
  }

}
