/*
Profondeur supports visual exploration and analysis of metabolic networks.
Copyright (C) 2017 Thomas Cameron Waller

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.
If not, see <http://www.gnu.org/licenses/>.

This file is part of project Profondeur.
Project repository's address: https://github.com/tcameronwaller/profondeur/
Author's electronic address: tcameronwaller@gmail.com
Author's physical address:
T Cameron Waller
Scientific Computing and Imaging Institute
University of Utah
72 South Central Campus Drive Room 3750
Salt Lake City, Utah 84112
United States of America
*/

/**
* Functionality of utility for extracting information about metabolic entities
* and sets.
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
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
    var compartments = Extraction.createCompartmentsRecords(data.compartments);
    var processes = Extraction.createProcessesRecords(data.reactions);
    // Extract information about entities.
    var reactions = Extraction
    .createReactionsRecords(data.reactions, processes);
    var metabolites = Extraction.createMetabolitesRecords(data.metabolites);
    var genes = Extraction.createGenesRecords(data.genes);
    // Compile information.
    var metabolicEntitiesSets = {
      compartments: compartments,
      genes: genes,
      processes: processes,
      metabolites: metabolites,
      reactions: reactions
    };
    // Return information.
    return metabolicEntitiesSets;
  }

  // Extract sets.
  // Extract compartments.

  /**
  * Creates records for all compartments in a metabolic model.
  * @param {Object} compartments Information about all compartments in a
  * metabolic model.
  * @returns {Object} Records for compartments.
  */
  static createCompartmentsRecords(compartments) {
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

  // Extract processes.

  /**
  * Creates records for all processes from a metabolic model.
  * @param {Array<Object>} reactions Information for all reactions of a
  * metabolic model.
  * @returns {Object} Records for processes.
  */
  static createProcessesRecords(reactions) {
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
      if (Object.keys(collection).some(function (key) {
        return collection[key].name === name;
      })) {
        return collection;
      } else {
        // Create record for the process.
        var novelRecord = Extraction
        .createProcessRecord(name, Object.keys(collection).length);
        return Object.assign({}, collection, novelRecord);
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
  // Extract reactions.

  /**
  * Creates records for all reactions from a metabolic model.
  * @param {Array<Object>} reactions Original, raw information about all
  * reactions.
  * @param {Object<string>} processes Information about all processes in a
  * metabolic model.
  * @returns {Object<Object>} Information about reactions.
  */
  static createReactionsRecords(reactions, processes) {
    // In the original data, metabolic processes or pathways do not include
    // transport reactions.
    // As a result, processes that disperse across multiple compartments lack
    // connectivity.
    // Processes without connectivity are not accurate representations of
    // biology.
    // Complete processes' connectivity by inclusion of transport reactions.
    // Collect metabolites and compartments that are candidates for transport
    // in each process.
    var processesTransports = Extraction
    .collectProcessesTransportCandidates(reactions, processes);
    // Multiple distinct reactions can have identical chemical metabolites that
    // participate as reactants and products.
    // While these reaction have identical reactants and products, the main
    // distinction is the compartments in which their metabolites participate.
    // If compartmentalization is irrelevant, then these reactions are
    // replicates.
    // It will be useful to store references to these replicate reactions in
    // order to simplify representations of the network without
    // compartmentalization.
    // Collect identifiers of reactions with each combination of reactants and
    // products.
    var replicateReactions = Extraction
    .collectReactionsReactantsProducts(reactions);
    // Create records for reactions.
    return reactions.reduce(function (collection, reaction) {
      var newRecord = Extraction.createReactionRecord({
        reaction: reaction,
        processesTransports: processesTransports,
        replicateReactions: replicateReactions,
        processes: processes
      });
      return Object.assign({}, collection, newRecord);
    }, {});
  }
  /**
  * Collects metabolites that are candidates for transport in each compartment
  * of each process.
  * @param {Array<Object>} reactions Original, raw information about all
  * reactions.
  * @param {Object<string>} processes Information about all processes in a
  * metabolic model.
  * @returns {Object<Object<Array<string>>>} Metabolites that are candidates for
  * transport in each compartment of each process.
  */
  static collectProcessesTransportCandidates(reactions, processes) {
    // Collect metabolites that occur in each compartment of each process.
    var processesCompartmentsMetabolites = Extraction
    .collectProcessesCompartmentsMetabolites(reactions, processes);
    // Collect metabolites that occur in multiple compartments in each
    // process.
    var processesTransportCandidates = Extraction
    .determineProcessesTransportCandidates(
      processesCompartmentsMetabolites
    );
    return processesTransportCandidates;
  }
  /**
  * Collects metabolites that occur in each compartment of each process.
  * @param {Array<Object>} reactions Original, raw information about all
  * reactions.
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
      var process = Extraction.determineReactionProcessIdentifier(
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
        var metabolites = metabolitesCollection[compartment].slice();
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
  * Determines metabolites that occur in multiple compartments in each process.
  * @param {Object<Object<Array<string>>>} processesCompartmentsMetabolites
  * Identifiers of metabolites that occur in each compartment of each
  * process.
  * @returns {Object<Object<Array<string>>>} Metabolites and compartments
  * that are candidates for transport in each process.
  */
  static determineProcessesTransportCandidates(
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
  * Collects the identifiers of reactions between identical sets of reactants
  * and products.
  * @param {Array<Object>} reactions Original, raw information about all
  * reactions.
  * @returns {Array<Object>} Reactions with each set of reactants and products.
  */
  static collectReactionsReactantsProducts(reactions) {
    // Collect the identifiers of reactions with each set of reactants and
    // products.
    // Iterate on reactions.
    return reactions.reduce(function (reactionsCollection, reaction) {
      // Create records that describe the metabolites that participate in the
      // reaction, their roles as reactants or products, and the compartments
      // in which they participate.
      var participants = Extraction
      .createReactionParticipants(reaction.metabolites);
      // Collect identifiers of metabolites that participate as reactants and
      // products in the reaction.
      // Collect identifiers of metabolites that participate as reactants.
      var reactantsIdentifiers = Extraction
      .collectMetabolitesFilterParticipants({
        criteria: {roles: ["reactant"]},
        participants: participants
      });
      // Collect identifiers of metabolites that participate as products.
      var productsIdentifiers = Extraction
      .collectMetabolitesFilterParticipants({
        criteria: {roles: ["product"]},
        participants: participants
      });
      // Include current reaction in the collection.
      return Extraction.collectReactionReactantsProducts({
        reaction: reaction.id,
        reactants: reactantsIdentifiers,
        products: productsIdentifiers,
        reactionsRecords: reactionsCollection
      });
    }, []);
  }
  /**
  * Creates records that describe the metabolites that participate in a
  * reaction, their roles as reactants or products, and the compartments in
  * which they participate.
  * @param {Object<number>} reactionMetabolites Information about metabolites
  * that participate in a reaction.
  * @returns {Array<Object<string>>} Information about metabolites' and
  * compartments' participation in a reaction.
  */
  static createReactionParticipants(reactionMetabolites) {
    return Object.keys(reactionMetabolites).map(function (identifier) {
      return {
        metabolite: Clean.extractMetaboliteIdentifier(identifier),
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
  * Collects identifiers of metabolites that participate in a reaction in
  * specific contexts of metabolites, compartments, and roles.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<string>>} parameters.criteria Criteria for filters
  * against participants, including metabolites, compartments, and roles.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @returns {Array<string>} Identifiers of metabolites that participate in a
  * reaction within specific contexts.
  */
  static collectMetabolitesFilterParticipants({criteria, participants} = {}) {
    // Collect participants that match the criteria.
    var filterParticipants = Extraction.filterReactionParticipants({
      criteria: criteria,
      participants: participants
    });
    // Collect identifiers of metabolites from participants.
    return General.collectValueFromObjects("metabolite", filterParticipants);
  }
  /**
  * Filters records that describe metabolites' participation in a reaction,
  * their roles as reactants or products, and the compartments in which they
  * participate.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<string>>} parameters.criteria Criteria for filters
  * against participants, including metabolites, compartments, and roles.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @returns {Array<Object<string>>} Information about participation in a
  * reaction by metabolites that pass filters.
  */
  static filterReactionParticipants({criteria, participants} = {}) {
    return participants.filter(function (participant) {
      if (criteria.hasOwnProperty("metabolites")) {
        var metaboliteMatch = criteria
        .metabolites.includes(participant.metabolite);
      } else {
        var metaboliteMatch = true;
      }
      if (criteria.hasOwnProperty("compartments")) {
        var compartmentMatch = criteria
        .compartments.includes(participant.compartment);
      } else {
        var compartmentMatch = true;
      }
      if (criteria.hasOwnProperty("roles")) {
        var roleMatch = criteria.roles.includes(participant.role);
      } else {
        var roleMatch = true;
      }
      return metaboliteMatch && compartmentMatch && roleMatch;
    });
  }
  /**
  * Collects a single reaction's identifier along with other reactions between
  * identical sets of reactants and products.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.reaction Identifier for a single reaction.
  * @param {Array<string>} parameters.reactants Identifiers of metabolites that
  * participate in a reaction as reactants.
  * @param {Array<string>} parameters.products Identifiers of metabolites that
  * participate in a reaction as products.
  * @param {Array<Object>} parameters.reactionsRecords Reactions with each set
  * of reactants and products.
  * @returns {<Array<Object>} Reactions with each set of reactants and products.
  */
  static collectReactionReactantsProducts({
    reaction,
    reactants,
    products,
    reactionsRecords
  } = {}) {
    // Determine whether the collection includes a record for the current
    // reactants and products.
    // Determine the index of any matching element in the collection.
    var matchIndex = reactionsRecords.findIndex(function (reactionsRecord) {
      var reactantsMatch = General
      .compareArraysByMutualInclusion(reactants, reactionsRecord.reactants);
      var productsMatch = General
      .compareArraysByMutualInclusion(products, reactionsRecord.products);
      return reactantsMatch && productsMatch;
    });
    if (matchIndex !== -1) {
      // The collection includes a record for the current reactants and
      // products.
      // Determine reactions for current record.
      var previousReactions = reactionsRecords[matchIndex].reactions;
      var currentReactions = [].concat(previousReactions, reaction);
      // Determine previous records in the collection.
      // Omit previous record for current reactants and products from the
      // collection.
      var previousRecords = General.copyArrayOmitElements({
        array: reactionsRecords,
        index: matchIndex,
        count: 1
      });
    } else {
      // The collection does not include a record for the current reactants and
      // products.
      // Determine reactions for current record.
      var currentReactions = [reaction];
      // Determine previous records in the collection.
      var previousRecords = reactionsRecords;
    }
    // Create current record for the reactants and products.
    var currentRecord = {
      products: products,
      reactants: reactants,
      reactions: currentReactions
    };
    // Copy previous records in the collection.
    var previousRecordsCopy = previousRecords.map(function (previousRecord) {
      return Object.assign({}, previousRecord);
    });
    // Include current record in the collection.
    return [].concat(previousRecordsCopy, currentRecord);
  }
  /**
  * Creates a record for a single reaction from a metabolic model.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Information for a reaction.
  * @param {Object<Object<Array<string>>>} parameters.processesTransports
  * Metabolites and compartments that are candidates for transport in each
  * process.
  * @param {Array<Object>} parameters.replicateReactions Reactions with each set
  * of reactants and products.
  * @param {Object} parameters.processes Information about all processes in a
  * metabolic model.
  * @returns {Object} Record with information about a reaction.
  */
  static createReactionRecord({
    reaction, processesTransports, replicateReactions, processes
  } = {}) {
    // Determine reaction's identifier.
    var identifier = reaction.id;
    // Determine reaction's name.
    var name = reaction.name;
    // Extract genes that have a role in the reaction.
    var genes = General.collectUniqueElements(
      Clean.extractGenesFromRule(reaction.gene_reaction_rule)
    );
    // Create records that describe the metabolites that participate in the
    // reaction, their roles as reactants or products, and the compartments
    // in which they participate.
    var participants = Extraction
    .createReactionParticipants(reaction.metabolites);
    // Determine whether the reaction is reversible.
    var reversibility = Extraction.determineReactionReversibility(
      reaction.lower_bound, reaction.upper_bound
    );
    // Determine whether the reaction's metabolites in reactants and products
    // are chemically different, an indication that the reaction involves a
    // chemical conversion.
    var conversion = Extraction
    .determineReactionChemicalConversion(participants);
    // Determine whether the reaction's metabolites participate in multiple
    // compartments, an indication that the reaction involves dispersal.
    var dispersal = Extraction
    .determineReactionMultipleCompartments(participants);
    // Determine whether any of the reaction's reactants and products are
    // chemically identical but participate in different compartments, an
    // indication that the reaction involves transport.
    // Create records that describe any transports, the relevant metabolites and
    // compartments.
    var transports = Extraction.createReactionTransports(participants);
    var transport = Extraction.determineReactionTransport(transports);
    // Determine processes in which reaction participates.
    var originalProcess = Extraction
    .determineReactionProcessIdentifier(reaction.subsystem, processes);
    // Collect any processes in which reaction participates by transport.
    var transportProcesses = Extraction.collectTransportProcesses({
      reactionTransports: transports,
      processesTransports: processesTransports
    });
    var reactionProcesses = General.collectUniqueElements(
      [].concat(originalProcess, transportProcesses)
    );
    // Determine replicates of the current reaction, in terms of identical
    // reactants and products.
    var replicates = replicateReactions.find(function (record) {
      return record.reactions.includes(identifier);
    }).reactions;
    var replication = replicates.length > 1;
    // Compile attributes.
    var attributes = {
      conversion: conversion,
      dispersal: dispersal,
      genes: genes,
      identifier: identifier,
      name: name,
      participants: participants,
      processes: reactionProcesses,
      replicates: replicates,
      replication: replication,
      reversibility: reversibility,
      transport: transport,
      transports: transports
    };
    // Create record.
    var record = {
      [identifier]: attributes
    };
    return record;
  }
  /**
  * Determines whether a reaction's boundaries indicate reversibility or
  * irreversibility.
  * @param {number} lowBound Lower boundary for reaction.
  * @param {number} upBound Upper boundary for reaction.
  * @returns {boolean} Whether the reaction is reversible.
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
  * Determines whether a reaction involves a chemical conversion between the
  * metabolites that participate as its reactants and products.
  * @param {Array<Object<string>>} participants Information about metabolites'
  * participation in a reaction.
  * @returns {boolean} Whether the reaction involves chemical conversion.
  */
  static determineReactionChemicalConversion(participants) {
    // Collect identifiers of metabolites that participate as reactants.
    var reactantsIdentifiers = Extraction.collectMetabolitesFilterParticipants({
      criteria: {roles: ["reactant"]},
      participants: participants
    });
    // Collect identifiers of metabolites that participate as products.
    var productsIdentifiers = Extraction.collectMetabolitesFilterParticipants({
      criteria: {roles: ["product"]},
      participants: participants
    });
    // Compare reactants and products.
    return !General
    .compareArraysByMutualInclusion(reactantsIdentifiers, productsIdentifiers);
  }
  /**
  * Determines whether a reaction involves metabolites in multiple compartments.
  * @param {Array<Object<string>>} participants Information about metabolites'
  * participation in a reaction.
  * @returns {boolean} Whether reaction involves metabolites' participation in
  * multiple compartments.
  */
  static determineReactionMultipleCompartments(participants) {
    // Determine compartments in which metabolites participate in the reaction.
    var compartments = General.collectUniqueElements(
      General.collectValueFromObjects("compartment", participants)
    );
    return (compartments.length > 1);
  }
  /**
  * Determines whether a reaction involves transport of chemically identical
  * metabolites between compartments.
  * @param {Array<Object<string>>} transports Information about a reaction's
  * transport events.
  * @returns {boolean} Whether the reaction involves physical transport.
  */
  static determineReactionTransport(transports) {
    return (transports.length > 0);
  }
  /**
  * Creates records that describe any transports between chemically identical
  * metabolites that participate in a reaction as both reactants and products
  * but in different compartments.
  * @param {Array<Object<string>>} participants Information about
  * metabolites' participation in a reaction.
  * @returns {Array<Object<string>>} Information about a reaction's transport
  * events.
  */
  static createReactionTransports(participants) {
    // Collect participants that are reactants.
    var reactants = Extraction.filterReactionParticipants({
      criteria: {roles: ["reactant"]},
      participants: participants
    });
    // Collect participants that are products.
    var products = Extraction.filterReactionParticipants({
      criteria: {roles: ["product"]},
      participants: participants
    });
    // Collect the metabolites that the reaction transports and their
    // relevant compartments.
    // A reaction can transport multiple metabolites between multiple
    // compartments.
    return reactants.reduce(function (collection, reactant) {
      // Determine whether or not the collection already includes a record
      // for the reactant.
      var reactantMatch = collection.some(function (record) {
        return record.metabolite === reactant.metabolite;
      });
      if (!reactantMatch) {
        // The collection does not already include a record for the
        // reactant.
        // Determine if any products are the same chemical metabolite as
        // the reactant.
        // There might be multiple products that are the same chemical
        // metabolite as the reactant.
        var metaboliteMatches = Extraction.filterReactionParticipants({
          criteria: {metabolites: [reactant.metabolite]},
          participants: products
        });
        // Determine if any of these chemically identical metabolites occur in
        // different compartments.
        var compartmentMatches = General
        .collectValueFromObjects("compartment", metaboliteMatches);
        var compartments = []
        .concat(reactant.compartment, compartmentMatches);
        var uniqueCompartments = General.collectUniqueElements(compartments);
        if (uniqueCompartments.length > 1) {
          // Metabolites occur in different compartments.
          var novelTransport = {
            metabolite: reactant.metabolite,
            compartments: uniqueCompartments
          };
          return [].concat(collection, novelTransport);
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

  // Extract metabolites.

  /**
  * Creates records for all metabolites from a metabolic model.
  * @param {Array<Object>} metabolites Information for all metabolites of a
  * metabolic model.
  * @returns {Object} Records for metabolites.
  */
  static createMetabolitesRecords(metabolites) {
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
        var novelRecord = Extraction.createMetaboliteRecord(metabolite);
        return Object.assign({}, collection, novelRecord);
      }
    }, {});
  }
  /**
  * Creates a record for a single metabolite from a metabolic model.
  * @param {Object<string>} metabolite Information about a single metabolite.
  * @returns {Object} Record for a metabolite.
  */
  static createMetaboliteRecord(metabolite) {
    // Previous checks and cleans of the data ensure that attributes specific to
    // general metabolites are consistent without discrepancies between records
    // for compartmental metabolites.
    // Determine identifier of general metabolite.
    var identifier = Clean.extractMetaboliteIdentifier(metabolite.id);
    // Compile attributes.
    var attributes = {
      charge: metabolite.charge,
      formula: metabolite.formula,
      identifier: identifier,
      name: metabolite.name
    };
    // Create record.
    var record = {
      [identifier]: attributes
    };
    return record;
  }

  // Extract genes.

  /**
  * Creates records for all genes in a metabolic model.
  * @param {Array<Object>} genes Information for all genes of a metabolic
  * model.
  * @param {Object} reactions Information about all reactions.
  * @returns {Object} Records for genes.
  */
  static createGenesRecords(genes, reactions) {
    // Create records for genes.
    return genes.reduce(function (collection, gene) {
      var novelRecord = Extraction.createGeneRecord(gene);
      return Object.assign({}, collection, novelRecord);
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
}
