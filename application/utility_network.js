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
* Functionality of utility for collecting nodes for metabolic entities,
* metabolites and reactions, and links for relations between them.
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
*/
class Network {
  // Master control of procedure to assemble network elements.

// TODO: If a candidate reaction is a representative selection from multiple redundant replicate reactions,
// TODO: then maybe it would be appropriate to combine the attributes of the original reactions, such as
// TODO: compartments and processes.

  /**
  * Creates network elements, nodes and links, to represent metabolic entities,
  * metabolites and reactions, and relations between them.
  * Supports reaction-specific replication of nodes for specific metabolites.
  * Supports definition of network elements with or without consideration of
  * compartmentalization.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {string} parameters.simplification Indicator of whether to simplify
  * nodes for metabolites in the network by replication or by omission.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @param {Object} parameters.reactions Records with information about
  * reactions and values of their attributes that pass filters.
  * @returns {Object<Array<Object>>} Records with information about nodes and
  * links in a network.
  */
  static createNetworkElements({
    compartmentalization,
    simplification,
    metabolites,
    reactions
  } = {}) {
    // Determine whether to represent compartmentalization in the network.
    // A compartmental representation uses distinct nodes for compartmental
    // metabolites.
    // A non-compartmental representation uses common nodes for general
    // metabolites.
    // A non-compartmental representation of the network justifies several
    // simplifications, including omission of transport reactions and replicate
    // reactions across compartments.
    return Network.collectReactionsMetabolitesNetworkNodesLinks({
      compartmentalization: compartmentalization,
      simplification: simplification,
      metabolites: metabolites,
      reactions: reactions
    });
  }

