/*
 Profondeur supports visual exploration and analysis of metabolic networks.
 Copyright (C) 2016  Thomas Cameron Waller

 Author email: tcameronwaller@gmail.com

 This file is part of Profondeur.

 Profondeur is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */



////////////////////////////////////////////////////////////////////////////////
// Query portion
////////////////////////////////////////////////////////////////////////////////



/**
 * Use D3 to create elements in DOM with associative data.
 * @param {d3 selection} selection D3 selection of HTML element within which to create elements with associative data.
 * @param {string} element Type of HTML element to create with associative data.
 * @param {array or accessor function} accessData Accessible data in array or accessor function for these values in
 * the selection.
 * @return {d3 selection} D3 selection of elements that the function created with associative data.
 */
function createDataElements(selection, element, accessData) {
    var elements = selection.selectAll(element)
        .data(accessData);
    elements
        .exit()
        .remove();
    var elementsEnter = elements
        .enter()
        .append(element);
    elements = elementsEnter
        .merge(elements);
    return elements;
}

/**
 * Script for query portion.
 * Use an immediately-invoked function expression (IIFE) to establish scope in a convenient container.
 * An alternative style would be to declare the function and subsequently call it.
 */
(function () {

    // Create single instance objects of each view's class.
    // Pass instance objects as arguments to classes that need to interact with them.
    // This strategy avoids creation of replicate instances of each class and enables instances to communicate together.
    //var explorationView = new ExplorationView();
    //var navigationView = new NavigationView(explorationView);
    //var queryView = new QueryView(navigationView);

    // TODO: Allow the user to select the directory path and file of the metabolic model.
    // TODO: readdirSync from Node.js might work.
    createDataElements(
        d3.select("#selector"),
        "option",
        ["model_h-sapiens_recon-2.json"]
    )
        .text(function (d) {
            return d
        });

    d3.select("#submit")
        .on("click", function () {
            //console.log(d3.event);
            //console.log(d3.event.srcElement.value);
            //console.log(d3.event.target.value);
            //self.dataFile = d3.event.target.value;
            //console.log(this.node().value);
            var dataFile = d3.select("#selector").node().value;

            // Load data from file in JSON format.
            // Create objects that associate with these data.
            d3.json(("../model/homo-sapiens/" + dataFile),
                function (error, modelInitial) {
                if (error) throw error;
                // Call function to assemble model.
                assembleModel(modelInitial);
            });
        })

    // TODO: I broke this functionality...
    d3.select("#assembly")
        .on("click", function () {
            // Load data from file in JSON format.
            // Create objects that associate with these data.
            d3.json(("../model/homo-sapiens/" + "model_h-sapiens_recon-2.json"),
                function (error, modelInitial) {
                if (error) throw error;
                // Call function to assemble model.
                assembleModel(modelInitial);
            });
        })

})();



////////////////////////////////////////////////////////////////////////////////
// Network Assembly
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Reactions

/**
 * Determines the identifier for a link between a metabolite and a reaction.
 * @param {string} sourceIdentifier Unique identifier of a metabolite or a
 * reaction that is the link's source.
 * @param {string} targetIdentifier Unique identifier of a metabolite or a
 * reaction that is the link's target.
 * @returns {string} Unique identifier for the link.
 */
function determineLinkIdentifier(sourceIdentifier, targetIdentifier) {
    return (sourceIdentifier.concat("_", targetIdentifier));
}

/**
 * Determines whether or not a reaction is reversible.
 * @param {Object} reaction Information for a reaction.
 * @returns {boolean} Whether or not the reaction is reversible.
 */
function determineReversibility(reaction) {
    return (0 > reaction.lower_bound && reaction.upper_bound > 0);
}

////////////////////////////////////////////////////////////////////////////////
// Compartments

function determineCompartmentAbbreviation(metaboliteIdentifier) {
    // Select the portion of the metabolite identifier after the underscore to
    // obtain the compartment abbreviation.
    var compartmentAbbreviation = metaboliteIdentifier
        .substring(metaboliteIdentifier.lastIndexOf("_") + 1);
    return compartmentAbbreviation;
}

function determineUniqueCompartmentAbbreviations(metaboliteIdentifiers) {
    // Select the compartment identifiers from the metabolite identifiers.
    // Collect unique compartment identifiers.
    // Return unique compartment identifiers.
    var compartmentAbbreviations = metaboliteIdentifiers
        .map(determineCompartmentAbbreviation)
        .reduce(function (accumulator, currentValue) {
            if (!accumulator.includes(currentValue)) {
                accumulator.push(currentValue);
            };
            return accumulator;
        }, []);
    return compartmentAbbreviations;
}

