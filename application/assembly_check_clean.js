
////////////////////////////////////////////////////////////////////////////////
// Check and Clean Information about Compartments

/**
 * Checks and cleans information about a single compartment from a metabolic
 * model.
 * @param {string} identifier Identifier of a single compartment.
 * @param {string} name Name of a single compartment.
 * @returns {Object} Information about a compartment.
 */
function checkCleanCompartment(identifier, name) {
    var newCompartmentNames = {
        b: "boundary",
        c: "cytosol",
        e: "exterior",
        g: "golgi",
        i: "mitochondrial intermembrane",
        l: "lysosome",
        m: "mitochondrial matrix",
        n: "nucleus",
        r: "reticulum",
        x: "peroxisome"
    };
    return {
        [identifier]: newCompartmentNames[identifier]
    };
}

/**
 * Checks and cleans information about compartments in a metabolic model.
 * @param {Object} compartments Information about all compartments in a
 * metabolic model.
 * @returns {Object} Information about compartments.
 */
function checkCleanCompartments(compartments) {
    return Object.keys(compartments)
        .reduce(function (collection, identifier) {
            return Object.assign(
                {},
                collection,
                checkCleanCompartment(identifier, compartments[identifier])
            );
        }, {});
}

////////////////////////////////////////////////////////////////////////////////
// Check and Clean Information about Genes

/**
 * Checks to ensure that a gene participates in at least one reaction in the
 * metabolic model.
 * @param {string} identifier Identifier of a single gene.
 * @param {Array<string>} genesFromReactions Unique identifiers of all genes
 * that participate in reactions.
 * @returns {boolean} Whether or not the gene participates in at least one
 * reaction.
 */
function checkGeneReactions(identifier, genesFromReactions) {
    // Confirm that gene participates in at least one reaction.
    if (genesFromReactions.includes(identifier)) {
        return true;
    } else {
        console.log(
            "Check Genes: " + identifier +
            " failed reaction check."
        );
        return false;
    }
}

/**
 * Checks a single gene from a metabolic model.
 * @param {string} identifier Identifier of a single gene.
 * @param {Array<string>} genesFromReactions Unique identifiers of all genes
 * that participate in reactions.
 */
function checkGene(identifier, genesFromReactions) {
    // Check gene association to reactions.
    checkGeneReactions(identifier, genesFromReactions);
}

/**
 * Checks and cleans the identifier of a single gene from a metabolic model.
 * @param {string} identifier Identifier of a single gene.
 * @param {string} Identifier of a gene.
 */
function checkCleanGeneIdentifier(identifier) {
    if (!identifier.includes("HGNC:HGNC:")) {
        return identifier;
    } else {
        return identifier.replace("HGNC:", "");
    }
}

/**
 * Creates a record for a single gene from a metabolic model.
 * @param {Object<string>} gene Information about a single gene.
 * @param {Array<string>} genesFromReactions Unique identifiers of all genes
 * that participate in reactions.
 * @returns {Object<string>} Information about a gene.
 */
function checkCleanGene(gene, genesFromReactions) {
    // Check and clean gene identifier.
    var identifier = checkCleanGeneIdentifier(gene.id);
    // Check gene.
    checkGene(identifier, genesFromReactions)
    return {
            id: identifier,
            name: gene.name
    };
}

/**
 * Checks and cleans information about genes in a metabolic model.
 * @param {Array<Object<string>>} genes Information about all genes in a
 * metabolic model.
 * @param {Array<Object<string>>} reactions Information about all reactions in a
 * metabolic model.
 * @returns {Array<Object<string>>} Information about genes.
 */
function checkCleanGenes(genes, reactions) {
    // Collect unique identifiers of all genes that participate in reactions.
    var genesFromReactions = collectUniqueElements(
        extractGenesFromReactions(reactions)
    );
    // Check and clean all genes.
    return genes.map(function (gene) {
        return checkCleanGene(gene, genesFromReactions);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Check and Clean Information about Metabolites

// TODO: From "assembly_network"...
// TODO: Check that metabolite participates in at least 1 reaction.
// TODO: Use the genes code as a sort of template.

// TODO: From "assembly_sets"...
// TODO: Change (R) and (S) in names to (R/S) IF the metabolites otherwise have identical identifiers.
// TODO: Change less specific formulas (with Rs) to more specific.
// TODO: Remove compartment designators from names of metabolites.
// TODO: Change "pentenoyl" to "pentaenoyl"... see notes.
// TODO: Make sure that all metabolites in set have identical name, formula, charge, etc...
// TODO: Try to preserve information?


////////////////////////////////////////////////////////////////////////////////
// Cleaning of Data for Model

/**
 * Checks information in the Recon 2.2 model of human metabolism from systems
 * biology and cleans errors.
 * @param {Object} data Information about a metabolic model from systems
 * biology, conversion from SBML to JSON formats by COBRApy and libSBML.
 * @returns {Object} Information about a metabolic model from systems biology.
 */
function checkCleanRecon2(data) {
    return {
        sets: {
            compartments: checkCleanCompartments(data.compartments),
            genes: checkCleanGenes(data.genes, data.reactions),
            id: data.id,
            //metabolites: checkCleanMetabolites(data.metabolites),
            //reactions: checkCleanReactions(data.reactions),
            version: data.version
        }
    }
}
