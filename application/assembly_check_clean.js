
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
            "Model Assembly, Check Genes: " + identifier +
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
 * Cleans the identifier of a single gene from a metabolic model.
 * @param {string} identifier Identifier of a single gene.
 * @param {string} Identifier of a gene.
 */
function cleanGeneIdentifier(identifier) {
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
    // Clean gene identifier.
    var identifier = cleanGeneIdentifier(gene.id);
    // Check gene.
    checkGene(identifier, genesFromReactions);
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

/**
 * Checks to ensure that a metabolite participates in at least one reaction in
 * the metabolic model.
 * @param {string} identifier Identifier of a single metabolite.
 * @param {Array<string>} metabolitesFromReactions Unique identifiers of all
 * metabolites that participate in reactions.
 * @returns {boolean} Whether or not the metabolite participates in at least one
 * reaction.
 */
function checkMetaboliteReactions(identifier, metabolitesFromReactions) {
    // Confirm that gene participates in at least one reaction.
    if (metabolitesFromReactions.includes(identifier)) {
        return true;
    } else {
        console.log(
            "Model Assembly, Check Metabolites: " + identifier +
            " failed reaction check."
        );
        return false;
    }
}

/**
 * Checks a single metabolite from a metabolic model.
 * @param {string} identifier Identifier of a single metabolite.
 * @param {Array<string>} metabolitesFromReactions Unique identifiers of all
 * metabolites that participate in reactions.
 */
function checkMetabolite(identifier, metabolitesFromReactions) {
    // Check metabolite association to reactions.
    checkMetaboliteReactions(identifier, metabolitesFromReactions);
}

/**
 * Creates a record for a single gene from a metabolic model.
 * @param {Object<string>} gene Information about a single gene.
 * @param {Array<string>} genesFromReactions Unique identifiers of all genes
 * that participate in reactions.
 * @returns {Object<string>} Information about a gene.
 */
function checkCleanMetabolite(metabolite, metabolitesFromReactions) {
    // Clean metabolite identifier.
    //var identifier = cleanGeneIdentifier(gene.id);
    // Check metabolite.
    checkMetabolite(identifier, metabolitesFromReactions);
    return {
        id: identifier,
        name: gene.name
    };
}

/**
 * Extracts records for compartmental metabolites and organizes these within
 * records for general metabolites.
 * @param {Array<Object<string>>} metabolites Information about all metabolites
 * in a metabolic model.
 * @returns {Object<Object<string>>} Records for compartmental metabolites
 * within records for general metabolites.
 */
function extractMetaboliteSets(metabolites) {
    // The metabolic model has separate records for compartmental metabolites.
    // Split the array of metabolite records into collections of records for the
    // same chemical metabolite.
    return metabolites.reduce(function (collection, metabolite) {
        // Extract the identifier of the general metabolite from the identifier
        // of the compartmental metabolite.
        var metaboliteIdentifier = extractMetaboliteIdentifier(metabolite.id);
        if (!Object.keys(collection).includes(metaboliteIdentifier)) {
            // The collection does not yet have a record for the general
            // metabolite.
            // Create a new record for the general metabolite and create a new
            // record for the compartmental metabolite within it.
            var newMetaboliteSet = {
                [metaboliteIdentifier]: {
                    [metabolite.id]: metabolite
                }
            };
            return Object.assign({}, collection, newMetaboliteSet);
        } else {
            // The collection already has a record for the general metabolite.
            // Include a record for the compartmental metabolite within the
            // record for the general metabolite.
            // The new record for the general metabolite will write over the
            // previous record.

            // TODO: I think there is some problem in the way I handle adding new compartmental records to a general record.

            var newMetabolite = {
                [metabolite.id]: metabolite
            };
            var newMetaboliteSet = Object
                .assign({}, collection[metaboliteIdentifier], newMetabolite);
            return Object.assign({}, collection, newMetaboliteSet);
        }
    }, {});
}


/**
 * Checks and cleans information about metabolites in a metabolic model.
 * @param {Array<Object<string>>} metabolites Information about all metabolites
 * in a metabolic model.
 * @param {Array<Object<string>>} reactions Information about all reactions in a
 * metabolic model.
 * @returns {Array<Object<string>>} Information about metabolites.
 */
function checkCleanMetabolites(metabolites, reactions) {
    // Collect unique identifiers of all metabolites that participate in
    // reactions.
    var metabolitesFromReactions = collectUniqueElements(
        extractMetabolitesFromReactions(reactions)
    );
    // The metabolic model has separate records for compartmental metabolites.
    // Multiple distinct compartmental metabolites can be chemically-identical.
    // Clean records for all chemically-identical metabolites together to
    // eliminate discrepancies in attributes that should be identical.
    // Split the array of metabolite records into collections of records for the
    // same chemical metabolite.
    var metaboliteSets = extractMetaboliteSets(metabolites);
    console.log(metaboliteSets);
    // Check and clean all metabolites.
    //return metabolites.map(function (metabolite) {
    //    return checkCleanMetabolite(metabolite, metabolitesFromReactions);
    //});
}

////////////////////////////////////////////////////////////////////////////////
// Check and Clean Information about Reactions

// TODO: Check that every reaction associates with metabolites AND that those metabolites are in the model.


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
    var compartments = checkCleanCompartments(data.compartments);
    var genes = checkCleanGenes(data.genes, data.reactions);
    var metabolites = checkCleanMetabolites(data.metabolites, data.reactions);
    //var reactions = checkCleanReactions(data.reactions, metabolites, genes);
    return {
        sets: {
            compartments: compartments,
            genes: genes,
            id: data.id,
            metabolites: metabolites,
            //reactions: reactions,
            version: data.version
        }
    }
}