function determineCompartmentAbbreviations(metaboliteIdentifiers) {
    // Select the compartment identifiers from the metabolite identifiers.
    // Collect compartment identifiers.
    var compartmentAbbreviations = metaboliteIdentifiers
        .map(determineCompartmentAbbreviation)
        .reduce(function (accumulator, currentValue) {
            accumulator.push(currentValue);
            return accumulator;
        }, []);
    return compartmentAbbreviations;
}

function determineCompartment(compartmentAbbreviation, modelCompartments) {
    // Determine full name of a compartment from its abbreviation.
    var compartment = {};
    compartment[compartmentAbbreviation] =
        modelCompartments[compartmentAbbreviation];
    return compartment;
}

function determineReactionCompartments(reaction, modelCompartments) {
    // Determine compartment abbreviations from reaction's metabolites.
    // Determine compartment names from these abbreviations.
    var compartmentAbbreviations = determineUniqueCompartmentAbbreviations(
        Object.keys(reaction.metabolites)
    );
    var compartments = compartmentAbbreviations
        .map(function (compartmentAbbreviation) {
            return determineCompartment(
                compartmentAbbreviation, modelCompartments
            );
        })
        .reduce(function (accumulator, currentValue) {
            return Object.assign(accumulator, currentValue);
        }, {});
    return compartments;
}

function determineChangeCompartments(reaction) {
    // For a reaction, determine whether the compartments of reactant
    // metabolites are identical to the compartments of product metabolites.
    var reactantIdentifiers = determineReactantProductIdentifiers(
        reaction, "reactants"
    );
    var productIdentifiers = determineReactantProductIdentifiers(
        reaction, "products"
    );
    var reactantCompartmentAbbreviations = determineUniqueCompartmentAbbreviations(
        reactantIdentifiers
    );
    var productCompartmentAbbreviations = determineUniqueCompartmentAbbreviations(
        productIdentifiers
    );
    return !(reactantCompartmentAbbreviations.every(function (element) {
        return (productCompartmentAbbreviations.includes(element));
    }) && productCompartmentAbbreviations.every(function (element) {
        return (reactantCompartmentAbbreviations.includes(element));
    }));
}

function determineMultipleCompartments(reaction) {
    // Determine whether or not a reaction involves metabolites in multiple
    // compartments.
    var compartmentAbbreviations = determineUniqueCompartmentAbbreviations(
        Object.keys(reaction.metabolites)
    );
    return (compartmentAbbreviations.length > 1);
}

function determineMetaboliteCompartments(
    metaboliteIdentifier, modelMetabolites, modelCompartments
) {
    // Identify all compartments in which a metabolite appears from entries for
    // metabolites.
    var metaboliteAbbreviation =
        determineMetaboliteAbbreviation(metaboliteIdentifier);
    var compartments = modelMetabolites.filter(function (modelMetabolite) {
        return (determineMetaboliteAbbreviation(modelMetabolite.id) ===
        metaboliteAbbreviation);
    })
        .map(function (metabolite) {
            return metabolite.compartment;
        })
        .map(function (compartmentAbbreviation) {
            return determineCompartment(
                compartmentAbbreviation, modelCompartments
            );
        })
        .reduce(function (accumulator, currentValue) {
            return Object.assign(accumulator, currentValue);
        }, {});
    return compartments;
}

////////////////////////////////////////////////////////////////////////////////
// Metabolites

function determineReactantProductIdentifiers(reaction, flag) {
    // Determine metabolite identifiers.
    // Return metabolite identifiers for reactants or products.
    if (flag === "reactants") {
        var value = -1;
    } else if (flag === "products") {
        var value = 1;
    };
    var metaboliteIdentifiers = Object.keys(reaction.metabolites);
    return metaboliteIdentifiers.filter(function (metaboliteIdentifier) {
        return reaction.metabolites[metaboliteIdentifier] === value;
    });
}

function determineMetaboliteName(metaboliteIdentifier, modelMetabolites) {
    // Determine full name of a metabolite from its abbreviation.
    var metabolite = modelMetabolites.filter(function (modelMetabolite) {
        return (modelMetabolite.id === metaboliteIdentifier);
    })[0];
    return metabolite.name;
}

function determineMetaboliteIdentifierName(
    metaboliteIdentifier, modelMetabolites
) {
    // Collect identifier and name of a metabolite.
    var metabolite = {};
    metabolite[metaboliteIdentifier] = determineMetaboliteName(
        metaboliteIdentifier, modelMetabolites
    );
    return metabolite;
}

