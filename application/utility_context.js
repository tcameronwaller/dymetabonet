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
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
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
        setsCurrentReactions: setsCurrentReactions,
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
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
  * @param {Array<Object<string>>} parameters.simplificationMetabolites
  * Selections of candidate metabolites for simplification.
  * @param {Array<Object>} parameters.reactionsCollection Information about
  * relevant reactions and their metabolites.
  * @param {Array<Object>} parameters.setsCurrentReactions Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about relevant reactions and their
  * metabolites.
  */
  static collectContextReactionMetabolites({
    setsCurrentReaction,
    compartmentalization,
    simplificationMetabolites,
    reactionsCollection,
    setsCurrentReactions,
    reactions
  } = {}) {
    // Create reference to information about reaction.
    var reaction = General
    .accessObjectRecordByIdentifier(setsCurrentReaction.reaction, reactions);
    // Evaluate reaction's candidacy.
    var candidacy = Context.evaluateReactionCandidacy({
      reactionIdentifier: setsCurrentReaction.reaction,
      compartmentalization: compartmentalization,
      setsCurrentReactions: setsCurrentReactions,
      reactions: reactions
    });
    // Determine whether to include reaction in collection.
    if (candidacy.relevance && candidacy.priority && candidacy.novelty) {
      // Include reaction in collection.
    } else {
      // Exclude reaction from collection.
    }


    ////////////////////////////////////////////////////////////////////////////

    // Determine whether reaction is relevant in the context of interest.
    var relevance = Context.determineReactionContextRelevance({
      reaction: reaction,
      setsCurrentReaction: setsCurrentReaction,
      compartmentalization: compartmentalization
    });
    if (relevance) {
      // Reaction is relevant in the context of interest.
      // Determine whether reaction has redundant replicates in the context of
      // interest.
      var redundantReplicates = Context.collectRedundantReplicateReactions({
        comparisonIdentifier: reaction.identifier,
        compartmentalization: compartmentalization,
        setsCurrentReactions: setsCurrentReactions,
        reactions: reactions
      });
      if (redundantReplicates.length > 0) {
        // Reaction has redundant replicates in the context of interest.
        // Determine whether reaction is the priority of the redundant
        // replicates.
        // TODO: Include the current reaction in the list for consideration...

        if (priority) {
          // Reaction is priority replicate.
          // Compile consensus information from all redundant replicates.

          // Determine whether reaction is novel in the collection.
          if (novelty) {
            // Reaction is novel in the collection.
          } else {
            // Reaction is not novel in the collection.
          }


        } else {
          // Reaction is not priority replicate.
          // Exclude the reaction from the collection of candidates.
        }
      } else {
        // Reaction does not have redundant replicates in the context of
        // interest.

        // Determine whether reaction is novel in the collection.

      }
    } else {
      // Reaction is irrelevant in the context of interest.
      // Exclude the reaction from the collection of candidates.
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
  * Evaluates a reaction's candidacy for inclusion in a collection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
  * @param {Array<Object>} parameters.setsCurrentReactions Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Information about reaction's candidacy.
  */
  static evaluateReactionCandidacy({
    reactionIdentifier, compartmentalization, setsCurrentReactions, reactions
  } = {}) {}



  /**
  * Determines whether a reaction is relevant in the context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Information about a single reaction.
  * @param {Object} parameters.setsCurrentReaction Information about a
  * reaction's metabolites and sets that pass filters.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
  * @returns {boolean} Whether the reaction is relevant in the context of
  * interest.
  */
  static determineReactionContextRelevance({
    reaction,
    setsCurrentReaction,
    compartmentalization
  } = {}) {
    // Filter information about reaction's participants for metabolites and
    // compartments that are relevant in the context of interest.
    var relevantParticipants = Context
    .filterReactionParticipantsContextRelevance({
      participants: reaction.participants,
      metabolites: setsCurrentReaction.metabolites,
      compartments: setsCurrentReaction.compartments,
    });
    // Determine whether reaction is relevant in the context of interest.
    var relevance = Context
    .determineReactionOperationParticipantsContextRelevance({
      participants: relevantParticipants,
      conversion: reaction.conversion,
      transport: reaction.transport,
      transports: reaction.transports,
      compartmentalization: compartmentalization
    });
    return relevance;
  }

  // TODO: Create another function to drive procedure to determine whether reaction deserves simplification by dependency.

  /**
  * Filters information about a reaction's participants for metabolites and
  * compartments that are relevant to context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @param {Array<string>} parameters.metabolites Identifiers of metabolites
  * that participate in a reaction and pass filters.
  * @param {Array<string>} parameters.compartments Identifiers of a reaction's
  * compartments that pass filters.
  * @returns {Array<Object<string>>} Information about participants in a
  * reaction.
  */
  static filterReactionParticipantsContextRelevance({
    participants,
    metabolites,
    compartments,
  } = {}) {
    // Filter participants for those with relevant metabolites and compartments
    // that pass filters.
    var relevantParticipants = Extraction.filterReactionParticipants({
      criteria: {metabolites: metabolites, compartments: compartments},
      participants: participants
    });
    return relevantParticipants;
  }
  /**
  * Filters information about participants in a reaction for metabolites that do
  * not have selections for simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @param {Array<Object<string>>} parameters.simplificationMetabolites
  * Selections of candidate metabolites for simplification.
  * @returns {Array<Object<string>>} Information about participants in a
  * reaction.
  */
  static filterReactionParticipantsNotSimplification({
    participants,
    compartmentalization,
    simplificationMetabolites
  }) {
    // Filter participants for those whose metabolites do not have selections
    // for simplification.
    var notSimplificationParticipants = participants
    .filter(function (participant) {
      // Create identifier for candidate metabolite according to whether
      // compartmentalization is relevant.
      var identifier = Context.createCandidateMetaboliteIdentifier({
        metabolite: participant.metabolite,
        compartment: participant.compartment,
        compartmentalization: compartmentalization
      });
      var simplification = simplificationMetabolites.some(function (record) {
        return record.identifier === identifier;
      });
      return !simplification;
    });
    return notSimplificationParticipants;
  }
  /**
  * Creates the identifier for a candidate metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metabolite Identifier of a general metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @returns {string} Identifier for a candidate metabolite.
  */
  static createCandidateMetaboliteIdentifier({
    metabolite,
    compartment,
    compartmentalization
  } = {}) {
    if (compartmentalization) {
      var identifier = (metabolite + "_" + compartment);
    } else {
      var identifier = metabolite;
    }
    return identifier;
  }
  /**
  * Determines whether a reaction is relevant to the context of interest on the
  * basis of its operation and participants.
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
  static determineReactionOperationParticipantsContextRelevance({
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
  /**
  * Collects identifiers of replicate reactions that are also redundant in the
  * context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.comparisonIdentifier Identifier of a reaction to
  * which to compare all other replicate reactions.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
  * @param {Array<Object>} parameters.setsCurrentReactions Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<string>} Identifiers of reactions.
  */
  static collectRedundantReplicateReactions({
    comparisonIdentifier, compartmentalization, setsCurrentReactions, reactions
  } = {}) {
    // Replicate reactions have identical metabolites that participate as
    // reactants and products.
    // Redundant replicate reactions are also relevant and have participants
    // that are identical in the context of interest.
    // A major factor in this context of interest is compartmentalization.
    // Participants of many replicate reactions are only distinct due to
    // compartmentalization.
    // Create references to information about comparison reaction.
    var comparisonReaction = General
    .accessObjectRecordByIdentifier(comparisonIdentifier, reactions);
    var comparisonSets = General.accessArrayRecordByIdentifier(
      comparisonIdentifier, setsCurrentReactions
    );
    // Determine whether the comparison reaction has replicates.
    if (comparisonReaction.replication) {
      // Reaction has replicates.
      // Collect replicate reactions that are also redundant.
      var redundantReplicates = comparisonReaction.replicates
      .filter(function (replicateIdentifier) {
        // Determine whether replicate reaction is identical to the comparison
        // reaction.
        // Lists of replicate reactions originally include the comparison
        // reaction.
        var identity = (
          comparisonReaction.identifier === replicateIdentifier
        );
        if (!identity) {
          // Replicate reaction is not identical to the comparison reaction.
          // Determine whether replicate reaction passes filters.
          var pass = setsCurrentReactions.some(function (setsCurrentReaction) {
            return setsCurrentReaction.reaction === replicateIdentifier;
          });
          if (pass) {
            // Replicate reaction passes filters.
            // Create references to information about replicate reaction.
            var replicateReaction = General.accessObjectRecordByIdentifier(
              replicateIdentifier, reactions
            );
            var replicateSets = General.accessArrayRecordByIdentifier(
              replicateIdentifier, setsCurrentReactions
            );
            // Determine whether replicate reaction is relevant in the context
            // of interest.
            var relevance = Context.determineReactionContextRelevance({
              reaction: replicateReaction,
              setsCurrentReaction: replicateSets,
              compartmentalization: compartmentalization
            });
            if (relevance) {
              // Replicate reaction is relevant in the context of interest.
              // Determine whether replicate reaction is redundant, indistinct
              // from comparison reaction in context of interest.
              // Compare participants of each reaction that are relevant in
              // context of interest.
              var redundancy = Context.determineReactionsRedundancy({
                firstReaction: comparisonReaction,
                secondReaction: replicateReaction,
                firstSets: comparisonSets,
                secondSets: replicateSets,
                compartmentalization: compartmentalization
              });
              return redundancy;
            } else {
              // Replicate reaction is not relevant in the context of interest.
              // Replicate reaction is not redundant.
              return false;
            }
          } else {
            // Replicate reaction does not pass filters.
            // Replicate reaction is not redundant.
            return false;
          }
        } else {
          // Replicate reaction is identical to the comparison reaction.
          // Replicate reaction is not redundant.
          return false;
        }
      });
    } else {
      // Reaction does not have replicates.
      var redundantReplicates = [];
    }
    return redundantReplicates;
  }
  /**
  * Determines whether two reactions are redundant by comparison of their
  * participants that are relevant in the context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.firstReaction Information about first reaction.
  * @param {Object} parameters.secondReaction Information about second reaction.
  * @param {Object} parameters.firstSets Information about first reaction's
  * metabolites and sets that pass filters.
  * @param {Object} parameters.secondSets Information about second reaction's
  * metabolites and sets that pass filters.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
  * @returns {boolean} Whether reactions are redundant.
  */
  static determineReactionsRedundancy({
    firstReaction, secondReaction, firstSets, secondSets, compartmentalization
  } = {}) = {
    // Only compare relevant participants of each reaction.
    // Filter information about reactions' participants for metabolites and
    // compartments that are relevant in the context of interest.
    var firstParticipants = Context.filterReactionParticipantsContextRelevance({
      participants: firstReaction.participants,
      metabolites: firstSets.metabolites,
      compartments: firstSets.compartments,
    });
    var secondParticipants = Context
    .filterReactionParticipantsContextRelevance({
      participants: secondReaction.participants,
      metabolites: secondSets.metabolites,
      compartments: secondSets.compartments,
    });
    // Determine whether reactions' relevant participants are redundant in the
    // context of interest.
    var redundancy = Context.determineParticipantsRedundancy({
      firstParticipants: firstParticipants,
      secondParticipants: secondParticipants,
      compartmentalization: compartmentalization
    });
    return redundancy;
  }
  /**
  * Determines whether participants of two reactions are redundant in the
  * context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.firstParticipants Information
  * about metabolites' participation in a reaction.
  * @param {Array<Object<string>>} parameters.secondParticipants Information
  * about metabolites' participation in a reaction.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
  * @returns {boolean} Whether participants are redundant.
  */
  static determineParticipantsRedundancy({
    firstParticipants, secondParticipants, compartmentalization
  } = {}) {
    // Determine whether compartmentalization is relevant in the context of
    // interest.
    if (compartmentalization) {
      // Compartmentalization is relevant.
      // Compare participants by metabolites, compartments, and roles.
      var redundancy = Context.determineParticipantsAttributesMutualRedundancy({
        firstParticipants: firstParticipants,
        secondParticipants: secondParticipants,
        attributes: ["metabolite", "compartment", "role"]
      });
    } else {
      // Compartmentalization is irrelevant.
      // Compare participants by metabolites and roles.
      var redundancy = Context.determineParticipantsAttributesMutualRedundancy({
        firstParticipants: firstParticipants,
        secondParticipants: secondParticipants,
        attributes: ["metabolite", "role"]
      });
    }
    return redundancy;
  }
  /**
  * Determines whether two collections of reactions' participants have identical
  * values of specific attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.firstParticipants Information
  * about metabolites' participation in a reaction.
  * @param {Array<Object<string>>} parameters.secondParticipants Information
  * about metabolites' participation in a reaction.
  * @param {Array<string>} parameters.attributes Attributes common of all
  * participants.
  * @returns {boolean} Whether the participants have identical values of
  * attributes.
  */
  static determineParticipantsAttributesRedundancy({
    firstParticipants, secondParticipants, attributes
  } = {}) {
    return firstParticipants.every(function (firstParticipant) {
      return secondParticipants.some(function (secondParticipant) {
        return factors.every(function (factor) {
          firstParticipant[factor] === secondParticipant[factor];
        });
      });
    });
  }
  /**
  * Determines whether two collections of reactions' participants have identical
  * values of specific attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.firstParticipants Information
  * about metabolites' participation in a reaction.
  * @param {Array<Object<string>>} parameters.secondParticipants Information
  * about metabolites' participation in a reaction.
  * @param {Array<string>} parameters.attributes Attributes common of all
  * participants.
  * @returns {boolean} Whether the participants have identical values of
  * attributes.
  */
  static determineParticipantsAttributesMutualRedundancy({
    firstParticipants, secondParticipants, attributes
  } = {}) {
    var firstComparison = Context
    .determineParticipantsAttributesMutualRedundancy({
      firstParticipants: firstParticipants,
      secondParticipants: secondParticipants,
      attributes: attributes
    });
    var secondComparison = Context
    .determineParticipantsAttributesMutualRedundancy({
      firstParticipants: secondParticipants,
      secondParticipants: firstParticipants,
      attributes: attributes
    });
    return firstComparison && secondComparison;
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
