/**
* Functionality of utility for evaluating information about metabolic entities
* and sets.
* This class does not store any attributes and does not require instantiation.
* This class stores methods for external utility.
*/
class Evaluation {
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
    var records = Extraction
    .collectReactionsReactantsProducts(reactions);
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
  * Extracts and saves information about reactions in which a single metabolite
  * participates.
  * @param {string} identifier Identifier for a single metabolite.
  * @param {Object} metabolites Information about all metabolites.
  * @param {Object} reactions Information about all reactions.
  * @returns {Array<Object>} Information about reactions in which the metabolite
  * participates.
  */
  static extractMetaboliteReactions({identifier, metabolites, reactions} = {}) {
    var metabolite = metabolites[identifier];
    var reactionIdentifiers = metabolite.reactions;
    var metaboliteReactions = reactionIdentifiers.map(function (identifier) {
      var reaction = reactions[identifier];
      return Extraction.copyEntityAttributesValues(reaction);
    });
    var fileName = identifier + "-reactions.json";
    General.saveObject(fileName, metaboliteReactions);
  }

}
