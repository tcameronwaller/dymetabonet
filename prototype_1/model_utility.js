

////////////////////////////////////////////////////////////////////////////////
// This code is now scrap...

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
        .reduce(function (accumulator, value) {
            return Object.assign(accumulator, value);
        }, {});
    return metabolites;
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
        .reduce(function (accumulator, value) {
            return Object.assign(accumulator, value);
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
        .reduce(function (accumulator, value) {
            return Object.assign(accumulator, value);
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
            return determineUniqueCompartmentIdentifiers(
                Object.keys(metaboliteReaction.metabolites));
        })
        .reduce(function (accumulator, value) {
            return accumulator.concat(value);
        }, [])
        .reduce(function (accumulator, value) {
            if (Object.keys(accumulator).includes(value)) {
                accumulator[value] += 1;
            } else {
                accumulator[value] = 1;
            };
            return accumulator;
        }, {});
    return reactionCompartments;
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
    var compartmentAbbreviations = determineUniqueCompartmentIdentifiers(
        Object.keys(reaction.metabolites)
    );
    var compartments = compartmentAbbreviations
        .map(function (compartmentAbbreviation) {
            return determineCompartment(
                compartmentAbbreviation, modelCompartments
            );
        })
        .reduce(function (accumulator, value) {
            return Object.assign(accumulator, value);
        }, {});
    return compartments;
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
        .reduce(function (accumulator, value) {
            return Object.assign(accumulator, value);
        }, {});
    return compartments;
}

