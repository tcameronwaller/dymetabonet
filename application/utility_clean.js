/**
 * Functionality of utility for checking and cleaning information about
 * metabolic entities and sets.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for external utility.
 */
class Clean {
    // Master control of check and clean procedure.
    /**
     * Checks information in the Recon 2.2 model of human metabolism from
     * systems biology and cleans errors.
     * @param {Object} data Information about a metabolic model from systems
     * biology, conversion from SBML to JSON formats by COBRApy and libSBML.
     * @returns {Object} Information about a metabolic model from systems
     * biology.
     */
    static checkCleanRecon2(data) {
        var compartments = Clean.checkCleanCompartments(data.compartments);
        var genes = Clean.checkCleanGenes(data.genes, data.reactions);
        var metabolites = Clean.checkCleanMetabolites(
            data.metabolites, data.reactions
        );
        var reactions = Clean.checkCleanReactions(
            data.reactions, metabolites, genes
        );
        return {
            compartments: compartments,
            genes: genes,
            id: data.id,
            metabolites: metabolites,
            reactions: reactions,
            version: data.version
        };
    }
    // Check and clean compartments.
    /**
     * Checks and cleans information about compartments in a metabolic model.
     * @param {Object} compartments Information about all compartments in a
     * metabolic model.
     * @returns {Object} Information about compartments.
     */
    static checkCleanCompartments(compartments) {
        return Object.keys(compartments)
            .reduce(function (collection, identifier) {
                return Object.assign(
                    {},
                    collection,
                    Clean.checkCleanCompartment(
                        identifier, compartments[identifier]
                    )
                );
            }, {});
    }
    /**
     * Checks and cleans information about a single compartment in a metabolic
     * model.
     * @param {string} identifier Identifier of a single compartment.
     * @param {string} name Name of a single compartment.
     * @returns {Object} Information about a compartment.
     */
    static checkCleanCompartment(identifier, name) {
        var newCompartmentNames = {
            b: "boundary",
            c: "cytosol",
            e: "exterior",
            g: "golgi",
            i: "mito ims",
            l: "lysosome",
            m: "mito matrix",
            n: "nucleus",
            r: "reticulum",
            x: "peroxisome"
        };
        return {[identifier]: newCompartmentNames[identifier]};
    }
    // Check and clean genes.
    /**
     * Checks and cleans information about genes in a metabolic model.
     * @param {Array<Object<string>>} genes Information about all genes in a
     * metabolic model.
     * @param {Array<Object<string>>} reactions Information about all reactions
     * in a metabolic model.
     * @returns {Array<Object<string>>} Information about genes.
     */
    static checkCleanGenes(genes, reactions) {
        // Collect unique identifiers of all genes that participate in
        // reactions.
        var genesFromReactions = General.collectUniqueElements(
            Clean.extractGenesFromReactions(reactions)
        );
        // Check and clean all genes.
        return genes.map(function (gene) {
            return Clean.checkCleanGene(gene, genesFromReactions);
        });
    }
    /**
     * Extracts identifiers of genes from reactions.
     * @param {Array<Object<string>>} reactions Information about all reactions
     * in a metabolic model.
     * @returns {Array<string>} Identifiers of genes from reactions.
     */
    static extractGenesFromReactions(reactions) {
        return reactions.reduce(function (collection, reaction) {
            if (reaction.gene_reaction_rule) {
                // Reaction has a non-empty gene reaction rule.
                var geneIdentifiers = Clean.extractGenesFromRule(
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
     * Extracts identifiers of genes from a reaction's gene reaction rule.
     * @param {string} geneReactionRule Rule for a reaction's gene requirements.
     * @returns {Array<string>} Identifiers of genes that participate in the
     * reaction.
     */
    static extractGenesFromRule(geneReactionRule) {
        return General.replaceAllString(
            General.replaceAllString(geneReactionRule, "(", ""), ")", ""
        )
            .split(" ")
            .filter(function (element) {
                return element.includes(":");
            });
    }
    /**
     * Checks and cleans information about a single gene in a metabolic model.
     * @param {Object<string>} gene Information about a single gene.
     * @param {Array<string>} genesFromReactions Unique identifiers of all genes
     * that participate in reactions.
     * @returns {Object<string>} Information about a gene.
     */
    static checkCleanGene(gene, genesFromReactions) {
        // Clean gene identifier.
        var identifier = Clean
            .checkCleanGeneIdentifier(gene.id, genesFromReactions);
        return {
            id: identifier,
            name: gene.name
        };
    }
    /**
     * Checks and cleans the identifier of a gene.
     * @param {string} identifier Identifier of a single gene.
     * @param {Array<string>} genesFromReactions Unique identifiers of all genes
     * that participate in reactions.
     * @returns {string} Identifier of a gene.
     */
    static checkCleanGeneIdentifier(identifier, genesFromReactions) {
        // Correct errors in gene identifier.
        if (!identifier.includes("HGNC:HGNC:")) {
            var newIdentifier = identifier;
        } else {
            var newIdentifier = General
                .replaceAllString(identifier, "HGNC:HGNC:", "HGNC:");
        }
        // Confirm that gene participates in at least one reaction.
        if (genesFromReactions.includes(newIdentifier)) {
            return newIdentifier;
        } else {
            console.log(
                "Model Assembly, Check Genes: " + newIdentifier +
                " failed reaction check."
            );
            return newIdentifier;
        }
    }







    // Check and clean metabolites.

    // Check and clean reactions.
}