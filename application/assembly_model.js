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
