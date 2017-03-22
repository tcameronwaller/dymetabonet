////////////////////////////////////////////////////////////////////////////////
// Assembly of Model
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Assembly of Model

/**
 * Prints summary information to console about a metabolic model.
 * @param {Object} model Information about entities and relations in
 * a metabolic model.
 */
function summarizeModel(model) {
    // Print the model and metrics to the console.
    console.log(model);
    console.log(
        "Count of nodes for reactions: " +
        Object.keys(model.network.nodes.reactions).length
    );
    console.log(
        "Count of nodes for compartmental metabolites: " +
        Object.keys(model.network.nodes.metabolites).length
    );
    console.log(
        "Count of links: " +
        Object.keys(model.network.links).length
    );
    console.log(
        "Count of metabolites: " +
        Object.keys(model.sets.metabolites).length
    );
    console.log(
        "Count of processes: " +
        Object.keys(model.sets.processes).length
    );
}



// TODO: This documentation misrepresents the new format of the metabolic model.
/**
 * Assembles a practical and concise model to represent information of a
 * metabolic model.
 * @param {Object} data Information of a metabolic model from systems biology,
 * conversion from SBML to JSON formats by COBRApy and libSBML.
 * @param {Object<string>} data.compartments Abbreviations and names of
 * compartments in the model.
 * @param {Array<Object<string>>} data.genes Information for genes in the model.
 * @param {Array<Object>} data.metabolites Information for compartment-specific
 * metabolites in the model.
 * @param {Array<Object>} data.reactions Information for reactions in the model.
 * @returns {Object} Information about entities and relations in a metabolic
 * model.
 */
function assembleModel(data) {
    var model = Object.assign(
        {}, assembleSets(data), assembleNetwork(data)
    );
    downloadJSON(model, "model_sets_network.json");
    return model;
}

////////////////////////////////////////////////////////////////////////////////
// Select nodes and links from network

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
    cytoscape({
        container: document.getElementById("exploration"),
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
