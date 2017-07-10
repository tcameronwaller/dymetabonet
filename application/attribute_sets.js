
////////////////////////////////////////////////////////////////////////////////
// Prepare summary of attribute sets of reactions

/**
 * Collects attribute values of entities.
 * @param {string} attribute Attribute of which to collect values.
 * @param {Array<Object<string>>} attributeIndex Index of attributes of
 * metabolites and reactions.
 * @returns {Object<Array<string>>} Collection of values of the attribute for
 * each entity.
 */
function collectEntityAttributeValues(attribute, attributeIndex) {
    // Iterate on records in the attribute index, the rows in the table.
    // Collect all values of the attribute.
    // Partition values by entity.
    return attributeIndex.reduce(function (collection, record) {
        // Determine the entities of the current record.
        var currentEntity = record.entity;
        if (currentEntity === "metabolite") {
            var otherEntity = "reaction";
        } else {
            var otherEntity = "metabolite";
        }
        if (
            collection.hasOwnProperty(currentEntity) &&
            collection.hasOwnProperty(otherEntity)
        ) {
            // The collection includes records for the entities.
            // Replace the current record with a new record.
            // Update the record for the current entity.
            // Preserve the record for the other entity.
            return {
                [currentEntity]: collection[currentEntity]
                    .concat(record[attribute]),
                [otherEntity]: collection[otherEntity]
            };
        } else {
            // The collection does not include records for the entities.
            // Create a new record for the entities.
            // Update the record for the current entity.
            // Initiate the record for the other entity.
            return {
                [currentEntity]: record[attribute],
                [otherEntity]: []
            };
        }
    }, {});
}

/**
 * Translates attribute values of entities to designate entity with value.
 * @param {Array<string>} values Values of a single attribute.
 * @param {string} entity The entity, metabolite or reaction, of the current
 * record.
 * @returns {Array<Object<string>>} Collection of values of the attribute for
 * the entity.
 */
function translateEntityAttributeValues(values, entity) {
    return values.map(function (value) {
        return {
            entity: entity,
            value: value
        }
    });
}

/**
 * Counts the instances of each of several values of an attribute for entities.
 * @param {Array<Object<string>>} entityValues Entities' values of an attribute.
 * @returns {Array<Object>} Counts of each value for each entity.
 */
function countEntityAttributeValues(entityValues) {
    return entityValues.reduce(function (valueCollection, entityValue) {
        // Determine the entities of the current record.
        var currentEntity = entityValue.entity;
        if (currentEntity === "metabolite") {
            var otherEntity = "reaction";
        } else {
            var otherEntity = "metabolite";
        }
        if (valueCollection.hasOwnProperty(entityValue.value)) {
            // The collection includes a record for the value.
            // Replace the current record with a new record.
            // Increment the count for the current entity.
            // Preserve the current count for the other entity.
            var newRecord = {
                [entityValue.value]: {
                    value: entityValue.value,
                    [currentEntity]: valueCollection
                        [entityValue.value]
                        [currentEntity] + 1,
                    [otherEntity]: valueCollection
                        [entityValue.value]
                        [otherEntity]
                }
            };
            // New record will replace previous record in collection.
            return Object.assign({}, valueCollection, newRecord);
        } else {
            // The collection does not include a record for the value.
            // Create a new record for the value.
            // Initiate the count for the current entity to one.
            // Initiate the count for the other entity to zero.
            var newRecord = {
                [entityValue.value]: {
                    value: entityValue.value,
                    [currentEntity]: 1,
                    [otherEntity]: 0
                }
            };
            // New record will replace previous record in collection.
            return Object.assign({}, valueCollection, newRecord);
        }
    }, {});
}

/**
 * Determines the name of a value of an attribute.
 * @param {string} indicator Indicator of the value of the attribute.
 * @param {string} attribute Attribute of which to collect value name.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {string} Name of value of the attribute.
 */
function determineAttributeValueName(indicator, attribute, model) {
    // Determine attribute name to match records in model.
    if (attribute === "compartment") {
        var attributeName = "compartments";
    } else if (attribute === "process") {
        var attributeName = "processes";
    } else {
        var attributeName = attribute;
    }
    // Determine if the attribute defines a set in the model.
    // Determine if the indicator is an identifier of an attribute set in the
    // model.
    if (model.sets.hasOwnProperty(attributeName)) {
        // The attribute defines a set in the model.
        // The indicator is an identifier of an attribute set in the model.
        return model.sets[attributeName][indicator].name.toLowerCase();
    } else {
        if (attributeName === "operation") {
            if (indicator === "c") {
                var name = "conversion";
            } else if (indicator === "t") {
                var name = "transport";
            }
        } else if (attributeName === "reversibility") {
            if (indicator === true) {
                var name = "reversible";
            } else if (indicator === false) {
                var name = "irreversible";
            }
        }
        return name;
    }
}

/**
 * Creates a summary of the information in the attribute index.
 * @param {Array<Object<string>>} attributeIndex Index of attributes of
 * metabolites and reactions.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Array<Object<string>>} Summary of attribute index.
 */
function createAttributeSummary(attributeIndex, model) {
    // Assume that all records in the attribute index have the same properties,
    // like rows of a table with the same columns.
    // Determine attributes in attribute index.
    var attributes = Object.keys(attributeIndex[0]).filter(function (key) {
        return (key !== "identifier" && key !== "entity");
    });
    // Iterate on attributes in the attribute index, the columns in the table.
    return attributes.map(function (attribute) {
        var entityAttributeValues = collectEntityAttributeValues(
            attribute, attributeIndex
        );
        var metaboliteValues = translateEntityAttributeValues(
            entityAttributeValues.metabolite, "metabolite"
        );
        var reactionValues = translateEntityAttributeValues(
            entityAttributeValues.reaction, "reaction"
        );
        var entityValues = [].concat(metaboliteValues, reactionValues);
        var entityValueCounts = countEntityAttributeValues(entityValues);
        // Determine names of values of the attributes for clarity in the attribute
        // summary.
        // Include the attribute in the value record for use in association of
        // data with elements in the document.
        // Initialize the selection status to false for all attribute values.
        var summaryValues = Object.keys(entityValueCounts).map(function (key) {
            return {
                attribute: attribute,
                identifier: entityValueCounts[key].value,
                metabolite: entityValueCounts[key].metabolite,
                name: determineAttributeValueName(
                    entityValueCounts[key].value, attribute, model
                ),
                reaction: entityValueCounts[key].reaction,
                selection: false
            };
        });
        // Initialize the selection status to false for all attributes.
        return {
            attribute: attribute,
            selection: false,
            values: summaryValues
        };
    });
}
