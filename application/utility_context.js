/**
* Functionality of utility for controlling compartmental context, simplification
* of entities, and selections of entities of interest.
* This class does not store any attributes and does not require instantiation.
* This class stores methods for external utility.
*/
class Context {
  /**
  * Collects information about reactions and their metabolites that are relevant
  * in the context of compartmentalization, operation, and individual entities.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Selection of whether to
  * represent compartmentalization.
  * @param {Array<Object>} parameters.setsCurrentReactions Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about reactions' metabolites.
  */
  static collectContextReactionsMetabolites({
    compartmentalization, setsCurrentReactions, reactions
  } = {}) {
    // A reaction's relevance depends on context.
    // This context includes the relevance of compartmentalization, the
    // reaction's primary operation, and the relevance of metabolites'
    // participation.
    // Direct selections for simplification by omission of individual reactions
    // also dictates the reaction's relevance; however, these reactions should
    // still be accessible.

    // TODO: I think one of first steps should be to determine general/compartmental metabolites.
    // TODO: That'll be necessary before checking for metabolite simplification/relevance.

    // Determine whether to represent compartmentalization.
    // Since compartmentalization applies to all entities, determine this
    // distinction a single time for efficiency.
    if (compartmentalization) {
      // Compartmentalization is relevant.
      // Collect reactions along with compartmental representations of their
      // metabolites.
      var interestReactions = Interest
      .collectInterestReactionsCompartmentalMetabolites({
        setsCurrentReactions: setsCurrentReactions,
        reactions: reactions
      });

    } else {
      // Compartmentalization is irrelevant.
      // Collect reactions along with general representations of their
      // metabolites.
      var interestReactions = Interest
      .collectInterestReactionsGeneralMetabolites({
        setsCurrentReactions: setsCurrentReactions,
        reactions: reactions
      });
    }
    return interestReactions;
  }
  /**
  * Collects for each reaction information about the compartmental metabolites
  * that participate.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.setsCurrentReactions Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about reactions' metabolites.
  */
  static collectInterestReactionsCompartmentalMetabolites({
    setsCurrentReactions, reactions
  } = {}) {
    // Collect reactions along with compartmental representations of their
    // metabolites.
    // Iterate on reactions.
    return setsCurrentReactions.map(function (reactionRecord) {
      var reactionReference = reactionRecord.reaction;
      var identifier = reactionRecord.reaction;
      // Set reference to reaction.
      var reaction = reactions[reactionRecord.reaction];

      var metabolites = reactionRecord.metabolites.slice();
      // Compile reaction's attributes.
      // Create reaction's record.
      var record = {
        identifier: identifier,
        reaction: reaction,
        metabolites: metabolites
      };
      return record;
    });


  }
  /**
  * Collects for each reaction information about the general metabolites that
  * participate.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.setsCurrentReactions Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about reactions' metabolites.
  */
  static collectInterestReactionsGeneralMetabolites({
    setsCurrentReactions, reactions
  } = {}) {
    // Collect reactions along with general representations of their
    // metabolites.
    // Iterate on reactions.
    return setsCurrentReactions.map(function (reactionRecord) {
      var reactionReference = reactionRecord.reaction;
      var identifier = reactionRecord.reaction;
      var metabolites = reactionRecord.metabolites.slice();
      // Compile reaction's attributes.
      // Create reaction's record.
      var record = {
        identifier: identifier,
        reaction: reactionReference,
        metabolites: metabolites
      };
      return record;
    });
  }


}
