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
  * metabolites, values of their attributes that pass filters, and
  * specifications of whether to simplify their representations in the network.
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
  * metabolites, values of their attributes that pass filters, and
  * specifications of whether to simplify their representations in the network.
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
      // Set reference to current reaction.
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
        //
        // TODO: Update procedure for creating reaction's node and metabolites' nodes...



        // Create new node for the reaction.
        var newValues = {
          entity: "reaction"
        };
        var reactionNode = Object.assign({}, reaction, newValues);
        // Create new nodes for the reaction's metabolites.
        // Create new links between the reaction and its metabolites.
        var metabolitesNodesLinks = Network.assembleNetworkMetabolites({
          reaction: reaction,
          replications: replications,
          compartmentalization: compartmentalization,
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
  * metabolites, values of their attributes that pass filters, and
  * specifications of whether to simplify their representations in the network.
  * @returns {boolean} Whether to include the reaction and its metabolites in
  * the network.
  */
  static determineReactionPass({
    compartmentalization,
    reaction,
    metabolites
  } = {}) {
    // Determine whether to represent compartmentalization in the network.
    if (compartmentalization) {
      // Network represents compartmentalization.
      // Determine whether reaction performs transport and not conversion.
      if (reaction.transport && !reaction.conversion) {
        // Reaction's primary operation is transport.
        // Determine if reaction transports only metabolites with designations
        // for simplification.
        // Consider all metabolites of transport since prolific metabolites are
        // common in cooperative transport.
        var transports = General.collectValueFromObjects(
          "metabolite", reaction.transports
        );
        var simplification = transports.every(function (metaboliteIdentifier) {
          var metabolite = metabolites[metaboliteIdentifier];
          return metabolite.simplification;
        });
        if (simplification) {
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
  /**
  * Assembles network elements, nodes and links, across all metabolites that
  * participate in a single reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Record with information about a
  * reaction and values of its attributes that pass filters.
  * @param {Array<string>} parameters.replications Identifiers of metabolites
  * for which to replicate nodes in the network.
  * @param {boolean} parameters.compartmentalization Indicator of whether or
  * not to represent compartmentalization in the network.
  * @param {Object<Array<Object>>} parameters.reactionsCollection Collection
  * of network elements from reactions.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites and values of their attributes that pass filters.
  * @returns {Object<Array<Object>>} Network elements.
  */
  static assembleNetworkMetabolites({
    reaction,
    replications,
    compartmentalization,
    reactionsCollection,
    metabolites
  } = {}) {
    // Iterate on metabolites that participate in current reaction.
    return reaction
    .metabolites
    .reduce(function (metabolitesCollection, metaboliteIdentifier) {
      // If reaction's record includes a reference to the metabolite,
      // then the metabolite's participation satisfies filters.
      // Determine whether or not to replicate nodes for the
      // metabolite.
      var replication = replications.includes(metaboliteIdentifier);
      // Determine record for the metabolite.
      var metabolite = metabolites[metaboliteIdentifier];
      // A single metabolite can participate in its reaction in
      // multiple contexts.
      // Create new nodes for the metabolite in all of its contexts.
      // Create new links between the metabolite and its reaction.
      var participantsNodesLinks = Network
      .assembleNetworkParticipants({
        reaction: reaction,
        metabolite: metabolite,
        replication: replication,
        compartmentalization: compartmentalization,
        metabolitesCollection: metabolitesCollection
      });
      // Restore the collection of network elements to include new
      // nodes and links.
      return participantsNodesLinks;
    }, reactionsCollection);
  }
  /**
  * Assembles network elements, nodes and links, across all metabolites that
  * participate in a single reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Record with information about a
  * reaction and values of its attributes that pass filters.
  * @param {Object} parameters.metabolite Record with information about a
  * metabolite and values of its attributes that pass filters.
  * @param {boolean} parameters.replication Indicator of whether or not to
  * replicate nodes for the metabolite in the network.
  * @param {boolean} parameters.compartmentalization Indicator of whether or
  * not to represent compartmentalization in the network.
  * @param {Object<Array<Object>>} parameters.metabolitesCollection
  * Collection of network elements from metabolites that participate in a
  * reaction.
  * @returns {Object<Array<Object>>} Network elements.
  */
  static assembleNetworkParticipants({
    reaction,
    metabolite,
    replication,
    compartmentalization,
    metabolitesCollection
  } = {}) {
    // Determine contexts of roles and compartments in which the metabolite
    // participates in the reaction.
    // Only include contexts that satisfy filters, specifically with regard
    // to compartments.
    var participants = reaction
    .participants
    .filter(function (participant) {
      var metaboliteMatch = (
        participant.metabolite === metabolite.identifier
      );
      var compartmentMatch = reaction
      .compartments.includes(participant.compartment);
      return metaboliteMatch && compartmentMatch;
    });
    // Iterate on contexts in which the metabolite participates in
    // the reaction.
    return participants
    .reduce(function (participantsCollection, participant) {
      // Create node for metabolite's participation in the reaction.
      // Determine identifier for metabolite node.
      var nodeIdentifier = Network
      .determineMetaboliteNodeIdentifier({
        metabolite: metabolite.identifier,
        compartment: participant.compartment,
        compartmentalization: compartmentalization,
        reaction: reaction.identifier,
        replication: replication
      });
      // Create new metabolite node and include in the collection.
      // Include attributes from general metabolite's record in the
      // node's attributes.
      var newNodes = Network.createNewMetaboliteNode({
        identifier: nodeIdentifier,
        compartment: participant.compartment,
        compartmentalization: compartmentalization,
        replication: replication,
        attributes: metabolite,
        currentNodes: participantsCollection.nodes
      });
      // Create links between the reaction and the metabolite.
      var links = Network.createReactionMetaboliteLinks({
        metaboliteIdentifier: nodeIdentifier,
        role: participant.role,
        reactionIdentifier: reaction.identifier,
        reversibility: reaction.reversibility
      });
      // Include new links in the collection.
      var newLinks = Network.determineNewLinks({
        currentLinks: metabolitesCollection.links,
        links: links
      });
      // Restore the collection with new elements of the network.
      return {
        links: newLinks,
        nodes: newNodes
      };
    }, metabolitesCollection);
  }
  /**
  * Determines the identifier for a network node for a metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metabolite Identifier of a general metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Indicator of whether or
  * not to represent compartmentalization in the network.
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
    reaction,
    replication
  } = {}) {
    // Determine base identifier for the metabolite node.
    var baseMetaboliteIdentifier = Network
    .determineMetaboliteNodeBaseIdentifier({
      metabolite: metabolite,
      compartment: compartment,
      compartmentalization: compartmentalization
    });
    // Determine whether or not to create replicate, reaction-specific nodes
    // for the metabolite.
    if (!replication) {
      // Do not replicate nodes for the metabolite.
      var metaboliteNodeIdentifier = baseMetaboliteIdentifier;
    } else {
      // Replicate nodes for the metabolite.
      var metaboliteNodeIdentifier = (
        baseMetaboliteIdentifier + "_" + reaction
      );
    }
    return metaboliteNodeIdentifier;
  }
  /**
  * Determines the identifier for a network node for a metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metabolite Identifier of a general metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Indicator of whether or
  * not to represent compartmentalization in the network.
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
  * Creates a new node for a metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of node for metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Indicator of whether or
  * not to represent compartmentalization in the network.
  * @param {boolean} parameters.replication Whether or not to replicate nodes
  * for the metabolite.
  * @param {Object} parameters.attributes Information about a metabolite.
  * @param {Array<Object>} parameters.currentNodes Nodes in current
  * collection for the network.
  * @returns {Array<Object>} New nodes for the network.
  */
  static createNewMetaboliteNode({
    identifier,
    compartment,
    compartmentalization,
    replication,
    attributes,
    currentNodes
  } = {}) {
    // Determine whether or not a node already exists for the metabolite.
    var nodeMatch = currentNodes.find(function (node) {
      return node.identifier === identifier;
    });
    if (!nodeMatch) {
      // A node does not already exist for the metabolite.
      // Create new node for the metabolite.
      // Include new attributes for the node.
      if (compartmentalization) {
        var newCompartment = compartment;
      } else {
        var newCompartment = null;
      }
      // Copy all of metabolite's attributes.
      var copyAttributes = Extraction
      .copyEntityAttributesValues(attributes);
      var newAttributes = {
        compartment: newCompartment,
        entity: "metabolite",
        identifier: identifier,
        metabolite: copyAttributes.identifier,
        replication: replication
      };
      var newNode = Object.assign({}, copyAttributes, newAttributes);
      var newNodes = currentNodes.concat(newNode);
    } else {
      // A node already exists for the metabolite.
      var newNodes = currentNodes;
    }
    return newNodes;
  }
  /**
  * Creates records for links between a pair of a single reaction and a
  * single metabolite that participates in the reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a single
  * metabolite.
  * @param {string} parameters.role Role, either reactant or product, of the
  * metabolite in the reaction.
  * @param {string} parameters.reactionIdentifier Identifier of a single
  * reaction.
  * @param {boolean} parameters.reversibility Indicator of whether or not the
  * reaction is reversible.
  * @returns {Array<Object<string>>} Records for links between the reaction
  * and the metabolite.
  */
  static createReactionMetaboliteLinks({
    metaboliteIdentifier,
    role,
    reactionIdentifier,
    reversibility
  } = {}) {
    // Use a special delimiter "_-_" between identifiers of reactions and
    // metabolites for links in order to avoid ambiguity with nodes for
    // reaction-specific metabolites.
    // Determine whether or not the reaction is reversible.
    if (!reversibility) {
      // Reaction is not reversible.
      // Create directional link from a reactant metabolite to the
      // reaction or from the reaction to a product metabolite.
      if (role === "reactant") {
        var newLink = {
          identifier: (
            metaboliteIdentifier + "_-_" + reactionIdentifier
          ),
          source: metaboliteIdentifier,
          target: reactionIdentifier
        };
        return [].concat(newLink);
      } else if (role === "product") {
        var newLink = {
          identifier: (
            reactionIdentifier + "_-_" + metaboliteIdentifier
          ),
          source: reactionIdentifier,
          target: metaboliteIdentifier
        };
        return [].concat(newLink);
      }
    } else {
      // Reaction is reversible.
      // Create directional links in both directions between the
      // metabolite and the reaction.
      var newForwardLink = {
        identifier: metaboliteIdentifier + "_-_" + reactionIdentifier,
        source: metaboliteIdentifier,
        target: reactionIdentifier
      };
      var newReverseLink = {
        identifier: reactionIdentifier + "_-_" + metaboliteIdentifier,
        source: reactionIdentifier,
        target: metaboliteIdentifier
      };
      return [].concat(newForwardLink, newReverseLink);
    }
  }
  /**
  * Determines which links are new to a collection for a network.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.currentLinks Records for links
  * currently in the collection for the network.
  * @param {Array<Object<string>>} parameters.links Links for a reaction.
  * @returns {Array<Object<string>>} Collection with new links.
  */
  static determineNewLinks({currentLinks, links} = {}) {
    return links.reduce(function (collection, link) {
      var linkSearch = collection.find(function (currentLink) {
        return currentLink.identifier === link.identifier;
      });
      if (!linkSearch) {
        // The link does not already exist in the collection.
        // Include the link in the collection.
        return collection.concat(link);
      } else {
        // The link already exists in the collection.
        return collection;
      }
    }, currentLinks);
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
