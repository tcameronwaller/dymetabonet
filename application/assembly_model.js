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

function collectEgoNetwork(ego, core, direction, depth) {
    function traverseBreadthByDepth(
        collection, queue, core, direction, currentDepth, goalDepth
    ) {
        var currentNode = core.getElementById(queue.shift());
        if (direction === null) {
            var neighbors = currentNode.openNeighborhood();
        } else if (direction === "out") {
            var neighbors = currentNode.outgoers();
        } else if (direction === "in") {
            var neighbors = currentNode.incomers();
        }
        neighbors.each(function (index, element) {
            if (!collection.anySame(element)) {
                collection = collection.union(element);
            }
            // TODO: now for the rest...
        })
        if (queue.length > 0) {
            traverseBreadthByDepth(
                collection, queue, core, direction, currentDepth, goalDepth
            );
        }
    }
    var collection = core.collection();
    var queue = [];
    queue.push(ego);
    return traverseBreadthByDepth(
        collection, queue, core, direction, currentDepth, goalDepth
    );


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
    var model = initializeNetwork(modelPremature);
    console.log(model);

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
