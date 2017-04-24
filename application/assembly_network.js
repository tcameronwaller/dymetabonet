
////////////////////////////////////////////////////////////////////////////////
// Creation of Metabolite Nodes

/**
 * Creates a record for a network node for a single compartmental metabolite
 * from a metabolic model.
 * @param {Object} metabolite Information for a compartmental metabolite.
 * @returns {Object} Record for a node for a compartmental metabolite.
 */
function createMetaboliteNodeRecord(metabolite) {
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
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @param {Array<Object>} reactions Information for all reactions of a
 * metabolic model.
 * @returns {Object} Records for nodes for compartmental metabolites.
 */
function createMetaboliteNodeRecords(metabolites, reactions) {
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
// Creation of Reaction Links

/**
 * Creates a record for a network link or edge between specific source and
 * target nodes.
 * @param {string} sourceIdentifier Unique identifier of source node.
 * @param {string} targetIdentifier Unique identifier of target node.
 * @returns {Object} Record for a link between source and target nodes.
 */
function createReactionLinkRecord(sourceIdentifier, targetIdentifier) {
    return {
        [determineLinkIdentifier(sourceIdentifier, targetIdentifier)]: {
            id: determineLinkIdentifier(sourceIdentifier, targetIdentifier),
            source: sourceIdentifier,
            target: targetIdentifier
        }
    };
}

/**
 * Controls the creation of records for network links for a single reaction from
 * a metabolic model.
 * @param {Object} reaction Information for a reaction.
 * @returns {Object} Records for links for a reaction.
 */
function controlReactionLinks(reaction) {
    // Determine whether or not the reaction is reversible.
    if (!determineReversibility(reaction)) {
        // Reaction is not reversible.
        // Create directional links between reactant metabolites and the
        // reaction and between the reaction and product metabolites.
        var reactantLinks = filterReactionMetabolitesByRole(
            reaction, "reactant"
        ).reduce(function (collection, metaboliteIdentifier) {
            return Object.assign(
                {}, collection, createReactionLinkRecord(
                    metaboliteIdentifier, reaction.id
                )
            );
        }, {});
        var productLinks = filterReactionMetabolitesByRole(
            reaction, "product"
        ).reduce(function (collection, metaboliteIdentifier) {
            return Object.assign(
                {}, collection, createReactionLinkRecord(
                    reaction.id, metaboliteIdentifier
                )
            );
        }, {});
        return Object.assign({}, reactantLinks, productLinks);
    } else if (determineReversibility(reaction)) {
        // Reaction is reversible.
        // Create directional links in both directions between the metabolites
        // and the reaction.
        return Object.keys(reaction.metabolites)
            .reduce(function (collection, metaboliteIdentifier) {
                return Object.assign(
                    {},
                    collection,
                    createReactionLinkRecord(metaboliteIdentifier, reaction.id),
                    createReactionLinkRecord(reaction.id, metaboliteIdentifier)
                );
            }, {});
    }
}

/**
 * Creates records for network links for all reactions from a metabolic model.
 * @param {Array<Object>} reactions Information for all reactions of a metabolic
 * model.
 * @returns {Object} Records for links for reactions.
 */
function createReactionLinkRecords(reactions) {
    return reactions
        .reduce(function (collection, reaction) {
            return Object.assign(
                {}, collection, controlReactionLinks(reaction)
            );
        }, {});
}

////////////////////////////////////////////////////////////////////////////////
// Assembly of Network Elements

/**
 * Assembles network elements, nodes and links, to represent information of a
 * metabolic model.
 * @param {Object} model Information of a metabolic model from systems biology.
 * @param {Object} sets Information about entities in a metabolic model.
 * @returns {Object} Network elements.
 */
function assembleNetwork(model, sets) {
    return {
        network: {
            links: createReactionLinkRecords(model.reactions),
            nodes: {
                metabolites: createMetaboliteNodeRecords(
                    model.metabolites, model.reactions
                ),
                reactions: createReactionNodeRecords(
                    model.reactions,
                    model.metabolites,
                    model.genes,
                    sets.processes
                )
            }
        }
    };
}

////////////////////////////////////////////////////////////////////////////////
// Initialization of an Instance of a CytoScape.js Network

/**
 * Translates a record for a network node to match CytoScape.js.
 * @param {Object} parameters Destructured object of parameters.
 * @param {string} parameters.identifier Unique identifier for a network node.
 * @param {string} parameters.type Metabolite or reaction type of node.
 * @param {Object} parameters.model Information about entities and relations in
 * a metabolic model.
 * @returns {Object} A node that matches CytoScape.js.
 */
function translateCytoScapeNode({identifier, type, model} = {}) {
    var data = model.network.nodes[type][identifier];
    return {
        classes: data.type,
        group: "nodes",
        data: data
    };
}

/**
 * Translates records for network nodes to match CytoScape.js.
 * @param {Object<string, Array<string>>} collection Identifiers of reactions
 * and metabolites in the query's current collection.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Array<Object>} Nodes that match CytoScape.js.
 */
function translateCytoScapeNodes(collection, model) {
    var metaboliteNodes = collection
        .metabolites
        .map(function (identifier) {
            return translateCytoScapeNode({
                identifier: identifier, type: "metabolites", model: model
            });
        });
    var reactionNodes = collection
        .reactions
        .map(function (identifier) {
            return translateCytoScapeNode({
                identifier: identifier, type: "reactions", model: model
            });
        });
    return metaboliteNodes.concat(reactionNodes);
}

/**
 * Collects links between a collection of nodes in a network.
 * @param {Object<string, Array<string>>} collection Identifiers of reactions
 * and metabolites in the query's current collection.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Array<string>} Unique identifiers for network links.
 */
function collectLinksBetweenNodes(collection, model) {
    // Collect links if both their source and target nodes are in the
    // collection.
    var links = Object.values(model.network.links)
        .filter(function (link) {
            return (
                (
                    collection.metabolites.includes(link.source) ||
                    collection.reactions.includes(link.source)
                ) &&
                (
                    collection.metabolites.includes(link.target) ||
                    collection.reactions.includes(link.target)
                )
            );
        });
    return collectValuesFromObjects(links, "id");
}

/**
 * Translates a record for a network link to match CytoScape.js.
 * @param {string} identifier Unique identifier for a network link.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Object} A link that matches CytoScape.js.
 */
function translateCytoScapeLink(identifier, model) {
    return {
        group: "edges",
        data: model.network.links[identifier]
    };
}

/**
 * Translates records for network links to match CytoScape.js.
 * @param {Array<string>} identifiers Unique identifiers for network links.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Array<Object>} Links that match CytoScape.js.
 */
function translateCytoScapeLinks(identifiers, model) {
    return identifiers.map(function (identifier) {
        return translateCytoScapeLink(identifier, model);
    });
}

/**
 * Collects nodes and links in proper format to initialize a CytoScape.js
 * network.
 * @param {Object<string, Array<string>>} collection Identifiers of reactions
 * and metabolites in the query's current collection.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Object} Nodes and links for a core network in CytoScape.js.
 */
function collectElementsForCytoScapeNetwork(collection, model) {
    return {
        edges: translateCytoScapeLinks(
            collectLinksBetweenNodes(collection, model), model
        ),
        nodes: translateCytoScapeNodes(collection, model)
    }
}

// TODO: I think this function is now obsolete.
/**
 * Assembles a CytoScape.js network and appends it to a model.
 * @param {Object} modelPremature Information of a metabolic model.
 * @returns {Object} An object with a key of "network" and a value of a
 * CytoScape.js network.
 */
function initializeNetwork(modelPremature) {
    return Object.assign({}, modelPremature, {
        networkCytoScape: cytoscape({elements: modelPremature.network})
    });
}

