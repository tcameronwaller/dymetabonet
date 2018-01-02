////////////////////////////////////////////////////////////////////////////////
// Creation of records for metabolites

/**
 * Creates a record for a single metabolite from a metabolic model.
 * @param {Object<string>} metabolite Information about a single metabolite.
 * @param {Object<Array<string>>} metaboliteReactions Identifiers of reactions
 * in which each metabolite participates.
 * @returns {Object} Record for a metabolite.
 */
function createMetaboliteRecord(metabolite, metaboliteReactions) {
    // Previous checks and cleans of the data ensure that attributes specific to
    // general metabolites are consistent without discrepancies between records
    // for compartmental metabolites.
    var identifier = extractMetaboliteIdentifier(metabolite.id);
    return {
        [identifier]: {
            charge: metabolite.charge,
            formula: metabolite.formula,
            identifier: identifier,
            name: metabolite.name,
            reactions: metaboliteReactions[identifier]
        }
    };
}

/**
 * Extracts identifiers of metabolites from reactions and associates these with
 * identifiers of their reactions.
 * @param {Array<Object>} reactions Information for all reactions in a metabolic
 * model.
 * @returns {Array<Object<string>>} Identifiers of metabolites with identifiers
 * of the reactions in which they participate.
 */
function extractReactionMetabolitePairs(reactions) {
    return reactions.reduce(function (collection, reaction) {
        // Extract the identifiers of all metabolites that participate in the
        // reaction, and associate these with the identifier of the reaction.
        var pairs = Object
            .keys(reaction.metabolites)
            .map(function (identifier) {
                var metaboliteIdentifier = extractMetaboliteIdentifier(
                    identifier
                );
                return {
                    metabolite: metaboliteIdentifier,
                    reaction: reaction.id
                }
            });
        return [].concat(collection, pairs);
    }, []);
}

/**
 * Collects the identifiers of all reactions in which each metabolite
 * participates.
 * @param {Array<Object>} reactions Information for all reactions in a metabolic
 * model.
 * @returns {Object<Array<string>>} Identifiers of reactions in which each
 * metabolite participates.
 */
function collectMetaboliteReactions(reactions) {
    // To simplify the collection operation, flatten the information about
    // reactions and metabolites.
    var reactionsMetabolites = extractReactionMetabolitePairs(reactions);
    // Collect the identifiers of reactions in which each metabolite
    // participates.
    // Assume that every metabolite in the model participates in at least one
    // reaction.
    return reactionsMetabolites.reduce(function (metaboliteReactions, pair) {
        if (metaboliteReactions.hasOwnProperty(pair.metabolite)) {
            // The collection has a record for the metabolite.
            // Include the identifier of the current reaction in the record.
            // The new record will replace the previous record.
            var oldReactions = metaboliteReactions[pair.metabolite];
            if (!oldReactions.includes(pair.reaction)) {
                var newReactions = [].concat(oldReactions, pair.reaction);
            } else {
                var newReactions = oldReactions;
            }
            var newRecord = {
                [pair.metabolite]: newReactions
            };
            return Object.assign({}, metaboliteReactions, newRecord);
        } else {
            // The collection does not have a record for the metabolite.
            // Create a new record for the metabolite and include the identifier
            // of the current reaction.
            var newRecord = {
                [pair.metabolite]: [].concat(pair.reaction)
            };
            return Object.assign({}, metaboliteReactions, newRecord);
        }
    }, {});
}

/**
 * Creates records for all metabolites from a metabolic model.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @param {Array<Object>} reactions Information for all reactions in a metabolic
 * model.
 * @returns {Object<string>} Records for metabolites.
 */
function createMetaboliteRecords(metabolites, reactions) {
    // Collect the identifiers of reactions in which each metabolite
    // participates.
    var metaboliteReactions = collectMetaboliteReactions(reactions);
    // Create records for general metabolites, without consideration for
    // compartmental occurrence.
    // Create records for metabolites.
    return metabolites.reduce(function (collection, metabolite) {
        // Determine if a record already exists for the metabolite.
        if (
            collection
                .hasOwnProperty(extractMetaboliteIdentifier(metabolite.id))
        ) {
            // A record exists for the metabolite.
            return collection;
        } else {
            // A record does not exist for the metabolite.
            // Create a new record for the metabolite.
            return Object.assign(
                {},
                collection,
                createMetaboliteRecord(metabolite, metaboliteReactions)
            );
        }
    }, {});
}

////////////////////////////////////////////////////////////////////////////////
// Creation of records for reactions

/**
 * Creates records for the metabolites that participate in a reaction.
 * @param {Object<number>} reactionMetabolites Information about metabolites
 * that participate in a reaction.
 * @returns {Object<string>} Information about metabolites that participate in a
 * reaction.
 */
function createReactionMetabolites(reactionMetabolites) {
    return Object.keys(reactionMetabolites).map(function (identifier) {
        return {
            identifier: extractMetaboliteIdentifier(identifier),
            role: determineReactionMetaboliteRole(
                reactionMetabolites[identifier]
            ),
            compartment: extractCompartmentIdentifier(identifier)
        };
    });
}

/**
 * Determines the identifier for a reaction's process.
 * @param {string} subsystem Name for a reaction's process.
 * @param {Object} processes Information about all processes in a metabolic
 * model.
 * @returns {string} Identifier for the reaction's process.
 */
function determineReactionProcessIdentifier(subsystem, processes) {
    if (subsystem) {
        var name = subsystem;
    } else {
        var name = "other";
    }
    return Object.keys(processes).filter(function (key) {
        return processes[key].name === name;
    })[0];
}

/**
 * Creates a record for a single reaction from a metabolic model.
 * @param {Object} reaction Information for a reaction.
 * @param {Object} processes Information about processes in a metabolic model.
 * @returns {Object} Record for a node for a reaction.
 */
function createReactionRecord(reaction, processes) {
    return {
        [reaction.id]: {
            genes: extractGenesFromRule(reaction.gene_reaction_rule),
            identifier: reaction.id,
            metabolites: createReactionMetabolites(reaction.metabolites),
            name: reaction.name,
            process: determineReactionProcessIdentifier(
                reaction.subsystem, processes
            ),
            reversibility: determineReversibility(reaction)
        }
    };
}

/**
 * Creates records for all reactions from a metabolic model.
 * @param {Array<Object>} reactions Information for all reactions in a metabolic
 * model.
 * @param {Object<string>} processes Information about all processes in a
 * metabolic model.
 * @returns {Object<string>} Records for reactions.
 */
function createReactionRecords(reactions, processes) {
    // Create records for reactions.
    return reactions.reduce(function (collection, reaction) {
        return Object.assign(
            {}, collection, createReactionRecord(reaction, processes)
        );
    }, {});
}

////////////////////////////////////////////////////////////////////////////////
// Assembly of records for entities

/**
 * Assembles relational records for information about entities in a metabolic
 * model.
 * @param {Object} data Information about a metabolic model from systems
 * biology.
 * @param {Object} sets Information about entities in a metabolic model.
 * @returns {Object} Information about entities.
 */
function assembleEntities(data, sets) {
    return {
        entities: {
            metabolites: createMetaboliteRecords(
                data.metabolites, data.reactions
            ),
            reactions: createReactionRecords(data.reactions, sets.processes)
        }
    }
}
