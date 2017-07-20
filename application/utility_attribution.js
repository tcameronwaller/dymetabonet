/**
 * Functionality of utility for assigning attributes to metabolic entities.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for external utility.
 */
class Attribution {
    // Master control of attribution procedure.
    /**
     * Collects attributes of metabolic entities, metabolites and reactions.
     * @param {Object} metabolites Information about all metabolites.
     * @param {Object} reactions Information about all reactions.
     * @returns {Array<Object>} Attributes of all entities.
     */
    static collectEntitiesAttributes(metabolites, reactions) {
        // Determine attributes of each metabolic entity.
        // Store attributes of entities within a table, an array of objects.
        // Individual objects, analogous to rows in the table, represent
        // individual entities, either metabolites or reactions.
        // All objects in the array have the same keys.
        // These keys are analogous to column headers in the table.
        // Some of these keys designate attributes of the entities.
        // Entities can have multiple values for some attributes, so the
        // attributes come in arrays of unique values.
        // As these values in arrays are unique, each instance of a value
        // corresponds to a single entity with that value.
        var metabolitesAttributes = Attribution
            .determineMetabolitesAttributes(metabolites, reactions);
        var reactionsAttributes = Attribution
            .determineReactionsAttributes(reactions);
        return [].concat(metabolitesAttributes, reactionsAttributes);
    }
    /**
     * Determines attributes of all metabolites.
     * @param {Object} metabolites Information about all metabolites.
     * @param {Object} reactions Information about all reactions.
     * @returns {Array<Object<string>>} Attributes of metabolites.
     */
    static determineMetabolitesAttributes(metabolites, reactions) {
        return Object.keys(metabolites).map(function (key) {
            return Attribution
                .determineMetaboliteAttributes(metabolites[key], reactions);
        });
    }
    /**
     * Determines attributes of a single metabolite.
     * @param {Object} metabolite Information about a metabolite.
     * @param {Object} reactions Information about all reactions.
     * @returns {Object} Attributes of a metabolite.
     */
    static determineMetaboliteAttributes(metabolite, reactions) {
        return {
            compartments: Attribution.determineMetaboliteReactionsCompartments({
                metaboliteIdentifier: metabolite.identifier,
                reactionIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            entity: "metabolite",
            identifier: metabolite.identifier,
            operations: Attribution.determineReactionsOperations({
                reactionIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            processes: Attribution.determineReactionsProcesses({
                reactionIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            reversibilities: Attribution.determineReactionsReversibilities({
                reactionIdentifiers: metabolite.reactions,
                reactions: reactions
            })
        };
    }
    /**
     * Determines unique processes of multiple reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
     * reactions of interest.
     * @param {Object} parameters.reactions Information about all reactions.
     * @returns {Array<string>} Identifiers of processes.
     */
    static determineReactionsProcesses({reactionIdentifiers, reactions} = {}) {
        var processes = reactionIdentifiers.map(function (reactionIdentifier) {
            var reaction = reactions[reactionIdentifier];
            return reaction.process;
        });
        return General.collectUniqueElements(processes);
    }
    /**
     * Determines unique compartments in which a single metabolite participates
     * in multiple reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.metaboliteIdentifier Identifier for a
     * metabolite of interest.
     * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
     * reactions of interest.
     * @param {Object} parameters.reactions Information for all reactions.
     * @returns {Array<string>} Identifiers of compartments.
     */
    static determineMetaboliteReactionsCompartments({
                                                         metaboliteIdentifier,
                                                         reactionIdentifiers,
                                                         reactions
                                                     } = {}) {
        // Metabolite qualifies for compartment if it participates in any
        // reaction in the compartment.
        var compartments = reactionIdentifiers
            .reduce(function (collection, reactionIdentifier) {
                var reaction = reactions[reactionIdentifier];
                var metabolites = reaction
                    .metabolites.filter(function (metabolite) {
                        return metabolite.identifier === metaboliteIdentifier;
                    });
                var metaboliteReactionCompartments = General
                    .collectValuesFromObjects(metabolites, "compartment");
                return [].concat(collection, metaboliteReactionCompartments);
            }, []);
        return General.collectUniqueElements(compartments);
    }
    /**
     * Determines unique operations, conversion or transport, of multiple
     * reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
     * reactions of interest.
     * @param {Object} parameters.reactions Information for all reactions.
     * @returns {Array<string>} Identifiers of operations.
     */
    static determineReactionsOperations({
                                             reactionIdentifiers,
                                             reactions
                                         } = {}) {
        var operations = reactionIdentifiers
            .reduce(function (collection, reactionIdentifier) {
                var reaction = reactions[reactionIdentifier];
                return [].concat(collection, reaction.operations);
            }, []);
        return General.collectUniqueElements(operations);
    }
    /**
     * Determines unique reversibilities of multiple reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
     * reactions of interest.
     * @param {Object} parameters.reactions Information for all reactions.
     * @returns {Array<string>} Identifiers of reversibilities.
     */
    static determineReactionsReversibilities({
                                                  reactionIdentifiers,
                                                  reactions
                                              } = {}) {
        var reversibilities = reactionIdentifiers
            .map(function (reactionIdentifier) {
                var reaction = reactions[reactionIdentifier];
                return reaction.reversibility;
            });
        return General.collectUniqueElements(reversibilities);
    }
    /**
     * Determines attributes of all reactions.
     * @param {Object} reactions Information about all reactions.
     * @returns {Array<Object<string>>} Attributes of reactions.
     */
    static determineReactionsAttributes(reactions) {
        return Object.keys(reactions).map(function (key) {
            return Attribution.determineReactionAttributes(reactions[key]);
        });
    }
    /**
     * Determines attributes of a single reaction.
     * @param {Object} reaction Information about a reaction.
     * @returns {Object} Attributes of a reaction.
     */
    static determineReactionAttributes(reaction) {
        return {
            compartments: Extraction
                .extractReactionMetabolitesCompartments(reaction.metabolites),
            entity: "reaction",
            identifier: reaction.identifier,
            operations: reaction.operations,
            processes: [reaction.process],
            reversibilities: [reaction.reversibility]
        };
    }
    /**
     * Copies attributes of metabolic entities, metabolites and reactions.
     * @param {Array<Object>} entitiesAttributes Attributes of all entities.
     * @returns {Array<Object>} Attributes of all entities.
     */
    static copyEntitiesAttributes(entitiesAttributes) {
        // Iterate on entity records.
        return entitiesAttributes.map(function (entityRecord) {
            // Iterate on attributes within entity record.
            return Object
                .keys(entityRecord).reduce(function (collection, attribute) {
                    // Records for attributes are either arrays or strings.
                    if (Array.isArray(entityRecord[attribute])) {
                        var newValues = entityRecord[attribute].slice();
                    } else {
                        var newValues = entityRecord[attribute];
                    }
                    var newRecord = {
                        [attribute]: newValues
                    };
                    return Object.assign({}, collection, newRecord);
                }, {});
        });
    }
    /**
     * Records new selection in collection of selections of attributes and
     * values for filters.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.value Value of attribute in current selection.
     * @param {string} parameters.attribute Attribute in current selection.
     * @param {Array<Object<string>>} parameters.selections Values of attributes
     * from selections.
     */
    static recordFilterSelection({value, attribute, selections} = {}) {
        // Determine whether or not the collection already includes a selection
        // for the attribute and value.
        var match = selections.find(function (selection) {
            return (
                selection.attribute === attribute && selection.value === value
            );
        });
        if (match) {
            // The collection already includes a selection for the attribute and
            // value.
            // Remove the selection from the collection.
            return selections.filter(function (selection) {
                return !(
                    selection.attribute === attribute &&
                    selection.value === value
                );
            });
        } else {
            // The collection does not already include a selection for the
            // attribute and value.
            // Include the selection in the collection.
            var newSelection = {
                attribute: attribute,
                value: value
            };
            return [].concat(selections, newSelection);
        }
    }
    /**
     * Filters entities and their values of attributes.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Object<Array<string>>} parameters.selections Values of attributes
     * to apply as filters.
     * @param {Array<Object>} parameters.entitiesAttributes Attributes of all
     * entities.
     * @returns {Array<Object>} Entities and their values of attributes that
     * pass filters.
     */
    static filterEntitiesAttributesValues({selections, entitiesAttributes} = {}) {
        // Filter entities and their values of attributes by specific values of
        // attributes.
        // Combine criteria between different attributes by AND logic.
        // Combine criteria between different values of the same attribute by OR
        // logic.
        // In addition to selecting which entities to preserve, the filtration
        // procedure also selects which values of an attribute to preserve for
        // those entities.
        // Determine filters from selections.
        var filters = Attribution.translateSelectionsFilters(selections);
        // Iterate on entities.
        return entitiesAttributes
            .reduce(function (entitiesCollection, entityRecord) {
                // Determine whether or not the entity's record passes filters.
                var passFilters = Attribution.determineEntityPassFilters({
                    entityRecord: entityRecord,
                    filters: filters
                });
                if (!passFilters) {
                    // Entity's record does not pass filters.
                    // Omit entity's record from the collection.
                    return entitiesCollection;
                } else {
                    // Entity's record passes filters.
                    // Collect entity's values of attributes that match filters.
                    var newRecord = Attribution
                        .collectAttributesValuesMatchFilters({
                            entityRecord: entityRecord,
                            filters: filters
                        });
                    // Include new record in the new attribute index.
                    return [].concat(entitiesCollection, newRecord);
                }
            }, []);
    }
    /**
     * Translates selections of attributes and values to filters of values of
     * attributes.
     * @param {Array<Object<string>>} selections Values of attributes from
     * selections.
     * @returns {Object<Array<string>>} Values of attributes to apply as
     * filters.
     */
    static translateSelectionsFilters(selections) {
        return selections.reduce(function (collection, selection) {
            // Determine whether or not the collection already includes a filter
            // for the selection's attribute.
            if (!collection.hasOwnProperty(selection.attribute)) {
                // The collection does not already include a filter for the
                // attribute.
                // Introduce a new record for a filter for the selection's
                // attribute and value.
                var newRecord = {
                    [selection.attribute]: [selection.value]
                };
                // Copy existing records in the collection and introduce new
                // record.
                return Object.assign({}, collection, newRecord);
            } else {
                // The collection already includes a filter for the attribute.
                // Introduce the new value to the collection.
                // Assume that there are not any redundant selections.
                var newValues = []
                    .concat(collection.attribute, selection.value);
                var newRecord = {
                    [selection.attribute]: newValues
                };
                // Copy existing records in the collection and introduce new
                // record.
                return Object.assign({}, collection, newRecord);
            }
        }, {});
    }
    /**
     * Determines whether or not an entity passes filters by its values of
     * attributes.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Object} parameters.entityRecord Record of a single
     * entity's values of attributes.
     * @param {Object<Array<string>>} parameters.filters Values of attributes to
     * apply as filters.
     * @returns {boolean} Whether or not the entity passes the filters.
     */
    static determineEntityPassFilters({entityRecord, filters} = {}) {
        // Keep entity's record if it matches criteria for all attributes (AND
        // logic).
        return Object.keys(filters).every(function (attribute) {
            // Keep entity's record if any of its values of the attribute match
            // any of the value criteria for the attribute (OR logic).
            return filters[attribute].some(function (valueFilter) {
                return entityRecord[attribute].includes(valueFilter);
            });
        });
    }
    /**
     * Collects values of attributes that match filters.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<Object>} parameters.entityRecord Record of a single
     * entity's values of attributes.
     * @param {Object<Array<string>>} parameters.filters Values of attributes to
     * apply as filters.
     * @returns {Object} Record of a single entity's values of attributes that
     * match filters.
     */
    static collectAttributesValuesMatchFilters({entityRecord, filters} = {}) {
        return Object
            .keys(entityRecord)
            .reduce(function (attributesCollection, attribute) {
                // Determine if there is a filter for the attribute.
                if (!filters.hasOwnProperty(attribute)) {
                    // There is not a filter for the current attribute.
                    // Copy the attribute along with its values and include in
                    // the new record.
                    var newAttributeRecord = {
                        [attribute]: entityRecord[attribute]
                    };
                    // Copy existing values in the record and introduce new
                    // value.
                    return Object
                        .assign({}, attributesCollection, newAttributeRecord);
                } else {
                    // There is a filter for the current attribute.
                    // Include in the new record only those values of the
                    // attribute that match the filter.
                    var attributeValues = entityRecord[attribute]
                        .filter(function (value) {
                            return filters[attribute].includes(value);
                        });
                    var newAttributeRecord = {
                        [attribute]: attributeValues
                    };
                    // Copy existing values in the record and introduce new
                    // value.
                    return Object
                        .assign({}, attributesCollection, newAttributeRecord);
                }
            }, {});
    }
}