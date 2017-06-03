
////////////////////////////////////////////////////////////////////////////////
// Creation of Metabolite Nodes

/**
 * Creates a record for a network node for a single compartmental metabolite
 * from a metabolic model.
 * @param {Object} metabolite Information for a compartmental metabolite.
 * @returns {Object} Record for a node for a compartmental metabolite.
 */
function createGeneralMetaboliteNodeRecord(metabolite) {
    return {
        [metabolite.id]: {
            compartment: metabolite.compartment,
            id: metabolite.id,
            metabolite: extractMetaboliteIdentifier(metabolite.id),
            type: "metabolite"
        }
    };
}

/**
 * Creates records for network nodes for all compartmental metabolites from a
 * metabolic model.
 * @param {Object} parameters Destructured object of parameters.
 * @param {Array<string>} parameters.replications Identifiers of metabolites for
 * which to replicate nodes in the network.
 * @param {Array<string>} parameters.metabolites Identifiers of metabolites for
 * which to include nodes in the network.
 * @param {Object} parameters.modelMetabolites Information for all metabolites of a
 * metabolic model.
 * @returns {Array<Object>} Records of nodes for general metabolites.
 */
function createGeneralMetaboliteNodeRecords(
    {replications, metabolites, modelMetabolites} = {}
    ) {
    // TODO: Iterate on the metabolites from the Attribute Index.
    // TODO: Determine if each metabolite's id is in the replications list.
    // TODO: If the metabolite is supposed to be replicated, then handle it with the reactions?



    // Confirm that all compartmental metabolites participate in reactions.
    // For each metabolite, make sure that there is at least 1 reaction in which
    // it participates. Use a filter function.
    // Check metabolites.
    metabolites.map(function (metabolite) {
        return checkMetabolite(metabolite.id, reactions);
    });
    // Create nodes for metabolites.
    return metabolites.reduce(function (collection, metabolite) {
        return Object.assign(
            {}, collection, createMetaboliteNodeRecord(metabolite)
        );
    }, {});
}

////////////////////////////////////////////////////////////////////////////////
// Creation of Reaction Nodes


////////////////////////////////////////////////////////////////////////////////
// Creation of Reaction Links


////////////////////////////////////////////////////////////////////////////////
// Assembly of Network Elements

// TODO: Write a function... "assembleNetwork" to handle the compartment flag and call the appropriate assembly function...

// TODO: Assemble the network differently according to user selection of compartmental metabolites or general metabolites.
// TODO: Include a flag variable "compartment" that is true or false.

// TODO: If "compartment" is false, then ignore compartments in the network...
// TODO: ...only nodes for general metabolites...
// TODO: ...no transport reactions that would involve same metabolite as reactant and product.

// TODO: If "compartment" is true, use nodes for compartmental metabolites.
// TODO: The data for each node for each compartmental metabolite should indicate the compartment.


/**
 * Assembles network elements, nodes and links, to represent a portion of a
 * metabolic model without consideration of compartments.
 * @param {Object} parameters Destructured object of parameters.
 * @param {Array<string>} parameters.replications Identifiers of metabolites for
 * which to replicate nodes in the network.
 * @param {Array<string>} parameters.metabolites Identifiers of metabolites for
 * which to include nodes in the network.
 * @param {Array<string>} parameters.reactions Identifiers of reactions for
 * which to include nodes in the network.
 * @param {Object<Object>>} parameters.model Information about entities and
 * relations in a metabolic model.
 * @returns {Object} Network elements.
 */
function assembleGeneralNetwork({replications, metabolites, reactions, model} = {}) {
    return {
        network: {
            links: createGeneralReactionLinkRecords(model.reactions),
            nodes: {
                metabolites: createGeneralMetaboliteNodeRecords({
                    replications: replications,
                    metabolites: metabolites,
                    modelMetabolites: model.entities.metabolites
                }),
                reactions: createGeneralReactionNodeRecords({
                    replications: replications,
                    metabolites: metabolites,
                    reactions: reactions,
                    modelReactions: model.entities.reactions
                })
            }
        }
    };
}