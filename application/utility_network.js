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

  /**
  * Creates network's elements, nodes and links, to represent metabolic
  * entities, metabolites and reactions, and relations between them.
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
  static createNetworkElements({reactionsCandidates, metabolitesCandidates, reactionsSimplifications, metabolitesSimplifications, reactions, metabolites, compartmentalization} = {}) {
    // Collect network's elements.
    var networkNodesLinks = Network.collectReactionsMetabolitesNetworkNodesLinks({
      reactionsCandidates: reactionsCandidates,
      metabolitesCandidates: metabolitesCandidates,
      reactionsSimplifications: reactionsSimplifications,
      metabolitesSimplifications: metabolitesSimplifications,
      reactions: reactions,
      metabolites: metabolites,
      compartmentalization: compartmentalization
    });
    // Create concise records for representation of network's elements.
    var networkNodesRecords = Network.createReactionsMetabolitesNodesRecords({
      networkNodesReactions: networkNodesLinks.networkNodesReactions,
      networkNodesMetabolites: networkNodesLinks.networkNodesMetabolites
    });
    var networkLinksRecords = Network
    .createLinksRecords(networkNodesLinks.networkLinks);
    // Compile information.
    var networkElements = {
      networkNodesReactions: networkNodesLinks.networkNodesReactions,
      networkNodesMetabolites: networkNodesLinks.networkNodesMetabolites,
      networkLinks: networkNodesLinks.networkLinks,
      networkNodesRecords: networkNodesRecords,
      networkLinksRecords: networkLinksRecords
    };
    // Return information.
    return networkElements;
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
      networkNodesReactions: {},
      networkNodesMetabolites: {},
      networkLinks: {}
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
    var omission = Network.determineCandidateSimplificationMethod({
      identifier: candidateReaction.identifier,
      method: "omission",
      simplifications: reactionsSimplifications
    });
    var candidacy = !omission;
    // Determine whether reaction is a valid candidate.
    if (candidacy) {
      // Reaction is a valid candidate.
      // Filters and simplifications may cause incomplete representation of
      // reaction's participants in the network.
      // Eventually, consider designating reactions as to the completeness of
      // representation of their participants.
      // To do so, evaluate candidacy and simplification of reaction's
      // participants and include some designation in the reaction's node.
      // Collect information about reaction's metabolite participants with
      // designation for simplification by replication.
      var replicates = Network.filterCandidatesSimplification({
        identifiers: candidateReaction.metabolites,
        method: "replication",
        keep: false,
        simplifications: metabolitesSimplifications
      });

      // Create node for reaction.
      var networkNodeReaction = Network.createNodeReaction({
        candidateReaction: candidateReaction,
        reaction: reaction
      });
      // Include node for reaction.
      var networkNodesReactions = General.includeNovelEntry({
        value: networkNodeReaction,
        entries: collectionReactions.networkNodesReactions
      });


      // Create nodes and links for reaction's metabolites.
      // Include nodes and links for reaction's metabolites.
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
          networkNodeReaction: networkNodeReaction,
          candidateMetabolite: candidateMetabolite,
          metabolitesSimplifications: metabolitesSimplifications,
          reaction: reaction,
          metabolite: metabolite,
          compartmentalization: compartmentalization,
          collectionMetabolites: collectionMetabolites
        });
      }, initialCollection);





      // Compile information.
      var information = {
        networkNodesReactions: networkNodesReactions,
        networkNodesMetabolites: networkNodesLinksMetabolites
        .networkNodesMetabolites,
        networkLinks: networkNodesLinksMetabolites.networkLinks
      };
      return information;
    } else {
      // Reaction is not a valid candidate.
      // Exclude reaction from collection.
      // Preserve collection.
      return collectionReactions;
    }
  }
  /**
  * Determines whether a candidate entity has a designation for simplification
  * by a specific method.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {string} parameters.method Method of simplification, omission or
  * replication.
  * @param {Object<Object>} parameters.simplifications Information about
  * simplification of candidate entities.
  * @returns {boolean} Whether the candidate entity has a designation for
  * simplification by a specific method.
  */
  static determineCandidateSimplificationMethod({identifier, method, simplifications} = {}) {
    // Determine whether the candidate entity has a designation for
    // simplification by omission.
    if (simplifications.hasOwnProperty(identifier)) {
      return (simplifications[identifier].method === method);
    } else {
      return false;
    }
  }
  /**
  * Filters candidate entities by their designations for simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.identifiers Identifiers of candidate
  * entities.
  * @param {string} parameters.method Method of simplification, omission or
  * replication.
  * @param {boolean} parameters.keep Whether to keep or discard candidate
  * entities with the designation for simplification.
  * @param {Object<Object>} parameters.simplifications Information about
  * simplification of candidate entities.
  * @returns {Array<string>} Identifiers of candidate entities.
  */
  static filterCandidatesSimplification({identifiers, method, keep, simplifications} = {}) {
    return identifiers.filter(function (identifier) {
      var match = Network.determineCandidateSimplificationMethod({
        identifier: identifier,
        method: method,
        simplifications: simplifications
      });
      return (match === keep);
    });
  }
  /**
  * Creates a record of a node for a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.candidateReaction Information about a candidate
  * reaction.
  * @param {Object} parameters.reaction Information about a reaction.
  * @returns {Object} Information about network's node for a reaction.
  */
  static createNodeReaction({candidateReaction, reaction} = {}) {
    // Compile information.
    // Create record.
    return {
      identifier: candidateReaction.identifier,
      candidate: candidateReaction.identifier,
      reaction: reaction.identifier,
      type: "reaction"
    };
  }
  /**
  * Collects network's elements, nodes and links, for a reaction and a
  * metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.networkNodeReaction Information about network's
  * node for a reaction.
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
  static collectReactionMetaboliteNetworkNodesLinks({networkNodeReaction, candidateMetabolite, metabolitesSimplifications, reaction, metabolite, compartmentalization, collectionMetabolites} = {}) {
    // Evaluate metabolite's candidacy.
    // Consider both explicit and implicit designations for simplification.


    // TODO: Do not actually create any nodes for replicate metabolites




    var omission = Network.determineCandidateSimplificationMethod({
      identifier: candidateMetabolite.identifier,
      method: "omission",
      simplifications: metabolitesSimplifications
    });
    var candidacy = !omission;
    // Determine whether metabolite is a valid candidate.
    if (candidacy) {
      // Metabolite is a valid candidate.
      // Create node for metabolite.
      var networkNodeMetabolite = Network.createNodeMetabolite({
        candidateMetabolite: candidateMetabolite,
        metabolite: metabolite,
        metabolitesSimplifications: metabolitesSimplifications,
        networkNodeReaction: networkNodeReaction
      });
      // Include node for metabolite.
      var networkNodesMetabolites = General.includeNovelEntry({
        value: networkNodeMetabolite,
        entries: collectionMetabolites.networkNodesMetabolites
      });
      // Create links between nodes for reaction and metabolite.
      var novelNetworkLinks = Network.createLinksReactionMetabolite({
        networkNodeMetabolite: networkNodeMetabolite,
        networkNodeReaction: networkNodeReaction,
        candidateMetabolite: candidateMetabolite,
        reaction: reaction
      });
      // Include links.
      var networkLinks = General.includeNovelEntries({
        values: novelNetworkLinks,
        entries: collectionMetabolites.networkLinks
      });
      // Compile information.
      var information = {
        networkNodesMetabolites: networkNodesMetabolites,
        networkLinks: networkLinks
      };
      return information;
    } else {
      // Metabolite is not a valid candidate.
      // Exclude metabolite from collection.
      // Preserve collection.
      return collectionMetabolites;
    }
  }
  /**
  * Creates a record of a node for a metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.candidateMetabolite Information about a candidate
  * metabolite.
  * @param {Object} parameters.metabolite Information about a metabolite.
  * @param {Object<Object>} parameters.metabolitesSimplifications
  * Information about simplification of metabolites.
  * @param {Object} parameters.networkNodeReaction Information about network's
  * node for a reaction.
  * @returns {Object} Information about network's node for a metabolite.
  */
  static createNodeMetabolite({candidateMetabolite, metabolite, metabolitesSimplifications, networkNodeReaction} = {}) {
    // Determine whether to create replicate nodes for the metabolite for each
    // reaction.
    var replication = Network.determineCandidateSimplificationMethod({
      identifier: candidateMetabolite.identifier,
      method: "replication",
      simplifications: metabolitesSimplifications
    });
    if (replication) {
      // Determine identifier.
      var identifier = (
        candidateMetabolite.identifier + "_" + networkNodeReaction.identifier
      );
    } else {
      // Determine identifier.
      var identifier = candidateMetabolite.identifier;
    }
    // Compile information.
    // Create record.
    return {
      identifier: identifier,
      candidate: candidateMetabolite.identifier,
      metabolite: metabolite.identifier,
      replication: replication,
      type: "metabolite"
    };
  }
  /**
  * Creates records of links between nodes for a reaction and metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.networkNodeMetabolite Information about network's
  * node for a metabolite.
  * @param {Object} parameters.networkNodeReaction Information about network's
  * node for a reaction.
  * @param {Object} parameters.reaction Information about a reaction.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @returns {Array<Object>} Information about network's links between the
  * reaction and metabolite.
  */
  static createLinksReactionMetabolite({networkNodeMetabolite, networkNodeReaction, candidateMetabolite, reaction, compartmentalization} = {}) {
    // Candidate reactions have references to unique candidate metabolites.
    // A single metabolite can participate in a reaction in multiple ways.
    // Determine role or roles in which metabolite participates in reaction.
    // A reaction's participants are not redundant.
    if (compartmentalization) {
      var participants = Extraction.filterReactionParticipants({
        criteria: {
          metabolites: [candidateMetabolite.metabolite],
          compartments: [candidateMetabolite.compartment]
        },
        participants: reaction.participants
      });
    } else {
      var participants = Extraction.filterReactionParticipants({
        criteria: {metabolites: [candidateMetabolite.metabolite]},
        participants: reaction.participants
      });
    }
    // Iterate on participants.
    return participants.reduce(function (collection, participant) {
      // Create links.
      var novelLinks = Network.createParticipantLinks({
        metabolite: networkNodeMetabolite.identifier,
        replication: networkNodeMetabolite.replication,
        reaction: networkNodeReaction.identifier,
        role: participant.role,
        reversibility: reaction.reversibility
      });
      // Include links.
      return collection.concat(novelLinks);
    }, []);
  }
  /**
  * Creates links to represent a metabolite's participation in a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metabolite Identifier of network's node for a
  * metabolite.
  * @param {boolean} parameters.replication Whether network's node for
  * metabolite has replication.
  * @param {string} parameters.reaction Identifier of network's node for a
  * reaction.
  * @param {string} parameters.role Role, reactant or product, in which
  * metabolite participates in reaction.
  * @param {boolean} parameters.reversibility Whether reaction is reversible.
  * @returns {Array<Object>} Records with information about links for a
  * metabolite's participation in a reaction.
  */
  static createParticipantLinks({metabolite, replication, reaction, role, reversibility} = {}) {
    // Reactions do not accommodate redundant participants.
    var attributes = {
      role: role,
      replication: replication
    };
    // Determine whether reaction is reversible.
    if (reversibility) {
      // Reaction is reversible.
      // Represent metabolite's participation in reaction in both roles.
      var forwardLink = Network.createLink({
        source: metabolite,
        target: reaction,
        attributes: attributes
      });
      var reverseLink = Network.createLink({
        source: reaction,
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
          target: reaction,
          attributes: attributes
        });
      } else if (role === "product") {
        // Metabolite participates in the reaction as a product.
        var link = Network.createLink({
          source: reaction,
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
  * @param {string} parameters.source Identifier of a node to be the link's
  * source.
  * @param {string} parameters.target Identifier of a node to be the link's
  * target.
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
  /**
  * Creates concise records for representation of network's nodes for reactions
  * and metabolites.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.networkNodesMetabolites Information about
  * network's nodes for metabolites.
  * @param {Object} parameters.networkNodesReactions Information about network's
  * nodes for reactions.
  * @returns {Array<Object>} Information about network's nodes.
  */
  static createReactionsMetabolitesNodesRecords({networkNodesReactions, networkNodesMetabolites} = {}) {
    var reactionsNodesRecords = Network
    .createNodesRecords(networkNodesReactions);
    var metabolitesNodesRecords = Network
    .createNodesRecords(networkNodesMetabolites);
    var nodesRecords = []
    .concat(reactionsNodesRecords, metabolitesNodesRecords);
    return nodesRecords;
  }
  /**
  * Creates concise records for representation of network's nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.nodes Information about network's nodes.
  * @returns {Array<Object>} Information about network's nodes.
  */
  static createNodesRecords(nodes) {
    // Iterate on entries.
    var identifiers = Object.keys(nodes);
    return identifiers.map(function (identifier) {
      // Access information.
      var entry = nodes[identifier];
      // Create record.
      return {
        identifier: entry.identifier,
        type: entry.type
      };
    });
  }
  /**
  * Creates concise records for representation of network's links.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.links Information about network's links.
  * @returns {Array<Object>} Information about network's links.
  */
  static createLinksRecords(links) {
    // Iterate on entries.
    var identifiers = Object.keys(links);
    return identifiers.map(function (identifier) {
      // Access information.
      var entry = links[identifier];
      // Create record.
      return {
        identifier: entry.identifier,
        source: entry.source,
        target: entry.target
      };
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  // Consider moving this to a "Traversal" utility class.

  /**
  * Copies records of network's nodes and links.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static copyNetworkElementsRecords({networkNodesRecords, networkLinksRecords} = {}) {
    var copyNetworkNodesRecords = General
    .copyDeepArrayElements(networkNodesRecords, true);
    var copyNetworkLinksRecords = General
    .copyDeepArrayElements(networkLinksRecords, true);
    // Compile and return information.
    return {
      subnetworkNodesRecords: copyNetworkNodesRecords,
      subnetworkLinksRecords: copyNetworkLinksRecords
    };
  }
  /**
  * Collects identifiers of nodes that are neighbors of a single, central, focal
  * node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.focus Identifier of a single node in a network.
  * @param {string} parameters.direction Direction in which to traverse links,
  * "predecessors" for target to source, "successors" for source to target,
  * "neighbors" for either.
  * @param {Array<string>} parameters.omissionNodes Identifiers of nodes in a
  * network to ignore in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to ignore in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Array<string>} Identifiers of nodes that are neighbors of focal
  * node.
  */
  static collectNodeNeighbors({focus, direction, omissionNodes, omissionLinks, links} = {}) {
    // Iterate on links.
    return links.reduce(function (collection, link) {
      // Determine whether to omit the link from traversal.
      if (!omissionLinks.includes(link.identifier)) {
        // Collect identifiers of nodes to which the link connects.
        var linkNodes = [].concat(link.source, link.target);
        // Determine whether link connects to focal node.
        if (linkNodes.includes(focus)) {
          // Link connects to focal node.
          // Determine neighbor.
          if (direction === "predecessors") {
            var neighbor = link.source;
          } else if (direction === "successors") {
            var neighbor = link.target;
          } else if (direction === "neighbors") {
            var neighbor = linkNodes.find(function (identifier) {
              return !(identifier === focus);
            });
          }
          // Determine whether to omit the node from traversal.
          if (!omissionNodes.includes(neighbor)) {
            // Include neighbor in collection.
            if (!(focus === neighbor) && (!collection.includes(neighbor))) {
              return [].concat(collection, neighbor);
            } else {
              return collection;
            }
          } else {
            return collection;
          }
        } else {
          // Link does not connect to focal node.
          // Preserve collection.
          return collection;
        }
      } else {
        // Preserve collection.
        return collection;
      }
    }, []);
  }
  /**
  * Collects identifiers of nodes that are proximal to a single, central, focal
  * node within a specific depth.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.focus Identifier of a single node in a network.
  * @param {string} parameters.direction Direction in which to traverse links,
  * "successors" for source to target, "predecessors" for target to source, or
  * "neighbors" for either.
  * @param {number} parameters.depth Depth in links to which to traverse.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Array<string>} Identifiers of nodes that are proximal to focal
  * node.
  */
  static collectNodesTraverseBreadth({focus, direction, depth, links} = {}) {
    // Collect nodes in a breadth-first traversal from a central focal node.
    // This algorithm does not store paths from the traversal.
    // Create a map of nodes at each depth from focus.
    var map = Network.collectNodesTraverseBreadthIterateDepths({
      depth: 0,
      currentQueue: {[focus]: 0},
      direction: direction,
      limit: depth,
      map: {},
      links: links
    });
    // Return identifiers of nodes.
    return Object.keys(map);
  }
  /**
  * Iterates on depths to collect identifiers of nodes that are proximal to a
  * single, central, focal node within a specific depth.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.depth Depth in links from focal node.
  * @param {Object<number>} parameters.currentQueue Information about nodes in
  * queue.
  * @param {string} parameters.direction Direction in which to traverse links,
  * "successors" for source to target, "predecessors" for target to source, or
  * "neighbors" for either.
  * @param {number} parameters.limit Depth in links to which to traverse.
  * @param {Object<number>} parameters.map Identifiers of nodes and their depths
  * from focal node.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Object<number>} Identifiers of nodes and their depths from focal
  * node.
  */
  static collectNodesTraverseBreadthIterateDepths({depth, currentQueue, direction, limit, map, links} = {}) {
    var collection = Network.collectNodesTraverseBreadthIterateNodes({
      depth: depth,
      currentQueue: currentQueue,
      nextQueue: {},
      direction: direction,
      limit: limit,
      map: map,
      links: links
    });
    // Determine whether to traverse to next depth.
    if (depth < limit) {
      // Traverse to next depth.
      return Network.collectNodesTraverseBreadthIterateDepths({
        depth: depth + 1,
        currentQueue: collection.nextQueue,
        direction: direction,
        limit: limit,
        map: collection.map,
        links: links
      });
    } else {
      // Return depth map.
      return collection.map;
    }
  }
  /**
  * Iterates on nodes to collect identifiers of nodes that are proximal to a
  * single, central, focal node within a specific depth.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.depth Depth in links from focal node.
  * @param {Object<number>} parameters.currentQueue Information about nodes in
  * queue.
  * @param {Object<number>} parameters.nextQueue Information about nodes in
  * queue.
  * @param {string} parameters.direction Direction in which to traverse links,
  * "successors" for source to target, "predecessors" for target to source, or
  * "neighbors" for either.
  * @param {number} parameters.limit Depth in links to which to traverse.
  * @param {Object<number>} parameters.map Identifiers of nodes and their depths
  * from focal node.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Object} Information about nodes in collection and queue.
  */
  static collectNodesTraverseBreadthIterateNodes({depth, currentQueue, nextQueue, direction, limit, map, links} = {}) {
    // Access and remove next node from current queue.
    var nodes = Object.keys(currentQueue);
    var node = nodes[0];
    var novelCurrentQueue = General.excludeObjectEntry({
      key: node,
      entries: currentQueue
    });
    // Include novel node in depth map.
    if (!map.hasOwnProperty(node)) {
      // Include entry in collection.
      // Create and include entry.
      var entry = {[node]: depth};
      var novelMap = Object.assign(map, entry);
    } else {
      // Preserve collection.
      var novelMap = map;
    }
    // Collect node's neighbors.
    var neighbors = Network.collectNodeNeighbors({
      focus: node,
      direction: direction,
      omissionNodes: [],
      omissionLinks: [],
      links: links
    });
    // Include node's novel neighbors in next queue.
    var novelNextQueue = neighbors.reduce(function (collection, neighbor) {
      if (!collection.hasOwnProperty(neighbor)) {
        // Include entry in collection.
        // Create and include entry.
        var entry = {[neighbor]: (depth + 1)};
        return Object.assign(collection, entry);
      } else {
        // Preserve collection.
        return collection;
      }
    }, nextQueue);
    // Determine whether to continue to next node in queue.
    if (Object.keys(novelCurrentQueue).length > 0) {
      // Evaluate next node in queue.
      return Network.collectNodesTraverseBreadthIterateNodes({
        depth: depth,
        currentQueue: novelCurrentQueue,
        nextQueue: novelNextQueue,
        direction: direction,
        limit: limit,
        map: novelMap,
        links: links
      });
    } else {
      // Compile and return information.
      return {
        nextQueue: novelNextQueue,
        map: novelMap
      };
    }
  }
  /**
  * Collects identifiers of links between nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.nodes Identifiers of nodes.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Array<string>} Identifiers of links between nodes.
  */
  static collectLinksBetweenNodes({nodes, links} = {}) {
    // Iterate on links.
    return links.reduce(function (collection, link) {
      // Collect identifiers of nodes to which the link connects.
      var linkNodes = [].concat(link.source, link.target);
      // Determine whether link connects to relevant nodes.
      if (nodes.includes(linkNodes[0]) && nodes.includes(linkNodes[1])) {
        // Link connects to relevant nodes.
        // Include link in collection.
        if (!collection.includes(link.identifier)) {
          return [].concat(collection, link.identifier);
        } else {
          return collection;
        }
      } else {
        // Link does not connect to focal node.
        // Preserve collection.
        return collection;
      }
    }, []);
  }
  /**
  * Collects records for nodes and links by their identifiers.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.nodesIdentifiers Identifiers of nodes.
  * @param {Array<string>} parameters.linksIdentifiers Identifiers of links.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static collectNodesLinksRecordsByIdentifiers({nodesIdentifiers, linksIdentifiers, networkNodesRecords, networkLinksRecords} = {}) {
    // Traversals collect identifiers of nodes and links.
    // Collect records from these identifiers.
    // Filter records for network's elements.
    var nodesRecords = General
    .filterArrayRecordsByIdentifiers(nodesIdentifiers, networkNodesRecords);
    var linksRecords = General
    .filterArrayRecordsByIdentifiers(linksIdentifiers, networkLinksRecords);
    // Copy records for network's elements.
    var copyNodesRecords = General.copyDeepArrayElements(nodesRecords, true);
    var copyLinksRecords = General.copyDeepArrayElements(linksRecords, true);
    // Compile and return information.
    return {
      subnetworkNodesRecords: copyNodesRecords,
      subnetworkLinksRecords: copyLinksRecords
    };
  }
  /**
  * Combines a single rogue focal node to a collection of nodes and collects
  * links between nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.focus Identifier of a single node in a network.
  * @param {string} parameters.combination Method of combination, union or
  * difference.
  * @param {Array<Object>} parameters.subnetworkNodesRecords Information about
  * subnetwork's nodes.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static combineRogueNodeNetwork({focus, combination, subnetworkNodesRecords, networkNodesRecords, networkLinksRecords} = {}) {
    // Collect candidate nodes.
    var rogueNodeIdentifier = [focus];
    // Combine candidate nodes to subnetwork.
    return Network.combineNodesSubnetwork({
      candidateNodes: rogueNodeIdentifier,
      combination: combination,
      subnetworkNodesRecords: subnetworkNodesRecords,
      networkNodesRecords: networkNodesRecords,
      networkLinksRecords: networkLinksRecords
    });
  }
  /**
  * Combines a proximity traversal to a collection of nodes and collects links
  * between nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.focus Identifier of a single node in a network.
  * @param {string} parameters.direction Direction in which to traverse links,
  * "successors" for source to target, "predecessors" for target to source, or
  * "neighbors" for either.
  * @param {number} parameters.depth Depth in links to which to traverse.
  * @param {string} parameters.combination Method of combination, union or
  * difference.
  * @param {Array<Object>} parameters.subnetworkNodesRecords Information about
  * subnetwork's nodes.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static combineProximityNetwork({focus, direction, depth, combination, subnetworkNodesRecords, networkNodesRecords, networkLinksRecords} = {}) {
    // Collect candidate nodes.
    var proximityNodesIdentifiers = Network.collectNodesTraverseBreadth({
      focus: focus,
      direction: direction,
      depth: depth,
      links: networkLinksRecords
    });
    // Combine candidate nodes to subnetwork.
    return Network.combineNodesSubnetwork({
      candidateNodes: proximityNodesIdentifiers,
      combination: combination,
      subnetworkNodesRecords: subnetworkNodesRecords,
      networkNodesRecords: networkNodesRecords,
      networkLinksRecords: networkLinksRecords
    });
  }
  /**
  * Combines a path traversal to a collection of nodes and collects links
  * between nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {string} parameters.direction Direction in which to traverse links,
  * "forward" for source to target, "reverse" for target to source, or "both"
  * for either.
  * @param {number} parameters.count Count of paths to collect.
  * @param {string} parameters.combination Method of combination, union or
  * difference.
  * @param {Array<Object>} parameters.subnetworkNodesRecords Information about
  * subnetwork's nodes.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static combinePathNetwork({source, target, direction, count, combination, subnetworkNodesRecords, networkNodesRecords, networkLinksRecords} = {}) {
    // Collect candidate nodes.
    // Determine appropriate source, target, and direction for traversal.
    if (direction === "forward") {
      var traversalDirection = true;
      var traversalSource = source;
      var traversalTarget = target;
    } else if (direction === "both") {
      var traversalDirection = false;
      var traversalSource = source;
      var traversalTarget = target;
    } else if (direction === "reverse") {
      var traversalDirection = true;
      var traversalSource = target;
      var traversalTarget = source;
    }
    var pathNodesIdentifiers = Network.collectShortestPathBidirectionalBreadth({
      source: traversalSource,
      target: traversalTarget,
      direction: traversalDirection,
      algorithm: "recursive",
      omissionNodes: [],
      omissionLinks: [],
      links: networkLinksRecords
    });
    // Combine candidate nodes to subnetwork.
    return Network.combineNodesSubnetwork({
      candidateNodes: pathNodesIdentifiers,
      combination: combination,
      subnetworkNodesRecords: subnetworkNodesRecords,
      networkNodesRecords: networkNodesRecords,
      networkLinksRecords: networkLinksRecords
    });
  }
  /**
  * Combines candidate nodes and links to a subnetwork.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.candidateNodes Identifiers of nodes in a
  * network.
  * @param {string} parameters.combination Method of combination, union or
  * difference.
  * @param {Array<Object>} parameters.subnetworkNodesRecords Information about
  * subnetwork's nodes.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static combineNodesSubnetwork({candidateNodes, combination, subnetworkNodesRecords, networkNodesRecords, networkLinksRecords} = {}) {
    // Collect identifiers of nodes in subnetwork.
    var nodes = General
    .collectValueFromObjects("identifier", subnetworkNodesRecords);
    // Combine candidate nodes to those in subnetwork.
    if (combination === "union") {
      // Combine previous and current nodes by addition.
      var novelNodesIdentifiers = candidateNodes
      .reduce(function (collection, identifier) {
        if (!collection.includes(identifier)) {
          return [].concat(collection, identifier);
        } else {
          return collection;
        }
      }, nodes);
    } else if (combination === "difference") {
      // Combine previous and current nodes by subtraction.
      var novelNodesIdentifiers = nodes.filter(function (identifier) {
        return !(candidateNodes.includes(identifier));
      });
    }
    // Collect links between nodes.
    var novelLinksIdentifiers = Network.collectLinksBetweenNodes({
      nodes: novelNodesIdentifiers,
      links: networkLinksRecords
    });
    // Collect records for nodes and links.
    return Network.collectNodesLinksRecordsByIdentifiers({
      nodesIdentifiers: novelNodesIdentifiers,
      linksIdentifiers: novelLinksIdentifiers,
      networkNodesRecords: networkNodesRecords,
      networkLinksRecords: networkLinksRecords
    });
  }
  /**
  * Collects identifiers of nodes within a single, shortest, weightless,
  * directional path between a source and target node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {string} parameters.algorithm Algorithm to use for traversal, either
  * "iterative" or "recursive".
  * @param {Array<string>} parameters.omissionNodes Identifiers of nodes in a
  * network to ignore in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to ignore in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Array<string>} Identifiers of nodes in path.
  */
  static collectShortestPathBidirectionalBreadth({source, target, direction, algorithm, omissionNodes, omissionLinks, links} = {}) {
    // Determine which algorithm to use.
    if (algorithm === "recursive") {
      // Recursive, declarative algorithm.
      var visitsCollection = Network
      .collectShortestPathPredecessorsSuccessorsRecursively({
        source: source,
        target: target,
        direction: direction,
        omissionNodes: omissionNodes,
        omissionLinks: omissionLinks,
        links: links
      });
    } else if (algorithm === "iterative") {
      // Iterative, imperative algorithm.
      var visitsCollection = Network
      .collectShortestPathPredecessorsSuccessorsIteratively({
        source: source,
        target: target,
        direction: direction,
        omissionNodes: omissionNodes,
        omissionLinks: omissionLinks,
        links: links
      });
    }
    // Determine whether path exists.
    if (visitsCollection.path && visitsCollection.hasOwnProperty("bridge")) {
      // Extract path from path's bridge, predecessors, and successors.
      // If a path exists, then both visits must include bridge.
      // Forward path, source to bridge.
      var forwardPath = Network.extractPathNodes({
        path: [],
        node: visitsCollection.bridge,
        visits: visitsCollection.successors,
        direction: "forward"
      });
      // Reverse path, bridge to target.
      var reversePath = Network.extractPathNodes({
        path: [],
        node: visitsCollection.predecessors[visitsCollection.bridge],
        visits: visitsCollection.predecessors,
        direction: "reverse"
      });
      // Combine paths.
      var path = [].concat(reversePath, forwardPath);
      return path;
    } else {
      // Traversal found not path.
      window.alert("path not found...");
      return [];
    }
  }
  /**
  * Extracts nodes in path from information about visits to nodes in traversal.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.path Identifiers of nodes in path.
  * @param {string} parameters.node Identifier of a single node in a network.
  * @param {Object} parameters.visits Information about visits to nodes in
  * traversal.
  * @param {string} parameters.direction Direction in which to combine nodes in
  * path, "forward" or "reverse".
  * @returns {Array<string>} Identifiers of nodes in path.
  */
  static extractPathNodes({path, node, visits, direction} = {}) {
    // Include node in path.
    if (direction === "forward") {
      var novelPath = [].concat(path, node);
    } else if (direction === "reverse") {
      var novelPath = [].concat(node, path);
    }
    // Determine whether to continue iteration.
    if (visits.hasOwnProperty(node)) {
      // Determine novel node.
      var novelNode = visits[node];
      return Network.extractPathNodes({
        path: novelPath,
        node: novelNode,
        visits: visits,
        direction: direction
      });
    } else {
      // Compile and return information.
      return path;
    }
  }
  /**
  * Collects identifiers of nodes that a traversal visits as predecessors or
  * successors in an iterative algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {Array<string>} parameters.omissionNodes Identifiers of nodes in a
  * network to ignore in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to ignore in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Object} Information about visits to nodes in traversal.
  */
  static collectShortestPathPredecessorsSuccessorsIteratively({source, target, direction, omissionNodes, omissionLinks, links} = {}) {
    // Initialize collections of predecessors and successors.
    // These collections include respectively information about the predecessor
    // or successor of each node that the traversal encounters.
    var predecessors = {[source]: null};
    var successors = {[target]: null};
    // Initialize forward and reverse fringes.
    var forwardFringe = [source];
    var reverseFringe = [target];
    // Iterate on network's nodes, collecting nodes in traversal by breadth from
    // both source and target.
    while ((forwardFringe.length > 0) && (reverseFringe.length > 0)) {
      // Determine whether to advance traversal in forward or reverse direction.
      if (forwardFringe.length <= reverseFringe.length) {
        // Iterate on nodes in forward fringe.
        // Determine traversal's direction.
        if (direction) {
          var neighborDirection = "successors";
        } else {
          var neighborDirection = "neighbors";
        }
        var queue = forwardFringe.slice();
        forwardFringe = [];
        for (var queueNode of queue) {
          // Collect node's neighbors.
          var neighbors = Network.collectNodeNeighbors({
            focus: queueNode,
            direction: neighborDirection,
            omissionNodes: omissionNodes,
            omissionLinks: omissionLinks,
            links: links
          });
          for (var neighborNode of neighbors) {
            // Determine whether proximal collection includes the node.
            if (!predecessors.hasOwnProperty(neighborNode)) {
              // Include node in collection.
              // Create and include entry.
              var entry = {[neighborNode]: queueNode};
              var predecessors = Object.assign(predecessors, entry);
              // Include node in fringe.
              var forwardFringe = [].concat(forwardFringe, neighborNode);
            }
            // Determine whether node completes a path.
            // Node completes a path if it belongs to both predecessors and
            // successors.
            if (successors.hasOwnProperty(neighborNode)) {
              // Compile and return information.
              return {
                bridge: neighborNode,
                predecessors: predecessors,
                successors: successors,
                path: true
              };
            }
          }
        }
      } else {
        // Iterate on nodes in reverse fringe.
        // Determine traversal's direction.
        if (direction) {
          var neighborDirection = "predecessors";
        } else {
          var neighborDirection = "neighbors";
        }
        var queue = reverseFringe.slice();
        reverseFringe = [];
        for (var queueNode of queue) {
          // Collect node's neighbors.
          var neighbors = Network.collectNodeNeighbors({
            focus: queueNode,
            direction: neighborDirection,
            omissionNodes: omissionNodes,
            omissionLinks: omissionLinks,
            links: links
          });
          for (var neighborNode of neighbors) {
            // Determine whether proximal collection includes the node.
            if (!successors.hasOwnProperty(neighborNode)) {
              // Include node in collection.
              // Create and include entry.
              var entry = {[neighborNode]: queueNode};
              var successors = Object.assign(successors, entry);
              // Include node in fringe.
              var reverseFringe = [].concat(reverseFringe, neighborNode);
            }
            // Determine whether node completes a path.
            // Node completes a path if it belongs to both predecessors and
            // successors.
            if (predecessors.hasOwnProperty(neighborNode)) {
              // Compile and return information.
              return {
                bridge: neighborNode,
                predecessors: predecessors,
                successors: successors,
                path: true
              };
            }
          }
        }
      }
    }
    // No path found.
    // Compile and return information.
    return {
      bridge: null,
      predecessors: predecessors,
      successors: successors,
      path: false
    };
  }
  /**
  * Collects identifiers of nodes that a traversal visits as predecessors or
  * successors in a recursive algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {Array<string>} parameters.omissionNodes Identifiers of nodes in a
  * network to ignore in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to ignore in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Object} Information about visits to nodes in traversal.
  */
  static collectShortestPathPredecessorsSuccessorsRecursively({source, target, direction, omissionNodes, omissionLinks, links} = {}) {
    // Initialize collections of predecessors and successors.
    // These collections include respectively information about the predecessor
    // or successor of each node that the traversal encounters.
    var predecessors = {[source]: null};
    var successors = {[target]: null};
    // Initialize forward and reverse fringes.
    var forwardFringe = [source];
    var reverseFringe = [target];
    // Iterate on network's nodes, collecting nodes in traversal by breadth from
    // both source and target.
    var collection = Network.collectPredecessorsSuccessorsIterateFringesNodes({
      direction: direction,
      predecessors: predecessors,
      successors: successors,
      forwardFringe: forwardFringe,
      reverseFringe: reverseFringe,
      omissionNodes: omissionNodes,
      omissionLinks: omissionLinks,
      links: links
    });
    // Return information about path's bridge, predecessors, and successors.
    return collection;
  }
  /**
  * Collects identifiers of nodes that a traversal visits as predecessors or
  * successors in a recursive algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {Object<string>} parameters.predecessors Information about
  * predecessors of nodes that the traversal visits.
  * @param {Object<string>} parameters.successors Information about successors
  * of nodes that the traversal visits.
  * @param {Array<string>} parameters.forwardFringe Identifiers of nodes in a
  * network at forward fringe of traversal.
  * @param {Array<string>} parameters.reverseFringe Identifiers of nodes in a
  * network at reverse fringe of traversal.
  * @param {Array<string>} parameters.omissionNodes Identifiers of nodes in a
  * network to ignore in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to ignore in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Object} Information about visits to nodes in traversal.
  */
  static collectPredecessorsSuccessorsIterateFringesNodes({direction, predecessors, successors, forwardFringe, reverseFringe, omissionNodes, omissionLinks, links} = {}) {
    // Determine whether to advance traversal in forward or reverse direction.
    if (forwardFringe.length <= reverseFringe.length) {
      // Iterate on nodes in forward fringe.
      // Determine traversal's direction.
      if (direction) {
        var neighborDirection = "successors";
      } else {
        var neighborDirection = "neighbors";
      }
      var collection = Network.collectPredecessorsSuccessorsIterateQueueNodes({
        queue: forwardFringe,
        fringe: [],
        direction: neighborDirection,
        proximalVisits: predecessors,
        distalVisits: successors,
        omissionNodes: omissionNodes,
        omissionLinks: omissionLinks,
        links: links
      });
      var novelPredecessors = collection.proximalVisits;
      var novelSuccessors = successors;
      var novelForwardFringe = collection.fringe;
      var novelReverseFringe = reverseFringe;
    } else {
      // Iterate on nodes in reverse fringe.
      // Determine traversal's direction.
      if (direction) {
        var neighborDirection = "predecessors";
      } else {
        var neighborDirection = "neighbors";
      }
      var collection = Network.collectPredecessorsSuccessorsIterateQueueNodes({
        queue: reverseFringe,
        fringe: [],
        direction: neighborDirection,
        proximalVisits: successors,
        distalVisits: predecessors,
        omissionNodes: omissionNodes,
        omissionLinks: omissionLinks,
        links: links
      });
      var novelPredecessors = predecessors;
      var novelSuccessors = collection.proximalVisits;
      var novelForwardFringe = forwardFringe;
      var novelReverseFringe = collection.fringe;
    }
    // Determine whether to continue iteration.
    var fringe = ((forwardFringe.length > 0) && (reverseFringe.length > 0));
    if (fringe && !collection.path) {
      return Network.collectPredecessorsSuccessorsIterateFringesNodes({
        direction: direction,
        predecessors: novelPredecessors,
        successors: novelSuccessors,
        forwardFringe: novelForwardFringe,
        reverseFringe: novelReverseFringe,
        omissionNodes: omissionNodes,
        omissionLinks: omissionLinks,
        links: links
      });
    } else {
      // Compile and return information.
      return {
        bridge: collection.bridge,
        successors: novelSuccessors,
        predecessors: novelPredecessors,
        path: collection.path
      };
    }
  }
  /**
  * Collects identifiers of nodes that a traversal visits as predecessors or
  * successors in a recursive algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.queue Identifiers of nodes in a network in
  * queue.
  * @param {Array<string>} parameters.fringe Identifiers of nodes in a network
  * at the fringe of traversal.
  * @param {string} parameters.direction Direction in which to traverse links,
  * "predecessors" for target to source, "successors" for source to target,
  * "neighbors" for either.
  * @param {Object<string>} parameters.proximalVisits Information about nodes
  * that the proximal traversal visits.
  * @param {Object<string>} parameters.distalVisits Information about nodes that
  * the distal traversal visits.
  * @param {Array<string>} parameters.omissionNodes Identifiers of nodes in a
  * network to ignore in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to ignore in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Object} Information about visits to nodes in traversal.
  */
  static collectPredecessorsSuccessorsIterateQueueNodes({queue, fringe, direction, proximalVisits, distalVisits, omissionNodes, omissionLinks, links} = {}) {
    // Access and remove next node from queue.
    var node = queue[0];
    var novelQueue = queue.slice(1);
    // Collect node's neighbors.
    var neighbors = Network.collectNodeNeighbors({
      focus: node,
      direction: direction,
      omissionNodes: omissionNodes,
      omissionLinks: omissionLinks,
      links: links
    });
    // Iterate on neighbor nodes.
    var collection = Network.collectPredecessorsSuccessorsIterateNeighborNodes({
      focus: node,
      neighbors: neighbors,
      fringe: fringe,
      proximalVisits: proximalVisits,
      distalVisits: distalVisits
    });
    // Determine whether to continue iteration.
    if ((novelQueue.length > 0) && !collection.path) {
      return Network.collectPredecessorsSuccessorsIterateQueueNodes({
        queue: novelQueue,
        fringe: collection.fringe,
        direction: direction,
        proximalVisits: collection.proximalVisits,
        distalVisits: distalVisits,
        omissionNodes: omissionNodes,
        omissionLinks: omissionLinks,
        links: links
      });
    } else {
      // Compile and return information.
      return {
        bridge: collection.bridge,
        proximalVisits: collection.proximalVisits,
        fringe: collection.fringe,
        path: collection.path
      };
    }
  }
  /**
  * Collects identifiers of nodes that a traversal visits as predecessors or
  * successors in a recursive algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.focus Identifier of a single node in a network.
  * @param {Array<string>} parameters.neighbors Identifiers of nodes in a
  * network.
  * @param {Array<string>} parameters.fringe Identifiers of nodes in a network
  * at the fringe of traversal.
  * @param {Object<string>} parameters.proximalVisits Information about nodes
  * that the proximal traversal visits.
  * @param {Object<string>} parameters.distalVisits Information about nodes that
  * the distal traversal visits.
  * @returns {Object} Information about visits to nodes in traversal.
  */
  static collectPredecessorsSuccessorsIterateNeighborNodes({focus, neighbors, fringe, proximalVisits, distalVisits} = {}) {
    // Access and remove next node from queue.
    var node = neighbors[0];
    var novelNeighbors = neighbors.slice(1);
    // Determine whether proximal collection includes the node.
    if (!proximalVisits.hasOwnProperty(node)) {
      // Include node in collection.
      // Create and include entry.
      var entry = {[node]: focus};
      var novelProximalVisits = Object.assign(proximalVisits, entry);
      // Include node in fringe.
      var novelFringe = [].concat(fringe, node);
    } else {
      // Preserve collection.
      var novelProximalVisits = proximalVisits;
      // Preserve fringe.
      var novelFringe = fringe;
    }
    // Determine whether node completes a path.
    // Node completes a path if it belongs to both proximal and distal
    // collections.
    var path = distalVisits.hasOwnProperty(node);
    // Determine whether to continue iteration.
    if ((novelNeighbors.length > 0) && !path) {
      return Network.collectPredecessorsSuccessorsIterateNeighborNodes({
        focus: focus,
        neighbors: novelNeighbors,
        fringe: novelFringe,
        proximalVisits: novelProximalVisits,
        distalVisits: distalVisits
      });
    } else {
      // Compile and return information.
      return {
        bridge: node,
        proximalVisits: novelProximalVisits,
        fringe: novelFringe,
        path: path
      };
    }
  }

  //////////////////////////////////////////////////////////////////////////////

// Scrap...

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
  }

  // Maybe still useful...

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
