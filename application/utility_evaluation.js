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
* Functionality of utility for evaluating information about metabolic entities
* and sets.
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
*/
class Evaluation {

  /**
  * Creates summary of information about metabolic entities.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.type Type of entity, reaction or metabolite, of
  * interest.
  * @param {Array<string>} parameters.identifiers Identifiers of entities.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.metabolitesSets Information about
  * metabolites' reactions and sets.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @returns {Array<Object>} Information about metabolic entities.
  */
  static createEntitiesSummary({type, identifiers, reactions, metabolites, reactionsSets, metabolitesSets, compartments, processes} = {}) {
    // Iterate on identifiers.
    return identifiers.map(function (identifier) {
      // Create export according to entity's type.
      if (type === "reaction") {
        return Evaluation.createReactionSummary({
          identifier: identifier,
          reactions: reactions,
          metabolites: metabolites,
          reactionsSets: reactionsSets,
          compartments: compartments,
          processes: processes
        });
      } else if (type === "metabolite") {
        return Evaluation.createMetaboliteSummary({
          identifier: identifier,
          reactions: reactions,
          metabolites: metabolites,
          metabolitesSets: metabolitesSets,
          compartments: compartments,
          processes: processes
        });
      }
    });
  }
  /**
  * Creates summary of information about a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a reaction.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @returns {Object} Information about a reaction.
  */
  static createReactionSummary({identifier, reactions, metabolites, reactionsSets, compartments, processes} = {}) {
    // Access information.
    var reaction = reactions[identifier];
    var reactionSets = reactionsSets[identifier];
    // Metabolites.
    var reactantsIdentifiers = Extraction.collectMetabolitesFilterParticipants({
      criteria: {roles: ["reactant"]},
      participants: reaction.participants
    });
    var productsIdentifiers = Extraction.collectMetabolitesFilterParticipants({
      criteria: {roles: ["product"]},
      participants: reaction.participants
    });
    var reactantsNames = General.collectKeyValueFromEntries({
      identifiers: reactantsIdentifiers,
      key: "name",
      object: metabolites
    });
    var productsNames = General.collectKeyValueFromEntries({
      identifiers: productsIdentifiers,
      key: "name",
      object: metabolites
    });
    // Compartments.
    var compartmentsNames = General.collectKeyValueFromEntries({
      identifiers: reactionSets.compartments,
      key: "name",
      object: compartments
    });
    // Processes.
    var processesNames = General.collectKeyValueFromEntries({
      identifiers: reactionSets.processes,
      key: "name",
      object: processes
    });
    // Compile information.
    return {
      identifier: reaction.identifier,
      name: reaction.name,
      reversibility: reaction.reversibility,
      conversion: reaction.conversion,
      transport: reaction.transport,
      dispersal: reaction.dispersal,
      genes: reaction.genes,
      reactants: reactantsNames,
      products: productsNames,
      compartments: compartmentsNames,
      processes: processesNames
    };
  }
  /**
  * Creates summary of information about a metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a metabolite.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {Object<Object>} parameters.metabolitesSets Information about
  * metabolites' reactions and sets.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @returns {Object} Information a metabolite.
  */
  static createMetaboliteSummary({identifier, reactions, metabolites, metabolitesSets, compartments, processes} = {}) {
    // Access information.
    var metabolite = metabolites[identifier];
    var metaboliteSets = metabolitesSets[identifier];
    // Reactions.
    var reactionsNames = General.collectKeyValueFromEntries({
      identifiers: metaboliteSets.reactions,
      key: "name",
      object: reactions
    });
    // Compartments.
    var compartmentsNames = General.collectKeyValueFromEntries({
      identifiers: metaboliteSets.compartments,
      key: "name",
      object: compartments
    });
    // Processes.
    var processesNames = General.collectKeyValueFromEntries({
      identifiers: metaboliteSets.processes,
      key: "name",
      object: processes
    });
    // Compile information.
    return {
      identifier: metabolite.identifier,
      name: metabolite.name,
      formula: metabolite.formula,
      charge: metabolite.charge,
      reactions: reactionsNames,
      compartments: compartmentsNames,
      processes: processesNames
    };
  }
  /**
  * Creates export of information about network's nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.nodesRecords Information about network's
  * nodes.
  * @param {Object} parameters.networkNodesReactions Information about network's
  * nodes for reactions.
  * @param {Object} parameters.networkNodesMetabolites Information about
  * network's nodes for metabolites.
  * @param {Object<Object>} parameters.candidatesReactions Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.candidatesMetabolites Information about
  * candidate metabolites.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @returns {Array<Object>} Information about network's nodes.
  */
  static createNetworkNodesExport({nodesRecords, networkNodesReactions, networkNodesMetabolites, candidatesReactions, candidatesMetabolites, reactions, metabolites} = {}) {
    return nodesRecords.map(function (record) {
      if (record.type === "reaction") {
        // Access information.
        var identifier = record.identifier;
        var type = record.type;
        var node = networkNodesReactions[identifier];
        var candidate = candidatesReactions[node.candidate];
        var entity = reactions[candidate.reaction];
        // Compile information.
        return {
          identifier: identifier,
          type: type,
          entity: entity.name,
          name: candidate.name
        };
      } else if (record.type === "metabolite") {
        // Access information.
        var identifier = record.identifier;
        var type = record.type;
        var node = networkNodesMetabolites[identifier];
        var candidate = candidatesMetabolites[node.candidate];
        var entity = metabolites[candidate.metabolite];
        // Compile information.
        return {
          identifier: identifier,
          type: type,
          entity: entity.name,
          name: candidate.name
        };
      }
    });
  }
  /**
  * Creates export of information about network's links.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.linksRecords Information about network's
  * links.
  * @param {Object<Object>} parameters.networkLinks Information about network's
  * links.
  * @returns {Array<Object>} Information about network's links.
  */
  static createNetworkLinksExport({linksRecords, networkLinks} = {}) {
    return linksRecords.map(function (record) {
      // Access information.
      var identifier = record.identifier;
      var link = networkLinks[identifier];
      // Compile information.
      return {
        identifier: identifier,
        role: link.role,
        source: record.source,
        target: record.target
      };
    });
  }




