/**
* Functionality of utility for assigning attributes to metabolic entities.
* This class does not store any attributes and does not require instantiation.
* This class stores methods for external utility.
*/
class Attribution {
  /**
  * Collects for each reaction information about the metabolites that
  * participate and the sets to which the entity belongs by its values of
  * attributes.
  * @param {Object<Object>} reactions Information about reactions.
  * @returns {Array<Object>} Information about reactions' metabolites and sets.
  */
  static collectReactionsMetabolitesAttributesValues(reactions) {
    // Iterate on reactions.
    var reactionsIdentifiers = Object.keys(reactions);
    return reactionsIdentifiers.map(function (reactionIdentifier) {
      var reaction = reactions[reactionIdentifier];
      // Collect reaction's values of attributes.
      var identifier = reaction.identifier;
      var metabolites = General.collectUniqueElements(
        General.collectValueFromObjects("metabolite", reaction.participants)
      );
      var compartments = General.collectUniqueElements(
        General.collectValueFromObjects("compartment", reaction.participants)
      );
      var processes = reaction.processes.slice();
      // Compile reaction's attributes.
      // Create reaction's record.
      var record = {
        reaction: identifier,
        metabolites: metabolites,
        compartments: compartments,
        processes: processes
      };
      return record;
    });
  }
  /**
  * Collects for each metabolite information about the reactions in which it
  * participates and the sets to which the entity belongs by its values of
  * attributes.
  * @param {Array<Object>} setsReactions Information about reactions'
  * metabolites and sets.
  * @param {Object<Object>} reactions Information about reactions.
  * @returns {Array<Object>} Information about metabolites' reactions and sets.
  */
  static collectMetabolitesReactionsAttributesValues(setsReactions, reactions) {
    // A metabolite inherits its attributes that are relevant to sets and
    // filtration from the reactions in which it participates.
    // A metabolite only passes filters if it participates in at least a single
    // reaction in a context that passes filters.
    // Filtration ensure that information about reactions' metabolites and sets
    // only includes values of attributes that pass filters and metabolites that
    // participate in contexts that pass filters.
    // Information about metabolites' reactions and sets derives from comparable
    // information about reactions, so the filtration applies.
    // Collect the identifiers of reactions in which each metabolite
    // participates.
    var metabolitesReactions = General.collectRecordsTargetsByCategories({
      target: "reaction",
      category: "metabolites",
      records: setsReactions
    });
    // Iterate on metabolites.
    var metabolitesIdentifiers = Object.keys(metabolitesReactions);
    return metabolitesIdentifiers.map(function (metaboliteIdentifier) {
      // Determine the identifiers of unique reactions in which the metabolite
      // participates.
      var reactionsIdentifiers = General.collectUniqueElements(
        metabolitesReactions[metaboliteIdentifier]
      );
      // Collect values of attributes that the metabolite inherits from
      // reactions in which it participates.
      var reactionsAttributesValues = Attribution
      .collectMetaboliteReactionsAttributesValues({
        metaboliteIdentifier: metaboliteIdentifier,
        reactionsIdentifiers: reactionsIdentifiers,
        reactions: reactions
      });
      // Compile metabolite's attributes.
      // Create metabolite's record.
      var novelAttributesValues = {
        metabolite: metaboliteIdentifier,
        reactions: reactionsIdentifiers
      };
      var record = Object
      .assign({}, reactionsAttributesValues, novelAttributesValues);
      return record;
    });
  }
  /**
  * Collects values of attributes that a metabolite inherits from the reactions
  * in which it participates.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a single
  * metabolite.
  * @param {Array<string>} parameters.reactionsIdentifiers Identifiers of
  * reactions in which a single metabolite participates.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Values of attributes that a metabolite inherits from
  * the reactions in which it participates.
  */
  static collectMetaboliteReactionsAttributesValues({
    metaboliteIdentifier,
    reactionsIdentifiers,
    reactions
  } = {}) {
    // Collect attributes that metabolite inherits from the reactions in which
    // it participates.
    // Initialize collection.
    var initialCollection = {
      compartments: [],
      processes: []
    };
    // Collect values of attributes from reactions.
    var totalAttributes = reactionsIdentifiers
    .reduce(function (collection, reactionIdentifier) {
      var reaction = reactions[reactionIdentifier];
      // Collect compartments in which metabolite participates in the reaction.
      var compartments = Attribution.collectMetaboliteReactionCompartments({
        metaboliteIdentifier: metaboliteIdentifier,
        participants: reaction.participants
      });
      var currentCompartments = []
      .concat(collection.compartments, compartments);
      // Collect processes from the reaction.
      // Metabolite inherits all of reactions' processes.
      var processes = reaction.processes;
      var currentProcesses = [].concat(collection.processes, processes);
      // Compile collection's values of attributes.
      var currentCollection = {
        compartments: currentCompartments,
        processes: currentProcesses
      };
      // Preserve collection.
      return currentCollection;
    }, initialCollection);
    // Collect unique values of attributes.
    return {
      compartments: General.collectUniqueElements(totalAttributes.compartments),
      processes: General.collectUniqueElements(totalAttributes.processes)
    };
  }
  /**
  * Collects compartments in which a metabolite participates in a single
  * reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Metabolite's identifier.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @returns {Array<string>} Identifiers of compartments in which metabolite
  * participates in the reaction.
  */
  static collectMetaboliteReactionCompartments({
    metaboliteIdentifier,
    participants
  } = {}) {
    // Collect compartments in which metabolite participates in the reaction.
    // Metabolite only inherits the compartments in which it participates in the
    // reaction.
    var participantsMatches = Extraction.filterReactionParticipants({
      criteria: {metabolites: [metaboliteIdentifier]},
      participants: participants
    });
    var participantsCompartments = General.collectValueFromObjects(
      "compartment", participantsMatches
    );
    return participantsCompartments;
  }
  /**
  * Filters for each reaction information about the metabolites that participate
  * and the sets to which the entity belongs by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.setsSelections Selections of
  * attributes' values.
  * @param {Array<Object>} parameters.setsTotalReactions Information about all
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about reactions' metabolites and sets
  * that pass filters.
  */
  static filterReactionsMetabolitesAttributesValues({
    setsSelections, setsTotalReactions, reactions
  } = {}) {
    // This filtration procedure selects which reactions to preserve, which of
    // their metabolites to preserve, and which of their values of attributes to
    // preserve.
    // Determine filters from selections of sets.
    var filters = Attribution.translateSelectionsFilters(setsSelections);
    // Filter reactions, their metabolites, and their values of attributes.
    return setsTotalReactions.reduce(function (collection, reactionRecord) {
      // Set reference to reaction.
      var reaction = reactions[reactionRecord.reaction];
      // Filter reaction's attributes.
      var filterRecord = Attribution
      .filterReactionMetabolitesAttributesValues({
        reactionRecord: reactionRecord,
        filters: filters,
        reaction: reaction
      });
      // Determine whether the reaction passes filters.
      var pass = Attribution.determineReactionPassFilters(
        filterRecord, reaction
      );
      if (pass) {
        // Reaction passes filters.
        // Include reaction in the collection.
        var currentCollection = [].concat(collection, filterRecord);
      } else {
        // Reaction does not pass filters.
        // Omit reaction from the collection.
        var currentCollection = collection;
      }
      return currentCollection;
    }, []);
  }
  /**
  * Translates selections of attributes' values to filters of attributes'
  * values.
  * @param {Array<Object<string>>} selections Selections of attributes' values.
  * @returns {Object<Array<string>>} Values of attributes to apply as
  * filters.
  */
  static translateSelectionsFilters(selections) {
    // Translate information from selections to a different structure for
    // filters for convenience in filtration procedure.
    // Normally in the application, replicate selections are impossible.
    var filters = General.collectRecordsTargetsByCategories({
      target: "value",
      category: "attribute",
      records: selections
    });
    return filters;
  }
  /**
  * Filters a reaction's information about the metabolites that participate
  * and the sets to which the entity belongs by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reactionRecord Information about a reaction's
  * metabolites and sets.
  * @param {Object<Array<string>>} parameters.filters Values of attributes to
  * apply as filters.
  * @param {Object} parameters.reaction Information about a reaction.
  * @returns {Object} Information about a reaction's metabolites and sets that
  * pass filters.
  */
  static filterReactionMetabolitesAttributesValues({
    reactionRecord, filters, reaction
  } = {}) {
    // Determine reaction's values of relevant attributes that pass filters.
    // Filter processes.
    var processes = Attribution.filterAttributeValues({
      values: reactionRecord.processes,
      attribute: "processes",
      filters: filters
    });
    // Filter compartments.
    var compartments = Attribution.filterAttributeValues({
      values: reactionRecord.compartments,
      attribute: "compartments",
      filters: filters
    });
    // Filter metabolites.
    var metabolites = Attribution.filterReactionMetabolites({
      metabolites: reactionRecord.metabolites,
      compartments: compartments,
      participants: reaction.participants
    });
    // Compile reaction's values of attributes that pass filters.
    var filterAttributes = {
      metabolites: metabolites,
      compartments: compartments,
      processes: processes
    };
    // Create reaction's record.
    // Replace reaction's original values of attributes with those that pass
    // filters.
    return Object.assign({}, reactionRecord, filterAttributes);
  }
  /**
  * Filters values of a reaction's attribute.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.values Values of a single attribute.
  * @param {string} parameters.attribute A single attribute.
  * @param {Object<Array<string>>} parameters.filters Values of attributes to
  * apply as filters.
  * @returns {Array<string>} Attribute's values that pass filters.
  */
  static filterAttributeValues({
    values, attribute, filters
  } = {}) {
    // Determine if there is a filter for the attribute.
    if (!filters.hasOwnProperty(attribute)) {
      // There is not a filter for the attribute.
      // Copy the attribute's values.
      var matchValues = values.slice();
    } else {
      // There is a filter for the attribute.
      // Filter the attribute's values.
      var matchValues = values.filter(function (value) {
        return filters[attribute].includes(value);
      });
    }
    // Return values of the attribute that pass filters.
    return matchValues;
  }
  /**
  * Filters metabolites that participate in a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.metabolites Identifiers of metabolites
  * that participate in a reaction.
  * @param {Array<string>} parameters.compartments Identifiers of a reaction's
  * compartments that pass filters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @returns {Array<string>} Identifiers of a reaction's metabolites that
  * pass filters.
  */
  static filterReactionMetabolites({
    metabolites, compartments, participants
  } = {}) {
    // Filter metabolites by the compartments in which they participate in the
    // reaction.
    // Metabolites pass filters if they participate in a compartment that passes
    // filters.
    return metabolites.filter(function (metabolite) {
      var participantMatch = participants.some(function (participant) {
        var metaboliteMatch = participant.metabolite === metabolite;
        var compartmentMatch = compartments.includes(participant.compartment);
        return metaboliteMatch && compartmentMatch;
      });
      return participantMatch;
    });
  }
  /**
  * Determines whether a reaction passes filters.
  * @param {Object} reactionRecord Information about a reaction's metabolites
  * and sets that pass filters.
  * @param {Object} reaction Information about a reaction.
  * @returns {boolean} Whether the reaction passes filters.
  */
  static determineReactionPassFilters(reactionRecord, reaction) {
    // Requirements for reaction to pass filters depend on the reaction's main
    // behavior.
    // Determine whether reaction involves transport.
    if (reaction.transport) {
      // Reaction involves transport of a metabolite between different
      // compartments.
      // A single reaction can facilitate multiple transport events.
      // Reactions that involve transport only pass filters if multiple
      // compartments of any transport event pass filters.
      var compartments = reaction.transports.some(function (transport) {
        var matches = transport.compartments.filter(function (compartment) {
          return reactionRecord.compartments.includes(compartment);
        });
        return matches.length > 1;
      });
    } else {
      // Reaction does not involve transport of a metabolite between different
      // compartments.
      // Reaction passes filters if it has any processes, compartments, and
      // metabolites that pass filters.
      var compartments = reactionRecord.compartments.length > 0;
    }
    // Combinations of criteria between different values of the same attribute
    // use OR logic, since any value that passes fulfills the requirement for
    // the attribute.
    // Combinations of criteria between different attributes use AND logic,
    // since all attributes must pass to fulfill the requirement for the
    // reaction.
    var processes = reactionRecord.processes.length > 0;
    var metabolites = reactionRecord.metabolites.length > 0;
    return (compartments && processes && metabolites);
  }

