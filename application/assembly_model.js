////////////////////////////////////////////////////////////////////////////////
// Assembly of Model
////////////////////////////////////////////////////////////////////////////////

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
    var model = Object.assign(
        {}, assembleSets(modelInitial), assembleNetwork(modelInitial)
    );
    console.log(model);
    downloadJSON(model, "model_sets_network.json");
    //exploreNetwork(model.network);
    //return model;
}

////////////////////////////////////////////////////////////////////////////////
// Select nodes and links from network

// Select nodes and links by proximity degree 1 to a node

// Select nodes and links by proximity degree >1 to a node
// (select proximity degree 1 to every node in successive collections)

////////////////////////////////////////////////////////////////////////////////
// Utility

// TODO: Define functionality (organize in functions) for queries!!!

/**
 * Collects the neighborhood of nodes that are immediately proximal to a list of
 * nodes.
 * @param {Object} collection A CytoScape.js collection of nodes of interest.
 * @param {Array<string>} currentQueue Identifiers of nodes at current depth for
 * which to search and collect proximal neighbors.
 * @param {Array<string>} nextQueue Identifiers of nodes at next depth for which
 * to search and collect proximal neighbors.
 * @param {boolean} directionIn Whether or not to follow edges towards nodes of
 * interest.
 * @param {boolean} directionOut Whether or not to follow edges away from nodes
 * of interest.
 * @param {Object} network A CytoScape.js network.
 * @returns {Object} An object with information about a collection of nodes of
 * interest and identifiers of nodes at next depth.
 */
function collectProximalNodes(
    collection, currentQueue, nextQueue, directionIn, directionOut, network
) {
    // This process recurses for each node in a queue.
    if (currentQueue.length > 0) {
        // The queue for current depth is not empty.
        // Extract identifier for current node from the current queue.
        var currentNodeIdentifier = currentQueue[0];
        var newCurrentQueue = currentQueue.slice(1);
        // Extract identifiers for nodes in collection.
        var collectionNodeIdentifiers = collection
            .nodes()
            .map(function (node) {
                return node.id();
            });
        if (
            !collectionNodeIdentifiers.includes(currentNodeIdentifier)
        ) {
            // Current node is novel.
            // Include current node in collection.
            var currentNode = network
                .getElementById(currentNodeIdentifier);
            var newCollection = collection.union(currentNode);
            // Find neighbors of current node.
            if (directionIn === true && directionOut === true) {
                var neighbors = currentNode.openNeighborhood();
            } else if (directionIn === false && directionOut === true) {
                var neighbors = currentNode.outgoers();
            } else if (directionIn === true && directionOut === false) {
                var neighbors = currentNode.incomers();
            }
            // Include neighbors in queue for next depth.
            var neighborIdentifiers = neighbors
                .nodes()
                .map(function (node) {
                    return node.id();
                });
            var newNextQueue = []
                .concat(nextQueue, neighborIdentifiers);
            // Recursively call the function with new parameters.
            return collectProximalNodes(
                newCollection, newCurrentQueue, newNextQueue,
                directionIn, directionOut, network
            );
        } else {
            // Recursively call the function with new parameters.
            return collectProximalNodes(
                collection, newCurrentQueue, nextQueue,
                directionIn, directionOut, network
            );
        }
    } else {
        // The current queue is empty.
        return {
            collection: collection,
            nextQueue: nextQueue
        };
    }
}

/**
 * Traverses a network in breadth-first sequence, collecting nodes and links
 * until reaching a specific depth from the origin.
 * @param {Object} collection A CytoScape.js collection of nodes of interest.
 * @param {Array<string>} currentQueue Identifiers of nodes at current depth for
 * which to search and collect proximal neighbors.
 * @param {boolean} directionIn Whether or not to follow edges towards nodes of
 * interest.
 * @param {boolean} directionOut Whether or not to follow edges away from nodes
 * of interest.
 * @param {number} currentDepth Count of edges of current nodes from origin.
 * @param {number} goalDepth Count of edges from origin to traverse.
 * @param {Object} network A CytoScape.js network.
 * @returns {Object} A CytoScape.js collection of nodes and links of interest.
 */
function traverseBreadthByDepth(
    collection, currentQueue, directionIn, directionOut,
    currentDepth, goalDepth, network
) {
    // This process recurses for each depth level within bounds.
    if (currentDepth <= goalDepth) {
        var returnValues = collectProximalNodes(
            collection, currentQueue, [], directionIn, directionOut, network
        );
        //console.log(returnValues);
        var newCollection = returnValues.collection;
        var nextQueue = returnValues.nextQueue;
        var newDepth = currentDepth + 1;
        return traverseBreadthByDepth(
            newCollection, nextQueue, directionIn, directionOut,
            newDepth, goalDepth, network
        );
    } else {
        // Include in the collection all edges between nodes in the collection.
        return collection
            .union(collection.nodes().edgesWith(collection.nodes()));
    }
}

