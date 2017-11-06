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
* Functionality of utility for evaluation of candidacy of entities for relevance
* in the context of interest, dependent on compartmentalization and
* simplification.
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
*/
class Candidacy {

  // TODO: Account for transport reactions and whether they're relevant.
  // TODO: I removed the consideration of transport reactions from the attribution/filtration procedure

  // TODO: Test the code sooner rather than later!!! Start simple and build complexity with frequent testing.

  /**
  * Determines entities and relations between that are candidates for relevance
  * in the context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object<Object>} parameters.filterReactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Collection of multiple attributes.
  */
  static determineCandidateEntities({
    compartmentalization,
    reactionsSimplifications,
    metabolitesSimplifications,
    filterReactionsSets,
    reactions
  } = {}) {
    // TODO: Rename "context entities" to "candidate entities" since these are
    // TODO: representations of entities that are elligible candidates for representation in the network.
    // Candidate entities are entities that are elligible candidates for
    // representation in the network.
    // An entity's elligibility depends on filters by its values of attributes,
    // the context of interest (especially in terms of compartmentalization),
    // and the elligibility of other entities that relate.
    // The purpose of candidate entities is to enable the user to access
    // information about individual entities and to change their
    // representations in the network.

    // TODO: Filter simplification selections to eliminate those created by dependency.
    // TODO: I need to re-determine these dependency selections each time to account for changes.
    // TODO: Alternatively, I could filter these within the action that changes selections... (a new action)

    // The relevance of individual entities and relations between them depends
    // on the context of interest.
    // A reaction's relevance depends on filtration compartmental context, its
    // own operation, and metabolites' participation.
    // A metabolite's relevance depends on the compartmental context and the
    // reactions in which it participates.

    // This procedure determines the relevance of individual entities and
    // relations between them in the context of interest.
    // Selections of individual entities for simplification directly indicate
    // the relevance of these entities.
    // A selection for simplification does not omit an entity from its list of
    // entities, such that the entity is still accessible for changes to the
    // selection.
    // In contrast, simplification of an entity does influence the relevance of
    // entities of the other type that rely on the entity for their own
    // relevance.
    if (false) {
      var reactionsCandidates = Context.collectCandidateReactionsMetabolites({
        compartmentalization: compartmentalization,
        reactionsSimplifications: reactionsSimplifications,
        metabolitesSimplifications: metabolitesSimplifications,
        filterReactionsSets: filterReactionsSets,
        reactions: reactions
      });
    }

    // TODO: I need records for all entities, including those with selections for omission.
    // TODO: The idea is to give access to each entity and enable selections for simplification.

    // TODO: Create the context-dependent (ie compartmentalization) entities.
    // TODO: These records will be very similar to the currentReactionsSets and currentMetabolitesSets...
    // TODO: They only need references to their respective entity, reaction or metabolite...
    // TODO: ... and to the reactions or metabolites to which they relate
    // TODO: These relations need to reflect current filters AND compartmentalization.
    // TODO: Maybe adapt some processes from the network definition procedure.

    // TODO: Procedure for reactions...
    // TODO: Iterate on currentReactionsSets
    // TODO: For each current reaction...
    // TODO: If compartmentalization is false...
    // TODO: ... then copy the reaction reference and metabolite references from currentReactionsSets... done
    // TODO: If compartmentalization is true...
    // TODO: ... then access the reaction's record and determine in which compartment each metabolite participates
    // TODO: ... only consider compartments that pass filters
    // TODO: ... create compartmental identifiers for the metabolites
    // TODO: ... store references to these compartmental metabolites within the record.
    //
    // TODO: Maybe collect metabolite's reference identifiers and compartments while preparing reactionsCandidates???
    //
    // TODO: Procedure for metabolites...
    // TODO: I suppose just derive the metabolites from the reactions as usual
    // TODO: Compartmental metabolites need their own compartmental identifiers, such as "pyr_c".
    // TODO: Compartmental metabolites also need references to their metabolite records and to their compartment.
    // TODO: Derive the compartmental name as needed, such as "pyruvate cytosol".
    // TODO: For simplicity, just derive metabolite and compartment identifiers from the ID (such as "pyr_c") within reactionsCandidates record.

    if (false) {
      // Compile novel values of attributes.
      var attributesValues = {
        currentReactionsSets: currentReactionsSets,
        currentMetabolitesSets: currentMetabolitesSets,
        setsCardinalities: setsCardinalities,
        setsSummary: setsSummary
      };
      // Return novel values of attributes.
      return attributesValues;

    }
  }

