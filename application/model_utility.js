
////////////////////////////////////////////////////////////////////////////////
// General Utility

/**
 * Collects unique elements.
 * @param {Array} elements Array of elements.
 * @returns {Array} Unique elements.
 */
function collectUniqueElements(elements) {
    // Collect and return unique elements.
    return elements
        .reduce(function (accumulator, value) {
            if (!accumulator.includes(value)) {
                return accumulator.concat(value);
            } else {
                return accumulator;
            }
        }, []);
}

/**
 * Compares two arrays by values of elements at specific indices.
 * @param {Array} firstArray Array of elements.
 * @param {Array} secondArray Array of elements.
 * @returns {boolean} Whether or not the arrays have identical values at every
 * index.
 */
function compareArraysByValuesIndices(firstArray, secondArray) {
    return firstArray.every(function (value, index) {
        return value === secondArray[index];
    });
}

/**
 * Compares two arrays by inclusion of elements.
 * @param {Array} firstArray Array of elements.
 * @param {Array} secondArray Array of elements.
 * @returns {boolean} Whether or not the first array includes all values of the
 * second array.
 */
function compareArraysByInclusion(firstArray, secondArray) {
    return secondArray.every(function (value, index) {
        return firstArray.includes(value);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Metabolites

/**
 * Determines general metabolite identifier from compartmental metabolite
 * identifier.
 * @param {string} compartmentalMetaboliteIdentifier Unique identifier of
 * compartmental metabolite.
 * @returns {string} Unique identifier of general metabolite.
 */
function extractMetaboliteIdentifier(compartmentalMetaboliteIdentifier) {
    // Select the portion of the compartmental metabolite identifier before the
    // underscore to obtain the general metabolite identifier.
    return compartmentalMetaboliteIdentifier
        .substring(0, compartmentalMetaboliteIdentifier.lastIndexOf("_"));
}

/**
 * Determines general metabolite identifiers from compartmental metabolite
 * identifiers.
 * @param {Array<string>} compartmentalMetaboliteIdentifiers Unique identifiers
 * of compartmental metabolites.
 * @returns {Array<string>} Unique identifiers of general metabolites.
 */
function extractMetaboliteIdentifiers(compartmentalMetaboliteIdentifiers) {
    // Collect the metabolite identifiers from the compartmental metabolite
    // identifiers.
    return compartmentalMetaboliteIdentifiers
        .map(extractMetaboliteIdentifier);
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
            return determineUniqueCompartmentIdentifiers(
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
    return (reaction.lower_bound < 0 && 0 < reaction.upper_bound);
}

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
 * @param {string} role Whether to select metabolites that participate as
 * reactant or product in the reaction.
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
 * Counts the unique compartments of a reaction's metabolites that participate
 * as either reactant or product.
 * @param {Object} reaction Information for a reaction.
 * @param {string} role Whether to select metabolites that participate as
 * reactant or product in the reaction.
 * @returns {number} Count of unique compartments.
 */
function countReactantProductCompartments(reaction, role) {
    return collectUniqueElements(
        extractCompartmentIdentifiers(
            filterReactionMetabolitesByRole(reaction, role)
        )
    )
        .length;
}

/**
 * Counts the unique compartments of a reaction's metabolites.
 * @param {Object} reaction Information for a reaction.
 * @returns {number} Count of unique compartments.
 */
function countReactionCompartments(reaction) {
    return collectUniqueElements(
        extractCompartmentIdentifiers(
            Object.keys(reaction.metabolites)
        )
    )
        .length;
}

/**
 * Determines whether or not the compartments of a reaction's reactant
 * metabolites are identical to those of its product metabolites.
 * @param {Object} reaction Information for a reaction.
 * @returns {boolean} Whether or not compartments change.
 */
function determineChangeCompartments(reaction) {
    var reactantCompartments = collectUniqueElements(
        extractCompartmentIdentifiers(
            filterReactionMetabolitesByRole(reaction, "reactant")
        )
    );
    var productCompartments = collectUniqueElements(
        extractCompartmentIdentifiers(
            filterReactionMetabolitesByRole(reaction, "product")
        )
    );
    return !(
        compareArraysByInclusion(reactantCompartments, productCompartments) &&
        compareArraysByInclusion(productCompartments, reactantCompartments) &&
        (reactantCompartments.length === productCompartments.length)
    );
}

/**
 * Determines whether or not a reaction's reactant and product metabolites
 * change chemically.
 * @param {Object} reaction Information for a reaction.
 * @returns {boolean} Whether or not metabolites change chemically.
 */
function determineChangeChemicals(reaction) {
    var reactantIdentifiers = collectUniqueElements(
        extractMetaboliteIdentifiers(
            filterReactionMetabolitesByRole(reaction, "reactant")
        )
    );
    var productIdentifiers = collectUniqueElements(
        extractMetaboliteIdentifiers(
            filterReactionMetabolitesByRole(reaction, "product")
        )
    );
    return !(
        compareArraysByInclusion(reactantIdentifiers, productIdentifiers) &&
        compareArraysByInclusion(productIdentifiers, reactantIdentifiers) &&
        (reactantIdentifiers.length === productIdentifiers.length)
    );
}

////////////////////////////////////////////////////////////////////////////////
// Compartments

/**
 * Determines compartment identifier from compartmental metabolite identifier.
 * @param {string} metaboliteIdentifier Unique identifier of compartmental
 * metabolite.
 * @returns {string} Identifier of compartment.
 */
function extractCompartmentIdentifier(metaboliteIdentifier) {
    // Select the portion of the metabolite identifier after the underscore to
    // obtain the compartment identifier.
    return metaboliteIdentifier
        .substring(metaboliteIdentifier.lastIndexOf("_") + 1);
}

/**
 * Determines compartment identifiers from compartmental metabolite identifiers.
 * @param {Array<string>} metaboliteIdentifiers Unique identifiers
 * of compartmental metabolites.
 * @returns {Array<string>} Identifiers of compartments.
 */
function extractCompartmentIdentifiers(metaboliteIdentifiers) {
    // Collect the compartment identifiers from the metabolite identifiers.
    return metaboliteIdentifiers
        .map(extractCompartmentIdentifier);
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
        .reduce(function (accumulator, currentValue) {
            return Object.assign(accumulator, currentValue);
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
        .reduce(function (accumulator, currentValue) {
            return Object.assign(accumulator, currentValue);
        }, {});
    return compartments;
}

