/**
* Functionality of utility for checking and cleaning information about
* metabolic entities and sets.
* This class does not store any attributes and does not require instantiation.
* This class stores methods for external utility.
*/
class Clean {
  // Master control of check and clean procedure.
  /**
  * Checks and cleans errors in information about metabolic entities and sets
  * from the Recon 2.2 model of human metabolism from systems biology.
  * @param {Object} data Information about a metabolic model from systems
  * biology, conversion from SBML to JSON formats by COBRApy and libSBML.
  * @returns {Object} Information about a metabolic model from systems
  * biology.
  */
  static checkCleanMetabolicEntitiesSetsRecon2(data) {
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
  /**
  * Checks and cleans information about metabolites in a metabolic model.
  * @param {Array<Object<string>>} metabolites Information about all
  * metabolites in a metabolic model.
  * @param {Array<Object<string>>} reactions Information about all reactions
  * in a metabolic model.
  * @returns {Array<Object<string>>} Information about metabolites.
  */
  static checkCleanMetabolites(metabolites, reactions) {
    // Collect unique identifiers of all metabolites that participate in
    // reactions.
    var metabolitesFromReactions = General.collectUniqueElements(
      Clean.extractMetabolitesFromReactions(reactions)
    );
    // The metabolic model has separate records for compartmental
    // metabolites.
    // Multiple distinct compartmental metabolites can be chemically
    // identical.
    // Clean records for all chemically-identical metabolites together to
    // eliminate discrepancies in attributes that should be identical.
    // Split the array of metabolite records into collections of records for
    // the same chemical metabolite.
    var metaboliteSets = Clean.extractMetaboliteSetAttributes(metabolites);
    // Reproduce records for compartmental metabolites using consensus
    // attributes.
    var consensusMetabolites = Object.values(metaboliteSets)
    .reduce(function (collection, metaboliteSet) {
      return collection.concat(Clean.checkCleanMetabolite(
        metaboliteSet, metabolitesFromReactions
      ));
    }, []);
    return consensusMetabolites;
  }
  /**
  * Extracts identifiers of metabolites from reactions.
  * @param {Array<Object<string>>} reactions Information about all reactions
  * in a metabolic model.
  * @returns {Array<string>} Identifiers of metabolites from reactions.
  */
  static extractMetabolitesFromReactions(reactions) {
    return reactions.reduce(function (collection, reaction) {
      var metaboliteIdentifiers = Object.keys(reaction.metabolites);
      return collection.concat(metaboliteIdentifiers);
    }, []);
  }
  /**
  * Extracts attributes from records for compartmental metabolites and
  * organizes these within records for general metabolites.
  * @param {Array<Object<string>>} metabolites Information about all
  * metabolites in a metabolic model.
  * @returns {Object<Array<string>>} Attributes of compartmental metabolites
  * within records for general metabolites.
  */
  static extractMetaboliteSetAttributes(metabolites) {
    // The metabolic model has separate records for compartmental
    // metabolites.
    // Split the array of metabolite records into collections of records for
    // the same chemical metabolite.
    return metabolites.reduce(function (collection, metabolite) {
      // Extract the identifier of the general metabolite from the
      // identifier of the compartmental metabolite.
      var metaboliteIdentifier = Clean
      .extractMetaboliteIdentifier(metabolite.id);
      if (!collection.hasOwnProperty(metaboliteIdentifier)) {
        // The collection does not yet have a record for the general
        // metabolite.
        // Create a new record for the general metabolite with
        // attributes from the compartmental metabolite within the
        // record for the general metabolite.
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
        // The collection already has a record for the general
        // metabolite.
        // Include the attributes from the compartmental metabolite
        // within the record for the general metabolite.
        // The new record for the general metabolite will replace the
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
  * Extracts the identifier of a general metabolite from the identifier of a
  * compartmental metabolite.
  * @param {string} compartmentalMetaboliteIdentifier Identifier of a
  * compartmental metabolite.
  * @returns {string} Identifier of a general metabolite.
  */
  static extractMetaboliteIdentifier(compartmentalMetaboliteIdentifier) {
    // Select the portion of the compartmental metabolite identifier before
    // the last underscore to obtain the general metabolite identifier.
    return compartmentalMetaboliteIdentifier
    .substring(0, compartmentalMetaboliteIdentifier.lastIndexOf("_"));
  }
  /**
  * Checks and cleans information about a single general metabolite in a
  * metabolic model.
  * @param {Object<string>} metaboliteSet Information about a single general
  * metabolite and all of its compartmental occurrences.
  * @param {Array<string>} metabolitesFromReactions Unique identifiers of all
  * metabolites that participate in reactions.
  * @returns {Object<string>} Information about a metabolite.
  */
  static checkCleanMetabolite(metaboliteSet, metabolitesFromReactions) {
    // Identifier.
    // Check metabolite association to reactions.
    var identifiers = metaboliteSet
    .compartments.map(function (compartment) {
      return metaboliteSet.id + "_" + compartment;
    });
    identifiers.forEach(function (identifier) {
      Clean
      .checkMetaboliteReactions(identifier, metabolitesFromReactions);
    });
    // Charge.
    var charge = Clean.checkCleanMetaboliteCharge(
      metaboliteSet.id, metaboliteSet.charges
    );
    // Formula.
    var formula = Clean.checkCleanMetaboliteFormula(
      metaboliteSet.id, metaboliteSet.formulas
    );
    // Name.
    var name = Clean.checkCleanMetaboliteName(
      metaboliteSet.id, metaboliteSet.names, metaboliteSet.compartments
    );
    // Create records for compartmental metabolites.
    return metaboliteSet.compartments.map(function (compartment) {
      var identifier = metaboliteSet.id + "_" + compartment;
      return {
        charge: charge,
        compartment: compartment,
        formula: formula,
        id: identifier,
        name: name
      };
    });
  }
  /**
  * Checks to ensure that a metabolite participates in at least one reaction
  * in the metabolic model.
  * @param {string} identifier Identifier of a single metabolite.
  * @param {Array<string>} metabolitesFromReactions Unique identifiers of all
  * metabolites that participate in reactions.
  * @returns {boolean} Whether or not the metabolite participates in at least
  * one reaction.
  */
  static checkMetaboliteReactions(identifier, metabolitesFromReactions) {
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
  * @param {Array<number>} charges Charges from all compartmental occurrences
  * of the general metabolite.
  * @returns {number} Consensus charge for the metabolite.
  */
  static checkCleanMetaboliteCharge(identifier, charges) {
    // Filter falsy values from charges and collect unique elements.
    var uniqueCharges = General
    .collectUniqueElements(charges.filter(function (charge) {
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
  * @param {Array<string>} formulas Formulas from all compartmental
  * occurrences of the general metabolite.
  * @returns {string} Consensus formula for the metabolite.
  */
  static checkCleanMetaboliteFormula(identifier, formulas) {
    // Filter falsy values from formulas and collect unique elements.
    var uniqueFormulas = General.collectUniqueElements(
      formulas.filter(function (formula) {
        return !!formula;
      })
    );
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
  * @param {Array<string>} names Names from all compartmental occurrences of
  * the general metabolite.
  * @param {Array<string>} compartments Compartments from all compartmental
  * occurrences of the general metabolite.
  * @returns {string} Consensus name for the metabolite.
  */
  static checkCleanMetaboliteName(identifier, names, compartments) {
    // Correct individual errors.
    var newNames = names.map(function (name) {
      if (name === "2,4,7,10,13-hexadecapentenoylcoa") {
        return "2,4,7,10,13-hexadecapentaenoylcoa";
      } else {
        return name;
      }
    });
    // Filter falsy values from names and collect unique elements.
    var uniqueNames = General.collectUniqueElements(
      newNames.filter(function (name) {
        return !!name;
      })
    );
    // Names for some metabolites in the model might include identifiers of
    // the compartment in which the metabolite occurs.
    // Inclusion of these compartmental identifiers in the names can impart
    // discrepancies.
    var simpleNames = General.collectUniqueElements(
      newNames.map(function (name, index) {
        var compartmentIdentifier = Clean
        .extractCompartmentIdentifier(name);
        if (
          (compartmentIdentifier) &&
          (compartmentIdentifier === compartments[index])
        ) {
          // The name includes a non-falsy identifier that matches the
          // compartment.
          return Clean.extractMetaboliteIdentifier(name);
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
    var stereoNames = General.collectUniqueElements(
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
  /**
  * Determines compartment identifier from compartmental metabolite
  * identifier.
  * @param {string} compartmentalMetaboliteIdentifier Identifier of a
  * compartmental metabolite.
  * @returns {string} Identifier of compartment.
  */
  static extractCompartmentIdentifier(compartmentalMetaboliteIdentifier) {
    // Select the portion of the compartmental metabolite identifier after
    // the last underscore to obtain the compartment identifier.
    // This function assumes that the compartment identifier is always the
    // last part of the metabolite identifier with underscore delimiter.
    return compartmentalMetaboliteIdentifier
    .substring(compartmentalMetaboliteIdentifier.lastIndexOf("_") + 1);
  }
  // Check and clean reactions.
  /**
  * Checks and cleans information about reactions in a metabolic model.
  * @param {Array<Object<string>>} reactions Information about all reactions
  * in a metabolic model.
  * @param {Array<Object<string>>} metabolites Information about all
  * metabolites in a metabolic model.
  * @param {Array<Object<string>>} genes Information about all genes in a
  * metabolic model.
  * @returns {Array<Object<string>>} Information about metabolites.
  */
  static checkCleanReactions(reactions, metabolites, genes) {
    // Collect identifiers of all metabolites in the model.
    var metaboliteIdentifiers = metabolites.map(function (metabolite) {
      return metabolite.id;
    });
    // Collect identifiers of all genes in the model.
    var geneIdentifiers = genes.map(function (gene) {
      return gene.id;
    });
    var newReactions = reactions.map(function (reaction) {
      return Clean.checkCleanReaction(
        reaction, metaboliteIdentifiers, geneIdentifiers
      );
    });
    return newReactions;
  }
  /**
  * Checks and cleans information about a single reaction in a metabolic
  * model.
  * @param {Object<string>} reaction Information about a single reaction.
  * @param {Array<string>} metaboliteIdentifiers Identifiers of all
  * metabolites in a metabolic model.
  * @param {Array<string>} geneIdentifiers Identifiers of all genes in a
  * metabolic model.
  * @returns {Object<string>} Information about a reaction.
  */
  static checkCleanReaction(
    reaction, metaboliteIdentifiers, geneIdentifiers
  ) {
    // Genes.
    var genes = Clean.checkCleanReactionGenes(
      reaction.id, reaction.gene_reaction_rule, geneIdentifiers
    );
    // Identifier.
    var identifier = reaction.id;
    // Bounds.
    var bounds = Clean.checkCleanReactionBounds(
      identifier, reaction.lower_bound, reaction.upper_bound
    );
    // Metabolites.
    var metabolites = Clean.checkCleanReactionMetabolites(
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
  * Checks and cleans the gene rule of a reaction.
  * @param {string} identifier Identifier of a single reaction.
  * @param {string} geneRule Requirements of a reaction for genes.
  * @param {Array<string>} geneIdentifiers Identifiers of all genes in a
  * metabolic model.
  * @returns {string} Gene rule for the reaction.
  */
  static checkCleanReactionGenes(identifier, geneRule, geneIdentifiers) {
    // Correct errors in gene rule.
    if (!geneRule.includes("HGNC:HGNC:")) {
      var newGeneRule = geneRule;
    } else {
      var newGeneRule = General
      .replaceAllString(geneRule, "HGNC:HGNC:", "HGNC:");
    }
    // Extract gene identifiers from gene rule.
    var genes = Clean.extractGenesFromRule(newGeneRule);
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
  static checkCleanReactionBounds(identifier, lowBound, upBound) {
    // The lower and upper bounds of the reaction indicate the
    // directionality and reversibility of the reaction.
    // The upper bound should never be zero.
    // That situation might imply that the reaction proceeds only in the
    // reverse direction.
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
  * @param {Array<string>} metaboliteIdentifiers Identifiers of all
  * metabolites in a metabolic model.
  * @returns {Object<number>} Metabolites of the reaction.
  */
  static checkCleanReactionMetabolites(
    identifier, metabolites, metaboliteIdentifiers
  ) {
    // Confirm that metabolites participate in the reaction.
    if ((metabolites) && (Object.keys(metabolites).length > 0)) {
      // Extract metabolite identifiers and role indicators from reaction.
      var reactionMetaboliteIdentifiers = Object.keys(metabolites);
      var reactionMetaboliteRoles = Object.values(metabolites);
      // Confirm that every metabolite has a record and participates as
      // either a reactant or a product in the reaction.
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
}
