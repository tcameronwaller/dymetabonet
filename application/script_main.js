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
            d3.json(("../model/homo-sapiens/" + dataFile), function (error, model) {
                if (error) throw error;
                console.log(model);

                // Call function to assemble network.
                assembleNetwork(model);
            });
        })
})();



////////////////////////////////////////////////////////////////////////////////
// Network Assembly
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Compartments

function determineCompartmentAbbreviation(metaboliteIdentifier) {
    // Select the portion of the metabolite identifier after the underscore to
    // obtain the compartment abbreviation.
    var compartmentAbbreviation = metaboliteIdentifier
        .substring(metaboliteIdentifier.indexOf("_") + 1);
    return compartmentAbbreviation;
}

function determineCompartmentAbbreviations(metaboliteIdentifiers) {
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
    var compartmentAbbreviations = determineCompartmentAbbreviations(
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
    var reactantCompartmentAbbreviations = determineCompartmentAbbreviations(
        reactantIdentifiers
    );
    var productCompartmentAbbreviations = determineCompartmentAbbreviations(
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
    var compartmentAbbreviations = determineCompartmentAbbreviations(
        Object.keys(reaction.metabolites)
    );
    return (compartmentAbbreviations.length > 1);
}




// TODO: Use a filter apply.
// TODO: Define a function for the filter operation.
// TODO: Derive an array of metabolite abbreviations (without compartment
// TODO: identifiers) for the reaction.
// TODO: Keep the reaction if the array of metabolite abbreviations includes the
// TODO: abbreviation of the metabolite in question.

// TODO: I don't know if the function below works or not.
// TODO: I'll need to troubleshoot it.

function determineMetaboliteCompartments(
    metaboliteIdentifier, modelMetabolites, modelCompartments
) {
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
        .substring(0, metaboliteIdentifier.indexOf("_"));
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

function determineMetaboliteReactions(metaboliteIdentifier, modelReactions) {
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

////////////////////////////////////////////////////////////////////////////////
// Reaction Reversibility

function determineReversibility(reaction) {
    return (0 > reaction.lower_bound && reaction.upper_bound > 0);
}

////////////////////////////////////////////////////////////////////////////////
// Assembly for reactions

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
// Assembly for metabolites

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
            compartments: determineMetaboliteCompartments(
                metabolite.id, model.metabolites, model.compartments
            ),
            formula: metabolite.formula,
            id: metabolite.id,
            name: metabolite.name,
            reactions: determineMetaboliteReactions(
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
// Process for network

function assembleNetwork(model) {
    var reaction = {
        gene_reaction_rule: "gene1 or gene2 or gene3",
        id: "13DAMPPOX",
        lower_bound: 0,
        metabolites: {
            glc_c: -1,
            pyr_c: -1,
            h2o_c: -1,
            cit_m: 1,
            pyr_m: 1,
            h2o_m: 1
        },
        name: "Reaction Name",
        subsystem: "Process 1",
        upper_bound: 1000
    }
    //var test = createReactionNode(reaction, model);
    //var test = createReactionNode(model.reactions[0], model);
    //console.log(test);

    //var reactionNodes = createReactionNodes(model);
    //console.log(reactionNodes);
    var metaboliteNodes = createMetaboliteNodes(model);
    console.log(metaboliteNodes);
}

////////////////////////////////////////////////////////////////////////////////
// Process for each metabolite


// Apply the function to the collection using map.


/**
 * Script for network assembly portion.
 * Use an immediately-invoked function expression (IIFE) to establish scope in a convenient container.
 * An alternative style would be to declare the function and subsequently call it.
 */
(function () {


})();