function determineReactantsProducts(reaction, modelMetabolites, flag) {
    var reactantProductIdentifiers = determineReactantProductIdentifiers(
        reaction, flag
    );
    var metabolites = reactantProductIdentifiers
        .map(function (reactantProductIdentifier) {
            return determineMetaboliteIdentifierName(
                reactantProductIdentifier, modelMetabolites
            );
        })
        .reduce(function (accumulator, currentValue) {
            return Object.assign(accumulator, currentValue);
        }, {});
    return metabolites;
}

/**
 * Determines the identifier of a general metabolite from the identifier of a
 * compartmental metabolite.
 * @param {string} compartmentalMetaboliteIdentifier Unique identifier of a
 * compartmental metabolite.
 * @returns {string} Unique identifier of a general metabolite.
 */
function determineMetaboliteIdentifier(compartmentalMetaboliteIdentifier) {
    // Select the portion of the compartmental metabolite identifier before the
    // underscore to obtain the general metabolite identifier.
    return compartmentalMetaboliteIdentifier
        .substring(0, compartmentalMetaboliteIdentifier.lastIndexOf("_"));
}

function determineMetaboliteAbbreviations(metaboliteIdentifiers) {
    // Select the metabolite abbreviations from the metabolite identifiers.
    var metaboliteAbbreviations = metaboliteIdentifiers
        .map(determineMetaboliteAbbreviation);
    return metaboliteAbbreviations;
}

function determineChangeChemicals(reaction) {
    // For a reaction, determine whether the reactant and product metabolites
    // change chemically.
    // Do so by comparison of metabolite abbreviations in reactants and
    // products.
    var reactantIdentifiers = determineReactantProductIdentifiers(
        reaction, "reactants"
    );
    var productIdentifiers = determineReactantProductIdentifiers(
        reaction, "products"
    );
    var reactantAbbreviations = determineMetaboliteAbbreviations(
        reactantIdentifiers
    );
    var productAbbreviations = determineMetaboliteAbbreviations(
        productIdentifiers
    );
    return !(reactantAbbreviations.every(function (element) {
            return (productAbbreviations.includes(element));
        }) && productAbbreviations.every(function (element) {
            return (reactantAbbreviations.includes(element));
        })
    );
}

function filterReactionsMetabolite(metaboliteIdentifier, modelReactions) {
    // Select reactions that involve a specific metabolite.
    // This selection does not consider compartment.
    var metaboliteAbbreviation =
        determineMetaboliteAbbreviation(metaboliteIdentifier);
    var reactions = modelReactions.filter(function (modelReaction) {
        return (
            determineMetaboliteAbbreviations(
                Object.keys(modelReaction.metabolites)
            )
                .includes(metaboliteAbbreviation));
    });
    return reactions;
}

function filterReactionsCompartmentalMetabolite(
    metaboliteIdentifier, modelReactions
) {
    // Select reactions that involve a specific compartmental metabolite.
    var reactions = modelReactions.filter(function (modelReaction) {
        return (Object.keys(modelReaction.metabolites)
            .includes(metaboliteIdentifier));
    });
    return reactions;
}

function determineReactionIdentifierName(modelReaction) {
    // Collect identifier and full name of a reaction.
    var reaction = {};
    reaction[modelReaction.id] = modelReaction.name;
    return reaction;
}

function determineCompartmentalMetaboliteReactions(
    // Select all reactions that involve the metabolite in its compartment.
    // Include chemical reactions and transport events.
    metaboliteIdentifier, modelReactions
) {
    var metaboliteReactions = filterReactionsCompartmentalMetabolite(
        metaboliteIdentifier, modelReactions
    );
    var reactions = metaboliteReactions
        .map(determineReactionIdentifierName)
        .reduce(function (accumulator, currentValue) {
            return Object.assign(accumulator, currentValue);
        }, {});
    return reactions;
}

function determineMetaboliteReactions(
    metaboliteIdentifier, modelReactions
) {
    var metaboliteReactions = filterReactionsMetabolite(
        metaboliteIdentifier, modelReactions
    );
    var reactions = metaboliteReactions
        .map(determineReactionIdentifierName)
        .reduce(function (accumulator, currentValue) {
            return Object.assign(accumulator, currentValue);
        }, {});
    return reactions;
}

function determineMetaboliteCompartmentalReactions(
    metaboliteIdentifier, modelReactions
) {
    // Select all reactions that involve the metabolite in any compartment.
    // Include reactions that only involve metabolites in a single compartment
    // to avoid transport events.
    // The count of compartmental reactions for the metabolite will not include
    // transport events.
    var metaboliteReactions = filterReactionsMetabolite(
        metaboliteIdentifier, modelReactions
    )
        .filter(function (metaboliteReaction) {
            return !(determineMultipleCompartments(metaboliteReaction));
        });

    var reactionCompartments = metaboliteReactions
        .map(function (metaboliteReaction) {
            return determineUniqueCompartmentAbbreviations(
                Object.keys(metaboliteReaction.metabolites));
        })
        .reduce(function (accumulator, currentValue) {
            return accumulator.concat(currentValue);
        }, [])
        .reduce(function (accumulator, currentValue) {
            if (Object.keys(accumulator).includes(currentValue)) {
                accumulator[currentValue] += 1;
            } else {
                accumulator[currentValue] = 1;
            };
            return accumulator;
        }, {});
    return reactionCompartments;
}