  /**
  * Collects information about reactions and their metabolites that are relevant
  * in the context of compartmentalization, operation, replication, and
  * simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object<Object>} parameters.filterReactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object<Object>} Information about candidate reactions and their
  * metabolites.
  */
  static collectCandidateReactionsMetabolites({
    compartmentalization,
    reactionsSimplifications,
    metabolitesSimplifications,
    filterReactionsSets,
    reactions
  } = {}) {
    // Collect information about reactions and their metabolites' participation
    // that are relevant in context of interest.
    // Initialize collection.
    // TODO: reactionsMetabolites will store identifiers of metabolites and compartments and associate these with ID's of compartmental metabolites.
    var initialCollection = {
      reactionsCandidates: [],
      reactionsSimplifications: reactionsSimplifications,
      reactionsMetabolites: {}
    };
    // Iterate on reactions.
    var reactionsIdentifiers = Object.keys(filterReactionsSets);
    return filterReactionsSets
    .reduce(function (reactionsCollection, reactionSets) {
      // Access information about reaction.
      var reaction = reactions[reactionIdentifier];

      // TODO: Just pass the current reaction's identifier if I still need access to all reactions and reactionsSets...

      // Collect information about individual reaction and its metabolites.
      return Context.collectContextReactionMetabolites({
        setsCurrentReaction: setsCurrentReaction,
        compartmentalization: compartmentalization,
        reactionsSimplifications: reactionsSimplifications,
        metabolitesSimplifications: metabolitesSimplifications,
        reactionsCollection: reactionsCollection,
        currentReactionsSets: currentReactionsSets,
        reactions: reactions
      });
    }, initialCollection);
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
  * @param {Array<Object<string>>} parameters.reactionsSimplifications
  * Selections of reactions for simplification.
  * @param {Array<Object<string>>} parameters.metabolitesSimplifications
  * Selections of candidate metabolites for simplification.
  * @param {Array<Object>} parameters.reactionsCollection Information about
  * relevant reactions and their metabolites.
  * @param {Array<Object>} parameters.currentReactionsSets Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about relevant reactions and their
  * metabolites.
  */
  static collectContextReactionMetabolites({
    setsCurrentReaction,
    compartmentalization,
    reactionsSimplifications,
    metabolitesSimplifications,
    reactionsCollection,
    currentReactionsSets,
    reactions
  } = {}) {
    //var initialCollection = {
    //  reactionsCandidates: [],
    //  reactionsSimplifications: reactionsSimplifications,
    //  reactionsMetabolites: {}
    //};
    // Evaluate reaction's candidacy.
    var reactionIdentifier = setsCurrentReaction.reaction;
    var candidacy = Candidacy.evaluateReactionCandidacy({
      reactionIdentifier: reactionIdentifier,
      compartmentalization: compartmentalization,
      currentReactionsSets: currentReactionsSets,
      reactions: reactions,
      collection: reactionsCollection
    });
    // Determine whether reaction is a viable candidate for the collection.
    if (candidacy.relevance && candidacy.priority && candidacy.novelty) {
      // Reaction is a viable candidate.
      // Include reaction in collection.
      // Collect information about reaction's metabolites.
      var reactionMetabolites = Context.collectCandidateReactionMetabolites({
        reactionIdentifier: reactionIdentifier,
        compartmentalization: compartmentalization,
        currentReactionsSets: currentReactionsSets,
        reactions: reactions
      });
      // Include novel metabolites in collection.
      var currentReactionsMetabolites = Object
      .assign(reactionsCollection.reactionsMetabolites, reactionMetabolites);
      // Collect information about reaction.
      var novelReactionRecord = Context.createCandidateReactionRecord({
        reactionIdentifier: reactionIdentifier,
        replicates: candidacy.replicates,
        currentReactionsSets: currentReactionsSets,
        reactions: reactions
      });
      // Include record for novel reaction in collection.
      //var currentReactionsCollection = []
      //.concat(reactionsCollection.reactionsCandidates, novelReactionRecord);

      // TODO: Update selections for simplification, if necessary.

      var currentReactionsCollection = {
        reactionsCandidates: reactionsCollection.reactionsCandidates,
        reactionsSimplifications: reactionsSimplifications,
        reactionsMetabolites: currentReactionsMetabolites
      };
      return currentReactionsCollection;
    } else {
      // Reaction is not a viable candidate.
      // Exclude reaction from collection.
      // Preserve collection.
      return reactionsCollection;
    }
  }


  // TODO: Code that I've reviewed and seems fairly functional.
  //////////////////////////////////////////////////////////////////////////////

  /**
  * Determines whether a reaction is relevant in the context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Information about a single reaction.
  * @param {Object} parameters.reactionSets Information about a reaction's
  * metabolites and sets.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @returns {boolean} Whether the reaction is relevant.
  */
  static determineReactionContextRelevance({
    reaction,
    reactionSets,
    compartmentalization
  } = {}) {
    // Filter for reaction's relevant participants.
    var relevantParticipants = Extraction.filterReactionParticipants({
      criteria: {
        metabolites: reactionSets.metabolites,
        compartments: reactionSets.compartments
      },
      participants: reaction.participants
    });
    // Determine whether reaction is relevant.
    return Candidacy.determineReactionParticipantsOperationRelevance({
      participants: relevantParticipants,
      conversion: reaction.conversion,
      transport: reaction.transport,
      transports: reaction.transports,
      compartmentalization: compartmentalization
    });
  }
  /**
  * Determines whether a reaction is relevant on the basis of its participants
  * and operation.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' and compartments' participation in a reaction.
  * @param {boolean} parameters.conversion Whether a reaction involves chemical
  * conversion.
  * @param {boolean} parameters.transport Whether a reaction involves physical
  * transport.
  * @param {Array<Object<string>>} parameters.transports Information about a
  * reaction's transports.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @returns {boolean} Whether the reaction is relevant.
  */
  static determineReactionParticipantsOperationRelevance({
    participants,
    conversion,
    transport,
    transports,
    compartmentalization
  } = {}) {
    // Determine whether reaction's operation.
    if (conversion) {
      // Reaction's performs chemical conversion.
      // Reaction's relevance depends on the participation of metabolites as
      // both reactants and products.
      return Candidacy.determineReactionParticipation(participants);
    } else if (transport) {
      // Reaction performs physical transport and not chemical conversion.
      // Reaction's relevance depends on the participation of metabolites as
      // both reactants and products in the transport operation, the
      // compartments of the transport operation, and compartmentalization.
      // Determine whether compartmentalization is relevant.
      if (compartmentalization) {
        // Compartmentalization is relevant.
        return Candidacy
        .determineReactionTransportation(participants, transports);
      } else {
        // Compartmentalization is irrelevant.
        // Physical transport between compartments is irrelevant.
        return false;
      }
    }
  }
  /**
  * Determines whether metabolites participate in a reaction as both reactants
  * and products.
  * @param {Array<Object<string>>} participants Information about metabolites'
  * and compartments' participation in a reaction.
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
  * and compartments' participation in a reaction.
  * @param {Array<Object<string>>} parameters.transports Information about a
  * reaction's transports.
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

  //////////////////////////////////////////////////////////////////////////////

  // TODO: Does the function evaluateReactionCandidacy make sense?

  /**
  * Evaluates a reaction's candidacy for inclusion in a collection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
  * @param {Array<Object>} parameters.currentReactionsSets Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Array<Object>} parameters.collection Information about relevant
  * reactions and their metabolites.
  * @returns {Object} Information about reaction's candidacy.
  */
  static evaluateReactionCandidacy({
    reactionIdentifier,
    compartmentalization,
    filterReactionsSets,
    reactions,
    collection
  } = {}) {
    // Access information about reaction.
    var reaction = reactions[reactionIdentifier];
    var reactionSets = filterReactionsSets[reactionIdentifier];
    // Determine whether reaction is relevant.
    var relevance = Candidacy.determineReactionContextRelevance({
      reaction: reaction,
      reactionSets: reactionSets,
      compartmentalization: compartmentalization
    });
    if (relevance) {
      // Reaction is relevant.
      // Determine whether reaction has redundant replicates.
      var redundantReplicates = Candidacy.collectRedundantReplicateReactions({
        comparisonIdentifier: reaction.identifier,
        compartmentalization: compartmentalization,
        currentReactionsSets: currentReactionsSets,
        reactions: reactions
      });
      if (redundantReplicates.length > 0) {
        // Reaction has redundant replicates.
        // Preserve references to redundant replicates.
        // Determine whether reaction is the priority of the redundant
        // replicates.
        var priority = Candidacy.determineReactionReplicatePriority({
          reactionIdentifier: reaction.identifier,
          replicateReactions: redundantReplicates
        });
        if (priority) {
          // Reaction is the priority.
          // Determine whether reaction is novel in the collection.
          var novelty = !collection.reactionsCandidates.some(function (record) {
            return record.identifier === reactionIdentifier;
          });
        } else {
          // Reaction is not a priority.
          var novelty = false;
        }
      } else {
        // Reaction does not have redundant replicates.
        // Reaction is a priority.
        var priority = true;
        // Determine whether reaction is novel in the collection.
        var novelty = !collection.reactionsCandidates.some(function (record) {
          return record.identifier === reactionIdentifier;
        });
      }
    } else {
      // Reaction is irrelevant in the context of interest.
      // Exclude the reaction from the collection of candidates.
      var priority = false;
      var novelty = false;
      var redundantReplicates = [];
    }
    // Compile information.
    return {
      relevance: relevance,
      priority: priority,
      novelty: novelty,
      replicates: redundantReplicates
    };
  }




  /**
  * Collects identifiers of replicate reactions that are also redundant in the
  * context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.comparisonIdentifier Identifier of a reaction to
  * which to compare all other replicate reactions.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
  * @param {Array<Object>} parameters.currentReactionsSets Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<string>} Identifiers of reactions.
  */
  static collectRedundantReplicateReactions({
    comparisonIdentifier, compartmentalization, currentReactionsSets, reactions
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
      comparisonIdentifier, currentReactionsSets
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
          var pass = General.determineArrayRecordByIdentifier(
            replicateIdentifier, currentReactionsSets
          );
          if (pass) {
            // Replicate reaction passes filters.
            // Access information about replicate reaction.
            var replicateReaction = General.accessObjectRecordByIdentifier(
              replicateIdentifier, reactions
            );
            var replicateSets = General.accessArrayRecordByIdentifier(
              replicateIdentifier, currentReactionsSets
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
  } = {}) {
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
  static determineParticipantsAttributesMutualRedundancy({
    firstParticipants, secondParticipants, attributes
  } = {}) {
    var firstComparison = Context
    .determineParticipantsAttributesRedundancy({
      firstParticipants: firstParticipants,
      secondParticipants: secondParticipants,
      attributes: attributes
    });
    var secondComparison = Context
    .determineParticipantsAttributesRedundancy({
      firstParticipants: secondParticipants,
      secondParticipants: firstParticipants,
      attributes: attributes
    });
    return firstComparison && secondComparison;
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
        return attributes.every(function (attribute) {
          firstParticipant[attribute] === secondParticipant[attribute];
        });
      });
    });
  }
  /**
  * Determines whether a reaction is the priority replicate.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {Array<string>} parameters.replicateReactions Identifiers of
  * reactions.
  * @returns {boolean} Whether reaction is the priority replicate.
  */
  static determineReactionReplicatePriority({
    reactionIdentifier, replicateReactions
  } = {}) {
    // Include the reaction's identifier in the list of replicates.
    var reactionsIdentifiers = []
    .concat(reactionIdentifier, replicateReactions);
    // Sort reactions' identifiers by alphabetical order.
    var sortReactionsIdentifiers = General
    .sortArrayElementsByCharacter(reactionsIdentifiers);
    // Select first reaction's identifier as priority.
    var priorityReactionIdentifier = sortReactionsIdentifiers[0];
    // Determine whether reaction is the priority replicate.
    return reactionIdentifier === priorityReactionIdentifier;
  }
  /**
  * Collects information about metabolites that participate in a candidate
  * reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
  * @param {Array<Object>} parameters.currentReactionsSets Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object<Object>} Information about a candidate reaction's
  * metabolites.
  */
  static collectCandidateReactionMetabolites({
    reactionIdentifier,
    compartmentalization,
    currentReactionsSets,
    reactions
  } = {}) {
    // Access information about reaction.
    var reaction = General
    .accessObjectRecordByIdentifier(reactionIdentifier, reactions);
    var reactionSets = General.accessArrayRecordByIdentifier(
      reactionIdentifier, currentReactionsSets
    );
    // Prepare information about reaction's metabolites.
    // Filter information about reaction's participants for metabolites and
    // compartments that are relevant in the context of interest.
    var participants = Context.filterReactionParticipantsContextRelevance({
      participants: reaction.participants,
      metabolites: reactionSets.metabolites,
      compartments: reactionSets.compartments,
    });
    var reactionMetabolites = participants
    .reduce(function (collection, participant) {
      // Create identifier for candidate metabolite.
      var identifier = Context.createCandidateMetaboliteIdentifier({
        metabolite: participant.metabolite,
        compartment: participant.compartment,
        compartmentalization: compartmentalization
      }, {});
      // Determine whether to represent the metabolite's compartment.
      if (compartmentalization) {
        var compartment = participant.compartment;
      } else {
        var compartment = null;
      }
      // Determine whether collection already includes information about the
      // metabolite.
      if (collection.hasOwnProperty(identifier)) {
        // Collection includes information about the metabolite.
        return collection;
      } else {
        // Collection does not include information about the metabolite.
        // Include the metabolite in the collection.
        // Compile attributes.
        var attributes = {
          identifier: identifier,
          metabolite: participant.metabolite,
          compartment: compartment
        };
        // Create record.
        var record = {
          [identifier]: attributes
        };
        return record;
      }
    }, {});
    return reactionMetabolites;
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
  * Creates a record with information about a candidate reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {Array<string>} parameters.replicates Identifiers of reactions.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant in the context of interest.
  * @param {Array<Object>} parameters.currentReactionsSets Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Information about a candidate reaction.
  */
  static createReactionCandidate({
    reactionIdentifier,
    replicates,
    compartmentalization,
    currentReactionsSets,
    reactions
  } = {}) {
  }




//////////////////////
////////////////////// In progres...

  /**
  * Filters information about participants in a reaction for metabolites that do
  * not have selections for simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @param {boolean} parameters.compartmentalization Whether to represent
  * compartmentalization.
  * @param {Array<Object<string>>} parameters.metabolitesSimplifications
  * Selections of candidate metabolites for simplification.
  * @returns {Array<Object<string>>} Information about participants in a
  * reaction.
  */
  static filterReactionParticipantsNotSimplification({
    participants,
    compartmentalization,
    metabolitesSimplifications
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
      var simplification = metabolitesSimplifications.some(function (record) {
        return record.identifier === identifier;
      });
      return !simplification;
    });
    return notSimplificationParticipants;
  }



  //TODO: Scrap...

  /**
  * Collects for each reaction information about the compartmental metabolites
  * that participate.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.currentReactionsSets Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about reactions' metabolites.
  */
  static collectInterestReactionsCompartmentalMetabolites({
    currentReactionsSets, reactions
  } = {}) {
    // Collect reactions along with compartmental representations of their
    // metabolites.
    // Iterate on reactions.
    return currentReactionsSets.map(function (reactionRecord) {
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
  * @param {Array<Object>} parameters.currentReactionsSets Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about reactions' metabolites.
  */
  static collectInterestReactionsGeneralMetabolites({
    currentReactionsSets, reactions
  } = {}) {
    // Collect reactions along with general representations of their
    // metabolites.
    // Iterate on reactions.
    return currentReactionsSets.map(function (reactionRecord) {
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
