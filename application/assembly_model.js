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
    downloadJSON(model, "model_sets_network.json");
    // Print the model and metrics to the console.
    console.log(model);
    console.log(
        "Count of nodes for reactions: " +
        Object.keys(model.network_elements.nodes.reactions).length
    );
    console.log(
        "Count of nodes for compartmental metabolites: " +
        Object.keys(model.network_elements.nodes.metabolites).length
    );
    console.log(
        "Count of links: " +
        Object.keys(model.network_elements.links).length
    );
    console.log(
        "Count of metabolites: " +
        Object.keys(model.sets.metabolites).length
    );
    console.log(
        "Count of processes: " +
        Object.keys(model.sets.processes).length
    );
    //exploreNetwork(model.network);
    //return model;
}

////////////////////////////////////////////////////////////////////////////////
// Select nodes and links from network

////////////////////////////////////////////////////////////////////////////////
// Utility

/**
 * Initializes and visualizes a CytoScape.js network.
 * @param {Array<string>} nodeIdentifiers Unique identifiers for network nodes.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 */
function visualizeNetwork(nodeIdentifiers, model) {
    cytoscape({
        container: document.getElementById("exploration"),
        //elements: collection.jsons(),
        elements: collectElementsForCytoScapeNetwork(nodeIdentifiers, model),
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

function exploreModel(model) {

    console.log(model);

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
    var nodeIdentifiers = collectProcessNetworkNodes(
        "Methionine and cysteine metabolism", model
    );
    visualizeNetwork(nodeIdentifiers, model);

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
