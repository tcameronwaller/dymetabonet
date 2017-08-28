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
    var newAttribute = [{
      attribute: attribute,
      value: value
    }];
    model.restore(newAttribute, model);
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
    var newAttributes = Object
    .keys(attributesValues).map(function (attribute) {
      return {
        attribute: attribute,
        value: attributesValues[attribute]
      };
    });
    model.restore(newAttributes, model);
  }
  /**
  * Removes the value of an attribute in the model of the application's state
  * by submitting a null value for the attribute.
  * @param {string} name Name of the attribute.
  * @param {Object} model Model of the comprehensive state of the
  * application.
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
  * Initializes the model of the application's state by submitting null
  * values for all attributes.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static initializeApplication(model) {
    var attributesValues = model
    .attributeNames.reduce(function (collection, attributeName) {
      var newRecord = {[attributeName]: null};
      return Object.assign({}, collection, newRecord);
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
    var newFile = {
      file: null
    };
    // Submit new values of attributes to the model of the application's
    // state.
    var attributesValues = Object.assign({}, data, newFile);
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
    var entitiesSets = Extraction.extractMetabolicEntitiesSetsRecon2(data);
    // Initialize application from information about metabolic entities and
    // sets.
    Action.initializeMetabolicEntitiesSets({
      entitiesSets: entitiesSets,
      model: model
    });
  }
  /**
  * Initializes application from information about metabolic entities and
  * sets from a clean model of metabolism.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.entitiesSets Information about metabolic
  * entities and sets.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static initializeMetabolicEntitiesSets({entitiesSets, model} = {}) {
    // Initialize values of attributes of the application's state for
    // information about metabolic entities and sets.
    // Remove the current file selection from the application's state.
    var file = null;
    // Initialize application's attributes for sets of current entities.
    var currentEntitiesSetsAttributes = Action
    .initializeCurrentEntitiesSetsAttributes(entitiesSets);
    // Initialize application's attributes for individual entities.
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
    // Compile new values of attributes.
    var newAttributesValues = {
      file: file,
      compartmentalization: compartmentalization,
      simplification: simplification
    };
    var attributesValues = Object
    .assign(
      {},
      entitiesSets,
      currentEntitiesSetsAttributes,
      newAttributesValues
    );
    // Submit new values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }
  /**
  * Changes the entities of interest for the sets' summary.
  * Also prepares new sets' summary.
  * Submits new values to the model of the application's state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static changeSetsEntities(model) {
    // Determine new entities of interest.
    var oldEntities = model.setsEntities;
    if (oldEntities === "metabolites") {
      var newEntities = "reactions";
    } else if (oldEntities === "reactions") {
      var newEntities = "metabolites";
    }
    // Determine values of attributes that summarize cardinalities of sets
    // of entities.
    var setsCardinalitiesAttributes = Action
    .determineEntitiesSetsCardinalitiesAttributes({
      entities: newEntities,
      filter: model.setsFilter,
      metabolites: model.metabolites,
      reactions: model.reactions,
      currentMetabolites: model.currentMetabolites,
      currentReactions: model.currentReactions
    });
    // Compile new values of attributes.
    var newAttributesValues = {
      setsEntities: newEntities
    };
    var attributesValues = Object
    .assign({}, setsCardinalitiesAttributes, newAttributesValues);
    // Submit new values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }
  /**
  * Changes the specification of filter for the sets' summary.
  * Also determines new sets' cardinalities and prepares new sets' summary.
  * Submits new values to the model of the application's state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static changeSetsFilter(model) {
    // Determine new filter.
    var oldFilter = model.setsFilter;
    if (oldFilter) {
      var newFilter = false;
    } else {
      var newFilter = true;
    }
    // Determine values of attributes that summarize cardinalities of sets
    // of entities.
    var setsCardinalitiesAttributes = Action
    .determineEntitiesSetsCardinalitiesAttributes({
      entities: model.setsEntities,
      filter: newFilter,
      metabolites: model.metabolites,
      reactions: model.reactions,
      currentMetabolites: model.currentMetabolites,
      currentReactions: model.currentReactions
    });
    // Compile new values of attributes.
    var newAttributesValues = {
      setsFilter: newFilter
    };
    var attributesValues = Object
    .assign({}, setsCardinalitiesAttributes, newAttributesValues);
    // Submit new values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }
  /**
  * Selects the value of an attribute in the sets' summary of the set view.
  * Submits new values to the model of the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Value of attribute in current selection.
  * @param {string} parameters.attribute Attribute in current selection.
  * @param {Object} parameters.model Model of the comprehensive state of the
  * application.
  */
  static selectSetsValue({value, attribute, model} = {}) {
    // Remove any selections of attributes for set view.
    // These selections determine which search menus to create in set view.
    var attributesSelections = [];
    // Record current selection in collection of selections of attributes
    // and values for set view.
    // These selections determine which attributes and values define filters
    // against entities' attributes.
    var valuesSelections = Attribution.recordFilterSelection({
      value: value,
      attribute: attribute,
      selections: model.valuesSelections
    });
    // Determine entities and their values of attributes that pass filters
    // from selections.
    // Filter against complete collections of entities to account for any
    // changes to selections of filters.
    // Copy metabolic entities.
    var metabolites = Extraction.copyEntities(model.metabolites);
    var reactions = Extraction.copyEntities(model.reactions);
    // Filter the metabolic entities and their values of attributes.
    var currentReactions = Attribution.filterReactionsAttributesValues({
      selections: valuesSelections,
      reactions: reactions
    });
    var currentMetabolites = Attribution
    .filterMetabolitesReactionsAttributesValues({
      metabolites: metabolites,
      reactions: currentReactions
    });
    // Determine values of attributes that summarize cardinalities of sets
    // of entities.
    var setsCardinalitiesAttributes = Action
    .determineEntitiesSetsCardinalitiesAttributes({
      entities: model.setsEntities,
      filter: model.setsFilter,
      metabolites: model.metabolites,
      reactions: model.reactions,
      currentMetabolites: currentMetabolites,
      currentReactions: currentReactions
    });
    // Compile new values of attributes.
    var newAttributesValues = {
      attributesSelections: attributesSelections,
      valuesSelections: valuesSelections,
      currentMetabolites: currentMetabolites,
      currentReactions: currentReactions
    };
    var attributesValues = Object
    .assign({}, setsCardinalitiesAttributes, newAttributesValues);
    // Submit new values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }
  /**
  * Restores sets' summary to its initial state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static restoreSetsSummary(model) {
    // Initialize application's attributes for entities' sets.
    var entitiesSetsAttributes = Action
    .initializeEntitiesSetsAttributes(model.allEntitiesAttributes);
    // Submit new values of attributes to the model of the application's
    // state.
    Action.submitAttributes({
      attributesValues: entitiesSetsAttributes,
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
    // Determine new compartmentalization.
    var oldValue = model.compartmentalization;
    if (oldValue) {
      var newValue = false;
    } else {
      var newValue = true;
    }
    // Submit new value of attribute to the model of the application's
    // state.
    Action.submitAttribute({
      value: newValue,
      attribute: "compartmentalization",
      model: model
    });
  }
  /**
  * Restores controls for network's assembly to initial state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static restoreNetworkAssembly(model) {
    // TODO: Put all operations for this restore in a separate method and call that method both from initializeMetabolicEntitiesSets and here.
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

    // Submit new values of attributes to the model of the application's
    // state.
    var attributesValues = {
      networkNodes: networkElements.nodes,
      networkLinks: networkElements.links,
      network: network,
      subNetwork: subNetwork,
      subNetworkNodes: subNodes,
      subNetworkLinks: subLinks
    };
    Action.submitAttributes({
      attributesValues: attributesValues,
      model: model
    });
  }
  /**
  * Executes a temporary procedure of utility for application's development.
  * @param {Object} model Model of the application's comprehensive state.
  */
  static executeTemporaryProcedure(model) {
    Action.createNetwork(model);
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
    return model
    .attributeNames
    .reduce(function (collection, attributeName) {
      var newRecord = {
        [attributeName]: model[attributeName]
      };
      return Object.assign({}, collection, newRecord);
    }, {});
  }
  /**
  * Initializes values of attributes that relate to sets of current entities.
  * @param {Object} entitiesSets Information about metabolic entities and
  * sets.
  * @returns {Object} Collection of multiple attributes that relate to sets
  * of current entities by their attributes.
  */
  static initializeCurrentEntitiesSetsAttributes(entitiesSets) {
    // Specify selections of attributes for sets' summary.
    // These selections determine which search menus to create in set view.
    var attributesSelections = [];
    // Specify selections of values of attributes for sets' summary.
    // These selections determine which attributes and values define filters
    // against entities' attributes.
    var valuesSelections = [];
    // Specify entities of interest for sets' summary.
    var setsEntities = "metabolites";
    // Specify filter option for sets' summary.
    var setsFilter = false;
    // Copy metabolic entities.
    var currentMetabolites = Extraction
    .copyEntities(entitiesSets.metabolites);
    var currentReactions = Extraction.copyEntities(entitiesSets.reactions);
    // Determine values of attributes that summarize cardinalities of sets
    // of entities.
    var setsCardinalitiesAttributes = Action
    .determineEntitiesSetsCardinalitiesAttributes({
      entities: setsEntities,
      filter: setsFilter,
      metabolites: entitiesSets.metabolites,
      reactions: entitiesSets.reactions,
      currentMetabolites: currentMetabolites,
      currentReactions: currentReactions
    });
    // Compile new values of attributes.
    var newAttributesValues = {
      attributesSelections: attributesSelections,
      valuesSelections: valuesSelections,
      setsEntities: setsEntities,
      setsFilter: setsFilter,
      currentMetabolites: currentMetabolites,
      currentReactions: currentReactions
    };
    var attributesValues = Object
    .assign({}, setsCardinalitiesAttributes, newAttributesValues);
    // Return new values of attributes.
    return attributesValues;
  }
  /**
  * Determines values of all attributes that summarize cardinalities of sets
  * of entities.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.entities Current entities of interest.
  * @param {boolean} parameters.filter Current filter selection.
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
    var setsSummary = Cardinality.prepareSetsSummary(setsCardinalities);
    // Return new values of attributes.
    return {
      setsCardinalities: setsCardinalities,
      setsSummary: setsSummary
    };
  }


  /**
  * Loads from a file at a specific path on client's system a default
  * representation of the application's state.
  * @param {string} path Directory path and file name of file with
  * information about application state.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  static loadDefaultState(path, model) {
    var data = General.loadObjectByPath(path);
    var newAttributes = Object.keys(data).map(function (key) {
      return {
        attribute: key,
        value: data[key]
      };
    });
    model.restore(newAttributes, model);

    // Scrap... I think...
    // Load data for assembly from file.
    //var assembly = General.loadFileByPath(path);
    // Extract attributes from assembly.
    //var newAttributes = General.extractAssemblyEntitiesSets(assembly);
    // Pass attributes from assembly to model.
    //model.restore(newAttributes);
  }
}
