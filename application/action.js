/**
 * Actions that modify the state of the application.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods that control all actions that modify the model for
 * the state of the application. The methods require a reference to the instance
 * of the model. These methods also call external methods as necessary.
 */
class Action {
    // TODO: I'm not sure how to handle simultaneous/consecutive events efficiently...
    // TODO: If I handle all consecutive events in state, then that might not be specific enough to be efficient.
    // TODO: It seems reasonable to handle those here in action...
    // TODO: For example, if user changes entity selection then it's also necessary to re-pepare set cardinalities and set summary... preferrably without going through app loop every time...



    // There are only so many possible actions in the application...
    // Try to limit actions herein to those possible actions.
    // I'm not sure that I like the idea of next-action-predicate in the app state handler...
    // Handle all that stuff simultaneously here in the Actions.
    // That way I have more access to information about what values are changing and hence which changes/updates are necessary.

    // TODO: Change the way I handle actions and multiple, coordinate changes...

    // Methods herein intend to comprise discrete actions that impart changes to
    // the application's state.
    // Some actions necessitate changes to multiple aspects of the application
    // that coordinate together.
    // For efficiency, these actions impart these multiple changes
    // simultaneously.
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
            parameters: {}
        });
    }
    /**
     * Loads from file information about metabolic entities and sets and passes
     * it to a procedure for extraction.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static loadExtractMetabolicEntitiesSets(model) {
        General.loadPassObject({
            file: model.file,
            call: Action.extractMetabolicEntitiesSets,
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
        Action.submitAttributes({
            attributesValues: data,
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
     * @param {Object} parameters Destructured object of parameters.
     * @param {Object} parameters.data Information about metabolic entities and
     * sets.
     */
    static checkCleanMetabolicEntitiesSets({data} = {}) {
        var cleanData = Clean.checkCleanRecon2(data);
        General.saveObject("clean_data.json", cleanData);
    }
    /**
     * Extracts information about metabolic entities and sets from a clean model
     * of metabolism.
     * Submits this information to the model of the application's state.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Object} parameters.data Information about metabolic entities and
     * sets.
     * @param {Object} parameters.model Model of the comprehensive state of the
     * application.
     */
    static extractMetabolicEntitiesSets({data, model} = {}) {
        var data = Extraction.extractMetabolicEntitiesSetsRecon2(data);
        Action.submitAttributes({
            attributesValues: data,
            model: model
        });
    }


    /**
     * Collects attributes of metabolic entities, metabolites and reactions.
     * Submits this information to the model of the application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static collectEntitiesAttributes(model) {
        var entitiesAttributes = Attribution
            .collectEntitiesAttributes(model.metabolites, model.reactions);
        Action.submitAttribute({
            value: entitiesAttributes,
            attribute: "entitiesAttributes",
            model: model
        });
    }
    /**
     * Copies attributes of metabolic entities, metabolites and reactions.
     * Submits this information to the model of the application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static copyEntitiesAttributes(model) {
        var copyEntitiesAttributes = Attribution
            .copyEntitiesAttributes(model.entitiesAttributes);
        Action.submitAttribute({
            value: copyEntitiesAttributes,
            attribute: "currentEntitiesAttributes",
            model: model
        });
    }
    /**
     * Determines cardinalities or populations of sets of metabolic entities
     * with specific values of attributes.
     * Submits this information to the model of the application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static determineSetsCardinalities(model) {
        var setsCardinalities = Cardinality
            .determineSetsCardinalities(model.currentEntitiesAttributes);
        Action.submitAttribute({
            value: setsCardinalities,
            attribute: "setsCardinalities",
            model: model
        });
    }
    /**
     * Submits a new value for the set view's specification of entity to the
     * model of the application's state.
     * @param {string} value Value of current entity selection.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static submitSetViewEntity(value, model) {
        Action.submitAttribute({
            value: value,
            attribute: "setViewEntity",
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
        // Prepare new summary of sets.
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
                allEntitiesAttributes: model.entitiesAttributes
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
     * Prepares summary of sets according to cardinalities of sets for specific
     * type of entity and filters.
     * Submits this information to the model of the application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static prepareSetsSummary(model) {
        var setsSummary = Cardinality
            .prepareSetsSummary(model.setViewEntity, model.setsCardinalities);
        console.log("set summary");
        console.log(setsSummary);
        Action.submitAttribute({
            value: setsSummary,
            attribute: "setsSummary",
            model: model
        });
    }
    /**
     * Submits a new value for the set view's specification of filter to the
     * model of the application's state.
     * @param {string} value Value of current filter selection.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static submitSetViewFilter(value, model) {
        Action.submitAttribute({
            value: value,
            attribute: "setViewFilter",
            model: model
        });
    }




    // TODO: Create separate data structure to store user selections for filters.

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
