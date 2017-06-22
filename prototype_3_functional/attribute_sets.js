////////////////////////////////////////////////////////////////////////////////
// Assemble index of attribute sets of metabolites

////////////////////////////////////////////////////////////////////////////////
// Prepare summary of attribute sets of metabolites



////////////////////////////////////////////////////////////////////////////////
// Assemble index of attribute sets of reactions

/**
 * Determines unique compartments in which a single metabolite participates in
 * multiple reactions.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.metaboliteIdentifier Identifier for a metabolite
 * of interest.
 * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
 * reactions of interest.
 * @param {Object} parameters.reactions Information for all reactions in a
 * metabolic model.
 * @returns {Array<string>} Identifiers of compartments.
 */
function determineMetaboliteReactionCompartments({
                                                    metaboliteIdentifier,
                                                    reactionIdentifiers,
                                                    reactions
} = {}) {
    // Metabolite qualifies for compartment if it participates in any reaction
    // in the compartment.
    var compartments = reactionIdentifiers
        .reduce(function (collection, reactionIdentifier) {
            var reaction = reactions[reactionIdentifier];
            var metabolites = reaction.metabolites.filter(function (record) {
                return record.identifier === metaboliteIdentifier;
            });
            var metaboliteReactionCompartments = collectValuesFromObjects(
                metabolites, "compartment"
            );
            return [].concat(collection, metaboliteReactionCompartments);
        }, []);
    return collectUniqueElements(compartments);
}

/**
 * Determines unique processes of multiple reactions.
 * @param {Object} parameters Destructured object of parameters.
 * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
 * reactions of interest.
 * @param {Object} parameters.reactions Information for all reactions in a
 * metabolic model.
 * @returns {Array<string>} Identifiers of processes.
 */
function determineReactionProcesses({
                                                     reactionIdentifiers,
                                                     reactions
                                                 } = {}) {
    var processes = reactionIdentifiers.map(function (reactionIdentifier) {
        var reaction = reactions[reactionIdentifier];
        return reaction.process;
    });
    return collectUniqueElements(processes);
}

/**
 * Determines unique operations, conversion or transport, of multiple reactions.
 * @param {Object} parameters Destructured object of parameters.
 * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
 * reactions of interest.
 * @param {Object} parameters.reactions Information for all reactions in a
 * metabolic model.
 * @returns {Array<string>} Identifiers of operations.
 */
function determineReactionOperations({
                                                     reactionIdentifiers,
                                                     reactions
                                                 } = {}) {
    var operations = reactionIdentifiers
        .reduce(function (collection, reactionIdentifier) {
            var reaction = reactions[reactionIdentifier];
            var reactionOperations = determineReactionOperation(
                reaction.metabolites
            );
            return [].concat(collection, reactionOperations);
        }, []);
    return collectUniqueElements(operations);
}

/**
 * Determines unique reversibilities of multiple reactions.
 * @param {Object} parameters Destructured object of parameters.
 * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
 * reactions of interest.
 * @param {Object} parameters.reactions Information for all reactions in a
 * metabolic model.
 * @returns {Array<string>} Identifiers of reversibility.
 */
function determineReactionReversibilities({
                                                  reactionIdentifiers,
                                                  reactions
                                              } = {}) {
    var reversibilities = reactionIdentifiers
        .map(function (reactionIdentifier) {
            var reaction = reactions[reactionIdentifier];
            return reaction.reversibility;
        });
    return collectUniqueElements(reversibilities);
}

/**
 * Creates an index of attributes of a single metabolite from a metabolic model.
 * @param {Object} metabolite Record for a metabolite.
 * @param {Object} reactions Information for all reactions in a metabolic
 * model.
 * @returns {Object} Index for a metabolite.
 */
function createMetaboliteIndex(metabolite, reactions) {
    return {
        identifier: metabolite.identifier,
        entity: "metabolite",
        process: determineReactionProcesses({
            reactionIdentifiers: metabolite.reactions,
            reactions: reactions
        }),
        compartment: determineMetaboliteReactionCompartments({
            metaboliteIdentifier: metabolite.identifier,
            reactionIdentifiers: metabolite.reactions,
            reactions: reactions
        }),
        operation: determineReactionOperations({
            reactionIdentifiers: metabolite.reactions,
            reactions: reactions
        }),
        reversibility: determineReactionReversibilities({
            reactionIdentifiers: metabolite.reactions,
            reactions: reactions
        })
    };
}

