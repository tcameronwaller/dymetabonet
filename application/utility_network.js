/**
* Functionality of utility for collecting nodes for metabolic entities,
* metabolites and reactions, and links for relations between them.
* This class does not store any attributes and does not require instantiation.
* This class stores methods for external utility.
*/
class Network {
  // Master control of procedure to assemble network elements.

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
  * @returns {Object<Array<Object>>} Network's elements.
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
    return Network.collectNetworkReactionsMetabolites({
      compartmentalization: compartmentalization,
      simplification: simplification,
      metabolites: metabolites,
      reactions: reactions
    });
  }
  /**
  * Collects network elements, nodes and links, across reactions and their
  * metabolites.
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
  * @returns {Object<Array<Object>>} Network's elements.
  */
  static collectNetworkReactionsMetabolites({
    compartmentalization,
    simplification,
    metabolites,
    reactions
  } = {}) {
    // Initiate a collection of network elements.
    var initialNetworkElements = {
      links: [],
      nodes: []
    };
    // Iterate on reactions.
    var reactionsIdentifiers = Object.keys(reactions);
    return reactionsIdentifiers
    .reduce(function (reactionsCollection, reactionIdentifier) {
      // Set reference to current reaction's record.
      var reaction = reactions[reactionIdentifier];
      // Determine whether to include representations of the reaction and its
      // metabolites in the network's elements.
      var pass = Network.determineReactionPass({
        compartmentalization: compartmentalization,
        reaction: reaction,
        metabolites: metabolites
      });
      if (pass) {
        // Include representations of the reaction and its metabolites in the
        // network's elements.
        // Determine whether any of the reaction's metabolites have designations
        // for simplification.
        var designation = reaction
        .metabolites
        .some(function (metaboliteIdentifier) {
          var metabolite = metabolites[metaboliteIdentifier];
          return metabolite.simplification;
        });
        // Create node for the reaction.
        var reactionAttributes = Extraction
        .copyEntityAttributesValues(reaction);
        var novelAttributes = {
          entity: "reaction",
          simplification: designation
        };
        var reactionNode = Object
        .assign({}, reactionAttributes, novelAttributes);
        // Create new nodes for the reaction's metabolites.
        // Create new links between the reaction and its metabolites.

        // TODO: Update procedure for creating reaction's node and metabolites' nodes...

        var metabolitesNodesLinks = Network.collectNetworkMetabolites({
          reaction: reaction,
          compartmentalization: compartmentalization,
          simplification: simplification,
          reactionsCollection: reactionsCollection,
          metabolites: metabolites
        });
        // Restore the collection of network elements to include new
        // nodes and links.
        return {
          links: metabolitesNodesLinks.links,
          nodes: metabolitesNodesLinks.nodes.concat(reactionNode)
        };
      } else {
        // Omit representations of the reaction and its metabolites from the
        // network's elements.
        // Preserve the collection of the network's elements.
        return reactionsCollection;
      }
    }, initialNetworkElements);
  }
  /**
  * Determines whether to include in the network nodes and links for the
  * reaction and its metabolites.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {Object} parameters.reaction Record with information about a reaction
  * and values of its attributes that pass filters.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {boolean} Whether to represent the reaction and its metabolites in
  * the network.
  */
  static determineReactionPass({
    compartmentalization,
    reaction,
    metabolites
  } = {}) {
    // Whether to include representations of the reaction and its metabolites
    // depends on multiple, interdependent criteria.
    // Consider criteria that relate to the relevance of the reaction's
    // metabolites.
    // Determine whether all of reaction's metabolites that pass filters have
    // designations for simplification.
    var metabolitesSimplification = Network
    .determineMetabolitesSimplification({
      metabolitesIdentifiers: reaction.metabolites,
      metabolites: metabolites
    });
    if (metabolitesSimplification) {
      // All of reaction's metabolites that pass filters have designations for
      // simplification.
      // Omit representations for reaction and its metabolites.
      return false;
    } else {
      // Metabolites of interest participate in the reaction and pass filters.
      // Consider criteria that relate to compartmentalization.
      // Determine whether to represent compartmentalization in the network.
      if (compartmentalization) {
        // Network represents compartmentalization.
        // Determine whether reaction performs transport and not conversion.
        if (reaction.transport && !reaction.conversion) {
          // Reaction's primary operation is transport.
          // Determine if reaction transports only metabolites with designations
          // for simplification.
          // Consider all metabolites of transport since prolific metabolites
          // are common in cooperative transport.
          var transports = General
          .collectValueFromObjects("metabolite", reaction.transports);
          var transportsSimplification = Network
          .determineMetabolitesSimplification({
            metabolitesIdentifiers: transports,
            metabolites: metabolites
          });
          if (transportsSimplification) {
            // Reaction transports only metabolites with designations for
            // simplification.
            // Omit representations for reaction and its metabolites.
            return false;
          } else {
            // Reaction transports metabolites of interest.
            // Include representations for reaction and its metabolites.
            return true;
          }
        } else {
          // Reaction's primary operation might not be transport.
          // Include representations for reaction and its metabolites.
          return true;
        }
      } else {
        // Network does not represent compartmentalization.
        // Determine whether reaction performs transport and not conversion.
        if (reaction.transport && !reaction.conversion) {
          // Reaction's primary operation is transport.
          // Omit representations for reaction and its metabolites.
          return false;
        } else {
          // Reaction's primary operation might not be transport.
          // TODO: Determine if the reaction is a replicate reaction and if it is replicate for compartmental reasons.
          // TODO: If so, then omit it. Otherwise include it.
          // TODO: Temporary...
          // Include representations for reaction and its metabolites.
          return true;
        }
      }
    }
  }
  /**
  * Determines whether all of a set of metabolites have designations for
  * simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.metabolitesIdentifiers Identifiers of
  * metabolites of which to consider designations for simplification.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {boolean} Whether all of a set of metabolites have designations for
  * simplification.
  */
  static determineMetabolitesSimplification({
    metabolitesIdentifiers, metabolites
  } = {}) {
    return metabolitesIdentifiers.every(function (metaboliteIdentifier) {
      var metabolite = metabolites[metaboliteIdentifier];
      return metabolite.simplification;
    });
  }
  /**
  * Collects network elements, nodes and links, across all metabolites that
  * participate in a single reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Record with information about a reaction
  * and values of its attributes that pass filters.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {string} parameters.simplification Indicator of whether to simplify
  * nodes for metabolites in the network by replication or by omission.
  * @param {Object<Array<Object>>} parameters.reactionsCollection Collection
  * of network elements from reactions.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {Object<Array<Object>>} Network elements.
  */
  static collectNetworkMetabolites({
    reaction,
    compartmentalization,
    simplification,
    reactionsCollection,
    metabolites
  } = {}) {
    // Only include representations for the reaction's metabolites that pass
    // filters.
    // If reaction's record includes a reference to the metabolite, then the
    // metabolite's participation satisfies filters.
    // Iterate on metabolites.
    return reaction
    .metabolites
    .reduce(function (metabolitesCollection, metaboliteIdentifier) {
      // Set reference to current metabolite's record.
      var metabolite = metabolites[metaboliteIdentifier];
      // Determine whether to include representations for the metabolite in the
      // network's elements.
      var pass = Network.determineMetabolitePass({
        metabolite: metabolite,
        compartmentalization: compartmentalization,
        simplification: simplification
      });
      if (pass) {
        // Include representations of the metabolite in the network's elements.
        // A single metabolite can participate in a reaction in multiple
        // contexts.
        // Create new nodes for the metabolite's contexts.
        // Create new links between the reaction and the metabolite's contexts.
        var participantsNodesLinks = Network.collectNetworkParticipants({
          reaction: reaction,
          metabolite: metabolite,
          compartmentalization: compartmentalization,
          simplification: simplification,
          metabolitesCollection: metabolitesCollection
        });
        // Restore the collection of network elements to include new
        // nodes and links.
        return participantsNodesLinks;
      } else {
        // Omit representations of the metabolite from the network's elements.
        return metabolitesCollection;
      }
    }, reactionsCollection);
  }
  /**
  * Determines whether to include in the network nodes and links for a
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
  static determineMetabolitePass({
    metabolite,
    compartmentalization,
    simplification
  } = {}) {
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
  * @param {Object} parameters.reaction Record with information about a reaction
  * and values of its attributes that pass filters.
  * @param {Object} parameters.metabolite Record with information about a
  * metabolite, values of its attributes that pass filters, and designation of
  * whether to simplify its representation in the network.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {string} parameters.simplification Indicator of whether to simplify
  * nodes for metabolites in the network by replication or by omission.
  * @param {Object<Array<Object>>} parameters.metabolitesCollection Collection
  * of network elements from metabolites that participate in a reaction.
  * @returns {Object<Array<Object>>} Network elements.
  */
  static collectNetworkParticipants({
    reaction,
    metabolite,
    compartmentalization,
    simplification,
    metabolitesCollection
  } = {}) {
    // Determine contexts of roles and compartments in which the metabolite
    // participates in the reaction.
    // Only include contexts that satisfy filters, specifically with regard
    // to compartments.
    var participants = reaction.participants.filter(function (participant) {
      var metaboliteMatch = (
        participant.metabolite === metabolite.identifier
      );
      var compartmentMatch = reaction
      .compartments
      .includes(participant.compartment);
      return metaboliteMatch && compartmentMatch;
    });
    // Iterate on contexts in which the metabolite participates in the reaction.
    return participants
    .reduce(function (participantsCollection, participant) {
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
      // Create new metabolite node and include in the collection.
      // Include attributes from general metabolite's record in the
      // node's attributes.
      var currentNodes = Network.createNovelMetaboliteNode({
        identifier: nodeIdentifier,
        compartment: participant.compartment,
        compartmentalization: compartmentalization,
        attributes: metabolite,
        previousNodes: participantsCollection.nodes
      });
      // Create links between the reaction and the metabolite.
      var links = Network.createReactionMetaboliteLinks({
        metaboliteIdentifier: nodeIdentifier,
        role: participant.role,
        simplification: metabolite.simplification,
        reactionIdentifier: reaction.identifier,
        reversibility: reaction.reversibility
      });
      // Include novel links in the collection.
      var currentLinks = Network.collectNovelLinks({
        previousLinks: participantsCollection.links,
        links: links
      });
      // Restore the collection with new elements of the network.
      return {
        links: currentLinks,
        nodes: currentNodes
      };
    }, metabolitesCollection);
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
  * Creates a novel node for a metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of node for metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {Object} parameters.attributes Record with information about a
  * metabolite, values of its attributes that pass filters, and designation of
  * whether to simplify its representation in the network.
  * @param {Array<Object>} parameters.previousNodes Nodes in previous collection
  * for the network.
  * @returns {Array<Object>} New nodes for the network.
  */
  static createNovelMetaboliteNode({
    identifier,
    compartment,
    compartmentalization,
    attributes,
    previousNodes
  } = {}) {
    // Determine whether the collection includes a node for the metabolite.
    var nodeMatch = previousNodes.some(function (node) {
      return node.identifier === identifier;
    });
    if (nodeMatch) {
      // Collection includes a node for the metabolite.
      var currentNodes = previousNodes;
    } else {
      // Collection does not include a node for the metabolite.
      // Create novel node for the metabolite.
      // Include novel attributes for the node.
      if (compartmentalization) {
        var newCompartment = compartment;
      } else {
        var newCompartment = null;
      }
      // Copy all of metabolite's attributes.
      var copyAttributes = Extraction.copyEntityAttributesValues(attributes);
      var newAttributes = {
        compartment: newCompartment,
        entity: "metabolite",
        identifier: identifier,
        metabolite: copyAttributes.identifier
      };
      var newNode = Object.assign({}, copyAttributes, newAttributes);
      var currentNodes = previousNodes.concat(newNode);
    }
    return currentNodes;
  }
  /**
  * Creates records for links between a pair of a single reaction and a
  * single metabolite that participates in the reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a single
  * metabolite.
  * @param {string} parameters.role Role, either reactant or product, of the
  * metabolite in the reaction.
  * @param {boolean} parameters.simplification Indicator of whether to simplify
  * the metabolite's representation in the network.
  * @param {string} parameters.reactionIdentifier Identifier of a single
  * reaction.
  * @param {boolean} parameters.reversibility Indicator of whether the reaction
  * is reversible.
  * @returns {Array<Object<string>>} Records for links between the reaction
  * and the metabolite.
  */
  static createReactionMetaboliteLinks({
    metaboliteIdentifier,
    role,
    simplification,
    reactionIdentifier,
    reversibility
  } = {}) {
    // Create attributes for the links.
    var attributes = {
      simplification: simplification
    };
    // Determine whether the reaction is reversible.
    if (!reversibility) {
      // Reaction is not reversible.
      // Create directional link from a reactant metabolite to the
      // reaction or from the reaction to a product metabolite.
      if (role === "reactant") {
        var link = Network.createLink({
          source: metaboliteIdentifier,
          target: reactionIdentifier,
          attributes: attributes
        });
        return [link];
      } else if (role === "product") {
        var link = Network.createLink({
          source: reactionIdentifier,
          target: metaboliteIdentifier,
          attributes: attributes
        });
        return [link];
      }
    } else {
      // Reaction is reversible.
      // Create directional links in both directions between the
      // metabolite and the reaction.
      var forwardLink = Network.createLink({
        source: metaboliteIdentifier,
        target: reactionIdentifier,
        attributes: attributes
      });
      var reverseLink = Network.createLink({
        source: reactionIdentifier,
        target: metaboliteIdentifier,
        attributes: attributes
      });
      return [].concat(forwardLink, reverseLink);
    }
  }
  /**
  * Creates record for a link.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a single node to be the
  * link's source.
  * @param {string} parameters.target Identifier of a single node to be the
  * link's target.
  * @param {Object} parameters.attributes Values of attributes in include in the
  * link's record.
  * @returns {Object} Record for a link.
  */
  static createLink({source, target, attributes} = {}) {
    // Use a special delimiter "_-_" between identifiers of reactions and
    // metabolites for links in order to avoid ambiguity with nodes for
    // reaction-specific metabolites.
    var identifier = source + "_-_" + target;
    var record = {
      identifier: identifier,
      source: source,
      target: target
    };
    return Object.assign({}, record, attributes);
  }
  /**
  * Collects links that are novel to a collection for a network.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.previousLinks Records for links
  * currently in the collection for the network.
  * @param {Array<Object<string>>} parameters.links Links for a reaction.
  * @returns {Array<Object<string>>} Collection with new links.
  */
  static collectNovelLinks({previousLinks, links} = {}) {
    return links.reduce(function (collection, link) {
      var linkSearch = collection.some(function (previousLink) {
        return previousLink.identifier === link.identifier;
      });
      if (!linkSearch) {
        // Collection does not include the link.
        // Include the link in the collection.
        return collection.concat(link);
      } else {
        // Collection includes the link.
        return collection;
      }
    }, previousLinks);
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
  * @param {string} parameters.focus Identifier for a single node in a
  * network that is the focal node.
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
