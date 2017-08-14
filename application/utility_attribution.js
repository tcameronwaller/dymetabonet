/**
 * Functionality of utility for assigning attributes to metabolic entities.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for external utility.
 */
class Attribution {
    /**
     * Records new selection in collection of selections of attributes and
     * values for filters.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.value Value of attribute in current selection.
     * @param {string} parameters.attribute Attribute in current selection.
     * @param {Array<Object<string>>} parameters.selections Current selections
     * of values of attributes.
     */
    static recordFilterSelection({value, attribute, selections} = {}) {
        // Determine whether or not the collection includes a selection for the
        // attribute and value.
        var match = selections.some(function (selection) {
            return (
                selection.attribute === attribute && selection.value === value
            );
        });
        if (match) {
            // The collection includes a selection for the attribute and value.
            // Remove the selection from the collection.
            var newSelections = selections.filter(function (selection) {
                return !(
                    selection.attribute === attribute &&
                    selection.value === value
                );
            });
        } else {
            // The collection does not include a selection for the attribute and
            // value.
            // Include the selection in the collection.
            var newSelection = {
                attribute: attribute,
                value: value
            };
            var newSelections = [].concat(selections, newSelection);
        }
        return newSelections;
    }
    /**
     * Filters reactions and their values of attributes.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<Object<string>>} parameters.selections Current selections
     * of attributes' values.
     * @param {Object} parameters.reactions Records with information about
     * reactions.
     * @returns {Object} Records with information about reactions and values of
     * their attributes that pass filters.
     */
    static filterReactionsAttributesValues({selections, reactions} = {}) {
        // Filter reactions and their values of attributes.
        // This filtration procedure selects which reactions to preserve and
        // which of their values of attributes to preserve.
        // Determine filters from selections.
        var filters = Attribution.translateSelectionsFilters(selections);
        // Iterate on reactions.
        var reactionsIdentifiers = Object.keys(reactions);
        return reactionsIdentifiers
            .reduce(function (reactionsCollection, reactionIdentifier) {
                var reaction = reactions[reactionIdentifier];
                // Filter reaction's attributes.
                var filterReaction = Attribution
                    .filterReactionAttributesValues({
                        filters: filters,
                        reaction: reaction
                    });
                // Determine whether or not the reaction passes filters.
                var pass = Attribution
                    .determineReactionPassFilters(filterReaction);
                if (pass) {
                    // Include reaction in the collection.
                    var newRecord = {
                        [filterReaction.identifier]: filterReaction
                    };
                    var newCollection = Object
                        .assign({}, reactionsCollection, newRecord);
                } else {
                    // Omit reaction from the collection.
                    var newCollection = reactionsCollection;
                }
                return newCollection;
            }, {});
    }
    /**
     * Translates selections of attributes and values to filters of values of
     * attributes.
     * @param {Array<Object<string>>} parameters.selections Current selections
     * of attributes' values.
     * @returns {Object<Array<string>>} Values of attributes to apply as
     * filters.
     */
    static translateSelectionsFilters(selections) {
        return selections.reduce(function (collection, selection) {
            // Determine whether or not the collection already includes a filter
            // for the selection's attribute.
            if (!collection.hasOwnProperty(selection.attribute)) {
                // The collection does not include a filter for the attribute.
                // Include a new record for a filter for the selection's
                // attribute and value.
                var newRecord = {
                    [selection.attribute]: [selection.value]
                };
                // Copy existing records in the collection and include new
                // record.
                var newCollection = Object.assign({}, collection, newRecord);
            } else {
                // The collection includes a filter for the attribute.
                // Determine whether or not the selection's value of the
                // attribute is novel.
                // Normally in the application, replicate selections are not
                // possible.
                if (
                    !collection[selection.attribute].includes(selection.value)
                ) {
                    // Selection's value of the attribute is novel.
                    // Include the attribute's value in the collection.
                    var newValues = []
                        .concat(collection[selection.attribute], selection.value);
                    var newRecord = {
                        [selection.attribute]: newValues
                    };
                    // Copy existing records in the collection and include new
                    // record.
                    var newCollection = Object
                        .assign({}, collection, newRecord);
                } else {
                    // Selection's value of the attribute is not novel.
                    // Leave current filters as they are.
                    var newCollection = collection;
                }
            }
            return newCollection;
        }, {});
    }
    /**
     * Filters a reaction's values of attributes.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Object<Array<string>>} parameters.filters Values of attributes to
     * apply as filters.
     * @param {Object} parameters.reaction Record with information about a
     * reaction.
     * @returns {Object} Record with information about a reaction and its
     * attributes' values that pass filters.
     */
    static filterReactionAttributesValues({filters, reaction} = {}) {
        // Determine reaction's values of relevant attributes that pass filters.
        // Filter processes.
        var processes = Attribution.filterAttributeValues({
            values: reaction.processes,
            attribute: "processes",
            filters: filters
        });
        // Filter compartments.
        var compartments = Attribution.filterAttributeValues({
            values: reaction.compartments,
            attribute: "compartments",
            filters: filters
        });
        // Filter metabolites.
        var metabolites = Attribution.filterReactionMetabolites({
            metabolites: reaction.metabolites,
            compartments: compartments,
            participants: reaction.participants
        });
        // Compile attributes' values that pass filters.
        var filterAttributes = {
            processes: processes,
            compartments: compartments,
            metabolites: metabolites
        };
        // Copy all of reaction's attributes.
        var attributes = Extraction.copyEntityAttributesValues(reaction);
        // Compile attributes for reaction's record.
        // Replace attributes relevant to filters.
        return Object.assign({}, attributes, filterAttributes);
    }
    /**
     * Filters values of a reaction's attributes.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.values Values of a single attribute.
     * @param {string} parameters.attribute A single attribute.
     * @param {Object<Array<string>>} parameters.filters Values of attributes to
     * apply as filters.
     * @returns {Array<string>} Attribute's values that pass filters.
     */
    static filterAttributeValues({
                                     values, attribute, filters
                                 } = {}) {
        // Determine if there is a filter for the attribute.
        if (!filters.hasOwnProperty(attribute)) {
            // There is not a filter for the attribute.
            // Copy the attribute's values.
            var matchValues = values.slice();
        } else {
            // There is a filter for the attribute.
            // Filter the attribute's values.
            var matchValues = values.filter(function (value) {
                return filters[attribute].includes(value);
            });
        }
        // Return values of the attribute that pass filters.
        return matchValues;
    }
    /**
     * Filters metabolites that participate in a reaction.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.metabolites Identifiers of metabolites
     * that participate in a reaction.
     * @param {Array<string>} parameters.compartments Identifiers of a
     * reaction's compartments that pass filters.
     * @param {Array<Object<string>>} parameters.participants Information about
     * metabolites' participation in a reaction.
     * @returns {Array<string>} Identifiers of a reaction's metabolites that
     * pass filters.
     */
    static filterReactionMetabolites({
                                         metabolites, compartments, participants
    } = {}) {
        // Filter metabolites by the compartments in which they participate in
        // their reaction.
        // Metabolites pass filters if they participate in a compartment that
        // passes filters.
        return metabolites.filter(function (metabolite) {
            var participantMatch = participants.some(function (participant) {
                var metaboliteMatch = participant.metabolite === metabolite;
                var compartmentMatch = compartments
                    .includes(participant.compartment);
                return metaboliteMatch && compartmentMatch;
            });
            return participantMatch;
        });
    }
    /**
     * Determines whether or not a reaction passes filters.
     * @param {Object} reaction Record with information about a reaction and its
     * attributes' values that pass filters.
     * @returns {boolean} Whether or not the reaction passes filters.
     */
    static determineReactionPassFilters(reaction) {
        // Requirements for reaction to pass filters depends on the reaction's
        // main behavior.
        // Determine whether or not reaction involves transport.
        if (reaction.transport) {
            // Reaction involves transport of a metabolite between different
            // compartments.
            // A single reaction can facilitate multiple transport events.
            // Reactions that involve transport only pass filters if multiple
            // compartments of any transport event pass filters.
            var compartments = reaction.transports.some(function (transport) {
                var matches = transport
                    .compartments
                    .filter(function (compartment) {
                        return reaction.compartments.includes(compartment);
                    });
                return matches.length > 1;
            });
        } else {
            // Reaction does not involve transport of a metabolite between
            // different compartments.
            // Reaction passes filters if it has any processes, compartments, and
            // metabolites that pass filters.
            var compartments = reaction.compartments.length > 0;
        }
        // Combinations of criteria between different values of the same
        // attribute use OR logic, since any value that passes fulfills the
        // requirement for the attribute.
        // Combinations of criteria between different attributes use AND logic,
        // since all attributes must pass to fulfill the requirement for the
        // reaction.
        var processes = reaction.processes.length > 0;
        var metabolites = reaction.metabolites.length > 0;
        return (compartments && processes && metabolites);
    }
    /**
     * Filters metabolites and their values of attributes that they inherit from
     * reactions in which they participate.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Object} parameters.metabolites Records with information about
     * metabolites.
     * @param {Object} parameters.reactions Records with information about
     * reactions.
     * @returns {Object} Records with information about metabolites and values
     * of their attributes that pass filters.
     */
    static filterMetabolitesReactionsAttributes({
                                                          metabolites, reactions
    } = {}) {
        // Filter metabolites and their values of attributes.
        // Metabolites inherit attributes relevant to filtration from the
        // reactions in which they participate.
        // Iterate on metabolites.
        var metabolitesIdentifiers = Object.keys(metabolites);
        return metabolitesIdentifiers
            .reduce(function (metabolitesCollection, metaboliteIdentifier) {
                var metabolite = metabolites[metaboliteIdentifier];
                // Filter metabolite's reactions and values of attributes that
                // it inherits from its reactions.
                var filterMetabolite = Attribution
                    .filterMetaboliteReactionsAttributes({
                        metabolite: metabolite,
                        reactions: reactions
                    });
                // Determine whether or not the metabolite passes filters.
                // within determine function... Metabolite passes filters if at least a single reaction claims it.
                var pass = Attribution
                    .determineMetabolitePassFilters(filterMetabolite);
                if (pass) {
                    // Include metabolite in the collection.
                    var newRecord = {
                        [filterMetabolite.identifier]: filterMetabolite
                    };
                    var newCollection = Object
                        .assign({}, metabolitesCollection, newRecord);
                } else {
                    // Omit metabolite from the collection.
                    var newCollection = metabolitesCollection;
                }
                return newCollection;
            }, {});
    }
    /**
     * Filters a single metabolite's values of attributes that it inherits from
     * reactions in which it participates.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Object} parameters.metabolite Record with information about a
     * single metabolite.
     * @param {Object} parameters.reactions Records with information about
     * reactions.
     * @returns {Object} Record with information about a single metabolite and
     * values of its attributes that pass filters.
     */
    static filterMetaboliteReactionsAttributes({
                                                          metabolite, reactions
                                                      } = {}) {
        // Copy all of metabolite's attributes.
        var metaboliteAttributes = Extraction
            .copyEntityAttributesValues(metabolite);
        // Determine values of attributes that metabolite inherits from the
        // reactions in which it participates.
        var reactionsAttributes = Extraction
            .collectMetaboliteReactionsAttributes({
                metaboliteIdentifier: metabolite.identifier,
                reactionsIdentifiers: metabolite.reactions,
                reactions: reactions
            });
        // Compile attributes for metabolite's record.
        // Replace attributes relevant to filters.
        return Object.assign({}, metaboliteAttributes, reactionsAttributes);
    }
    /**
     * Determines whether or not a metabolite passes filters.
     * @param {Object} metabolite Record with information about a metabolite and
     * its attributes' values that pass filters.
     * @returns {boolean} Whether or not the metabolite passes filters.
     */
    static determineMetabolitePassFilters(metabolite) {
        // Attributes relevant to filtration are compartments and processes.
        // Metabolites inherit these attributes from the reactions in which they
        // participate.
        // To pass filters, a metabolite must participate in at least a single
        // reaction in a context that passes filters.
        return metabolite.reactions.length > 0;
    }
}


    /**
 * Functionality of utility for assigning attributes to metabolic entities.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for external utility.
 */
