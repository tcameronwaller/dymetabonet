/*
Profondeur supports visual exploration and analysis of metabolic networks.
Copyright (C) 2017 Thomas Cameron Waller

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

This file is part of project Profondeur.
Project repository's address: https://github.com/tcameronwaller/profondeur/
Author's electronic address: tcameronwaller@gmail.com
Author's physical address:
T Cameron Waller
Scientific Computing and Imaging Institute
University of Utah
72 South Central Campus Drive Room 3750
Salt Lake City, Utah 84112
United States of America
*/

/**
* Actions that modify the state of the application.
* This class does not store any attributes and does not require instantiation.
* This class stores methods that control all actions that modify the model for
* the state of the application.
* The methods require a reference to the instance
* of the model.
* These methods also call external methods as necessary.
*/
class Action {
  // Methods herein intend to comprise discrete actions that impart changes to
  // the application's state.
  // Some actions necessitate changes to multiple aspects of the application
  // that coordinate together.
  // For efficiency, these actions impart these multiple changes
  // simultaneously.
  // Knowledge of the event that triggered the action informs which changes to
  // make to the application's state.
  //
  // To call the restore method of the model, it is necessary to pass the
  // method a reference to the current instance of the model.
  // Methods for general functionality relevant to application actions.

  // Submission to application's state.

  /**
  * Submits a novel attribute's value to the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.value Value of the attribute.
  * @param {string} parameters.attribute Name of the attribute.
  * @param {Object} parameters.state Application's state.
  */
  static submitAttribute({value, attribute, state} = {}) {
    var novelAttribute = [{
      attribute: attribute,
      value: value
    }];
    state.restore(novelAttribute, state);
  }
  /**
  * Submits novel attributes' values to the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.attributesValues New values of attributes.
  * @param {Object} parameters.state Application's state.
  */
  static submitAttributes({attributesValues, state} = {}) {
    var novelAttributes = Object
    .keys(attributesValues).map(function (attribute) {
      return {
        attribute: attribute,
        value: attributesValues[attribute]
      };
    });
    state.restore(novelAttributes, state);
  }
  /**
  * Removes an attribute's value from the application's state by submitting a
  * null value.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.name Name of the attribute.
  * @param {Object} parameters.state Application's state.
  */
  static removeAttribute({name, state} = {}) {
    Action.submitAttribute({
      value: null,
      attribute: name,
      state: state
    });
  }

  // Direct actions.

// TODO: I'll need to reset topology to false every time the network's elements change...

