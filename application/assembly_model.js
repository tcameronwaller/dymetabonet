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
 * @returns {Object} A CytoScape.js collection of nodes and links of interest.
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

/**
 * Collects nodes and links within specific proximity to a single focal node to
 * create an ego network for that node.
 * @param {string} ego Identifier for a single focal node.
 * @param {boolean} directionIn Whether or not to follow edges towards nodes of
 * interest.
 * @param {boolean} directionOut Whether or not to follow edges away from nodes
 * of interest.
 * @param {number} depth Count of edges of current nodes from origin.
 * @param {Object} core A CytoScape.js network.
 * @returns {Object} A CytoScape.js collection of nodes and links of interest.
 */
function collectEgoNetwork(ego, directionIn, directionOut, depth, core) {
    // This function initiates the recursive traversal and collection process.
    // This function exists to provide a simpler, more concise interface to the
    // process.
    return traverseBreadthByDepth(
        core.collection(), [ego], directionIn, directionOut, 0, depth, core
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

    // Examples of simple networks:
    // pyr_x at depth 2

    // Examples of complex networks
    // pyr_m at depth 2
    // cit_m at depth 2

    // Examples of enormous networks
    // pyr_x at depth 3
    // pyr_m at depth 3
    // cit_c at depth 3

    var collection = collectEgoNetwork("cit_c", true, true, 3, model.network);
    console.log(collection.nodes().size());
    visualizeNetwork(collection);
    console.log(model.network.getElementById("pyr_x").data());

    //console.log(pyruvateNeighborhood);
    //console.log(pyruvateNeighborhood.jsons());
    //pyruvateNeighborhood.cy.layout({
    //    animate: true,
    //    name: "cose",
    //    fit: true,
    //    idealEdgeLength: 10,
    //    nodeOverlap: 5,
    //    nodeRepulsion: 500000,
    //    padding: 10,
    //    randomize: true
    //});


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
