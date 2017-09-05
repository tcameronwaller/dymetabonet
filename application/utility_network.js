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
  * @returns {Object<Array<Object>>} Records with information about nodes and
  * links in a network.
  */
  static collectNetworkReactionsMetabolites({
    compartmentalization,
    simplification,
    metabolites,
    reactions
  } = {}) {
    // Initiate a collection of network elements.
    // Separate types of nodes and links to simplify searches for existing
    // records.
    var initialNetworkElements = {
      metabolitesLinks: [],
      metabolitesNodes: [],
      reactionsLinks: [],
      reactionsPositionNodes: [],
      reactionsNodes: []
    };
    // Iterate on reactions.
    var reactionsIdentifiers = Object.keys(reactions);
    return reactionsIdentifiers
    .reduce(function (reactionsCollection, reactionIdentifier) {
      // Set reference to reaction's record.
      var reaction = reactions[reactionIdentifier];
      // Determine whether to include representations of the reaction and its
      // metabolites in the network's elements.
      var pass = Network.determineReactionRepresentation({
        reaction: reaction,
        compartmentalization: compartmentalization,
        metabolites: metabolites
      });
      if (pass) {
        // Determine consensus information for reaction.
        var consensualReaction = Network.determineConsensualReaction({
          reactionIdentifier: reactionIdentifier,
          compartmentalization: compartmentalization,
          metabolites: metabolites,
          reactions: reactions
        });
        // Create novel nodes and link for the reaction, and include these in the
        // collection.
        var reactionNetworkElements = Network.createNovelReactionNodesLink({
          reaction: consensualReaction,
          previousNetworkElements: reactionsCollection,
          metabolites: metabolites
        });
        // TODO: Re-do the procedure for metabolites to follow new pattern of different categories of network elements...
        // Create novel nodes and links for the reaction's metabolites, and
        // include these in the collection.
        var metabolitesNetworkElements = Network.collectNetworkMetabolites({
          reaction: reaction,
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
  /**
  * Determines whether to include in the network representations for a reaction
  * and its metabolites.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Record with information about a reaction
  * and values of its attributes that pass filters.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {boolean} Whether to represent the reaction and its metabolites in
  * the network.
  */
  static determineReactionRepresentation({
    reaction,
    compartmentalization,
    metabolites
  } = {}) {
    // Determine whether reaction passes on the basis of participation of its
    // metabolites.
    // A reaction is only relevant if metabolites participate in relevant
    // contexts.
    var participationRelevance = Network
    .determineReactionMetabolitesParticipation(reaction);
    // Determine whether reaction passes on the basis of relevance of its
    // metabolites.
    // A reaction is only relevant if its metabolites are relevant.
    var simplificationRelevance = !Network
    .determineReactionMetabolitesSimplification({
      reaction: reaction,
      metabolites: metabolites
    });
    // Determine whether reaction passes on the basis of its operation in the
    // context of compartmentalization.
    // A reaction is only relevant if its operation is relevant to compartmental
    // context.
    var operationRelevance = Network.determineReactionCompartmentalOperation({
      reaction: reaction,
      compartmentalization: compartmentalization,
      metabolites: metabolites
    });
    // Determine whether to represent reaction and its metabolites.
    if (!participationRelevance) {
      // Metabolites do not participate in reaction in relevant contexts as both
      // reactants and products.
      // Omit representations for reaction and its metabolites.
      return false;
    } else if (!simplificationRelevance) {
      // All of reaction's relevant metabolites have designations for
      // simplification.
      // Omit representations for reaction and its metabolites.
      return false;
    } else if (!operationRelevance) {
      // Reaction's operation is irrelevant in the context of the relevance of
      // compartmentalization.
      // Omit representations for reaction and its metabolites.
      return false;
    } else {
      // Include representations for reaction and its metabolites.
      return true;
    }
  }
  /**
  * Determines whether metabolites participate in a reaction in relevant
  * contexts as both reactants and products.
  * @param {Object} reaction Record with information about a reaction and values
  * of its attributes that pass filters.
  * @returns {boolean} Whether to represent the reaction and its metabolites in
  * the network.
  */
  static determineReactionMetabolitesParticipation(reaction) {
    // Determine whether reaction involves participation from relevant
    // metabolites as both reactants and products.
    // Consider only reaction's metabolites that pass filters.
    // Collect unique identifiers of metabolites that participate as reactants
    // in relevant contexts.
    var reactantsIdentifiers = Extraction.collectMetabolitesFilterParticipants({
      criteria: {
        metabolites: reaction.metabolites,
        compartments: reaction.compartments,
        roles: ["reactant"]
      },
      participants: reaction.participants
    });
    var uniqueReactants = General.collectUniqueElements(reactantsIdentifiers);
    // Collect unique identifiers of metabolites that participate as products in
    // relevant contexts.
    var productsIdentifiers = Extraction.collectMetabolitesFilterParticipants({
      criteria: {
        metabolites: reaction.metabolites,
        compartments: reaction.compartments,
        roles: ["product"]
      },
      participants: reaction.participants
    });
    var uniqueProducts = General.collectUniqueElements(productsIdentifiers);
    // Determine if the reaction has at least one relevant reactant and at least
    // one relevant product.
    return (uniqueReactants.length > 0 && uniqueProducts.length > 0);
  }
  /**
  * Determines whether all relevant metabolites that participate in a reaction
  * have designations for simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Record with information about a reaction
  * and values of its attributes that pass filters.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {boolean} Whether all of reaction's metabolites have designations
  * for simplification.
  */
  static determineReactionMetabolitesSimplification({
    reaction, metabolites
  } = {}) {
    // Determine whether all of reaction's metabolites have designations for
    // simplification.
    // Consider only reaction's metabolites that pass filters.
    return Network.determineMetabolitesSimplification({
      condition: "all",
      metabolitesIdentifiers: reaction.metabolites,
      metabolites: metabolites
    });
  }
  /**
  * Determines whether all relevant metabolites that participate in a reaction's
  * transport operation have designations for simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Record with information about a reaction
  * and values of its attributes that pass filters.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {boolean} Whether all of reaction's transport metabolites have
  * designations for simplification.
  */
  static determineReactionTransportMetabolitesSimplification({
    reaction, metabolites
  } = {}) {
    // Determine whether reaction transports only metabolites with designations
    // for simplification.
    // Consider only reaction's metabolites that pass filters.
    var transports = reaction.transports.filter(function (transport) {
      return reaction.metabolites.includes(transport.metabolite);
    });
    var transportsMetabolites = General
    .collectValueFromObjects("metabolite", transports);
    return Network.determineMetabolitesSimplification({
      condition: "all",
      metabolitesIdentifiers: transportsMetabolites,
      metabolites: metabolites
    });
  }
  /**
  * Determines whether any or all of a set of metabolites have designations for
  * simplification.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.condition Condition, either any or all, for which
  * to evaluate metabolites.
  * @param {Array<string>} parameters.metabolitesIdentifiers Identifiers of
  * metabolites of which to consider designations for simplification.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {boolean} Whether any or all of a set of metabolites have
  * designations for simplification.
  */
  static determineMetabolitesSimplification({
    condition, metabolitesIdentifiers, metabolites
  } = {}) {
    if (condition === "any") {
      return metabolitesIdentifiers.some(function (metaboliteIdentifier) {
        var metabolite = metabolites[metaboliteIdentifier];
        return metabolite.simplification;
      });
    } else if (condition === "all") {
      return metabolitesIdentifiers.every(function (metaboliteIdentifier) {
        var metabolite = metabolites[metaboliteIdentifier];
        return metabolite.simplification;
      });
    }
  }
  /**
  * Determines whether a reaction's operation is relevant in the context of
  * compartmentalization.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Record with information about a reaction
  * and values of its attributes that pass filters.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {boolean} Whether the reaction's role is relevant in the context of
  * compartmentalization.
  */
  static determineReactionCompartmentalOperation({
    reaction,
    compartmentalization,
    metabolites
  } = {}) {
    // Determine relevance of reaction's operation in the context of
    // compartmental relevance.
    // Determine whether reaction performs transport and not conversion.
    if (reaction.transport && !reaction.conversion) {
      // Reaction's primary operation is transport.
      // Determine compartmental relevance.
      if (compartmentalization) {
        // Compartmentalization is relevant.
        // Determine if reaction transports relevant metabolites.
        var transportsSimplification = Network
        .determineReactionTransportMetabolitesSimplification({
          reaction: reaction,
          metabolites: metabolites
        });
        if (transportsSimplification) {
          // Reaction transports only irrelevant metabolites.
          // Reaction is irrelevant.
          return false;
        } else {
          // Reaction transports relevant metabolites.
          // Reaction is relevant.
          return true;
        }
      } else {
        // Compartmentalization is irrelevant.
        // Reaction is irrelevant.
        return false;
      }
    } else {
      // Reaction's primary operation is not transport.
      // Determine compartmental relevance.
      if (compartmentalization) {
        // Compartmentalization is relevant.
        // Reaction is relevant.
        return true;
      } else {
        // Compartmentalization is irrelevant.
        // Reaction is relevant.
        return true;
      }
    }
  }
  /**
  * Determines consensual information about a reaction from any relevant,
  * redundant replicates.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reactionIdentifier Identifier of a reaction.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @param {Object} parameters.reactions Records with information about
  * reactions and values of their attributes that pass filters.
  * @returns {Object} Consensual information about a reaction.
  */
  static determineConsensualReaction({
    reactionIdentifier, compartmentalization, metabolites, reactions
  } = {}) {
    // Collect identifiers of replicate reactions that are both relevant and
    // redundant.
    var redundantReactions = Network.collectRedundantReplicateReactions({
      reactionIdentifier: reactionIdentifier,
      compartmentalization: compartmentalization,
      metabolites: metabolites,
      reactions: reactions
    });
    // Determine information about a single, consensual reaction to propagate.
    var consensualReaction = Network.combineReplicateReactions({
      reactionsIdentifiers: redundantReactions,
      reactions: reactions
    });
    return consensualReaction;
  }
  /**
  * Collects identifiers of replicate reactions that are both relevant and
  * redundant.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reactionIdentifier Identifier of a reaction.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @param {Object} parameters.reactions Records with information about
  * reactions and values of their attributes that pass filters.
  * @returns {Array<string>} Identifiers of reactions.
  */
  static collectRedundantReplicateReactions({
    reactionIdentifier, compartmentalization, metabolites, reactions
  } = {}) {
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
            var participation = Network.compareMutualReactionsParticipants({
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
    var firstComparison = Network.compareReactionsParticipants({
      firstParticipants: firstParticipants,
      secondParticipants: secondParticipants
    });
    var secondComparison = Network.compareReactionsParticipants({
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
      return secondParticipants.find(function (secondParticipant) {
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
    // Determine whether there are multiple relevant, redundant reactions.
    if (reactionsIdentifiers.length > 1) {
      // There are multiple relevant, redundant reactions.
      // Determine priority reaction from which to preserve attributes without
      // combination.
      // Sort reactions' identifiers by alphabetical order.
      var sortReactionsIdentifiers = General
      .sortArrayElementsByCharacter(reactionsIdentifiers);
      // Select first reaction's identifier as priority.
      var priorityReactionIdentifier = sortReactionsIdentifiers[0];
      // Copy attributes from priority reaction's record.
      var priorityAttributes = Extraction
      .copyEntityAttributesValues(reactions[priorityReactionIdentifier]);
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
      return Extraction
      .copyEntityAttributesValues(reactions[reactionsIdentifiers[0]]);
    }
  }
  /**
  * Creates novel nodes and link for a reaction and includes these in a
  * collection of network's elements.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Consensual information about a reaction.
  * @param {Object<Array<Object>>} parameters.previousNetworkElements Records
  * with information about nodes and links in a network.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {Object<Array<Object>>} Records with information about nodes and
  * links in a network.
  */
  static createNovelReactionNodesLink({
    reaction,
    previousNetworkElements,
    metabolites
  } = {}) {
    // Determine whether the collection includes a node for the reaction.
    var nodeMatch = previousNetworkElements.reactionNodes.some(function (node) {
      return node.identifier === reaction.identifier;
    });
    if (nodeMatch) {
      // Collection includes a node for the reaction.
      // Preserve current network elements.
      return previousNetworkElements;
    } else {
      // Collection does not include a node for the reaction.
      // Assume that the collection does not include any nodes or link for the
      // reaction.
      // Create novel nodes and link for the reaction.
      var reactionPositionNodes = Network.createReactionPositionNodes(reaction);
      var reactionNode = Network.createReactionNode({
        reaction: reaction,
        positionSource: reactionPositionNodes.source,
        positionTarget: reactionPositionNodes.target,
        metabolites: metabolites
      });
      var reactionLink = Network.createReactionLink({
        source: reactionPositionNodes.source.identifier,
        target: reactionPositionNodes.target.identifier,
        reaction: reactionNode
      });
      // Include reaction's novel nodes and link in the collection.
      var reactionsNodes = []
      .concat(previousNetworkElements.reactionsNodes, reactionNode);
      var reactionsPositionNodes = []
      .concat(
        previousNetworkElements.reactionsPositionNodes,
        reactionPositionNodes.source,
        reactionPositionNodes.target
      );
      var reactionsLinks = []
      .concat(previousNetworkElements.reactionsLinks, reactionLink);
      var currentNetworkElements = {
        reactionsLinks: reactionsLinks,
        reactionsPositionNodes: reactionsPositionNodes,
        reactionsNodes: reactionsNodes
      };
      var networkElements = Object
      .assign({}, previousNetworkElements, currentNetworkElements);
      return networkElements;
    }
  }
  /**
  * Creates nodes of type position for a reaction.
  * @param {Object} reaction Consensual information about a reaction.
  * @returns {Object<Object>} Record with information about nodes of type
  * position for a reaction.
  */
  static createReactionPositionNodes(reaction) {
    var source = Network.createReactionPositionNode({
      reaction: reaction,
      direction: "source"
    });
    var target = Network.createReactionPositionNode({
      reaction: reaction,
      direction: "target"
    });
    return {
      source: source,
      target: target
    };
  }
  /**
  * Creates a node of type position for a reaction.
  * @param {Object} reaction Consensual information about a reaction.
  * @returns {Object} Record with information about a node of type position for
  * a reaction.
  */
  static createReactionPositionNode({reaction, direction} = {}) {
    return {
      direction: direction,
      entity: "reaction",
      identifier: reaction.identifier + "_" + direction,
      reaction: reaction.identifier,
      type: "position"
    };
  }
  /**
  * Creates a node of type record for a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Consensual information about a reaction.
  * @param {Object} parameters.positionSource Record with information about a
  * node of type position for source.
  * @param {Object} parameters.positionTarget Record with information about a
  * node of type position for target.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {Object} Record with information about a node of type record for a
  * reaction.
  */
  static createReactionNode({
    reaction, positionSource, positionTarget, metabolites
  } = {}) {
    // Determine whether any of the reaction's metabolites have designations
    // for simplification.
    var simplification = Network.determineMetabolitesSimplification({
      condition: "any",
      metabolitesIdentifiers: reaction.metabolites,
      metabolites: metabolites
    });
    // Create references to nodes of type position for the reaction.
    var positions = []
    .concat(positionSource.identifier, positionTarget.identifier);
    // Create node for the reaction.
    var copyAttributes = Extraction.copyEntityAttributesValues(reaction);
    var novelAttributes = {
      entity: "reaction",
      positions: positions,
      simplification: simplification,
      type: "record"
    };
    var record = Object.assign({}, copyAttributes, novelAttributes);
    return record;
  }
  /**
  * Creates a link for a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.source Identifier of a node of type position for
  * source.
  * @param {string} parameters.target Identifier of a node of type position for
  * target.
  * @param {Object} parameters.reaction Record with information about a node of
  * type record for a reaction.
  * @returns {Object} Record with information about a link for a reaction.
  */
  static createReactionLink({source, target, reaction} = {}) {
    var attributes = {
      entity: "reaction",
      simplification: reaction.simplification
    };
    var link = Network.createLink({
      source: source,
      target: target,
      attributes: attributes
    });
    return link;
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
  * @param {Object<Array<Object>>} parameters.previousNetworkElements Records
  * with information about nodes and links in a network.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites, values of their attributes that pass filters, and designations
  * of whether to simplify their representations in the network.
  * @returns {Object<Array<Object>>} Network elements.
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
      var pass = Network.determineMetabolitePass({
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
  * @param {Object} parameters.reaction Record with information about a reaction
  * and values of its attributes that pass filters.
  * @param {Object} parameters.metabolite Record with information about a
  * metabolite, values of its attributes that pass filters, and designation of
  * whether to simplify its representation in the network.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {string} parameters.simplification Indicator of whether to simplify
  * nodes for metabolites in the network by replication or by omission.
  * @param {Object<Array<Object>>} parameters.previousNetworkElements Records
  * with information about nodes and links in a network.
  * @returns {Object<Array<Object>>} Network elements.
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
      // Create novel metabolite node, and include it in the collection.
      // Include attributes from general metabolite's record in the
      // node's attributes.
      // TODO: Procedures for node and link creation need updates for new structure of network elements.
      // TODO: Can I manage the creation of nodes and links for metabolites simultaneously, like I did for reactions?
      // TODO: Do I have to first create links and then decide if they're novel?
      var currentNodes = Network.createNovelMetaboliteNode({
        identifier: nodeIdentifier,
        compartment: participant.compartment,
        compartmentalization: compartmentalization,
        attributes: metabolite,
        previousNetworkElements: participantsCollection
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
  * Creates a novel node for a metabolite and includes it in the collection of
  * network's elements.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of node for metabolite.
  * @param {string} parameters.compartment Identifier of a compartment.
  * @param {boolean} parameters.compartmentalization Indicator of whether to
  * represent compartmentalization in the network.
  * @param {Object} parameters.attributes Record with information about a
  * metabolite, values of its attributes that pass filters, and designation of
  * whether to simplify its representation in the network.
  * @param {Object<Array<Object>>} parameters.previousNetworkElements Records
  * with information about nodes and links in a network.
  * @returns {Array<Object>} New nodes for the network.
  */
  static createNovelMetaboliteNode({
    identifier,
    compartment,
    compartmentalization,
    attributes,
    previousNetworkElements
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
