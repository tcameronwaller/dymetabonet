
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

/**
 * Creates records for links between a pair of a single reaction and a single
 * metabolite that participates in the reaction.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.metaboliteIdentifier Identifier of a single
 * metabolite.
 * @param {string} parameters.role Role, either reactant or product, of the
 * metabolite in the reaction.
 * @param {string} parameters.reactionIdentifier Identifier of a single
 * reaction.
 * @param {boolean} parameters.reversibility Indicator of whether or not the
 * reaction is reversible.
 * @returns {Array<Object<string>>} Records for links between the reaction and
 * the metabolite.
 */
function createReactionMetaboliteLinks(
    {metaboliteIdentifier, role, reactionIdentifier, reversibility} = {}
    ) {
    // Determine whether or not the reaction is reversible.
    if (!reversibility) {
        // Reaction is not reversible.
        // Create directional link from a reactant metabolite to the reaction or
        // from the reaction to a product metabolite.
        if (role === "reactant") {
            var newLink = {
                identifier: metaboliteIdentifier + "_" + reactionIdentifier,
                source: metaboliteIdentifier,
                target: reactionIdentifier
            };
            return [].concat(newLink);
        } else if (role === "product") {
            var newLink = {
                identifier: reactionIdentifier + "_" + metaboliteIdentifier,
                source: reactionIdentifier,
                target: metaboliteIdentifier
            };
            return [].concat(newLink);
        }
    } else {
        // Reaction is reversible.
        // Create directional links in both directions between the metabolite
        // and the reaction.
        var newForwardLink = {
            identifier: metaboliteIdentifier + "_" + reactionIdentifier,
            source: metaboliteIdentifier,
            target: reactionIdentifier
        };
        var newReverseLink = {
            identifier: reactionIdentifier + "_" + metaboliteIdentifier,
            source: reactionIdentifier,
            target: metaboliteIdentifier
        };
        return [].concat(newForwardLink, newReverseLink);
    }
}

/**
 * Determines whether or not the reaction involves the same metabolite as both
 * reactant and product.
 * @param {Array<Object>} reactionMetabolites Information about metabolites that
 * participate in a reaction.
 * @returns {boolean} Indicator of whether or not the reaction involves the same
 * metabolite as both reactant and product.
 */
function determineReactionSameReactantProduct(reactionMetabolites) {
    var reactants = reactionMetabolites.filter(function (metabolite) {
        return metabolite.role === "reactant";
    }).map(function (reactant) {
        return reactant.identifier;
    });
    var products = reactionMetabolites.filter(function (metabolite) {
        return metabolite.role === "product";
    }).map(function (product) {
        return product.identifier;
    });
    return reactants.some(function (reactant) {
        return products.includes(reactant);
    });
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
    // To represent compartmentalization in the network, use distinct nodes for
    // compartmental metabolites.
    // To ignore compartmentalization in the network, use nodes for general
    // metabolites.
    // A representation of the network without compartmentalization might be
    // inconvenient for transport reactions that have the same metabolite as
    // both reactant and product.

    // Initiate a collection of network elements.
    var initialNetworkElements = {
        links: [],
        nodes: []
    };
    // Iterate on reactions.
    return reactionIdentifiers
        .reduce(function (networkCollection, reactionIdentifier) {
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
                        // Determine base identifier for metabolite node.
                        var metaboliteIdentifier =
                            determineMetaboliteNodeIdentifier(
                                compartment, reactionMetabolite
                            );
                        // Determine whether or not to create replicate,
                        // reaction-specific nodes for the metabolite.
                        if (
                            !replicationMetabolites
                                .includes(reactionMetabolite.identifier)
                        ) {
                            // Metabolite is not in list for
                            // reaction-specific replication.
                            var metaboliteNodeIdentifier = metaboliteIdentifier;
                        } else {
                            // Metabolite is in list for reaction-specific
                            // replication.
                            var metaboliteNodeIdentifier = (
                                metaboliteIdentifier + "_" + reactionIdentifier
                            );
                        }
                        // Determine whether or not a node already exists for
                        // the metabolite.
                        // Consider both collections in order not to miss any
                        // nodes.
                        var collectionNodes = networkCollection
                            .nodes
                            .concat(reactionCollection.nodes);
                        var nodeSearch = collectionNodes
                            .find(function (node) {
                                return node.identifier === metaboliteNodeIdentifier;
                            });
                        if (nodeSearch !== undefined) {
                            // A node does not already exist for the metabolite.
                            // Create new node for the metabolite.
                            var metabolite = model
                                .entities
                                .metabolites[reactionMetabolite.identifier];
                            var newValues = {
                                compartment: reactionMetabolite.compartment,
                                identifier: metaboliteNodeIdentifier
                            };
                            var metaboliteNode = Object
                                .assign(metabolite, newValues);
                            var newNodes = reactionCollection.nodes.concat(metaboliteNode);
                        }

                        // TODO: Shoot... before creating a new node for a metabolite, I need to make sure that a record does not already exist for the metabolite.
                        // TODO: Same for the links.


                        // Create links between the reaction and the metabolite.
                        var links = createReactionMetaboliteLinks({
                            metaboliteIdentifier: metaboliteNodeIdentifier,
                            role: reactionMetabolite.role,
                            reactionIdentifier: reactionIdentifier,
                            reversibility: reactionNode.reversibility
                        });
                        var newLinks = reactionCollection.links.concat(links);
                        return {
                            links: newLinks,
                            nodes: newNodes
                        };
                    } else {
                        // Metabolite is not in list for inclusion.
                        // Do not create node for metabolite.
                        return reactionCollection;
                    }
                }, initialNetworkElements);
            // Create links between the reaction and its metabolites that
            // persist in the attribute index.
            // Restore the collection of network elements to include new
            // nodes and links.
        }, initialNetworkElements);
}