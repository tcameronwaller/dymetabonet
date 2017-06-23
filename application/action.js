/**
 * Actions that modify the state of the application.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods that control all actions that modify the model for
 * the state of the application. The methods require a reference to the instance
 * of the model. These methods also call external methods as necessary.
 */
class Action {
    /**
     * Initializes the model of the application's state by assigning null values
     * to all attributes.
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
        model.restore(newAttributes);
    }
    /**
     * Clears the value of an attribute in the model of the application's state.
     * @param {string} name Name of the attribute.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static clearAttribute(name, model) {
        var newAttributes = [{
            attribute: name,
            value: null
        }];
        model.restore(newAttributes);
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
        model.restore(newAttributes);
    }
    /**
     * Saves to client's system a representation of the application's state.
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
     * @param {Object} file File object to load.
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
        model.restore(newAttributes);
    }

    // TODO: Now create View with buttons for saving and loading state. Just try it to make sure everything works properly.




    /**
     * Loads default assembly file.
     * @param {string} path Directory path and file name.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    static loadDefaultAssemblyFile(path, model) {
        // Load data for assembly from file.
        var assembly = General.loadFileByPath(path);
        // Extract attributes from assembly.
        var newAttributes = General.extractAssemblyEntitiesSets(assembly);
        // Pass attributes from assembly to model.
        model.restore(newAttributes);
    }

}
