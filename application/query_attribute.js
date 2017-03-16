/**
 * Created by Cameron on 3/16/2017.
 */






/**
 * Collects metabolites that participate either as reactants or products in
 * specific reactions.
 * @param {Array<string>} reactionIdentifiers Unique identifiers for reactions.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Array<string>} Unique identifiers for metabolites.
 */
function collectMetabolitesOfReactions(reactionIdentifiers, model) {
    var reactions = reactionIdentifiers.map(function (identifier) {
        return model.network_elements.nodes.reactions[identifier];
    });
    return collectUniqueElements(
        reactions
            .map(function (reaction) {
                return [].concat(
                    reaction.products, reaction.reactants
                );
            })
            .reduce(function (accumulator, element) {
                return accumulator.concat(element);
            }, [])
    );
}

/**
 * Collects reactions that are part of a specific metabolic process along with
 * their metabolites and links between.
 * @param {string} process Identifier or name for a metabolic process.
 * @param {Object} model Information about entities and relations in a metabolic
 * model.
 * @returns {Array<Object>} Unique identifiers for network nodes.
 */
function collectProcessNetworkNodes(process, model) {
    var reactions = Object.values(
        model.network_elements.nodes.reactions
    )
        .filter(function (reaction) {
            return reaction.process === process;
        });
    var reactionIdentifiers = collectValuesFromObjects(reactions, "id");
    var metaboliteIdentifiers = collectMetabolitesOfReactions(
        reactionIdentifiers, model
    );
    return [].concat(reactionIdentifiers, metaboliteIdentifiers);

    //var collection = collectUniqueElements(metabolites)
    //    .reduce(function (accumulator, identifier) {
    //        return accumulator.union(network.getElementById(identifier));
    //    }, reactions);
    //return collection.union(collection.nodes().edgesWith(collection.nodes()));
}

// TODO: Include transport reactions.
// TODO: Prioritize which transport reactions to include by those with the least number of reactants/products.
// TODO: Otherwise, there are a lot of transport reactions that are not primarily for the relevant metabolites.
// 2. Recursively find pairs or collections of metabolites... oh... just use the metabolite identifier in the node's data!

function includeTransportReactions() {
    // Determine whether or not multiple compartmental version of the same
    // metabolite participate in the process.
    var sets = initialMetabolites
        .reduce(function (accumulator, compartmentalIdentifier, index, array) {
            if (
                accumulator.filter(function (element) {
                    return element.includes(compartmentalIdentifier);
                }).length < 1
            ) {
                // The identifier for the compartmental metabolite is not
                // already in the collection.
                var identifier = model
                    .network_elements
                    .nodes
                    .filter(function (node) {
                        return node.data.type === "metabolite";
                    })
                    .filter(function (node) {
                        return node.data.id === compartmentalIdentifier;
                    })[0]
                    .data
                    .metabolite;
                var set = array.filter(function (element) {
                    return model
                            .network_elements
                            .nodes
                            .filter(function (node) {
                                return node.data.type === "metabolite";
                            })
                            .filter(function (node) {
                                return node.data.id === element;
                            })[0]
                            .data
                            .metabolite === identifier;
                });
                if (set.length > 1) {
                    // Multiple compartmental versions of the same metabolite
                    // participate in the process.
                    return accumulator.concat([set]);
                } else {
                    return accumulator;
                }
            } else {
                return accumulator;
            }
        }, []);
    console.log(sets);
    // TODO: Now filter reactions for reactions that involve combinations of the compartmental metabolites in reactants or products...
    // TODO: For simplicity, consider all reactants and products of the reaction together (collectMetabolitesOfReactions).
    // TODO: Be sure to consider all possible permutations of the compartmental metabolites.
    // TODO: An easy way to do that might be to select all reactions that involve >= 2 of the compartmental metabolites either as reactants or products.
    // Identify putative transport reactions as those whose metabolites
    // (reactants or products) include multiple compartmental metabolites from
    // the set.
    var transportReactions = model
        .network_elements
        .nodes
        .filter(function (node) {
            return node.data.type === "reaction";
        })
        .filter(function (reaction) {
            return sets.some(function (set) {
                return set.filter(function (identifier) {
                        return [].concat(
                            reaction.data.products, reaction.data.reactants
                        ).includes(identifier);
                    }).length > 1;
            });
        });
    console.log(transportReactions);

    // TODO: I think the algorithm works up to this point.
    // TODO: Including these transport reactions increases the scale of the subnetwork dramatically.
    // TODO: There are a lot of transport reactions.
}

