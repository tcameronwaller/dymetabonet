/**
 * Functionality of general utility.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for external utility.
 */
class General {
    /**
     * Accesses a file at a specific path on client's system.
     * @param {string} path Directory path and file name.
     * @returns {Object} File at path on client's system.
     */
    static accessFileByPath(path) {
        return File.createFromFileName(path);
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
     * Saves to file on client's system a version of an object in JavaScript
     * Object Notation (JSON).
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
        document.body.appendChild(reference);
        reference.click();
        document.body.removeChild(reference);
    }
    /**
     * Removes from the Document Object Model (DOM) elements that do not have
     * specific values of a specific attribute.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.values Values of the attribute.
     * @param {string} parameters.attribute Attribute of interest.
     * @param {Object} parameters.elements Elements in the Document Object
     * Model (DOM).
     */
    static filterRemoveDocumentElements({values, attribute, elements} = {}) {
        Array.from(elements).forEach(function (element) {
            if (
                (!element.hasAttribute(attribute)) ||
                (!values.includes(element.getAttribute(attribute)))
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
            return General.replaceAllString(newString, target, replacement);
        } else {
            return currentString;
        }
    }
    /**
     * Collects values for identical keys from multiple objects.
     * @param {Array<Object>} objects Array of objects.
     * @param {string} key Common key for all objects.
     * @returns {Array} Values from all objects.
     */
    static collectValuesFromObjects(objects, key) {
        return objects.map(function (object) {
            return object[key];
        });
    }
    /**
     * Compares two arrays by inclusion of elements.
     * @param {Array} firstArray Array of elements.
     * @param {Array} secondArray Array of elements.
     * @returns {boolean} Whether or not the first array includes all values of
     * the second array.
     */
    static compareArraysByInclusion(firstArray, secondArray) {
        return secondArray.every(function (element) {
            return firstArray.includes(element);
        });
    }
    /**
     * Compares two arrays by values of elements at specific indices.
     * @param {Array} firstArray Array of elements.
     * @param {Array} secondArray Array of elements.
     * @returns {boolean} Whether or not the arrays have identical values at
     * every index.
     */
    static compareArraysByValuesIndices(firstArray, secondArray) {
        return firstArray.every(function (element, index) {
            return element === secondArray[index];
        });
    }
    /**
     * Checks objects elements for replicates by identifier.
     * @param {Array<Object<string>>} elements Objects elements with identifiers.
     * @returns {Array<Object<string>>} Object elements that have replicates.
     */
    static checkReplicateElements(elements) {
        // A more efficient algorithm would increment counts for each element
        // and then only return elements with counts greater than one.
        return elements.reduce(function (collection, element) {
            var matches = elements.filter(function (referenceElement) {
                return referenceElement.identifier === element.identifier;
            });
            if (
                (matches.length > 1) &&
                (!collection.includes(element.identifier))
            ) {
                return collection.concat(element.identifier);
            } else {
                return collection
            }
        }, []);
    }

    /**
     * Determines the value of the only active radio button in a group.
     * @param {Object} radios Live collection of radio button elements in the
     * Document Object Model (DOM).
     * @returns {string} Value of the only active radio button from the group.
     */
    static determineRadioGroupValue(radios) {
        // Assume that only a single radio button in the group is active.
        return Array.from(radios).filter(function (radio) {
            return radio.checked;
        })[0].value;
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
