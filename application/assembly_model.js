////////////////////////////////////////////////////////////////////////////////
// Assembly of Model


////////////////////////////////////////////////////////////////////////////////
// Utility

/**
 * Initializes and visualizes a CytoScape.js network.
 * @param {Object<string, Array<string>>} collection Identifiers of reactions
 * and metabolites in the query's current collection.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function visualizeNetwork(collection, model) {
    // Only visualize network if it is sufficiently small.
    if (
        collection.metabolites.length < 500 &&
        collection.reactions.length < 500
    ) {
        var networkView = document.getElementById("network");
        // Create new instance of network in CytoScape.js.
        cytoscape({
            container: networkView,
            //elements: collection.jsons(),
            elements: collectElementsForCytoScapeNetwork(collection, model),
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
                        "background-color": "rgb(255, 0, 255)",
                        "background-opacity": 1,
                        "color": "rgb(0, 0, 0)",
                        "font-size": "25px",
                        "label": "data(id)",
                        "text-halign": "center",
                        "text-opacity": 1,
                        "text-valign": "center"
                    }
                },
                {
                    selector: "edge",
                    style: {
                        "line-color": "rgb(50, 50, 50)",
                        "line-style": "solid",
                        "mid-target-arrow-color": "black",
                        "mid-target-arrow-shape": "triangle",
                        "width": 7
                    }
                }
            ]
        });
    }
}

/**
 * Initializes and visualizes a CytoScape.js network.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Object<string, Array<string>>} Identifiers of reactions and
 * metabolites in the query's new collection.
 */
function extractInitialCollectionFromModel(model) {
    return {
        metabolites: collectValuesFromObjects(
            Object.values(model.network.nodes.metabolites), "id"
        ),
        reactions: collectValuesFromObjects(
            Object.values(model.network.nodes.reactions), "id"
        )
    }
}

function exploreModel(model) {

    summarizeModel(model);

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