class AttributionOld {
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
            compartments: Attribution.collectMetaboliteReactionsCompartments({
                metaboliteIdentifier: metabolite.identifier,
                reactionsIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            conversions: Extraction.collectReactionsAttributeValues({
                attribute: "conversion",
                reactionsIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            dispersals: Extraction.collectReactionsAttributeValues({
                attribute: "dispersal",
                reactionsIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            entity: "metabolite",
            identifier: metabolite.identifier,
            processes: Attribution.collectReactionsProcesses({
                reactionsIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            reversibilities: Extraction.collectReactionsAttributeValues({
                attribute: "reversibility",
                reactionsIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            transports: Extraction.collectReactionsAttributeValues({
                attribute: "transport",
                reactionsIdentifiers: metabolite.reactions,
                reactions: reactions
            })
        };
    }
    /**
     * Collects unique processes of multiple reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.reactionsIdentifiers Identifiers for
     * reactions of interest.
     * @param {Object} parameters.reactions Information about all reactions.
     * @returns {Array<string>} Identifiers of processes.
     */
    static collectReactionsProcesses({reactionsIdentifiers, reactions} = {}) {
        var processes = reactionsIdentifiers
            .reduce(function (collection, reactionIdentifier) {
                var reaction = reactions[reactionIdentifier];
                return [].concat(collection, reaction.processes);
            }, []);
        return General.collectUniqueElements(processes);
    }
    /**
     * Collects unique compartments in which a single metabolite participates in
     * multiple reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.metaboliteIdentifier Identifier for a
     * metabolite of interest.
     * @param {Array<string>} parameters.reactionsIdentifiers Identifiers for
     * reactions of interest.
     * @param {Object} parameters.reactions Information for all reactions.
     * @returns {Array<string>} Identifiers of compartments.
     */
    static collectMetaboliteReactionsCompartments({
                                                         metaboliteIdentifier,
                                                         reactionsIdentifiers,
                                                         reactions
                                                     } = {}) {
        // Metabolite qualifies for compartment if it participates in any
        // reaction in the compartment.
        var compartments = reactionsIdentifiers
            .reduce(function (collection, reactionIdentifier) {
                var reaction = reactions[reactionIdentifier];
                var metabolites = reaction
                    .metabolites.filter(function (metabolite) {
                        return metabolite.identifier === metaboliteIdentifier;
                    });
                var metaboliteReactionCompartments = General
                    .collectValuesFromObjects("compartment", metabolites);
                return [].concat(collection, metaboliteReactionCompartments);
            }, []);
        return General.collectUniqueElements(compartments);
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
            conversions: [reaction.conversion],
            dispersals: [reaction.dispersal],
            entity: "reaction",
            identifier: reaction.identifier,
            processes: reaction.processes,
            reversibilities: [reaction.reversibility],
            transports: [reaction.transport]
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
     * Extracts from a collection of entities' attributes the identifiers of all
     * entities.
     * @param {Array<Object<string>>} entitiesAttributes Attributes of
     * metabolic entities, metabolites and reactions.
     * @returns {<Array<string>} Identifiers of entities.
     */
    static extractEntityIdentifiers(entitiesAttributes) {
        return entitiesAttributes.map(function (record) {
            return record.identifier;
        });
    }
    /**
     * Filters records of entities's attributes by the type of entity,
     * metabolite or reaction.
     * @param {string} entity A type of entity, metabolite or reaction.
     * @param {Array<Object<string>>} entitiesAttributes Attributes of
     * metabolic entities, metabolites and reactions.
     * @returns {<Array<Object<string>>} Attributes of entities of a specific
     * type.
     */
    static filterEntityType(entity, entitiesAttributes) {
        return entitiesAttributes.filter(function (record) {
            return record.entity === entity;
        });
    }
        /**
         * Filters reactions and their values of attributes.
         * @param {Object} parameters Destructured object of parameters.
         * @param {Object<Array<string>>} parameters.selections Current selections
         * of values of attributes.
         * @param {Object} parameters.reactions Records with information about
         * reactions.
         * @returns {Object} Records with information about reactions and values of
         * their attributes that pass filters.
         */

        static filterReactionsAttributesValues({selections, reactions} = {}) {
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