/**
* Functionality of utility for controlling compartmental context, simplification
* of entities, and selections of entities of interest.
* This class does not store any attributes and does not require instantiation.
* This class stores methods for external utility.
*/
class Context {
  /**
  * Collects information about reactions and their metabolites' participation
  * that are relevant in the context of compartmentalization, operation,
  * replication, and simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @param {Array<Object<string>>} parameters.simplificationReactions Selections
  * of reactions for simplification.
  * @param {Array<Object<string>>} parameters.simplificationMetabolites
  * Selections of metabolites for simplification.
  * @param {Array<Object>} parameters.setsCurrentReactions Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about relevant reactions and their
  * metabolites.
  */
  static collectContextReactionsMetabolites({
    compartmentalization,
    simplificationReactions,
    simplificationMetabolites,
    setsCurrentReactions,
    reactions
  } = {}) {
    // Collect information about reactions and their metabolites' participation
    // that are relevant in context of interest.
    // Initialize collection.
    var initialCollection = {
      contextReactions: [],
      simplificationReactions: simplficationReactions,
      contextReactionsMetabolites: []
    };
    // Iterate on reactions.
    return setsCurrentReactions
    .reduce(function (reactionsCollection, setsCurrentReaction) {
      return Context.collectContextReactionMetabolites({
        setsCurrentReaction: setsCurrentReaction,
        compartmentalization: compartmentalization,
        simplificationMetabolites: simplificationMetabolites,
        reactionsCollection: reactionsCollection,
        reactions: reactions
      });
    }, initialCollection);


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
  * Collects information about a reaction and its metabolites' participation
  * that are relevant in the context of compartmentalization, operation,
  * replication, and simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.setsCurrentReaction Information about a
  * reaction's metabolites and sets that pass filters.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @param {Array<Object<string>>} parameters.simplificationMetabolites
  * Selections of metabolites for simplification.
  * @param {Array<Object>} parameters.reactionsCollection Information about
  * relevant reactions and their metabolites.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about relevant reactions and their
  * metabolites.
  */
  static collectContextReactionMetabolites({
    setsCurrentReaction,
    compartmentalization,
    simplificationMetabolites,
    reactionsCollection,
    reactions
  } = {}) {
    // Set reference to information about reaction.
    var reaction = reactions[setsCurrentReaction.reaction];
    // Collect information about metabolites' participation in the reaction in
    // relevant contexts, without consideration of selections for
    // simplification.
    var relevantParticipants = Context.collectReactionRelevantParticipants({
      setsCurrentReaction: setsCurrentReaction,
      participants: reaction.participants,
      compartmentalization: compartmentalization,
      simplificationMetabolites: []
    });
    // Determine whether reaction is relevant to the context of interest,
    // without consideration of selections for simplification.
    var relevance = determineContextReactionRelevance({
      participants: relevantParticipants,
      conversion: reaction.conversion,
      transport: reaction.transport,
      transports: reaction.transports
    });
    var novelty = determineContextReactionNovelty({});



    var operation = Context.determineReactionRelevantOperation();
    var replication = Context.determineReactionRelevantReplication();
    // TODO: I'm not sure there's much necessary in terms of collecting consensus attributes... really just determining the consensus reaction's reference.

    // TODO: If (relevance && novelty) then...
    // TODO: The rest of the procedure should only happen if the reaction IS RELEVANT!
    // Collect information about reaction's metabolites that participate.
    // TODO: This is the part where I collect the contextReactionsMetabolites.



    // Collect information about metabolites' participation in the reaction in
    // relevant contexts, with consideration of selections for simplification.
    var simplificationParticipants = Context
    .collectReactionRelevantParticipants({
      setsCurrentReaction: setsCurrentReaction,
      participants: reaction.participants,
      compartmentalization: compartmentalization,
      simplificationMetabolites: simplificationMetabolites
    });


    // Determine whether reaction is relevant to the context of interest, with
    // consideration of selections for simplification.
    // Determine whether reaction requires simplification by dependency, due to
    // selections for simplification of its metabolites.
    var simplificationRelevance = determineContextReactionRelevance();
    // TODO: If (not simplificationRelevance) then assign simplification by dependency.

  }
  /**
  * Collects information about metabolites' participation in a reaction that is
  * relevant in the context of compartmentalization and simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.setsCurrentReaction Information about a
  * reaction's metabolites and sets that pass filters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @param {Array<Object<string>>} parameters.simplificationMetabolites
  * Selections of metabolites for simplification.
  * @returns {Array<Object<string>>} Information about relevant metabolites'
  * participation in a reaction.
  */
  static collectReactionRelevantParticipants({
    setsCurrentReaction,
    participants,
    compartmentalization,
    simplificationMetabolites
  } = {}) {
    // Compartments within the record of reaction's sets pass filters.
    // Metabolites within the record of reaction's sets also pass filters by
    // compartments.
    // It is necessary to filter participants again in order to collect correct
    // combinations of metabolites and compartments.
    var metabolites = setsCurrentReaction.metabolites;
    var compartments = setsCurrentReaction.compartments;
    // Collect participants for relevant metabolites and compartments.
    var filterParticipants = Extraction.filterReactionParticipants({
      criteria: {metabolites: metabolites, compartments: compartments},
      participants: participants
    });
    // Filter participants by selections for simplification.
    var relevantParticipants = filterParticipants
    .filter(function (participant) {
      var identifier = Context.createContextMetaboliteIdentifier({
        metabolite: participant.metabolite,
        compartment: participant.compartment,
        compartmentalization: compartmentalization
      });
      var simplification = simplificationMetabolites.some(function (record) {
        return record.identifier === identifier;
      });
      return !simplification;
    });
    return relevantParticipants;
  }
  /**
  * Creates the identifier for a contextual metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metabolite Identifier of a general metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @returns {string} Identifier for a contextual metabolite.
  */
  static createContextMetaboliteIdentifier({
    metabolite,
    compartment,
    compartmentalization
  } = {}) {
    if (compartmentalization) {
      return (metabolite + "_" + compartment);
    } else {
      return metabolite;
    }
  }
  /**
  * Determines whether a reaction is relevant to the context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.setsCurrentReaction Information about a
  * reaction's metabolites and sets that pass filters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @param {Array<Object<string>>} parameters.simplificationMetabolites
  * Selections of metabolites for simplification.
  * @returns {Array<Object<string>>} Information about relevant metabolites'
  * participation in a reaction.
  */
  static determineContextReactionRelevance({} = {}) {}






  //TODO: Scrap...

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
