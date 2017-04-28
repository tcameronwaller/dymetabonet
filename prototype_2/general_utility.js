
////////////////////////////////////////////////////////////////////////////////
// General Utility

/**
 * Collects unique elements.
 * @param {Array} elements Array of elements.
 * @returns {Array} Unique elements.
 */
function collectUniqueElements(elements) {
    // Collect and return unique elements.
    return elements
        .reduce(function (accumulator, element) {
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
function replaceAllString(currentString, target, replacement) {
    if (currentString.includes(target)) {
        var newString = currentString.replace(target, replacement);
        return replaceAllString(newString, target, replacement);
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
function collectValuesFromObjects(objects, key) {
    return objects.map(function (object) {
        return object[key];
    });
}

/**
 * Compares two arrays by values of elements at specific indices.
 * @param {Array} firstArray Array of elements.
 * @param {Array} secondArray Array of elements.
 * @returns {boolean} Whether or not the arrays have identical values at every
 * index.
 */
function compareArraysByValuesIndices(firstArray, secondArray) {
    return firstArray.every(function (element, index) {
        return element === secondArray[index];
    });
}

/**
 * Compares two arrays by inclusion of elements.
 * @param {Array} firstArray Array of elements.
 * @param {Array} secondArray Array of elements.
 * @returns {boolean} Whether or not the first array includes all values of the
 * second array.
 */
function compareArraysByInclusion(firstArray, secondArray) {
    return secondArray.every(function (element) {
        return firstArray.includes(element);
    });
}

/**
 * Saves to client's machine a JSON version of an object.
 * @param {Object} object Object in JavaScript memory.
 * @param {string} name Name of file.
 */
function downloadJSON(object, name) {
    var objectJSON = JSON.stringify(object);
    var blob = new Blob([objectJSON], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var documentReference = document.createElement("a");
    documentReference.setAttribute("href", url);
    documentReference.setAttribute("download", name);
    documentReference.click();
}