  /**
  * Records new selection in collection of selections of attributes and
  * values for filters.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Value of attribute in current selection.
  * @param {string} parameters.attribute Attribute in current selection.
  * @param {Array<Object<string>>} parameters.previousSelections Previous
  * selections of attributes' values.
  * @returns {Array<Object<string>>} Current selections of attributes' values.
  */
  static recordFilterSelection({value, attribute, previousSelections} = {}) {
    // Determine whether previous selections include the attribute's value.
    var match = Attribution.determineSelectionMatch({
      value: value,
      attribute: attribute,
      selections: previousSelections
    });
    if (match) {
      // The previous selections include the attribute's value.
      // Remove the selection for the attribute's value.
      var currentSelections = previousSelections.filter(function (selection) {
        return !(
          selection.attribute === attribute && selection.value === value
        );
      });
    } else {
      // The previous selections do not include the attribute's value.
      // Include a selection for the attribute's value.
      var novelSelection = {
        attribute: attribute,
        value: value
      };
      var currentSelections = [].concat(previousSelections, novelSelection);
    }
    return currentSelections;
  }
  /**
  * Determines whether a current selection exists for an attribute and its
  * value.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Value of attribute in current selection.
  * @param {string} parameters.attribute Attribute in current selection.
  * @param {Array<Object<string>>} parameters.selections Selections of
  * attributes' values.
  * @returns {boolean} Whether a current selection exists for the attribute and
  * its value.
  */
  static determineSelectionMatch({value, attribute, selections} = {}) {
    return selections.some(function (selection) {
      return (
        selection.attribute === attribute && selection.value === value
      );
    });
  }


// TODO: This stuff might be obsolete.

