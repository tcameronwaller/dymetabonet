
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
 * Determines the identifier for a network node for a metabolite.
 * @param {boolean} compartment Indicator of whether or not to represent
 * compartmentalization in the network.
 * @param {Object} reactionMetabolite Information about a metabolite's
 * participation in a reaction.
 * @returns {string} Identifier for a network node for the metabolite.
 */
function determineMetaboliteNodeIdentifier(compartment, reactionMetabolite) {
    if (compartment) {
        return (
            reactionMetabolite.identifier + "_" + reactionMetabolite.compartment
        );
    } else {
        return reactionMetabolite.identifier;
    }
}

// TODO: I really need to split this function up more...
// TODO: Try to maximize reuse of similar functionality in either the general or compartmental case.
// TODO: Just handle the compartment-specific stuff according to the compartment flag.
/**
 * Assembles network elements, nodes and links, to represent a portion of a
 * metabolic model without consideration of compartments.
 * @param {Object} parameters Destructured object of parameters.
 * @param {boolean} parameters.compartment Indicator of whether or not to
 * represent compartmentalization in the network.
 * @param {Array<string>} parameters.replicationMetabolites Identifiers of
 * metabolites for which to replicate nodes in the network.
 * @param {Array<string>} parameters.metaboliteIdentifiers Identifiers of
 * metabolites for which to include nodes in the network.
 * @param {Array<string>} parameters.reactionIdentifiers Identifiers of
 * reactions for which to include nodes in the network.
 * @param {Object<Object>>} parameters.model Information about entities and
 * relations in a metabolic model.
 * @returns {Object} Network elements.
 */
function assembleNetwork({
                             compartment,
                             replicationMetabolites,
                             metaboliteIdentifiers,
                             reactionIdentifiers,
                             model
} = {}) {
    // Determine whether or not to represent compartmentalization in the
    // network.
    if (compartment) {
        // Represent compartmentalization in the network.
        // Use nodes for compartmental metabolites.
        // Include transport reactions that have the same metabolite as both
        // reactant and product.
        // Initiate a collection of network elements.
        var networkElements = {
            links: [],
            nodes: []
        };
        // Iterate on reactions.
        return reactionIdentifiers
            .reduce(function (networkCollection, reactionIdentifier) {
                // TODO: Maybe make a function to store everything for nodes and links of a single reaction.
                // Create new node for the reaction.
                var reactionNode = model.entities.reactions[reactionIdentifier];
                // Create new nodes for the reaction's metabolites.
                // Create links between the reaction and its metabolites.
                var metaboliteNodes = reactionNode
                    .metabolites
                    .reduce(function (reactionCollection, reactionMetabolite) {
                        // Determine whether or not the metabolite is in the
                        // list for inclusion in the network.
                        if (
                            metaboliteIdentifiers
                                .includes(reactionMetabolite.identifier)
                        ) {
                            // Metabolite is in list for inclusion.
                            // Create node for metabolite.
                            // Determine whether or not to create replicate,
                            // reaction-specific nodes for the metabolite.
                            if (
                                !replicationMetabolites
                                    .includes(reactionMetabolite.identifier)
                            ) {
                                // Metabolite is not in list for
                                // reaction-specific replication.
                                // Determine identifier for metabolite node.
                                var metaboliteNodeIdentifier =
                                    determineMetaboliteNodeIdentifier(
                                        compartment, reactionMetabolite
                                    );
                                // Create new node for the metabolite.
                                var metabolite = model.entities.metabolites[reactionMetabolite.identifier];
                                var newValues = {
                                    compartment: reactionMetabolite.compartment,
                                    identifier: metaboliteNodeIdentifier
                                };
                                // TODO: I think this operation will replace the old identifier.
                                var metaboliteNode = Object.assign(metabolite, newValues);
                            } else {
                                // Metabolite is in list for reaction-specific
                                // replication.
                            }
                        } else {
                            // Metabolite is not in list for inclusion.
                            // Do not create node for metabolite.
                            return reactionCollection;
                        }
                    }, networkElements);
                // Create links between the reaction and its metabolites that
                // persist in the attribute index.
                // Restore the collection of network elements to include new
                // nodes and links.
            }, networkElements);
    } else {
        // Do not represent compartmentalization in the network.
        // Use nodes for general metabolites.
        // Omit transport reactions that have the same metabolite as both
        // reactant and product.
        // Determine if the reaction is a transport reaction.
        // TODO: Check for multiple compartments in reaction...
        // TODO: Probably use Array.some() to check to see if any reactants match products...
    }
}