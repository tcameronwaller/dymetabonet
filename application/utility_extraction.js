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
    .createCompartmentsRecords(data.compartments);
    var processes = Extraction.createProcessesRecords(data.reactions);
    // Extract information about entities.
    var reactions = Extraction
    .createReactionsRecords(data.reactions, processes);
    var metabolites = Extraction
    .createMetabolitesRecords(data.metabolites, reactions);
    var genes = Extraction.createGenesRecords(data.genes, reactions);
    // Compile information.
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
  // Extract reactions.
  // Extract reactions.

  /**
  * Creates records for all reactions from a metabolic model.
  * @param {Array<Object>} reactions Original, raw information about all
  * reactions.
  * @param {Object<string>} processes Information about all processes in a
  * metabolic model.
  * @returns {Object} Records with information about reactions.
  */
  static createReactionsRecords(reactions, processes) {
    // In the original data, metabolic processes or pathways do not include
    // transport reactions.
    // As a result, processes that disperse across multiple compartments are
    // discontinuous.
    // Discontinuous processes are not accurate representations of biology.
    // Render processes continuous by inclusion of transport reactions.
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
  * Collects metabolites and compartments that are candidates for transport in
  * each process.
  * @param {Array<Object>} reactions Original, raw information about all
  * reactions.
  * @param {Object<string>} processes Information about all processes in a
  * metabolic model.
  * @returns {Object<Object<Array<string>>>} Metabolites and compartments
  * that are candidates for transport in each process.
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
  * Extracts combinations of values of an attribute from reactions.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.attribute Name of attribute of reactions.
  * @param {Array<string>} parameters.reactionsIdentifiers Identifiers of
  * reactions from which to extract combinations of values of the attribute.
  * @param {Object<Object>} parameters.reactions Information about all
  * reactions.
  * @returns {Array<Array<string>>} Combinations of values of the attribute.
  */
  static extractReactionsUniqueCombinations({
    attribute, reactionsIdentifiers, reactions
  } = {}) {
    // Collect all combinations of the attribute from reactions.
    var combinations = reactionsIdentifiers.map(function (reactionIdentifier) {
      // Set reference to record for current reaction.
      var reaction = reactions[reactionIdentifier];
      return reaction[attribute];
    });
    // Collect unique combinations of the attribute.
    return General.collectUniqueArraysByInclusion(combinations);
  }
  static temporaryStuffForUniqueCombinations() {
    // Determine unique combinations of compartments for the current reactions.
    // Multiple combinations from a set of reactions indicate that reactions in
    // the set have different combinations.
    var compartments = Extraction
    .extractReactionsUniqueCombinations({
      attribute: "compartments",
      reactionsIdentifiers: currentReactions,
      reactions: reactions
    });
    // Determine unique sets of processes for the current reactions.
    // Multiple combinations from a set of reactions indicate that reactions in
    // the set have different combinations.
    var processes = Extraction
    .extractReactionsUniqueCombinations({
      attribute: "processes",
      reactionsIdentifiers: currentReactions,
      reactions: reactions
    });
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
    var genes = General
    .collectUniqueElements(
      Clean.extractGenesFromRule(reaction.gene_reaction_rule)
    );
    // Create records that describe the metabolites that participate in the
    // reaction, their roles as reactants or products, and the compartments
    // in which they participate.
    var participants = Extraction
    .createReactionParticipants(reaction.metabolites);
    // Determine metabolites that participate in the reaction.
    var metabolites = General
    .collectUniqueElements(
      General.collectValueFromObjects("metabolite", participants)
    );
    // Determine compartments in which metabolites participate in the
    // reaction.
    var compartments = General
    .collectUniqueElements(
      General.collectValueFromObjects("compartment", participants)
    );
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
    .determineReactionChemicalConversion(participants);
    // Determine whether or not the reaction's metabolites participate in
    // multiple compartments.
    // Metabolites in multiple compartments indicate that the reaction
    // involves dispersal.
    var dispersal = Extraction
    .determineReactionMultipleCompartments(compartments);
    // Determine whether or not any of the reaction's reactants and products
    // are chemically the same but participate in different compartments.
    // Chemically identical reactants and products in distinct compartments
    // indicate that the reaction involves transport.
    var transport = Extraction
    .determineReactionSameChemicalDifferentCompartments(participants);
    if (transport) {
      // Reaction involves transport.
      // Collect the metabolites and compartments that the reaction's
      // transport involves.
      var transports = Extraction
      .collectReactionSameChemicalDifferentCompartments(participants);
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
    var reactionProcesses = General
    .collectUniqueElements([].concat(originalProcess, transportProcesses));
    // Determine replicates of the current reaction, in terms of identical
    // reactants and products.
    var replicates = replicateReactions.find(function (record) {
      return record.reactions.includes(identifier);
    }).reactions;
    var replication = replicates.length > 1;
    // Compile reaction's attributes.
    return {
      [identifier]: {
        compartments: compartments,
        conversion: conversion,
        dispersal: dispersal,
        genes: genes,
        identifier: identifier,
        metabolites: metabolites,
        name: name,
        participants: participants,
        processes: reactionProcesses,
        replicates: replicates,
        replication: replication,
        reversibility: reversibility,
        transport: transport,
        transports: transports
      }
    };
  }
  /**
  * Creates records that describe the metabolites that participate in a
  * reaction, their roles as reactants or products, and the compartments in
  * which they participate.
  * @param {Object<number>} reactionMetabolites Information about metabolites
  * that participate in a reaction.
  * @returns {Array<Object<string>>} Information about metabolites'
  * participation in a reaction.
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
  * between the metabolites that participate as its reactants and products.
  * @param {Array<Object<string>>} participants Information about
  * metabolites' participation in a reaction.
  * @returns {boolean} Whether or not metabolites change chemically.
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
  * Determines whether or not a reaction involves metabolites in multiple
  * compartments.
  * @param {Array<string>} compartments Identifiers of compartments in which
  * metabolites participate in a reaction.
  * @returns {boolean} Whether or not metabolites occur in multiple
  * compartments.
  */
  static determineReactionMultipleCompartments(compartments) {
    return (compartments.length > 1);
  }
  /**
  * Determines whether or not any metabolites that participate in a reaction
  * as reactants and products are chemically identical but occur in different
  * compartments.
  * @param {Array<Object<string>>} participants Information about
  * metabolites' participation in a reaction.
  * @returns {boolean} Indicator of whether or not the reaction involves the
  * same metabolite as both reactant and product in different compartments.
  */
  static determineReactionSameChemicalDifferentCompartments(participants) {
    var transports = Extraction
    .collectReactionSameChemicalDifferentCompartments(
      participants
    );
    return (transports.length > 0);
  }
  /**
  * Collects metabolites that participate in a reaction as both reactants and
  * products but in different compartments.
  * @param {Array<Object<string>>} participants Information about
  * metabolites' participation in a reaction.
  * @returns {Array<Object>} Metabolites and compartments in which they
  * participate in the reaction as both reactants and products.
  */
  static collectReactionSameChemicalDifferentCompartments(participants) {
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
        // Determine if any of these chemically identical metabolites
        // occur in different compartments.
        var compartmentMatches = General
        .collectValueFromObjects("compartment", metaboliteMatches);
        var compartments = []
        .concat(reactant.compartment, compartmentMatches);
        var uniqueCompartments = General
        .collectUniqueElements(compartments);
        if (uniqueCompartments.length > 1) {
          // Metabolites occur in different compartments.
          var newTransport = {
            metabolite: reactant.metabolite,
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

  // Extract metabolites.

  /**
  * Creates records for all metabolites from a metabolic model.
  * @param {Array<Object>} metabolites Information for all metabolites of a
  * metabolic model.
  * @param {Object} reactions Information about all reactions.
  * @returns {Object} Records for metabolites.
  */
  static createMetabolitesRecords(metabolites, reactions) {
    // Collect the identifiers of reactions in which each metabolite
    // participates.
    var metabolitesReactions = Extraction
    .collectRecordsAttributeValues({
      attribute: "metabolites",
      records: reactions
    });
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
        // Determine identifiers of unique reactions in which metabolite
        // participates.
        var metaboliteReactions = General
        .collectUniqueElements(metabolitesReactions[identifier]);
        // Create a new record for the metabolite.
        var newRecord = Extraction
        .createMetaboliteRecord({
          metabolite: metabolite,
          metaboliteReactions: metaboliteReactions,
          reactions: reactions
        });
        return Object.assign({}, collection, newRecord);
      }
    }, {});
  }
  /**
  * Collects the identifiers of all records with each value of an attribute.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.attribute Name of attribute in records.
  * @param {Object<Object>} parameters.records Records with identifiers and
  * attributes.
  * @returns {Object<Array<string>>} Identifiers of records with each value
  * of the attribute.
  */
  static collectRecordsAttributeValues({attribute, records} = {}) {
    // Collect the identifiers of records with each value of the attribute.
    // Assume that every value of the attribute is relevant to some record.
    // Iterate on records.
    var recordsIdentifiers = Object.keys(records);
    return recordsIdentifiers
    .reduce(function (recordsCollection, recordIdentifier) {
      var record = records[recordIdentifier];
      // Determine values of the attribute within the current record.
      var recordValues = record[attribute];
      // Collect values of the attribute for the current record.
      var recordValuesCollection = Extraction
      .collectRecordValues({
        record: record.identifier,
        values: recordValues,
        recordsCollection: recordsCollection
      });
      return recordValuesCollection;
    }, {});
  }
  /**
  * Collects the values of an attribute of a single record, including the
  * record's identifier in matching collections.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.record Identifier for a single record.
  * @param {Array<string>} parameters.values Identifiers of values of an
  * attribute within the record.
  * @param {Object<Array<string>>} parameters.recordsCollection Identifiers
  * of records with each value of the attribute.
  * @returns {Object<Array<string>>} Identifiers of records with each value
  * of the attribute.
  */
  static collectRecordValues({
    record,
    values,
    recordsCollection
  } = {}) {
    // Iterate on values.
    return values.reduce(function (valuesCollection, value) {
      if (valuesCollection.hasOwnProperty(value)) {
        // The collection has a record for the value.
        // Include the current record's identifer in the record for the
        // value.
        var oldRecords = valuesCollection[value];
        var newRecords = [].concat(oldRecords, record);
        var newRecord = {
          [value]: newRecords
        };
      } else {
        // The collection does not have a record for the value.
        // Create a new record for the value's records.
        var newRecord = {
          [value]: [record]
        };
      }
      // Include in the collection the new record for the value's
      // records.
      return Object.assign ({}, valuesCollection, newRecord);
    }, recordsCollection);
  }
  /**
  * Creates a record for a single metabolite from a metabolic model.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<string>} parameters.metabolite Information about a single
  * metabolite.
  * @param {Array<string>} parameters.metaboliteReactions Identifiers of
  * reactions in which a single metabolite participates.
  * @param {Object} parameters.reactions Information about all reactions.
  * @returns {Object} Record for a metabolite.
  */
  static createMetaboliteRecord({
    metabolite,
    metaboliteReactions,
    reactions
  } = {}) {
    // Previous checks and cleans of the data ensure that attributes
    // specific to general metabolites are consistent without discrepancies
    // between records for compartmental metabolites.
    // Determine identifier of general metabolite.
    var identifier = Clean.extractMetaboliteIdentifier(metabolite.id);
    // Compile metabolite's attributes.
    // Initialize the simplification selection to false for all metabolites.
    var metaboliteAttributes = {
      charge: metabolite.charge,
      formula: metabolite.formula,
      identifier: identifier,
      name: metabolite.name,
      simplification: false
    };
    // Determine values of attributes that metabolite inherits from the
    // reactions in which it participates.
    var reactionsAttributes = Extraction
    .collectMetaboliteReactionsAttributes({
      metaboliteIdentifier: identifier,
      reactionsIdentifiers: metaboliteReactions,
      reactions: reactions
    });
    // Compile attributes for metabolite's record.
    var attributesValues = Object
    .assign({}, metaboliteAttributes, reactionsAttributes);
    return {
      [identifier]: attributesValues
    };
  }
  /**
  * Collects values of attributes that a metabolite inherits from the
  * reactions in which it participates.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a single
  * metabolite.
  * @param {Array<string>} parameters.reactionsIdentifiers Identifiers of
  * reactions in which a single metabolite participates.
  * @param {Object} parameters.reactions Information about all reactions.
  * @returns {Object} Values of attributes that a metabolite inherits from
  * the reactions in which it participates.
  */
  static collectMetaboliteReactionsAttributes({
    metaboliteIdentifier,
    reactionsIdentifiers,
    reactions
  }) {
    // Collect attributes that metabolite inherits from the reactions in
    // which it participates.
    // Initialize collection.
    var initialCollection = {
      reactions: [],
      compartments: [],
      processes: []
    };
    // Iterate on metabolite's reactions.
    return reactionsIdentifiers
    .reduce(function (collection, reactionIdentifier) {
      // Determine if the reaction exists in the current collection of
      // reactions, indicating that the reaction passes current
      // filters.
      if (reactions.hasOwnProperty(reactionIdentifier)) {
        // Reaction passes filters.
        var reaction = reactions[reactionIdentifier];
        // Determine if the reaction claims the metabolite,
        // indicating that the metabolite's participation in the
        // reaction satisfies filters.
        if (reaction.metabolites.includes(metaboliteIdentifier)) {
          // Reaction claims metabolite.
          // Include reaction's identifier in metabolite's
          // collection of reactions.
          var collectionReactions = General
          .collectUniqueElements(
            []
            .concat(
              collection.reactions,
              reaction.identifier
            )
          );
          // Determine values of attributes that metabolite
          // inherits from reaction.
          // Determine compartments in which metabolite
          // participates in the reaction.
          var compartments = Extraction
          .collectMetaboliteReactionCompartments({
            metaboliteIdentifier: metaboliteIdentifier,
            reaction: reaction
          });
          var collectionCompartments = General
          .collectUniqueElements(
            []
            .concat(
              collection.compartments,
              compartments
            )
          );
          // Determine processes of the reaction in which
          // metabolite participates.
          // Metabolite inherits from its reactions all of the
          // reactions' processes.
          var processes = reaction.processes;
          var collectionProcesses = General
          .collectUniqueElements(
            [].concat(collection.processes, processes)
          );
          // Compile new values of attributes for the collection.
          var newCollection = {
            reactions: collectionReactions,
            compartments: collectionCompartments,
            processes: collectionProcesses
          };
        } else {
          // Reaction does not claim metabolite.
          // Do not change current collection.
          var newCollection = collection;
        }
      } else {
        // Reaction does not pass filters.
        // Do not change current collection.
        var newCollection = collection;
      }
      return newCollection;
    }, initialCollection);
  }
  /**
  * Collects unique compartments in which a metabolite participates in a
  * single reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a single
  * metabolite.
  * @param {Object} parameters.reaction Information about a reaction.
  * @returns {Array<string>} Identifiers of unique compartments in which
  * metabolite participates in the reaction.
  */
  static collectMetaboliteReactionCompartments({
    metaboliteIdentifier,
    reaction
  } = {}) {
    // Determine compartments in which metabolite participates in the
    // reaction.
    // Metabolite only inherits from its reactions the compartments in which
    // it participates in those reactions.
    var participants = reaction.participants;
    var participantsMatches = participants.filter(function (participant) {
      return participant.metabolite === metaboliteIdentifier;
    });
    var participantsCompartments = General
    .collectValueFromObjects(
      "compartment", participantsMatches
    );
    return General.collectUniqueElements(participantsCompartments);
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
    // Collect the identifiers of reactions in which each gene participates.
    var genesReactions = Extraction
    .collectRecordsAttributeValues({
      attribute: "genes",
      records: reactions
    });
    // Create records for genes.
    return genes.reduce(function (collection, gene) {
      // Determine identifiers of unique reactions in which metabolite
      // participates.
      var geneReactions = General
      .collectUniqueElements(genesReactions[gene.id]);
      var newRecord = Extraction
      .createGeneRecord(gene, geneReactions);
      return Object.assign({}, collection, newRecord);
    }, {});
  }
  /**
  * Creates a record for a single gene in a metabolic model.
  * @param {Object<string>} gene Information about a single gene.
  * @param {Array<string>} geneReactions Identifiers of reactions in which a
  * single gene participates.
  * @returns {Object} Record for a gene.
  */
  static createGeneRecord(gene, geneReactions) {
    return {
      [gene.id]: {
        identifier: gene.id,
        name: gene.name,
        reactions: geneReactions
      }
    };
  }

  // Utility for managing information about metabolic entities and sets.

  /**
  * Copies records with information about metabolic entities, metabolites or
  * reactions.
  * @param {Object<Object>} entities Records with information about entities and
  * their attributes' values.
  * @returns {Object<Object>} Copy of records for entities.
  */
  static copyObjectEntitiesRecords(entities) {
    // Iterate on entities' records.
    var entitiesIdetifiers = Object.keys(entities);
    return entitiesIdentifiers.reduce(function (collection, entityIdentifier) {
      // Set reference to entity's record.
      var entity = entities[entityIdentifier];
      // Copy all of entity's attributes.
      var copyEntity = Extraction.copyEntityRecord(entity);
      // Include entity in the collection.
      var novelRecord = {
        [copyEntity.identifier]: copyEntity
      };
      return Object.assign({}, collection, novelRecord);
    }, {});
  }
  /**
  * Copies records with information about metabolic entities, metabolites or
  * reactions.
  * @param {Array<Object>} entities Records with information about entities and
  * their attributes' values.
  * @returns {Array<Object>} Copy of records for entities.
  */
  static copyArrayEntitiesRecords(entities) {
    // Iterate on entities' records.
    return entities.map(function (entity) {
      // Copy all of entity's attributes.
      return Extraction.copyEntityRecord(entity);
    });
  }
  /**
  * Copies attributes' values in a record for a metabolic entity, metabolite or
  * reaction.
  * @param {Object} entity Record with information about an entity and its
  * attributes' values.
  * @returns {Object} Copy of entity's record.
  */
  static copyEntityRecord(entity) {
    // Copy entity's values of attributes.
    var attributes = Object.keys(entity);
    return attributes.reduce(function (collection, attribute) {
      var value = entity[attribute];
      // Copy attribute's value according to its type.
      // Attribute value's type is either null, undefined, boolean, string,
      // number, or array.
      if (Array.isArray(value)) {
        // Attribute value's type is array.
        // Elements within array are either type string or object.
        if (typeof value[0] === "object") {
          // Elements within array are type object.
          // Values within object are either type string or array.
          var valueCopy = value.map(function (object) {
            var keys = Object.keys(object);
            return keys.reduce(function (collection, key) {
              var objectValue = object[key];
              if (Array.isArray(objectValue)) {
                // Object's value is an array of elements of
                // type string.
                var objectValueCopy = objectValue.slice();
              } else {
                // Object's value is of type string.
                var objectValueCopy = objectValue;
              }
              var novelRecord = {
                [key]: objectValueCopy
              };
              return Object.assign({}, collection, novelRecord);
            }, {});
          });
        } else {
          // Elements within array are type string.
          var valueCopy = value.slice();
        }
      } else {
        // Attribute value's type is either null, undefined, boolean, string,
        // or number.
        var valueCopy = value;
      }
      // Copy existing attributes and values in the collection and include
      // copy of current attribute and its value.
      var novelRecord = {
        [attribute]: valueCopy
      };
      return Object.assign({}, collection, novelRecord);
    }, {});
  }
}