/**
 * Creates indices of attributes of all metabolites in a metabolic model.
 * @param {Object} metabolites Information for all metabolites in a metabolic
 * model.
 * @param {Object} reactions Information for all reactions in a metabolic
 * model.
 * @returns {Array<Object<string>>} Indices for metabolites.
 */
function createMetaboliteIndices(metabolites, reactions) {
    // Create indices for reactions.
    return Object.keys(metabolites).map(function (key) {
        return createMetaboliteIndex(metabolites[key], reactions);
    });
}

/**
 * Extracts compartments in which metabolites participate in a reaction.
 * @param {Array<Object<string>>} reactionMetabolites Information about
 * metabolites that participate in a reaction.
 * @returns {Array<string>} Identifiers of compartments.
 */
function extractReactionMetaboliteCompartments(reactionMetabolites) {
    var compartments = reactionMetabolites.map(function (metabolite) {
        return metabolite.compartment;
    });
    return collectUniqueElements(compartments);
}

/**
 * Determines the operations, conversion or transport, that describe the effect
 * of a reaction on its metabolites.
 * @param {Array<Object<string>>} reactionMetabolites Information about
 * metabolites that participate in a reaction.
 * @returns {Array<string>} Identifiers of compartments.
 */
function determineReactionOperation(reactionMetabolites) {
    // Determine if the reaction involves different metabolites in reactants and
    // products.
    // If the reaction involves different metabolites in reactants and products,
    // then consider the reaction to involve a chemical conversion operation.
    var reactantIdentifiers = reactionMetabolites
        .filter(function (metabolite) {
            return metabolite.role === "reactant";
        }).map(function (reactant) {
            return reactant.identifier;
        });
    var productIdentifiers = reactionMetabolites
        .filter(function (metabolite) {
            return metabolite.role === "product";
        }).map(function (reactant) {
            return reactant.identifier;
        });
    if (
        !compareArraysByInclusion(reactantIdentifiers, productIdentifiers) &&
        !compareArraysByInclusion(productIdentifiers, reactantIdentifiers)
    ) {
        var conversion = [].concat("c");
    } else {
        var conversion = [];
    }
    // Determine if the reaction involves metabolites in multiple compartments.
    // If the reaction involves metabolites in multiple compartments, then
    // consider the reaction to involve a transport operation.
    var compartments = extractReactionMetaboliteCompartments(
        reactionMetabolites
    );
    if (compartments.length > 1) {
        var conversionTransport = conversion.concat("t");
    } else {
        var conversionTransport = conversion;
    }
    return conversionTransport;
}

/**
 * Creates an index of attributes of a single reaction from a metabolic model.
 * @param {Object} reaction Record for a reaction.
 * @returns {Object} Index for a reaction.
 */
function createReactionIndex(reaction) {
    determineReactionOperation(reaction.metabolites);
    return {
        identifier: reaction.identifier,
        entity: "reaction",
        process: [reaction.process],
        compartment: extractReactionMetaboliteCompartments(
            reaction.metabolites
        ),
        operation: determineReactionOperation(reaction.metabolites),
        reversibility: [reaction.reversibility]
    };
}

/**
 * Creates indices of attributes of all reactions in a metabolic model.
 * @param {Object} reactions Information for all reactions in a metabolic
 * model.
 * @returns {Array<Object<string>>} Indices for reactions.
 */
function createReactionIndices(reactions) {
    // Create indices for reactions.
    return Object.keys(reactions).map(function (key) {
        return createReactionIndex(reactions[key]);
    });
}

/**
 * Creates index of attributes of all metabolites and reactions in a metabolic
 * model.
 * @param {Object} metabolites Information for all metabolites in a metabolic
 * model.
 * @param {Object} reactions Information for all reactions in a metabolic
 * model.
 * @returns {Array<Object<string>>} Index of attributes of metabolites and
 * reactions.
 */
function createAttributeIndex(metabolites, reactions) {
    // Attribute index is analogous to a table.
    // It is an array of objects.
    // Individual objects, analogous to rows in the table, represent individual
    // entities, either metabolites or reactions.
    // All objects in the array have the same keys.
    // These keys are analogous to column headers in the table.
    // Some of these keys designate attributes of the entities.
    // Entities can have multiple values for these attributes, so the attributes
    // come in arrays of unique values.
    // As these values in arrays are unique, each instance of a value
    // corresponds to a single entity with that value.
    var metaboliteIndices = createMetaboliteIndices(metabolites, reactions);
    var reactionIndices = createReactionIndices(reactions);
    return [].concat(metaboliteIndices, reactionIndices);
}

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
