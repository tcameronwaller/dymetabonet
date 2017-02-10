
////////////////////////////////////////////////////////////////////////////////
// Model Assembly
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Creation of Metabolite Nodes

// TODO: Accommodate assembly for general metabolite nodes that are not
// TODO: compartment-specific.

/**
 * Checks to ensure that a metabolite participates in at least one reaction in
 * the metabolic model.
 * @param {Array<Object>} reactions Information for reactions in the model.
 * @param {Object} metabolite Information for a metabolite.
 * @returns {boolean} Whether or not the metabolite participates in a reaction.
 */
function checkMetaboliteReaction(reactions, metabolite) {
    // Confirm that metabolite participates in at least one reaction.
    if (countCompartmentalMetaboliteReactions(reactions, metabolite) >= 1) {
        return true;
    } else {
        console.log(
            "Check Metabolites: " + metabolite.id +
            " failed participation check."
        );
        return false;
    }
}

/**
 * Checks a single metabolite from a metabolic model.
 * @param {Object} metabolite Information for a metabolite.
 */
function checkMetabolite(reactions, metabolite) {
    checkMetaboliteReaction(reactions, metabolite);
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
        class: "metabolite",
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
 * @returns {Array<Object>} Nodes for compartmental metabolites.
 */
function createMetaboliteNodes(reactions, metabolites) {
    // Confirm that all compartmental metabolites participate in reactions.
    // For each metabolite, make sure that there is at least 1 reaction in which
    // it participates. Use a filter function.
    // Check metabolites.
    metabolites.map(function (metabolite) {
        return checkMetabolite(reactions, metabolite);
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
 * Checks a single reaction from a metabolic model.
 * @param {Object} reaction Information for a reaction.
 */
function checkReaction(reaction) {
    checkReactionBoundsValues(reaction);
    checkReactionBoundsRanges(reaction);
    checkReactionBoundsDirection(reaction);
}

/**
 * Creates a network node for a single reaction from a metabolic model.
 * @param {Object} reaction Information for a reaction.
 * @returns {Object} Node for a reaction.
 */
function createReactionNode(reaction) {
    var reactionNode = {
        group: "nodes",
        class: "reaction",
        data: {
            gene_reaction_rule: reaction.gene_reaction_rule,
            id: reaction.id,
            name: reaction.name,
            products: filterReactionMetabolitesByRole(reaction, "product"),
            reactants: filterReactionMetabolitesByRole(reaction, "reactant"),
            reversibility: determineReversibility(reaction),
            subsystem: reaction.subsystem,
        }
    };
    return reactionNode;
}

/**
 * Creates network nodes for all reactions from a metabolic model.
 * @param {Array<Object>} reactions Information for all reactions of a metabolic
 * model.
 * @returns {Array<Object>} Nodes for reactions.
 */
function createReactionNodes(reactions) {
    // Check reactions.
    reactions.map(checkReaction);
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
// Creation of records for compartments

/**
 * Creates a record for a single compartment from a metabolic model.
 * @param {Object} compartments Information for all compartments of a metabolic
 * model.
 * @param {string} compartmentIdentifier Unique identifier of a compartment.
 * @returns {Object} Record for a compartment.
 */
function createCompartmentRecord(compartments, compartmentIdentifier) {
    return {
        id: compartmentIdentifier,
        name: compartments[compartmentIdentifier]
    };
}

/**
 * Creates records for all compartments from a metabolic model.
 * @param {Object} compartments Information for all compartments of a metabolic
 * model.
 * @returns {Array<Object>} Records for compartments.
 */
function createCompartmentRecords(compartments) {
    // Create records for compartments.
    return Object.keys(compartments).map(function (compartmentIdentifier) {
        return createCompartmentRecord(compartments, compartmentIdentifier);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Creation of records for metabolites

// TODO: I need to figure out how to handle the compartmental metabolites.
// TODO: I need to make sure that all compartmental metabolites have the same common information.
// TODO: Then I need to make a unique record for each metabolite.


// TODO: This strategy will not work.
// TODO: Rather than driving the iteration by map, I will need reduce.


/**
 * Checks a single metabolite from a metabolic model to ensure that all
 * compartmental records for a metabolite share identical properties.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @param {Object} metaboliteIdentifier Unique identifier of general metabolite.
 * @returns {boolean} Whether or not all compartmental records for the
 * metabolite share identical properties.
 */
function checkMetaboliteSet(metabolites, metaboliteIdentifier) {
    // Collect all compartmental versions of the metabolite.
    var setMetabolites = filterCompartmentalMetabolitesByMetabolite(
        metabolites, metaboliteIdentifier
    );
    // Confirm that all compartmental records have identical values for relevant
    // properties.
    ["charge", "formula", "name"].map(function (property) {
        if (collectUniqueElements(collectValuesFromObjects(setMetabolites, property)).length <= 1) {
            return true;
        } else {
            console.log(
                "Check Metabolite Sets: " + metaboliteIdentifier +
                " failed common properties check."
            );
            console.log(setMetabolites);
            return false;
        }
    });
}


// In a check function, confirm that metabolite information is identical for all compartmental versions of the same metabolite.
// Then iterate over compartmental metabolites.
// Create a record for a metabolite the first time you encounter it.
// Use .includes() on an array of id's to check if you've already created a record for each successive metabolite.
// I'll probably need a .reduce() function to accumulate the unique metabolite records.

// checkMetaboliteSet
// 1. obtain a compartmental metabolite
// 2. obtain the general metabolite identifier
// 3. determine if a record already exists for the metabolite
// 4. if a record does not exist, continue
// 5. access all compartmental entries for the general metabolite
// 6. check that information for all compartmental entries is consistent


/**
 * Creates a record for a single metabolite from a metabolic model.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @param {Object} metabolite Information for a metabolite.
 * @returns {Object} Record for a metabolite.
 */
function createMetaboliteRecord(metabolite) {
    return {
        charge: metabolite.charge,
        formula: metabolite.formula,
        id: extractMetaboliteIdentifier(metabolite.id),
        name: metabolite.name
    };
}

/**
 * Creates records for all metabolites from a metabolic model.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @returns {Array<Object>} Records for metabolites.
 */
function createMetaboliteRecords(metabolites) {
    // Check metabolites.
    // Create records for metabolites.
    console.log("testing collect unique elements");
    console.log(testCollectUniqueElements());
    return metabolites.reduce(function (accumulator, metabolite) {
        //console.log(value.id);
        // Determine if a record already exists for the metabolite.
        if (
            //accumulator.filter(function (record) {
            //    return extractMetaboliteIdentifier(record.id) === extractMetaboliteIdentifier(value.id);
            //}
            //).length === 0
            accumulator.find(function (record) {
                return record.id === extractMetaboliteIdentifier(metabolite.id);
            }) === undefined
        ) {
            // Confirm that information for a general metabolite is consistent
            // in all of its compartmental records in the model.
            checkMetaboliteSet(metabolites, extractMetaboliteIdentifier(metabolite.id));
            // Create record for the metabolite.
            return accumulator.concat(createMetaboliteRecord(metabolite));
        } else {
            return accumulator;
        }
    }, []);
}


////////////////////////////////////////////////////////////////////////////////
// Assembly of relational tables for sets

// TODO: Function assembleSets should return an object with key-value pairs for
// TODO: each relational table.

// TODO: Function assembleSets() needs to accommodate requests for
// TODO: compartment-specific metabolite nodes and non-compartment-specific
// TODO: metabolite nodes.

/**
 * Creates relational tables for information about sets of nodes of a
 * metabolic model.
 * @param {Object} model Information of a metabolic model from systems biology.
 * @returns {Object} Information about sets of nodes.
 */
function assembleSets(model) {
    return {
        sets: {
            compartments: createCompartmentRecords(model.compartments),
            metabolites: createMetaboliteRecords(model.metabolites)//,
            //subsystems: createSubsystemRecords(model.reactions)
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// Assembly of Network

// TODO: Function assembleNetwork() needs to accommodate requests for
// TODO: compartment-specific metabolite nodes and non-compartment-specific
// TODO: metabolite nodes.

/**
 * Assembles a CytoScape.js network from information of a metabolic model.
 * @param {Object} model Information of a metabolic model from systems biology.
 * @returns {Object} An object with a key of "network" and a value of a
 * CytoScape.js network.
 */
function assembleNetwork(model) {
    return {
        network: cytoscape({
            elements: [].concat(
                createMetaboliteNodes(model.reactions, model.metabolites),
                createReactionNodes(model.reactions),
                createReactionLinks(model.reactions)
            )
        })
    };
}

////////////////////////////////////////////////////////////////////////////////
// Assembly of Model

/**
 * Assembles a practical and concise model to represent information of a
 * metabolic model.
 * @param {Object} model Information of a metabolic model from systems biology,
 * conversion from SBML to JSON formats by COBRApy and libSBML.
 * @param {Object<string>} model.compartments Abbreviations and names of
 * compartments in the model.
 * @param {Array<Object<string>>} model.genes Information for genes in the model.
 * @param {Array<Object>} model.metabolites Information for compartment-specific
 * metabolites in the model.
 * @param {Array<Object>} model.reactions Information for reactions in the model.
 * @returns {Object} An object with information in both relational and graph or
 * network structures.
 */
function assembleModel(modelInitial) {
    var model = Object.assign({},
        assembleSets(modelInitial)//,
        //assembleNetwork(modelInitial)
    );
    console.log(model.sets);
    //exploreNetwork(model.network);
    //var modelJSON = model.json();
    //downloadJSON(modelJSON, "model.json");
    //return model;
}

/** Temporary */
function assembleModel2(modelInitial) {
    var model = Object.assign({},
        //assembleSets(modelInitial),
        assembleNetwork(modelInitial)
    );
    exploreNetwork(model.network);
    //var modelJSON = model.json();
    //downloadJSON(modelJSON, "model.json");
    //return model;
}

////////////////////////////////////////////////////////////////////////////////
// Select nodes and links from network

// Select nodes and links by proximity degree 1 to a node

// Select nodes and links by proximity degree >1 to a node
// (select proximity degree 1 to every node in successive collections)

////////////////////////////////////////////////////////////////////////////////
// Utility

function downloadJSON(object, name) {
    var objectJSON = JSON.stringify(object);
    var blob = new Blob([objectJSON], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var documentReference = document.createElement("a");
    documentReference.setAttribute("href", url);
    documentReference.setAttribute("download", name);
    documentReference.click();
}

function exploreNetwork(network) {

    console.log("Metabolite Nodes");
    console.log(network.nodes(".metabolite").cy());
    console.log(network.filter(".metabolite").cy());
    //console.log(network.metabolite);
    //console.log(network.elements.metabolite);

    // collection.cy() returns core

    console.log(network.getElementById("10FTHFtl").data());
    //var pyruvateNeighborhood = network
    //    .getElementById("pyr_c")
    //    .closedNeighborhood();
    //console.log(pyruvateNeighborhood);
    //console.log(pyruvateNeighborhood.jsons());
    //var subNetwork = cytoscape({
    //    container: document.getElementById("exploration"),
    //    elements: pyruvateNeighborhood.jsons(),
    //    layout: {
    //        name: "concentric"
    //    }
    //})
    //console.log(subNetwork);

    //container: document.getElementById("exploration"),


    //console.log(network.nodes())
    //var pyruvateNode = network.elements.filter("node[id = 'pyr_c']");
    //var pyruvateNeighborhood = pyruvateNode.closedNeighborhood();
    //console.log(pyruvateNeighborhood);

    //return network;
    // I think that I will need to collect reaction nodes, metabolite nodes, and
    // links using concat when I create the network in CytoScapeJS.
}