// TODO: Modify the functionality for collectEgoNetwork to keep track of the
// TODO: depth of each node from the ego.
// TODO: This information will be important for the table view.

// TODO: Can this function really accommodate either a core network or a collection?

/**
 * Collects nodes and links within specific proximity to a single focal node to
 * create an ego network for that node.
 * @param {string} ego Identifier for a single focal node.
 * @param {boolean} directionIn Whether or not to follow edges towards nodes of
 * interest.
 * @param {boolean} directionOut Whether or not to follow edges away from nodes
 * of interest.
 * @param {number} depth Count of edges of current nodes from origin.
 * @param {Object} network A CytoScape.js network or collection.
 * @returns {Object} A CytoScape.js collection of nodes and links of interest.
 */
function collectEgoNetwork(ego, directionIn, directionOut, depth, network) {
    // This function initiates the recursive traversal and collection process.
    // This function exists to provide a simpler, more concise interface to the
    // process.
    return traverseBreadthByDepth(
        network.collection(), [ego], directionIn, directionOut,
        0, depth, network
    );
}

/**
 * Visualizes a collection of nodes and links from a network.
 * @param {Object} collection A CytoScape.js collection of nodes and links.
 */
function visualizeNetwork(collection) {
    cytoscape({
        container: document.getElementById("exploration"),
        elements: collection.jsons(),
        layout: {
            animate: true,
            name: "cose",
            fit: true,
            idealEdgeLength: 10,
            nodeOverlap: 5,
            nodeRepulsion: 500000,
            padding: 10,
            randomize: true
        },
        style: [
            {
                selector: "node",
                style: {
                    "background-color": "red",
                    "font-size": "25px",
                    "label": "data(id)",
                    "text-halign": "center",
                    "text-valign": "center"
                }
            },
            {
                selector: "edge",
                style: {
                    "line-color": "grey",
                    "line-style": "solid",
                    "mid-target-arrow-color": "black",
                    "mid-target-arrow-shape": "triangle",
                    "width": 7
                }
            }
        ]
    });
}

function temporaryEgoNetwork(ego, depth, network) {
    // Examples of simple networks:
    // pyr_x at depth 2
    // Examples of complex networks
    // pyr_m at depth 2
    // cit_m at depth 2
    // Examples of enormous networks
    // pyr_x at depth 3
    // pyr_m at depth 3
    // cit_c at depth 3
    var collection = collectEgoNetwork(ego, true, true, depth, network);
    console.log("Ego Network of " + ego + " at a depth of " + depth);
    console.log(network.getElementById(ego).data());
    console.log("Count of nodes in collection: " + collection.nodes().size());
    visualizeNetwork(collection);
}

// TODO: Figure out how to make aStar as convenient and capable as possible.
// TODO: Maybe consider how to determine k shortest paths?
// TODO: Figure out how to perform multiple aStar's for multiple (>2) nodes and then combine the results.
// TODO: Maybe is there a way to find the shortest paths between collections (collection from each aStar)?

// what are the available attributes
// attributes differ between metabolites and reactions
// I might need to handle metabolites and reactions differently

// 1.
// Select individual metabolites by whether or not their names include a string.
// Example, select all metabolites with names that include "citrate".
// This functionality will be useful for dynamic queries.




// 1.
// Select only mitochondrial metabolites.
// I guess keep all reactions, since they won't participate without the metabolites anyway.

/**
 * Collects metabolites that participate either as reactants or products in
 * specific reactions.
 * @param {Array<Object>} reactions Node records for reactions.
 * @returns {Array<string>} Unique identifiers for metabolites.
 */
function collectMetabolitesOfReactions(reactions) {
    return collectUniqueElements(
        reactions
            .map(function (reaction) {
                return [].concat(
                    reaction.data.products, reaction.data.reactants
                );
            })
            .reduce(function (accumulator, element) {
                return accumulator.concat(element);
            }, [])
    );
}

// TODO: Include transport reactions.
// 2. Recursively find pairs or collections of metabolites... oh... just use the metabolite identifier in the node's data!

/**
 * Collects reactions that are part of a specific metabolic process along with
 * their metabolites and links between.
 * @param {string} process Identifier or name for a metabolic process.
 * @param {Object} model Information for a metabolic model in both relational
 * and graph or network structures.
 * @returns {Object} A CytoScape.js collection of nodes and links of interest.
 */
