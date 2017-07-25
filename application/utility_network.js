/**
 * Functionality of utility for collecting nodes for metabolic entities,
 * metabolites and reactions, and links for relations between them.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for external utility.
 */
class Network {
    // Master control of procedure to assemble network elements.
    /**
     * Assembles network elements, nodes and links, to represent metabolic
     * entities, metabolites and reactions, and relations between them.
     * Supports reaction-specific replication of nodes for specific metabolites.
     * Supports definition of network elements with or without consideration of
     * compartmentalization.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.currentMetabolites Identifiers of
     * metabolites for which to include nodes in the network.
     * @param {Array<string>} parameters.currentReactions Attributes of
     * reactions for which to include nodes in the network.
     * @param {Array<string>} parameters.replications Identifiers of metabolites
     * for which to replicate nodes in the network.
     * @param {boolean} parameters.compartmentalization Indicator of whether or
     * not to represent compartmentalization in the network.
     * @param {Object<Object>>} parameters.metabolites Information about
     * metabolites.
     * @param {Object<Object>>} parameters.reactions Information about
     * reactions.
     * @returns {Object<Array<Object>>} Network's elements.
     */
    static assembleNetworkElements({
                                         currentMetabolites,
                                         currentReactions,
                                         replications,
                                         compartmentalization,
                                         metabolites,
                                         reactions,
                                     } = {}) {
        // Determine whether or not to represent compartmentalization in the
        // network.
        // To represent compartmentalization in the network, use distinct nodes
        // for compartmental metabolites.
        // To ignore compartmentalization in the network, use nodes for general
        // metabolites.
        // A representation of the network without compartmentalization might be
        // inconvenient for transport reactions that have the same metabolite as
        // both reactant and product.
        return Network.assembleNetworkReactionsMetabolites({
            currentMetabolites: currentMetabolites,
            currentReactions: currentReactions,
            replications: replications,
            compartmentalization: compartmentalization,
            metabolites: metabolites,
            reactions: reactions
        });
    }
    /**
     * Assembles network elements, nodes and links, across all reactions and
     * metabolites that participate in those reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.currentMetabolites Identifiers of
     * metabolites for which to include nodes in the network.
     * @param {Array<string>} parameters.currentReactions Attributes of
     * reactions for which to include nodes in the network.
     * @param {Array<string>} parameters.replications Identifiers of metabolites
     * for which to replicate nodes in the network.
     * @param {boolean} parameters.compartmentalization Indicator of whether or
     * not to represent compartmentalization in the network.
     * @param {Object<Object>>} parameters.metabolites Information about
     * metabolites.
     * @param {Object<Object>>} parameters.reactions Information about
     * reactions.
     * @returns {Object<Array<Object>>} Network's elements.
     */
    static assembleNetworkReactionsMetabolites({
                                                     currentMetabolites,
                                                     currentReactions,
                                                     replications,
                                                     compartmentalization,
                                                     metabolites,
                                                     reactions,
                                                 } = {}) {
        // Initiate a collection of network elements.
        var initialNetworkElements = {
            links: [],
            nodes: []
        };
        // Iterate on reactions.
        return currentReactions
            .reduce(function (reactionsCollection, currentReaction) {
                // Create new node for the reaction.
                var reaction = reactions[currentReaction.identifier];
                var newValues = {
                    entity: "reaction"
                };
                var reactionNode = Object.assign({}, reaction, newValues);
                // Create new nodes for the reaction's metabolites.
                // Create new links between the reaction and its metabolites.
                var metaboliteNodesLinks = Network.assembleNetworkMetabolites({
                    currentReaction: currentReaction,
                    reaction: reaction,
                    currentMetabolites: currentMetabolites,
                    replications: replications,
                    compartmentalization: compartmentalization,
                    reactionsCollection: reactionsCollection,
                    metabolites: metabolites
                });
                // Restore the collection of network elements to include new
                // nodes and links.
                return {
                    links: metaboliteNodesLinks.links,
                    nodes: metaboliteNodesLinks.nodes.concat(reactionNode)
                };
            }, initialNetworkElements);
    }
    /**
     * Assembles network elements, nodes and links, across all metabolites that
     * participate in a single reaction.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.currentReaction Attributes of reaction
     * for which to include nodes in the network.
     * @param {Object} parameters.reaction Information about a reaction.
     * @param {Array<string>} parameters.currentMetabolites Identifiers of
     * metabolites for which to include nodes in the network.
     * @param {Array<string>} parameters.replications Identifiers of metabolites
     * for which to replicate nodes in the network.
     * @param {boolean} parameters.compartmentalization Indicator of whether or
     * not to represent compartmentalization in the network.
     * @param {Object<Array<Object>>} parameters.reactionsCollection Collection
     * of network elements from reactions.
     * @param {Object<Object>>} parameters.metabolites Information about
     * metabolites.
     * @returns {Object<Array<Object>>} Network elements.
     */
    static assembleNetworkMetabolites({
                                            currentReaction,
                                            reaction,
                                            currentMetabolites,
                                            replications,
                                            compartmentalization,
                                            reactionsCollection,
                                            metabolites
                                        } = {}) {
        // Iterate on metabolites that participate in current reaction.
        return reaction
            .metabolites
            .reduce(function (metabolitesCollection, reactionMetabolite) {
                // Determine whether or not to include the current metabolite in
                // the network.
                // Metabolites must be part of the selection of current
                // metabolites.
                // Metabolites must participate in the current reaction within
                // appropriate compartments.
                var selectionMatch = currentMetabolites
                    .includes(reactionMetabolite.identifier);
                var compartmentMatch = currentReaction
                    .compartments.includes(reactionMetabolite.compartment);
                if (selectionMatch && compartmentMatch) {
                    // Create node for metabolite.
                    // Determine whether or not to replicate nodes for the
                    // metabolite.
                    var replication = replications
                        .includes(reactionMetabolite.identifier);
                    // Determine identifier for metabolite node.
                    var nodeIdentifier = Network
                        .determineMetaboliteNodeIdentifier({
                            metabolite: reactionMetabolite.identifier,
                            compartment: reactionMetabolite.compartment,
                            compartmentalization: compartmentalization,
                            reaction: reaction.identifier,
                            replication: replication
                        });
                    // Create new metabolite node and include in the collection.
                    // Include attributes from general metabolite's record in
                    // the node's attributes.
                    var newNodes = Network.createNewMetaboliteNode({
                        identifier: nodeIdentifier,
                        compartment: reactionMetabolite.compartment,
                        compartmentalization: compartmentalization,
                        replication: replication,
                        attributes: Object.assign(
                            {}, metabolites[reactionMetabolite.identifier]
                        ),
                        currentNodes: metabolitesCollection.nodes
                    });
                    // Create links between the reaction and the metabolite.
                    var links = Network.createReactionMetaboliteLinks({
                        metaboliteIdentifier: nodeIdentifier,
                        role: reactionMetabolite.role,
                        reactionIdentifier: reaction.identifier,
                        reversibility: reaction.reversibility
                    });
                    // Include new links in the collection.
                    var newLinks = Network.determineNewLinks({
                        currentLinks: metabolitesCollection.links,
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
                    return metabolitesCollection;
                }
            }, reactionsCollection);
    }
    /**
     * Determines the identifier for a network node for a metabolite.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.metabolite Identifier of a general metabolite.
     * @param {string} parameters.compartment Identifier of a compartment.
     * @param {boolean} parameters.compartmentalization Indicator of whether or
     * not to represent compartmentalization in the network.
     * @param {string} parameters.reaction Identifier of reaction in which
     * metabolite participates.
     * @param {boolean} parameters.replication Whether or not to replicate nodes
     * for the metabolite.
     * @returns {string} Identifier for a network node for the metabolite.
     */
    static determineMetaboliteNodeIdentifier({
                                                   metabolite,
                                                   compartment,
                                                   compartmentalization,
                                                   reaction,
                                                   replication
                                               } = {}) {
        // Determine base identifier for the metabolite node.
        var baseMetaboliteIdentifier = Network
            .determineMetaboliteNodeBaseIdentifier({
                metabolite: metabolite,
                compartment: compartment,
                compartmentalization: compartmentalization
            });
        // Determine whether or not to create replicate, reaction-specific nodes
        // for the metabolite.
        if (!replication) {
            // Do not replicate nodes for the metabolite.
            var metaboliteNodeIdentifier = baseMetaboliteIdentifier;
        } else {
            // Replicate nodes for the metabolite.
            var metaboliteNodeIdentifier = (
                baseMetaboliteIdentifier + "_" + reaction
            );
        }
        return metaboliteNodeIdentifier;
    }
    /**
     * Determines the identifier for a network node for a metabolite.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.metabolite Identifier of a general metabolite.
     * @param {string} parameters.compartment Identifier of a compartment.
     * @param {boolean} parameters.compartmentalization Indicator of whether or
     * not to represent compartmentalization in the network.
     * @returns {string} Identifier for a network node for the metabolite.
     */
    static determineMetaboliteNodeBaseIdentifier({
                                                     metabolite,
                                                     compartment,
                                                     compartmentalization
    } = {}) {
        if (compartmentalization) {
            return (metabolite + "_" + compartment);
        } else {
            return metabolite;
        }
    }
    /**
     * Creates a new node for a metabolite.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.identifier Identifier of node for metabolite.
     * @param {string} parameters.compartment Identifier of a compartment.
     * @param {boolean} parameters.compartmentalization Indicator of whether or
     * not to represent compartmentalization in the network.
     * @param {boolean} parameters.replication Whether or not to replicate nodes
     * for the metabolite.
     * @param {Object} parameters.attributes Information about a metabolite.
     * @param {Array<Object>} parameters.currentNodes Nodes in current
     * collection for the network.
     * @returns {Array<Object>} New nodes for the network.
     */
    static createNewMetaboliteNode({
                                         identifier,
                                         compartment,
                                         compartmentalization,
                                         replication,
                                         attributes,
                                         currentNodes
                                     } = {}) {
        // Determine whether or not a node already exists for the metabolite.
        var nodeMatch = currentNodes.find(function (node) {
            return node.identifier === identifier;
        });
        if (!nodeMatch) {
            // A node does not already exist for the metabolite.
            // Create new node for the metabolite.
            // Include new attributes for the node.
            if (compartmentalization) {
                var newCompartment = compartment;
            } else {
                var newCompartment = null;
            }
            var newAttributes = {
                compartment: newCompartment,
                entity: "metabolite",
                identifier: identifier,
                reactions: attributes.reactions.slice(),
                replication: replication
            };
            var newNode = Object.assign({}, attributes, newAttributes);
            var newNodes = currentNodes.concat(newNode);
        } else {
            // A node already exists for the metabolite.
            var newNodes = currentNodes;
        }
        return newNodes;
    }
    /**
     * Creates records for links between a pair of a single reaction and a
     * single metabolite that participates in the reaction.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.metaboliteIdentifier Identifier of a single
     * metabolite.
     * @param {string} parameters.role Role, either reactant or product, of the
     * metabolite in the reaction.
     * @param {string} parameters.reactionIdentifier Identifier of a single
     * reaction.
     * @param {boolean} parameters.reversibility Indicator of whether or not the
     * reaction is reversible.
     * @returns {Array<Object<string>>} Records for links between the reaction
     * and the metabolite.
     */
    static createReactionMetaboliteLinks({
                                             metaboliteIdentifier,
                                             role,
                                             reactionIdentifier,
                                             reversibility
    } = {}) {
        // Use a special delimiter "_-_" between identifiers of reactions and
        // metabolites for links in order to avoid ambiguity with nodes for
        // reaction-specific metabolites.
        // Determine whether or not the reaction is reversible.
        if (!reversibility) {
            // Reaction is not reversible.
            // Create directional link from a reactant metabolite to the
            // reaction or from the reaction to a product metabolite.
            if (role === "reactant") {
                var newLink = {
                    identifier: (
                        metaboliteIdentifier + "_-_" + reactionIdentifier
                    ),
                    source: metaboliteIdentifier,
                    target: reactionIdentifier
                };
                return [].concat(newLink);
            } else if (role === "product") {
                var newLink = {
                    identifier: (
                        reactionIdentifier + "_-_" + metaboliteIdentifier
                    ),
                    source: reactionIdentifier,
                    target: metaboliteIdentifier
                };
                return [].concat(newLink);
            }
        } else {
            // Reaction is reversible.
            // Create directional links in both directions between the
            // metabolite and the reaction.
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
    static determineNewLinks({currentLinks, links} = {}) {
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
}