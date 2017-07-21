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
    // Actions relevant to application state.
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
        var newData = Object.assign({}, data, newFile);
        Action.submitAttributes({
            attributesValues: newData,
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
        // Initialize attributes of the application's state for information
        // about metabolic entities and sets.
        // Remove the current file selection from the application's state.
        var file = null;
        // Determine all attributes of all metabolic entities.
        var allEntitiesAttributes = Attribution
            .collectEntitiesAttributes(
                entitiesSets.metabolites, entitiesSets.reactions
            );
        // Determine attributes of metabolic entities that pass current filters.
        // For initialization, it is sufficient to copy the attributes of
        // metabolic entities.
        var currentEntitiesAttributes = Attribution
            .copyEntitiesAttributes(allEntitiesAttributes);
        //
        // Initialize application's attributes for entities' sets.
        // Specify selections of attributes for set view.
        // These selections determine which search menus to create in set view.
        var setViewAttributesSelections = [];
        // Specify selections of values of attributes for set view.
        // These selections determine which attributes and values define filters
        // against entities' attributes.
        var setViewValuesSelections = [];
        // Specify entity option for set view.
        var entity = "metabolite";
        // Specify filter option for set view.
        var filter = false;
        // Determine cardinalities of sets of metabolic entities.
        var setsCardinalities = Cardinality
            .determineSetsCardinalities({
                filter: filter,
                currentEntitiesAttributes: currentEntitiesAttributes,
                allEntitiesAttributes: allEntitiesAttributes
            });
        // Prepare summary of sets of metabolic entities.
        var setsSummary = Cardinality
            .prepareSetsSummary(entity, setsCardinalities);
        //
        // Initialize application's attributes for individual entities.
        // TODO: I want to initialize all relevant attributes and settings for the entity view.
        // Extract identifiers of entities.
        // The full model has 2652 metabolites.
        var metaboliteIdentifiers = Network.extractEntityIdentifiers(
            "metabolite", currentEntitiesAttributes
        );
        // The full model has 7785 reactions.
        var reactionIdentifiers = Network.extractEntityIdentifiers(
            "reaction", currentEntitiesAttributes
        );
        // TODO: I need to re-work the network assembly procedure to access information from metabolic entities/sets in application's model...
        //

        //
        // Compile values of attributes for application's state.
        var data = {
            file: file,
            allEntitiesAttributes: allEntitiesAttributes,
            setViewAttributesSelections: setViewAttributesSelections,
            setViewValuesSelections: setViewValuesSelections,
            currentEntitiesAttributes: currentEntitiesAttributes,
            setViewEntity: entity,
            setViewFilter: filter,
            setsCardinalities: setsCardinalities,
            setsSummary: setsSummary
        };
        var attributesValues = Object.assign({}, entitiesSets, data);
        Action.submitAttributes({
            attributesValues: attributesValues,
            model: model
        });
    }
    /**
     * Changes the set view's specification of entity.
     * Also prepares new sets' summary.
     * Submits new values to the model of the application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static changeSetViewEntity(model) {
        // Determine new entity.
        var oldEntity = model.setViewEntity;
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
            setViewEntity: newEntity,
            setsSummary: setsSummary
        };
        Action.submitAttributes({
            attributesValues: attributesValues,
            model: model
        });
    }
    /**
     * Changes the set view's specification of filter.
     * Also determines new sets' cardinalities and prepares new sets' summary.
     * Submits new values to the model of the application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static changeSetViewFilter(model) {
        // Determine new filter.
        var oldFilter = model.setViewFilter;
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
            .prepareSetsSummary(model.setViewEntity, setsCardinalities);
        // Submit new values of attributes to the model of the application's
        // state.
        var attributesValues = {
            setViewFilter: newFilter,
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
        var setViewAttributesSelections = [];
        // Record current selection in collection of selections of attributes
        // and values for set view.
        // These selections determine which attributes and values define filters
        // against entities' attributes.
        var setViewValuesSelections = Attribution.recordFilterSelection({
            value: value,
            attribute: attribute,
            selections: model.setViewValuesSelections
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
                selections: setViewValuesSelections,
                entitiesAttributes: copyEntitiesAttributes
            });
        // Determine new sets' cardinalities.
        var setsCardinalities = Cardinality
            .determineSetsCardinalities({
                filter: model.setViewFilter,
                currentEntitiesAttributes: currentEntitiesAttributes,
                allEntitiesAttributes: model.allEntitiesAttributes
            });
        // Prepare new sets' summary.
        var setsSummary = Cardinality
            .prepareSetsSummary(model.setViewEntity, setsCardinalities);
        // Submit new values of attributes to the model of the application's
        // state.
        var attributesValues = {
            setViewAttributesSelections: setViewAttributesSelections,
            setViewValuesSelections: setViewValuesSelections,
            currentEntitiesAttributes: currentEntitiesAttributes,
            setsCardinalities: setsCardinalities,
            setsSummary: setsSummary
        };
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
        // TODO: Use most of everything from initializeMetabolicEntitiesSets...

        // TODO: Reset button should...
        // TODO: reset default entity and filter
        // TODO: reset currentEntitiesAttributes to copy of allEntitiesAttributes
        // TODO: derive setsCardinalities and setsSummary
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
