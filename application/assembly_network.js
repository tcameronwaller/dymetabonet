
////////////////////////////////////////////////////////////////////////////////
// Assembly of Network Elements

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

/**
 * Determines the identifier for a network node for a metabolite.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.metabolite Identifier of a general metabolite.
 * @param {string} parameters.compartment Identifier of a compartment.
 * @param {boolean} parameters.compartmentalization Indicator of whether or not
 * to represent compartmentalization in the network.
 * @returns {string} Identifier for a network node for the metabolite.
 */
function determineMetaboliteNodeBaseIdentifier(
    {metabolite, compartment, compartmentalization} = {}
) {
    if (compartmentalization) {
        return (
            metabolite + "_" + compartment
        );
    } else {
        return metabolite;
    }
}

/**
 * Determines the identifier for a network node for a metabolite.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.metabolite Identifier of a general metabolite.
 * @param {string} parameters.compartment Identifier of a compartment.
 * @param {boolean} parameters.compartmentalization Indicator of whether or not
 * to represent compartmentalization in the network.
 * @param {string} parameters.reaction Identifier of reaction in which
 * metabolite participates.
 * @param {Array<string>} parameters.replicationMetabolites Identifiers of
 * metabolites for which to replicate nodes in the network.
 * @returns {string} Identifier for a network node for the metabolite.
 */
function determineMetaboliteNodeIdentifier({
                                               metabolite,
                                               compartment,
                                               compartmentalization,
                                               reaction,
                                               replicationMetabolites
} = {}) {
    // Determine base identifier for the metabolite node.
    var baseMetaboliteIdentifier = determineMetaboliteNodeBaseIdentifier({
        metabolite: metabolite,
        compartment: compartment,
        compartmentalization: compartmentalization
    });
    // Determine whether or not to create replicate, reaction-specific nodes for
    // the metabolite.
    if (!replicationMetabolites.includes(metabolite)) {
        // Metabolite is not in list for reaction-specific replication.
        var metaboliteNodeIdentifier = baseMetaboliteIdentifier;
    } else {
        // Metabolite is in list for reaction-specific replication.
        var metaboliteNodeIdentifier = (
            baseMetaboliteIdentifier + "_" + reaction
        );
    }
    return metaboliteNodeIdentifier;
}

/**
 * Creates a new node for a metabolite.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.identifier Identifier of node for metabolite.
 * @param {string} parameters.compartment Identifier of a compartment.
 * @param {boolean} parameters.compartmentalization Indicator of whether or not
 * to represent compartmentalization in the network.
 * @param {Object} parameters.attributes Information for a metabolite from
 * metabolic model.
 * @param {Array<Object>} parameters.currentNodes Nodes in current collection
 * for the network.
 * @returns {Array<Object>} New nodes for the network.
 */
