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
    //
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
    //
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
    //
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
     * Saves to a new file on client's system a persistent representation of the
     * application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static saveState(model) {
        var persistence = Action.createPersistentState(model);
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
        // TODO: It would be helpful to organize this initialization somehow to
        // TODO: make the procedure more convenient for restore buttons for set
        // TODO: view and entity view respectively.
        // TODO: Return multiple attribute values in a single object.
        console.log("entitiesSets");
        console.log(entitiesSets);
        // TODO: Confirmed general compatibility to new reaction's attributes.
        // Initialize values of attributes of the application's state for
        // information about metabolic entities and sets.
        // Remove the current file selection from the application's state.
        var file = null;
        // Determine all attributes of all metabolic entities.
        var allEntitiesAttributes = Attribution
            .collectEntitiesAttributes(
                entitiesSets.metabolites, entitiesSets.reactions
            );
        // Initialize application's attributes for entities' sets.
        var entitiesSetsAttributes = Action
            .initializeEntitiesSetsAttributes(allEntitiesAttributes);


        // Initialize application's attributes for individual entities.
        // Specify compartmentalization option for entity view.
        var compartmentalization = true;
        // Specify replication options for entity view.
        var replications = [
            "ac", "accoa", "adp", "amp", "atp", "ca2", "camp", "cdp", "cl",
            "cmp", "co", "co2", "coa", "ctp", "datp", "dcmp", "dctp", "dna",
            "dtdp", "dtmp", "fe2", "fe3", "fmn", "gdp", "gmp", "gtp", "h", "h2",
            "h2o", "h2o2", "hco3", "i", "idp", "imp", "itp", "k", "na1", "nad",
            "nadh", "nadp", "nadph", "nh4", "no", "no2", "o2", "o2s", "oh1",
            "pi", "ppi", "pppi", "so3", "so4", "udp", "ump", "utp"
        ];
        //
        // Submit new values of attributes to the model of the application's
        // state.
        var newAttributesValues = {
            file: file,
            allEntitiesAttributes: allEntitiesAttributes,
            compartmentalization: compartmentalization,
            replications: replications
        };
        var attributesValues = Object
            .assign(
                {}, entitiesSets, entitiesSetsAttributes, newAttributesValues
            );
        Action.submitAttributes({
            attributesValues: attributesValues,
            model: model
        });
    }


    /**
     * Changes the specification of entity for the sets' summary.
     * Also prepares new sets' summary.
     * Submits new values to the model of the application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static changeSetsSummaryEntity(model) {
        // Determine new entity.
        var oldEntity = model.setsSummaryEntity;
        if (oldEntity === "metabolite") {
            var newEntity = "reaction";
        } else if (oldEntity === "reaction") {
            var newEntity = "metabolite";
        }
        // Prepare new sets' summary.
        var setsSummary = Cardinality
            .prepareSetsSummary(newEntity, model.setsCardinalities);
        // Submit new values of attributes to the model of the application's
        // state.
        var attributesValues = {
            setsSummaryEntity: newEntity,
            setsSummary: setsSummary
        };
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
    static changeSetsSummaryFilter(model) {
        // Determine new filter.
        var oldFilter = model.setsSummaryFilter;
        if (oldFilter) {
            var newFilter = false;
        } else {
            var newFilter = true;
        }
        // Determine new sets' cardinalities.
        var setsCardinalities = Cardinality
            .determineSetsCardinalities({
                filter: newFilter,
                currentEntitiesAttributes: model.currentEntitiesAttributes,
                allEntitiesAttributes: model.allEntitiesAttributes
            });
        // Prepare new sets' summary.
        var setsSummary = Cardinality
            .prepareSetsSummary(model.setsSummaryEntity, setsCardinalities);
        // Submit new values of attributes to the model of the application's
        // state.
        var attributesValues = {
            setsSummaryFilter: newFilter,
            setsCardinalities: setsCardinalities,
            setsSummary: setsSummary
        };
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
    static selectSetViewValue({value, attribute, model} = {}) {
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
        // Copy information about all entities' attributes.
        var copyEntitiesAttributes = Attribution
            .copyEntitiesAttributes(model.allEntitiesAttributes);
        // Filter the entities' attributes.
        // Always filter against all entities' attributes in order to
        // accommodate any changes to selections of filters.
        var currentEntitiesAttributes = Attribution
            .filterEntitiesAttributesValues({
                selections: valuesSelections,
                entitiesAttributes: copyEntitiesAttributes
            });
        // Determine values of all attributes that derive from current entities'
        // attributes.
        var entitiesAttributesDerivations = Action
            .determineValuesFromEntitiesAttributes({
                entity: model.setsSummaryEntity,
                filter: model.setsSummaryFilter,
                currentEntitiesAttributes: currentEntitiesAttributes,
                allEntitiesAttributes: model.allEntitiesAttributes
            });
        // Submit new values of attributes to the model of the application's
        // state.
        var newAttributesValues = {
            attributesSelections: attributesSelections,
            valuesSelections: valuesSelections,
            currentEntitiesAttributes: currentEntitiesAttributes
        };
        var attributesValues = Object
            .assign({}, entitiesAttributesDerivations, newAttributesValues);
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
        var networkElements = Network.assembleNetworkElements({
            currentMetabolites: model.currentMetabolites,
            currentReactionsAttributes: model.currentReactionsAttributes,
            replications: model.replications,
            compartmentalization: model.compartmentalization,
            metabolites: model.metabolites,
            reactions: model.reactions
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
        var subNetwork = Network.induceEgoNetwork({
            focus: "pyr_c",
            depth: 2,
            center: true,
            direction: null,
            network: network
        });
        //var subNetwork = network;
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
    // Secondary actions relevant to application's state.
    /**
     * Determines values of all attributes that derive from current entities'
     * attributes.
     * @param {Array<Object>} allEntitiesAttributes Attributes of all entities.
     * @returns {Object} Collection of multiple attributes that relate to sets
     * of entities by their attributes.
     */
    static initializeEntitiesSetsAttributes(allEntitiesAttributes) {
        // Specify selections of attributes for sets' summary.
        // These selections determine which search menus to create in set view.
        var attributesSelections = [];
        // Specify selections of values of attributes for sets' summary.
        // These selections determine which attributes and values define filters
        // against entities' attributes.
        var valuesSelections = [];
        // Specify entity option for sets' summary.
        var setsSummaryEntity = "metabolite";
        // Specify filter option for sets' summary.
        var setsSummaryFilter = false;
        // Determine attributes of metabolic entities that pass current filters.
        // For initialization, it is sufficient to copy the attributes of
        // metabolic entities.
        var currentEntitiesAttributes = Attribution
            .copyEntitiesAttributes(allEntitiesAttributes);
        // Determine values of all attributes that derive from current entities'
        // attributes.
        var entitiesAttributesDerivations = Action
            .determineValuesFromEntitiesAttributes({
                entity: setsSummaryEntity,
                filter: setsSummaryFilter,
                currentEntitiesAttributes: currentEntitiesAttributes,
                allEntitiesAttributes: allEntitiesAttributes
            });
        // Return new values of attributes.
        var newAttributesValues = {
            attributesSelections: attributesSelections,
            valuesSelections: valuesSelections,
            setsSummaryEntity: setsSummaryEntity,
            setsSummaryFilter: setsSummaryFilter,
            currentEntitiesAttributes: currentEntitiesAttributes
        };
        var attributesValues = Object
            .assign({}, entitiesAttributesDerivations, newAttributesValues);
        return attributesValues;
    }
    /**
     * Determines values of all attributes that derive from current entities'
     * attributes.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.entity Current entity selection.
     * @param {boolean} parameters.filter Current filter selection.
     * @param {Array<Object>} parameters.currentEntitiesAttributes Attributes of
     * all entities that pass current filters.
     * @param {Array<Object>} parameters.allEntitiesAttributes Attributes of all
     * entities.
     * @returns {Object} Collection of multiple attributes that derive from
     * current entities' attributes.
     */
    static determineValuesFromEntitiesAttributes({
                                                     entity,
                                                     filter,
                                                     currentEntitiesAttributes,
                                                     allEntitiesAttributes
                                                 } = {}) {
        // Extract identifiers of entities.
        // The full model has 2652 metabolites.
        var currentMetabolitesAttributes = Attribution
            .filterEntityType("metabolite", currentEntitiesAttributes);
        var currentMetabolites = Attribution
            .extractEntityIdentifiers(currentMetabolitesAttributes);
        // The full model has 7785 reactions.
        var currentReactionsAttributes = Attribution
            .filterEntityType("reaction", currentEntitiesAttributes);
        // Determine cardinalities of sets of metabolic entities.
        var setsCardinalities = Cardinality.determineSetsCardinalities({
            filter: filter,
            currentEntitiesAttributes: currentEntitiesAttributes,
            allEntitiesAttributes: allEntitiesAttributes
        });
        // Prepare summary of sets of metabolic entities.
        var setsSummary = Cardinality
            .prepareSetsSummary(entity, setsCardinalities);
        // Return new values of attributes.
        return {
            currentMetabolites: currentMetabolites,
            currentReactionsAttributes: currentReactionsAttributes,
            setsCardinalities: setsCardinalities,
            setsSummary: setsSummary
        };
    }


    /**
     * Tests some operation temporarily before permanent implementation.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static testOperation(model) {
        // Append a string to the names of some reactions.
        // 1. filter reactions first and then append to filtered set.
        // 2. use conditional during single iteration.
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
