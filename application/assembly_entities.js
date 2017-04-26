////////////////////////////////////////////////////////////////////////////////
// Creation of records for metabolites

/**
 * Creates a record for a single metabolite from a metabolic model.
 * @param {Object<string>} metabolite Information about a single metabolite.
 * @returns {Object} Record for a metabolite.
 */
function createMetaboliteRecord(metabolite) {
    // Previous checks and cleans of the data ensure that attributes specific to
    // general metabolites are consistent without discrepancies between records
    // for compartmental metabolites.
    var identifier = extractMetaboliteIdentifier(metabolite.id);
    return {
        [identifier]: {
            charge: metabolite.charge,
            formula: metabolite.formula,
            identifier: identifier,
            name: metabolite.name
        }
    };
}

/**
 * Creates records for all metabolites from a metabolic model.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @returns {Object<string>} Records for metabolites.
 */
function createMetaboliteRecords(metabolites) {
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
                createMetaboliteRecord(metabolite)
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
    var identifier = reaction.id;
    return {
        [identifier]: {
            genes: extractGenesFromRule(reaction.gene_reaction_rule),
            identifier: identifier,
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
            metabolites: createMetaboliteRecords(data.metabolites),
            reactions: createReactionRecords(data.reactions, sets.processes)
        }
    }
}