function createNewMetaboliteNode({
    identifier,
    compartment,
    compartmentalization,
    attributes,
    currentNodes
} = {}) {
    // TODO: Eventually, I think it'll be desirable to have an indication of whether or not the metabolite node is a reaction-specific replicate.
    // Determine whether or not a node already exists for the metabolite.
    var nodeMatch = currentNodes.find(function (node) {
            return node.identifier === identifier;
        });
    if (!nodeMatch) {
        // A node does not already exist for the metabolite.
        // Create new node for the metabolite.
        // Include new attributes for the node.
        if (compartmentalization) {
            var newAttributes = {
                compartment: compartment,
                entity: "metabolite",
                identifier: identifier,
                reactions: attributes.reactions.slice()
            };
        } else {
            var newAttributes = {
                entity: "metabolite",
                identifier: identifier,
                reactions: attributes.reactions.slice()
            };
        }
        var newNode = Object.assign(attributes, newAttributes);
        var newNodes = currentNodes.concat(newNode);
    } else {
        // A node already exists for the metabolite.
        var newNodes = currentNodes;
    }
    return newNodes;
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
    // Use a special delimiter "_-_" between identifiers of reactions and
    // metabolites for links in order to avoid ambiguity with nodes for
    // reaction-specific metabolites.
    // Determine whether or not the reaction is reversible.
    if (!reversibility) {
        // Reaction is not reversible.
        // Create directional link from a reactant metabolite to the reaction or
        // from the reaction to a product metabolite.
        if (role === "reactant") {
            var newLink = {
                identifier: metaboliteIdentifier + "_-_" + reactionIdentifier,
                source: metaboliteIdentifier,
                target: reactionIdentifier
            };
            return [].concat(newLink);
        } else if (role === "product") {
            var newLink = {
                identifier: reactionIdentifier + "_-_" + metaboliteIdentifier,
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
            identifier: metaboliteIdentifier + "_-_" + reactionIdentifier,
            source: metaboliteIdentifier,
            target: reactionIdentifier
        };
        var newReverseLink = {
            identifier: reactionIdentifier + "_-_" + metaboliteIdentifier,
            source: reactionIdentifier,
            target: metaboliteIdentifier
        };
        return [].concat(newForwardLink, newReverseLink);
    }
}

/**
 * Determines which links are new to a collection for a network.
 * @param {Object} parameters Destructured object of parameters.
 * @param {Array<Object<string>>} parameters.currentLinks Records for links
 * currently in the collection for the network.
 * @param {Array<Object<string>>} parameters.links Links for a reaction.
 * @returns {Array<Object<string>>} Collection with new links.
 */
function determineNewLinks({currentLinks, links} = {}) {
    return links.reduce(function (collection, link) {
        var linkSearch = collection.find(function (currentLink) {
                return currentLink.identifier === link.identifier;
            });
        if (!linkSearch) {
            // The link does not already exist in the collection.
            // Include the link in the collection.
            return collection.concat(link);
        } else {
            // The link already exists in the collection.
            return collection;
        }
    }, currentLinks);
}

/**
 * Assembles network elements, nodes and links, across all metabolites that
 * participate in a single reaction.
 * @param {Object} parameters Destructured object of parameters.
 * @param {boolean} parameters.compartmentalization Indicator of whether or not
 * to represent compartmentalization in the network.
 * @param {Array<string>} parameters.replicationMetabolites Identifiers of
 * metabolites for which to replicate nodes in the network.
 * @param {Array<string>} parameters.metaboliteIdentifiers Identifiers of
 * metabolites for which to include nodes in the network.
 * @param {Object} parameters.reaction Information for a reaction.
 * @param {Object<Array<Object>>} parameters.reactionCollection Collection of
 * network elements from reactions.
 * @param {Object<Object>>} parameters.model Information about entities and
 * relations in a metabolic model.
 * @returns {Object<Array<Object>>} Network elements.
 */
function assembleNetworkMetabolites({
                                        compartmentalization,
                                        replicationMetabolites,
                                        metaboliteIdentifiers,
                                        reaction,
                                        reactionCollection,
                                        model
} = {}) {
    // Iterate on metabolites.
    return reaction
        .metabolites
        .reduce(function (metaboliteCollection, reactionMetabolite) {

            // Determine whether or not the metabolite is in the
            // list for inclusion in the network.
            // TODO: Only include the metabolite if it's record from the attributeIndex includes the compartment in which it participates in the reaction.
            // TODO: I suppose I could also determine that information from the record for the reaction in the attributeIndex.
            if (metaboliteIdentifiers.includes(reactionMetabolite.identifier)) {
                // Metabolite is in list for inclusion.
                // Create node for metabolite.
                // Determine identifier for metabolite node.
                var nodeIdentifier = determineMetaboliteNodeIdentifier({
                    metabolite: reactionMetabolite.identifier,
                    compartment: reactionMetabolite.compartment,
                    compartmentalization: compartmentalization,
                    reaction: reaction.identifier,
                    replicationMetabolites: replicationMetabolites
                });
                // Create new metabolite node and include in the collection.
                // A record exists in the model for every metabolite that
                // participates in reactions in the model.
                // Include attributes from general metabolites in the node's
                // attributes.
                var newNodes = createNewMetaboliteNode({
                    identifier: nodeIdentifier,
                    compartment: reactionMetabolite.compartment,
                    compartmentalization: compartmentalization,
                    attributes: Object.assign(
                        {}, model
                            .entities
                            .metabolites[reactionMetabolite.identifier]
                    ),
                    currentNodes: metaboliteCollection.nodes
                });
                // Create links between the reaction and the metabolite.
                var links = createReactionMetaboliteLinks({
                    metaboliteIdentifier: nodeIdentifier,
                    role: reactionMetabolite.role,
                    reactionIdentifier: reaction.identifier,
                    reversibility: reaction.reversibility
                });
                // Include new links in the collection.
                var newLinks = determineNewLinks({
                    currentLinks: metaboliteCollection.links,
                    links: links
                });
                // Restore the collection with new elements of the network.
                return {
                    links: newLinks,
                    nodes: newNodes
                };
            } else {
                // Metabolite is not in list for inclusion.
                // Do not create node for metabolite.
                return metaboliteCollection;
            }
        }, reactionCollection);
}

/**
 * Assembles network elements, nodes and links, across all reactions and
 * metabolites that participate in those reactions.
 * @param {Object} parameters Destructured object of parameters.
 * @param {boolean} parameters.compartmentalization Indicator of whether or not
 * to represent compartmentalization in the network.
 * @param {Array<string>} parameters.replicationMetabolites Identifiers of
 * metabolites for which to replicate nodes in the network.
 * @param {Array<string>} parameters.metaboliteIdentifiers Identifiers of
 * metabolites for which to include nodes in the network.
 * @param {Array<string>} parameters.reactionIdentifiers Identifiers of
 * reactions for which to include nodes in the network.
 * @param {Object<Object>>} parameters.model Information about entities and
 * relations in a metabolic model.
 * @returns {Object<Array<Object>>} Network elements.
 */
function assembleNetworkReactionsMetabolites({
                                      compartmentalization,
                                      replicationMetabolites,
                                      metaboliteIdentifiers,
                                      reactionIdentifiers,
                                      model
} = {}) {
    // Initiate a collection of network elements.
    var initialNetworkElements = {
        links: [],
        nodes: []
    };
    // Iterate on reactions.
    return reactionIdentifiers
        .reduce(function (reactionCollection, reactionIdentifier) {
            // Create new node for the reaction.
            var reaction = model.entities.reactions[reactionIdentifier];
            var newValues = {
                entity: "reaction"
            };
            var reactionNode = Object.assign(reaction, newValues);
            // Create new nodes for the reaction's metabolites.
            // Create new links between the reaction and its metabolites.
            var metaboliteNodesLinks = assembleNetworkMetabolites({
                compartmentalization: compartmentalization,
                replicationMetabolites: replicationMetabolites,
                metaboliteIdentifiers: metaboliteIdentifiers,
                reaction: reaction,
                reactionCollection: reactionCollection,
                model: model
            });
            // Restore the collection of network elements to include new nodes
            // and links.
            return {
                links: metaboliteNodesLinks.links,
                nodes: metaboliteNodesLinks.nodes.concat(reactionNode)
            };
        }, initialNetworkElements);
}

/**
 * Assembles network elements, nodes and links, to represent a portion of a
 * metabolic model with or without consideration of compartmentalization.
 * @param {Object} parameters Destructured object of parameters.
 * @param {boolean} parameters.compartmentalization Indicator of whether or not
 * to represent compartmentalization in the network.
 * @param {Array<string>} parameters.replicationMetabolites Identifiers of
 * metabolites for which to replicate nodes in the network.
 * @param {Array<string>} parameters.metaboliteIdentifiers Identifiers of
 * metabolites for which to include nodes in the network.
 * @param {Array<string>} parameters.reactionIdentifiers Identifiers of
 * reactions for which to include nodes in the network.
 * @param {Object<Object>>} parameters.model Information about entities and
 * relations in a metabolic model.
 * @returns {Object<Array<Object>>} Network elements.
 */
function assembleNetwork({
                             compartmentalization,
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
    return assembleNetworkReactionsMetabolites({
        compartmentalization: compartmentalization,
        replicationMetabolites: replicationMetabolites,
        metaboliteIdentifiers: metaboliteIdentifiers,
        reactionIdentifiers: reactionIdentifiers,
        model: model
    });
}