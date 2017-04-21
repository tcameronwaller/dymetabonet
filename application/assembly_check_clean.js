
////////////////////////////////////////////////////////////////////////////////
// Check and Clean Information about Compartments

/**
 * Checks and cleans information about a single compartment in a metabolic
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
 * Checks and cleans information about a single gene in a metabolic model.
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

// TODO: From "assembly_sets"...
// TODO: Change "pentenoyl" to "pentaenoyl"... see notes.
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
    // Confirm that metabolite participates in at least one reaction.
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
 * Checks and cleans the charge of a metabolite.
 * @param {string} identifier Identifier of a single general metabolite.
 * @param {Array<number>} charges Charges from all compartmental occurrences of
 * the general metabolite.
 * @returns {number} Consensus charge for the metabolite.
 */
function checkCleanMetaboliteCharge(identifier, charges) {
    // Filter falsy values from charges and collect unique elements.
    var uniqueCharges = collectUniqueElements(charges.filter(function (charge) {
        return !!charge;
    }));
    // Determine consensus charge.
    if (uniqueCharges.length <= 1) {
        // There is not a discrepancy in the charges.
        return uniqueCharges[0];
    } else {
        console.log(
            "Model Assembly, Check Metabolites: " + identifier +
            " failed charge check."
        );
        return uniqueCharges[0];
    }
}

/**
 * Checks and cleans the formula of a metabolite.
 * @param {string} identifier Identifier of a single general metabolite.
 * @param {Array<string>} formulas Formulas from all compartmental occurrences
 * of the general metabolite.
 * @returns {string} Consensus formula for the metabolite.
 */
function checkCleanMetaboliteFormula(identifier, formulas) {
    // Filter falsy values from formulas and collect unique elements.
    var uniqueFormulas = collectUniqueElements(
        formulas.filter(function (formula) {
            return !!formula;
        })
    );
    // There is a discrepancy in the formulas.
    // Chemical formulas for some metabolites in the model might include an
    // "R" character to denote an ambiguous alkyl substituent.
    // The "R" character does not denote any specific chemical element.
    // Inclusion of this nonspecific formula can impart discrepancies.
    var specificFormulas = uniqueFormulas.filter(function (formula) {
        return !formula.includes("R");
    });
    // Determine consensus formula.
    if (uniqueFormulas.length <= 1) {
        // There is not a discrepancy in the formulas.
        return uniqueFormulas[0];
    } else if (specificFormulas.length === 1) {
        // There is a single specific formula.
        return specificFormulas[0];
    } else if (specificFormulas.length > 1) {
        // There is a discrepancy between multiple specific formulas.
        return specificFormulas[0];
    } else if (specificFormulas.length < 1) {
        // There are zero specific formulas.
        return uniqueFormulas[0];
    } else {
        console.log(
            "Model Assembly, Check Metabolites: " + identifier +
            " failed formula check."
        );
        return uniqueFormulas[0];
    }
}

/**
 * Checks and cleans the name of a metabolite.
 * @param {string} identifier Identifier of a single general metabolite.
 * @param {Array<string>} names Names from all compartmental occurrences of the
 * general metabolite.
 * @param {Array<string>} compartments Compartments from all compartmental
 * occurrences of the general metabolite.
 * @returns {string} Consensus name for the metabolite.
 */
function checkCleanMetaboliteName(identifier, names, compartments) {
    // Correct individual errors.
    var newNames = names.map(function (name) {
        if (name === "2,4,7,10,13-hexadecapentenoylcoa") {
            return "2,4,7,10,13-hexadecapentaenoylcoa";
        } else {
            return name;
        }
    });
    // Filter falsy values from names and collect unique elements.
    var uniqueNames = collectUniqueElements(
        newNames.filter(function (name) {
            return !!name;
        })
    );
    // Names for some metabolites in the model might include identifiers of
    // the compartment in which the metabolite occurs.
    // Inclusion of these compartmental identifiers in the names can impart
    // discrepancies.
    var simpleNames = collectUniqueElements(
        newNames.map(function (name, index) {
            if (
                (extractCompartmentIdentifier(name)) &&
                (extractCompartmentIdentifier(name) === compartments[index])
            ) {
                // The name includes a non-falsy identifier that matches the
                // compartment.
                return extractMetaboliteIdentifier(name);
            } else {
                return name;
            }
        })
    );
    // Names for some metabolites in the model might include designations of
    // stereoisomers around chirality centers.
    // While these stereoisomers are chemically distinct, the model might
    // give them the same identifier.
    // Inclusion of these designations of stereosymmetry without distinct
    // identifiers can impart discrepancies.
    var stereoNames = collectUniqueElements(
        newNames.map(function (name) {
            if ((name.includes("(R)")) || (name.includes("(S)"))) {
                // The name includes a designator of stereochemistry.
                var newName = name.replace("(R)", "(R-S)");
                return newName.replace("(S)", "(R-S)");
            } else {
                return name;
            }
        })
    );
    // Determine consensus name.
    if (uniqueNames.length <= 1) {
        // There is not a discrepancy in the names.
        return uniqueNames[0];
    } else if (simpleNames.length === 1) {
        // There is a discrepancy in the names.
        // Removal of identifiers of compartments resolves the discrepancy.
        return simpleNames[0];
    } else if (stereoNames.length === 1) {
        // There is a discrepancy in the names.
        // Removal of designations of stereosymmetry resolves the discrepancy.
        return stereoNames[0];
    } else {
        // Neither the correction for compartments nor stereosymmetry resolves
        // the discrepancy.
        console.log(
            "Model Assembly, Check Metabolites: " + identifier +
            " failed name check."
        );
        return uniqueNames[0];
    }
}

