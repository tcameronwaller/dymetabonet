
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