  /**
  * Filters metabolites and their values of attributes that they inherit from
  * reactions in which they participate.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites.
  * @param {Object} parameters.reactions Records with information about
  * reactions.
  * @returns {Object} Records with information about metabolites and values
  * of their attributes that pass filters.
  */
  static filterMetabolitesAttributesValues({
    metabolites, reactions
  } = {}) {
    // This filtration procedure selects both which metabolites to preserve and
    // which of their values of attributes to preserve.
    // A metabolite's values of attributes determine its attribution to sets, so
    // it is also important to filter these values.
    // Metabolites inherit attributes relevant to filtration from the reactions
    // in which they participate.
    // Filter metabolites and their values of attributes.
    var metabolitesIdentifiers = Object.keys(metabolites);
    return metabolitesIdentifiers
    .reduce(function (collection, metaboliteIdentifier) {
      // Set reference to metabolite's record.
      var metabolite = metabolites[metaboliteIdentifier];
      // Filter metabolite's reactions and values of attributes that it inherits
      // from its reactions.
      var filterMetabolite = Attribution.filterMetaboliteAttributesValues({
        metabolite: metabolite,
        reactions: reactions
      });
      // Determine whether the metabolite passes filters.
      var pass = Attribution.determineMetabolitePassFilters(filterMetabolite);
      if (pass) {
        // Metabolite passes filters.
        // Include metabolite in the collection.
        var novelRecord = {
          [filterMetabolite.identifier]: filterMetabolite
        };
        var currentCollection = Object.assign({}, collection, novelRecord);
      } else {
        // Metabolite does not pass filters.
        // Omit metabolite from the collection.
        var currentCollection = collection;
      }
      return currentCollection;
    }, {});
  }
  /**
  * Filters a single metabolite's values of attributes that it inherits from
  * reactions in which it participates.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.metabolite Record with information about a
  * single metabolite.
  * @param {Object} parameters.reactions Records with information about
  * reactions.
  * @returns {Object} Record with information about a single metabolite and
  * values of its attributes that pass filters.
  */
  static filterMetaboliteAttributesValues({
    metabolite, reactions
  } = {}) {
    // Determine values of attributes that metabolite inherits from the
    // reactions in which it participates.
    var reactionsAttributes = Extraction.collectMetaboliteReactionsAttributes({
      metaboliteIdentifier: metabolite.identifier,
      reactionsIdentifiers: metabolite.reactions,
      reactions: reactions
    });
    // Copy all of metabolite's attributes.
    var metaboliteAttributes = General.copyValueJSON(metabolite);
    // Replace metabolite's original attributes with those that pass filters.
    return Object.assign({}, metaboliteAttributes, reactionsAttributes);
  }
  /**
  * Determines whether or not a metabolite passes filters.
  * @param {Object} metabolite Record with information about a metabolite and
  * its attributes' values that pass filters.
  * @returns {boolean} Whether or not the metabolite passes filters.
  */
  static determineMetabolitePassFilters(metabolite) {
    // Attributes relevant to filtration are compartments and processes.
    // Metabolites inherit these attributes from the reactions in which they
    // participate.
    // To pass filters, a metabolite must participate in at least a single
    // reaction in a context that passes filters.
    return metabolite.reactions.length > 0;
  }
}