  /**
  * Collects information about consensus properties of redundant replicate
  * candidate reactions.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.identifiers Identifiers of reactions.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @returns {Object} Information about a reaction.
  */
  static collectReplicateReactionsConsensusProperties({identifiers, reactions, metabolites, reactionsSets, compartments, processes} = {}) {
    // Collect properties from individual reactions.
    var reactionsProperties = identifiers.map(function (identifier) {
      return Evaluation.createReactionSummary({
        identifier: identifier,
        reactions: reactions,
        metabolites: metabolites,
        reactionsSets: reactionsSets,
        compartments: compartments,
        processes: processes
      });
    });
    // Collect consensus properties.
    return reactionsProperties
    .reduce(function (reactionsCollection, reactionProperties) {
      // Iterate on reaction's properties.
      var properties = Object.keys(reactionProperties);
      return properties.reduce(function (propertiesCollection, property) {
        // Determine whether collection includes the property.
        var value = reactionProperties[property];
        if (propertiesCollection.hasOwnProperty(property)) {
          // Determine whether reaction's value of the property is priority.
          if (property === "name") {
            // Prioritize shortest value.
            if (value.length < propertiesCollection.name.length) {
              // Include the value of the property in the collection.
              var entry = {
                [property]: value
              };
              return Object.assign(propertiesCollection, entry);
            } else {
              // Preserve collection.
              return propertiesCollection;
            }
          } else if (
            property === "reactants" ||
            property === "products" ||
            property === "compartments" ||
            property === "processes" ||
            property === "genes"
          ) {
            // Prioritize unique values.
            if (propertiesCollection[property].includes(value)) {
              // Preserve collection.
              return propertiesCollection
            } else {
              // Include the value of the property in the collection.
              var entry = {
                [property]: [].concat(propertiesCollection[property], value)
              };
              return Object.assign(propertiesCollection, entry);
            }
          } else if (
            property === "reversibility" ||
            property === "conversion" ||
            property === "dispersal" ||
            property === "transport"
          ) {
            // Prioritize true values.
            if (!propertiesCollection[property] && value) {
              // Include the value of the property in the collection.
              var entry = {
                [property]: value
              };
              return Object.assign(propertiesCollection, entry);
            } else {
              // Preserve collection.
              return propertiesCollection
            }
          }
        } else {
          // Include the value of the property in the collection.
          var entry = {
            [property]: value
          };
          return Object.assign(propertiesCollection, entry);
        }
      }, reactionsCollection);
    }, {});
  }
  /**
  * Summarizes a metabolite's participation in reactions.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a metabolite.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.metabolitesSets Information about
  * metabolites' reactions and sets.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @returns {Array<Object>} Information about reactions in which metabolite
  * participates.
  */
  static summarizeMetaboliteReactionsParticipation({metaboliteIdentifier, reactions, metabolites, reactionsSets, metabolitesSets, compartments, processes} = {}) {
    // Access information.
    var metaboliteSets = metabolitesSets[metaboliteIdentifier];
    var reactionsIdentifiers = metaboliteSets.reactions;
    // Collect general information about reactions in which metabolite
    // participates.
    return reactionsIdentifiers.map(function (reactionIdentifier) {
      var generalSummary = Evaluation.createReactionSummary({
        identifier: reactionIdentifier,
        reactions: reactions,
        metabolites: metabolites,
        reactionsSets: reactionsSets,
        compartments: compartments,
        processes: processes
      });
      // Determine specific compartments in which metabolite participates in
      // reaction.
      // Access information.
      var reaction = reactions[reactionIdentifier];
      var participants = Extraction.filterReactionParticipants({
        criteria: {metabolites: [metaboliteIdentifier]},
        participants: reaction.participants
      });
      var compartmentsIdentifiers = General
      .collectValueFromObjects("compartment", participants);
      var compartmentsNames = General.collectKeyValueFromEntries({
        identifiers: compartmentsIdentifiers,
        key: "name",
        object: compartments
      });
      // Compile information.
      // Create entry.
      var entry = {
        compartments: compartmentsNames
      };
      // Replace information in general summary.
      return Object.assign(generalSummary, entry);
    });
  }