// TODO: This is the old implementation...
// TODO: Check this and then get rid of it.
/**
 * Determines a consensus name for a set of metabolites.
 * @param {Array<Object>} setMetabolites Information for all compartmental
 * metabolites that are chemically identical.
 * @returns {string} Consensus name for the set of metabolites.
 */
function determineMetaboliteSetName(setMetabolites) {
    var names = collectValuesFromObjects(setMetabolites, "name");
    if (collectUniqueElements(names).length <= 1) {
        return collectUniqueElements(names)[0];
    } else if (
        (setMetabolites.every(function (metabolite) {
            return (metabolite.name.includes("_")) &&
                (metabolite.compartment ===
                extractCompartmentIdentifier(metabolite.name));
        })) &&
        (
            collectUniqueElements(
                extractMetaboliteIdentifiers(names)
            ).length === 1
        )
    ) {
        // Names for some metabolites in the model might include compartment
        // identifiers.
        // Inclusion of these compartment identifiers in the names can impart
        // discrepancies in separate records fro the same metabolite.
        return collectUniqueElements(extractMetaboliteIdentifiers(names))[0];
    } else if (
        (names.find(function (name) {
            return name.includes("(R)") || name.includes("(S)");
        }) != undefined) &&
        (collectUniqueElements(names.map(function (name) {
            return name.replace("(R)", "(R/S)");
        }).map(function (name) {
            return name.replace("(S)", "(R/S)");
        })).length === 1)
    ) {
        // Names for some metabolites in the model might include designations of
        // stereoisomers around chirality centers.
        // While these stereoisomers are chemically distinct, the model might
        // give them the same identifier.
        return collectUniqueElements(names.map(function (name) {
            return name.replace("(R)", "(R/S)");
        }).map(function (name) {
            return name.replace("(S)", "(R/S)");
        }))[0];
    } else {
        //console.log("name discrepancy");
        //console.log(setMetabolites);
        return names[0];
    }
}

/**
 * Checks and cleans information about a single general metabolite in a
 * metabolic model.
 * @param {Object<string>} metaboliteSet Information about a single general
 * metabolite and all of its compartmental occurrences.
 * @param {Array<string>} metabolitesFromReactions Unique identifiers of all
 * metabolites that participate in reactions.
 * @returns {Array<Object<string>>} Information about a metabolite.
 */
function checkCleanMetabolite(metaboliteSet, metabolitesFromReactions) {
    // Identifier.
    // Check metabolite association to reactions.
    var identifiers = metaboliteSet.compartments.map(function (compartment) {
        return metaboliteSet.id + "_" + compartment;
    });
    identifiers.forEach(function (identifier) {
        checkMetaboliteReactions(identifier, metabolitesFromReactions);
    });
    // Charge.
    var charge = checkCleanMetaboliteCharge(
        metaboliteSet.id, metaboliteSet.charges
    );
    // Formula.
    var formula = checkCleanMetaboliteFormula(
        metaboliteSet.id, metaboliteSet.formulas
    );
    // Name.
    var name = checkCleanMetaboliteName(
        metaboliteSet.id, metaboliteSet.names, metaboliteSet.compartments
    );
    // Create records for compartmental metabolites.
    return metaboliteSet.compartments.map(function (compartment) {
        var identifier = metaboliteSet.id + "_" + compartment;
        return {
            charge: charge,
            id: identifier,
            formula: formula,
            name: name
        };
    });
}

/**
 * Extracts attributes from records for compartmental metabolites and organizes
 * these within records for general metabolites.
 * @param {Array<Object<string>>} metabolites Information about all metabolites
 * in a metabolic model.
 * @returns {Object<Array<string>>} Attributes of compartmental metabolites
 * within records for general metabolites.
 */
function extractMetaboliteSetAttributes(metabolites) {
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
            // Create a new record for the general metabolite with attributes
            // from the compartmental metabolite within the record for the
            // general metabolite.
            var newMetabolite = {
                [metaboliteIdentifier]: {
                    charges: [].concat(metabolite.charge),
                    compartments: [].concat(metabolite.compartment),
                    formulas: [].concat(metabolite.formula),
                    id: metaboliteIdentifier,
                    ids: [].concat(metabolite.id),
                    names: [].concat(metabolite.name)
                }
            };
            return Object.assign({}, collection, newMetabolite);
        } else {
            // The collection already has a record for the general metabolite.
            // Include the attributes from the compartmental metabolite within the
            // record for the general metabolite.
            // The new record for the general metabolite will write over the
            // previous record.
            var oldMetabolite = collection[metaboliteIdentifier];
            var newMetabolite = {
                [metaboliteIdentifier]: {
                    charges: oldMetabolite.charges.concat(metabolite.charge),
                    compartments: oldMetabolite
                        .compartments
                        .concat(metabolite.compartment),
                    formulas: oldMetabolite.formulas.concat(metabolite.formula),
                    id: metaboliteIdentifier,
                    ids: oldMetabolite.ids.concat(metabolite.id),
                    names: oldMetabolite.names.concat(metabolite.name)
                }
            };
            return Object.assign({}, collection, newMetabolite);
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
    var metaboliteSets = extractMetaboliteSetAttributes(metabolites);

    // TODO: Take this metabolite information and use it to re-create the records for compartmental metabolites.
    var metabolites = Object.values(metaboliteSets)
        .reduce(function (collection, metaboliteSet) {
            return collection.concat(checkCleanMetabolite(
                metaboliteSet, metabolitesFromReactions
            ));
        }, []);
    // TODO: Now expand the information to multiple compartmental records for each metabolite.
    console.log(metaboliteSets);
    console.log(metabolites);
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
