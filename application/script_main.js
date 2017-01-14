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
};

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
        .text(function (d) {return d});

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

function assembleNetwork(model) {
    //determineCompartmentAbbreviations({
    //    cit_m: -1,
    //    h2o2_c: 1,
    //    h2o_c: -1,
    //    h2o_e: -1,
    //    h2o_c: -1,
    //    h2o_i: -1,
    //    h2o_c: -1
    //});
    var reaction = {
        metabolites: {
            cit_m: -1,
            h2o2_c: 1,
            h2o_e: -1,
            h2o_c: 1,
            h2o_m: 1,
            h2o_i: -1
        }
    }
    var test = determineCompartments(model, reaction);
    console.log(test);
};


// Network Assembly Portion

function determineCompartmentAbbreviations(metabolites) {
    var metaboliteIdentifiers = Object.keys(metabolites);
    // Split all metabolite identifiers by underscore.
    // Select the compartment identifiers, which are the last elements from the split lists.
    // Collect unique compartment identifiers.
    // Return unique compartment identifiers.
    var compartmentAbbreviations = metaboliteIdentifiers
        .map(function (identifier) {
            return identifier
                .split("_")
                .pop();
        })
        .reduce(function (accumulator, currentValue) {
            if (!accumulator.includes(currentValue)) {
                accumulator.push(currentValue);
            };
            return accumulator;
        }, []);
    return compartmentAbbreviations;
};


// Use map to prepare an array of objects.
// Then concatenate this array of objects.

function determineCompartments(model, reaction) {
    var compartmentAbbreviations = determineCompartmentAbbreviations(reaction.metabolites);
    var compartments = compartmentAbbreviations
        .reduce(function (accumulator, currentValue) {
            accumulator[currentValue] = model.compartments[currentValue];
            return accumulator;
        }, {});
    return compartments;
};

// TODO: Maybe I should re-write my determineCompartments and determineCompartmentAbbreviations functions so that they
// TODO: accommodate single metabolites. Then I'll have a master function(s) that handle collections.
// TODO: That way I can use the same functions for a single metabolite.

// function 1: split a metabolite identifier to get the compartment abbreviation for a SINGLE metabolite.
// function 2: determine the full compartment name for a SINGLE compartment abbreviation.
// function 3: use map to apply function 1 over Object.keys() for a collection of metabolites... then reduce to unique.
// function 4: use reduce to apply function 2 over a collection of compartment abbreviations from function 3.


// Process for each reaction
function createReactionNode(model, reaction) {
    var reactionNode = {
        group: "nodes",
        class: "reaction",
        data: {
            compartments: determineCompartments(reaction),
            gene_reaction_rule: reaction.gene_reaction_rule,
            id: reaction.id,
            lower_bound: reaction.lower_bound,
            metabolites: Object.assign({}, reaction.metabolites),
            name: reaction.name,
            products: determineProducts(reaction),
            reactants: determineReactants(reaction),
            reversibility: determineReversibility(reaction),
            subsystem: reaction.subsystem,
            type_reaction: determineTypeReaction(reaction),
            type_transport: determineTypeTransport(reaction),
            upper_bound: reaction.upper_bound
        }
    };
    return reactionNode;
};

// Process for each metabolite






// Apply the function to the collection using map.



/**
 * Script for network assembly portion.
 * Use an immediately-invoked function expression (IIFE) to establish scope in a convenient container.
 * An alternative style would be to declare the function and subsequently call it.
 */
(function () {


})();
