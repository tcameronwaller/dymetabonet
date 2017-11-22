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
* the state of the application. The methods require a reference to the instance
* of the model. These methods also call external methods as necessary.
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

  /**
  * Submits a new value for an attribute to the model of the application's
  * state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.value Value of the attribute.
  * @param {string} parameters.attribute Name of the attribute.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static submitAttribute({value, attribute, model} = {}) {
    var novelAttribute = [{
      attribute: attribute,
      value: value
    }];
    model.restore(novelAttribute, model);
  }
  /**
  * Submits new values for attributes to the model of the application's
  * state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.attributesValues New values of attributes.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static submitAttributes({attributesValues, model} = {}) {
    var novelAttributes = Object
    .keys(attributesValues).map(function (attribute) {
      return {
        attribute: attribute,
        value: attributesValues[attribute]
      };
    });
    model.restore(novelAttributes, model);
  }
  /**
  * Removes the value of an attribute in the model of the application's state
  * by submitting a null value for the attribute.
  * @param {string} name Name of the attribute.
  * @param {Object} model Model of the application's comprehensive state.
  */
  static removeAttribute(name, model) {
    Action.submitAttribute({
      value: null,
      attribute: name,
      model: model
    });
  }

  // Load information from file and call another action.

  /**
  * Loads from file a persistent representation of the application's state
  * and passes it to a procedure to restore the application to this state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static loadRestoreState(model) {
    General.loadPassObject({
      file: model.file,
      call: Action.restoreState,
      parameters: {model: model}
    });
  }
  /**
  * Loads from file information about metabolic entities and sets and passes
  * it to a procedure for check and clean.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static loadCheckMetabolicEntitiesSets(model) {
    General.loadPassObject({
      file: model.file,
      call: Action.checkCleanMetabolicEntitiesSets,
      parameters: {model: model}
    });
  }
  /**
  * Loads from file information about metabolic entities and sets and passes
  * it to a procedure for extraction and initialization.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static loadExtractInitializeMetabolicEntitiesSets(model) {
    General.loadPassObject({
      file: model.file,
      call: Action.extractInitializeMetabolicEntitiesSets,
      parameters: {model: model}
    });
  }

  // Primary actions relevant to application's state.

  /**
  * Initializes the model of the application's state by submitting null values
  * for all attributes.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static initializeApplication(model) {
    var attributesValues = model
    .attributeNames.reduce(function (collection, attributeName) {
      var novelRecord = {[attributeName]: null};
      return Object.assign({}, collection, novelRecord);
    }, {});
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }
  /**
  * Saves to a new file on client's system a persistent representation of the
  * application's state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static saveState(model) {
    var persistence = Action.createPersistentState(model);
    console.log("application's persistent state...");
    console.log(persistence);
    General.saveObject("state.json", persistence);
  }
  /**
  * Restores the application to a state from a persistent representation.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.data Persistent representation of the
  * application's state.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static restoreState({data, model} = {}) {
    // Remove any current file selection from the application's state.
    var novelFile = {
      file: null
    };
    // Submit new values of attributes to the model of the application's
    // state.
    var attributesValues = Object.assign({}, data, novelFile);
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }
  /**
  * Submits a new value for the file to the model of the application's state.
  * @param {Object} file File object.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static submitFile(file, model) {
    Action.submitAttribute({
      value: file,
      attribute: "file",
      model: model
    });
  }
  /**
  * Checks and cleans information about metabolic entities and sets in a
  * raw model of metabolism.
  * Saves this information to a new file on client's system.
  * Removes the current file selection from the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.data Information about metabolic entities and
  * sets.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static checkCleanMetabolicEntitiesSets({data, model} = {}) {
    var cleanData = Clean.checkCleanMetabolicEntitiesSetsRecon2(data);
    General.saveObject("clean_data.json", cleanData);
    // Remove the current file selection from the application's state.
    Action.removeAttribute("file", model);
  }
  /**
  * Extracts information about metabolic entities and sets from a clean model
  * of metabolism and uses this information to initialize the application.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.data Information about metabolic entities and
  * sets.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static extractInitializeMetabolicEntitiesSets({data, model} = {}) {
    // Extract information about metabolic entities and sets.
    // The full model has 2652 metabolites.
    // The full model has 7785 reactions.
    var metabolicEntitiesSets = Extraction
    .extractMetabolicEntitiesSetsRecon2(data);
    // Initialize application from information about metabolic entities and
    // sets.
    Action.initializeApplicationInformation({
      metabolicEntitiesSets: metabolicEntitiesSets,
      model: model
    });
  }
  /**
  * Initializes application from information about metabolic entities and
  * sets from a clean model of metabolism.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.metabolicEntitiesSets Information about metabolic
  * entities and sets.
  * @param {Object} parameters.model Model of the application's comprehensive
  * state.
  */
  static initializeApplicationInformation({metabolicEntitiesSets, model} = {}) {
    // Initialize values of application's attributes for information about
    // metabolic entities and sets.
    // Remove the current file selection from the application's state.
    var file = null;
    // Determine total entities' attribution to sets.
    var totalEntitiesSets = Attribution
    .determineTotalEntitiesSets(metabolicEntitiesSets.reactions);
    // Initialize filters against entities' sets.
    var entitiesSetsFilters = Action.initializeEntitiesSetsFilters();
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
    var setsCardinalitiesSummary = Cardinality
    .determineSetsCardinalitiesSummary({
      setsEntities: setsCardinalitiesSelections.setsEntities,
      setsFilter: setsCardinalitiesSelections.setsFilter,
      accessReactionsSets: currentEntitiesSets.accessReactionsSets,
      accessMetabolitesSets: currentEntitiesSets.accessMetabolitesSets,
      filterReactionsSets: currentEntitiesSets.filterReactionsSets,
      filterMetabolitesSets: currentEntitiesSets.filterMetabolitesSets
    });
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

    // Compile novel values of attributes.
    var novelAttributesValues = {
      file: file
    };
    var attributesValues = Object.assign(
      {},
      metabolicEntitiesSets,
      totalEntitiesSets,
      entitiesSetsFilters,
      currentEntitiesSets,
      setsCardinalitiesSelections,
      setsCardinalitiesSummary,
      compartmentalization,
      simplifications,
      //networkDefinitionAttributes,
      //networkElementsAttributes,
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
  * Changes the selection of entities of interest for the sets' summary.
  * @param {Object} model Model of the application's comprehensive state.
  */
  static changeSetsEntities(model) {
    // Determine entities of interest.
    var previousEntities = model.setsEntities;
    if (previousEntities === "metabolites") {
      var currentEntities = "reactions";
    } else if (previousEntities === "reactions") {
      var currentEntities = "metabolites";
    }
    // Determine sets' cardinalities.
    var setsCardinalitiesSummary = Cardinality
    .determineSetsCardinalitiesSummary({
      setsEntities: currentEntities,
      setsFilter: model.setsFilter,
      accessReactionsSets: model.accessReactionsSets,
      accessMetabolitesSets: model.accessMetabolitesSets,
      filterReactionsSets: model.filterReactionsSets,
      filterMetabolitesSets: model.filterMetabolitesSets
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
      model: model
    });
  }
  /**
  * Changes the selection of filter for the sets' summary.
  * @param {Object} model Model of the application's comprehensive state.
  */
  static changeSetsFilter(model) {
    // Determine filter.
    var previousFilter = model.setsFilter;
    if (previousFilter) {
      var currentFilter = false;
    } else {
      var currentFilter = true;
    }
    // Determine sets' cardinalities.
    var setsCardinalitiesSummary = Cardinality
    .determineSetsCardinalitiesSummary({
      setsEntities: model.setsEntities,
      setsFilter: currentFilter,
      accessReactionsSets: model.accessReactionsSets,
      accessMetabolitesSets: model.accessMetabolitesSets,
      filterReactionsSets: model.filterReactionsSets,
      filterMetabolitesSets: model.filterMetabolitesSets
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
      model: model
    });
  }
  /**
  * Selects an attribute's value.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Value of attribute in current selection.
  * @param {string} parameters.attribute Attribute in current selection.
  * @param {Object} parameters.model Model of the application's comprehensive
  * state.
  */
  static selectSetsAttributeValue({value, attribute, model} = {}) {
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
  * Restores sets' summary to initial state.
  * @param {Object} model Model of the application's comprehensive state.
  */
  static restoreSetsSummary(model) {
    // Initialize filters against entities' sets.
    var entitiesSetsFilters = Action.initializeEntitiesSetsFilters();
    // Determine current entities' attribution to sets.
    var currentEntitiesSets = Attribution.determineCurrentEntitiesSets({
      setsFilters: entitiesSetsFilters.setsFilters,
      totalReactionsSets: model.totalReactionsSets,
      totalMetabolitesSets: model.totalMetabolitesSets,
      reactions: model.reactions
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


  // ???

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
  /**
  * Executes a temporary procedure of utility for application's development.
  * @param {Object} model Model of the application's comprehensive state.
  */
  static executeTemporaryProcedure(model) {
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



  // Secondary actions relevant to application's state.

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
  * Initializes information about selections of sets by values of attributes.
  * @returns {Object} Collection of multiple attributes.
  */
  static initializeEntitiesSetsFilters() {
    // Initialize filters against entities' sets.
    var setsFilters = Attribution.createInitialSetsFilters();
    // Compile novel values of attributes.
    var attributesValues = {
      setsFilters: setsFilters
    };
    // Return novel values of attributes.
    return attributesValues;
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
