////////////////////////////////////////////////////////////////////////////////
// Query by attribute

// TODO: Prepare index...

// TODO: Follow pattern of creating metabolite or reaction records...
// TODO: Have a master function and call subordinate functions to handle specific parts or attributes.
// TODO: I'll probably need sub functions for metabolites and reactions respectively.


// TODO: First create table only for reactions.
// TODO: First only determine compartments and draw the corresponding bars.

/**
 * Extracts compartments in which metabolites participate in a reaction.
 * @param {Object<string>} reactionMetabolites Information about metabolites
 * that participate in a reaction.
 * @returns {Array<string>} Identifiers of compartments.
 */
function extractReactionMetaboliteCompartments(reactionMetabolites) {
    var identifiers = reactionMetabolites.map(function (metabolite) {
        return metabolite.compartment;
    });
    return collectUniqueElements(identifiers);
}

/**
 * Creates an index for attributes of a single reaction from a metabolic model.
 * @param {Object} reaction Record for a reaction.
 * @returns {Object} Index for a reaction.
 */
function createReactionIndex(reaction) {
    return {
        identifier: reaction.identifier,
        entity: "reaction",
        compartment: extractReactionMetaboliteCompartments(
            reaction.metabolites
        ),
        process: [reaction.process],
        //operation: determineReactionOperation(reaction),
        reversibility: reaction.reversibility
    };
}

/**
 * Creates indices for attributes of all reactions in a metabolic model.
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
 * Creates index for attributes of all metabolites and reactions in a metabolic
 * model.
 * @param {Object} reactions Information for all reactions in a metabolic
 * model.
 * @returns {Array<Object<string>>} Indices for metabolites and reactions.
 */
function createQueryIndex(reactions) {
}
