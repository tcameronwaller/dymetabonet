
////////////////////////////////////////////////////////////////////////////////
// Creation of Metabolite Nodes

/**
 * Checks to ensure that a metabolite participates in at least one reaction in
 * the metabolic model.
 * @param {string} metaboliteIdentifier Identifier for a metabolite.
 * @param {Array<Object>} reactions Information for all reactions of a metabolic
 * model.
 * @returns {boolean} Whether or not the metabolite participates in a reaction.
 */
function checkMetaboliteReactions(metaboliteIdentifier, reactions) {
    // Confirm that metabolite participates in at least one reaction.
    if (countCompartmentalMetaboliteReactions(
            metaboliteIdentifier, reactions
        ) >= 1) {
        return true;
    } else {
        console.log(
            "Check Metabolites: " + metabolite.id +
            " failed reaction check."
        );
        return false;
    }
}

/**
 * Checks a single metabolite from a metabolic model.
 * @param {Object} metabolite Information for a metabolite.
 * @param {Array<Object>} reactions Information for all reactions of a metabolic
 * model.
 */
function checkMetabolite(metaboliteIdentifier, reactions) {
    checkMetaboliteReactions(metaboliteIdentifier, reactions);
}

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
// Creation of Reaction Nodes

/**
 * Checks bounds values of a single reaction from a metabolic model.
 * @param {Object} reaction Information for a reaction.
 * @returns {boolean} Whether or not the reaction's bounds match expectations.
 */
function checkReactionBoundsValues(reaction) {
    // Confirm that lower_bound and upper_bound properties only have values
    // of -1000, 0, or 1000.
    // According to this situation, the bounds primarily only signify the
    // direction of the reaction.
    if (
        (
            reaction.lower_bound === -1000 ||
            reaction.lower_bound === 0 ||
            reaction.lower_bound === 1000
        ) && (
            reaction.upper_bound === -1000 ||
            reaction.upper_bound === 0 ||
            reaction.upper_bound === 1000
        )
    ) {
        return true;
    } else {
        console.log(
            "Check Reactions: " + reaction.id + " failed bounds values check."
        );
        return false;
    }
}

/**
 * Checks bounds ranges of a single reaction from a metabolic model.
 * @param {Object} reaction Information for a reaction.
 * @returns {boolean} Whether or not the reaction's bounds match expectations.
 */
function checkReactionBoundsRanges(reaction) {
    // Confirm that lower_bound values are less than or equal to zero and
    // upper_bound values are greater than or equal to zero.
    if (
        (reaction.lower_bound <= 0) && (reaction.upper_bound >= 0)
    ) {
        return true;
    } else {
        console.log(
            "Check Reactions: " + reaction.id + " failed bounds ranges check."
        );
        return false;
    }
}

/**
 * Checks bounds directionality of a single reaction from a metabolic model.
 * @param {Object} reaction Information for a reaction.
 * @returns {boolean} Whether or not the reaction's bounds match expectations.
 */
function checkReactionBoundsDirection(reaction) {
    // Confirm from lower_bound and upper_bound properties the primary direction
    // of the reaction.
    // Confirm that upper_bound is never zero.
    // That situation might imply that the reaction proceeds only in the reverse
    // direction.
    // Confirm that both lower_bound and upper_bound do not have values of
    // zero simultaneously.
    // That situation would imply that the reaction that proceeds in neither
    // direction.
    if (
        ((reaction.lower_bound < 0) && (reaction.upper_bound > 0)) ||
        ((reaction.lower_bound === 0) && (reaction.upper_bound > 0))
    ) {
        return true;
    } else {
        console.log(
            "Check Reactions: " + reaction.id +
            " failed bounds directionality check."
        );
        return false;
    }
}

/**
 * Checks to ensure that a reaction has annotations for metabolites and that
 * these metabolties have corresponding records in the metabolic model.
 * @param {Object} reaction Information for a reaction.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @returns {boolean} Whether or not the reaction's metabolites have records.
 */