  /**
  * Collects network's elements, nodes and links, across reactions and their
  * metabolites.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.reactionsCandidates Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.metabolitesCandidates Information about
  * candidate metabolites.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static collectReactionsMetabolitesNetworkNodesLinks({reactionsCandidates, metabolitesCandidates, reactionsSimplifications, metabolitesSimplifications, reactions, metabolites, compartmentalization} = {}) {
    // Initialize collection.
    var initialCollection = {
      networkNodesReactions: [],
      networkNodesMetabolites: [],
      networkLinks: []
    };
    // Iterate on reactions.
    var candidateReactionsIdentifiers = Object.keys(reactionsCandidates);
    return candidateReactionsIdentifiers
    .reduce(function (collectionReactions, candidateReactionIdentifier) {
      // Access information.
      var candidateReaction = reactionsCandidates[candidateReactionIdentifier];
      var reaction = reactions[candidateReaction.reaction];
      return Network.collectReactionMetabolitesNetworkNodesLinks({
        candidateReaction: candidateReaction,
        metabolitesCandidates: metabolitesCandidates,
        reactionsSimplifications: reactionsSimplifications,
        metabolitesSimplifications: metabolitesSimplifications,
        reaction: reaction,
        metabolites: metabolites,
        compartmentalization: compartmentalization,
        collectionReactions: collectionReactions
      });
    }, initialCollection);

    if (false) {
      // Iterate on reactions.
      var reactionsIdentifiers = Object.keys(reactions);
      return reactionsIdentifiers
      .reduce(function (reactionsCollection, reactionIdentifier) {
        if (pass) {
          // Create novel node for the reaction, and include this in the
          // collection.
          var reactionNetworkElements = Network.createNovelReactionNode({
            reaction: consensualReaction,
            previousNetworkElements: reactionsCollection,
            metabolites: metabolites
          });
          // Create novel nodes and links for the reaction's metabolites, and
          // include these in the collection.
          var metabolitesNetworkElements = Network.collectNetworkMetabolites({
            reaction: consensualReaction,
            compartmentalization: compartmentalization,
            simplification: simplification,
            previousNetworkElements: reactionNetworkElements,
            metabolites: metabolites
          });
          // Restore the collection of network elements.
          return metabolitesNetworkElements;
        } else {
          // Omit representations of the reaction and its metabolites from the
          // network's elements.
          // Preserve the collection of the network's elements.
          return reactionsCollection;
        }
      }, initialNetworkElements);
    }
  }
  /**
  * Collects network's elements, nodes and links, for a reaction and its
  * metabolites.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.candidateReaction Information about a candidate
  * reaction.
  * @param {Object<Object>} parameters.metabolitesCandidates Information about
  * candidate metabolites.
  * @param {Object<Object>} parameters.reactionsSimplifications
  * Information about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object} parameters.reaction Information about a reaction.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Array<Object>>} parameters.collectionReactions Information
  * about network's elements.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static collectReactionMetabolitesNetworkNodesLinks({candidateReaction, metabolitesCandidates, reactionsSimplifications, metabolitesSimplifications, reaction, metabolites, compartmentalization, collectionReactions} = {}) {
    // Evaluate reaction's candidacy.
    // Consider both explicit and implicit designations for simplification.
    var omission = Network.determineCandidateSimplificationOmission({
      identifier: candidateReaction.identifier,
      simplifications: reactionsSimplifications
    });
    var candidacy = !omission;
    // Determine whether reaction is a valid candidate.
    if (candidacy) {
      // Reaction is a valid candidate.
      // Create node for reaction.
      // Include node for reaction.
      var networkNodesReactions = Network.createIncludeNovelNodeReaction({
        candidateReaction: candidateReaction,
        reaction: reaction,
        collection: collectionReactions.networkNodesReactions
      });
      // Create nodes and links for reaction's metabolites.
      // Include nodes and links for reaction's metabolites.
      // TODO: I'll need to avoid redundant metabolite nodes...
      // Initialize collection.
      var initialCollection = {
        networkNodesMetabolites: collectionReactions.networkNodesMetabolites,
        networkLinks: collectionReactions.networkLinks
      };
      // Iterate on metabolites.
      var candidateMetabolitesIdentifiers = candidateReaction.metabolites;
      var networkNodesLinksMetabolites = candidateMetabolitesIdentifiers
      .reduce(function (collectionMetabolites, candidateMetaboliteIdentifier) {
        // Access information.
        var candidateMetabolite = metabolitesCandidates
        [candidateMetaboliteIdentifier];
        var metabolite = metabolites[candidateMetabolite.metabolite];
        return Network.collectReactionMetaboliteNetworkNodesLinks({
          candidateReaction: candidateReaction,
          candidateMetabolite: candidateMetabolite,
          metabolitesSimplifications: metabolitesSimplifications,
          reaction: reaction,
          metabolite: metabolite,
          compartmentalization: compartmentalization,
          collectionMetabolites: collectionMetabolites
        });
      }, initialCollection);

      // Compile information?

    } else {
      // Reaction is not a valid candidate.
      // Exclude reaction from collection.
      // Preserve collection.
      return collectionReactions;
    }
  }
  /**
  * Determines whether a candidate entity has a designation for simplification
  * by omission.
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
  static determineCandidateSimplificationOmission({identifier, simplifications} = {}) {
    // Determine whether the candidate entity has a designation for
    // simplification by omission.
    if (simplifications.hasOwnProperty(identifier)) {
      return (simplifications[identifier].method === "omission");
    } else {
      return false;
    }
  }
  /**
  * Creates a novel node for a reaction and includes it in a collection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.candidateReaction Information about a candidate
  * reaction.
  * @param {Object} parameters.reaction Information about a reaction.
  * @param {Array<Object>} parameters.collection Information about network's
  * nodes for reactions.
  * @returns {Array<Object>} Information about network's nodes for reactions.
  */
  static createIncludeNovelNodeReaction({candidateReaction, reaction, collection} = {}) {
    // Candidate reactions do not have a risk of redundancy.
    // Create and include a node for each candidate reaction.
    // Compile information.
    // Create record.
    var record = {
      identifier: candidateReaction.identifier,
      candidate: candidateReaction.identifier,
      reaction: reaction.identifier,
    };
    // Include record in collection.
    return [].concat(collection, record);
  }
  /**
  * Collects network's elements, nodes and links, for a reaction and a
  * metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.candidateReaction Information about a candidate
  * reaction.
  * @param {Object} parameters.candidateMetabolite Information about a candidate
  * metabolite.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object} parameters.reaction Information about a reaction.
  * @param {Object} parameters.metabolite Information about a metabolite.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {Object<Array<Object>>} parameters.collectionMetabolites Information
  * about network's elements.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static collectReactionMetaboliteNetworkNodesLinks({candidateReaction, candidateMetabolite, metabolitesSimplifications, reaction, metabolite, compartmentalization, collectionMetabolites} = {}) {
    // Evaluate metabolite's candidacy.
    // Consider both explicit and implicit designations for simplification.
    var omission = Network.determineCandidateSimplificationOmission({
      identifier: candidateMetabolite.identifier,
      simplifications: metabolitesSimplifications
    });
    var candidacy = !omission;
    // Determine whether metabolite is a valid candidate.
    if (candidacy) {
      // Metabolite is a valid candidate.
    } else {
      // Metabolite is not a valid candidate.
      // Exclude metabolite from collection.
      // Preserve collection.
      return collectionMetabolites;
    }
  }

  // Candidate metabolites have a risk of redundancy.
  // Create and include a node only for novel candidate metabolite.

  // Nodes for reactions can have links to many nodes for metabolites.
  // Nodes for metabolites can have links to many nodes for reactions.







  /**
  * Combines information about redundant replicate reactions to create
  * consensual information.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.reactionsIdentifiers Identifiers of
  * redundant replicate reactions.
  * @param {Object} parameters.reactions Records with information about
  * reactions and values of their attributes that pass filters.
  * @returns {Object} Consensual information about a reaction.
  */
  static combineReplicateReactions({reactionsIdentifiers, reactions} = {}) {
      // Combine values of appropriate attributes from all replicate reactions.
      var initialAttributes = {
        compartments: [],
        genes: [],
        metabolites: [],
        processes: []
      };
      // Iterate on reactions.
      var combinationAttributes = reactionsIdentifiers
      .reduce(function (attributesCollection, reactionIdentifier) {
        // Set reference to reaction's record.
        var reaction = reactions[reactionIdentifier];
        // Include reaction's values of attributes in the collection.
        var compartments = General
        .collectUniqueElements(
          [].concat(attributesCollection.compartments, reaction.compartments)
        );
        var genes = General
        .collectUniqueElements(
          [].concat(attributesCollection.genes, reaction.genes)
        );
        var metabolites = General
        .collectUniqueElements(
          [].concat(attributesCollection.metabolites, reaction.metabolites)
        );
        var processes = General
        .collectUniqueElements(
          [].concat(attributesCollection.processes, reaction.processes)
        );
        // Compile attributes to restore the collection.
        return {
          compartments: compartments,
          genes: genes,
          metabolites: metabolites,
          processes: processes
        };
      }, initialAttributes);
      // Include combination attributes in the record of attributes for the
      // consensual reaction.
      return Object.assign({}, priorityAttributes, combinationAttributes);
    } else {
      // There is a single relevant reaction.
      // Copy and propagate attributes from reaction.
      return General.copyValueJSON(reactions[reactionsIdentifiers[0]]);
    }
  }

  /**
  * Collects network elements, nodes and links, across all metabolites that
  * participate in a single reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Consensual information about a reaction.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {string} parameters.simplification Indicator of whether to simplify
  * nodes for metabolites in the network by replication or by omission.
  * @param {Object<Array<Object>>} parameters.previousNetworkElements Records
  * with information about nodes and links in a network.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {Object<Array<Object>>} Records with information about nodes and
  * links in a network.
  */
  static collectNetworkMetabolites({
    reaction,
    compartmentalization,
    simplification,
    previousNetworkElements,
    metabolites
  } = {}) {
    // Only include representations for the reaction's metabolites that pass
    // filters.
    // Reaction's record includes references to metabolites that participate in
    // the reaction and persist against filters.
    // Iterate on metabolites.
    return reaction
    .metabolites.reduce(function (metabolitesCollection, metaboliteIdentifier) {
      // Set reference to metabolite's record.
      var metabolite = metabolites[metaboliteIdentifier];
      // Determine whether to include representations for the metabolite in the
      // network's elements.
      var pass = Network.determineMetaboliteRepresentation({
        metabolite: metabolite,
        compartmentalization: compartmentalization,
        simplification: simplification
      });
      if (pass) {
        // Include representations of the metabolite.
        // A single metabolite can participate in a reaction in multiple
        // contexts of compartments and roles.
        // Create novel nodes and links for the contexts in which the metabolite
        // participates in the reaction, and include these in the collection.
        var participantsNetworkElements = Network.collectNetworkParticipants({
          reaction: reaction,
          metabolite: metabolite,
          compartmentalization: compartmentalization,
          simplification: simplification,
          previousNetworkElements: metabolitesCollection
        });
        // Restore the collection of network elements to include new
        // nodes and links.
        return participantsNetworkElements;
      } else {
        // Omit representations of the metabolite.
        return metabolitesCollection;
      }
    }, previousNetworkElements);
  }
  /**
  * Determines whether to include in the network representations for the
  * metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.metabolite Record with information about a
  * metabolite, values of its attributes that pass filters, and designation of
  * whether to simplify its representation in the network.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {string} parameters.simplification Indicator of whether to simplify
  * nodes for metabolites in the network by replication or by omission.
  * @returns {boolean} Whether to represent the metabolite in the network.
  */
  static determineMetaboliteRepresentation({
    metabolite,
    compartmentalization,
    simplification
  } = {}) {
    // Determine whether to represent metabolite.
    // Determine whether metabolite has a designation for simplification and
    // whether omission is the method for simplification.
    if (metabolite.simplification && simplification === "omission") {
      // Omit representations for the metabolite.
      return false;
    } else {
      // Include representations for the metabolite.
      return true;
    }
  }
  /**
  * Collects network elements, nodes and links, across all metabolites that
  * participate in a single reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Consensual information about a reaction.
  * @param {Object} parameters.metabolite Record with information about a
  * metabolite, values of its attributes that pass filters, and designation of
  * whether to simplify its representation in the network.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {string} parameters.simplification Indicator of whether to simplify
  * nodes for metabolites in the network by replication or by omission.
  * @param {Object<Array<Object>>} parameters.previousNetworkElements Records
  * with information about nodes and links in a network.
  * @returns {Object<Array<Object>>} Records with information about nodes and
  * links in a network.
  */
  static collectNetworkParticipants({
    reaction,
    metabolite,
    compartmentalization,
    simplification,
    previousNetworkElements
  } = {}) {
    // Determine contexts of compartments and roles in which the metabolite
    // participates in the reaction.
    // Only include contexts that persist against filters, specifically for
    // compartments.
    var participants = Extraction.filterReactionParticipants({
      criteria: {
        metabolites: [metabolite.identifier],
        compartments: reaction.compartments
      },
      participants: reaction.participants
    });
    // Iterate on contexts in which the metabolite participates in the reaction.
    return participants.reduce(function (participantsCollection, participant) {
      // Create node for metabolite's participation in the reaction.
      // Determine identifier for metabolite node.
      var nodeIdentifier = Network.determineMetaboliteNodeIdentifier({
        metabolite: metabolite.identifier,
        compartment: participant.compartment,
        compartmentalization: compartmentalization,
        simplification: metabolite.simplification,
        method: simplification,
        reaction: reaction.identifier
      });
      // Create novel node and links for the metabolite and its participation in
      // the reaction, and include these in the collection.
      var participantNetworkElements = Network.createNovelMetaboliteNodeLinks({
        nodeIdentifier: nodeIdentifier,
        metabolite: metabolite,
        participant: participant,
        reaction: reaction,
        compartmentalization: compartmentalization,
        previousNetworkElements: participantsCollection
      });
      // Restore the collection with new elements of the network.
      return participantNetworkElements;
    }, previousNetworkElements);
  }
  /**
  * Determines the identifier for a network node for a metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metabolite Identifier of a general metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {boolean} parameters.simplification Indicator of whether to simplify
  * the metabolite's representation in the network.
  * @param {string} parameters.method Indicator of whether to simplify nodes for
  * metabolites in the network by replication or by omission.
  * @param {string} parameters.reaction Identifier of reaction in which
  * metabolite participates.
  * @param {boolean} parameters.replication Whether or not to replicate nodes
  * for the metabolite.
  * @returns {string} Identifier for a network node for the metabolite.
  */
  static determineMetaboliteNodeIdentifier({
    metabolite,
    compartment,
    compartmentalization,
    simplification,
    method,
    reaction
  } = {}) {
    // Determine base identifier for the metabolite node.
    var baseMetaboliteIdentifier = Network
    .determineMetaboliteNodeBaseIdentifier({
      metabolite: metabolite,
      compartment: compartment,
      compartmentalization: compartmentalization
    });
    // Determine whether to simplify the representation for the metabolite.
    if (simplification) {
      // Simplify metabolite's representation in the network.
      // Since metabolite merits representation, the method for simplification
      // is not omission.
      if (method === "replication") {
        // Replicate nodes for the metabolite.
        var metaboliteNodeIdentifier = (
          baseMetaboliteIdentifier + "_" + reaction
        );
      }
    } else {
      // Do not replicate nodes for the metabolite.
      var metaboliteNodeIdentifier = baseMetaboliteIdentifier;
    }
    return metaboliteNodeIdentifier;
  }
  /**
  * Determines the identifier for a network node for a metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metabolite Identifier of a general metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @returns {string} Identifier for a network node for the metabolite.
  */
  static determineMetaboliteNodeBaseIdentifier({
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
  * Creates novel node and link for a metabolite and its participation in a
  * reaction and includes these in a collection of network's elements.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.nodeIdentifier Identifier of a node of type
  * record for a metabolite.
  * @param {Object} parameters.metabolite Record with information about a
  * metabolite, values of its attributes that pass filters, and designation of
  * whether to simplify its representation in the network.
  * @param {Object} parameters.participant Record with information about a
  * metabolite's participation in a reaction.
  * @param {Object} parameters.reaction Consensual information about a reaction.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {Object<Array<Object>>} parameters.previousNetworkElements Records
  * with information about nodes and links in a network.
  * @returns {Object<Array<Object>>} Records with information about nodes and
  * links in a network.
  */
  static createNovelMetaboliteNodeLinks({
    nodeIdentifier,
    metabolite,
    participant,
    reaction,
    compartmentalization,
    previousNetworkElements,
  } = {}) {
    // Create a node and a link to represent a single context in which a
    // metabolite participates in a reaction.
    // Determine whether the collection includes a node for the metabolite.
    var nodeMatch = previousNetworkElements
    .metabolitesNodes.some(function (node) {
      return node.identifier === nodeIdentifier;
    });
    if (nodeMatch) {
      // Collection includes a node for the metabolite.
      // Preserve the nodes for metabolites in the current collection.
      var metabolitesNodes = previousNetworkElements.metabolitesNodes;
    } else {
      // Collection does not include a node for the metabolite.
      // Assume that the collection also does not include any links for the
      // metabolite.
      // Create novel node for the metabolite.
      var metaboliteNode = Network.createMetaboliteNode({
        identifier: nodeIdentifier,
        metabolite: metabolite,
        compartment: participant.compartment,
        compartmentalization: compartmentalization
      });
      // Include metabolite's novel node in the collection.
      var metabolitesNodes = []
      .concat(previousNetworkElements.metabolitesNodes, metaboliteNode);
    }
    // A single metabolite can participate in a single reaction in multiple
    // contexts.
    // A single metabolite can also participate in multiple reactions.
    // Assume that the metabolite's participation in the current reaction is
    // novel.
    // This assumption is true as long as reactions are not redundant.
    // Create novel link for the metabolite's participation in the reaction.
    var metaboliteLinks = Network.createMetaboliteLinks({
      metabolite: nodeIdentifier,
      role: participant.role,
      simplification: metabolite.simplification,
      reaction: reaction,
    });
    // Include metabolite's novel node and links in the collection.
    var metabolitesLinks = []
    .concat(previousNetworkElements.links, metaboliteLinks);
    var currentNetworkElements = {
      links: metabolitesLinks,
      metabolitesNodes: metabolitesNodes
    };
    var networkElements = Object
    .assign({}, previousNetworkElements, currentNetworkElements);
    return networkElements;
  }
  /**
  * Creates a node for a metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node for a metabolite.
  * @param {Object} parameters.metabolite Record with information about a
  * metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @returns {Object} Record with information about a node for a metabolite.
  */
  static createMetaboliteNode({
    identifier,
    metabolite,
    compartment,
    compartmentalization
  } = {}) {
    // Determine whether to represent the metabolite's compartment.
    if (compartmentalization) {
      var compartmentValue = compartment;
    } else {
      var compartmentValue = null;
    }
    // Create node for the metabolite.
    var copyAttributes = General.copyValueJSON(metabolite);
    var novelAttributes = {
      compartment: compartmentValue,
      entity: "metabolite",
      identifier: identifier,
      metabolite: copyAttributes.identifier
    };
    return Object.assign({}, copyAttributes, novelAttributes);
  }
  /**
  * Creates links for a metabolite's participation in a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metabolite Identifier of a node for a metabolite.
  * @param {string} parameters.role Role, reactant or product, in which
  * metabolite participates in a reaction.
  * @param {string} parameters.simplification Indicator of whether metabolite
  * has a designation for simplification of its representation.
  * @param {Object} parameters.reaction Consensual information about a reaction.
  * @returns {Array<Object>} Records with information about links for a
  * metabolite's participation in a reaction.
  */
  static createMetaboliteLinks({
    metabolite,
    role,
    simplification,
    reaction
  } = {}) {
    // Create links to represent a single context in which a metabolite
    // participates in a reaction.
    // Reactions do not accommodate redundant participants.
    var attributes = {
      role: role,
      simplification: simplification
    };
    // Determine whether reaction is reversible.
    if (reaction.reversibility) {
      // Reaction is reversible.
      // Represent metabolite's participation in reaction in both directions.
      var forwardLink = Network.createLink({
        source: metabolite,
        target: reaction.identifier,
        attributes: attributes
      });
      var reverseLink = Network.createLink({
        source: reaction.identifier,
        target: metabolite,
        attributes: attributes
      });
      var links = [].concat(forwardLink, reverseLink);
    } else {
      // Reaction is irreversible.
      // Represent metabolite's participation in its specific role.
      if (role === "reactant") {
        // Metabolite participates in the reaction as a reactant.
        var link = Network.createLink({
          source: metabolite,
          target: reaction.identifier,
          attributes: attributes
        });
      } else if (role === "product") {
        // Metabolite participates in the reaction as a product.
        var link = Network.createLink({
          source: reaction.identifier,
          target: metabolite,
          attributes: attributes
        });
      }
      var links = [link];
    }
    // Return links.
    return links;
  }
  /**
  * Creates record for a link.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node to be the
  * link's source.
  * @param {string} parameters.target Identifier of a single node to be the
  * link's target.
  * @param {Object} parameters.attributes Values of attributes to include in the
  * link's record.
  * @returns {Object} Record for a link.
  */
  static createLink({source, target, attributes} = {}) {
    // Use a special delimiter, "_-_", between identifiers of source and target
    // nodes for links in order to avoid ambiguity with other combinations of
    // identifiers.
    var identifier = source + "_-_" + target;
    var record = {
      identifier: identifier,
      source: source,
      target: target
    };
    return Object.assign({}, record, attributes);
  }

  // TODO: Need function in network module to filter/collect links between source and target nodes...
  // TODO: Include parallel links between metabolites and reversible reactions.

  /**
  * Copies records with information about nodes and links in a network.
  * @param {Object<Array<Object>>} networkElements Records with information
  * about nodes and links in a network.
  * @returns {Object<Array<Object>>} Copies of records with information about
  * nodes and links in a network.
  */
  static copyNetworkElements(networkElements) {
    // Copy records for network's elements.
    return {
      currentLinks: General.copyValueJSON(networkElements.links),
      currentMetabolitesNodes: General
      .copyValueJSON(networkElements.metabolitesNodes),
      currentReactionsNodes: General
      .copyValueJSON(networkElements.reactionsNodes)
    };
  }
  /**
  * Collects identifiers of links that connect directly to a single focal node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.focus Identifier of a single node in a network
  * that is the focal node.
  * @param {Array<Object>} parameters.links Records for network's links.
  * @returns {Array<string>} Identifiers of links that connect directly to focal
  * node.
  */
  static collectNeighborsLinks({focus, links} = {}) {
    // Iterate on links.
    var neighborsLinks = links.reduce(function (collection, link) {
      // Collect identifiers of nodes to which the link connects.
      var linkNodes = [].concat(link.source, link.target);
      // Determine whether link connects to focal node.
      var match = linkNodes.some(function (identifier) {
        return identifier === focus;
      });
      if (match) {
        // Link connects to focal node.
        // Include link's identifier in collection.
        return [].concat(collection, link.identifier);
      } else {
        // Link does not connect to focal node.
        // Preserve collection.
        return collection;
      }
    }, []);
    // Return identifiers of unique links.
    return General.collectUniqueElements(neighborsLinks);
  }
  /**
  * Collects identifiers of nodes that are direct neighbors of a single focal
  * node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.focus Identifier of a single node in a network
  * that is the focal node.
  * @param {Array<Object>} parameters.links Records for network's links.
  * @returns {Array<string>} Identifiers of nodes that are direct neighbors of
  * focal node.
  */
  static collectNeighborsNodes({focus, links} = {}) {
    // Iterate on links to collect neighbors.
    var neighbors = links.reduce(function (collection, link) {
      // Collect identifiers of nodes to which the link connects.
      var linkNodes = [].concat(link.source, link.target);
      // Determine whether link connects to focal node.
      var match = linkNodes.some(function (identifier) {
        return identifier === focus;
      });
      if (match) {
        // Link connects to focal node.
        // Include neighbor in collection.
        // Assume that link connects to a real node and that this node's
        // identifier is the same that the link references.
        var neighbor = linkNodes.filter(function (identifier) {
          return identifier !== focus;
        });
        return [].concat(collection, neighbor[0]);
      } else {
        // Link does not connect to focal node.
        // Preserve collection.
        return collection;
      }
    }, []);
    // Return identifiers of unique neighbors.
    return General.collectUniqueElements(neighbors);
  }
  /**
  * Collects records for elements by their identifiers.
  * @param {Array<string>} identifers Identifiers of nodes.
  * @param {Array<Object>} elements Records for elements.
  * @returns {Array<Object>} Records for elements.
  */
  static collectElementsRecords(identifiers, elements) {
    return identifiers.map(function (identifier) {
      return Network.accessElementRecord(identifier, elements);
    });
  }
  /**
  * Accesses the record for an element by its identifier.
  * @param {string} identifer Identifier of a single node.
  * @param {Array<Object>} elements Records for elements.
  * @returns {Object} Record for element.
  */
  static accessElementRecord(identifier, elements) {
    return elements.find(function (record) {
      return record.identifier === identifier;
    });
  }

  /**
  * Initializes an operable network in JSNetworkX.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.links Records for network's links.
  * @param {Array<Object>} parameters.nodes Records for network's nodes.
  * @returns {Object} Network in JSNetworkX.
  */
  static initializeNetwork({links, nodes} = {}) {
    var readyNodes = nodes.map(function (node) {
      return [].concat(node.identifier, Object.assign({}, node));
    });
    var readyLinks = links.map(function (link) {
      return [].concat(link.source, link.target, Object.assign({}, link));
    });
    var network = new jsnx.MultiDiGraph();
    network.addNodesFrom(readyNodes);
    network.addEdgesFrom(readyLinks);
    return network;
  }
  /**
  * Induces a subnetwork for all nodes within a specific depth without weight
  * of a single focal node or ego.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.focus Identifier of a single node in a network
  * that is the focal node.
  * @param {number} parameters.depth Depth in count of links of traversal
  * around focal node.
  * @param {boolean} parameters.center Indicator of whether or not to include
  * the central focal node in the subnetwork.
  * @param {string} parameters.direction Indicator (in, out, null) of whether
  * or not to follow link directionality in traversal and which direction to
  * follow.
  * @param {Object} parameters.network Network in JSNetworkX.
  * @returns {Object} Induced subnetwork in JSNetworkX.
  */
  static induceEgoNetwork({focus, depth, center, direction, network} = {}) {
    // Collect nodes for the subnetwork by traversal according to constraint
    // of link directionality.
    // Disregard any weights of the network's links.
    if (direction === "out") {
      // Traverse along links emanating out from focal node.
      // JSNetworkX's singleSourceShortestPathLength function accepts the
      // identifier for the focal node.
      // JSNetworkX's singleSourceShortestPathLength function traverses
      // links that lead out from the focal node in a network with
      // directional links.
      var egoNodesMap = jsnx
      .singleSourceShortestPathLength(network, focus, depth);
    } else if (direction === "in") {
      // Traverse along links converging in towards focal node.
      var egoNodesMap = jsnx
      .singleSourceShortestPathLength(
        network.reverse(optCopy=true), focus, depth
      );

    } else if (!direction) {
      // Traverse along any links regardless of direction.
      var egoNodesMap = jsnx
      .singleSourceShortestPathLength(
        network.toUndirected(), focus, depth
      );
    }
    var egoNodes = Array.from(egoNodesMap.keys());
    // At this point, egoNodes is an array of string identifiers for nodes.
    // There are not any missing identifiers in the array.
    // Nodes exist in the network for all identifiers in egoNodes.
    // Induce subnetwork from nodes.
    // JSNetworkX's subgraph method accepts an array of identifiers for
    // nodes to include in the induced subnetwork.
    //var egoNetwork = jsnx.MultiDiGraph(network.subgraph(egoNodes));
    var egoNetwork = network.subgraph(egoNodes);
    if (!center) {
      egoNetwork.removeNode(focus);
    }
    return egoNetwork;
  }
  /**
  * Extracts information about nodes from a network in JSNetworkX.
  * @param {Object} network Network in JSNetworkX.
  * @returns {Array<Object>} Information about nodes.
  */
  static extractNetworkNodes(network) {
    return network.nodes(true).map(function (node) {
      return node[1];
    });
  }
  /**
  * Extracts information about links from a network in JSNetworkX.
  * @param {Object} network Network in JSNetworkX.
  * @returns {Array<Object>} Information about links.
  */
  static extractNetworkLinks(network) {
    return network.edges(true).map(function (edge) {
      return edge[2];
    });
  }
}
