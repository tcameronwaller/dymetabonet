
////////////////////////////////////////////////////////////////////////////////
// Model Assembly
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Creation of Metabolite Nodes

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
            metabolite: determineMetaboliteIdentifier(metabolite.id)
        }
    };
    return metaboliteNode;
}

// TODO: Accommodate assembly for general metabolite nodes that are not
// TODO: compartment-specific.

/**
 * Creates network nodes for all compartmental metabolites from a metabolic
 * model.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @returns {Array<Object>} Nodes for compartmental metabolites.
 */
function createMetaboliteNodes(metabolites) {
    // Confirm that all compartmental metabolites participate in reactions.
    // For each metabolite, make sure that there is at least 1 reaction in which
    // it participates. Use a filter function.
    return metabolites.map(createCompartmentalMetaboliteNode);
}

////////////////////////////////////////////////////////////////////////////////
// Creation of Reaction Nodes

// TODO: Maybe introduce an option flag and an if clause to create a reaction
// TODO: node appropriate for general, non-compartment-specific metabolites.







/**
 * Checks a single reaction from a metabolic model.
 * @param {Object} reaction Information for a reaction.
 */
function checkReaction(reaction) {
    // 1. Confirm that no reactions involving multiple compartments in total are
    // reversible.
    console.log("testing in checkReaction")
    if (
        (
            reaction.lower_bound != -1000 &&
            reaction.lower_bound != 0 &&
            reaction.lower_bound != 1000
        ) && (
            reaction.upper_bound != -1000 &&
            reaction.upper_bound != 0 &&
            reaction.upper_bound != 1000
        )
    ) {
        console.log(reaction.id);
    }
    //if (reaction.id === "10FTHFtl") {
    //    console.log(reaction);
    //}

    // 2. Confirm that lower_bound and upper_bound properties only have values
    // of 0 or 1000.

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
            lower_bound: reaction.lower_bound,
            metabolites: Object.assign({}, reaction.metabolites),
            name: reaction.name,
            subsystem: reaction.subsystem,
            upper_bound: reaction.upper_bound
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
    // Test reactions.
    console.log("tests...");
    reactions.map(checkReaction);
    // Create nodes for reactions.
    //return reactions.map(createReactionNode);
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
            .reduce(function (accumulator, currentValue) {
                return accumulator.concat(currentValue);
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
        .reduce(function (accumulator, currentValue) {
            return accumulator.concat(currentValue);
        }, []);
}

////////////////////////////////////////////////////////////////////////////////
// Assemble relational tables for sets

// TODO: Function assembleSets should return an object with key-value pairs for
// TODO: each relational table.

// TODO: Function assembleSets() needs to accommodate requests for
// TODO: compartment-specific metabolite nodes and non-compartment-specific
// TODO: metabolite nodes.

/**
 * Assembles relational tables for information about sets of nodes of a
 * metabolic model.
 * @param {Object} model Information of a metabolic model from systems biology.
 * @returns {Object} Information about sets of nodes.
 */
function assembleSets(model) {}

////////////////////////////////////////////////////////////////////////////////
// Assemble of Network

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
    var network = {
        network: cytoscape({
            elements: [].concat(
                //createMetaboliteNodes(model.metabolites),
                createReactionNodes(model.reactions),
                createReactionLinks(model.reactions)
            )
        })
    };
    return network;
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
 * @param {Object<string>} model.genes Information for genes in the model.
 * @param {Object} model.metabolites Information for compartment-specific
 * metabolites in the model.
 * @param {Object} model.reactions Information for reactions in the model.
 * @returns {Object} An object with information in both relational and graph or
 * network structures.
 */
function assembleModel(modelInitial) {
    var model = Object.assign({},
        //assembleSets(modelInitial),
        assembleNetwork(modelInitial)
    );
    exploreNetwork(model.network);
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
