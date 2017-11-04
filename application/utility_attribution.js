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
* Functionality of utility for assigning metabolic entities to sets by their
* values of attributes.
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
*/
class Attribution {

  /**
  * Determines information about the sets to which all entities belong by their
  * values of attributes.
  * @param {Object<Object>} reactions Information about reactions.
  * @returns {Object} Information about all entities' sets.
  */
  static determineTotalEntitiesSets(reactions) {
    // Attributes that are relevant to sets and filters include processes and
    // compartments.
    // Reactions involve participation from metabolites as either reactants or
    // products.
    // Reactions belong to processes directly by their operations in either
    // chemical conversion or physical transport.
    // Reactions localize to the compartments in which their metabolites
    // participate.
    // Records within attribute "totalReactionsSets" include information about
    // all reactions and all their metabolites, processes, and compartments.
    // Collect information about reactions' metabolites and sets.
    var totalReactionsSets = Attribution
    .collectReactionsMetabolitesAttributesValues(reactions);
    // Metabolites participate in reactions.
    // Metabolites inherit from the reactions in which they participate all of
    // the reactions' processses.
    // Metabolites inherit from the reactions in which they participate only the
    // compartments in which they occur and participate in the reaction.
    // Records within attribute "totalMetabolitesSets" include information about
    // all metabolites and all processes and compartments of participation that
    // they inherit from the reactions in which they participate.
    // Collect information about metabolites' reactions and sets.
    var totalMetabolitesSets = Attribution
    .collectMetabolitesReactionsAttributesValues(totalReactionsSets, reactions);
    // Compile information.
    var totalEntitiesSets = {
      totalReactionsSets: totalReactionsSets,
      totalMetabolitesSets: totalMetabolitesSets
    };
    // Return information.
    return totalEntitiesSets;
  }
  /**
  * Determines information about the sets to which current entities belong by
  * their values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.setsSelections Selections of
  * sets by values of attributes.
  * @param {Array<Object>} parameters.totalReactionsSets Information about all
  * reactions' metabolites and sets.
  * @param {Array<Object>} parameters.totalMetabolitesSets Information about all
  * metabolites' reactions and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Information about current entities' sets.
  */
  static determineCurrentEntitiesSets({
    setsSelections, totalReactionsSets, totalMetabolitesSets, reactions
  } = {}) {
    // The filtration procedures are computationally expensive.
    // Determine whether there are any selections of attributes' values to apply
    // as filters.
    if (setsSelections.length < 1) {
      // There are not any selections of attributes' values to apply as filters.
      // Copy information about entities' sets.
      var accessReactionsSets = General.copyValueJSON(totalReactionsSets);
      var accessMetabolitesSets = General.copyValueJSON(totalMetabolitesSets);
      var filterReactionsSets = General.copyValueJSON(totalReactionsSets);
      var filterMetabolitesSets = General.copyValueJSON(totalMetabolitesSets);
    } else {
      // There are selections of attributes' values to apply as filters.
      // Filter entities and their values of attributes.
      // Filter against all entities and their sets.
      // Records within attribute "accessReactionsSets" retain information about
      // reactions with any processes or compartments that pass filters, and
      // they only retain processes or compartments if any values of the other
      // reciprocal attribute pass filters.
      // Filter information about reactions' metabolites and sets.
      var accessReactionsSets = Attribution
      .filterAccessReactionsAttributesValues({
        setsSelections: setsSelections,
        totalReactionsSets: totalReactionsSets,
        reactions: reactions
      });
      // Records within attribute "accessMetabolitesSets" retain information
      // about metabolites with any processes or compartments that pass filters,
      // and they only retain processes or compartments if any values of the
      // other reciprocal attribute pass filters.
      // Filter information about metabolites' reactions and sets.
      var accessMetabolitesSets = Attribution
      .filterMetabolitesReactionsAttributesValues({
        totalMetabolitesSets: totalMetabolitesSets,
        reactionsSets: accessReactionsSets,
        reactions: reactions
      });
      // Records within attribute "filterReactionsSets" retain information about
      // reactions with any metabolites, processes, and compartments that pass
      // filters, and they only retain metabolites, processes, compartments that
      // match filters.
      // Filter information about reactions' metabolites and sets.
      var filterReactionsSets = Attribution
      .filterReactionsMetabolitesAttributesValues({
        setsSelections: setsSelections,
        totalReactionsSets: totalReactionsSets,
        reactions: reactions
      });
      // Records within attribute "filterMetabolitesSets" retain information
      // about metabolites with any reactions, processes, and compartments that
      // pass filters, and they only retain reactions, processes, compartments
      // that match filters.
      // Filter information about metabolites' reactions and sets.
      var filterMetabolitesSets = Attribution
      .filterMetabolitesReactionsAttributesValues({
        totalMetabolitesSets: totalMetabolitesSets,
        reactionsSets: filterReactionsSets,
        reactions: reactions
      });
    }
    // Compile information.
    var currentEntitiesSets = {
      accessReactionsSets: accessReactionsSets,
      accessMetabolitesSets: accessMetabolitesSets,
      filterReactionsSets: filterReactionsSets,
      filterMetabolitesSets: filterMetabolitesSets
    };
    // Return information.
    return currentEntitiesSets;
  }

