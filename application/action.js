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

    var entitiesCandidates = Candidacy.determineCandidateEntities({
      compartmentalization: model.compartmentalization,
      reactionsSimplifications: model.reactionsSimplifications,
      metabolitesSimplifications: model.metabolitesSimplifications,
      reactionsSets: model.filterReactionsSets,
      reactions: model.reactions
    });

    console.log("testing candidates");
    console.log(entitiesCandidates);



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
  static restoreSetsSummary(state) {
    // Initialize filters against entities' sets.
    var entitiesSetsFilters = Action.initializeEntitiesSetsFilters();
    // Determine current entities' attribution to sets.
    var currentEntitiesSets = Attribution.determineCurrentEntitiesSets({
      setsFilters: entitiesSetsFilters.setsFilters,
      totalReactionsSets: state.totalReactionsSets,
      totalMetabolitesSets: state.totalMetabolitesSets,
      reactions: state.reactions
    });
    // Initialize selections that influence sets' cardinalities.
    var setsCardinalitiesSelections = Action
    .initializeSetsCardinalitiesSelections();
    // Determine sets' cardinalities.
    var setsCardinalitiesSummary = Cardinality
    .determineSetsCardinalitiesSummary({
      setsEntities: setsCardinalitiesSelections.setsEntities,
      setsFilter: setsCardinalitiesSelections.setsFilter,
      accessReactionsSets: currentEntitiesSets.accessReactionsSets,
      accessMetabolitesSets: currentEntitiesSets.accessMetabolitesSets,
      filterReactionsSets: currentEntitiesSets.filterReactionsSets,
      filterMetabolitesSets: currentEntitiesSets.filterMetabolitesSets
    });

    // TODO: Any change to filters should also change the candidate entities...

    // TODO: Optionally re-initialize network definitions to avoid re-drawing the same network.
    // Initialize network's elements.
    //var networkElementsAttributes = Action
    //.initializeNetworkElementsAttributes();

    // Compile novel values of attributes.
    var attributesValues = Object.assign(
      {},
      entitiesSetsFilters,
      currentEntitiesSets,
      setsCardinalitiesSelections,
      setsCardinalitiesSummary
    );
    // Submit novel values of attributes to the model of the application's
    // state.
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
    var previousEntities = state.setsEntities;
    if (previousEntities === "metabolites") {
      var currentEntities = "reactions";
    } else if (previousEntities === "reactions") {
      var currentEntities = "metabolites";
    }
    // Determine sets' cardinalities.
    var setsCardinalitiesSummary = Cardinality
    .determineSetsCardinalitiesSummary({
      setsEntities: currentEntities,
      setsFilter: state.setsFilter,
      accessReactionsSets: state.accessReactionsSets,
      accessMetabolitesSets: state.accessMetabolitesSets,
      filterReactionsSets: state.filterReactionsSets,
      filterMetabolitesSets: state.filterMetabolitesSets
    });

    // TODO: Optionally re-initialize network definitions to avoid re-drawing the same network.
    // Initialize network's elements.
    //var networkElementsAttributes = Action
    //.initializeNetworkElementsAttributes();

    // Compile novel values of attributes.
    var novelAttributesValues = {
      setsEntities: currentEntities
    };
    var attributesValues = Object.assign(
      {},
      setsCardinalitiesSummary,
      novelAttributesValues
    );
    // Submit novel values of attributes to the model of the application's
    // state.
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
    var previousFilter = state.setsFilter;
    if (previousFilter) {
      var currentFilter = false;
    } else {
      var currentFilter = true;
    }

    // TODO: Do all the relevant stuff...



    // Determine sets' cardinalities.
    var setsCardinalitiesSummary = Cardinality
    .determineSetsCardinalitiesSummary({
      setsEntities: state.setsEntities,
      setsFilter: currentFilter,
      accessReactionsSets: state.accessReactionsSets,
      accessMetabolitesSets: state.accessMetabolitesSets,
      filterReactionsSets: state.filterReactionsSets,
      filterMetabolitesSets: state.filterMetabolitesSets
    });

    // TODO: Optionally re-initialize network definitions to avoid re-drawing the same network.
    // Initialize network's elements.
    //var networkElementsAttributes = Action
    //.initializeNetworkElementsAttributes();

    // Compile novel values of attributes.
    var novelAttributesValues = {
      setsFilter: currentFilter
    };
    var attributesValues = Object.assign(
      {},
      setsCardinalitiesSummary,
      novelAttributesValues
    );
    // Submit novel values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Changes the specifications to sort sets' summaries.
  * @param {string} attribute Name of attribute.
  * @param {string} criterion Criterion for sort.
  * @param {Object} state Application's state.
  */
  static changeSetsSorts(attribute, criterion, state) {
    // TODO: if criterion is new (not current), set to default order
    // TODO: if criterion is current, change order

    var temp = {
      processes: {
        criterion: "count", // or "name"
        order: "descend" // or "ascend"
      },
      compartments: {
        criterion: "count",
        order: "descend"
      }
    };
    // Determine whether current criterion matches previous criterion.
    if (criterion === state.setsSorts[attribute].criterion) {
      // Current criterion matches previous criterion.
      // Change the specification's order.
      if (state.setsSorts[attribute].order === "descend") {
        var order = "ascend";
      } else if (state.setsSorts[attribute].order === "ascend") {
        var order = "descend";
      }
    } else {
      // Current criterion does not match previous criterion.
      // Change the specification to the current criterion with default order.
      var order = "descend";
    }



    // Determine entities of interest.
    var previousEntities = state.setsEntities;
    if (previousEntities === "metabolites") {
      var currentEntities = "reactions";
    } else if (previousEntities === "reactions") {
      var currentEntities = "metabolites";
    }

    // TODO: Do all the relevant stuff...


    // Compile novel values of attributes.
    var novelAttributesValues = {
      setsEntities: currentEntities
    };
    var attributesValues = Object.assign(
      {},
      setsCardinalitiesSummary,
      novelAttributesValues
    );
    // Submit novel values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }



  /**
  * Selects an attribute's value.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Value of attribute in current selection.
  * @param {string} parameters.attribute Attribute in current selection.
  * @param {Object} state Application's state.
  */
  static selectSetsAttributeValue({value, attribute, state} = {}) {
    // Record set's selection for filters.
    var setsFilters = Attribution.recordSetSelectionFilters({
      value: value,
      attribute: attribute,
      setsFilters: model.setsFilters
    });
    // Determine current entities' attribution to sets.
    var currentEntitiesSets = Attribution.determineCurrentEntitiesSets({
      setsFilters: setsFilters,
      totalReactionsSets: model.totalReactionsSets,
      totalMetabolitesSets: model.totalMetabolitesSets,
      reactions: model.reactions
    });
    // Determine sets' cardinalities.
    var setsCardinalitiesSummary = Cardinality
    .determineSetsCardinalitiesSummary({
      setsEntities: model.setsEntities,
      setsFilter: model.setsFilter,
      accessReactionsSets: currentEntitiesSets.accessReactionsSets,
      accessMetabolitesSets: currentEntitiesSets.accessMetabolitesSets,
      filterReactionsSets: currentEntitiesSets.filterReactionsSets,
      filterMetabolitesSets: currentEntitiesSets.filterMetabolitesSets
    });

    // TODO: Any change to filters should also change the candidate entities...

    // TODO: Optionally re-initialize network definitions to avoid re-drawing the same network.
    // Initialize network's elements.
    //var networkElementsAttributes = Action
    //.initializeNetworkElementsAttributes();

    // Compile novel values of attributes.
    var novelAttributesValues = {
      setsFilters: setsFilters
    };
    var attributesValues = Object.assign(
      {},
      currentEntitiesSets,
      setsCardinalitiesSummary,
      novelAttributesValues
    );
    // Submit novel values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }

  /**
  * Changes the specification of compartmentalization for the network's
  * assembly.
  * Submits new values to the model of the application's state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static changeCompartmentalization(model) {
    // Change compartmentalization.
    var previousValue = model.compartmentalization;
    if (previousValue) {
      var currentValue = false;
    } else {
      var currentValue = true;
    }
    // Initialize selections for entities' simplification.
    // Simplifications are specific to candidate entities, which are specific to
    // the context of interest, of which compartmentalization is part.
    var simplifications = Action.initializeEntitiesSimplifications();

    // TODO: Any change to compartmentalization should also change the candidate entities...

    // TODO: Optionally re-initialize network definitions to avoid re-drawing the same network.
    // Initialize network's elements.
    //var networkElementsAttributes = Action
    //.initializeNetworkElementsAttributes();

    // Compile novel values of attributes.
    var novelAttributesValues = {
      compartmentalization: currentValue
    };
    var attributesValues = Object.assign(
      {},
      simplifications,
      novelAttributesValues
    );
    // Submit novel values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
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
  static createPersistentState(model) {
    return model.attributeNames.reduce(function (collection, attributeName) {
      var novelRecord = {
        [attributeName]: model[attributeName]
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
    // Compile novel attributes' values.
    var novelAttributesValues = {
      source: source
    };
    var attributesValues = Object.assign(data, novelAttributesValues);
    // Submit novel attributes' values to the application's state.
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
    Action.initializeApplicationInformation({
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
  static initializeApplicationInformation({metabolicEntitiesSets, state} = {}) {
    // Initialize application's state from information about metabolic entities
    // and sets.
    // Remove any information about source from the application's state.
    var source = null;
    // Determine total entities' attribution to sets.
    var totalEntitiesSets = Attribution
    .determineTotalEntitiesSets(metabolicEntitiesSets.reactions);
    // Initialize filters against entities' sets.
    var setsFilters = Attribution.createInitialSetsFilters();
    // Determine current entities' attribution to sets.
    var currentEntitiesSets = Attribution.determineCurrentEntitiesSets({
      setsFilters: entitiesSetsFilters.setsFilters,
      totalReactionsSets: totalEntitiesSets.totalReactionsSets,
      totalMetabolitesSets: totalEntitiesSets.totalMetabolitesSets,
      reactions: metabolicEntitiesSets.reactions
    });
    // Initialize selections that influence sets' cardinalities.
    var setsCardinalitiesSelections = Action
    .initializeSetsCardinalitiesSelections();
    // Determine sets' cardinalities.
    var setsCardinalities = Cardinality.determineSetsCardinalities({
      setsEntities: setsCardinalitiesSelections.setsEntities,
      setsFilter: setsCardinalitiesSelections.setsFilter,
      accessReactionsSets: currentEntitiesSets.accessReactionsSets,
      accessMetabolitesSets: currentEntitiesSets.accessMetabolitesSets,
      filterReactionsSets: currentEntitiesSets.filterReactionsSets,
      filterMetabolitesSets: currentEntitiesSets.filterMetabolitesSets
    });
    // TODO: I need to split the setsCardinalities from the setsSummaries...
    // TODO: for the sake of efficiency...
    // Initialize specifications to sort sets' summaries.
    var setsSorts = Cardinality.createInitialSetsSorts();
    // Create sets' summaries.

    // Sort sets' summaries.



    // Determine sets' cardinalities.



    // Initialize selection for compartmentalization's relevance.
    var compartmentalization = Action.initializeCompartmentalizationSelection();
    // Initialize selections for entities' simplification.
    // Simplifications are specific to candidate entities, which are specific to
    // the context of interest, of which compartmentalization is part.
    var simplifications = Action.initializeEntitiesSimplifications();

    // TODO: I'll need to include the procedure for entitiesCandidates once it's complete.
    // TODO: I'll also need to include this procedure for other actions that will change the candidates...
    // TODO: ... changes to compartmentalization, selections of sets, selections of entities for simplification
    if (false) {
      // Determine entities that are candidates of interest.
      var candidateEntities = Candidacy.determineCandidateEntities({
        compartmentalization: compartmentalization.compartmentalization,
        reactionsSimplifications: simplifications.reactionsSimplifications,
        metabolitesSimplifications: simplifications.metabolitesSimplifications,
        reactionsSets: currentEntitiesSets.filterReactionsSets,
        reactions: metabolicEntitiesSets.reactions
      });
    }

    // TODO: I'll also need to include procedure for definition of network's elements.

    // Initialize application's attributes for individual entities.
    //var networkDefinitionAttributes = Action
    //.initializeNetworkDefinitionAttributes();
    //var networkElementsAttributes = Action
    //.initializeNetworkElementsAttributes();


    //////////////////////////////////////////


    //////////////////////////////////////////

    // Compile novel attributes' values.
    var novelAttributesValues = {
      source: source,
      setsFilters: setsFilters,
      setsCardinalities: setsCardinalitites,
      setsSorts: setsSorts
    };
    var attributesValues = Object.assign(
      metabolicEntitiesSets,
      totalEntitiesSets,
      entitiesSetsFilters,
      currentEntitiesSets,
      setsCardinalitiesSelections,
      compartmentalization,
      simplifications,
      //networkDefinitionAttributes,
      //networkElementsAttributes,
      novelAttributesValues
    );
    // Submit novel attributes' values to the application's state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      state: state
    });
  }
  /**
  * Initializes information about selections that influence cardinalities of
  * sets of entities.
  * @returns {Object} Collection of multiple attributes.
  */
  static initializeSetsCardinalitiesSelections() {
    // Initialize selection of entities for sets' cardinalities.
    var setsEntities = "metabolites";
    // Initialize selection of whether to filter sets' entities for summary.
    var setsFilter = false;
    // Compile novel values of attributes.
    var attributesValues = {
      setsEntities: setsEntities,
      setsFilter: setsFilter
    };
    // Return novel values of attributes.
    return attributesValues;
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
  static createNetwork(model) {
    // Assemble network's nodes and links.
    // There are 2652 metabolites and 7785 reactions.
    // Assembly of network elements from all metabolic entities.
    // General, Replication: 23315 nodes, 55058 links, 3.5 minutes
    // Compartmental, Replication: 26997 nodes, 64710 links, 4 minutes
    // TODO: Accommodate new organization of network elements.
    var networkElements = Network.createNetworkElements({
      compartmentalization: model.compartmentalization,
      simplification: model.simplification,
      metabolites: model.currentMetabolites,
      reactions: model.currentReactions
    });
    // Evaluate network's assembly.
    console.log("network elements");
    console.log(networkElements);
    //var replicateNodes = General
    //    .checkReplicateElements(networkElements.nodes);
    //var replicateLinks = General
    //    .checkReplicateElements(networkElements.links);
    //var emptyNodes = networkElements.nodes.filter(function (node) {
    //    return !node.hasOwnProperty("identifier");
    //});
    // Copy network elements to current network elements.
    var currentNetworkElements = Network.copyNetworkElements(networkElements);
    console.log("current network elements");
    console.log(currentNetworkElements);
    // Compile novel values of attributes.
    var attributesValues = Object.assign(
      {},
      networkElements,
      currentNetworkElements
    );
    // Submit novel values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });

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
  /**
  * Designates a single metabolite for simplification.
  * Submits new values to the model of the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a single metabolite.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static changeMetabolitesSimplification({identifiers, model} = {}) {
    // Access record for metabolite.
    var metabolites = model.currentMetabolites;
    var metabolite = metabolites[identifier];
    Extraction.changeMetaboliteSimplification(metabolite);

    // TODO: I need to include the new record for metabolite in the model's currentMetabolites.
    // TODO: First update the records, then submit to model.
  }
  /**
  * Designates a single metabolite for simplification.
  * Submits new values to the model of the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a single metabolite.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static changeMetaboliteSimplification({identifier, model} = {}) {
    // Access record for metabolite.
    var metabolites = model.currentMetabolites;
    var metabolite = metabolites[identifier];
    Extraction.changeMetaboliteSimplification(metabolite);
  }


  // Secondary actions relevant to application's state.

  /**
  * Initializes information about compartmentalization's relevance.
  * @returns {Object} Collection of multiple attributes.
  */
  static initializeCompartmentalizationSelection() {
    // Initialize selection of whether to represent compartmentalization.
    var compartmentalization = true;
    // Compile novel values of attributes.
    var attributesValues = {
      compartmentalization: compartmentalization
    };
    // Return novel values of attributes.
    return attributesValues;
  }
  /**
  * Initializes information about selections of simplifications.
  * @returns {Object} Collection of multiple attributes.
  */
  static initializeEntitiesSimplifications() {
    // Initialize selections of reactions for simplification.
    var reactionsSimplifications = Candidacy
    .createInitialReactionsSimplifications();
    // Initialize selections of reactions for simplification.
    var metabolitesSimplifications = Candidacy
    .createInitialMetabolitesSimplifications();
    // Compile novel values of attributes.
    var attributesValues = {
      reactionsSimplifications: reactionsSimplifications,
      metabolitesSimplifications: metabolitesSimplifications
    };
    // Return novel values of attributes.
    return attributesValues;
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
