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
      return General.copyValueJSON(reaction);
    });
    return metaboliteReactions;
    //var fileName = identifier + "-reactions.json";
    //General.saveObject(fileName, metaboliteReactions);
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
    var metabolitesRecords = Extraction
    .copyEntitiesRecordsObjectArray(metabolites);
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
