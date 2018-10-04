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
class ActionGeneral {

  // Methods herein comprise discrete actions that impart changes to the
  // application's state.
  // Some actions necessitate changes to multiple aspects of the application
  // that coordinate together.
  // For efficiency, these actions impart these multiple changes simultaneously.
  // Knowledge of the event that triggered the action informs which changes to
  // make to the application's state.
  //
  // To call the restore method of the application's state, it is necessary to
  // pass the method a reference to the current instance of the state.

  // Direct actions.

  /**
  * Submits a novel value of a variable to the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.value Value of the variable.
  * @param {string} parameters.variable Name of the variable.
  * @param {Object} parameters.state Application's state.
  */
  static submitStateVariableValue({value, variable, state} = {}) {
    var novelVariableValue = [{
      variable: variable,
      value: value
    }];
    state.restore(novelVariableValue, state);
  }
  /**
  * Submits novel values of variables to the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.variablesValues Names and values of variables.
  * @param {Object} parameters.state Application's state.
  */
  static submitStateVariablesValues({variablesValues, state} = {}) {
    var novelVariablesValues = Object
    .keys(variablesValues).map(function (variable) {
      return {
        variable: variable,
        value: variablesValues[variable]
      };
    });
    state.restore(novelVariablesValues, state);
  }
  /**
  * Removes a variable's value from the application's state by submitting a
  * null value.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.variable Name of the variable.
  * @param {Object} parameters.state Application's state.
  */
  static removeStateVariableValue({variable, state} = {}) {
    ActionGeneral.submitStateVariableValue({
      value: null,
      variable: variable,
      state: state
    });
  }
  /**
  * Initializes the variables of the application's state.
  * @param {Object} state Application's state.
  */
  static initializeApplicationStateVariables(state) {
    var variablesValues = state
    .variablesNames.reduce(function (collection, variableName) {
      var entry = {[variableName]: null};
      return Object.assign(collection, entry);
    }, {});
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Initializes values of variables of application's controls.
  * @param {Object} state Application's state.
  */
  static initializeApplicationControls(state) {
    // Initialize values of application's controls.
    var controls = ActionGeneral.initializeApplicationControlsValues(state);
    // Compile variables' values.
    var novelVariablesValues = {};
    var variablesValues = Object.assign(
      novelVariablesValues,
      controls
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Initializes values of variables of application's controls.
  * @param {Object} state Application's state.
  * @returns {Object} Values of application's variables for controls.
  */
  static initializeApplicationControlsValues(state) {
    // Call procedures to initialize controls for each view.
    var interfaceControls = ActionInterface.initializeControls();
    var prompt = ActionPrompt.initializeControls();
    var control = ActionControl.initializeControls();
    var stateControls = ActionState.initializeControls();
    var network = ActionNetwork.initializeControls();
    var filter = ActionFilter.initializeControls();
    var context = ActionContext.initializeControls();
    var subnetwork = ActionSubnetwork.initializeControls();
    var query = ActionQuery.initializeControls();
    // TODO: update measurement view and its controls
    // var measurement = ActionMeasurement.initializeControls();
    // TODO: update summary view and its controls
    var summary = ActionSummary.initializeControls();
    var exploration = ActionExploration.initializeControls();
    // Compile information.
    var novelVariablesValues = {};
    var variablesValues = Object.assign(
      novelVariablesValues,
      interfaceControls,
      prompt,
      control,
      stateControls,
      network,
      filter,
      context,
      subnetwork,
      query,
      //measurement,
      summary,
      exploration
    );
    // Return information.
    return variablesValues;
  }
  /**
  * Restores basic information about metabolic entities and sets.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.data Information about metabolic entities and
  * sets.
  * @param {Object} parameters.state Application's state.
  */
  static restoreMetabolismBaseInformation({data, state} = {}) {
    // Compile variables' values.
    var novelVariablesValues = {
      metabolites: data.metabolites,
      reactions: data.reactions,
      compartments: data.compartments,
      processes: data.processes
    };
    var variablesValues = novelVariablesValues;
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Restores supplemental information about metabolic entities and sets.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.data Information about metabolic entities and
  * sets.
  * @param {Object} parameters.state Application's state.
  */
  static restoreMetabolismSupplementInformation({data, state} = {}) {
    // Derive default metabolites for simplification.
    var defaultSimplificationsMetabolites = General.collectValueFromObjects(
      "identifier", data
    );
    // Compile variables' values.
    var novelVariablesValues = {
      defaultSimplificationsMetabolites: defaultSimplificationsMetabolites
    };
    var variablesValues = novelVariablesValues;
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Derives information from basic information about metabolic entities and
  * sets.
  * @param {Object} state Application's state.
  */
  static deriveState(state) {
    // Some aspects of the application's state have a hierarchy.
    // State
    //  Filter
    //   Context
    //    Query
    //     Measurement
    //     Exploration
    // The derivation cascade proceeds through all major modules of the
    // application's actions.
    // Any change to a module's controls calls the module's own derive function
    // if those controls influence any of the modules other state variables.
    // Any change to a module's controls calls the derive function of
    // subordinate (downstream) (perhaps via the module's own derive function).
    // Derive dependent state.
    var dependentStateVariables = ActionState.deriveState({
      viewsRestoration: state.viewsRestoration,
      state: state
    });
    // Compile variables' values.
    var novelVariablesValues = {};
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
  * Changes the searches to filter summaries.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.type Type of summaries.
  * @param {string} parameters.category Name of category.
  * @param {string} parameters.string Search string by which to filter
  * records' names.
  * @param {Object} state Application's state.
  */
  static changeSearches({type, category, string, state} = {}) {
    // Determine searches.
    if (type === "sets") {
      var searchesName = "setsSearches";
    } else if (type === "candidates") {
      var searchesName = "candidatesSearches";
    }
    // Change the search's specifications.
    var searches = ActionGeneral.changeCategoriesSearchString({
      category: category,
      string: string,
      searches: state[searchesName]
    });
    // Prepare summaries.
    if (type === "sets") {
      // Derive dependent state.
      var dependentStateVariables = ActionFilter.deriveSubordinateState({
        setsFilters: state.setsFilters,
        setsFilter: state.setsFilter,
        setsEntities: state.setsEntities,
        setsSearches: searches,
        setsSorts: state.setsSorts,
        metabolites: state.metabolites,
        reactions: state.reactions,
        compartments: state.compartments,
        processes: state.processes,
        viewsRestoration: state.viewsRestoration,
        state: state
      });
    } else if (type === "candidates") {
      // Derive dependent state.
      var dependentStateVariables = ActionContext.deriveSubordinateState({
        compartmentalization: state.compartmentalization,
        simplificationPriority: state.simplificationPriority,
        defaultSimplifications: state.defaultSimplifications,
        candidatesSearches: searches,
        candidatesSorts: state.candidatesSorts,
        defaultSimplificationsMetabolites: state
        .defaultSimplificationsMetabolites,
        reactionsSimplifications: state.reactionsSimplifications,
        metabolitesSimplifications: state.metabolitesSimplifications,
        filterSetsReactions: state.filterSetsReactions,
        reactions: state.reactions,
        metabolites: state.metabolites,
        compartments: state.compartments,
        processes: state.processes,
        viewsRestoration: state.viewsRestoration,
        state: state
      });
    }
    // Compile variables' values.
    var novelVariablesValues = {
      [searchesName]: searches
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
  * Changes the specifications to sort summaries.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.type Type of summaries.
  * @param {string} parameters.category Name of category.
  * @param {string} parameters.criterion Criterion for sort.
  * @param {Object} parameters.state Application's state.
  */
  static changeSorts({type, category, criterion, state} = {}) {

    // TODO: Also accommodate sorts for the summary of metabolites' measurements

    // Determine sorts.
    if (type === "sets") {
      var sortsName = "setsSorts";
    } else if (type === "candidates") {
      var sortsName = "candidatesSorts";
    } else if (type === "measurements") {
      var sortsName = "measurementsSorts";
    }
    // Change the sorts' specifications.
    var sorts = ActionGeneral.changeCategoriesSortCriterionOrder({
      category: category,
      criterion: criterion,
      sorts: state[sortsName]
    });
    // Sort summaries.
    if (type === "sets") {
      // Derive dependent state.
      var dependentStateVariables = ActionFilter.deriveSubordinateState({
        setsFilters: state.setsFilters,
        setsFilter: state.setsFilter,
        setsEntities: state.setsEntities,
        setsSearches: state.setsSearches,
        setsSorts: sorts,
        metabolites: state.metabolites,
        reactions: state.reactions,
        compartments: state.compartments,
        processes: state.processes,
        viewsRestoration: state.viewsRestoration,
        state: state
      });
    } else if (type === "candidates") {
      // Derive dependent state.
      var dependentStateVariables = ActionContext.deriveSubordinateState({
        compartmentalization: state.compartmentalization,
        simplificationPriority: state.simplificationPriority,
        defaultSimplifications: state.defaultSimplifications,
        candidatesSearches: state.candidatesSearches,
        candidatesSorts: sorts,
        defaultSimplificationsMetabolites: state
        .defaultSimplificationsMetabolites,
        reactionsSimplifications: state.reactionsSimplifications,
        metabolitesSimplifications: state.metabolitesSimplifications,
        filterSetsReactions: state.filterSetsReactions,
        reactions: state.reactions,
        metabolites: state.metabolites,
        compartments: state.compartments,
        processes: state.processes,
        viewsRestoration: state.viewsRestoration,
        state: state
      });
    }
    // Compile variables' values.
    var novelVariablesValues = {
      [sortsName]: sorts
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
  * Changes the specifications to sort records in multiple categories.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Name of category.
  * @param {string} parameters.criterion Criterion for sort.
  * @param {Object<Object<string>>} parameters.sorts Specifications to sort
  * records in multiple categories.
  * @returns {Object<Object<string>>} Specifications to sort records in multiple
  * categories.
  */
  static changeCategoriesSortCriterionOrder({category, criterion, sorts} = {}) {
    // Change the specification only for the specific category.
    // Determine whether current criterion matches previous criterion.
    if (criterion === sorts[category].criterion) {
      // Current criterion matches previous criterion.
      // Change the specification's order.
      if (sorts[category].order === "descend") {
        var order = "ascend";
      } else if (sorts[category].order === "ascend") {
        var order = "descend";
      }
    } else {
      // Current criterion does not match previous criterion.
      // Change the specification to the current criterion with default order.
      var order = "descend";
    }
    // Create entry.
    var entry = {
      [category]: {
        criterion: criterion,
        order: order
      }
    };
    // Copy specifications.
    var copySorts = General.copyValue(sorts, true);
    // Include entry.
    var novelSorts = Object.assign(copySorts, entry);
    return novelSorts;
  }
  /**
  * Changes the searches to filter records in multiple categories.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Name of category.
  * @param {string} parameters.string String by which to filter records' names.
  * @param {Object<string>} parameters.searches Searches to filter records in
  * multiple categories.
  * @returns {Object<string>} Searches to filter sets' summaries.
  */
  static changeCategoriesSearchString({category, string, searches} = {}) {
    // Change the specification only for the specific category.
    // Create entry.
    var entry = {
      [category]: string.toLowerCase()
    };
    // Copy specifications.
    var copySearches = General.copyValue(searches, true);
    // Include entry.
    var novelSearches = Object.assign(copySearches, entry);
    return novelSearches;
  }

  // Indirect actions.

  /**
  * Loads from file basic information about metabolic entities and sets.
  * @param {Object} state Application's state.
  */
  static loadMetabolismBaseInformation(state) {
    d3.json("data/metabolism_sets_entities_recon2m2.json", function (data) {
      ActionGeneral.restoreMetabolismBaseInformation({
        data: data,
        state: state
      });
    });
  }
  /**
  * Loads from file supplemental information about metabolic entities and sets.
  * @param {Object} state Application's state.
  */
  static loadMetabolismSupplementInformation(state) {
    d3.tsv(
      "data/curation_simplification_default_metabolites.tsv", function (data) {
      ActionGeneral.restoreMetabolismSupplementInformation({
        data: data,
        state: state
      });
    });
  }

}
