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
* Functionality of utility for traversing a network's elements.
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
*/
class Traversal {
  /**
  * Combines a single rogue focal node to a collection of nodes and collects
  * links between nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.focus Identifier of a single node in a network.
  * @param {string} parameters.combination Method of combination, union or
  * difference.
  * @param {Array<Object>} parameters.subnetworkNodesRecords Information about
  * subnetwork's nodes.
  * @param {Array<Object>} parameters.subnetworkLinksRecords Information about
  * subnetwork's links.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static combineRogueNodeNetwork({focus, combination, subnetworkNodesRecords, subnetworkLinksRecords, networkNodesRecords, networkLinksRecords} = {}) {
    // Collect candidate nodes.
    var rogueNodeIdentifier = [focus];
    // Combine candidate nodes to subnetwork.
    return Traversal.combineNodesLinksSubnetwork({
      candidateNodes: rogueNodeIdentifier,
      combination: combination,
      subnetworkNodesRecords: subnetworkNodesRecords,
      subnetworkLinksRecords: subnetworkLinksRecords,
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
  * @param {Array<Object>} parameters.subnetworkLinksRecords Information about
  * subnetwork's links.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static combineProximityNetwork({focus, direction, depth, combination, subnetworkNodesRecords, subnetworkLinksRecords, networkNodesRecords, networkLinksRecords} = {}) {
    // Collect candidate nodes.
    var proximityNodesIdentifiers = Traversal.collectNodesTraverseBreadth({
      focus: focus,
      direction: direction,
      depth: depth,
      links: networkLinksRecords
    });
    // Combine candidate nodes to subnetwork.
    return Traversal.combineNodesLinksSubnetwork({
      candidateNodes: proximityNodesIdentifiers,
      combination: combination,
      subnetworkNodesRecords: subnetworkNodesRecords,
      subnetworkLinksRecords: subnetworkLinksRecords,
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
  * @param {Array<Object>} parameters.subnetworkLinksRecords Information about
  * subnetwork's links.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static combinePathNetwork({source, target, direction, count, combination, subnetworkNodesRecords, subnetworkLinksRecords, networkNodesRecords, networkLinksRecords} = {}) {
    // Collect candidate nodes.
    // Determine appropriate source, target, and direction for traversal.
    if (direction === "forward") {
      var paths = Traversal.collectShortestSimplePaths({
        source: source,
        target: target,
        direction: true,
        algorithm: "immutable",
        count: count,
        links: networkLinksRecords
      });
    } else if (direction === "both") {
      var paths = Traversal.collectBidirectionalShortestSimplePaths({
        source: source,
        target: target,
        direction: true,
        algorithm: "immutable",
        count: count,
        links: networkLinksRecords
      });
    } else if (direction === "reverse") {
      var paths = Traversal.collectShortestSimplePaths({
        source: target,
        target: source,
        direction: true,
        algorithm: "immutable",
        count: count,
        links: networkLinksRecords
      });
    }
    // Combine identifiers of nodes in all paths.
    var pathsNodesIdentifiers = Traversal.combinePathsNodes(paths);
    // Ensure that collection includes source and target nodes even if traversal
    // did not find any paths.
    var nodesIdentifiers = General
    .collectUniqueElements(pathsNodesIdentifiers.concat(source, target));
    // Combine candidate nodes to subnetwork.
    return Traversal.combineNodesLinksSubnetwork({
      candidateNodes: nodesIdentifiers,
      combination: combination,
      subnetworkNodesRecords: subnetworkNodesRecords,
      subnetworkLinksRecords: subnetworkLinksRecords,
      networkNodesRecords: networkNodesRecords,
      networkLinksRecords: networkLinksRecords
    });
  }
  /**
  * Combines nodes in connection paths between multiple pairs of source and
  * target to a collection of nodes and collects links between nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.targets Identifiers of nodes in a
  * network.
  * @param {number} parameters.count Count of paths to collect between each
  * pair of targets.
  * @param {string} parameters.combination Method of combination, union or
  * difference.
  * @param {Array<Object>} parameters.subnetworkNodesRecords Information about
  * subnetwork's nodes.
  * @param {Array<Object>} parameters.subnetworkLinksRecords Information about
  * subnetwork's links.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static combineConnectionNetwork({targets, count, combination, subnetworkNodesRecords, subnetworkLinksRecords, networkNodesRecords, networkLinksRecords} = {}) {
    // Collect candidate nodes.
    // Determine pairs of connections.
    var pairs = General.combineElementsPairwise(targets);
    // Iterate on pairs, combining nodes from paths between each.
    var pathsNodesIdentifiers = pairs.reduce(function (pairsCollection, pair) {
      // Collect nodes in paths.
      var paths = Traversal.collectBidirectionalShortestSimplePaths({
        source: pair[0],
        target: pair[1],
        direction: true,
        algorithm: "immutable",
        count: count,
        links: networkLinksRecords
      });
      // Combine identifiers of nodes in all paths.
      var nodesIdentifiers = Traversal.combinePathsNodes(paths);
      return nodesIdentifiers.reduce(function (nodesCollection, node) {
        if (!nodesCollection.includes(node)) {
          return [].concat(nodesCollection, node);
        } else {
          return nodesCollection;
        }
      }, pairsCollection);
    }, []);
    // Ensure that collection includes all target nodes even if traversal did
    //not find paths between some pairs.
    var nodesIdentifiers = General
    .collectUniqueElements(pathsNodesIdentifiers.concat(targets));
    // Combine candidate nodes to subnetwork.
    return Traversal.combineNodesLinksSubnetwork({
      candidateNodes: nodesIdentifiers,
      combination: combination,
      subnetworkNodesRecords: subnetworkNodesRecords,
      subnetworkLinksRecords: subnetworkLinksRecords,
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
  * @param {Array<Object>} parameters.subnetworkLinksRecords Information about
  * subnetwork's links.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static combineNodesLinksSubnetwork({candidateNodes, combination, subnetworkNodesRecords, subnetworkLinksRecords, networkNodesRecords, networkLinksRecords} = {}) {
    // Collect identifiers of nodes currently in subnetwork.
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
    var novelLinksIdentifiers = Traversal.collectLinksBetweenNodes({
      nodes: novelNodesIdentifiers,
      links: networkLinksRecords
    });
    // Collect records for nodes and links.
    return Traversal.collectNodesLinksRecordsByIdentifiers({
      nodesIdentifiers: novelNodesIdentifiers,
      linksIdentifiers: novelLinksIdentifiers,
      subnetworkNodesRecords: subnetworkNodesRecords,
      subnetworkLinksRecords: subnetworkLinksRecords,
      networkNodesRecords: networkNodesRecords,
      networkLinksRecords: networkLinksRecords
    });
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
      // Determine whether link connects to relevant nodes.
      if (nodes.includes(link.source) && nodes.includes(link.target)) {
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
  * @param {Array<Object>} parameters.subnetworkNodesRecords Information about
  * subnetwork's nodes.
  * @param {Array<Object>} parameters.subnetworkLinksRecords Information about
  * subnetwork's links.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @returns {Object<Array<Object>>} Information about network's elements.
  */
  static collectNodesLinksRecordsByIdentifiers({nodesIdentifiers, linksIdentifiers, subnetworkNodesRecords, subnetworkLinksRecords, networkNodesRecords, networkLinksRecords} = {}) {
    // Traversals collect identifiers of nodes and links.
    // Collect records from these identifiers.
    var nodesRecords = Traversal.collectSubnetworkNetworkElements({
      identifiers: nodesIdentifiers,
      subnetworkRecords: subnetworkNodesRecords,
      networkRecords: networkNodesRecords
    });
    var linksRecords = Traversal.collectSubnetworkNetworkElements({
      identifiers: linksIdentifiers,
      subnetworkRecords: subnetworkLinksRecords,
      networkRecords: networkLinksRecords
    });
    // Compile and return information.
    return {
      subnetworkNodesRecords: nodesRecords,
      subnetworkLinksRecords: linksRecords
    };
  }
  /**
  * Collects records for nodes and links by their identifiers, with priority for
  * records for subnetwork's elements.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.identifiers Identifiers of elements.
  * @param {Array<Object>} parameters.subnetworkRecords Information about
  * subnetwork's elements.
  * @param {Array<Object>} parameters.networkRecords Information about network's
  * elements.
  * @returns {Array<Object>} Information about network's elements.
  */
  static collectSubnetworkNetworkElements({identifiers, subnetworkRecords, networkRecords} = {}) {
    // Records for subnetwork's elements contain mutable information.
    // It is desirable to preserve this information across changes to
    // subnetwork's elements.
    // Records for network's elements contain immutable information.
    // If elements already exist in the subnetwork, then copy their records from
    // the subnetwork.
    // If elements do not already exist in the subnetwork, then copy their
    // records from the network.
    return identifiers.map(function (identifier) {
      // Determine whether to copy record from subnetwork or network.
      var subnetworkRecord = subnetworkRecords.find(function (record) {
        return record.identifier === identifier;
      });
      if (subnetworkRecord) {
        return General.copyValue(subnetworkRecord, true);
      } else {
        var networkRecord = networkRecords.find(function (record) {
          return record.identifier === identifier;
        });
        return General.copyValue(networkRecord, true);
      }
    });
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
  * network to omit in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to omit in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Array<string>} Identifiers of nodes that are neighbors of focal
  * node.
  */
  static collectNodeNeighbors({focus, direction, omissionNodes, omissionLinks, links} = {}) {
    // Iterate on links.
    return links.reduce(function (collection, link) {
      // Determine whether link is accessible for traversal.
      if (!omissionLinks.includes(link.identifier)) {
        // Link is accessible for traversal.
        // Determine whether link relates to a relevant neighbor.
        if (focus === link.source) {
          if ((direction === "successors") || (direction === "neighbors")) {
            var neighbor = link.target;
          } else {
            return collection;
          }
        } else if (focus === link.target) {
          if ((direction === "predecessors") || (direction === "neighbors")) {
            var neighbor = link.source;
          } else {
            return collection;
          }
        } else {
          // Link does not connect to focal node.
          return collection;
        }
        // Determine whether node is accessible for traversal.
        if (!omissionNodes.includes(neighbor)) {
          // Node is accessible for traversal.
          // Include neighbor in collection.
          if (!(focus === neighbor) && (!collection.includes(neighbor))) {
            return [].concat(collection, neighbor);
          } else {
            return collection;
          }
        } else {
          // Node is inaccessible for traversal.
          return collection;
        }
      } else {
        // Link is inaccessible for traversal.
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
    var map = Traversal.collectNodesTraverseBreadthIterateDepths({
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
    var collection = Traversal.collectNodesTraverseBreadthIterateNodes({
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
      return Traversal.collectNodesTraverseBreadthIterateDepths({
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
    var neighbors = Traversal.collectNodeNeighbors({
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
      return Traversal.collectNodesTraverseBreadthIterateNodes({
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
  * Collects identifiers of nodes within multiple shortest, simple, weightless,
  * directional paths between a source and target node in both directions.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {number} parameters.count Count of paths to collect.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @param {string} parameters.algorithm Algorithm to use, either "mutable" or
  * "immutable".
  * @returns {Array<Array<string>>} Identifiers of nodes in paths.
  */
  static collectBidirectionalShortestSimplePaths({source, target, direction, count, links, algorithm} = {}) {
    // The traversal algorithm is only reliable for a directional traversal.
    // A nondirectional traversal produces redundant paths.
    // Combine paths from directional traversals in both directions.
    // Keep the shortest of these paths.
    var forwardPaths = Traversal.collectShortestSimplePaths({
      source: source,
      target: target,
      direction: direction,
      algorithm: algorithm,
      count: count,
      links: links
    });
    var reversePaths = Traversal.collectShortestSimplePaths({
      source: target,
      target: source,
      direction: direction,
      algorithm: algorithm,
      count: count,
      links: links
    });
    var totalPaths = [].concat(forwardPaths, reversePaths);
    var sortPaths = General.sortArrayArrays(totalPaths, "ascend");
    return sortPaths.slice(0, count);
  }
  /**
  * Collects identifiers of nodes within multiple shortest, simple, weightless,
  * directional paths between a source and target node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {number} parameters.count Count of paths to collect.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @param {string} parameters.algorithm Algorithm to use, either "mutable" or
  * "immutable".
  * @returns {Array<Array<string>>} Identifiers of nodes in paths.
  */
  static collectShortestSimplePaths({source, target, direction, count, links, algorithm} = {}) {
    // Determine which algorithm to use.
    if (algorithm === "immutable") {
      // Immutable, recursive algorithm.
      return Traversal.collectShortestSimplePathsImmutableRecursion({
        source: source,
        target: target,
        direction: direction,
        count: count,
        links: links
      });
    } else if (algorithm === "mutable") {
      // Mutable, iterative algorithm.
      return Traversal.collectShortestSimplePathsMutableIteration({
        source: source,
        target: target,
        direction: direction,
        count: count,
        links: links
      });
    }
  }
  /**
  * Collects identifiers of nodes within multiple shortest, simple, weightless,
  * directional paths between a source and target node using a mutable iterative
  * algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {number} parameters.count Count of paths to collect.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Array<Array<string>>} Identifiers of nodes in paths.
  */
  static collectShortestSimplePathsMutableIteration({source, target, direction, count, links} = {}) {
    // This procedure is an implementation of Jin Y. Yen's algorithm for
    // shortest, simple paths from 1971.
    // More information about the algorithm is available from Wikepedia
    // (https://en.wikipedia.org/wiki/Yen's_algorithm).
    // In some ways, the implementation in NetworkX was useful
    // (networkx.algorithms.simple_paths.shortest_simple_paths).
    // Determine initial definite path.
    var initialDefinitePath = Traversal.collectShortestPathBidirectionalBreadth({
      source: source,
      target: target,
      direction: direction,
      algorithm: "mutable",
      omissionNodes: [],
      omissionLinks: [],
      links: links
    });
    // Initialize collections of paths.
    var definitePaths = [initialDefinitePath];
    var tentativePaths = [];
    // Iterate on definite paths.
    for (var pathIndex = 0; pathIndex < (count - 1); pathIndex++) {
      // Access previous definite path.
      var previousPath = definitePaths[pathIndex].slice();
      // Initialize collections of nodes and links to omit in traversal.
      var omissionNodes = [];
      var omissionLinks = [];
      // Iterate on spurs.
      for (
        var spurIndex = 0;
        spurIndex < (previousPath.length - 1);
        spurIndex++
      ) {
        // Access spur node.
        // Spur node ranges from initial source node to node before terminal
        // target node from previous definite path.
        // Every definite path's initial node is source node and terminal node is
        // target node.
        var spurNode = previousPath[spurIndex];
        // Access root path.
        // Root path is sequence of nodes from source node to spur node from
        // previous definite path.
        var rootPath = previousPath.slice(0, (spurIndex + 1));
        // Collect links to omit from novel traversals.
        // Iterate on roots.
        for (
          var rootIndex = 0;
          rootIndex < definitePaths.length;
          rootIndex++
        ) {
          // Access definite path.
          var definitePath = definitePaths[rootIndex].slice();
          // Determine whether definite path matches root path.
          // Since spur node derives from previous definite path, some other
          // definite paths might be shorter.
          if (definitePath.length > (spurIndex + 1)) {
            // Access root of definite path for comparison to root path.
            var definitePathRoot = definitePath.slice(0, (spurIndex + 1));
            // Determine whether definite path's root is identical to root path.
            var match = General
            .compareArraysByMutualValuesIndices(definitePathRoot, rootPath);
            if (match) {
              // The definite path's root matches the root path.
              // Novel traversals omit all links that emanate from roots of
              // definite paths that match root path.
              // Omit from novel traversals the link between the terminal node
              // of definite path's root and the next node in definite path.
              // With iteration, procedure collects all relevant links.
              var linkSource = definitePath[spurIndex];
              var linkTarget = definitePath[(spurIndex + 1)];
              var linkIdentifier = Network.createLinkIdentifier({
                source: linkSource,
                target: linkTarget
              });
              if (!omissionLinks.includes(linkIdentifier)) {
                omissionLinks.push(linkIdentifier);
              }
            }
          }
        }
        // Collect nodes to omit from novel traversals.
        // Novel traversals omit all nodes except spur node from root path.
        // Omit from novel traversals the next to terminal node in root path.
        // With iteration, procedure collects all nodes from root path except
        // spur node.
        if (spurIndex > 0) {
          var nodeIdentifier = rootPath[spurIndex - 1];
          if (!omissionNodes.includes(nodeIdentifier)) {
            omissionNodes.push(nodeIdentifier);
          }
        }
        // Collect nodes in spur path.
        var spurPath = Traversal.collectShortestPathBidirectionalBreadth({
          source: spurNode,
          target: target,
          direction: direction,
          algorithm: "mutable",
          omissionNodes: omissionNodes,
          omissionLinks: omissionLinks,
          links: links
        });
        // Determine whether traversal found a spur path.
        if (spurPath.length > 0) {
          // Create novel path.
          var novelPath = [].concat(rootPath.slice(0, -1), spurPath);
          // Include novel path in tentative paths.
          tentativePaths.push(novelPath);
        }
      }
      // Determine whether there are any novel tentative paths.
      if (tentativePaths.length > 0) {
        // Sort tentative paths by length.
        tentativePaths = General.sortArrayArrays(tentativePaths, "ascend");
        // Include shortest tentative path in definite paths and remove this
        // path from tentative paths.
        definitePaths.push(tentativePaths.shift());
      } else {
        return definitePaths;
      }
    }
    return definitePaths;
  }
  /**
  * Collects identifiers of nodes within multiple shortest, simple, weightless,
  * directional paths between a source and target node using an immutable
  * recursive algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {number} parameters.count Count of paths to collect.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Array<Array<string>>} Identifiers of nodes in paths.
  */
  static collectShortestSimplePathsImmutableRecursion({source, target, direction, count, links} = {}) {
    // This procedure is an implementation of Jin Y. Yen's algorithm for
    // shortest, simple paths from 1971.
    // More information about the algorithm is available from Wikepedia
    // (https://en.wikipedia.org/wiki/Yen's_algorithm).
    // In some ways, the implementation in NetworkX was useful
    // (networkx.algorithms.simple_paths.shortest_simple_paths).
    // Determine initial definite path.
    var path = Traversal.collectShortestPathBidirectionalBreadth({
      source: source,
      target: target,
      direction: direction,
      algorithm: "immutable",
      omissionNodes: [],
      omissionLinks: [],
      links: links
    });
    // Initialize collections of paths.
    var definitePaths = [path];
    var tentativePaths = [];
    // Initialize path index.
    var pathIndex = 0;
    // Iterate recursively on paths.
    var paths = Traversal.collectShortestSimplePathsIteratePaths({
      pathIndex: pathIndex,
      definitePaths: definitePaths,
      tentativePaths: tentativePaths,
      target: target,
      direction: direction,
      count: count,
      links: links
    });
    return paths;
  }
  /**
  * Collects identifiers of nodes within multiple shortest, simple, weightless,
  * directional paths between a source and target node using an immutable
  * recursive algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.pathIndex Index of previous definite path.
  * @param {Array<Array<string>>} parameters.definitePaths Identifiers of nodes
  * in paths.
  * @param {Array<Array<string>>} parameters.tentativePaths Identifiers of nodes
  * in paths.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {number} parameters.count Count of paths to collect.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Array<Array<string>>} Identifiers of nodes in paths.
  */
  static collectShortestSimplePathsIteratePaths({pathIndex, definitePaths, tentativePaths, target, direction, count, links} = {}) {
    // Initialize collections of nodes and links to omit in traversal.
    var omissionNodes = [];
    var omissionLinks = [];
    // Initialize spur index.
    var spurIndex = 0;
    // Iterate recursively on spur paths.
    var spurTentativePaths = Traversal.collectShortestSimplePathsIterateSpurs({
      spurIndex: spurIndex,
      pathIndex: pathIndex,
      definitePaths: definitePaths,
      tentativePaths: tentativePaths,
      target: target,
      direction: direction,
      omissionNodes: omissionNodes,
      omissionLinks: omissionLinks,
      links: links
    });
    // Determine whether there are any novel tentative paths.
    if (spurTentativePaths.length > 0) {
      // Sort tentative paths by length.
      var sortTentativePaths = General
      .sortArrayArrays(spurTentativePaths, "ascend");
      // Include shortest tentative path in definite paths and remove this path
      // from tentative paths.
      var novelDefinitePath = sortTentativePaths[0].slice();
      var novelTentativePaths = General
      .copyDeepArrayElements(sortTentativePaths.slice(1), true);
      var novelDefinitePaths = [].concat(definitePaths, [novelDefinitePath]);
      var novelPathIndex = pathIndex + 1;
    } else {
      var novelTentativePaths = spurTentativePaths;
      var novelDefinitePaths = definitePaths;
      novelPathIndex = pathIndex;
    }
    // Determine whether to continue iteration.
    // Continue iteration until there are determinate count of definite paths or
    // there are no more tentative paths.
    // Path index ranges from 0 to 1 less than the total count of definite
    // paths.
    if ((novelPathIndex < (count - 1)) && (novelPathIndex > pathIndex)) {
      return Traversal.collectShortestSimplePathsIteratePaths({
        pathIndex: novelPathIndex,
        definitePaths: novelDefinitePaths,
        tentativePaths: novelTentativePaths,
        target: target,
        direction: direction,
        count: count,
        links: links
      });
    } else {
      // Compile and return information.
      return novelDefinitePaths;
    }
  }
  /**
  * Collects identifiers of nodes within multiple shortest, simple, weightless,
  * directional paths between a source and target node using an immutable
  * recursive algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.spurIndex Index of spur node.
  * @param {number} parameters.pathIndex Index of previous definite path.
  * @param {Array<Array<string>>} parameters.definitePaths Identifiers of nodes
  * in paths.
  * @param {Array<Array<string>>} parameters.tentativePaths Identifiers of nodes
  * in paths.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {Array<string>} parameters.omissionNodes Identifiers of nodes in a
  * network to omit in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to omit in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Array<Array<string>>} Identifiers of nodes in paths.
  */
  static collectShortestSimplePathsIterateSpurs({spurIndex, pathIndex, definitePaths, tentativePaths, target, direction, omissionNodes, omissionLinks, links} = {}) {
    // Collect links to omit from novel traversals.
    // Initialize root index.
    var rootIndex = 0;
    // Iterate recursively on definite paths.
    var novelOmissionLinks = Traversal.collectShortestSimplePathsIterateRoots({
      rootIndex: rootIndex,
      spurIndex: spurIndex,
      pathIndex: pathIndex,
      definitePaths: definitePaths,
      omissionLinks: omissionLinks
    });
    // Collect nodes to omit from novel traversals.
    // Access previous definite path.
    var previousPath = definitePaths[pathIndex].slice();
    // Access spur node.
    // Spur node ranges from initial source node to node before terminal target
    // node from previous definite path.
    // Every definite path's initial node is source node and terminal node is
    // target node.
    var spurNode = previousPath[spurIndex];
    // Access root path.
    // Root path is sequence of nodes from source node to spur node from
    // previous definite path.
    var rootPath = previousPath.slice(0, (spurIndex + 1));
    // Novel traversals omit all nodes except spur node from root path.
    // Omit from novel traversals the next to terminal node in root path.
    // With iteration, procedure collects all nodes from root path except spur
    // node.
    if (spurIndex > 0) {
      var nodeIdentifier = rootPath[spurIndex - 1];
      if (!omissionNodes.includes(nodeIdentifier)) {
        var novelOmissionNodes = [].concat(omissionNodes, nodeIdentifier);
      } else {
        var novelOmissionNodes = omissionNodes;
      }
    } else {
      var novelOmissionNodes = omissionNodes;
    }
    // Collect nodes in spur path.
    var spurPath = Traversal.collectShortestPathBidirectionalBreadth({
      source: spurNode,
      target: target,
      direction: direction,
      algorithm: "immutable",
      omissionNodes: novelOmissionNodes,
      omissionLinks: novelOmissionLinks,
      links: links
    });
    // Determine whether traversal found a spur path.
    if (spurPath.length > 0) {
      // Create novel path.
      var novelPath = [].concat(rootPath.slice(0, -1), spurPath);
      // Include novel path in tentative paths.
      var novelTentativePaths = [].concat(tentativePaths, [novelPath]);
    } else {
      var novelTentativePaths = tentativePaths;
    }
    // Determine whether to continue iteration.
    // Spur index ranges from 0 to 2 less than the count of nodes in previous
    // definite path.
    var novelSpurIndex = spurIndex + 1;
    if (novelSpurIndex < (previousPath.length - 1)) {
      // Call self recursively.
      return Traversal.collectShortestSimplePathsIterateSpurs({
        spurIndex: novelSpurIndex,
        pathIndex: pathIndex,
        definitePaths: definitePaths,
        tentativePaths: novelTentativePaths,
        target: target,
        direction: direction,
        omissionNodes: novelOmissionNodes,
        omissionLinks: novelOmissionLinks,
        links: links
      });
    } else {
      // Compile and return information.
      return novelTentativePaths;
    }
  }
  /**
  * Collects identifiers of nodes within multiple shortest, simple, weightless,
  * directional paths between a source and target node using an immutable
  * recursive algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.rootIndex Index of definite path for root.
  * @param {number} parameters.spurIndex Index of spur node.
  * @param {number} parameters.pathIndex Index of previous definite path.
  * @param {Array<Array<string>>} parameters.definitePaths Identifiers of nodes
  * in paths.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to omit in traversal.
  * @returns {Array<string>} Identifiers of links in a network to omit in
  * traversal.
  */
  static collectShortestSimplePathsIterateRoots({rootIndex, spurIndex, pathIndex, definitePaths, omissionLinks} = {}) {
    // Access definite path.
    var definitePath = definitePaths[rootIndex].slice();
    // Determine whether definite path matches root path.
    // Since spur node derives from previous definite path, some other definite
    // paths might be shorter.
    if (definitePath.length > (spurIndex + 1)) {
      // Access previous definite path.
      var previousPath = definitePaths[pathIndex].slice();
      // Access root path.
      var rootPath = previousPath.slice(0, (spurIndex + 1));
      // Access root of definite path for comparison to root path.
      var definitePathRoot = definitePath.slice(0, (spurIndex + 1));
      // Determine whether definite path's root is identical to root path.
      var match = General
      .compareArraysByMutualValuesIndices(definitePathRoot, rootPath);
      if (match) {
        // The definite path's root matches the root path.
        // Novel traversals omit all links that emanate from roots of definite
        // paths that match root path.
        // Omit from novel traversals the link between the terminal node of
        // definite path's root and the next node in definite path.
        // With iteration, procedure collects all relevant links.
        var source = definitePath[spurIndex];
        var target = definitePath[(spurIndex + 1)];
        var linkIdentifier = Network.createLinkIdentifier({
          source: source,
          target: target
        });
        if (!omissionLinks.includes(linkIdentifier)) {
          var novelOmissionLinks = [].concat(omissionLinks, linkIdentifier);
        } else {
          var novelOmissionLinks = omissionLinks;
        }
      } else {
        var novelOmissionLinks = omissionLinks;
      }
    } else {
      var novelOmissionLinks = omissionLinks;
    }
    // Determine whether to continue iteration.
    // Root index ranges from 0 to 1 less than the count of definite paths.
    var novelRootIndex = rootIndex + 1;
    if (novelRootIndex < definitePaths.length) {
      // Call self recursively.
      return Traversal.collectShortestSimplePathsIterateRoots({
        rootIndex: novelRootIndex,
        spurIndex: spurIndex,
        pathIndex: pathIndex,
        definitePaths: definitePaths,
        omissionLinks: novelOmissionLinks
      });
    } else {
      // Compile and return information.
      return novelOmissionLinks;
    }
  }
  /**
  * Collects identifiers of nodes within a single, shortest, weightless,
  * directional path between a source and target node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {Array<string>} parameters.omissionNodes Identifiers of nodes in a
  * network to omit in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to omit in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @param {string} parameters.algorithm Algorithm to use, either "mutable" or
  * "immutable".
  * @returns {Array<string>} Identifiers of nodes in path.
  */
  static collectShortestPathBidirectionalBreadth({source, target, direction, omissionNodes, omissionLinks, links, algorithm} = {}) {
    // Determine which algorithm to use.
    if (algorithm === "immutable") {
      // Immutable, recursive algorithm.
      var visitsCollection = Traversal
      .collectShortestPathPredecessorsSuccessorsImmutableRecursion({
        source: source,
        target: target,
        direction: direction,
        omissionNodes: omissionNodes,
        omissionLinks: omissionLinks,
        links: links
      });
    } else if (algorithm === "mutable") {
      // Mutable, iterative algorithm.
      var visitsCollection = Traversal
      .collectShortestPathPredecessorsSuccessorsMutableIteration({
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
      var forwardPath = Traversal.extractPathNodes({
        path: [],
        node: visitsCollection.bridge,
        visits: visitsCollection.successors,
        direction: "forward"
      });
      // Reverse path, bridge to target.
      var reversePath = Traversal.extractPathNodes({
        path: [],
        node: visitsCollection.predecessors[visitsCollection.bridge],
        visits: visitsCollection.predecessors,
        direction: "reverse"
      });
      // Combine paths.
      var path = [].concat(reversePath, forwardPath);
      return path;
    } else {
      // Traversal found no path.
      //window.alert("path not found...");
      return [];
    }
  }
  /**
  * Collects identifiers of nodes that a traversal visits as predecessors or
  * successors by a mutable iterative algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {Array<string>} parameters.omissionNodes Identifiers of nodes in a
  * network to omit in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to omit in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Object} Information about visits to nodes in traversal.
  */
  static collectShortestPathPredecessorsSuccessorsMutableIteration({source, target, direction, omissionNodes, omissionLinks, links} = {}) {
    // This algorithm resembles that in NetworkX.
    // networkx.algorithms.simple_paths._bidirectional_shortest_path
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
          var neighbors = Traversal.collectNodeNeighbors({
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
          var neighbors = Traversal.collectNodeNeighbors({
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
  * successors by an immutable recursive algorithm.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node in a network.
  * @param {string} parameters.target Identifier of a single node in a network.
  * @param {boolean} parameters.direction Whether to traverse links in specific
  * direction from source to target.
  * @param {Array<string>} parameters.omissionNodes Identifiers of nodes in a
  * network to omit in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to omit in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Object} Information about visits to nodes in traversal.
  */
  static collectShortestPathPredecessorsSuccessorsImmutableRecursion({source, target, direction, omissionNodes, omissionLinks, links} = {}) {
    // This algorithm resembles that in NetworkX.
    // networkx.algorithms.simple_paths._bidirectional_shortest_path
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
    var collection = Traversal.collectPredecessorsSuccessorsIterateFringesNodes({
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
  * successors by an immutable recursive algorithm.
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
  * network to omit in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to omit in traversal.
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
      var collection = Traversal.collectPredecessorsSuccessorsIterateQueueNodes({
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
      var collection = Traversal.collectPredecessorsSuccessorsIterateQueueNodes({
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
      return Traversal.collectPredecessorsSuccessorsIterateFringesNodes({
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
  * successors by an immutable recursive algorithm.
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
  * network to omit in traversal.
  * @param {Array<string>} parameters.omissionLinks Identifiers of links in a
  * network to omit in traversal.
  * @param {Array<Object>} parameters.links Information about network's links.
  * @returns {Object} Information about visits to nodes in traversal.
  */
  static collectPredecessorsSuccessorsIterateQueueNodes({queue, fringe, direction, proximalVisits, distalVisits, omissionNodes, omissionLinks, links} = {}) {
    // Access and remove next node from queue.
    var node = queue[0];
    var novelQueue = queue.slice(1);
    // Collect node's neighbors.
    var neighbors = Traversal.collectNodeNeighbors({
      focus: node,
      direction: direction,
      omissionNodes: omissionNodes,
      omissionLinks: omissionLinks,
      links: links
    });
    // Iterate on neighbor nodes.
    if (neighbors.length > 0) {
      var collection = Traversal
      .collectPredecessorsSuccessorsIterateNeighborNodes({
        focus: node,
        neighbors: neighbors,
        fringe: fringe,
        proximalVisits: proximalVisits,
        distalVisits: distalVisits
      });
      var novelFringe = collection.fringe;
      var novelProximalVisits = collection.proximalVisits;
      var bridge = collection.bridge;
      var path = collection.path;
    } else {
      var novelFringe = fringe;
      var novelProximalVisits = proximalVisits;
      var bridge = null;
      var path = false;
    }
    // Determine whether to continue iteration.
    if ((novelQueue.length > 0) && !path) {
      return Traversal.collectPredecessorsSuccessorsIterateQueueNodes({
        queue: novelQueue,
        fringe: novelFringe,
        direction: direction,
        proximalVisits: novelProximalVisits,
        distalVisits: distalVisits,
        omissionNodes: omissionNodes,
        omissionLinks: omissionLinks,
        links: links
      });
    } else {
      // Compile and return information.
      return {
        bridge: bridge,
        proximalVisits: novelProximalVisits,
        fringe: novelFringe,
        path: path
      };
    }
  }
  /**
  * Collects identifiers of nodes that a traversal visits as predecessors or
  * successors by an immutable recursive algorithm.
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
      return Traversal.collectPredecessorsSuccessorsIterateNeighborNodes({
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
      return Traversal.extractPathNodes({
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
  * Combines nodes from multiple paths.
  * @param {Array<Array<string>>} paths Identifiers of nodes in paths.
  * @returns {Array<string>} Identifiers of nodes.
  */
  static combinePathsNodes(paths) {
    return paths.reduce(function (pathCollection, path) {
      return path.reduce(function (nodeCollection, node) {
        if (!nodeCollection.includes(node)) {
          return [].concat(nodeCollection, node);
        } else {
          return nodeCollection;
        }
      }, pathCollection);
    }, []);
  }
}
