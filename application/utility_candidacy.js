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

  // Master procedures for collection of candidate entities, collection of their
  // simplifications, and preparation of summaries.

  /**
  * Evaluates the context of interest and collects candidate entities and their
  * implicit simplifications.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<string>} parameters.candidatesSearches Searches to filter
  * candidates' summaries.
  * @param {Object<Object<string>>} parameters.candidatesSorts Specifications to
  * sort candidates' summaries.
  * @param {Object} parameters.compartments Information about compartments.
  * @returns {Object} Information about candidate entities, their
  * simplifications, and summaries.
  */
  static evaluateCandidacyContext({reactionsSets, reactions, metabolites, compartmentalization, metabolitesSimplifications, reactionsSimplifications, candidatesSearches, candidatesSorts, compartments} = {}) {
    // Filter information about simplifications for entities to omit those that
    // are implicit and include only those that are explicit.
    var simplifications = Candidacy.filterExplicitSimplifications({
      metabolitesSimplifications: metabolitesSimplifications,
      reactionsSimplifications: reactionsSimplifications
    });
    // Collect information about candidate entities and their simplifications.
    var candidatesSimplifications = Candidacy.collectCandidatesSimplifications({
      reactionsSets: reactionsSets,
      reactions: reactions,
      metabolites: metabolites,
      compartmentalization: compartmentalization,
      metabolitesSimplifications: simplifications.metabolitesSimplifications,
      reactionsSimplifications: simplifications.reactionsSimplifications,
      compartments: compartments
    });
    // Prepare summaries of candidates' degrees.
    var candidatesSummaries = Candidacy.prepareCandidatesSummaries({
      reactionsCandidates: candidatesSimplifications.reactionsCandidates,
      metabolitesCandidates: candidatesSimplifications.metabolitesCandidates,
      candidatesSearches: candidatesSearches,
      candidatesSorts: candidatesSorts
    });
    // Compile information.
    var candidatesSimplificationsSummaries = {
      reactionsCandidates: candidatesSimplifications.reactionsCandidates,
      metabolitesCandidates: candidatesSimplifications.metabolitesCandidates,
      reactionsSimplifications: candidatesSimplifications
      .reactionsSimplifications,
      metabolitesSimplifications: candidatesSimplifications
      .metabolitesSimplifications,
      candidatesSummaries: candidatesSummaries
    };
    // Return information.
    return candidatesSimplificationsSummaries;
  }

  /**
  * Changes designations of entities for simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {string} parameters.method Method for simplification, omission or
  * replication.
  * @param {string} parameters.type Type of entities, metabolites or reactions.
  * @param {Object<Object>} parameters.reactionsCandidates Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.metabolitesCandidates Information about
  * candidate metabolites.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @returns {Object<Object>} Information about simplification of entities.
  */
  static changeSimplifications({identifier, method, type, reactionsCandidates, metabolitesCandidates, reactionsSets, reactions, compartmentalization, reactionsSimplifications, metabolitesSimplifications} = {}) {
    // Filter information about simplifications for entities to omit those that
    // are implicit and include only those that are explicit.
    var explicitSimplifications = Candidacy.filterExplicitSimplifications({
      metabolitesSimplifications: metabolitesSimplifications,
      reactionsSimplifications: reactionsSimplifications
    });
    // Change information about explicit simplification of entities to represent
    // change to a single entity.
    var novelSimplifications = Candidacy.changeTypeExplicitSimplifications({
      identifier: identifier,
      method: method,
      type: type,
      metabolitesSimplifications: explicitSimplifications
      .metabolitesSimplifications,
      reactionsSimplifications: explicitSimplifications.reactionsSimplifications
    });
    // Collect information about any implicit simplifications for entities and
    // include with information about explicit simplifications.
    var completeSimplifications = Candidacy.collectImplicitSimplifications({
      reactionsCandidates: reactionsCandidates,
      metabolitesCandidates: metabolitesCandidates,
      reactionsSets: reactionsSets,
      reactions: reactions,
      compartmentalization: compartmentalization,
      reactionsSimplifications: novelSimplifications.reactionsSimplifications,
      metabolitesSimplifications: novelSimplifications
      .metabolitesSimplifications
    });
    // Return information.
    return completeSimplifications;
  }

  // Management of candidate entities.

  /**
  * Collects information about entities that are candidates for representation
  * in the network and their implicit simplifications.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object} parameters.compartments Information about compartments.
  * @returns {Object} Information about candidate entities and their
  * simplifications.
  */
  static collectCandidatesSimplifications({reactionsSets, reactions, metabolites, compartmentalization, metabolitesSimplifications, reactionsSimplifications, compartments} = {}) {
    // Candidate entities are entities that are elligible candidates for
    // representation in the network.
    // An entity's candidacy depends on filters by its values of attributes,
    // the context of interest in terms of relevance of compartmentalization,
    // and the candidacies of other entities to which the entity relates.
    // A reaction's candidacy depends on the candidacies of metabolites that
    // participate in it.
    // A metabolite's candidacy depends on the candidacies of reactions in which
    // it participates.
    // The purpose of candidate entities is to allow access to information about
    // individual entities and to change their representations in the network by
    // simplification.
    // An entity's candidacy does not depend on its own designation for
    // simplification or on the simplification of entities to which it relates.
    // This separation between candidacy and simplification is important to
    // maintain accessibility of entities.
    // In contrast, entities do inherit simplification by their dependency on
    // entities to which they relate.
    // An entity can be an elligible candidate but still merit simplification by
    // its dependency on other entities that merit simplification.
    // There are explicit and implicit designations for simplification.
    // Explicit designations for simplification come from explicit selections.
    // Implicit designations for simplification come from an entity's dependency
    // on other entities with explicit designations for simplification.
    // Collect information about candidate entities and their simplifications.
    var reactionsCollection = Candidacy
    .collectCandidateReactionsMetabolitesSimplifications({
      reactionsSets: reactionsSets,
      reactions: reactions,
      metabolites: metabolites,
      compartmentalization: compartmentalization,
      metabolitesSimplifications: metabolitesSimplifications,
      reactionsSimplifications: reactionsSimplifications,
      compartments: compartments
    });
    var metabolitesCollection = Candidacy
    .collectCandidateMetabolitesReactionsSimplifications({
      reactionsCandidates: reactionsCollection.reactionsCandidates,
      reactionsMetabolites: reactionsCollection.reactionsMetabolites,
      metabolitesSimplifications: metabolitesSimplifications,
      reactionsSimplifications: reactionsCollection.reactionsSimplifications,
    });
    // Compile information.
    var candidatesSimplifications = {
      reactionsCandidates: reactionsCollection.reactionsCandidates,
      metabolitesCandidates: metabolitesCollection.metabolitesCandidates,
      reactionsSimplifications: reactionsCollection.reactionsSimplifications,
      metabolitesSimplifications: metabolitesCollection
      .metabolitesSimplifications
    };
    // Return information.
    return candidatesSimplifications;
  }

  // Definition of candidate reactions.

  /**
  * Collects information about reactions and their metabolites that are
  * candidates for representation in the network and their implicit
  * simplifications.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object} parameters.compartments Information about compartments.
  * @returns {Object<Object>} Information about candidate reactions, their
  * metabolites, and their simplifications.
  */
  static collectCandidateReactionsMetabolitesSimplifications({compartmentalization, reactionsSets, reactions, metabolites, metabolitesSimplifications, reactionsSimplifications, compartments} = {}) {
    // Collect information about reactions and their metabolites that are
    // candidates for representation in the network.
    // Collect information about reactions' implicit simplifications and include
    // with information about reactions' explicit simplifications.
    // Initialize collection.
    var initialCollection = {
      reactionsCandidates: {},
      reactionsSimplifications: reactionsSimplifications,
      reactionsMetabolites: {}
    };
    // Iterate on reactions.
    var reactionsIdentifiers = Object.keys(reactionsSets);
    return reactionsIdentifiers
    .reduce(function (collection, reactionIdentifier) {
      return Candidacy.collectCandidateReactionMetabolitesSimplification({
        reactionIdentifier: reactionIdentifier,
        reactionsSets: reactionsSets,
        reactions: reactions,
        metabolites: metabolites,
        compartmentalization: compartmentalization,
        metabolitesSimplifications: metabolitesSimplifications,
        compartments: compartments,
        collection: collection
      });
    }, initialCollection);
  }
  /**
  * Collects information about a reaction and its metabolites that are
  * candidates for representation in the network and its implicit
  * simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object<Object>} parameters.collection Information about candidate
  * reactions, their metabolites, and their simplifications.
  * @returns {Object<Object>} Information about candidate reactions, their
  * metabolites, and their simplifications.
  */
  static collectCandidateReactionMetabolitesSimplification({reactionIdentifier, reactionsSets, reactions, metabolites, compartmentalization, metabolitesSimplifications, compartments, collection} = {}) {
    // Evaluate reaction's candidacy.
    var candidacy = Candidacy.evaluateReactionCandidacy({
      reactionIdentifier: reactionIdentifier,
      reactionsSets: reactionsSets,
      reactions: reactions,
      compartmentalization: compartmentalization,
      collection: collection
    });
    // Determine whether reaction is a valid candidate.
    if (candidacy.relevance && candidacy.priority && candidacy.novelty) {
      // Reaction is a valid candidate.
      // Access information about reaction.
      var reaction = reactions[reactionIdentifier];
      var reactionSets = reactionsSets[reactionIdentifier];
      // Include information about candidate reaction in collection.
      // Collect information about reaction's metabolites.
      var reactionMetabolites = Candidacy.collectReactionMetabolites({
        reaction: reaction,
        reactionSets: reactionSets,
        compartmentalization: compartmentalization,
        metabolites: metabolites,
        compartments: compartments
      });
      // Include information about novel metabolites in collection.
      var reactionsMetabolites = Object
      .assign(collection.reactionsMetabolites, reactionMetabolites);
      // Collect identifiers of reaction's metabolites.
      var metabolitesIdentifiers = Object.keys(reactionMetabolites);
      // Compile information.
      var information = {
        identifier: reactionIdentifier,
        reaction: reactionIdentifier,
        replicates: candidacy.replicates,
        metabolites: metabolitesIdentifiers,
        name: reaction.name
      };
      // Create entry.
      var entry = {
        [reactionIdentifier]: information
      };
      // Include record in collection.
      var reactionsCandidates = Object
      .assign(collection.reactionsCandidates, entry);
      // Collect information about any implicit simplification for the reaction
      // and include with information about simplifications for other reactions.
      var reactionsSimplifications = Candidacy
      .collectReactionImplicitSimplification({
        reactionCandidate: information,
        reactions: reactions,
        reactionsSets: reactionsSets,
        compartmentalization: compartmentalization,
        metabolitesSimplifications: metabolitesSimplifications,
        reactionsSimplifications: collection.reactionsSimplifications
      });
      // Compile information.
      return {
        reactionsCandidates: reactionsCandidates,
        reactionsMetabolites: reactionsMetabolites,
        reactionsSimplifications: reactionsSimplifications
      };
    } else {
      // Reaction is not a valid candidate.
      // Exclude reaction from collection.
      // Preserve collection.
      return collection;
    }
  }
  /**
  * Evaluates a reaction's candidacy for inclusion in a collection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.collection Information about candidate
  * reactions, their metabolites, and their simplifications.
  * @returns {Object} Information about reaction's candidacy.
  */
  static evaluateReactionCandidacy({reactionIdentifier, reactionsSets, reactions, compartmentalization, collection} = {}) {
    // Access information about reaction.
    var reaction = reactions[reactionIdentifier];
    var reactionSets = reactionsSets[reactionIdentifier];
    // Determine whether reaction is relevant.
    var relevance = Candidacy.determineReactionContextRelevance({
      reaction: reaction,
      reactionSets: reactionSets,
      compartmentalization: compartmentalization
    });
    if (relevance) {
      // Reaction is relevant.
      // Collect any redundant replicates.
      var redundantReplicates = Candidacy.collectRedundantReplicateReactions({
        reactionIdentifier: reactionIdentifier,
        compartmentalization: compartmentalization,
        reactionsSets: reactionsSets,
        reactions: reactions
      });
      // Determine whether reaction has redundant replicates
      if (redundantReplicates.length > 0) {
        // Reaction has redundant replicates.
        // Preserve references to redundant replicates.
        // Determine whether reaction is the priority of the redundant
        // replicates.
        var priority = Candidacy.determineReactionReplicatePriority({
          reactionIdentifier: reactionIdentifier,
          replicateIdentifiers: redundantReplicates
        });
        if (priority) {
          // Reaction is the priority replicate.
          // Determine whether reaction is novel in the collection.
          var novelty = !collection
          .reactionsCandidates.hasOwnProperty(reactionIdentifier);
        } else {
          // Reaction is not a priority.
          var novelty = false;
        }
      } else {
        // Reaction does not have redundant replicates.
        // Reaction is a priority.
        var priority = true;
        // Determine whether reaction is novel in the collection.
        var novelty = !collection
        .reactionsCandidates.hasOwnProperty(reactionIdentifier);
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
  * Determines whether a reaction is relevant in the context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Information about a single reaction.
  * @param {Object} parameters.reactionSets Information about a reaction's
  * metabolites and sets.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @returns {boolean} Whether the reaction is relevant.
  */
  static determineReactionContextRelevance({reaction, reactionSets, compartmentalization} = {}) {
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
  static determineReactionParticipantsOperationRelevance({participants, conversion, transport, transports, compartmentalization} = {}) {
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
  /**
  * Collects identifiers of replicate reactions that are also redundant in the
  * context of interest.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<string>} Identifiers of reactions.
  */
  static collectRedundantReplicateReactions({reactionIdentifier, compartmentalization, reactionsSets, reactions} = {}) {
    // Replicate reactions have identical metabolites that participate as
    // reactants and products.
    // Redundant replicate reactions are also relevant and have participants
    // that are identical in the context of interest.
    // A major factor in this context of interest is compartmentalization.
    // Participants of many replicate reactions are only distinct due to
    // compartmentalization.
    // Access information about comparison reaction.
    var comparisonIdentifier = reactionIdentifier;
    var comparisonReaction = reactions[comparisonIdentifier];
    var comparisonSets = reactionsSets[comparisonIdentifier];
    // Collect any replicate reactions that are also redundant.
    return comparisonReaction.replicates.filter(function (replicateIdentifier) {
      // Determine whether replicate reaction is identical to the comparison
      // reaction.
      // Lists of replicate reactions originally include the comparison
      // reaction.
      var identity = (comparisonIdentifier === replicateIdentifier);
      if (!identity) {
        // Replicate reaction is not identical to the comparison reaction.
        // Determine whether replicate reaction passes filters.
        var pass = reactionsSets.hasOwnProperty(replicateIdentifier);
        if (pass) {
          // Replicate reaction passes filters.
          // Access information about comparison reaction.
          var replicateReaction = reactions[replicateIdentifier];
          var replicateSets = reactionsSets[replicateIdentifier];
          // Determine whether replicate reaction is relevant.
          var relevance = Candidacy.determineReactionContextRelevance({
            reaction: replicateReaction,
            reactionSets: replicateSets,
            compartmentalization: compartmentalization
          });
          if (relevance) {
            // Replicate reaction is relevant.
            // Determine whether replicate reaction is redundant to comparison
            // reaction in context of interest.
            // Compare relevant participants of each reaction.
            return Candidacy.determineReactionsRedundancy({
              firstReaction: comparisonReaction,
              secondReaction: replicateReaction,
              firstSets: comparisonSets,
              secondSets: replicateSets,
              compartmentalization: compartmentalization
            });
          } else {
            // Replicate reaction is irrelevant.
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
  }
  /**
  * Determines whether two reactions are redundant by comparison of their
  * relevant participants.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.firstReaction Information about a reaction.
  * @param {Object} parameters.secondReaction Information about a reaction.
  * @param {Object} parameters.firstSets Information about a reaction's
  * metabolites and sets.
  * @param {Object} parameters.secondSets Information about a reaction's
  * metabolites and sets.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @returns {boolean} Whether reactions are redundant.
  */
  static determineReactionsRedundancy({firstReaction, secondReaction, firstSets, secondSets, compartmentalization} = {}) {
    // Only compare relevant participants of each reaction.
    // Filter for reactions' relevant participants.
    var firstParticipants = Extraction.filterReactionParticipants({
      criteria: {
        metabolites: firstSets.metabolites,
        compartments: firstSets.compartments
      },
      participants: firstReaction.participants
    });
    var secondParticipants = Extraction.filterReactionParticipants({
      criteria: {
        metabolites: secondSets.metabolites,
        compartments: secondSets.compartments
      },
      participants: secondReaction.participants
    });
    // Determine whether reactions' relevant participants are redundant.
    return Candidacy.determineParticipantsRedundancy({
      firstParticipants: firstParticipants,
      secondParticipants: secondParticipants,
      compartmentalization: compartmentalization
    });
  }
  /**
  * Determines whether reactions' participants of are redundant.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.firstParticipants Information
  * about metabolites' and compartments' participation in a reaction.
  * @param {Array<Object<string>>} parameters.secondParticipants Information
  * about metabolites' and compartments' participation in a reaction.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @returns {boolean} Whether participants are redundant.
  */
  static determineParticipantsRedundancy({firstParticipants, secondParticipants, compartmentalization} = {}) {
    // Determine whether compartmentalization is relevant.
    if (compartmentalization) {
      // Compartmentalization is relevant.
      // Compare participants by metabolites, compartments, and roles.
      return Candidacy.determineParticipantsAttributesMutualRedundancy({
        firstParticipants: firstParticipants,
        secondParticipants: secondParticipants,
        attributes: ["metabolite", "compartment", "role"]
      });
    } else {
      // Compartmentalization is irrelevant.
      // Compare participants by metabolites and roles.
      return Candidacy.determineParticipantsAttributesMutualRedundancy({
        firstParticipants: firstParticipants,
        secondParticipants: secondParticipants,
        attributes: ["metabolite", "role"]
      });
    }
  }
  /**
  * Determines whether reactions' participants have identical values of specific
  * attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.firstParticipants Information
  * about metabolites' and compartments' participation in a reaction.
  * @param {Array<Object<string>>} parameters.secondParticipants Information
  * about metabolites' and compartments' participation in a reaction.
  * @param {Array<string>} parameters.attributes Attributes common of all
  * participants.
  * @returns {boolean} Whether the participants have identical values of
  * attributes.
  */
  static determineParticipantsAttributesMutualRedundancy({firstParticipants, secondParticipants, attributes} = {}) {
    var firstComparison = Candidacy.determineParticipantsAttributesRedundancy({
      firstParticipants: firstParticipants,
      secondParticipants: secondParticipants,
      attributes: attributes
    });
    var secondComparison = Candidacy.determineParticipantsAttributesRedundancy({
      firstParticipants: secondParticipants,
      secondParticipants: firstParticipants,
      attributes: attributes
    });
    return (firstComparison && secondComparison);
  }
  /**
  * Determines whether reactions' participants have identical values of specific
  * attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.firstParticipants Information
  * about metabolites' and compartments' participation in a reaction.
  * @param {Array<Object<string>>} parameters.secondParticipants Information
  * about metabolites' and compartments' participation in a reaction.
  * @param {Array<string>} parameters.attributes Attributes common of all
  * participants.
  * @returns {boolean} Whether the participants have identical values of
  * attributes.
  */
  static determineParticipantsAttributesRedundancy({firstParticipants, secondParticipants, attributes} = {}) {
    return firstParticipants.every(function (firstParticipant) {
      return secondParticipants.some(function (secondParticipant) {
        return attributes.every(function (attribute) {
          return (firstParticipant[attribute] === secondParticipant[attribute]);
        });
      });
    });
  }
  /**
  * Determines whether a reaction is the priority of replicates.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {Array<string>} parameters.replicateIdentifiers Identifiers of
  * reactions.
  * @returns {boolean} Whether reaction is the priority replicate.
  */
  static determineReactionReplicatePriority({reactionIdentifier, replicateIdentifiers} = {}) {
    // Include the reaction's identifier in the list of replicates.
    var reactionsIdentifiers = []
    .concat(reactionIdentifier, replicateIdentifiers);
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
  * @param {Object} parameters.reaction Information about a single reaction.
  * @param {Object} parameters.reactionSets Information about a reaction's
  * metabolites and sets.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {Object} parameters.compartments Information about compartments.
  * @returns {Object<Object>} Information about a candidate reaction's
  * metabolites.
  */
  static collectReactionMetabolites({reaction, reactionSets, compartmentalization, metabolites, compartments} = {}) {
    // Filter for reaction's relevant participants.
    var relevantParticipants = Extraction.filterReactionParticipants({
      criteria: {
        metabolites: reactionSets.metabolites,
        compartments: reactionSets.compartments
      },
      participants: reaction.participants
    });
    return relevantParticipants.reduce(function (collection, participant) {
      // Create identifier for candidate metabolite.
      var identifier = Candidacy.createCandidateMetaboliteIdentifier({
        metabolite: participant.metabolite,
        compartment: participant.compartment,
        compartmentalization: compartmentalization
      });
      // Determine whether collection already includes information about the
      // metabolite.
      if (collection.hasOwnProperty(identifier)) {
        // Collection includes information about the metabolite.
        return collection;
      } else {
        // Collection does not include information about the metabolite.
        // Include the metabolite in the collection.
        // Determine whether to represent the metabolite's compartment.
        if (compartmentalization) {
          var compartment = participant.compartment;
        } else {
          var compartment = null;
        }
        // Access information about metabolite.
        var metabolite = metabolites[participant.metabolite];
        // Access information about compartment.
        var compartment = compartments[participant.compartment];
        // Create name for candidate metabolite.
        var name = Candidacy.createCandidateMetaboliteName({
          metabolite: metabolite.name,
          compartment: compartment.name,
          compartmentalization: compartmentalization
        });
        // Compile information.
        var information = {
          identifier: identifier,
          metabolite: participant.metabolite,
          compartment: compartment,
          name: name
        };
        // Create record.
        var record = {
          [identifier]: information
        };
        // Include record in collection.
        return Object.assign(collection, record);
      }
    }, {});
  }
  /**
  * Creates the identifier for a candidate metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metabolite Identifier of a general metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @returns {string} Identifier for a candidate metabolite.
  */
  static createCandidateMetaboliteIdentifier({metabolite, compartment, compartmentalization} = {}) {
    if (compartmentalization) {
      return (metabolite + "_" + compartment);
    } else {
      return metabolite;
    }
  }
  /**
  * Creates the name for a candidate metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metabolite Name of a general metabolite.
  * @param {string} parameters.compartment Name of a compartment.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @returns {string} Name for a candidate metabolite.
  */
  static createCandidateMetaboliteName({metabolite, compartment, compartmentalization} = {}) {
    if (compartmentalization) {
      return (metabolite + " (" + compartment + ")");
    } else {
      return metabolite;
    }
  }

  // Definition of candidate metabolites.

  /**
  * Collects information about metabolites and their reactions that are
  * candidates for representation in the network and their implicit
  * simplifications.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.reactionsCandidates Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.reactionsMetabolites Information about
  * metabolites that participate in candidate reactions.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @returns {Object<Object>} Information about candidate metabolites and their
  * simplifications.
  */
  static collectCandidateMetabolitesReactionsSimplifications({reactionsCandidates, reactionsMetabolites, reactionsSimplifications, metabolitesSimplifications} = {}) {
    // Collect the identifiers of candidate reactions in which each candidate
    // metabolite participates.
    var metabolitesReactions = General.collectRecordsTargetsByCategories({
      target: "reaction",
      category: "metabolites",
      records: reactionsCandidates
    });
    // Collect information about metabolites and their reactions that are
    // candidates for representation in the network.
    // Collect information about metabolites' implicit simplifications and
    // include with information about metabolites' explicit simplifications.
    // Initialize collection.
    var initialCollection = {
      metabolitesCandidates: {},
      metabolitesSimplifications: metabolitesSimplifications
    };
    // Iterate on metabolites.
    var metabolitesIdentifiers = Object.keys(metabolitesReactions);
    return metabolitesIdentifiers
    .reduce(function (collection, metaboliteIdentifier) {
      return Candidacy.collectCandidateMetaboliteReactionsSimplification({
        metaboliteIdentifier: metaboliteIdentifier,
        reactionsMetabolites: reactionsMetabolites,
        metabolitesReactions: metabolitesReactions,
        reactionsSimplifications: reactionsSimplifications,
        collection: collection
      });
    }, initialCollection);
  }
  /**
  * Collects information about a metabolite and its reactions that are
  * candidates for representation in the network and its implicit
  * simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a metabolite.
  * @param {Object<Object>} parameters.reactionsMetabolites Information about
  * metabolites that participate in candidate reactions.
  * @param {Object} parameters.metabolitesReactions Information candidate
  * reactions in which each candidate metabolite participates.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.collection Information about candidate
  * metabolites and their simplifications.
  * @returns {Object<Object>} Information about candidate metabolites and their
  * simplifications.
  */
  static collectCandidateMetaboliteReactionsSimplification({metaboliteIdentifier, reactionsMetabolites, metabolitesReactions, reactionsSimplifications, collection} = {}) {
    // Metabolite is a valid candidate.
    // Access information about metabolite.
    var reactionMetabolite = reactionsMetabolites[metaboliteIdentifier];
    // Collect the identifiers of unique reactions in which the metabolite
    // participates.
    var reactionsIdentifiers = General.collectUniqueElements(
      metabolitesReactions[metaboliteIdentifier]
    );
    // Include information about candidate metabolite in collection.
    // Compile information.
    var information = {
      identifier: reactionMetabolite.identifier,
      metabolite: reactionMetabolite.metabolite,
      compartment: reactionMetabolite.compartment,
      name: reactionMetabolite.name,
      reactions: reactionsIdentifiers
    };
    // Create entry.
    var entry = {
      [reactionMetabolite.identifier]: information
    };
    // Include record in collection.
    var metabolitesCandidates = Object
    .assign(collection.metabolitesCandidates, entry);
    // Collect information about any implicit simplification for the metabolite
    // and include with information about simplifications for other metabolites.
    var metabolitesSimplifications = Candidacy
    .collectMetaboliteImplicitSimplification({
      metaboliteCandidate: information,
      reactionsSimplifications: reactionsSimplifications,
      metabolitesSimplifications: collection.metabolitesSimplifications
    });
    // Compile information.
    return {
      metabolitesCandidates: metabolitesCandidates,
      metabolitesSimplifications: metabolitesSimplifications
    };
  }

  // Management of simplifications of candidate entities.

  /**
  * Creates initial, empty, information about entities for simplification.
  * @returns {Object<Object>} Information about simplification of entities.
  */
  static createInitialSimplifications() {
    // Compile information.
    var simplifications = {
      reactionsSimplifications: {},
      metabolitesSimplifications: {}
    };
    // Return information.
    return simplifications;
  }
  /**
  * Filters designations of entities for simplification to omit implicit
  * designations and include only explicit designations.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @returns {Object<Object>} Information about simplification of entities.
  */
  static filterExplicitSimplifications({metabolitesSimplifications, reactionsSimplifications} = {}) {
    // Define function for filter against simplifications.
    function filter(entryValue) {
      return !entryValue.dependency;
    };
    // Filter simplifications to omit those that are implicit and include only
    // those that are explicit.
    var metabolitesExplicitSimplifications = General.filterObjectEntries({
      filter: filter,
      entries: metabolitesSimplifications
    });
    var reactionsExplicitSimplifications = General.filterObjectEntries({
      filter: filter,
      entries: reactionsSimplifications
    });
    // Compile information.
    var simplifications = {
      metabolitesSimplifications: metabolitesExplicitSimplifications,
      reactionsSimplifications: reactionsExplicitSimplifications
    };
    // Return information.
    return simplifications;
  }
  /**
  * Changes information about explicit simplifications of entities to represent
  * change to a single entity.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {string} parameters.method Method for simplification, omission or
  * replication.
  * @param {string} parameters.type Type of entities, metabolites or reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @returns {Object<Object>} Information about simplification of entities.
  */
  static changeTypeExplicitSimplifications({identifier, method, type, metabolitesSimplifications, reactionsSimplifications} = {}) {
    // Determine whether to change simplifications of metabolites or reactions.
    if (type === "metabolites") {
      // Change simplifications of metabolites.
      var metabolitesNovelSimplifications = Candidacy
      .changeExplicitSimplification({
        identifier: identifier,
        method: method,
        simplifications: metabolitesSimplifications
      });
      // Preserve simplifications of reactions.
      reactionsNovelSimplifications = reactionsSimplifications;
    } else if (type === "reactions") {
      // Change simplifications of reactions.
      var reactionsNovelSimplifications = Candidacy
      .changeExplicitSimplification({
        identifier: identifier,
        method: method,
        simplifications: reactionsSimplifications
      });
      // Preserve simplifications of metabolites.
      metabolitesNovelSimplifications = metabolitesSimplifications;
    }
    // Compile information.
    var simplifications = {
      metabolitesSimplifications: metabolitesNovelSimplifications,
      reactionsSimplifications: reactionsNovelSimplifications
    };
    // Return information.
    return simplifications;
  }
  /**
  * Changes designation of a single entity for simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {string} parameters.method Method for simplification, omission or
  * replication.
  * @param {Object<Object>} parameters.simplifications Information about
  * simplification of entities.
  * @returns {Object<Object>} Information about simplification of entities.
  */
  static changeExplicitSimplification({identifier, method, simplifications} = {}) {
    // Determine whether the entity has a designation for simplification.
    if (
      simplifications.hasOwnProperty(identifier)
    ) {
      // Entity has a designation for simplification.
      // Determine whether entity's designation for simplification matches
      // current specifications.
      var match = (
        simplifications[identifier].identifier === identifier &&
        simplifications[identifier].method === method
      );
      if (match) {
        // Entity's designation for simplification matches current
        // specifications.
        // Exclude entity's designation for simplification.
        return Candidacy.excludeSimplification({
          identifier: identifier,
          simplifications: simplifications
        });
      } else {
        // Entity's designation for simplification does not match current
        // specifications.
        // Replace entity's designation for simplification.
        var exclusionSimplifications = Candidacy.excludeSimplification({
          identifier: identifier,
          simplifications: simplifications
        });
        return Candidacy.includeSimplification({
          identifier: identifier,
          method: method,
          dependency: false,
          simplifications: exclusionSimplifications
        });
      }
    } else {
      // Entity does not have a designation for simplification.
      // Include a designation for the entity's simplification.
      return Candidacy.includeSimplification({
        identifier: identifier,
        method: method,
        dependency: false,
        simplifications: simplifications
      });
    }
  }
  /**
  * Includes a designation of a single entity for simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {string} parameters.method Method for simplification, omission or
  * replication.
  * @param {boolean} parameters.dependency Whether designation for
  * simplification derives from explicit selection or implicit dependency.
  * @param {Object<Object>} parameters.simplifications Information about
  * simplification of entities.
  * @returns {Object<Object>} Information about simplification of entities.
  */
  static includeSimplification({identifier, method, dependency, simplifications} = {}) {
    // Compile information.
    var information = {
      identifier: identifier,
      method: omission,
      dependency: dependency
    };
    // Include designation for entity's simplification.
    return General.includeObjectEntry({
      value: information,
      entries: simplifications
    });
  }
  /**
  * Excludes a designation of a single entity for simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {Object<Object>} parameters.simplifications Information about
  * simplification of entities.
  * @returns {Object<Object>} Information about simplification of entities.
  */
  static excludeSimplification({identifier, simplifications} = {}) {
    // Exclude entity's designation for simplification.
    return General.excludeObjectEntry({
      key: identifier,
      entries: simplifications
    });
  }
  /**
  * Collects information about any implicit simplifications for entities and
  * includes with information about explicit simplifications.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.reactionsCandidates Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.metabolitesCandidates Information about
  * candidate metabolites.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @returns {Object<Object>} Information about simplification of entities.
  */
  static collectImplicitSimplifications({reactionsCandidates, metabolitesCandidates, reactionsSets, reactions, compartmentalization, reactionsSimplifications, metabolitesSimplificiations} = {}) {
    // The default method for implicit simplifications is omission.
    // Collect information about any implicit simplifications for entities and
    // include with information about explicit simplifications.
    var reactionsCompleteSimplifications = Candidacy
    .collectReactionsImplicitSimplifications({
      reactionsCandidates: reactionsCandidates,
      reactionsSets: reactionsSets,
      reactions: reactions,
      compartmentalization: compartmentalization,
      reactionsSimplifications: reactionsSimplifications,
      metabolitesSimplifications: metabolitesSimplifications
    });
    var metabolitesCompleteSimplifications = Candidacy
    .collectMetabolitesImplicitSimplifications({
      metabolitesCandidates: metabolitesCandidates,
      reactionsSimplifications: reactionsSimplifications,
      metabolitesSimplifications: metabolitesSimplifications
    });
    // Compile information.
    var simplifications = {
      reactionsSimplifications: reactionsCompleteSimplifications,
      metabolitesSimplifications: metabolitesCompleteSimplifications
    };
    // Return information.
    return simplifications;
  }
  /**
  * Collects information about any implicit simplifications for reactions and
  * includes with information about explicit simplifications for reactions.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.reactionsCandidates Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @returns {Object<Object>} Information about simplification of reactions.
  */
  static collectReactionsImplicitSimplifications({reactionsCandidates, reactionsSets, reactions, compartmentalization, reactionsSimplifications, metabolitesSimplifications} = {}) {
    // Collect information about reactions' implicit simplifications and include
    // with information about reactions' explicit simplifications.
    // Iterate on reactions.
    var reactionsIdentifiers = Object.keys(reactionsCandidates);
    return reactionsIdentifiers
    .reduce(function (collection, reactionIdentifier) {
      // Access information about candidate reaction.
      var reactionCandidate = reactionsCandidates[reactionIdentifier];
      // Collect information about any implicit simplification for the reaction
      // and include with information about simplifications for other reactions.
      return Candidacy.collectReactionImplicitSimplification({
        reactionCandidate: reactionCandidate,
        reactionsSets: reactionsSets,
        reactions: reactions,
        compartmentalization: compartmentalization,
        metabolitesSimplifications: metabolitesSimplifications,
        reactionsSimplifications: collection
      });
    }, reactionsSimplifications);
  }
  /**
  * Collects information about any implicit simplification for a reaction and
  * includes with information about simplifications for other reactions.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reactionCandidate Information about a candidate
  * reaction.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @returns {Object<Object>} Information about simplification of reactions.
  */
  static collectReactionImplicitSimplification({reactionCandidate, reactionsSets, reactions, compartmentalization, metabolitesSimplifications, reactionsSimplifications} = {}) {
    // Determine whether the reaction has a designation for simplification.
    if (reactionsSimplifications.hasOwnProperty(reactionCandidate.identifier)) {
      // Reaction has a designation for simplification.
      // Do not modify information about simplification of reactions.
      return reactionsSimplifications;
    } else {
      // Reaction does not have a designation for simplification.
      // Access information about reaction.
      var reactionSets = reactionsSets[reactionCandidate.identifier];
      var reaction = reactions[reactionCandidate.identifier];
      // Determine whether reaction qualifies for simplification by dependency.
      var simplification = Candidacy.determineReactionSimplificationDependency({
        reaction: reaction,
        reactionSets: reactionSets,
        compartmentalization: compartmentalization,
        metabolitesSimplifications: metabolitesSimplifications
      });
      if (simplification) {
        // Reaction qualifies for simplification by dependency.
        // Include a designation for the reaction's simplification.
        return Candidacy.includeSimplification({
          identifier: reactionCandidate.identifier,
          method: "omission",
          dependency: true,
          simplifications: reactionsSimplifications
        });
      } else {
        // Reaction does not qualify for simplification by dependency.
        // Do not modify information about simplification of reactions.
        return reactionsSimplifications;
      }
    }
  }
  /**
  * Determines whether a reaction qualifies for simplification by dependency on
  * its metabolites.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Information about a single reaction.
  * @param {Object} parameters.reactionSets Information about a reaction's
  * metabolites and sets.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @returns {boolean} Whether the reaction qualifies for simplification by
  * dependency on its metabolites.
  */
  static determineReactionSimplificationDependency({reaction, reactionSets, compartmentalization, metabolitesSimplifications} = {}) {
    // Determine whether reaction qualifies for simplification by dependency.
    // A reaction's relevance depends on the relevance of its metabolites that
    // participate.
    // Simplification of a reaction's metabolites might qualify the reaction
    // for simplification by dependency.
    // Simplification of a reaction's metabolites will not affect the reaction's
    // redundancy or status as priority replicate.
    // Simplification of a reaction's metabolites also will not affect the
    // reaction's novelty in the collection.
    // Filter for reaction's participants that pass filters and do not qualify
    // for simplification.
    var relevantParticipants = reaction
    .participants.filter(function (participant) {
      // Determine whether participant's metabolite and compartment pass
      // filters.
      var metabolite = reactionSets
      .metabolites.includes(participant.metabolite);
      var compartment = reactionSets
      .compartments.includes(participant.compartment);
      // Determine whether the participant qualifies for simplification.
      // Create identifier for participant's candidate metabolite.
      var identifier = Candidacy.createCandidateMetaboliteIdentifier({
        metabolite: participant.metabolite,
        compartment: participant.compartment,
        compartmentalization: compartmentalization
      });
      var simplification = metabolitesSimplifications
      .hasOwnProperty(identifier);
      // Determine whether participant passes filters and does not qualify for
      // simplification.
      return (metabolite && compartment && !simplification);
    });
    // Determine whether reaction is relevant with consideration only of its
    // relevant participants.
    return !Candidacy.determineReactionParticipantsOperationRelevance({
      participants: relevantParticipants,
      conversion: reaction.conversion,
      transport: reaction.transport,
      transports: reaction.transports,
      compartmentalization: compartmentalization
    });
  }
  /**
  * Collects information about any implicit simplifications for metabolites and
  * includes with information about explicit simplifications for metabolites.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.metabolitesCandidates Information about
  * candidate metabolites.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @returns {Object<Object>} Information about simplification of metabolites.
  */
  static collectMetabolitesImplicitSimplifications({metabolitesCandidates, reactionsSimplifications, metabolitesSimplifications} = {}) {
    // Collect information about metabolites' implicit simplifications and
    // include with information about metabolites' explicit simplifications.
    // Iterate on metabolites.
    var metabolitesIdentifiers = Object.keys(metabolitesCandidates);
    return metabolitesIdentifiers
    .reduce(function (collection, metaboliteIdentifier) {
      // Access information about candidate metabolite.
      var metaboliteCandidate = metabolitesCandidates[metaboliteIdentifier];
      // Collect information about any implicit simplification for the reaction
      // and include with information about simplifications for other reactions.
      return Candidacy.collectMetaboliteImplicitSimplification({
        metaboliteCandidate: metaboliteCandidate,
        reactionsSimplifications: reactionsSimplifications,
        metabolitesSimplifications: collection
      });
    }, metabolitesSimplifications);
  }
  /**
  * Collects information about any implicit simplification for a metabolite and
  * includes with information about simplifications for other metabolites.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.metaboliteCandidate Information about a candidate
  * metabolite.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @returns {Object<Object>} Information about simplification of metabolites.
  */
  static collectMetaboliteImplicitSimplification({metaboliteCandidate, reactionsSimplifications, metabolitesSimplifications} = {}) {
    // Determine whether the metabolite has a designation for simplification.
    if (
      metabolitesSimplifications.hasOwnProperty(metaboliteCandidate.identifier)
    ) {
      // Metabolite has a designation for simplification.
      // Do not modify information about simplification of metabolites.
      return metabolitesSimplifications;
    } else {
      // Metabolite does not have a designation for simplification.
      // Determine whether metabolite qualifies for simplification by
      // dependency.
      var simplification = Candidacy
      .determineMetaboliteSimplificationDependency({
        reactionsIdentifiers: metaboliteCandidate.reactions,
        reactionsSimplifications: reactionsSimplifications
      });
      if (simplification) {
        // Metabolite qualifies for simplification by dependency.
        // Include a designation for the metabolite's simplification.
        return Candidacy.includeSimplification({
          identifier: metaboliteCandidate.identifier,
          method: "omission",
          dependency: true,
          simplifications: metabolitesSimplifications
        });
      } else {
        // Metabolite does not qualify for simplification by dependency.
        // Do not modify information about simplification of metabolites.
        return metabolitesSimplifications;
      }
    }
  }
  /**
  * Determines whether a metabolite qualifies for simplification by dependency
  * on its reactions.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.reactionsIdentifiers Identifiers of
  * reactions.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @returns {boolean} Whether the metabolite qualifies for simplification by
  * dependency on its reactions.
  */
  static determineMetaboliteSimplificationDependency({reactionsIdentifiers, reactionsSimplifications} = {}) {
    // Determine whether metabolite qualifies for simplification by dependency.
    // A metabolite's relevance depends on the relevance of its reactions in
    // which it participates.
    // Simplification of all of a metabolite's reactions qualifies the
    // metabolite for simplification by dependency.
    // Filter for metabolite's reactions that do not have designations for
    // simplification.
    var relevantReactions = reactionsIdentifiers.filter(function (identifier) {
      // Determine whether the reaction has a designation for simplification.
      return !reactionsSimplifications.hasOwnProperty(identifier);
    });
    // Determine whether any of the metabolite's reactions are relevant.
    return relevantReactions.length < 1;
  }

  // Preparation of candidates' summaries.

  /**
  * Creates initial specifications to sort candidates' summaries.
  * @returns {Object<Object<string>>} Specifications to sort candidates'
  * summaries.
  */
  static createInitialCandidatesSorts() {
    return {
      metabolites: {
        criterion: "count", // or "name"
        order: "descend" // or "ascend"
      },
      reactions: {
        criterion: "count",
        order: "descend"
      }
    };
  }
  /**
  * Creates initial searches to filter candidates' summaries.
  * @returns {Object<string>} Searches to filter candidates' summaries.
  */
  static createInitialCandidatesSearches() {
    return {
      metabolites: "",
      reactions: ""
    };
  }
  /**
  * Prepares summaries of candidates' degrees.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.reactionsCandidates Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.metabolitesCandidates Information about
  * candidate metabolites.
  * @param {Object<string>} parameters.candidatesSearches Searches to filter
  * candidates' summaries.
  * @param {Object<Object<string>>} parameters.candidatesSorts Specifications to
  * sort candidates' summaries.
  * @returns {Object<Array<Object>>} Summaries of candidates' degrees.
  */
  static prepareCandidatesSummaries({reactionsCandidates, metabolitesCandidates, candidatesSearches, candidatesSorts} = {}) {
    // Create candidates' summaries.
    var candidatesSummaries = Candidacy.createCandidatesSummaries({
      reactionsCandidates: reactionsCandidates,
      metabolitesCandidates: metabolitesCandidates
    });

    // TODO: Implement...
    // Filter candidates' summaries.
    var filterCandidatesSummaries = Candidacy.filterCandidatesSummaries({});



    // Sort candidates' summaries.
    var sortCandidatesSummaries = Candidacy.sortCandidatesSummaries({
      candidatesSummaries: filterCandidatesSummaries,
      candidatesSorts: candidatesSorts,
      reactionsCandidates: reactionsCandidates,
      metabolitesCandidates: metabolitesCandidates
    });
    return sortCandidatesSummaries;
  }
  /**
  * Creates summaries of candidates' degrees.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.reactionsCandidates Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.metabolitesCandidates Information about
  * candidate metabolites.
  * @returns {Object<Array<Object>>} Summaries of candidates' degrees.
  */
  static createCandidatesSummaries({reactionsCandidates, metabolitesCandidates} = {}) {
    // Prepare records for entities.
    var entities = ["metabolites", "reactions"];
    return entities.reduce(function (collection, entity) {
      // Access information about candidates of the entity's type.
      if (entity === "metabolites") {
        var candidates = metabolitesCandidates;
        var relations = "reactions";
      } else if (entity === "reactions") {
        var candidates = reactionsCandidates;
        var relations = "metabolites";
      }
      var identifiers = Object.keys(candidates);
      // Determine maximal count of sets for attribute's values.
      var maximum = identifiers.reduce(function (maximum, identifier) {
        // Access count of degree for candidate.
        var count = candidates[identifier][relations].length;
        return Math.max(maximum, count);
      }, 0);
      // Create records for candidates' summaries.
      var records = identifiers.map(function (identifier) {
        // Access count of degree candidate.
        var count = candidates[identifier][relations].length;
        // Create record.
        // Return record.
        return {
          entity: entity,
          count: count,
          candidate: identifier,
          maximum: maximum
        };
      });
      // Create entry.
      var entry = {
        [entity]: records
      };
      // Include entry in collection.
      return Object.assign(collection, entry);
    }, {});
  }

  /**
  * Filters candidates' summaries.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<Object>>} parameters.candidatesSummaries Summaries of
  * candidates' degrees.
  * @param {Object<string>} parameters.candidatesSearches Searches to filter
  * candidates' summaries.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @returns {Object<Array<Object>>} Summaries of sets' cardinalities.
  */
  static filterCandidatesSummaries({candidatesSummaries, candidatesSearches, compartments, processes} = {}) {
    // Iterate on categories.
    var categories = Object.keys(setsSummaries);
    return categories.reduce(function (collection, category) {
      // Determine reference.
      if (category === "compartments") {
        var reference = compartments;
      } else if (category === "processes") {
        var reference = processes;
      }
      // Access category's records.
      var records = setsSummaries[category];
      // Filter records.
      var filterRecords = records.filter(function (record) {
        var name = reference[record.value].name.toLowerCase();
        return name.includes(setsSearches[category]);
      });
      if (filterRecords.length > 0) {
        var finalRecords = filterRecords;
      } else {
        var finalRecords = records;
      }
      // Create entry.
      var entry = {
        [category]: finalRecords
      };
      // Include entry in collection.
      return Object.assign(collection, entry);
    }, {});
  }




  /**
  * Sorts candidates' summaries.
  * @param {Object<Array<Object>>} parameters.candidatesSummaries Summaries of
  * candidates' degrees.
  * @param {Object<Object<string>>} parameters.candidatesSorts Specifications to
  * sort candidates' summaries.
  * @param {Object<Object>} parameters.reactionsCandidates Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.metabolitesCandidates Information about
  * candidate metabolites.
  * @returns {Object<Array<Object>>} Summaries of candidates' degrees.
  */
  static sortCandidatesSummaries({candidatesSummaries, candidatesSorts, reactionsCandidates, metabolitesCandidates}) {
    // Iterate on categories.
    var categories = Object.keys(candidatesSummaries);
    return categories.reduce(function (collection, category) {
      // Determine reference.
      if (category === "metabolites") {
        var reference = metabolitesCandidates;
      } else if (category === "reactions") {
        var reference = reactionsCandidates;
      }
      // Determine appropriate value by which to sort records.
      if (candidatesSorts[category].criterion === "count") {
        var key = candidatesSorts[category].criterion;
      } else if (candidatesSorts[category].criterion === "name") {
        var key = "candidate";
      }
      // Access category's records.
      var records = candidatesSummaries[category];
      // Determine whether records exist.
      if (records.length > 0) {
        // Records exist.
        // Sort records.
        var sortRecords = General.sortArrayRecords({
          array: records,
          key: key,
          order: candidatesSorts[category].order,
          reference: reference,
        });
      } else {
        // Records do not exist.
        var sortRecords = records;
      }
      // Create entry.
      var entry = {
        [category]: sortRecords
      };
      // Include entry in collection.
      return Object.assign(collection, entry);
    }, {});
  }
}