////////////////////////////////////////////////////////////////////////////////
// Create metabolite nodes

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
    return metabolites.map(createCompartmentalMetaboliteNode);
}

////////////////////////////////////////////////////////////////////////////////
// Create reaction nodes

// TODO: Maybe introduce an option flag and an if clause to create a reaction
// TODO: node appropriate for general, non-compartment-specific metabolites.

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
    return reactions.map(createReactionNode);
}

////////////////////////////////////////////////////////////////////////////////
// Create reaction links

/**
 * Determines the role of a metabolite in a reaction, either as a reactant or a
 * product.
 * @param {Object} reaction Information for a reaction.
 * @param {string} metaboliteIdentifier Unique identifier of a metabolite that
 * participates in the reaction.
 * @returns {string} The metabolite's role as a reactant or product in the
 * reaction.
 */
function determineReactionMetaboliteRole(reaction, metaboliteIdentifier) {
    if (reaction.metabolites[metaboliteIdentifier] === -1) {
        return "reactant";
    } else if (reaction.metabolites[metaboliteIdentifier] === 1) {
        return "product";
    }
}

/**
 * Filters a reaction's metabolites by their role in the reaction as reactant or
 * product.
 * @param {Object} reaction Information for a reaction.
 * @returns {Array<string>} Identifiers for metabolites with specific role.
 */
function filterReactionMetabolitesByRole(reaction, role) {
    return Object.keys(reaction.metabolites)
        .filter(function (metaboliteIdentifier) {
            return (determineReactionMetaboliteRole(
                reaction, metaboliteIdentifier
            ) === role);
        });
}

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
    var reversible = determineReversibility(reaction);
    if (!reversible) {
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
    } else if (reversible) {
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
// Assemble network

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
                createMetaboliteNodes(model.metabolites),
                createReactionNodes(model.reactions),
                createReactionLinks(model.reactions)
            )
        })
    };
    return network;
}

////////////////////////////////////////////////////////////////////////////////
// Assemble model

/**
 * Assembles a practical and concise model to represent information of a
 * metabolic model.
 * @param {Object} model Information of a metabolic model from systems biology,
 * conversion from SBML to JSON formats by COBRApy.
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
    console.log("Network");
    console.log(network);
    console.log("Network Nodes");
    console.log(network.nodes());

    //console.log("Metabolite Nodes");
    //console.log(network.nodes().metabolite);
    //console.log(network.metabolite);
    //console.log(network.elements.metabolite);

    console.log(network.getElementById("pyr_c").data());
    var pyruvateNeighborhood = network.getElementById("pyr_c").neighborhood();
    console.log(pyruvateNeighborhood);

    var subnetwork = cytoscape({
        container: document.getElementById("exploration"),
        elements: [
            {
                data: {
                    id: "a"
                }
            },
            {
                data: {
                    id: "b"
                }
            },
            {
                data: {
                    id: "c"
                }
            },
            {
                data: {
                    id: "d"
                }
            },
            {
                data: {
                    id: "e"
                }
            },
            {
                data: {
                    id: "ab",
                    source: "a",
                    target: "b"
                }
            },
            {
                data: {
                    id: "ac",
                    source: "a",
                    target: "c"
                }
            },
            {
                data: {
                    id: "ad",
                    source: "a",
                    target: "d"
                }
            },
            {
                data: {
                    id: "ae",
                    source: "a",
                    target: "e"
                }
            }
        ],
        layout: {
            name: "concentric"
        }
    });
    console.log(subnetwork);

    //container: document.getElementById("exploration"),


    //console.log(network.nodes())
    //var pyruvateNode = network.elements.filter("node[id = 'pyr_c']");
    //var pyruvateNeighborhood = pyruvateNode.closedNeighborhood();
    //console.log(pyruvateNeighborhood);

    //return network;
    // I think that I will need to collect reaction nodes, metabolite nodes, and
    // links using concat when I create the network in CytoScapeJS.
}

////////////////////////////////////////////////////////////////////////////////


/**
 * Script for network assembly portion.
 * Use an immediately-invoked function expression (IIFE) to establish scope in a convenient container.
 * An alternative style would be to declare the function and subsequently call it.
 */
(function () {


})();
