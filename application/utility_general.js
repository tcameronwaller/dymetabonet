/**
 * Functionality of general utility.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for functionality of general utility.
 */
class General {
    /**
     * Saves to client's system a version of an object in JavaScript Object
     * Notation (JSON).
     * @param {string} name Name of file.
     * @param {Object} object Object in memory to save.
     */
    static saveObject(name, object) {
    var objectJSON = JSON.stringify(object);
    var blob = new Blob([objectJSON], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var reference = document.createElement("a");
    reference.setAttribute("href", url);
    reference.setAttribute("download", name);
    reference.click();
    }
    /**
     * Loads from client's system a version of an object in JavaScript Object
     * Notation (JSON).
     * @param {Object} file File object to load.
     * @returns {Object} Object in memory.
     */
    static loadObject(file) {
        // Create a file reader object.
        var reader = new FileReader();
        // Specify operation to perform after file loads.
        reader.onload = function (event) {
            // Element on which the event originated is event.currentTarget.
            // After load, the file reader's result attribute contains the file's
            // contents, according to the read method.
            return JSON.parse(event.currentTarget.result);
        };
        // Read file as text.
        reader.readAsText(file);
    }




    /**
     * Loads file in JavaScript Object Notation (JSON) format from specific
     * path.
     * @param {string} path Directory path and file name.
     * @returns {Object} Object from file.
     */
    static loadFileByPath(path) {
        // Load data from file in JSON format.
        d3.json(path, function (error, data) {
            if (error) {
                throw error;
            }
            return data;
        });
    }
    /**
     * Extracts information about entities and sets from a custom assembly for a
     * model of metabolism and organizes these as new attributes to submit to
     * the application model.
     * @param {Object} assembly Information about entities and sets for a model
     * of metabolism.
     * @returns {Array<Object>} New attributes representing entities and sets
     * for a model of metabolism.
     */
    static extractAssemblyEntitiesSets(assembly) {
        // Extract attributes from assembly.
        var metabolites = {
            attribute: "metabolites",
            value: assembly.entities.metabolites
        };
        var reactions = {
            attribute: "reactions",
            value: assembly.entities.reactions
        };
        var compartments = {
            attribute: "compartments",
            value: assembly.sets.compartments
        };
        var genes = {
            attribute: "genes",
            value: assembly.sets.genes
        };
        var processes = {
            attribute: "processes",
            value: assembly.sets.processes
        };
        return [].concat(
            metabolites, reactions, compartments, genes, processes
        );
    }


}