function checkReactionMetabolites(reaction, metabolites) {
    // Confirm that a reaction's metabolites have corresponding records.
    if (
        (Object.keys(reaction.metabolites).length >= 1) &&
        (Object.keys(reaction.metabolites)
            .every(function (metaboliteIdentifier) {
                return metabolites.find(function (metabolite) {
                    return metabolite.id === metaboliteIdentifier;
                }) != undefined;
            }))
    ) {
        return true;
    } else {
        console.log(
            "Check Reactions: " + reaction.id +
            " failed metabolite check."
        );
        return false;
    }
}

/**
 * Checks to ensure that a reaction's genes have corresponding records in the
 * metabolic model.
 * @param {Object} reaction Information for a reaction.
 * @param {Array<Object>} genes Information for all genes of a metabolic model.
 * @returns {boolean} Whether or not the reaction's genes have records.
 */
function checkReactionGenes(reaction, genes) {
    // Confirm that a reaction's genes have corresponding records.
    if (
        collectUniqueElements(
            extractGenesFromRule(reaction.gene_reaction_rule)
        )
            .every(function (geneIdentifier) {
                return genes.find(function (gene) {
                    return gene.id === geneIdentifier;
                }) != undefined;
            })
    ) {
        return true;
    } else {
        console.log(
            "Check Reactions: " + reaction.id +
            " failed gene check."
        );
        return false;
    }
}

/**
 * Checks to confirm that a reaction has an annotation for its metabolic
 * subsystem or process.
 * @param {Object} reaction Information for a reaction.
 * @returns {boolean} Whether or not the reaction has an annotation for its
 * metabolic process.
 */
function checkReactionProcess(reaction) {
    // Confirm that reaction has an annotation for a metabolic process.
    if (
        reaction.subsystem != undefined
    ) {
        return true;
    } else {
        console.log(
            "Check Reactions: " + reaction.id + " failed process check."
        );
        return false;
    }
}

/**
 * Checks a single reaction from a metabolic model.
 * @param {Object} reaction Information for a reaction.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @param {Array<Object>} genes Information for all genes of a metabolic model.
 */
function checkReaction(reaction, metabolites, genes) {
    checkReactionBoundsValues(reaction);
    checkReactionBoundsRanges(reaction);
    checkReactionBoundsDirection(reaction);
    checkReactionMetabolites(reaction, metabolites);
    checkReactionGenes(reaction, genes);
    //checkReactionProcess(reaction);
}

/**
 * Determines the identifier for a reaction's process.
 * @param {Object} reaction Information for a reaction.
 * @param {Object} processes Information about processes in a metabolic model.
 * @returns {string} Identifier for the reaction's process.
 */
function determineReactionProcessIdentifier(reaction, processes) {
    if (reaction.subsystem != undefined) {
        return Object.keys(processes).filter(function (key) {
            return processes[key].name === reaction.subsystem;
        })[0];
    } else {
        return undefined;
    }
}

/**
 * Creates a record for a network node for a single reaction from a metabolic
 * model.
 * @param {Object} reaction Information for a reaction.
 * @param {Object} processes Information about processes in a metabolic model.
 * @returns {Object} Record for a node for a reaction.
 */
function createReactionNodeRecord(reaction, processes) {
    return {
        [reaction.id]: {
            gene_reaction_rule: reaction.gene_reaction_rule,
            id: reaction.id,
            name: reaction.name,
            process: determineReactionProcessIdentifier(reaction, processes),
            products: filterReactionMetabolitesByRole(reaction, "product"),
            reactants: filterReactionMetabolitesByRole(reaction, "reactant"),
            reversibility: determineReversibility(reaction),
            type: "reaction"
        }
    };
}

/**
 * Creates records for network nodes for all reactions from a metabolic model.
 * @param {Array<Object>} reactions Information for all reactions of a metabolic
 * model.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @param {Array<Object>} genes Information for all genes of a metabolic model.
 * @param {Object} processes Information about processes in a metabolic model.
 * @returns {Object} Records for nodes for reactions.
 */
function createReactionNodeRecords(reactions, metabolites, genes, processes) {
    // Check reactions.
    reactions.forEach(function (reaction) {
        checkReaction(reaction, metabolites, genes);
    });
    // Create nodes for reactions.
    return reactions.reduce(function (collection, reaction) {
        return Object.assign(
            {}, collection, createReactionNodeRecord(reaction, processes)
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

