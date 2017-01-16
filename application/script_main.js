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


// Use element dimensions and position to scale SVG element according to window size.
// var divNetwork = d3.select(#network);
// var bounds = divNetwork.node().getBoundingClientRect();


// Query portion

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


// Network Assembly Portion


// Compartments

function determineCompartmentAbbreviation(metaboliteIdentifier) {
    // Split metabolite identifier to obtain compartment abbreviation.
    var compartmentAbbreviation = metaboliteIdentifier
        .split("_")
        .pop();
    return compartmentAbbreviation;
}

function determineCompartmentAbbreviations(metaboliteIdentifiers) {
    // Split all metabolite identifiers by underscore.
    // Select the compartment identifiers, which are the last elements from the split lists.
    // Collect unique compartment identifiers.
    // Return unique compartment identifiers.
    var compartmentAbbreviations = metaboliteIdentifiers
        .map(determineCompartmentAbbreviation)
        .reduce(function (accumulator, currentValue) {
            if (!accumulator.includes(currentValue)) {
                accumulator.push(currentValue);
            }
            ;
            return accumulator;
        }, []);
    return compartmentAbbreviations;
}

function determineCompartment(compartmentAbbreviation, compartmentsReference) {
    // Determine full name of a compartment from its abbreviation.
    var compartment = {};
    compartment[compartmentAbbreviation] = compartmentsReference[compartmentAbbreviation];
    return compartment;
}

function determineCompartments(reaction, compartmentsReference) {
    // Determine compartment abbreviations from reaction's metabolites.
    // Determine compartment names from these abbreviations.
    var compartmentAbbreviations = determineCompartmentAbbreviations(Object.keys(reaction.metabolites));
    var compartments = compartmentAbbreviations
        .map(function (compartmentAbbreviation) {
            return determineCompartment(compartmentAbbreviation, compartmentsReference);
        })
        .reduce(function (accumulator, currentValue) {
            return Object.assign(accumulator, currentValue);
        }, {});
    return compartments;
}

// Reactant Metabolites

function determineReactants(reaction) {
    // Determine metabolite identifiers.
    // Return metabolite identifiers for reactants.
    var metaboliteIdentifiers = Object.keys(reaction.metabolites);
    return metaboliteIdentifiers.filter(function (metaboliteIdentifier) {
        return reaction.metabolites[metaboliteIdentifier] === -1;
    });
}

// Product Metabolites

function determineProducts(reaction) {
    // Determine metabolite identifiers.
    // Return metabolite identifiers for products.
    var metaboliteIdentifiers = Object.keys(reaction.metabolites);
    return metaboliteIdentifiers.filter(function (metaboliteIdentifier) {
        return reaction.metabolites[metaboliteIdentifier] === 1;
    });
}

// Reversibility

function determineReversibility(reaction) {
    return (0 > reaction.lower_bound && reaction.upper_bound > 0);
}

// Reaction Type

function determineTypeTransport(reaction) {
    // For a reaction, determine whether the compartments of reactant metabolites are identical to the compartments of
    // product metabolites.
    var reactantIdentifiers = determineReactants(reaction);
    var productIdentifiers = determineProducts(reaction);
    var reactantCompartmentAbbreviations = determineCompartmentAbbreviations(reactantIdentifiers);
    var productCompartmentAbbreviations = determineCompartmentAbbreviations(productIdentifiers);
    console.log(reactantCompartmentAbbreviations);
    console.log(productCompartmentAbbreviations);
    return !(reactantCompartmentAbbreviations.every(function (element) {
        return (productCompartmentAbbreviations.includes(element));
    }) && productCompartmentAbbreviations.every(function (element) {
        return (reactantCompartmentAbbreviations.includes(element));
    }));
}

// Process for each reaction
function createReactionNode(reaction, compartmentsReference) {
    var reactionNode = {
        group: "nodes",
        class: "reaction",
        data: {
            compartments: determineCompartments(reaction, compartmentsReference),
            gene_reaction_rule: reaction.gene_reaction_rule,
            id: reaction.id,
            lower_bound: reaction.lower_bound,
            metabolites: Object.assign({}, reaction.metabolites),
            name: reaction.name,
            products: determineProducts(reaction),
            reactants: determineReactants(reaction),
            reversibility: determineReversibility(reaction),
            subsystem: reaction.subsystem,
            //type_reaction: determineTypeReaction(reaction),
            type_transport: determineTypeTransport(reaction),
            upper_bound: reaction.upper_bound
        }
    };
    return reactionNode;
}

function assembleNetwork(model) {
    var reaction = {
        gene_reaction_rule: "gene1 or gene2 or gene3",
        id: "13DAMPPOX",
        lower_bound: 0,
        metabolites: {
            cit_c: -1,
            pyr_e: -1,
            h2o_m: -1,
            gln_c: 1,
            h2o_e: 1,
            glc_m: 1
        },
        name: "Reaction Name",
        subsystem: "Process 1",
        upper_bound: 1000
    }
    var test = createReactionNode(reaction, model.compartments);
    //var test = createReactionNode(model.reactions[0], model.compartments);
    console.log(test);
}


// Process for each metabolite


// Apply the function to the collection using map.


/**
 * Script for network assembly portion.
 * Use an immediately-invoked function expression (IIFE) to establish scope in a convenient container.
 * An alternative style would be to declare the function and subsequently call it.
 */
(function () {


})();
