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
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static initializeApplicationInformation({metabolicEntitiesSets, model} = {}) {
    // Initialize values of application's attributes for information about
    // metabolic entities and sets.
    // Remove the current file selection from the application's state.
    var file = null;
    // Determine entities' attribution to sets.
    var setsTotalEntities = Action
    .createSetsTotalEntities(metabolicEntitiesSets.reactions);
    // Initialize selections for entities' sets.
    var setsEntitiesSelections = Action.initializeSetsEntitiesSelections();
    // Determine sets' cardinalities.
    var setsEntitiesCardinalities = Action.determineSetsEntitiesCardinalities({
      setsSelections: setsEntitiesSelections.setsSelections,
      setsEntities: setsEntitiesSelections.setsEntities,
      setsFilter: setsEntitiesSelections.setsFilter,
      setsTotalReactions: setsTotalEntities.setsTotalReactions,
      setsTotalMetabolites: setsTotalEntities.setsTotalMetabolites,
      reactions: metabolicEntitiesSets.reactions
    });
    // Initialize selection for compartmentalization's relevance.
    var compartmentalization = Action.initializeCompartmentalizationSelection();
    // TODO: Any change to the compartmentalization selection should re-initialize the simplification selections.
    // Initialize selections for entities' simplification.
    var simplifications = Action.initializeSimplificationSelections();
    if (false) {
      // Determine entities that are relevant to context of interest.
      var contextEntities = Action.createContextEntities({
        compartmentalization: compartmentalization,
        simplificationReactions: simplifications.simplificationReactions,
        simplificationMetabolites: simplifications.simplificationMetabolites,
        setsCurrentReactions: setsEntitiesCardinalities.setsCurrentReactions,
        reactions: metabolicEntitiesSets.reactions
      });
    }

    // Initialize selections for simplification of entities, reactions or
    // metabolites. (after creating the entities in the first place)
    // TODO: Initialize selections of simplification for reactions and metabolites.
    // TODO: Reactions can only have simplification by omission.
    // TODO: Metabolites can have simplification by either omission or replication.



    // Initialize application's attributes for sets of entities.
    //var currentEntitiesSetsAttributes = Action
    //.initializeCurrentEntitiesSetsAttributes(entitiesSets);

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
      setsTotalEntities,
      setsEntitiesSelections,
      setsEntitiesCardinalities,
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


  // TODO: Repair changeSetsEntities.

  /**
  * Changes the entities of interest for the sets' summary.
  * Also prepares new sets' summary.
  * Submits new values to the model of the application's state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static changeSetsEntities(model) {
    // Determine new entities of interest.
    var previousEntities = model.setsEntities;
    if (previousEntities === "metabolites") {
      var currentEntities = "reactions";
    } else if (previousEntities === "reactions") {
      var currentEntities = "metabolites";
    }
    // Determine values of attributes that summarize cardinalities of sets
    // of entities.
    var setsCardinalitiesAttributes = Action
    .determineEntitiesSetsCardinalitiesAttributes({
      entities: currentEntities,
      filter: model.setsFilter,
      selections: model.setsSelections,
      metabolites: model.metabolites,
      reactions: model.reactions,
      currentMetabolites: model.currentMetabolites,
      currentReactions: model.currentReactions
    });
    // Initialize network's elements.
    var networkElementsAttributes = Action
    .initializeNetworkElementsAttributes();
    // Compile new values of attributes.
    var novelAttributesValues = {
      setsEntities: currentEntities
    };
    var attributesValues = Object.assign(
      {},
      setsCardinalitiesAttributes,
      networkElementsAttributes,
      novelAttributesValues
    );
    // Submit new values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }

  // TODO: Repair changeSetsFilter.

  /**
  * Changes the specification of filter for the sets' summary.
  * Also determines new sets' cardinalities and prepares new sets' summary.
  * Submits new values to the model of the application's state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static changeSetsFilter(model) {
    // Determine new filter.
    var previousFilter = model.setsFilter;
    if (previousFilter) {
      var currentFilter = false;
    } else {
      var currentFilter = true;
    }
    // Determine values of attributes that summarize cardinalities of sets
    // of entities.
    var setsCardinalitiesAttributes = Action
    .determineEntitiesSetsCardinalitiesAttributes({
      entities: model.setsEntities,
      filter: currentFilter,
      selections: model.setsSelections,
      metabolites: model.metabolites,
      reactions: model.reactions,
      currentMetabolites: model.currentMetabolites,
      currentReactions: model.currentReactions
    });
    // Initialize network's elements.
    var networkElementsAttributes = Action
    .initializeNetworkElementsAttributes();
    // Compile new values of attributes.
    var novelAttributesValues = {
      setsFilter: currentFilter
    };
    var attributesValues = Object.assign(
      {},
      setsCardinalitiesAttributes,
      networkElementsAttributes,
      novelAttributesValues
    );
    // Submit new values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }
  /**
  * Selects an attribute's value from the sets' summary.
  * Submits new values to the model of the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Value of attribute in current selection.
  * @param {string} parameters.attribute Attribute in current selection.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static selectSetsAttributeValue({value, attribute, model} = {}) {
    // Record current selection in collection of selections of attributes
    // and values for set view.
    // These selections determine which attributes and values define filters
    // against entities' attributes.
    var setsSelections = Attribution.recordFilterSelection({
      value: value,
      attribute: attribute,
      previousSelections: model.setsSelections
    });
    // Determine sets' cardinalities.
    var setsEntitiesCardinalities = Action.determineSetsEntitiesCardinalities({
      setsSelections: model.setsSelections,
      setsEntities: model.setsEntities,
      setsFilter: model.setsFilter,
      setsTotalReactions: model.setsTotalReactions,
      setsTotalMetabolites: model.setsTotalMetabolites,
      reactions: model.reactions
    });

    if (false) {
      // Determine values of attributes that summarize cardinalities of sets of
      // entities.
      var setsCardinalitiesAttributes = Action
      .determineEntitiesSetsCardinalitiesAttributes({
        entities: model.setsEntities,
        filter: model.setsFilter,
        selections: setsSelections,
        metabolites: model.metabolites,
        reactions: model.reactions,
        currentMetabolites: currentMetabolites,
        currentReactions: currentReactions
      });
      // Initialize network's elements.
      var networkElementsAttributes = Action
      .initializeNetworkElementsAttributes();
    }

    // Compile novel values of attributes.
    var novelAttributesValues = {
      setsSelections: setsSelections
    };
    var attributesValues = Object.assign(
      {},
      setsEntitiesCardinalities,
      novelAttributesValues
    );
    // Submit novel values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }

  // TODO: Repair restoreSetsSummary();

  /**
  * Restores sets' summary to its initial state.
  * @param {Object} model Model of the application's comprehensive state.
  */
  static restoreSetsSummary(model) {
    // Compile information about metabolic entities and sets.
    var entitiesSets = {
      compartments: model.compartments,
      genes: model.genes,
      processes: model.processes,
      metabolites: model.metabolites,
      reactions: model.reactions
    };
    // Initialize application's attributes for entities' sets.
    var entitiesSetsAttributes = Action
    .initializeCurrentEntitiesSetsAttributes(entitiesSets);
    // Initialize network's elements.
    var networkElementsAttributes = Action
    .initializeNetworkElementsAttributes();
    // Compile novel values of attributes.
    var attributesValues = Object.assign(
      {},
      entitiesSetsAttributes,
      networkElementsAttributes
    );
    // Submit novel values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }

  // TODO: Repair changeCompartmentalization

  /**
  * Changes the specification of compartmentalization for the network's
  * assembly.
  * Submits new values to the model of the application's state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static changeCompartmentalization(model) {
    // TODO: Any change to the compartmentalization selection should re-initialize the simplification selections.
    // Change compartmentalization.
    var previousValue = model.compartmentalization;
    if (previousValue) {
      var currentValue = false;
    } else {
      var currentValue = true;
    }
    // Initialize network's elements.
    var networkElementsAttributes = Action
    .initializeNetworkElementsAttributes();
    // Compile new values of attributes.
    var novelAttributesValues = {
      compartmentalization: currentValue
    };
    var attributesValues = Object.assign(
      {},
      networkElementsAttributes,
      novelAttributesValues
    );
    // Submit new values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }
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
  * Summarizes the counts of reactions in which each metabolite participates.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static summarizeMetabolitesParticipationReactions(model) {
    // Prepare summary of metabolites' participation in reactions.
    var summary = Extraction
    .createMetabolitesParticipationSummary(model.currentMetabolites);
    console.log("summary of metabolites' participation in reactions...");
    console.log(summary);
    General.saveObject("metabolites_reactions.json", summary);
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
  * Creates information about the sets to which all entities belong by their
  * values of attributes.
  * @param {Object<Object>} reactions Information about reactions.
  * @returns {Object} Collection of multiple attributes.
  */
  static createSetsTotalEntities(reactions) {
    // Determine for each reaction the metabolites that participate and to which
    // sets it belongs by its values of attributes.
    var setsTotalReactions = Attribution
    .collectReactionsMetabolitesAttributesValues(reactions);
    // Determine for each metabolite the reactions in which it participates and
    // to which sets it belongs by its values of attributes.
    var setsTotalMetabolites = Attribution
    .collectMetabolitesReactionsAttributesValues(setsTotalReactions, reactions);
    // Compile novel values of attributes.
    var attributesValues = {
      setsTotalReactions: setsTotalReactions,
      setsTotalMetabolites: setsTotalMetabolites
    };
    // Return novel values of attributes.
    return attributesValues;
  }
  /**
  * Initializes information about selections that influence cardinalities of
  * sets of entities.
  * @returns {Object} Collection of multiple attributes.
  */
  static initializeSetsEntitiesSelections() {
    // Initialize selections of values of attributes for sets.
    var setsSelections = [];
    // Initialize selection of entities for sets' cardinalities.
    var setsEntities = "metabolites";
    // Initialize selection of whether to filter sets' entities for summary.
    var setsFilter = false;
    // Compile novel values of attributes.
    var attributesValues = {
      setsSelections: setsSelections,
      setsEntities: setsEntities,
      setsFilter: setsFilter
    };
    // Return novel values of attributes.
    return attributesValues;
  }
  /**
  * Determines information about the sets to which current entities belong by
  * their values of attributes and the cardinalities of these sets.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.setsSelections Selections of
  * attributes' values.
  * @param {string} parameters.setsEntities Selection of type of entities for
  * sets' cardinalities.
  * @param {boolean} parameters.setsFilter Selection of whether to filter sets'
  * entities for summary.
  * @param {Array<Object>} parameters.setsTotalReactions Information about all
  * reactions' metabolites and sets.
  * @param {Array<Object>} parameters.setsTotalMetabolites Information about all
  * metabolites' reactions and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Collection of multiple attributes.
  */
  static determineSetsEntitiesCardinalities({
    setsSelections, setsEntities, setsFilter, setsTotalReactions,
    setsTotalMetabolites, reactions
  } = {}) {
    // Determine entities and their values of attributes that pass filters from
    // selections.
    // The filtration procedure is computationally expensive.
    // Determine whether there are any selections of attributes' values to apply
    // as filters.
    if (setsSelections.length === 0) {
      // There are not any selections of attributes' values to apply as filters.
      // Copy information about metabolic entities.
      var setsCurrentReactions = General.copyValueJSON(setsTotalReactions);
      var setsCurrentMetabolites = General.copyValueJSON(setsTotalMetabolites);
    } else {
      // There are selections of attributes' values to apply as filters.
      // Filter the metabolic entities and their values of attributes.
      // Filter against complete collections of entities to account for any
      // changes to selections of filters.
      // Filter for each reaction the metabolites that participate and to which
      // sets it belongs by its values of attributes.
      var setsCurrentReactions = Attribution
      .filterReactionsMetabolitesAttributesValues({
        setsSelections: setsSelections,
        setsTotalReactions: setsTotalReactions,
        reactions: reactions
      });
      // Determine for each metabolite the reactions in which it participates
      // and to which sets it belongs by its values of attributes.
      var setsCurrentMetabolites = Attribution
      .filterMetabolitesReactionsAttributesValues({
        setsTotalMetabolites: setsTotalMetabolites,
        setsCurrentReactions: setsCurrentReactions,
        reactions: reactions
      });
    }
    // Determine sets' cardinalities.
    var setsCardinalities = Cardinality.determineSetsCardinalities({
      setsEntities: setsEntities,
      setsFilter: setsFilter,
      setsCurrentReactions: setsCurrentReactions,
      setsCurrentMetabolites: setsCurrentMetabolites,
      setsTotalReactions: setsTotalReactions,
      setsTotalMetabolites: setsTotalMetabolites
    });
    // Prepare summary of sets of entities.
    var setsSummary = Cardinality.prepareSetsSummary(setsCardinalities);
    // Compile novel values of attributes.
    var attributesValues = {
      setsCurrentReactions: setsCurrentReactions,
      setsCurrentMetabolites: setsCurrentMetabolites,
      setsCardinalities: setsCardinalities,
      setsSummary: setsSummary
    };
    // Return novel values of attributes.
    return attributesValues;
  }
  /**
  * Initializes information about selection of compartmentalization's relevance.
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
  static initializeSimplificationSelections() {
    // Initialize selections of reactions for simplification.
    var simplificationReactions = [];
    // Initialize selections of reactions for simplification.
    var simplificationMetabolites = [];
    // Compile novel values of attributes.
    var attributesValues = {
      simplificationReactions: simplificationReactions,
      simplificationMetabolites: simplificationMetabolites
    };
    // Return novel values of attributes.
    return attributesValues;
  }
  /**
  * Creates information about entities and relations between them that match the
  * context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @param {Array<Object<string>>} parameters.simplificationReactions Selections
  * of reactions for simplification.
  * @param {Array<Object<string>>} parameters.simplificationMetabolites
  * Selections of metabolites for simplification.
  * @param {Array<Object>} parameters.setsCurrentReactions Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Collection of multiple attributes.
  */
  static createContextEntities({
    compartmentalization,
    simplificationReactions,
    simplificationMetabolites,
    setsCurrentReactions,
    reactions
  } = {}) {
    // TODO: Rename "context entities" to "candidate entities" since these are
    // TODO: representations of entities that are elligible candidates for representation in the network.
    // Candidate entities are entities that are elligible candidates for
    // representation in the network.
    // An entity's elligibility depends on filters by its values of attributes,
    // the context of interest (especially in terms of compartmentalization),
    // and the elligibility of other entities that relate.
    // The purpose of candidate entities is to enable the user to access
    // information about individual entities and to change their
    // representations in the network.


    // TODO: Filter simplification selections to eliminate those created by dependency.
    // TODO: I need to re-determine these dependency selections each time to account for changes.
    // TODO: Alternatively, I could filter these within the action that changes selections... (a new action)



    // The relevance of individual entities and relations between them depends
    // on the context of interest.
    // A reaction's relevance depends on filtration
    //
    // compartmental context, its own
    // operation, and metabolites' participation.
    // A metabolite's relevance depends on the compartmental context and the
    // reactions in which it participates.




    // This procedure determines the relevance of individual entities and
    // relations between them in the context of interest.
    // Selections of individual entities for simplification directly indicate
    // the relevance of these entities.
    // A selection for simplification does not omit an entity from its list of
    // entities, such that the entity is still accessible for changes to the
    // selection.
    // In contrast, simplification of an entity does influence the relevance of
    // entities of the other type that rely on the entity for their own
    // relevance.
    if (false) {
      var contextReactions = Context.collectContextReactionsMetabolites({
        compartmentalization: compartmentalization,
        simplificationReactions: simplificationReactions,
        simplificationMetabolites: simplificationMetabolites,
        setsCurrentReactions: setsCurrentReactions,
        reactions: reactions
      });
    }

    // TODO: I need records for all entities, including those with selections for omission.
    // TODO: The idea is to give access to each entity and enable selections for simplification.

    // TODO: Create the context-dependent (ie compartmentalization) entities.
    // TODO: These records will be very similar to the setsCurrentReactions and setsCurrentMetabolites...
    // TODO: They only need references to their respective entity, reaction or metabolite...
    // TODO: ... and to the reactions or metabolites to which they relate
    // TODO: These relations need to reflect current filters AND compartmentalization.
    // TODO: Maybe adapt some processes from the network definition procedure.

    // TODO: Procedure for reactions...
    // TODO: Iterate on setsCurrentReactions
    // TODO: For each current reaction...
    // TODO: If compartmentalization is false...
    // TODO: ... then copy the reaction reference and metabolite references from setsCurrentReactions... done
    // TODO: If compartmentalization is true...
    // TODO: ... then access the reaction's record and determine in which compartment each metabolite participates
    // TODO: ... only consider compartments that pass filters
    // TODO: ... create compartmental identifiers for the metabolites
    // TODO: ... store references to these compartmental metabolites within the record.
    //
    // TODO: Maybe collect metabolite's reference identifiers and compartments while preparing contextReactions???
    //
    // TODO: Procedure for metabolites...
    // TODO: I suppose just derive the metabolites from the reactions as usual
    // TODO: Compartmental metabolites need their own compartmental identifiers, such as "pyr_c".
    // TODO: Compartmental metabolites also need references to their metabolite records and to their compartment.
    // TODO: Derive the compartmental name as needed, such as "pyruvate cytosol".
    // TODO: For simplicity, just derive metabolite and compartment identifiers from the ID (such as "pyr_c") within contextReactions record.


    if (false) {
      // Compile novel values of attributes.
      var attributesValues = {
        setsCurrentReactions: setsCurrentReactions,
        setsCurrentMetabolites: setsCurrentMetabolites,
        setsCardinalities: setsCardinalities,
        setsSummary: setsSummary
      };
      // Return novel values of attributes.
      return attributesValues;

    }
  }

  // TODO: SOME of these methods might be obsolete...

  /**
  * Initializes values of attributes that relate to sets of current entities.
  * @param {Object} entitiesSets Information about metabolic entities and
  * sets.
  * @returns {Object} Collection of multiple attributes that relate to sets
  * of current entities by their attributes.
  */
  static initializeCurrentEntitiesSetsAttributes(entitiesSets) {
    // Specify entities of interest for sets' summary.
    var setsEntities = "metabolites";
    // Specify filter option for sets' summary.
    var setsFilter = false;
    // Copy information about metabolic entities.
    var currentMetabolites = General.copyValueJSON(entitiesSets.metabolites);
    var currentReactions = General.copyValueJSON(entitiesSets.reactions);
    // Determine values of attributes that summarize cardinalities of sets
    // of entities.
    var setsCardinalitiesAttributes = Action
    .determineEntitiesSetsCardinalitiesAttributes({
      entities: setsEntities,
      filter: setsFilter,
      selections: setsSelections,
      metabolites: entitiesSets.metabolites,
      reactions: entitiesSets.reactions,
      currentMetabolites: currentMetabolites,
      currentReactions: currentReactions
    });
    // Compile novel values of attributes.
    var novelAttributesValues = {
      setsSelections: setsSelections,
      setsEntities: setsEntities,
      setsFilter: setsFilter,
      currentMetabolites: currentMetabolites,
      currentReactions: currentReactions
    };
    var attributesValues = Object
    .assign({}, setsCardinalitiesAttributes, novelAttributesValues);
    // Return novel values of attributes.
    return attributesValues;
  }
  /**
  * Determines values of all attributes that summarize cardinalities of sets
  * of entities.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.entities Current entities of interest.
  * @param {boolean} parameters.filter Current filter selection.
  * @param {Array<Object<string>>} parameters.selections Selections of attributes'
  * values from the sets' summary.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites.
  * @param {Object} parameters.reactions Records with information about
  * reactions.
  * @param {Object} parameters.currentMetabolites Records with information
  * about metabolites and values of their attributes that pass filters.
  * @param {Object} parameters.currentReactions Records with information
  * about reactions and values of their attributes that pass filters.
  * @returns {Object} Collection of multiple attributes that derive from
  * current entities' attributes.
  */
  static determineEntitiesSetsCardinalitiesAttributes({
    entities,
    filter,
    selections,
    metabolites,
    reactions,
    currentMetabolites,
    currentReactions
  } = {}) {
    // Determine cardinalities of sets of metabolic entities.
    var setsCardinalities = Cardinality.determineSetsCardinalities({
      entities: entities,
      filter: filter,
      metabolites: metabolites,
      reactions: reactions,
      currentMetabolites: currentMetabolites,
      currentReactions: currentReactions
    });
    // Prepare summary of sets of entities.
    // The sets' summary derives from sets' cardinalities and sets' selections.
    var setsSummary = Cardinality.prepareSetsSummary({
      selections: selections,
      setsCardinalities: setsCardinalities
    });
    // Return new values of attributes.
    return {
      setsCardinalities: setsCardinalities,
      setsSummary: setsSummary
    };
  }
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
