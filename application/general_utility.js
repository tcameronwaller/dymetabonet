
////////////////////////////////////////////////////////////////////////////////
// General Utility

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
