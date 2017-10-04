/**
* Functionality of utility for assigning attributes to metabolic entities.
* This class does not store any attributes and does not require instantiation.
* This class stores methods for external utility.
*/
class Attribution {
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
    var match = previousSelections.some(function (selection) {
      return (
        selection.attribute === attribute && selection.value === value
      );
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
  * Filters reactions and their values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.selections Current selections
  * of attributes' values.
  * @param {Object} parameters.reactions Records with information about
  * reactions.
  * @returns {Object} Records with information about reactions and values of
  * their attributes that pass filters.
  */
  static filterReactionsAttributesValues({selections, reactions} = {}) {
    // This filtration procedure selects both which reactions to preserve and
    // which of their values of attributes to preserve.
    // A reaction's values of attributes determine its attribution to sets, so
    // it is also important to filter these values.
    // Determine filters from selections.
    var filters = Attribution.translateSelectionsFilters(selections);
    // Filter reactions and their values of attributes.
    var reactionsIdentifiers = Object.keys(reactions);
    return reactionsIdentifiers
    .reduce(function (collection, reactionIdentifier) {
      // Set reference to reaction's record.
      var reaction = reactions[reactionIdentifier];
      // Filter reaction's attributes.
      var filterReaction = Attribution.filterReactionAttributesValues({
        reaction: reaction,
        filters: filters
      });
      // Determine whether the reaction passes filters.
      var pass = Attribution.determineReactionPassFilters(filterReaction);
      if (pass) {
        // Reaction passes filters.
        // Include reaction in the collection.
        var novelRecord = {
          [filterReaction.identifier]: filterReaction
        };
        var currentCollection = Object.assign({}, collection, novelRecord);
      } else {
        // Reaction does not pass filters.
        // Omit reaction from the collection.
        var currentCollection = collection;
      }
      return currentCollection;
    }, {});
  }
  /**
  * Translates selections of attributes' values to filters of attributes'
  * values.
  * @param {Array<Object<string>>} parameters.selections Current selections
  * of attributes' values.
  * @returns {Object<Array<string>>} Values of attributes to apply as
  * filters.
  */
  static translateSelectionsFilters(selections) {
    // Translate information from selections to a different structure for
    // filters for convenience in filtration procedure.
    return selections.reduce(function (collection, selection) {
      // Determine whether the collection includes the selection's attribute.
      if (!collection.hasOwnProperty(selection.attribute)) {
        // The collection does not include the selection's attribute.
        // Include the selection's attribute and value in the collection.
        var novelRecord = {
          [selection.attribute]: [selection.value]
        };
        var currentCollection = Object.assign({}, collection, novelRecord);
      } else {
        // The collection includes the selection's attribute.
        // Determine whether the collection includes the selection's value of
        // the attribute.
        // Normally in the application, replicate selections are impossible.
        if (
          !collection[selection.attribute].includes(selection.value)
        ) {
          // The collection does not include the selection's value of the
          // attribute.
          // Include the selection's value of the attribute in the collection.
          var currentValues = []
          .concat(collection[selection.attribute], selection.value);
          var novelRecord = {
            [selection.attribute]: currentValues
          };
          var currentCollection = Object.assign({}, collection, novelRecord);
        } else {
          // The collection includes the selection's value of the attribute.
          // Preserve the collection.
          var currentCollection = collection;
        }
      }
      return currentCollection;
    }, {});
  }
  /**
  * Filters a reaction's values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reaction Record with information about a
  * reaction.
  * @param {Object<Array<string>>} parameters.filters Values of attributes to
  * apply as filters.
  * @returns {Object} Record with information about a reaction and its
  * attributes' values that pass filters.
  */
  static filterReactionAttributesValues({reaction, filters} = {}) {
    // Determine reaction's values of relevant attributes that pass filters.
    // Filter processes.
    var processes = Attribution.filterAttributeValues({
      values: reaction.processes,
      attribute: "processes",
      filters: filters
    });
    // Filter compartments.
    var compartments = Attribution.filterAttributeValues({
      values: reaction.compartments,
      attribute: "compartments",
      filters: filters
    });
    // Filter metabolites.
    var metabolites = Attribution.filterReactionMetabolites({
      metabolites: reaction.metabolites,
      compartments: compartments,
      participants: reaction.participants
    });
    // Compile attributes' values that pass filters.
    var filterAttributes = {
      processes: processes,
      compartments: compartments,
      metabolites: metabolites
    };
    // Copy all of reaction's attributes.
    var attributes = General.copyValueJSON(reaction);
    // Replace reaction's original attributes with those that pass filters.
    return Object.assign({}, attributes, filterAttributes);
  }
  /**
  * Filters values of a reaction's attributes.
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
  * @param {Array<string>} parameters.compartments Identifiers of a
  * reaction's compartments that pass filters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @returns {Array<string>} Identifiers of a reaction's metabolites that
  * pass filters.
  */
  static filterReactionMetabolites({
    metabolites, compartments, participants
  } = {}) {
    // Filter metabolites by the compartments in which they participate in their
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
  * Determines whether or not a reaction passes filters.
  * @param {Object} reaction Record with information about a reaction and its
  * attributes' values that pass filters.
  * @returns {boolean} Whether or not the reaction passes filters.
  */
  static determineReactionPassFilters(reaction) {
    // Requirements for reaction to pass filters depends on the reaction's main
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
          return reaction.compartments.includes(compartment);
        });
        return matches.length > 1;
      });
    } else {
      // Reaction does not involve transport of a metabolite between different
      // compartments.
      // Reaction passes filters if it has any processes, compartments, and
      // metabolites that pass filters.
      var compartments = reaction.compartments.length > 0;
    }
    // Combinations of criteria between different values of the same attribute
    // use OR logic, since any value that passes fulfills the requirement for
    // the attribute.
    // Combinations of criteria between different attributes use AND logic,
    // since all attributes must pass to fulfill the requirement for the
    // reaction.
    var processes = reaction.processes.length > 0;
    var metabolites = reaction.metabolites.length > 0;
    return (compartments && processes && metabolites);
  }
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
