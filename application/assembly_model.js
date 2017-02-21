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
    var model = Object.assign({},
        assembleSets(modelInitial),
        assembleNetwork(modelInitial)
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


// TODO: Implement a function that can spread outwards from a single node.
// TODO: Consider directionality of links: 1. null disregard directionality 2. in only follow links towards the node 3. out only follow links away from the node

// The traversal will depend on link directionality.
// Also provide the option of including parallel links (reversible reactions) in the final collection.

// 1. A basic 1-step traversal function... how do I know which direction to go?... Union will take care of that in the end.
// This function should


// 2. A driving function that keeps track of elements in each depth and then union's them at the end.



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
 * @param {Object} core A CytoScape.js network.
 * @returns {Object} An object with information about a collection of nodes of
 * interest and identifiers of nodes at next depth.
 */
function collectProximalNodes(
    collection, currentQueue, nextQueue, directionIn, directionOut, core
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
            var currentNode = core
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
                directionIn, directionOut, core
            );
        } else {
            // Recursively call the function with new parameters.
            return collectProximalNodes(
                collection, newCurrentQueue, nextQueue,
                directionIn, directionOut, core
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
 * @param {Object} core A CytoScape.js network.
 * @returns {Object} An object with information about a collection of nodes of
 * interest and identifiers of nodes at next depth.
 */
function traverseBreadthByDepth(
    collection, currentQueue, directionIn, directionOut,
    currentDepth, goalDepth, core
) {
    // This process recurses for each depth level within bounds.
    if (currentDepth <= goalDepth) {
        var returnValues = collectProximalNodes(
            collection, currentQueue, [], directionIn, directionOut, core
        );
        //console.log(returnValues);
        var newCollection = returnValues.collection;
        var nextQueue = returnValues.nextQueue;
        var newDepth = currentDepth + 1;
        return traverseBreadthByDepth(
            newCollection, nextQueue, directionIn, directionOut,
            newDepth, goalDepth, core
        );
    } else {
        // Include in the collection all edges between nodes in the collection.
        return collection.union(collection.nodes().edgesWith(collection.nodes()));
    }
}


// TODO: Now implement collectEgoNetwork() to simplify interface with traverseBreadthByDepth().

function collectEgoNetwork(ego, directionIn, directionOut, depth, core) {
    return traverseBreadthByDepth(
        core.collection(), currentQueue[ego], core, direction, 0, depth
    );


    //nodes.connectedEdges();

    // nested function for recursion...

}






function collectEgoNetworkOld(ego, collection, direction, depth) {
    if (direction === null) {
        return collection.breadthFirstSearch({
            roots: ego,
            visit: function (index, depthCurrent) {
                if (depthCurrent > depth) {
                    return false;
                }
            },
            directed: false
        });
    } else if (direction === "out") {
        return collection.breadthFirstSearch({
            roots: ego,
            visit: function (index, depthCurrent) {
                if (depthCurrent > depth) {
                    return false;
                }
            },
            directed: true
        });
    } else if (direction === "in") {
        // With the current implementation of breadthFirstSearch, and because of
        // bidirectional edges, I cannot use this breadthFirstSearch strategy to
        // obtain the ego network with only edges towards the ego.
    }
}









function exploreModel(modelPremature) {

    // Initialize network
    //var model = initializeNetwork(modelPremature);
    //console.log(model);

    //console.log("Metabolite Nodes");
    //console.log(network.nodes(".metabolite").cy());
    //console.log(network.filter(".metabolite").cy());
    //console.log(network.metabolite);
    //console.log(network.elements.metabolite);

    // collection.cy() returns core

    //console.log(network.getElementById("10FTHFtl").data());
    //var pyruvateNeighborhood = network
    //    .getElementById("pyr_c")
    //    .closedNeighborhood();
    //console.log(pyruvateNeighborhood);
    //console.log(pyruvateNeighborhood.jsons());
    //var subNetwork = cytoscape({
    //    container: document.getElementById("exploration"),
    //    elements: pyruvateNeighborhood.jsons(),
    //    layout: {name: "concentric"}
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
