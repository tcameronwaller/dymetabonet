/**
 * Actions that modify the state of the application.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods that control all actions that modify the model for
 * the state of the application. The methods require a reference to the instance
 * of the model. These methods also call external methods as necessary.
 */
class Action {
    // To call the restore method of the model, it is necessary to pass the
    // method a reference to the current instance of the model.
    /**
     * Initializes the model of the application's state by submitting null
     * values for all attributes.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static initializeApplication(model) {
        var newAttributes = model.attributeNames.map(function (attributeName) {
            return {
                attribute: attributeName,
                value: null
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
        var newAttributes = [{
            attribute: name,
            value: null
        }];
        model.restore(newAttributes, model);
    }
    /**
     * Submits a new value for the file to the model of the application's state.
     * @param {Object} file File object.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static submitFile(file, model) {
        var newAttributes = [{
            attribute: "file",
            value: file
        }];
        model.restore(newAttributes, model);
    }
    /**
     * Loads from file a version of an object in JavaScript Object Notation
     * (JSON) and passes this object to another function along with appropriate
     * parameters.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Object} parameters.file File with object to load.
     * @param {Object} parameters.call Function to call upon completion of file
     * read.
     * @param {Object} parameters.parameters Parameters for the function to call
     * upon completion of file read.
     */
    static loadPassObject({file, call, parameters} = {}) {
        // Create a file reader object.
        var reader = new FileReader();
        // Specify operation to perform after file loads.
        reader.onload = function (event) {
            // Element on which the event originated is event.currentTarget.
            // After load, the file reader's result attribute contains the
            // file's contents, according to the read method.
            var data = JSON.parse(event.currentTarget.result);
            // Include the data in the parameters to pass to the call function.
            var dataParameter = {data: data};
            var newParameters = Object.assign({}, parameters, dataParameter);
            // Call function with new parameters.
            call(newParameters);
        };
        // Read file as text.
        reader.readAsText(file);
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
        var data = Extraction.extractRecon2(data);
        var newAttributes = Object.keys(data).map(function (key) {
            return {
                attribute: key,
                value: data[key]
            };
        });
        model.restore(newAttributes, model);
    }
    /**
     * Collects attributes of metabolic entities, metabolites and reactions.
     * Submits this information to the model of the application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static collectEntitiesAttributes(model) {
        var entitiesAttributes = Attribution
            .determineEntitiesAttributes(model.metabolites, model.reactions);
        var newAttributes = [{
            attribute: "entitiesAttributes",
            value: entitiesAttributes
        }];
        model.restore(newAttributes, model);
    }
    /**
     * Determines cardinalities or populations of sets of metabolic entities
     * with specific values of attributes.
     * Submits this information to the model of the application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static determineSetCardinalities(model) {
        var setCardinalities = Cardinality
            .determineSetCardinalities(model.entitiesAttributes);
        console.log("set cardinalities");
        console.log(setCardinalities);
        var newAttributes = [{
            attribute: "setCardinalities",
            value: setCardinalities
        }];
        model.restore(newAttributes, model);
    }


    // TODO: Now create the set cardinalities...
    // TODO: Create separate data structure to store user selections for filters.
    // TODO: Create separate data structure to store current version of set cardinalities?
    // TODO: Create separate data structure to store current entitiesAttributes?

    // TODO: Or I could filter the entitiesAttributes and the set
    // TODO: cardinalities in real time as I update the interfaces? ... dunno
    // TODO: depends on efficiency/speed
    // TODO: Then initialize the attribute and entity interfaces...


    /**
     * Creates persistent representation of the model of the application's
     * state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static persistApplication(model) {
        var record = model
            .attributeNames
            .reduce(function (collection, attributeName) {
                var newRecord = {
                    [attributeName]: model[attributeName]
                };
                return Object.assign(collection, newRecord);
            }, {});
        var newAttributes = [{
            attribute: "persistence",
            value: record
        }];
        model.restore(newAttributes, model);
    }
    /**
     * Saves to a new file on client's system a representation of the
     * application's state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static saveState(model) {
        General.saveObject("state.json", model.persistence);
    }
    /**
     * Restores the application to a state with a persistent representation in a
     * file from client's system.
     * @param {Object} file File object with information about application
     * state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static restoreState(file, model) {
        var data = General.loadObject(file);
        var newAttributes = Object.keys(data).map(function (key) {
            return {
                attribute: key,
                value: data[key]
            };
        });
        model.restore(newAttributes, model);
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
