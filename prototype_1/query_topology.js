/**
 * Created by Cameron on 3/16/2017.
 */



// TODO: Figure out how to make aStar as convenient and capable as possible.
// TODO: Maybe consider how to determine k shortest paths?
// TODO: Figure out how to perform multiple aStar's for multiple (>2) nodes and then combine the results.
// TODO: Maybe is there a way to find the shortest paths between collections (collection from each aStar)?




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
