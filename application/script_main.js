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
                function (error, model) {
                if (error) throw error;
                // Call function to assemble network.
                assembleNetwork(model);
            });
        })
    d3.select("#assembly")
        .on("click", function () {
            // Load data from file in JSON format.
            // Create objects that associate with these data.
            d3.json(("../model/homo-sapiens/" + "network.json"),
                function (error, network) {
                if (error) throw error;
                // Call function to assemble network.
                exploreNetwork(network);
            });
        })

})();



////////////////////////////////////////////////////////////////////////////////
// Network Assembly
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Reactions

function determineLinkIdentifier(metaboliteIdentifier, reactionIdentifier) {
    return (reactionIdentifier.concat("_", metaboliteIdentifier));
}

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

function determineMetaboliteAbbreviation(metaboliteIdentifier) {
    // Select the portion of the metabolite identifier before the underscore to
    // obtain the metabolite abbreviation.
    var metaboliteAbbreviation = metaboliteIdentifier
        .substring(0, metaboliteIdentifier.lastIndexOf("_"));
    return metaboliteAbbreviation;
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
// Assembly for reaction nodes

function createReactionNode(reaction, model) {
    var reactionNode = {
        group: "nodes",
        class: "reaction",
        data: {
            chemicals_change: determineChangeChemicals(reaction),
            compartments_change: determineChangeCompartments(reaction),
            compartments: determineReactionCompartments(
                reaction, model.compartments
            ),
            gene_reaction_rule: reaction.gene_reaction_rule,
            id: reaction.id,
            lower_bound: reaction.lower_bound,
            metabolites: Object.assign({}, reaction.metabolites),
            multiple_compartments: determineMultipleCompartments(reaction),
            name: reaction.name,
            products: determineReactantsProducts(
                reaction, model.metabolites, "products"
            ),
            reactants: determineReactantsProducts(
                reaction, model.metabolites, "reactants"
            ),
            reversibility: determineReversibility(reaction),
            subsystem: reaction.subsystem,
            upper_bound: reaction.upper_bound
        }
    };
    return reactionNode;
}

function createReactionNodes(model) {
    return model.reactions.map(function (reaction) {
        return createReactionNode(reaction, model);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Assembly for metabolite nodes

function createMetaboliteNode(metabolite, model) {
    var metaboliteNode = {
        group: "nodes",
        class: "metabolite",
        data: {
            abbreviation: determineMetaboliteAbbreviation(metabolite.id),
            charge: metabolite.charge,
            compartment: determineCompartment(
                metabolite.compartment, model.compartments
            ),
            compartmental_reactions: determineCompartmentalMetaboliteReactions(
                metabolite.id, model.reactions
            ),
            compartments: determineMetaboliteCompartments(
                metabolite.id, model.metabolites, model.compartments
            ),
            formula: metabolite.formula,
            id: metabolite.id,
            name: metabolite.name,
            reactions: determineMetaboliteReactions(
                metabolite.id, model.reactions
            ),
            reactions_by_compartment: determineMetaboliteCompartmentalReactions(
                metabolite.id, model.reactions
            )
        }
    };
    return metaboliteNode;
}

function createMetaboliteNodes(model) {
    return model.metabolites.map(function (metabolite) {
        return createMetaboliteNode(metabolite, model);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Assembly for reaction links

function createReactionLink(metaboliteIdentifier, reactionIdentifier) {
    var reactionLink = {
        group: "edges",
        data: {
            id: determineLinkIdentifier(metaboliteIdentifier, reactionIdentifier),
            source: reactionIdentifier,
            target: metaboliteIdentifier
        }
    };
    return reactionLink;
}

function createReactionLinks(reactions) {
    return reactions.map(function (reaction) {
        return Object.keys(reaction.metabolites)
            .map(function (metaboliteIdentifier) {
            return createReactionLink(metaboliteIdentifier, reaction.id);
        })
    })
        .reduce(function (accumulator, currentValue) {
            return accumulator.concat(currentValue);
        }, []);
}

////////////////////////////////////////////////////////////////////////////////
// Process for network

function downloadJSON(object, name) {
    var objectJSON = JSON.stringify(object);
    var blob = new Blob([objectJSON], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var documentReference = document.createElement("a");
    documentReference.setAttribute("href", url);
    documentReference.setAttribute("download", name);
    documentReference.click();
}

function assembleNetwork(model) {
    console.log(model);
    var reactionNodes = createReactionNodes(model);
    console.log(reactionNodes);
    var metaboliteNodes = createMetaboliteNodes(model);
    console.log(metaboliteNodes);
    var reactionLinks = createReactionLinks(model.reactions);
    console.log(reactionLinks);
    var networkElements = reactionNodes.concat(metaboliteNodes, reactionLinks);
    var network = cytoscape({
        elements: networkElements
    });
    //console.log(network)
    var networkJSON = network.json();
    downloadJSON(networkJSON, "network.json");

    //return network;
    // I think that I will need to collect reaction nodes, metabolite nodes, and
    // links using concat when I create the network in CytoScapeJS.
}

function exploreNetwork(network) {
    var network = cytoscape(network);
    //console.log(network)
    var pyruvateNode = network.elements.filterFn(function (element) {
        return element.data.id === "pyr_c";
    });
    var pyruvateNeighborhood = pyruvateNode.closedNeighborhood();

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
