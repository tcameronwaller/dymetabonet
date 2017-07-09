/**
 * Functionality of utility for extracting information about metabolic entities
 * and sets.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for external utility.
 */
class Extraction {
    // Master control of extraction procedure.
    /**
     * Extracts information about metabolic entities and sets from the Recon 2.2
     * model of human metabolism from systems biology.
     * @param {Object} data Information about a metabolic model from systems
     * biology, conversion from SBML to JSON formats by COBRApy and libSBML.
     * @param {Object<string>} data.compartments Identifiers and names of
     * compartments.
     * @param {Array<Object<string>>} data.genes Identifiers and names of genes.
     * @param {Array<Object<string>>} data.metabolites Information about
     * compartment-specific metabolites.
     * @param {Array<Object<string>>} data.reactions Information about
     * reactions.
     * @returns {Object} Information about metabolic entities and sets.
     */
    static extractRecon2(data) {
        // Extract information about sets.
        var compartments = Extraction
            .createCompartmentRecords(data.compartments);
        var genes = Extraction.createGeneRecords(data.genes);
        var processes = Extraction.createProcessRecords(data.reactions);
        // Extract information about entities.
        var metabolites = Extraction
            .createMetaboliteRecords(data.metabolites, data.reactions);
        var reactions = createReactionRecords(data.reactions, processes);
        return {
            compartments: compartments,
            genes: genes,
            processes: processes,
            metabolites: metabolites,
            reactions: reactions
        };
    }
    // Extract sets.
    // Extract compartments.
    /**
     * Creates records for all compartments in a metabolic model.
     * @param {Object} compartments Information about all compartments in a
     * metabolic model.
     * @returns {Object} Records for compartments.
     */
    static createCompartmentRecords(compartments) {
        // Create records for compartments.
        return Object.keys(compartments)
            .reduce(function (collection, identifier) {
                var newRecord = Extraction
                    .createCompartmentRecord(
                        identifier, compartments[identifier]
                    );
                return Object.assign({}, collection, newRecord);
            }, {});
    }
    /**
     * Creates a record for a single compartment in a metabolic model.
     * @param {string} identifier Identifier of a single compartment.
     * @param {string} name Name of a single compartment.
     * @returns {Object} Record for a compartment.
     */
    static createCompartmentRecord(identifier, name) {
        return {
            [identifier]: {
                identifier: identifier,
                name: name
            }
        };
    }
    // Extract genes.
    /**
     * Creates records for all genes in a metabolic model.
     * @param {Array<Object>} genes Information for all genes of a metabolic
     * model.
     * @returns {Object} Records for genes.
     */
    static createGeneRecords(genes) {
        // Create records for genes.
        return genes.reduce(function (collection, gene) {
            var newRecord = Extraction.createGeneRecord(gene);
            return Object.assign({}, collection, newRecord);
        }, {});
    }
    /**
     * Creates a record for a single gene in a metabolic model.
     * @param {Object<string>} gene Information about a single gene.
     * @returns {Object} Record for a gene.
     */
    static createGeneRecord(gene) {
        return {
            [gene.id]: {
                identifier: gene.id,
                name: gene.name
            }
        };
    }
    // Extract processes.
    /**
     * Creates records for all processes from a metabolic model.
     * @param {Array<Object>} reactions Information for all reactions of a
     * metabolic model.
     * @returns {Object} Records for processes.
     */
    static createProcessRecords(reactions) {
        // Create records for processes.
        // Assume that according to their annotation, all reactions in the
        // metabolic model participate in only a single metabolic process.
        // Include a set for undefined processes.
        return reactions.reduce(function (collection, reaction) {
            // Determine if the reaction has an annotation for process.
            if (reaction.subsystem) {
                var name = reaction.subsystem;
            } else {
                var name = "other";
            }
            // Determine if a record already exists for the process.
            if (Object.keys(collection).find(function (key) {
                    return collection[key].name === name;
                })) {
                return collection;
            } else {
                // Create record for the process.
                var newRecord = Extraction
                    .createProcessRecord(name, Object.keys(collection).length);
                return Object.assign({}, collection, newRecord);
            }
        }, {});
    }
    /**
     * Creates a record for a single metabolic process from a metabolic model.
     * @param {string} processName Name of a metabolic subsystem or process.
     * @param {number} length Length of collection of records for processes.
     * @returns {Object} Record for a process.
     */
    static createProcessRecord(processName, length) {
        var processIdentifier = "process_" + (length + 1).toString();
        return {
            [processIdentifier]: {
                identifier: processIdentifier,
                name: processName
            }
        };
    }
    // Extract entities.
    // Extract metabolites.
    /**
     * Creates records for all metabolites from a metabolic model.
     * @param {Array<Object>} metabolites Information for all metabolites of a
     * metabolic model.
     * @param {Array<Object>} reactions Information for all reactions in a
     * metabolic model.
     * @returns {Object<string>} Records for metabolites.
     */
    static createMetaboliteRecords(metabolites, reactions) {
        // Collect the identifiers of reactions in which each metabolite
        // participates.
        var metaboliteReactions = Extraction
            .collectMetaboliteReactions(reactions);
        // Create records for general metabolites, without consideration for
        // compartmental occurrence.
        // Create records for metabolites.
        return metabolites.reduce(function (collection, metabolite) {
            // Determine if a record already exists for the metabolite.
            var identifier = Clean.extractMetaboliteIdentifier(metabolite.id);
            if (collection.hasOwnProperty(identifier)) {
                // A record exists for the metabolite.
                return collection;
            } else {
                // A record does not exist for the metabolite.
                // Create a new record for the metabolite.
                var newRecord = Extraction
                    .createMetaboliteRecord(metabolite, metaboliteReactions);
                return Object.assign({}, collection, newRecord);
            }
        }, {});
    }
    /**
     * Collects the identifiers of all reactions in which each metabolite
     * participates.
     * @param {Array<Object>} reactions Information for all reactions in a
     * metabolic model.
     * @returns {Object<Array<string>>} Identifiers of reactions in which each
     * metabolite participates.
     */
    static collectMetaboliteReactions(reactions) {
        // To simplify the collection operation, flatten the information about
        // reactions and metabolites.
        var reactionsMetabolites = Extraction
            .extractReactionMetabolitePairs(reactions);
        // Collect the identifiers of reactions in which each metabolite
        // participates.
        // Assume that every metabolite in the model participates in at least
        // one reaction.
        return reactionsMetabolites
            .reduce(function (metaboliteReactions, pair) {
                if (metaboliteReactions.hasOwnProperty(pair.metabolite)) {
                    // The collection has a record for the metabolite.
                    // Include the identifier of the current reaction in the
                    // record.
                    // The new record will replace the previous record.
                    var oldReactions = metaboliteReactions[pair.metabolite];
                    if (!oldReactions.includes(pair.reaction)) {
                        var newReactions = []
                            .concat(oldReactions, pair.reaction);
                    } else {
                        var newReactions = oldReactions;
                    }
                    var newRecord = {
                        [pair.metabolite]: newReactions
                    };
                    return Object.assign({}, metaboliteReactions, newRecord);
                } else {
                    // The collection does not have a record for the metabolite.
                    // Create a new record for the metabolite and include the
                    // identifier of the current reaction.
                    var newRecord = {
                        [pair.metabolite]: [].concat(pair.reaction)
                    };
                    return Object.assign({}, metaboliteReactions, newRecord);
                }
            }, {});
    }
    /**
     * Extracts identifiers of metabolites from reactions and associates these
     * with identifiers of the reactions in which they participate.
     * @param {Array<Object>} reactions Information for all reactions in a
     * metabolic model.
     * @returns {Array<Object<string>>} Identifiers of metabolites with
     * identifiers of the reactions in which they participate.
     */
    static extractReactionMetabolitePairs(reactions) {
        return reactions.reduce(function (collection, reaction) {
            // Extract the identifiers of all metabolites that participate in
            // the reaction, and associate these with the identifier of the
            // reaction.
            var pairs = Object
                .keys(reaction.metabolites)
                .map(function (identifier) {
                    var metaboliteIdentifier = Clean
                        .extractMetaboliteIdentifier(identifier);
                    return {
                        metabolite: metaboliteIdentifier,
                        reaction: reaction.id
                    };
                });
            return [].concat(collection, pairs);
        }, []);
    }
    /**
     * Creates a record for a single metabolite from a metabolic model.
     * @param {Object<string>} metabolite Information about a single metabolite.
     * @param {Object<Array<string>>} metaboliteReactions Identifiers of
     * reactions in which each metabolite participates.
     * @returns {Object} Record for a metabolite.
     */
    static createMetaboliteRecord(metabolite, metaboliteReactions) {
        // Previous checks and cleans of the data ensure that attributes
        // specific to general metabolites are consistent without discrepancies
        // between records for compartmental metabolites.
        var identifier = Clean.extractMetaboliteIdentifier(metabolite.id);
        return {
            [identifier]: {
                charge: metabolite.charge,
                formula: metabolite.formula,
                identifier: identifier,
                name: metabolite.name,
                reactions: metaboliteReactions[identifier]
            }
        };
    }
    // Extract reactions.
}