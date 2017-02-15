////////////////////////////////////////////////////////////////////////////////
// Assembly of Network for Model
////////////////////////////////////////////////////////////////////////////////


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
 * Creates a network node for a single compartmental metabolite from a metabolic
 * model.
 * @param {Object} metabolite Information for a compartmental metabolite.
 * @returns {Object} Node for a compartmental metabolite.
 */
function createCompartmentalMetaboliteNode(metabolite) {
    var metaboliteNode = {
        group: "nodes",
        classes: "metabolite",
        data: {
            compartment: metabolite.compartment,
            id: metabolite.id,
            metabolite: extractMetaboliteIdentifier(metabolite.id)
        }
    };
    return metaboliteNode;
}

/**
 * Creates network nodes for all compartmental metabolites from a metabolic
 * model.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @param {Array<Object>} reactions Information for all reactions of a
 * metabolic model.
 * @returns {Array<Object>} Nodes for compartmental metabolites.
 */
function createMetaboliteNodes(metabolites, reactions) {
    // Confirm that all compartmental metabolites participate in reactions.
    // For each metabolite, make sure that there is at least 1 reaction in which
    // it participates. Use a filter function.
    // Check metabolites.
    metabolites.map(function (metabolite) {
        return checkMetabolite(metabolite.id, reactions);
    });
    // Create nodes for metabolites.
    return metabolites.map(createCompartmentalMetaboliteNode);
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
        extractGeneIdentifiers(reaction.gene_reaction_rule)
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
 * Creates a network node for a single reaction from a metabolic model.
 * @param {Object} reaction Information for a reaction.
 * @returns {Object} Node for a reaction.
 */
function createReactionNode(reaction) {
    var reactionNode = {
        group: "nodes",
        classes: "reaction",
        data: {
            gene_reaction_rule: reaction.gene_reaction_rule,
            id: reaction.id,
            name: reaction.name,
            products: filterReactionMetabolitesByRole(reaction, "product"),
            reactants: filterReactionMetabolitesByRole(reaction, "reactant"),
            reversibility: determineReversibility(reaction),
            subsystem: reaction.subsystem
        }
    };
    return reactionNode;
}

/**
 * Creates network nodes for all reactions from a metabolic model.
 * @param {Array<Object>} reactions Information for all reactions of a metabolic
 * model.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @param {Array<Object>} genes Information for all genes of a metabolic model.
 * @returns {Array<Object>} Nodes for reactions.
 */
function createReactionNodes(reactions, metabolites, genes) {
    // Check reactions.
    reactions.map(function (reaction) {
        return checkReaction(reaction, metabolites, genes);
    });
    // Create nodes for reactions.
    return reactions.map(createReactionNode);
}

////////////////////////////////////////////////////////////////////////////////
// Creation of Reaction Links

/**
 * Creates a link or edge between specific source and target nodes.
 * @param {string} sourceIdentifier Unique identifier of source node.
 * @param {string} targetIdentifier Unique identifier of target node.
 * @returns {Object} Link between source and target nodes.
 */
function createReactionLink(sourceIdentifier, targetIdentifier) {
    var reactionLink = {
        group: "edges",
        data: {
            id: determineLinkIdentifier(
                sourceIdentifier, targetIdentifier
            ),
            source: sourceIdentifier,
            target: targetIdentifier
        }
    };
    return reactionLink;
}

/**
 * Controls the creation of network links for a single reaction from a metabolic
 * model.
 * @param {Object} reaction Information for a reaction.
 * @returns {Array<Object>} Links for a reaction.
 */
function controlReactionLinks(reaction) {
    // Determine whether or not the reaction is reversible.
    if (!determineReversibility(reaction)) {
        // Reaction is not reversible.
        // Create directional links between reactant metabolites and the
        // reaction and between the reaction and product metabolites.
        var reactantLinks = filterReactionMetabolitesByRole(
            reaction, "reactant"
        ).map(function (metaboliteIdentifier) {
            return createReactionLink(metaboliteIdentifier, reaction.id);
        });
        var productLinks = filterReactionMetabolitesByRole(
            reaction, "product"
        ).map(function (metaboliteIdentifier) {
            return createReactionLink(reaction.id, metaboliteIdentifier);
        });
        return [].concat(reactantLinks, productLinks);
    } else if (determineReversibility(reaction)) {
        // Reaction is reversible.
        // Create directional links in both directions between the metabolites
        // and the reaction.
        return Object.keys(reaction.metabolites)
            .map(function (metaboliteIdentifier) {
                return [].concat(
                    createReactionLink(metaboliteIdentifier, reaction.id),
                    createReactionLink(reaction.id, metaboliteIdentifier)
                );
            })
            .reduce(function (accumulator, value) {
                return accumulator.concat(value);
            }, []);
    }
}

/**
 * Creates network links for all reactions from a metabolic model.
 * @param {Array<Object>} reactions Information for all reactions of a metabolic
 * model.
 * @returns {Array<Object>} Links for reactions.
 */
function createReactionLinks(reactions) {
    return reactions
        .map(controlReactionLinks)
        .reduce(function (accumulator, value) {
            return accumulator.concat(value);
        }, []);
}

////////////////////////////////////////////////////////////////////////////////
// Assembly of Network

/**
 * Assembles network elements, nodes and links, to represent information of a
 * metabolic model.
 * @param {Object} model Information of a metabolic model from systems biology.
 * @returns {Object} Network elements.
 */
function assembleNetwork(model) {
    return {
        network_elements: {
            edges: createReactionLinks(model.reactions),
            nodes: [].concat(
                createMetaboliteNodes(model.metabolites, model.reactions),
                createReactionNodes(
                    model.reactions, model.metabolites, model.genes
                )
            )
        }
    };
}

/**
 * Assembles a CytoScape.js network and appends it to a model.
 * @param {Object} modelPremature Information of a metabolic model.
 * @returns {Object} An object with a key of "network" and a value of a
 * CytoScape.js network.
 */
function initializeNetwork(modelPremature) {
    return Object.assign({}, modelPremature, {
        network: cytoscape({elements: modelPremature.network_elements})
    });
}