  // Attribution of entities to sets by values of attributes.

  /**
  * Collects for all reactions information about all the metabolites that
  * participate in each reaction and the sets to which each reaction belongs by
  * all its values of attributes.
  * @param {Object<Object>} reactions Information about reactions.
  * @returns {Array<Object>} Information about reactions' metabolites and sets.
  */
  static collectReactionsMetabolitesAttributesValues(reactions) {
    // Iterate on reactions.
    var reactionsIdentifiers = Object.keys(reactions);
    return reactionsIdentifiers.map(function (reactionIdentifier) {
      // Access information about reaction.
      var reaction = General
      .accessObjectRecordByIdentifier(reactionIdentifier, reactions);
      // Collect values of attributes.
      var identifier = reaction.identifier;
      var metabolites = General.collectUniqueElements(
        General.collectValueFromObjects("metabolite", reaction.participants)
      );
      var compartments = General.collectUniqueElements(
        General.collectValueFromObjects("compartment", reaction.participants)
      );
      var processes = reaction.processes.slice();
      // Compile information.
      var record = {
        identifier: identifier,
        reaction: identifier,
        metabolites: metabolites,
        compartments: compartments,
        processes: processes
      };
      // Return information.
      return record;
    });
  }
  /**
  * Collects for all metabolites information about all the reactions in which
  * each metabolite participates and the sets to which each metabolite belongs
  * by all its values of attributes.
  * @param {Array<Object>} reactionsSets Information about reactions'
  * metabolites and sets.
  * @param {Object<Object>} reactions Information about reactions.
  * @returns {Array<Object>} Information about metabolites' reactions and sets.
  */
  static collectMetabolitesReactionsAttributesValues(reactionsSets, reactions) {
    // Collect the identifiers of reactions in which each metabolite
    // participates.
    var metabolitesReactions = General.collectRecordsTargetsByCategories({
      target: "reaction",
      category: "metabolites",
      records: reactionsSets
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
        reactionsSets: reactionsSets,
        reactions: reactions
      });
      // Compile information.
      var novelAttributesValues = {
        identifier: metaboliteIdentifier,
        metabolite: metaboliteIdentifier
      };
      var record = Object
      .assign({}, reactionsAttributesValues, novelAttributesValues);
      // Return information.
      return record;
    });
  }
  /**
  * Collects reactions in which a metabolite participates and values of
  * attributes that the metabolite inherits from these reactions.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a metabolite.
  * @param {Array<string>} parameters.reactionsIdentifiers Identifiers of
  * reactions.
  * @param {Array<Object>} parameters.reactionsSets Information about reactions'
  * metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Information about reactions in which a metabolite
  * participates and values of attributes that the metabolite inherits from
  * these reactions.
  */
  static collectMetaboliteReactionsAttributesValues({
    metaboliteIdentifier,
    reactionsIdentifiers,
    reactionsSets,
    reactions
  } = {}) {
    // Collect reactions that pass any filters and in which metabolite's
    // participation passes any filters.
    // Collect attributes that pass any filters from these reactions.
    // Initialize collection.
    var initialCollection = {
      reactions: [],
      compartments: [],
      processes: []
    };
    var totalAttributes = reactionsIdentifiers
    .reduce(function (collection, reactionIdentifier) {
      // Determine whether reaction passes any filters and whether metabolite's
      // participation in the reaction passes any filters.
      var passClaim = Attribution.determineMetaboliteReactionPassClaim({
        metaboliteIdentifier: metaboliteIdentifier,
        reactionIdentifier: reactionIdentifier,
        reactionsSets: reactionsSets
      });
      if (passClaim) {
        // Reaction passes any filters, and metabolite's participation in the
        // reaction passes any filters.
        // Collect values of attributes that metabolite inherits from reaction.
        var inheritance = Attribution
        .collectMetaboliteReactionAttributesValues({
          metaboliteIdentifier: metaboliteIdentifier,
          reactionIdentifier: reactionIdentifier,
          reactionsSets: reactionsSets,
          reactions: reactions
        });
        // Compile information.
        var currentReactions = []
        .concat(collection.reactions, reactionIdentifier);
        var currentCompartments = []
        .concat(collection.compartments, inheritance.compartments);
        var currentProcesses = []
        .concat(collection.processes, inheritance.processes);
        var currentCollection = {
          reactions: currentReactions,
          compartments: currentCompartments,
          processes: currentProcesses
        };
      } else {
        // Reaction does not pass filters, or metabolite's participation in the
        // reaction does not pass filters.
        var currentCollection = collection;
      }
      // Propagate collection.
      return currentCollection;
    }, initialCollection);
    // Collect unique values of attributes.
    var attributesValues = {
      reactions: General.collectUniqueElements(totalAttributes.reactions),
      compartments: General.collectUniqueElements(totalAttributes.compartments),
      processes: General.collectUniqueElements(totalAttributes.processes)
    };
    // Return information.
    return attributesValues;
  }
  /**
  * Determines whether a reaction passes any filters and whether a metabolite's
  * participation in the reaction passes any filters.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a metabolite.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {Array<Object>} parameters.reactionsSets Information about reactions'
  * metabolites and sets.
  * @returns {boolean} Whether the reaction passes any filters and whether
  * metabolite's participation in the reaction passes any filters.
  */
  static determineMetaboliteReactionPassClaim({
    metaboliteIdentifier, reactionIdentifier, reactionsSets
  } = {}) {
    // Determine whether reaction passes filters.
    var pass = General.determineArrayRecordByIdentifier(
      reactionIdentifier, reactionsSets
    );
    if (pass) {
      // Access information about reaction's sets.
      var reactionSets = General.accessArrayRecordByIdentifier(
        reactionIdentifier, reactionsSets
      );
      // Determine whether metabolite's participation in the reaction passes any
      // filters.
      var claim = reactionSets.metabolites.includes(metaboliteIdentifier);
    } else {
      var claim = false;
    }
    return pass && claim;
  }
  /**
  * Collects values of attributes that a metabolite inherits from a reaction in
  * which it participates.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a metabolite.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {Array<Object>} reactionsSets Information about reactions'
  * metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Values of attributes that a metabolite inherits from the
  * reaction in which it participates.
  */
  static collectMetaboliteReactionAttributesValues({
    metaboliteIdentifier, reactionIdentifier, reactionsSets, reactions
  } = {}) {
    // Access information about reaction.
    var reaction = General
    .accessObjectRecordByIdentifier(reactionIdentifier, reactions);
    var reactionSets = General.accessArrayRecordByIdentifier(
      reactionIdentifier, reactionsSets
    );
    // Collect processes.
    // Metabolite inherits all of reactions' processes.
    var processes = reactionSets.processes.slice();
    // Collect compartments that pass any filters and in which metabolite
    // participates in the reaction.
    var compartments = Attribution.collectMetaboliteReactionCompartments({
      metaboliteIdentifier: metaboliteIdentifier,
      compartments: reactionSets.compartments,
      participants: reaction.participants
    });
    // Compile information.
    var attributesValues = {
      processes: processes,
      compartments: compartments
    };
    // Return information.
    return attributesValues;
  }
  /**
  * Collects compartments that pass any filters and in which a metabolite
  * participates in a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a metabolite.
  * @param {Array<string>} parameters.compartments Identifiers of a reaction's
  * compartments that pass any filters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' and compartments' participation in a reaction.
  * @returns {Array<string>} Identifiers of compartments that pass any filters
  * and in which metabolite participates in the reaction.
  */
  static collectMetaboliteReactionCompartments({
    metaboliteIdentifier,
    compartments,
    participants
  } = {}) {
    // Metabolite inherits from a reaction only the compartments in which it
    // participates.
    // Filter reaction's participants for those that match the metabolite and
    // compartments that pass any filters.
    var relevantParticipants = Extraction.filterReactionParticipants({
      criteria: {
        metabolites: [metaboliteIdentifier],
        compartments: compartments
      },
      participants: participants
    });
    // Collect compartments from relevant participants.
    var participantsCompartments = General.collectValueFromObjects(
      "compartment", relevantParticipants
    );
    return participantsCompartments;
  }

  // Filtration of entities by values of attributes.

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
      return (selection.attribute === attribute && selection.value === value);
    });
  }
  /**
  * Filters for each reaction information about the sets to which the entity
  * belongs by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.setsSelections Selections of
  * attributes' values.
  * @param {Array<Object>} parameters.totalReactionsSets Information about all
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about reactions' metabolites and sets
  * that pass filters.
  */
  static filterAccessReactionsAttributesValues({
    setsSelections, totalReactionsSets, reactions
  } = {}) {
    // Determine filters from selections of sets.
    var filters = Attribution.translateSelectionsFilters(setsSelections);
    // Filter reactions, their metabolites, and their values of attributes.
    return totalReactionsSets.reduce(function (collection, reactionSets) {
      // Access information about reaction.
      var reaction = General
      .accessObjectRecordByIdentifier(reactionSets.reaction, reactions);
      // Filter reaction's values of attributes.
      var filterSets = Attribution.filterAccessReactionAttributesValues({
        filters: filters,
        reactionSets: reactionSets,
        reaction: reaction
      });
      // Determine whether the reaction passes filters.
      var pass = Attribution.determineAccessReactionPassFilters(
        filterSets, reaction
      );
      if (pass) {
        // Reaction passes filters.
        // Compile information about reaction and its values of attributes.
        // Replace reaction's original values of attributes with those that pass
        // filters.
        var record = Object.assign({}, reactionSets, filterSets);
        // Include reaction's record in the collection.
        var currentCollection = [].concat(collection, record);
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
  * Filters a reaction's information about the sets to which the entity belongs
  * by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<string>>} parameters.filters Values of attributes to
  * apply as filters.
  * @param {Object} parameters.reactionSets Information about a reaction's
  * metabolites and sets.
  * @param {Object} parameters.reaction Information about a reaction.
  * @returns {Object} Information about a reaction's metabolites and sets that
  * pass filters.
  */
  static filterAccessReactionAttributesValues({
    filters, reactionSets, reaction
  } = {}) {
    // Determine which of reaction's values of attributes to retain for
    // accessibility of sets.
    // Filter values of attributes reciprocally.
    var processes = Attribution.filterReciprocalAttributeValues({
      trialValues: reactionSets.processes,
      trialAttribute: "processes",
      qualifierValues: reactionSets.compartments,
      qualifierAttribute: "compartments",
      filters: filters
    });
    var compartments = Attribution.filterReciprocalAttributeValues({
      trialValues: reactionSets.compartments,
      trialAttribute: "compartments",
      qualifierValues: reactionSets.processes,
      qualifierAttribute: "processes",
      filters: filters
    });
    // Do not filter reaction's metabolites.
    var metabolites = reactionSets.metabolites.slice();
    // It is necessary to retain metabolites to retain accessibility of sets.
    // Compile information.
    var filterAttributesValues = {
      metabolites: metabolites,
      processes: processes,
      compartments: compartments
    };
    // Return information.
    return filterAttributesValues;
  }
  /**
  * Filters values of an attribute reciprocally.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.trialValues Values of an attribute on
  * trial.
  * @param {string} parameters.trialAttribute Name of an attribute on trial.
  * @param {Array<string>} parameters.qualifierValues Values of an attribute to
  * use for qualification.
  * @param {string} parameters.qualifierAttribute Name of an attribute to use
  * for qualification.
  * @param {Object<Array<string>>} parameters.filters Values of attributes to
  * apply as filters.
  * @returns {Array<string>} Attribute's values that pass filters.
  */
  static filterReciprocalAttributeValues({
    trialValues, trialAttribute, qualifierValues, qualifierAttribute, filters
  } = {}) {
    // Determine values of qualifier attribute that pass filters.
    var filterQualifiers = Attribution.filterAttributeValues({
      values: qualifierValues,
      attribute: qualifierAttribute,
      filters: filters
    });
    // Determine whether any values of qualifier attribute pass filters.
    if (filterQualifiers.length > 0) {
      // Some values of qualifier attribute pass filters.
      // Retain all values of trial attribute.
      var values = trialValues.slice();
    } else {
      // Not any values of qualifier attribute pass filters.
      // Do not retain any values of trial attribute.
      var values = [];
    }
    return values;
  }
  /**
  * Filters values of an attribute.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.values Values of an attribute.
  * @param {string} parameters.attribute Name of an attribute.
  * @param {Object<Array<string>>} parameters.filters Values of attributes to
  * apply as filters.
  * @returns {Array<string>} Attribute's values that pass filters.
  */
  static filterAttributeValues({
    values, attribute, filters
  } = {}) {
    // Determine if there is a filter for the attribute.
    if (filters.hasOwnProperty(attribute)) {
      // There is a filter for the attribute.
      // Filter the attribute's values.
      var filterValues = values.filter(function (value) {
        return filters[attribute].includes(value);
      });
    } else {
      // There is not a filter for the attribute.
      // Copy the attribute's values.
      var filterValues = values.slice();
    }
    // Return values of the attribute that pass filters.
    return filterValues;
  }
  /**
  * Determines whether a reaction passes filters by its values of attributes.
  * @param {Object} parameters.filterSets Information about a reaction's sets
  * that pass filters.
  * @param {Object} reaction Information about a reaction.
  * @returns {boolean} Whether the reaction passes filters.
  */
  static determineAccessReactionPassFilters(filterSets, reaction) {
    var metabolites = filterSets.metabolites.length > 0;
    var processes = filterSets.processes.length > 0;
    var compartments = filterSets.compartments.length > 0;
    return (metabolites && (processes || compartments));
  }
  /**
  * Filters for each reaction information about the metabolites that participate
  * and the sets to which the entity belongs by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.setsSelections Selections of
  * attributes' values.
  * @param {Array<Object>} parameters.totalReactionsSets Information about all
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about reactions' metabolites and sets
  * that pass filters.
  */
  static filterReactionsMetabolitesAttributesValues({
    setsSelections, totalReactionsSets, reactions
  } = {}) {
    // Determine filters from selections of sets.
    var filters = Attribution.translateSelectionsFilters(setsSelections);
    // Filter reactions, their metabolites, and their values of attributes.
    return totalReactionsSets.reduce(function (collection, reactionSets) {
      // Access information about reaction.
      var reaction = General
      .accessObjectRecordByIdentifier(reactionSets.reaction, reactions);
      // Filter reaction's values of attributes.
      var filterSets = Attribution.filterReactionMetabolitesAttributesValues({
        filters: filters,
        reactionSets: reactionSets,
        reaction: reaction
      });
      // Determine whether the reaction passes filters.
      var pass = Attribution.determineReactionPassFilters(filterSets, reaction);
      if (pass) {
        // Reaction passes filters.
        // Compile information about reaction and its values of attributes.
        // Replace reaction's original values of attributes with those that pass
        // filters.
        var record = Object.assign({}, reactionSets, filterSets);
        // Include reaction's record in the collection.
        var currentCollection = [].concat(collection, record);
      } else {
        // Reaction does not pass filters.
        // Omit reaction from the collection.
        var currentCollection = collection;
      }
      return currentCollection;
    }, []);
  }
  /**
  * Filters a reaction's information about the metabolites that participate
  * and the sets to which the entity belongs by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<string>>} parameters.filters Values of attributes to
  * apply as filters.
  * @param {Object} parameters.reactionSets Information about a reaction's
  * metabolites and sets.
  * @param {Object} parameters.reaction Information about a reaction.
  * @returns {Object} Information about a reaction's metabolites and sets that
  * pass filters.
  */
  static filterReactionMetabolitesAttributesValues({
    filters, reactionSets, reaction
  } = {}) {
    // Determine reaction's values of relevant attributes that pass filters.
    // Filter processes.
    var processes = Attribution.filterAttributeValues({
      values: reactionSets.processes,
      attribute: "processes",
      filters: filters
    });
    // Filter compartments.
    var compartments = Attribution.filterAttributeValues({
      values: reactionSets.compartments,
      attribute: "compartments",
      filters: filters
    });
    // Filter metabolites.
    var metabolites = Attribution.filterReactionMetabolites({
      metabolites: reactionSets.metabolites,
      compartments: compartments,
      participants: reaction.participants
    });
    // Compile information.
    var filterAttributesValues = {
      metabolites: metabolites,
      compartments: compartments,
      processes: processes
    };
    // Return information.
    return filterAttributesValues;
  }
  /**
  * Filters metabolites that participate in a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.metabolites Identifiers of metabolites.
  * @param {Array<string>} parameters.compartments Identifiers of a reaction's
  * compartments that pass filters.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' and compartments' participation in a reaction.
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
  * Determines whether a reaction passes filters by its values of attributes.
  * @param {Object} parameters.filterSets Information about a reaction's
  * metabolites and sets that pass filters.
  * @param {Object} reaction Information about a reaction.
  * @returns {boolean} Whether the reaction passes filters.
  */
  static determineReactionPassFilters(filterSets, reaction) {
    // Combinations of filters against different values of the same attribute
    // use OR logic, since any value of the attribute must pass filters.
    // Combinations of filters against different attributes use AND logic,
    // since all attributes must pass filters.
    var metabolites = filterSets.metabolites.length > 0;
    var processes = filterSets.processes.length > 0;
    var compartments = filterSets.compartments.length > 0;
    return (metabolites && compartments && processes);
  }
  /**
  * Filters for each metabolite information about the reactions in which it
  * participates and the sets to which the entity belongs by its values of
  * attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.totalMetabolitesSets Information about all
  * metabolites' reactions and sets.
  * @param {Array<Object>} parameters.reactionsSets Information about reactions'
  * metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about metabolites' reactions and sets
  * that pass filters.
  */
  static filterMetabolitesReactionsAttributesValues({
    totalMetabolitesSets, reactionsSets, reactions
  } = {}) {
    // Filter metabolites, their reactions, and their values of attributes.
    return totalMetabolitesSets.reduce(function (collection, metaboliteSets) {
      // Filter metabolite's reactions and values of attributes that it inherits
      // from these reactions.
      var filterSets = Attribution.filterMetaboliteReactionsAttributesValues({
        metaboliteSets: metaboliteSets,
        reactionsSets: reactionsSets,
        reactions: reactions
      });
      // Determine whether the metabolite passes filters.
      var pass = Attribution.determineMetabolitePassFilters(filterSets);
      if (pass) {
        // Metabolite passes filters.
        // Compile information about metabolite and its values of attributes.
        // Replace metabolite's original values of attributes with those that
        // pass filters.
        var record = Object.assign({}, metaboliteSets, filterSets);
        // Include metabolite's record in the collection.
        var currentCollection = [].concat(collection, record);
      } else {
        // Metabolite does not pass filters.
        // Omit metabolite from the collection.
        var currentCollection = collection;
      }
      return currentCollection;
    }, []);
  }
  /**
  * Filters for a single metabolite information about the reactions in which it
  * participates and the sets to which the entity belongs by its values of
  * attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.metaboliteSets Information about a metabolite's
  * reactions and sets.
  * @param {Array<Object>} parameters.reactionsSets Information about reactions'
  * metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Array<Object>} Information about metabolites' reactions and sets
  * that pass filters.
  */
  static filterMetaboliteReactionsAttributesValues({
    metaboliteSets, reactionsSets, reactions
  } = {}) {
    // Collect values of attributes that the metabolite inherits from
    // reactions in which it participates.
    var reactionsAttributesValues = Attribution
    .collectMetaboliteReactionsAttributesValues({
      metaboliteIdentifier: metaboliteSets.metabolite,
      reactionsIdentifiers: metaboliteSets.reactions,
      reactionsSets: reactionsSets,
      reactions: reactions
    });
    // Return information.
    return reactionsAttributesValues;
  }
  /**
  * Determines whether a metabolite passes filters.
  * @param {Object} parameters.filterSets Information about a metabolite's
  * reactions and sets that pass filters.
  * @returns {boolean} Whether the metabolite passes filters.
  */
  static determineMetabolitePassFilters(filterSets) {
    // Metabolite passes filters if it relates to at least a single reaction
    // that passes filters.
    return filterSets.reactions.length > 0;
  }
}