  /**
  * Summarizes replication of reactions.
  * @param {Object} reactions Information about all reactions.
  */
  static summarizeReactionsReplication(reactions) {
    console.log("--------------------------------------------------");
    console.log("--------------------------------------------------");
    console.log("--------------------------------------------------");
    console.log("summary of reactions' replication...");
    console.log("sets of reactions by common reactants and products...");
    var records = Extraction.collectReactionsReactantsProducts(reactions);
    console.log("total sets:");
    console.log(records);
    console.log("count total sets: " + records.length);
    // Filter the records for those with multiple reactions.
    var multipleReactions = records.filter(function (record) {
      return record.reactions.length > 1;
    });
    console.log("multiple reactions:");
    console.log(multipleReactions);
    console.log("count multiple reactions: " + multipleReactions.length);
    // Filter replicate records for those with multiple combinations of
    // compartments.
    var multipleReactionsCompartments = multipleReactions
    .filter(function (record) {
      return record.compartments.length > 1;
    });
    console
    .log(
      "count multiple reactions, multiple compartments: " +
      multipleReactionsCompartments.length
    );
    // Filter replicate records for those with multiple combinations of
    // processes.
    var multipleReactionsProcesses = multipleReactions
    .filter(function (record) {
      return record.processes.length > 1;
    });
    console.log(
      "count multiple reactions, multiple processes: " +
      multipleReactionsProcesses.length
    );
    // Filter replicate records for those with a single combination of
    // processes and multiple combinations of compartments.
    var singleProcessMultipleReactionsCompartments = multipleReactions
    .filter(function (record) {
      return record.processes.length === 1 && record.compartments.length > 1;
    });
    console.log(
      "count multiple reactions, single process, multiple compartments: " +
      singleProcessMultipleReactionsCompartments.length
    );
    // Filter replicate records for those with a single combination of
    // compartments and multiple combinations of processes.
    var singleCompartmentMultipleReactionsProcesses = multipleReactions
    .filter(function (record) {
      return record.compartments.length === 1 && record.processes.length > 1;
    });
    console.log(
      "count multiple reactions, single compartment, multiple processes: " +
      singleCompartmentMultipleReactionsProcesses.length
    );
    // Extract identifiers of all replicate reactions.
    var replicateReactions = General
    .collectValuesFromObjects("reactions", multipleReactions);
    console.log("count replicate reactions: " + replicateReactions.length);
    // Filter replicate reactions for those that involve conversion.
    var replicateConversionReactions = replicateReactions
    .filter(function (identifier) {
      var reaction = reactions[identifier];
      return reaction.conversion;
    });
    console
    .log(
      "count replicate conversion reactions: " +
      replicateConversionReactions.length
    );
    // Filter replicate reactions for those that involve dispersal.
    var replicateDispersalReactions = replicateReactions
    .filter(function (identifier) {
      var reaction = reactions[identifier];
      return reaction.dispersal;
    });
    console
    .log(
      "count replicate dispersal reactions: " +
      replicateDispersalReactions.length
    );
    // Filter replicate reactions for those that involve transport.
    var replicateTransportReactions = replicateReactions
    .filter(function (identifier) {
      var reaction = reactions[identifier];
      return reaction.transport;
    });
    console
    .log(
      "count replicate transport reactions: " +
      replicateTransportReactions.length
    );
    console.log("--------------------------------------------------");
    console.log("--------------------------------------------------");
    console.log("--------------------------------------------------");
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
  static extractReactionsUniqueCombinations({attribute, reactionsIdentifiers, reactions} = {}) {
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
  * Creates summary of metabolites' participation in reactions.
  * @param {Object<Object>} metabolites Records with information about
  * metabolites.
  * @returns {Array<Object>} Records with information about the count of
  * reactions in which each metabolite participates.
  */
  static createMetabolitesParticipationSummary(metabolites) {
    // Transfer records for metabolites from a collection in an object to a
    // collection in an array.
    var metabolitesRecords = General
    .copyRecordsObjectArray(metabolites);
    // Summarize the identifier, name, and count of reactions for each
    // metabolite.
    var metabolitesSummaries = metabolitesRecords.map(function (metabolite) {
      return {
        identifier: metabolite.identifier,
        name: metabolite.name,
        count: metabolite.reactions.length
      };
    });
    // Determine frequencies of metabolites with each count of reactions.
    // Determine count of intervals to consider.
    var values = metabolitesSummaries.map(function (record) {
      return record.count;
    });
    var count = General.calculateDistributionIntervalCount({
      values: values,
      interval: 1
    });
    var metabolitesFrequencies = General.calculateRecordsValuesFrequencies({
      records: metabolitesSummaries,
      key: "count",
      count: count + 1
    });
    // Sort records for metabolites by their counts of reactions.
    var summary = metabolitesFrequencies
    .slice()
    .sort(function (firstRecord, secondRecord) {
      return (
        secondRecord.count - firstRecord.count
      );
    });
    return summary;
  }
}
