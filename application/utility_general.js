/**
 * Functionality of general utility.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for external utility.
 */
class General {
    /**
     * Saves to file and downloads to client's system a version of an object in
     * JavaScript Object Notation (JSON).
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
     * Loads from file a version of an object in JavaScript Object Notation
     * (JSON).
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
     * Loads from a file at a specific path on client's system a version of an
     * object in JavaScript Object Notation (JSON).
     * @param {string} path Directory path and file name.
     * @returns {Object} Object from file.
     */
    static loadObjectByPath(path) {
        // TODO: I think there's a way to do this using the File Object... see MDN info about files from client system...
        // Load data from file in JSON format.
        d3.json(path, function (error, data) {
            if (error) {
                throw error;
            }
            return data;
        });
    }
    /**
     * Removes from the Document Object Model (DOM) elements that do not have a
     * specific value of a specific attribute.
     * @param {string} value Value of attribute.
     * @param {string} attribute Attribute of interest.
     * @param {Object} elements Elements in the Document Object Model.
     */
    static filterDocumentElements(value, attribute, elements) {
        Array.from(elements).forEach(function (element) {
            if (
                (!element.hasAttribute(attribute)) ||
                (element.getAttribute(attribute) !== value)
            ) {
                element.parentElement.removeChild(element);
            }
        });
    }
    /**
     * Removes from the Document Object Model (DOM) all elements that are
     * children of a specific element.
     * @param {Object} element Element in the Document Object Model.
     */
    static removeDocumentChildren(element) {
        Array.from(element.children).forEach(function (child) {
            element.removeChild(child);
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



    /**
     * Collects unique elements.
     * @param {Array} elements Array of elements.
     * @returns {Array} Unique elements.
     */
    static collectUniqueElements(elements) {
        // Collect and return unique elements.
        return elements.reduce(function (accumulator, element) {
            if (!accumulator.includes(element)) {
                // Method concat does not modify the original array.
                // Method concat returns a new array.
                // It is necessary to store this new array or return it
                // directly.
                return accumulator.concat(element);
            } else {
                return accumulator;
            }
        }, []);
    }
    /**
     * Replaces all instances of a substring in a string.
     * @param {string} currentString The string that contains the substring for
     * replacement.
     * @param {string} target The substring for replacement.
     * @param {string} replacement The substring to substitute in place of the
     * substring for replacement.
     * @returns {string} New string after replacement of all instances.
     */
    static replaceAllString(currentString, target, replacement) {
        if (currentString.includes(target)) {
            var newString = currentString.replace(target, replacement);
            return replaceAllString(newString, target, replacement);
        } else {
            return currentString;
        }
    }




}
