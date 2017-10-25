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
      // Collect information about individual reaction and its metabolites.
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
    // Determine whether reaction is relevant in the context of interest.
    // Collect information about metabolites' participation in the reaction in
    // relevant contexts, without consideration of selections for
    // simplification.
    var relevantParticipants = Context.collectReactionRelevantParticipants({
      participants: reaction.participants,
      metabolites: setsCurrentReaction.metabolites,
      compartments: setsCurrentReaction.compartments,
      compartmentalization: compartmentalization,
      simplificationMetabolites: []
    });
    // Determine whether reaction is relevant in the context of interest,
    // without consideration of selections for simplification.
    var relevance = Context.determineContextReactionRelevance({
      participants: relevantParticipants,
      conversion: reaction.conversion,
      transport: reaction.transport,
      transports: reaction.transports,
      compartmentalization: compartmentalization
    });
    if (relevance) {
      // Reaction is relevant in the context of interest.
      // Determine whether reaction has redundant replicates in the context of
      // interest.
      // TODO: I'll need to update parameters to this function.
      var redundantReplicates = Context.collectRedundantReplicateReactions({
        reactionIdentifier: reactionIdentifier,
        compartmentalization: compartmentalization,
        metabolites: metabolites,
        reactions: reactions
      });
      if (redundantReplicates.length > 0) {
        // Reaction has redundant replicates in the context of interest.
      } else {
        // Reaction does not have redundant replicates in the context of
        // interest.
      }
    } else {
      // Reaction is irrelevant in the context of interest.
    }

    ////////////////////////////////////////////////////////////////////////////
    // TODO: Sort of scrap down here...
    // Determine whether the reaction is a novel candidate for inclusion in the
    // collection.
    var novelty = determineContextReactionNovelty({});



    // TODO: If (relevance && novelty) then...
    // TODO: The rest of the procedure should only happen if the reaction IS RELEVANT!
    // Collect information about reaction's metabolites that participate.
    // TODO: This is the part where I collect the contextReactionsMetabolites.
    // TODO: Deal with replication/redundancy/consensus metabolites here.


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
    var simplificationRelevance = determineContextReactionRelevance({
      participants: simplificationParticipants,
      conversion: reaction.conversion,
      transport: reaction.transport,
      transports: reaction.transports,
      compartmentalization: compartmentalization
    });
    // TODO: If (not simplificationRelevance) then assign simplification by dependency.

  }
  /**
  * Collects information about metabolites' participation in a reaction that is
  * relevant in the context of compartmentalization and simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @param {Array<string>} parameters.metabolites Identifiers of metabolites
  * that participate in a reaction and pass filters.
  * @param {Array<string>} parameters.compartments Identifiers of a reaction's
  * compartments that pass filters.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @param {Array<Object<string>>} parameters.simplificationMetabolites
  * Selections of metabolites for simplification.
  * @returns {Array<Object<string>>} Information about relevant metabolites'
  * participation in a reaction.
  */
  static collectReactionRelevantParticipants({
    participants,
    metabolites,
    compartments,
    compartmentalization,
    simplificationMetabolites
  } = {}) {
    // Compartments within the record of reaction's sets pass filters.
    // Metabolites within the record of reaction's sets also pass filters by
    // compartments.
    // It is necessary to filter participants again in order to collect correct
    // combinations of metabolites and compartments.
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
  * @param {Array<Object<string>>} parameters.participants Information about
  * relevant metabolites' participation in a reaction.
  * @param {boolean} parameters.conversion Whether the reaction involves
  * chemical conversion.
  * @param {boolean} parameters.transport Whether the reaction involves
  * physical transport.
  * @param {Array<Object<string>>} parameters.transports Information about a
  * reaction's transports.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @returns {boolean} Whether the reaction is relevant in the context of
  * interest.
  */
  static determineContextReactionRelevance({
    participants,
    conversion,
    transport,
    transports,
    compartmentalization
  } = {}) {
    // Determine whether reaction's primary operation is chemical conversion or
    // physical transport.
    if (conversion) {
      // Reaction performs chemical conversion.
      // Reaction's relevance depends on the participation of metabolites as
      // both reactants and products.
      var participation = Context.determineReactionParticipation(participants);
      var relevance = participation;
    } else if (transport) {
      // Reaction performs physical transport and not chemical conversion.
      // Reaction's relevance depends on the participation of metabolites as
      // both reactants and products of the transport operation, the
      // compartments of the transport operation, and compartmentalization.
      // Determine whether compartmentalization is relevant.
      if (compartmentalization) {
        // Compartmentalization is relevant.
        var transportation = Context
        .determineReactionTransportation(participants, transports);
      } else {
        // Compartmentalization is irrelevant.
        // Physical transport between compartments is irrelevant.
        var transportation = false;
      }
      var relevance = transportation;
    }
    return relevance;
  }
  /**
  * Determines whether metabolites participate in a reaction as both reactants
  * and products.
  * @param {Array<Object<string>>} participants Information about metabolites'
  * participation in a reaction.
  * @returns {boolean} Whether metabolites participate in the reaction as both
  * reactants and products.
  */
  static determineReactionParticipation(participants) {
    // Collect unique identifiers of metabolites that participate as reactants.
    var reactantsIdentifiers = Extraction.collectMetabolitesFilterParticipants({
      criteria: {roles: ["reactant"]},
      participants: participants
    });
    var uniqueReactants = General.collectUniqueElements(reactantsIdentifiers);
    // Collect unique identifiers of metabolites that participate as products.
    var productsIdentifiers = Extraction.collectMetabolitesFilterParticipants({
      criteria: {roles: ["product"]},
      participants: participants
    });
    var uniqueProducts = General.collectUniqueElements(productsIdentifiers);
    // Determine whether the reaction has at least a single reactant and a
    // single product.
    return (uniqueReactants.length > 0 && uniqueProducts.length > 0);
  }
  /**
  * Determines whether metabolites participate in a reaction as both reactants
  * and products in separate compartments of a transport event.
  * @param {Array<Object<string>>} participants Information about metabolites'
  * participation in a reaction.
  * @param {Array<Object<string>>} transports Information about a reaction's
  * transport events.
  * @returns {boolean} Whether metabolites participate in the reaction as both
  * reactants and products in separate compartments of a transport event.
  */
  static determineReactionTransportation(participants, transports) {
    // Determine whether any transport events involve participation of
    // chemically-identical metabolites as reactants and products in separate
    // compartments.
    var transportation = transports.some(function (transport) {
      var reactantMatches = Extraction.filterReactionParticipants({
        criteria: {
          metabolites: [transport.metabolite],
          compartments: transport.compartments,
          roles: ["reactant"]
        },
        participants: participants
      });
      var productMatches = Extraction.filterReactionParticipants({
        criteria: {
          metabolites: [transport.metabolite],
          compartments: transport.compartments,
          roles: ["product"]
        },
        participants: participants
      });
      var reactantCompartments = General
      .collectValueFromObjects("compartment", reactantMatches);
      var productCompartments = General
      .collectValueFromObjects("compartment", productMatches);
      var sameCompartments = General.compareArraysByMutualInclusion(
        reactantCompartments, productCompartments
      );
      return (
        reactantMatches.length > 0 &&
        productMatches.length > 0 &&
        !sameCompartments
      );
    });
    return transportation;
  }

  // TODO: Re-do the parameters...
  /**
  * Collects identifiers of replicate reactions that are also redundant in the
  * context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reactionIdentifier Identifier of a reaction to
  * which to compare all other replicate reactions.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {Array<Object>} parameters.setsCurrentReactions Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<string>} Identifiers of reactions.
  */
  static collectRedundantReplicateReactions({
    reactionIdentifier, compartmentalization, metabolites, reactions
  } = {}) {
    // Replicate reactions have identical metabolites that participate as
    // reactants and products.
    // Redundant replicate reactions are also relevant and have participants
    // that are indistinguishable in the context of interest.
    // A major factor in this context of interest is compartmentalization.
    // Participants of many replicate reactions are only distinguishable due to
    // compartmentalization.
    // Determine whether the reaction has replicates.
    var reaction = reactions[reactionIdentifier];
    if (reaction.replication) {
      // TODO: Remember that the reaction.replicates includes the reaction's own identifier...
      // TODO: It might be important to account for that since the identical reactions will definitely be redundant.
      // TODO: Address this problem within the filter operation: test.identifier !== comparison.identifier;
      // TODO: Or... just always check for replicates by replicates.length > 1 rather than replicates.length > 0... but that might be confusing.
      // Reaction has replicates.
      // Collect replicate reactions that are also redundant.
      var redundantReplicates = reaction
      .replicates.filter(function (identifier) {});

    } else {
      // Reaction does not have replicates.
      var redundantReplicates = [];
    }




    // TODO: Scrap below here...
    // Relevant reactions persist against current filters for values of their
    // attributes.
    // Relevant reactions also merit representation in the network.
    // Replicate reactions have identical metabolites that participate as
    // reactants and products.
    // Replication of reactions usually accommodates compartmentalization.
    // Replicate reactions that differ in any way other than
    // compartmentalization are redundant.
    // Set reference to reaction's record.
    var reaction = reactions[reactionIdentifier];
    // Determine whether the reaction has replication.
    if (reaction.replication) {
      // Reaction has replication.
      // Collect identifiers of replicate reactions that are both relevant and
      // redundant.
      var redundantReactions = reaction
      .replicates.filter(function (identifier) {
        // Determine whether replicate reaction persists against filters.
        var persistence = reactions.hasOwnProperty(identifier);
        if (persistence) {
          // Replicate reaction persists against filters.
          // Set reference to replicate reaction's record.
          var replicateReaction = reactions[identifier];
          // Determine whether replicate reaction merits representation in the
          // network.
          var representation = Network.determineReactionRepresentation({
            reaction: replicateReaction,
            compartmentalization: compartmentalization,
            metabolites: metabolites
          });
          // Determine whether compartmentalization is relevant.
          if (compartmentalization) {
            // Compartmentalization is relevant.
            // Determine whether replicate reactions involve participation of
            // identical metabolites, in identical compartments, in identical
            // roles.
            var participation = Context.compareMutualReactionsParticipants({
              firstParticipants: reaction.participants,
              secondParticipants: replicateReaction.participants
            });
          } else {
            // Compartmentalization is irrelevant.
            // Ignore details of metabolites' participation in replicate
            // reactions.
            var participation = true;
          }
        } else {
          // Replicate reaction does not persist against filters.
          var representation = false;
          var participation = false;
        }
        return persistence && representation && participation;
      });
      // Return identifiers of replicate reactions that are both relevant and
      // redundant.
      return General.collectUniqueElements(redundantReactions);
    } else {
      // Reaction does not have replication.
      // Return reaction's identifier.
      return [reactionIdentifier];
    }
  }
  /**
  * Compares the participants of two reactions to detmerine if identical
  * metabolites in identical compartments participate in identical roles in both
  * reactions.
  * @param {Array<Object>} firstParticipants Participants of first reaction.
  * @param {Array<Object>} secondParticipants Participants of second reaction.
  * @returns {boolean} Whether the two reactions have identical participants.
  */
  static compareMutualReactionsParticipants({
    firstParticipants, secondParticipants
  } = {}) {
    var firstComparison = Context.compareReactionsParticipants({
      firstParticipants: firstParticipants,
      secondParticipants: secondParticipants
    });
    var secondComparison = Context.compareReactionsParticipants({
      firstParticipants: secondParticipants,
      secondParticipants: firstParticipants
    });
    return firstComparison && secondComparison;
  }
  /**
  * Compares the participants of two reactions to detmerine if all participants
  * of first reaction have identical participants in second reaction.
  * @param {Array<Object>} firstParticipants Participants of first reaction.
  * @param {Array<Object>} secondParticipants Participants of second reaction.
  * @returns {boolean} Whether the two reactions have identical participants.
  */
  static compareReactionsParticipants({
    firstParticipants, secondParticipants
  } = {}) {
    return firstParticipants.every(function (firstParticipant) {
      return secondParticipants.some(function (secondParticipant) {
        var metabolites = (
          firstParticipant.metabolite === secondParticipant.metabolite
        );
        var compartments = (
          firstParticipant.compartment === secondParticipant.compartment
        );
        var roles = (
          firstParticipant.role === secondParticipant.role
        );
        return metabolites && compartments && roles;
      });
    });
  }







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
