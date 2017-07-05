
////////////////////////////////////////////////////////////////////////////////
// Check and Clean Information about Metabolites




////////////////////////////////////////////////////////////////////////////////
// Check and Clean Information about Reactions

/**
 * Checks and cleans the gene rule of a reaction.
 * @param {string} identifier Identifier of a single reaction.
 * @param {string} geneRule Requirements of a reaction for genes.
 * @param {Array<string>} geneIdentifiers Identifiers of all genes in a
 * metabolic model.
 * @returns {string} Gene rule for the reaction.
 */
function checkCleanReactionGenes(identifier, geneRule, geneIdentifiers) {
    // Correct errors in gene rule.
    if (!geneRule.includes("HGNC:HGNC:")) {
        var newGeneRule = geneRule;
    } else {
        var newGeneRule = replaceAllString(geneRule, "HGNC:HGNC:", "HGNC:");
    }
    // Extract gene identifiers from gene rule.
    var genes = extractGenesFromRule(newGeneRule);
    // Confirm that gene participates in at least one reaction.
    if (genes.every(function (gene) {
        return geneIdentifiers.includes(gene);
    })) {
        return newGeneRule;
    } else {
        console.log(
            "Model Assembly, Check Reactions: " + identifier +
            " failed genes check."
        );
        return newGeneRule;
    }
}

/**
 * Checks and cleans the lower and upper boundaries of a reaction.
 * @param {string} identifier Identifier of a single reaction.
 * @param {number} lowBound Lower boundary of reaction.
 * @param {number} upBound Upper boundary of reaction.
 * @returns {Object<number>} Boundaries for the reaction.
 */
function checkCleanReactionBounds(identifier, lowBound, upBound) {
    // The lower and upper bounds of the reaction indicate the directionality
    // and reversibility of the reaction.
    // The upper bound should never be zero.
    // That situation might imply that the reaction proceeds only in the reverse
    // direction.
    // Both the lower and upper bounds should not have values of zero
    // simultaneously.
    // That situation might imply that the reaction proceeds in neither
    // direction.
    if ((lowBound <= 0) && (upBound > 0)) {
        return {
            lower: lowBound,
            upper: upBound
        };
    } else {
        console.log(
            "Model Assembly, Check Reactions: " + identifier +
            " failed bounds check."
        );
        return {
            lower: lowBound,
            upper: upBound
        };
    }
}

/**
 * Checks and cleans the metabolites of a reaction.
 * @param {string} identifier Identifier of a single reaction.
 * @param {Object<number>} metabolites Metabolites of a reaction.
 * @param {Array<string>} metaboliteIdentifiers Identifiers of all metabolites
 * in a metabolic model.
 * @returns {Object<number>} Metabolites of the reaction.
 */
function checkCleanReactionMetabolites(
    identifier, metabolites, metaboliteIdentifiers
) {
    // Confirm that metabolites participate in the reaction.
    if ((metabolites) && (Object.keys(metabolites).length > 0)) {
        // Extract metabolite identifiers and role indicators from reaction.
        var reactionMetaboliteIdentifiers = Object.keys(metabolites);
        var reactionMetaboliteRoles = Object.values(metabolites);
        // Confirm that every metabolite has a record and participates as either
        // a reactant or a product in the reaction.
        var record = reactionMetaboliteIdentifiers
            .every(function (metaboliteIdentifier) {
            return metaboliteIdentifiers.includes(metaboliteIdentifier);
        });
        // The role indicator is not only an integer of -1 or 1.
        // It is sometimes a float of < 0 or > 0.
        var role = reactionMetaboliteRoles.every(function (roleValue) {
            return (roleValue < 0) || (roleValue > 0);
        });
        if (record && role) {
            return Object.assign({}, metabolites);
        } else {
            console.log(
                "Model Assembly, Check Reactions: " + identifier +
                " failed metabolites check."
            );
            return Object.assign({}, metabolites);
        }
    } else {
        console.log(
            "Model Assembly, Check Reactions: " + identifier +
            " failed metabolites check."
        );
        return Object.assign({}, metabolites);
    }
}

/**
 * Checks and cleans information about a single reaction in a metabolic model.
 * @param {Object<string>} reaction Information about a single reaction.
 * @param {Array<string>} metaboliteIdentifiers Identifiers of all metabolites
 * in a metabolic model.
 * @param {Array<string>} geneIdentifiers Identifiers of all genes in a
 * metabolic model.
 * @returns {Object<string>} Information about a reaction.
 */
function checkCleanReaction(reaction, metaboliteIdentifiers, geneIdentifiers) {
    // Genes.
    var genes = checkCleanReactionGenes(
        reaction.id, reaction.gene_reaction_rule, geneIdentifiers
    );
    // Identifier.
    var identifier = reaction.id;
    // Bounds.
    var bounds = checkCleanReactionBounds(
        identifier, reaction.lower_bound, reaction.upper_bound
    );
    // Metabolites.
    var metabolites = checkCleanReactionMetabolites(
        identifier, reaction.metabolites, metaboliteIdentifiers
    );
    // Name.
    var name = reaction.name;
    // Process
    var process = reaction.subsystem;
    // Create record for reaction.
    return {
        gene_reaction_rule: genes,
        id: identifier,
        lower_bound: bounds.lower,
        metabolites: metabolites,
        name: name,
        subsystem: process,
        upper_bound: bounds.upper
    };
}

/**
 * Checks and cleans information about reactions in a metabolic model.
 * @param {Array<Object<string>>} reactions Information about all reactions in a
 * metabolic model.
 * @param {Array<Object<string>>} metabolites Information about all metabolites
 * in a metabolic model.
 * @param {Array<Object<string>>} genes Information about all genes in a
 * metabolic model.
 * @returns {Array<Object<string>>} Information about metabolites.
 */
function checkCleanReactions(reactions, metabolites, genes) {
    // Collect identifiers of all metabolites in the model.
    var metaboliteIdentifiers = metabolites.map(function (metabolite) {
        return metabolite.id;
    });
    // Collect identifiers of all genes in the model.
    var geneIdentifiers = genes.map(function (gene) {
        return gene.id;
    });
    var newReactions = reactions.map(function (reaction) {
        return checkCleanReaction(
            reaction, metaboliteIdentifiers, geneIdentifiers
        );
    });
    return newReactions;
}

