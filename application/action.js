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
     * Clears the value of an attribute in the model of the application's state
     * by submitting a null value.
     * @param {string} name Name of the attribute.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static clearAttribute(name, model) {
        var newAttributes = [{
            attribute: name,
            value: null
        }];
        model.restore(newAttributes, model);
    }
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
        // Clear the persistent representation to avoid repetition.
        Action.clearAttribute("persistence", model);
    }
    /**
     * Loads from client's system a representation of the application's state.
     * @param {Object} file File object with information about application
     * state.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static loadState(file, model) {
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
     * Checks and cleans information about metabolic entities and sets from a
     * file from client's system.
     * Saves this information to a new file on client's system.
     * @param {Object} file File object with information about metabolic
     * entities and sets.
     */
    static checkCleanMetabolicEntitiesSets(file) {

        var data = General.loadObject(file);

        General.saveObject("new_data.json", data);

    }



    /**
     * Extracts from a file from client's system information about metabolic
     * entities and sets.
     * Submits this information to the model of the application's state.
     * @param {Object} file File object with information about metabolic
     * entities and sets.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static extractMetabolicEntitiesSets(file, model) {
        // TODO: Update the extraction functionality... probably organizing it within a new utility class.
        // TODO: Ideally return an object of all of the relevant info for entities and sets...


        var data = General.loadObject(file);



        var newAttributes = Object.keys(data).map(function (key) {
            return {
                attribute: key,
                value: data[key]
            };
        });
        model.restore(newAttributes, model);
    }




    // TODO: Now create View with buttons for saving and loading state. Just try it to make sure everything works properly.

}
