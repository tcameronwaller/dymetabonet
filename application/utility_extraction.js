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
    static extractMetabolicEntitiesSetsRecon2(data) {
        // Extract information about sets.
        var compartments = Extraction
            .createCompartmentRecords(data.compartments);
        var genes = Extraction.createGeneRecords(data.genes);
        // TODO: Remove the "set" records for operations. I'll store this information differently...
        var operations = Extraction.createOperationRecords();
        var processes = Extraction.createProcessRecords(data.reactions);
        // TODO: Remove the "set" records for reversibilities. I'll store this information differently...
        var reversibilities = Extraction.createReversibilityRecords();
        // Extract information about entities.
        var metabolites = Extraction
            .createMetaboliteRecords(data.metabolites, data.reactions);
        // TODO: There are a lot of changes for reactions' records...
        var reactions = Extraction
            .createReactionRecords(data.reactions, processes);
        return {
            compartments: compartments,
            genes: genes,
            operations: operations,
            processes: processes,
            reversibilities: reversibilities,
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
    // Extract operations.
    /**
     * Creates records for all operations in a metabolic model.
     * @returns {Object} Records for operations.
     */
    static createOperationRecords() {
        // Reactions involve either chemical conversion or compartmental
        // transport.
        // Individual reactions can involve both operations.
        return {
            c: {
                identifier: "c",
                name: "conversion"
            },
            t: {
                identifier: "t",
                name: "transport"
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
    // Extract reversibilities.
    /**
     * Creates records for all reversibilities in a metabolic model.
     * @returns {Object} Records for reversibilities.
     */
    static createReversibilityRecords() {
        return {
            i: {
                identifier: "i",
                name: "irreversible"
            },
            r: {
                identifier: "r",
                name: "reversible"
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
                    .createMetaboliteRecord(
                        metabolite, metaboliteReactions[identifier]
                    );
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
     * @param {Array<string>} metaboliteReactions Identifiers of reactions in
     * which a single metabolite participates.
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
                reactions: metaboliteReactions
            }
        };
    }
    // Extract reactions.
    /**
     * Creates records for all reactions from a metabolic model.
     * @param {Array<Object>} reactions Information for all reactions in a
     * metabolic model.
     * @param {Object<string>} processes Information about all processes in a
     * metabolic model.
     * @returns {Object<string>} Records for reactions.
     */
    static createReactionRecords(reactions, processes) {
        // In the original data, metabolic processes or pathways do not include
        // transport reactions.
        // As a result, processes that disperse across multiple compartments are
        // discontinuous.
        // Discontinuous processes are not accurate representations of biology.
        // Render processes continuous by inclusion of transport reactions.
        // Determine metabolites and compartments that are candidates for
        // transport in each process.
        var processesTransports = Extraction
            .determineProcessesTransportCandidates(reactions, processes);
        // TODO: Now pass processesTransportCandidates to the reactions function.
        // Create records for reactions.
        // TODO: Procedure for individual reactions needs...
        // TODO: Records for processes (identifiers and names)
        // TODO: processesTransportCandidates
        return reactions.reduce(function (collection, reaction) {
            var newRecord = Extraction
                .createReactionRecord({
                    reaction: reaction,
                    processesTransports: processesTransports,
                    processes: processes
                });
            return Object.assign({}, collection, newRecord);
        }, {});
    }
    /**
     * Determines metabolites and compartments that are candidates for transport
     * in each process.
     * @param {Array<Object>} reactions Information for all reactions in a
     * metabolic model.
     * @param {Object<string>} processes Information about all processes in a
     * metabolic model.
     * @returns {Object<Object<Array<string>>>} Metabolites and compartments
     * that are candidates for transport in each process.
     */
    static determineProcessesTransportCandidates(reactions, processes) {
        // Collect metabolites that occur in each compartment of each process.
        var processesCompartmentsMetabolites = Extraction
            .collectProcessesCompartmentsMetabolites(reactions, processes);
        // Collect metabolites that occur in multiple compartments in each
        // process.
        var processesTransportCandidates = Extraction
            .collectProcessesTransportCandidates(
                processesCompartmentsMetabolites
            );
        return processesTransportCandidates;
    }
    /**
     * Collects metabolites that occur in each compartment of each process.
     * @param {Array<Object>} reactions Information for all reactions in a
     * metabolic model.
     * @param {Object<string>} processes Information about all processes in a
     * metabolic model.
     * @returns {Object<Object<Array<string>>>} Identifiers of metabolites that
     * occur in each compartment of each process.
     */
    static collectProcessesCompartmentsMetabolites(reactions, processes) {
        // Stratify metabolites by processes and compartments in which they
        // participate in reactions.
        // Iterate on reactions.
        return reactions.reduce(function (reactionsCollection, reaction) {
            var process = Extraction
                .determineReactionProcessIdentifier(
                    reaction.subsystem, processes
                );
            if (reactionsCollection.hasOwnProperty(process)) {
                // Collection has a record for the current process.
                // Preserve existing records in the collection.
                var metabolitesCollection = Object
                    .assign({}, reactionsCollection[process]);
            } else {
                // Collection does not have a record for the current process.
                // Create a new record.
                var metabolitesCollection = {};
            }
            var newMetabolitesCollection = Extraction
                .collectProcessCompartmentsMetabolites({
                    compartmentalMetabolites: Object.keys(reaction.metabolites),
                    oldMetabolitesCollection: metabolitesCollection
                });
            // Include information from current process record within the
            // collection.
            var newProcessRecord = {
                [process]: newMetabolitesCollection
            };
            var newReactionsCollection = Object
                .assign({}, reactionsCollection, newProcessRecord);
            return newReactionsCollection;
        }, {});
    }
    /**
     * Collects metabolites that occur in each compartment of a single process
     * for a single reaction.
     * @param {Object} parameters Destructured object of parameters.
     * @param {sting} parameters.compartmentalMetabolites Identifiers for
     * compartmental metabolites that participate in a reaction.
     * @param {Object<Object>} parameters.oldMetabolitesCollection
     * Collection of metabolites that occur in each compartment of a single
     * process.
     * @returns {Object<Array<string>>} Identifiers of metabolites that occur in
     * each compartment of a single process.
     */
    static collectProcessCompartmentsMetabolites({
        compartmentalMetabolites,
        oldMetabolitesCollection
                                                 } = {}) {
        // Iterate on compartmental metabolites.
        return compartmentalMetabolites
            .reduce(function (metabolitesCollection, compartmentalMetabolite) {
                var metabolite = Clean
                    .extractMetaboliteIdentifier(compartmentalMetabolite);
                var compartment = Clean
                    .extractCompartmentIdentifier(compartmentalMetabolite);
                if (metabolitesCollection.hasOwnProperty(compartment)) {
                    // Collection has a record for the current compartment.
                    // Preserve existing records in the collection.
                    var metabolites = metabolitesCollection[compartment]
                        .slice();
                } else {
                    // Collection does not have a record for the current
                    // compartment.
                    // Create a new record.
                    var metabolites = [];
                }
                var newMetabolites = [].concat(metabolites, metabolite);
                // Include information in the collection.
                var newCompartmentRecord = {
                    [compartment]: newMetabolites
                };
                var newMetabolitesCollection = Object
                    .assign({}, metabolitesCollection, newCompartmentRecord);
                return newMetabolitesCollection;
            }, oldMetabolitesCollection);
    }
    /**
     * Collects metabolites that occur in multiple compartments in each process.
     * @param {Object<Object<Array<string>>>} processesCompartmentsMetabolites
     * Identifiers of metabolites that occur in each compartment of each
     * process.
     * @returns {Object<Object<Array<string>>>} Metabolites and compartments
     * that are candidates for transport in each process.
     */
    static collectProcessesTransportCandidates(
        processesCompartmentsMetabolites
    ) {
        var processes = Object.keys(processesCompartmentsMetabolites);
        // Iterate on processes.
        return processes.reduce(function (processesCollection, process) {
            // Collect total metabolites for all compartments in the process.
            var processRecord = processesCompartmentsMetabolites[process];
            var compartments = Object.keys(processRecord);
            // Iterate on compartments.
            var totalMetabolites = compartments
                .reduce(function (compartmentsCollection, compartment) {
                    var compartmentalMetabolites = processRecord[compartment];
                    return []
                        .concat(
                            compartmentsCollection, compartmentalMetabolites
                        );
                }, []);
            // Collect unique metabolites for all compartments in the process.
            var uniqueMetabolites = General
                .collectUniqueElements(totalMetabolites);
            // Determine in which compartments each metabolite occurs in the
            // process.
            var metabolitesCompartments = Extraction
                .collectMetabolitesTransportCandidates(
                    uniqueMetabolites, processRecord
                );
            var newProcessRecord = {
                [process]: metabolitesCompartments
            };
            return Object.assign({}, processesCollection, newProcessRecord);
        }, {});
    }
    /**
     * Collects metabolites that occur in multiple compartments in a single
     * process.
     * @param {Array<string>} metabolites Identifiers of unique metabolites
     * that occur in a single process.
     * @param {Object<Array<string>>} processRecord Identifiers of metabolites
     * that occur in each compartment of a single process.
     * @returns {Object<Array<string>>} Metabolites that occur in multiple
     * compartments in a single process.
     */
    static collectMetabolitesTransportCandidates(metabolites, processRecord) {
        return metabolites.reduce(function (metabolitesCollection, metabolite) {
            // Collect compartments in which the metabolite occurs in
            // the process.
            var compartments = Object.keys(processRecord);
            var metaboliteCompartments = compartments
                .reduce(function (compartmentsCollection, compartment) {
                    var compartmentalMetabolites = processRecord
                        [compartment];
                    if (compartmentalMetabolites.includes(metabolite)) {
                        return []
                            .concat(
                                compartmentsCollection, compartment
                            );
                    } else {
                        return compartmentsCollection;
                    }
                }, []);
            // Determine if the metabolite occurs in multiple compartments in
            // the process.
            // Only metabolites that occur in multiple compartments in the
            // process are candidates for transport.
            if (metaboliteCompartments.length > 1) {
                // Metabolite occurs in multiple compartments in the process.
                var metaboliteRecord = {
                    [metabolite]: metaboliteCompartments
                };
                return Object
                    .assign(
                        {}, metabolitesCollection, metaboliteRecord
                    );
            } else {
                // Metabolite occurs in a single compartment in the process.
                return metabolitesCollection;
            }
        }, {});
    }
    /**
     * Creates a record for a single reaction from a metabolic model.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Object} parameters.reaction Information for a reaction.
     * @param {Object<Object<Array<string>>>} parameters.processesTransports
     * Metabolites and compartments that are candidates for transport in each
     * process.
     * @param {Object} parameters.processes Information about all processes in a
     * metabolic model.
     * @returns {Object} Record for a reaction.
     */
    static createReactionRecord({
                                    reaction, processesTransports, processes
    } = {}) {
        // Extract genes that have a role in the reaction.
        var genes = Clean.extractGenesFromRule(reaction.gene_reaction_rule);
        // Create records for metabolites that participate in the reaction,
        // their roles as reactants or products, and the compartments in which they participate.
        var metabolites = Extraction
            .createReactionMetabolites(reaction.metabolites);
        // Determine whether or not the reaction is reversible.
        var reversibility = Extraction
            .determineReactionReversibility(
                reaction.lower_bound, reaction.upper_bound
            );
        // Determine whether or not the reaction's metabolites in reactants and
        // products are chemically different.
        // Different metabolites in reactants and products indicate that the
        // reaction involves a chemical conversion.
        var conversion = Extraction
            .determineReactionChemicalConversion(metabolites);
        // Determine whether or not the reaction's metabolites participate in
        // multiple compartments.
        // Metabolites in multiple compartments indicate that the reaction
        // involves dispersal.
        var dispersal = Extraction
            .determineReactionMultipleCompartments(metabolites);
        // Determine whether or not any of the reaction's reactants and products
        // are chemically the same but participate in different compartments.
        // Chemically identical reactants and products in distinct compartments
        // indicate that the reaction involves transport.
        var transport = Extraction
            .determineReactionSameChemicalDifferentCompartments(metabolites);
        if (transport) {
            // Reaction involves transport.
            // Collect the metabolites and compartments that the reaction's
            // transport involves.
            var transports = Extraction
                .collectReactionSameChemicalDifferentCompartments(metabolites);
            // Evaluate reaction's potential involvement in processes across
            // multiple compartments.
            var transportProcesses = Extraction.collectTransportProcesses({
                reactionTransports: transports,
                processesTransports: processesTransports
            });
        } else {
            // Reaction does not involve transport.
            var transports = null;
            var transportProcesses = [];
        }
        // Determine processes in which reaction participates.
        var originalProcess = Extraction
            .determineReactionProcessIdentifier(reaction.subsystem, processes);
        var reactionProcesses = [].concat(originalProcess, transportProcesses);
        return {
            [reaction.id]: {
                conversion: conversion,
                dispersal: dispersal,
                genes: genes,
                identifier: reaction.id,
                metabolites: metabolites,
                name: reaction.name,
                processes: reactionProcesses,
                reversibility: reversibility,
                transport: transport,
                transports: transports
            }
        };
    }
    /**
     * Creates records for the metabolites that participate in a reaction.
     * @param {Object<number>} reactionMetabolites Information about metabolites
     * that participate in a reaction.
     * @returns {Array<Object<string>>} Information about metabolites that
     * participate in a reaction.
     */
    static createReactionMetabolites(reactionMetabolites) {
        return Object.keys(reactionMetabolites).map(function (identifier) {
            return {
                identifier: Clean.extractMetaboliteIdentifier(identifier),
                role: Extraction.determineReactionMetaboliteRole(
                    reactionMetabolites[identifier]
                ),
                compartment: Clean.extractCompartmentIdentifier(identifier)
            };
        });
    }
    /**
     * Determines the role of a metabolite in a reaction, either as a reactant
     * or a product.
     * @param {number} code Code designator for metabolite role in reaction.
     * @returns {string} The metabolite's role as a reactant or product in the
     * reaction.
     */
    static determineReactionMetaboliteRole(code) {
        if (code < 0) {
            return "reactant";
        } else if (code > 0) {
            return "product";
        }
    }
    /**
     * Determines whether a reaction's boundaries indicate reversibility or
     * irreversibility.
     * @param {number} lowBound Lower boundary for reaction.
     * @param {number} upBound Upper boundary for reaction.
     * @returns {boolean} Whether the reaction is reversible or irreversible.
     */
    static determineReactionReversibility(lowBound, upBound) {
        if (lowBound < 0 && 0 < upBound) {
            // Reaction is reversible.
            return true;
        } else {
            // Reaction is irreversible.
            return false;
        }
    }
    /**
     * Determines whether or not a reaction involves a chemical conversion
     * between its reactant and product metabolites.
     * @param {Array<Object<string>>} reactionMetabolites Information about
     * metabolites that participate in a reaction.
     * @returns {boolean} Whether or not metabolites change chemically.
     */
    static determineReactionChemicalConversion(reactionMetabolites) {
        var reactants = reactionMetabolites
            .filter(function (metabolite) {
                return metabolite.role === "reactant";
            }).map(function (reactant) {
                return reactant.identifier;
            });
        var products = reactionMetabolites
            .filter(function (metabolite) {
                return metabolite.role === "product";
            }).map(function (product) {
                return product.identifier;
            });
        return (
            !General.compareArraysByInclusion(reactants, products) &&
            !General.compareArraysByInclusion(products, reactants)
        );
    }
    /**
     * Determines whether or not a reaction involves metabolites in multiple
     * compartments.
     * @param {Array<Object<string>>} reactionMetabolites Information about
     * metabolites that participate in a reaction.
     * @returns {boolean} Whether or not metabolites occur in multiple
     * compartments.
     */
    static determineReactionMultipleCompartments(reactionMetabolites) {
        var compartments = Extraction.extractReactionMetabolitesCompartments(
            reactionMetabolites
        );
        return (compartments.length > 1);
    }
    /**
     * Extracts unique compartments in which metabolites participate in a
     * reaction.
     * @param {Array<Object<string>>} reactionMetabolites Information about
     * metabolites that participate in a reaction.
     * @returns {Array<string>} Identifiers of compartments.
     */
    static extractReactionMetabolitesCompartments(reactionMetabolites) {
        var compartments = reactionMetabolites.map(function (metabolite) {
            return metabolite.compartment;
        });
        return General.collectUniqueElements(compartments);
    }
    /**
     * Determines whether or not any metabolites that participate in a reaction
     * as reactants and products are chemically identical but occur in different
     * compartments.
     * @param {Array<Object<string>>} reactionMetabolites Information about
     * metabolites that participate in a reaction.
     * @returns {boolean} Indicator of whether or not the reaction involves the
     * same metabolite as both reactant and product in different compartments.
     */
    static determineReactionSameChemicalDifferentCompartments(
        reactionMetabolites
    ) {
        var transports = Extraction
            .collectReactionSameChemicalDifferentCompartments(
                reactionMetabolites
            );
        return (transports.length > 0);
    }
    /**
     * Collects metabolites that participate in a reaction as both reactants and
     * products but in different compartments.
     * @param {Array<Object<string>>} reactionMetabolites Information about
     * metabolites that participate in a reaction.
     * @returns {Array<Object>} Metabolites and compartments in which they
     * participate in the reaction as both reactants and products.
     */
    static collectReactionSameChemicalDifferentCompartments(
        reactionMetabolites
    ) {
        var reactants = reactionMetabolites.filter(function (metabolite) {
            return metabolite.role === "reactant";
        });
        var products = reactionMetabolites.filter(function (metabolite) {
            return metabolite.role === "product";
        });
        // Collect the metabolites that the reaction transports and their
        // relevant compartments.
        // A reaction can transport multiple metabolites between multiple
        // compartments.
        return reactants.reduce(function (collection, reactant) {
            // Determine whether or not the collection already includes a record
            // for the reactant.
            var reactantMatch = collection.find(function (record) {
                return record.metabolite === reactant.identifier;
            });
            if (!reactantMatch) {
                // The collection does not already include a record for the
                // reactant.
                // Determine if any products are the same chemical metabolite as
                // the reactant.
                // There might be multiple products that are the same chemical
                // metabolite as the reactant.
                var metaboliteMatches = products.filter(function (product) {
                    return product.identifier === reactant.identifier;
                });
                // Determine if any of these chemically identical metabolites
                // occur in different compartments.
                var compartmentMatches = metaboliteMatches
                    .map(function (record) {
                        return record.compartment;
                    });
                var compartments = []
                    .concat(reactant.compartment, compartmentMatches);
                var uniqueCompartments = General
                    .collectUniqueElements(compartments);
                if (uniqueCompartments.length > 1) {
                    // Metabolites occur in different compartments.
                    var newTransport = {
                        metabolite: reactant.identifier,
                        compartments: uniqueCompartments
                    };
                    return [].concat(collection, newTransport);
                } else {
                    // Metabolites occur in the same compartment.
                    return collection;
                }
            } else {
                // The collection already includes a record for the reactant.
                return collection;
            }
        }, []);
    }
    /**
     * Creates a record for a single reaction from a metabolic model.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<Object>} parameters.reactionTransports Information about
     * the metabolites and compartments in a reaction's transport behavior.
     * @param {Object<Object<Array<string>>>} parameters.processesTransports
     * Metabolites and compartments that are candidates for transport in each
     * process.
     * @returns {Array<string>} Identifiers of process in which the reaction
     * participates through transport.
     */
    static collectTransportProcesses({
                                         reactionTransports, processesTransports
    } = {}) {
        // Collect identifiers of processes in which the reaction participates
        // through transport.
        // Iterate on processes.
        var processes = Object.keys(processesTransports);
        return processes.reduce(function (collection, process) {
            // Determine whether or not the reaction's transport participates in
            // the process.
            // Determine whether or not any of the metabolites and compartments
            // in the reaction's transport behavior match any of the process'.
            var processTransport = processesTransports[process];
            var transportMatch = reactionTransports
                .some(function (reactionTransport) {
                    // Determine whether or not the metabolite of the reaction's
                    // transport matches any metabolites for transport in the
                    // process.
                    var reactionMetabolite = reactionTransport.metabolite;
                    var metaboliteMatch = processTransport
                        .hasOwnProperty(reactionMetabolite);
                    if (metaboliteMatch) {
                        // Determine whether or not the compartments of the
                        // reaction's transport for the metabolite match at
                        // least two compartments for transport of the
                        // metabolite in the process.
                        var reactionCompartments = reactionTransport
                            .compartments;
                        var processCompartments = processTransport
                            [reactionMetabolite];
                        var compartmentMatches = processCompartments
                            .filter(function (compartment) {
                                return reactionCompartments
                                    .includes(compartment);
                            });
                        var compartmentsMatch = compartmentMatches.length > 1;
                    } else {
                        var compartmentsMatch = false;
                    }
                    return metaboliteMatch && compartmentsMatch;
                });
            if (transportMatch) {
                // The reaction's transport participates in the process.
                // Collect the identifier for the process to include the
                // reaction in the process.
                var newCollection = [].concat(collection, process);
            } else {
                // The reaction's transport does not participate in the process.
                var newCollection = collection;
            }
            return newCollection;
        }, []);
    }
    /**
     * Determines the identifier for a reaction's process.
     * @param {string} subsystem Name for a reaction's process.
     * @param {Object} processes Information about all processes in a metabolic
     * model.
     * @returns {string} Identifier for the reaction's process.
     */
    static determineReactionProcessIdentifier(subsystem, processes) {
        if (subsystem) {
            var name = subsystem;
        } else {
            var name = "other";
        }
        return Object.keys(processes).find(function (key) {
            return processes[key].name === name;
        });
    }
}