function collectProcessNetwork(process, model) {
    var initialReactions = model
        .network_elements
        .nodes
        .filter(function (node) {
            return node.data.type === "reaction";
        })
        .filter(function (reaction) {
            return reaction.data.process === process;
        });
    // Determine whether or not multiple compartmental version of the same
    // metabolite participate in the process.
    var initialMetabolites = collectMetabolitesOfReactions(initialReactions);
    var sets = initialMetabolites
        .reduce(function (accumulator, compartmentalIdentifier, index, array) {
            if (
                accumulator.filter(function (element) {
                    return element.includes(compartmentalIdentifier);
                }).length < 1
            ) {
                // The identifier for the compartmental metabolite is not
                // already in the collection.
                var identifier = model
                    .network_elements
                    .nodes
                    .filter(function (node) {
                        return node.data.type === "metabolite";
                    })
                    .filter(function (node) {
                        return node.data.id === compartmentalIdentifier;
                    })[0]
                    .data
                    .metabolite;
                var set = array.filter(function (element) {
                    return model
                        .network_elements
                        .nodes
                        .filter(function (node) {
                            return node.data.type === "metabolite";
                        })
                        .filter(function (node) {
                            return node.data.id === element;
                        })[0]
                        .data
                        .metabolite === identifier;
                });
                if (set.length > 1) {
                    // Multiple compartmental versions of the same metabolite
                    // participate in the process.
                    return accumulator.concat([set]);
                } else {
                    return accumulator;
                }
            } else {
                return accumulator;
            }
        }, []);
    console.log(sets);
    // TODO: Now filter reactions for reactions that involve combinations of the compartmental metabolites in reactants or products...
    // TODO: For simplicity, consider all reactants and products of the reaction together (collectMetabolitesOfReactions).
    // TODO: Be sure to consider all possible permutations of the compartmental metabolites.
    // TODO: An easy way to do that might be to select all reactions that involve >= 2 of the compartmental metabolites either as reactants or products.
    // Identify putative transport reactions as those whose metabolites
    // (reactants or products) include multiple compartmental metabolites from
    // the set.
    var transportReactions = model
        .network_elements
        .nodes
        .filter(function (node) {
            return node.data.type === "reaction";
        })
        .filter(function (reaction) {
            return sets.some(function (set) {
                return set.filter(function (identifier) {
                    return [].concat(
                        reaction.data.products, reaction.data.reactants
                    ).includes(identifier);
                }).length > 1;
            });
        });
    console.log(transportReactions);

    // TODO: I think the algorithm works up to this point.
    // TODO: Including these transport reactions increases the scale of the subnetwork dramatically.
    // TODO: There are a lot of transport reactions.

    //var collection = collectUniqueElements(metabolites)
    //    .reduce(function (accumulator, identifier) {
    //        return accumulator.union(network.getElementById(identifier));
    //    }, reactions);
    //return collection.union(collection.nodes().edgesWith(collection.nodes()));
}

//function includeTransportReactions()

function exploreModel(modelPremature) {

    // Initialize network
    var model = initializeNetwork(modelPremature);
    console.log(model);
    //console.log("Metabolite Nodes");
    //console.log(network.nodes(".metabolite").cy());
    //console.log(network.filter(".metabolite").cy());
    //console.log(network.metabolite);
    //console.log(network.elements.metabolite);

    // collection.cy() returns core

    //temporaryEgoNetwork("cit_c", 2, model.network);

    //var collection = model.network.elements().aStar(
    //    {
    //        root: model.network.getElementById("cit_m"),
    //        goal: model.network.getElementById("pyr_x"),
    //        directed: true
    //    }
    //    ).path;

    //console.log("beta-Alanine metabolism");
    //console.log("Vitamin D metabolism");
    //console.log("Lysine metabolism");
    //console.log("Glycine, serine, alanine and threonine metabolism");
    console.log("Methionine and cysteine metabolism");
    var collection = collectProcessNetwork(
        "Methionine and cysteine metabolism", model
    );
    //visualizeNetwork(collection);

    //console.log(model.network.getElementById("AGDC"));
    //console.log(model.network.getElementById("AGDC").data("process"));
    //console.log(model.network.getElementById("AGDC").data("products"));

    //var processReactions = collectProcessNetwork(
    //    "beta-Alanine metabolism", model.network
    //);
    //console.log(processReactions);

    //console.log(network.nodes())
    //var pyruvateNode = network.elements.filter("node[id = 'pyr_c']");
    //var pyruvateNeighborhood = pyruvateNode.closedNeighborhood();
    //console.log(pyruvateNeighborhood);

    //return network;
    // I think that I will need to collect reaction nodes, metabolite nodes, and
    // links using concat when I create the network in CytoScapeJS.
}
