
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
    // This function assumes that the compartment identifier is always the last
    // part of the metabolite identifier with underscore delimiter.
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

/**
 * Filters a model's compartmental metabolites by their identity to a general
 * metabolite.
 * @param {Array<Object>} metabolites Information for metabolites in the model.
 * @param {string} metaboliteIdentifier Unique identifier of general metabolite.
 * @returns {Array<string>} Identifiers for compartmental metabolites that are
 * chemically identical to the general metabolite.
 */
function filterCompartmentalMetabolitesByMetabolite(
    metabolites, metaboliteIdentifier
) {
    // Select compartmental records for a general metabolite.
    return metabolites.filter(function (metabolite) {
        return extractMetaboliteIdentifier(metabolite.id) ===
            metaboliteIdentifier;
    });
}

////////////////////////////////////////////////////////////////////////////////
// Reactions

/**
 * Extracts identifiers of genes from a reaction's gene reaction rule.
 * @param {string} geneReactionRule Rule for a reaction's gene requirements.
 * @returns {Array<string>} Identifiers of genes that participate in the
 * reaction.
 */
function extractGenesFromRule(geneReactionRule) {
    return replaceAllString(
        replaceAllString(
            geneReactionRule, "(", ""
        ), ")", ""
    )
        .split(" ")
        .filter(function (element) {
            return element.includes(":");
        });
}

/**
 * Extracts identifiers of genes from reactions.
 * @param {Array<Object<string>>} reactions Information about all reactions in a
 * metabolic model.
 * @returns {Array<string>} Identifiers of genes from reactions.
 */
function extractGenesFromReactions(reactions) {
    return reactions.reduce(function (collection, reaction) {
        if (reaction.gene_reaction_rule) {
            // Reaction has a non-empty gene reaction rule.
            var geneIdentifiers = extractGenesFromRule(
                reaction.gene_reaction_rule
            );
            return collection.concat(geneIdentifiers);
        } else {
            // Reaction has an empty gene reaction rule.
            return collection;
        }
    }, []);
}




/**
 * Filters a model's reactions by their inclusion of a gene.
 * @param {string} geneIdentifier Identifier of a gene.
 * @param {Array<Object>} reactions Information for reactions in the model.
 * @returns {Array<string>} Identifiers for reactions in which the gene
 * participates.
 */
function filterReactionsByGene(geneIdentifier, reactions) {
    return reactions.filter(function (reaction) {
        return extractGenesFromRule(reaction.gene_reaction_rule)
            .includes(geneIdentifier);
    });
}

/**
 * Counts the unique reactions in which a gene participates.
 * @param {string} geneIdentifier Identifier for a metabolite.
 * @param {Array<Object>} reactions Information for reactions in the model.
 * @returns {number} Count of unique reactions.
 */
function countGeneReactions(geneIdentifier, reactions) {
    return collectUniqueElements(
        filterReactionsByGene(
            geneIdentifier, reactions
        )
    )
        .length;
}

/**
 * Determines the value for a reaction's process.
 * @param {Object} reaction Information for a reaction.
 * @returns {string} The name of the process.
 */
function determineReactionProcess(reaction) {
    if (reaction.subsystem != undefined) {
        return reaction.subsystem;
    } else {
        return undefined;
    }
}

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
 * Filters a model's reactions by their inclusion of a compartmental metabolite.
 * @param {string} metaboliteIdentifier Identifier of a compartmental
 * metabolite.
 * @param {Array<Object>} reactions Information for reactions in the model.
 * @returns {Array<string>} Identifiers for reactions in which the metabolite
 * participates.
 */
function filterReactionsByCompartmentalMetabolite(
    metaboliteIdentifier, reactions
) {
    // Select reactions in which a compartmental metabolite participates.
    return reactions.filter(function (reaction) {
        return (Object.keys(reaction.metabolites)
            .includes(metaboliteIdentifier));
    });
}

/**
 * Counts the unique reactions in which a compartmental metabolite participates.
 * @param {string} metaboliteIdentifier Identifier of a compartmental
 * metabolite.
 * @param {Array<Object>} reactions Information for reactions in the model.
 * @returns {number} Count of unique reactions.
 */
function countCompartmentalMetaboliteReactions(
    metaboliteIdentifier, reactions
) {
    return collectUniqueElements(
        filterReactionsByCompartmentalMetabolite(
            metaboliteIdentifier, reactions
        )
    )
        .length;
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