  /**
  * Initializes the application's state by submitting null values of all
  * attributes.
  * @param {Object} state Application's state.
  */
  static initializeApplication(state) {
    var attributesValues = state
    .attributeNames.reduce(function (collection, attributeName) {
      var entry = {[attributeName]: null};
      return Object.assign(collection, entry);
    }, {});
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Changes the selections of active panels within the control view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Category of panel.
  * @param {Object} state Application's state.
  */
  static changeControlPanel({category, state}) {
    // Determine the state variable.
    var variable = "control" + General.capitalizeString(category);
    // Change the panel's selection.
    if (state[variable]) {
      var selection = false;
    } else {
      var selection = true;
    }
    // Compile attributes' values.
    var novelAttributesValues = {
      [variable]: selection
    };
    var attributesValues = novelAttributesValues;
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Saves to a novel file on client's system a persistent representation of the
  * application's state.
  * @param {Object} state Application's state.
  */
  static saveState(state) {
    var persistence = Action.createPersistentState(state);
    console.log("application's persistent state...");
    console.log(persistence);
    General.saveObject("state.json", persistence);
  }
  /**
  * Submits a novel source to the application's state.
  * @param {Object} source Reference to file object.
  * @param {Object} state Application's state.
  */
  static submitSource(source, state) {
    Action.submitAttribute({
      value: source,
      attribute: "source",
      state: state
    });
  }
  /**
  * Evaluates and loads from file a source of information about the
  * application's state, passing this information to another procedure to
  * restore the application's state.
  * @param {Object} state Application's state.
  */
  static evaluateLoadSource(state) {
    // Determine whether the application's state includes a source file.
    if (Model.determineSource(state)) {
      // Application's state includes a source file.
      General.loadPassObject({
        file: state.source,
        call: Action.evaluateRestoreState,
        parameters: {state: state}
      });
    } else {
      // Application's state does not include a source file.
      // Display error message.
      // Report message to remind user to select source file.
      var message = "please select a source file...";
      window.alert(message);
    }
  }
  /**
  * Executes a temporary procedure.
  * @param {Object} state Application's state.
  */
  static executeTemporaryProcedure(state) {
    // Initiate process timer.
    //console.time("timer");
    var startTime = window.performance.now();
    // Execute process.

    var container = document.getElementById("control");
    console.log(container.children);
    General.filterRemoveDocumentElements({
      values: ["state", "set", "candidate"],
      attribute: "id",
      elements: container.children
    });
    console.log(container.children);


    // Terminate process timer.
    //console.timeEnd("timer");
    var endTime = window.performance.now();
    var duration = Math.round(endTime - startTime);
    console.log("process duration: " + duration + " milliseconds");
  }
  /**
  * Restores sets' summary to initial state.
  * @param {Object} state Application's state.
  */
  static restoreApplicationInitialState(state) {
    // Initialize application's variant state.
    var variantStateVariables = Action.initializeApplicationVariantState({
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartments: state.compartments,
      processes: state.processes,
      totalReactionsSets: state.totalReactionsSets,
      totalMetabolitesSets: state.totalMetabolitesSets
    });
    // Compile attributes' values.
    var attributesValues = variantStateVariables;
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
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
    var searches = Action.changeCategoriesSearchString({
      category: category,
      string: string,
      searches: state[searchesName]
    });
    // Prepare summaries.
    if (type === "sets") {
      var summariesName = "setsSummaries";
      var summaries = Cardinality.prepareSetsSummaries({
        setsCardinalities: state.setsCardinalities,
        setsSearches: searches,
        setsSorts: state.setsSorts,
        compartments: state.compartments,
        processes: state.processes
      });
    } else if (type === "candidates") {
      var summariesName = "candidatesSummaries";
      var summaries = Candidacy.prepareCandidatesSummaries({
        reactionsCandidates: state.reactionsCandidates,
        metabolitesCandidates: state.metabolitesCandidates,
        candidatesSearches: searches,
        candidatesSorts: state.candidatesSorts
      });
    }
    // Compile attributes' values.
    var novelAttributesValues = {
      [searchesName]: searches,
      [summariesName]: summaries
    };
    var attributesValues = novelAttributesValues;
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Changes the values of attributes to apply as filters to sets.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Value of attribute in current selection.
  * @param {string} parameters.attribute Attribute in current selection.
  * @param {Object} state Application's state.
  */
  static changeSetsFilters({value, attribute, state} = {}) {
    // Record set's selection for filters.
    var setsFilters = Attribution.recordSetSelectionFilters({
      value: value,
      attribute: attribute,
      setsFilters: state.setsFilters
    });
    // Determine current entities' attribution to sets.
    var currentEntitiesSets = Attribution.determineCurrentEntitiesSets({
      setsFilters: setsFilters,
      totalReactionsSets: state.totalReactionsSets,
      totalMetabolitesSets: state.totalMetabolitesSets,
      reactions: state.reactions
    });
    // Determine sets' cardinalities and prepare sets' summaries.
    var setsCardinalitiesSummaries = Cardinality
    .determineSetsCardinalitiesSummaries({
      setsEntities: state.setsEntities,
      setsFilter: state.setsFilter,
      accessReactionsSets: currentEntitiesSets.accessReactionsSets,
      accessMetabolitesSets: currentEntitiesSets.accessMetabolitesSets,
      filterReactionsSets: currentEntitiesSets.filterReactionsSets,
      filterMetabolitesSets: currentEntitiesSets.filterMetabolitesSets,
      setsSearches: state.setsSearches,
      setsSorts: state.setsSorts,
      compartments: state.compartments,
      processes: state.processes
    });
    // Determine candidate entities, their simplifications, and summaries.
    var candidatesSimplificationsSummaries = Candidacy
    .evaluateCandidacyContext({
      reactionsSets: currentEntitiesSets.filterReactionsSets,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartmentalization: state.compartmentalization,
      metabolitesSimplifications: state.metabolitesSimplifications,
      reactionsSimplifications: state.reactionsSimplifications,
      candidatesSearches: state.candidatesSearches,
      candidatesSorts: state.candidatesSorts,
      compartments: state.compartments
    });
    // Create network's elements.
    var networkElements = Network.createNetworkElements({
      reactionsCandidates: candidatesSimplificationsSummaries
      .reactionsCandidates,
      metabolitesCandidates: candidatesSimplificationsSummaries
      .metabolitesCandidates,
      reactionsSimplifications: candidatesSimplificationsSummaries
      .reactionsSimplifications,
      metabolitesSimplifications: candidatesSimplificationsSummaries
      .metabolitesSimplifications,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartmentalization: state.compartmentalization
    });
    // Initialize selection of whether to draw a visual representation of
    // network's topology.
    var topology = false;
    // Compile attributes' values.
    var novelAttributesValues = {
      setsFilters: setsFilters,
      topology: topology
    };
    var attributesValues = Object.assign(
      {},
      currentEntitiesSets,
      setsCardinalitiesSummaries,
      candidatesSimplificationsSummaries,
      networkElements,
      novelAttributesValues
    );
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Changes the selection of entities of interest for the sets' summary.
  * @param {Object} state Application's state.
  */
  static changeSetsEntities(state) {
    // Determine entities of interest.
    if (state.setsEntities === "metabolites") {
      var setsEntities = "reactions";
    } else if (state.setsEntities === "reactions") {
      var setsEntities = "metabolites";
    }
    // Determine sets' cardinalities and prepare sets' summaries.
    var setsCardinalitiesSummaries = Cardinality
    .determineSetsCardinalitiesSummaries({
      setsEntities: setsEntities,
      setsFilter: state.setsFilter,
      accessReactionsSets: state.accessReactionsSets,
      accessMetabolitesSets: state.accessMetabolitesSets,
      filterReactionsSets: state.filterReactionsSets,
      filterMetabolitesSets: state.filterMetabolitesSets,
      setsSearches: state.setsSearches,
      setsSorts: state.setsSorts,
      compartments: state.compartments,
      processes: state.processes
    });
    // Compile attributes' values.
    var novelAttributesValues = {
      setsEntities: setsEntities
    };
    var attributesValues = Object.assign(
      {},
      setsCardinalitiesSummaries,
      novelAttributesValues
    );
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Changes the selection of filter for the sets' summary.
  * @param {Object} state Application's state.
  */
  static changeSetsFilter(state) {
    // Determine filter.
    if (state.setsFilter) {
      var setsFilter = false;
    } else {
      var setsFilter = true;
    }
    // Determine sets' cardinalities and prepare sets' summaries.
    var setsCardinalitiesSummaries = Cardinality
    .determineSetsCardinalitiesSummaries({
      setsEntities: state.setsEntities,
      setsFilter: setsFilter,
      accessReactionsSets: state.accessReactionsSets,
      accessMetabolitesSets: state.accessMetabolitesSets,
      filterReactionsSets: state.filterReactionsSets,
      filterMetabolitesSets: state.filterMetabolitesSets,
      setsSearches: state.setsSearches,
      setsSorts: state.setsSorts,
      compartments: state.compartments,
      processes: state.processes
    });
    // Compile attributes' values.
    var novelAttributesValues = {
      setsFilter: setsFilter
    };
    var attributesValues = Object.assign(
      {},
      setsCardinalitiesSummaries,
      novelAttributesValues
    );
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
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
    // Determine sorts.
    if (type === "sets") {
      var sortsName = "setsSorts";
    } else if (type === "candidates") {
      var sortsName = "candidatesSorts";
    }
    // Change the sorts' specifications.
    var sorts = Action.changeCategoriesSortCriterionOrder({
      category: category,
      criterion: criterion,
      sorts: state[sortsName]
    });
    // Sort summaries.
    if (type === "sets") {
      var summariesName = "setsSummaries";
      var summaries = Cardinality.sortSetsSummaries({
        setsSummaries: state.setsSummaries,
        setsSorts: sorts,
        compartments: state.compartments,
        processes: state.processes
      });
    } else if (type === "candidates") {
      var summariesName = "candidatesSummaries";
      var summaries = Candidacy.sortCandidatesSummaries({
        candidatesSummaries: state.candidatesSummaries,
        candidatesSorts: sorts,
        reactionsCandidates: state.reactionsCandidates,
        metabolitesCandidates: state.metabolitesCandidates
      });
    }
    // Compile attributes' values.
    var novelAttributesValues = {
      [sortsName]: sorts,
      [summariesName]: summaries
    };
    var attributesValues = novelAttributesValues;
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Changes specification of compartmentalization's relevance
  * @param {Object} state Application's state.
  */
  static changeCompartmentalization(state) {
    // Determine compartmentalization.
    if (state.compartmentalization) {
      var compartmentalization = false;
    } else {
      var compartmentalization = true;
    }
    // Initialize selections for entities' simplification.
    // Simplifications are specific to candidate entities, which are specific to
    // the context of interest, of which compartmentalization is part.
    var simplifications = Candidacy.createInitialSimplifications();
    // Determine candidate entities, their simplifications, and summaries.
    var candidatesSimplificationsSummaries = Candidacy
    .evaluateCandidacyContext({
      reactionsSets: state.filterReactionsSets,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartmentalization: compartmentalization,
      metabolitesSimplifications: simplifications.metabolitesSimplifications,
      reactionsSimplifications: simplifications.reactionsSimplifications,
      candidatesSearches: state.candidatesSearches,
      candidatesSorts: state.candidatesSorts,
      compartments: state.compartments
    });
    // Create network's elements.
    var networkElements = Network.createNetworkElements({
      reactionsCandidates: candidatesSimplificationsSummaries
      .reactionsCandidates,
      metabolitesCandidates: candidatesSimplificationsSummaries
      .metabolitesCandidates,
      reactionsSimplifications: candidatesSimplificationsSummaries
      .reactionsSimplifications,
      metabolitesSimplifications: candidatesSimplificationsSummaries
      .metabolitesSimplifications,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartmentalization: compartmentalization
    });
    // Initialize selection of whether to draw a visual representation of
    // network's topology.
    var topology = false;
    // Compile attributes' values.
    var novelAttributesValues = {
      compartmentalization: compartmentalization,
      topology: topology
    };
    var attributesValues = Object.assign(
      candidatesSimplificationsSummaries,
      networkElements,
      novelAttributesValues
    );
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Changes explicit and implicit simplifications.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {string} parameters.category Category of entities, metabolites or
  * reactions.
  * @param {string} parameters.method Method for simplification, omission or
  * replication.
  * @param {Object} parameters.state Application's state.
  */
  static changeSimplification({identifier, category, method, state} = {}) {
    // Change explicit and implicit designations of entities for simplification.
    var simplifications = Candidacy.changeSimplifications({
      identifier: identifier,
      category: category,
      method: method,
      reactionsCandidates: state.reactionsCandidates,
      metabolitesCandidates: state.metabolitesCandidates,
      reactionsSets: state.filterReactionsSets,
      reactions: state.reactions,
      compartmentalization: state.compartmentalization,
      reactionsSimplifications: state.reactionsSimplifications,
      metabolitesSimplifications: state.metabolitesSimplifications
    });
    // Create network's elements.
    var networkElements = Network.createNetworkElements({
      reactionsCandidates: state.reactionsCandidates,
      metabolitesCandidates: state.metabolitesCandidates,
      reactionsSimplifications: simplifications.reactionsSimplifications,
      metabolitesSimplifications: simplifications.metabolitesSimplifications,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartmentalization: state.compartmentalization
    });
    // Initialize selection of whether to draw a visual representation of
    // network's topology.
    var topology = false;
    // Compile attributes' values.
    var novelAttributesValues = {
      topology: topology
    };
    var attributesValues = Object.assign(
      novelAttributesValues,
      simplifications,
      networkElements
    );
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Changes the selection of toppology.
  * @param {Object} state Application's state.
  */
  static changeTopology(state) {
    // Determine topology.
    var topology = true;
    // Compile attributes' values.
    var novelAttributesValues = {
      topology: topology
    };
    var attributesValues = novelAttributesValues;
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }

  // Indirect actions.

  /**
  * Creates persistent representation of the model of the application's
  * state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  * @returns {Object} Persistent representation of the application's state.
  */
  static createPersistentState(state) {
    return state.attributeNames.reduce(function (collection, attributeName) {
      var novelRecord = {
        [attributeName]: state[attributeName]
      };
      return Object.assign({}, collection, novelRecord);
    }, {});
  }
  /**
  * Evaluates information from a persistent source to restore the application's
  * state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.data Persistent source of information about
  * application's state.
  * @param {Object} parameters.state Application's state.
  */
  static evaluateRestoreState({data, state} = {}) {
    // Determine appropriate procedure for source information.
    var model = (data.id === "MODEL1603150001");
    var clean = data.clean;
    if (!model) {
      Action.restoreState({
        data: data,
        state: state
      });
    } else if (model && clean) {
      Action.extractInitializeMetabolicEntitiesSets({
        data: data,
        state: state
      });
    } else if (model && !clean) {
      var cleanData = Clean.checkCleanMetabolicEntitiesSetsRecon2(data);
      Action.extractInitializeMetabolicEntitiesSets({
        data: cleanData,
        state: state
      });
    }
  }
  /**
  * Restores the application to a state from a persistent source.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.data Persistent source of information about
  * application's state.
  * @param {Object} parameters.state Application's state.
  */
  static restoreState({data, state} = {}) {
    // Remove any information about source from the application's state.
    var source = null;
    // Compile attributes' values.
    var novelAttributesValues = {
      source: source
    };
    var attributesValues = Object.assign(data, novelAttributesValues);
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Extracts information about metabolic entities and sets from a clean model
  * of metabolism and initializes the application's state from this information.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.data Information about metabolic entities and
  * sets.
  * @param {Object} parameters.state Application's state.
  */
  static extractInitializeMetabolicEntitiesSets({data, state} = {}) {
    // Extract information about metabolic entities and sets.
    // The complete model has 2652 metabolites.
    // The complete model has 7785 reactions.
    var metabolicEntitiesSets = Extraction
    .extractMetabolicEntitiesSetsRecon2(data);
    // Initialize application's state from information about metabolic entities
    // and sets.
    Action.initializeApplicationTotalState({
      metabolicEntitiesSets: metabolicEntitiesSets,
      state: state
    });
  }
  /**
  * Initializes application's state from information about metabolic entities
  * and sets.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.metabolicEntitiesSets Information about metabolic
  * entities and sets.
  * @param {Object} parameters.state Application's state.
  */
  static initializeApplicationTotalState({metabolicEntitiesSets, state} = {}) {
    // Initialize application's state from information about metabolic entities
    // and sets.
    // Determine total entities' attribution to sets.
    var totalEntitiesSets = Attribution
    .determineTotalEntitiesSets(metabolicEntitiesSets.reactions);
    // Initialize application's variant state.
    var variantStateVariables = Action.initializeApplicationVariantState({
      reactions: metabolicEntitiesSets.reactions,
      metabolites: metabolicEntitiesSets.metabolites,
      compartments: metabolicEntitiesSets.compartments,
      processes: metabolicEntitiesSets.processes,
      totalReactionsSets: totalEntitiesSets.totalReactionsSets,
      totalMetabolitesSets: totalEntitiesSets.totalMetabolitesSets
    });
    // Compile attributes' values.
    var attributesValues = Object.assign(
      metabolicEntitiesSets,
      totalEntitiesSets,
      variantStateVariables
    );
    // Submit attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Evaluates the context of interest and collects candidate entities and their
  * implicit simplifications.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @param {Object<Object>} parameters.totalReactionsSets Information about all
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.totalMetabolitesSets Information about
  * all metabolites' reactions and sets.
  * @returns {Object} Values of multiple attributes.
  */
  static initializeApplicationVariantState({reactions, metabolites, compartments, processes, totalReactionsSets, totalMetabolitesSets} = {}) {
    // Initialize controls.
    var controls = Action.initializeControls();
    // Initialize filters against entities' sets.
    var setsFilters = Attribution.createInitialSetsFilters();
    // Determine current entities' attribution to sets.
    var currentEntitiesSets = Attribution.determineCurrentEntitiesSets({
      setsFilters: setsFilters,
      totalReactionsSets: totalReactionsSets,
      totalMetabolitesSets: totalMetabolitesSets,
      reactions: reactions
    });
    // Initialize selections that influence sets' cardinalities.
    var setsCardinalitiesSelections = Action
    .initializeSetsCardinalitiesSelections();
    // Determine sets' cardinalities and prepare sets' summaries.
    var setsCardinalitiesSummaries = Cardinality
    .determineSetsCardinalitiesSummaries({
      setsEntities: setsCardinalitiesSelections.setsEntities,
      setsFilter: setsCardinalitiesSelections.setsFilter,
      accessReactionsSets: currentEntitiesSets.accessReactionsSets,
      accessMetabolitesSets: currentEntitiesSets.accessMetabolitesSets,
      filterReactionsSets: currentEntitiesSets.filterReactionsSets,
      filterMetabolitesSets: currentEntitiesSets.filterMetabolitesSets,
      setsSearches: setsCardinalitiesSelections.setsSearches,
      setsSorts: setsCardinalitiesSelections.setsSorts,
      compartments: compartments,
      processes: processes
    });
    // Initialize compartmentalization's relevance.
    var compartmentalization = false;
    // Initialize selections for entities' simplification.
    // Simplifications are specific to candidate entities, which are specific to
    // the context of interest, of which compartmentalization is part.
    var simplifications = Candidacy.createInitialSimplifications();
    // Initialize searches.
    var candidatesSearches = Candidacy.createInitialCandidatesSearches();
    // Initialize specifications to sort candidates' summaries.
    var candidatesSorts = Candidacy.createInitialCandidatesSorts();
    // Determine candidate entities, their simplifications, and summaries.
    var candidatesSimplificationsSummaries = Candidacy
    .evaluateCandidacyContext({
      reactionsSets: currentEntitiesSets.filterReactionsSets,
      reactions: reactions,
      metabolites: metabolites,
      compartmentalization: compartmentalization,
      metabolitesSimplifications: simplifications.metabolitesSimplifications,
      reactionsSimplifications: simplifications.reactionsSimplifications,
      candidatesSearches: candidatesSearches,
      candidatesSorts: candidatesSorts,
      compartments: compartments
    });
    // Create network's elements.
    var networkElements = Network.createNetworkElements({
      reactionsCandidates: candidatesSimplificationsSummaries
      .reactionsCandidates,
      metabolitesCandidates: candidatesSimplificationsSummaries
      .metabolitesCandidates,
      reactionsSimplifications: candidatesSimplificationsSummaries
      .reactionsSimplifications,
      metabolitesSimplifications: candidatesSimplificationsSummaries
      .metabolitesSimplifications,
      reactions: reactions,
      metabolites: metabolites,
      compartmentalization: compartmentalization
    });
    // Compile information.
    var novelAttributesValues = {
      setsFilters: setsFilters,
      compartmentalization: compartmentalization,
      candidatesSearches: candidatesSearches,
      candidatesSorts: candidatesSorts
    };
    var attributesValues = Object.assign(
      controls,
      currentEntitiesSets,
      setsCardinalitiesSelections,
      setsCardinalitiesSummaries,
      candidatesSimplificationsSummaries,
      networkElements,
      novelAttributesValues
    );
    // Return information.
    return attributesValues;
  }
  /**
  * Initializes information about application's controls.
  * @returns {Object} Values of multiple attributes.
  */
  static initializeControls() {
    // Remove any information about source.
    var source = null;
    // Initialize control panels.
    var controlState = false;
    var controlSet = false;
    var controlCandidacy = false;
    // Initialize selection of whether to draw a visual representation of
    // network's topology.
    var topology = false;
    // Compile information.
    var attributesValues = {
      source: source,
      controlState: controlState,
      controlSet: controlSet,
      controlCandidacy: controlCandidacy,
      topology: topology
    };
    // Return information.
    return attributesValues;
  }
  /**
  * Initializes information about selections that influence cardinalities of
  * sets of entities.
  * @returns {Object} Values of multiple attributes.
  */
  static initializeSetsCardinalitiesSelections() {
    // Initialize selection of entities for sets' cardinalities.
    var setsEntities = "metabolites";
    // Initialize selection of whether to filter sets' entities for summary.
    var setsFilter = false;
    // Initialize searches.
    var setsSearches = Cardinality.createInitialSetsSearches();
    // Initialize specifications to sort sets' summaries.
    var setsSorts = Cardinality.createInitialSetsSorts();
    // Compile information.
    var attributesValues = {
      setsEntities: setsEntities,
      setsFilter: setsFilter,
      setsSearches: setsSearches,
      setsSorts: setsSorts
    };
    // Return information.
    return attributesValues;
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

  ////////////////////////////////////////////////////////////////////////// ???

  /**
  * Restores controls for network's assembly to initial state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static restoreNetworkAssembly(model) {
    // Initialize application's attributes that relate to definition and
    // assemblyof network's elements from metabolic entities.
    var networkDefinitionAttributes = Action
    .initializeNetworkDefinitionAttributes();
    // Submit new values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: networkDefinitionAttributes,
      model: model
    });
  }
  /**
  * Removes the identifier for a single metabolite from the collection of
  * replications for the network's assembly.
  * Submits new values to the model of the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a single metabolite.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static removeCurrentReplication({identifier, model} = {}) {
    // Filter replications to omit any replication for the identifier.
    var replications = model.replications.filter(function (replication) {
      return !(replication === identifier);
    });
    // Submit new value of attribute to the model of the application's
    // state.
    Action.submitAttribute({
      value: replications,
      attribute: "replications",
      model: model
    });
  }
  /**
  * Includes the identifier for a single metabolite in the collection of
  * replications for the network's assembly.
  * Submits new values to the model of the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.name Name of a single metabolite.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static includeNovelReplication({name, model} = {}) {
    // If name is valid for a current metabolite that is not already in the
    // collection of replications, then include that metabolite's identifier
    // in the collection of replications.
    // Determine the identifier for any current, novel metabolites that
    // match the name.
    // Metabolites have both unique identifiers and unique names.
    var nameMatches = model
    .currentMetabolites.filter(function (identifier) {
      return model.metabolites[identifier].name === name;
    });
    var novelNameMatches = nameMatches.filter(function (identifier) {
      return !model.replications.includes(identifier);
    });
    if ((novelNameMatches.length > 0)) {
      var replications = []
      .concat(model.replications, novelNameMatches[0]);
    } else {
      var replications = model.replications;
    }
    // Submit new value of attribute to the model of the application's
    // state.
    Action.submitAttribute({
      value: replications,
      attribute: "replications",
      model: model
    });
  }
  /**
  * Creates a network of nodes and links to represent metabolic entities,
  * metabolites and reactions, and relations between them.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static traverseTopology(model) {
    // TODO: I don't want to initialize a network in JSNetworkX until I have to.
    if (false) {
      // Initialize an operable network in JSNetworkX from the network's
      // elements.
      var network = Network.initializeNetwork({
        links: networkElements.links,
        nodes: networkElements.nodes
      });
      // Induce subnetwork.
      //var subNetwork = Network.induceEgoNetwork({
      //    focus: "pyr_c",
      //    depth: 2,
      //    center: true,
      //    direction: null,
      //    network: network
      //});
      var subNetwork = network;
      // Extract information about nodes and links from the subnetwork.
      var subNodes = Network.extractNetworkNodes(subNetwork);
      var subLinks = Network.extractNetworkLinks(subNetwork);
      console.log("subnetwork elements");
      console.log(subNodes);
      console.log(subLinks);
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  // TODO: SOME of these methods might be obsolete...

  /**
  * Initializes values of attributes that relate to definition and assembly of
  * network's elements from metabolic entities.
  * @returns {Object} Collection of multiple attributes that relate to
  * definition and assembly of network's elements.
  */
  static initializeNetworkDefinitionAttributes() {
    // Specify compartmentalization for representation of metabolic entities in
    // the network.
    var compartmentalization = true;
    // Specify simplification's method for representation of metabolic entities
    // in the network.
    var simplification = "omission";
    //var replications = [
    //  "ac", "accoa", "adp", "amp", "atp", "ca2", "camp", "cdp", "cl",
    //  "cmp", "co", "co2", "coa", "ctp", "datp", "dcmp", "dctp", "dna",
    //  "dtdp", "dtmp", "fe2", "fe3", "fmn", "gdp", "gmp", "gtp", "h", "h2",
    //  "h2o", "h2o2", "hco3", "i", "idp", "imp", "itp", "k", "na1", "nad",
    //  "nadh", "nadp", "nadph", "nh4", "no", "no2", "o2", "o2s", "oh1",
    //  "pi", "ppi", "pppi", "so3", "so4", "udp", "ump", "utp"
    //];
    // Compile attributes' values.
    var attributesValues = {
      compartmentalization: compartmentalization,
      simplification: simplification
    };
    // Return attributes' values.
    return attributesValues;
  }

  /**
  * Initializes values of attributes that relate to network's elements.
  * @returns {Object} Collection of multiple attributes that relate to network's
  * elements.
  */
  static initializeNetworkElementsAttributes() {
    // Initialize attributes for network's elements.
    var metabolitesNodes = null;
    var reactionsNodes = null;
    var links = null;
    var network = null;
    var currentMetabolitesNodes = null;
    var currentReactionsNodes = null;
    var currentLinks = null;
    var subNetwork = null;
    // Compile novel values of attributes.
    var attributesValues = {
      metabolitesNodes: metabolitesNodes,
      reactionsNodes: reactionsNodes,
      links: links,
      network: network,
      currentMetabolitesNodes: currentMetabolitesNodes,
      currentReactionsNodes: currentReactionsNodes,
      currentLinks: currentLinks,
      subNetwork: subNetwork
    };
    // Return attributes' values.
    return attributesValues;
  }
}
