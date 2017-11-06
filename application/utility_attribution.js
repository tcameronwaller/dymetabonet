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
  * @param {Object<Array<string>>} parameters.setsFilters Sets' filters by
  * attributes' values.
  * @param {Object<Object>} parameters.totalReactionsSets Information about all
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.totalMetabolitesSets Information about
  * all metabolites' reactions and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Information about current entities' sets.
  */
  static determineCurrentEntitiesSets({
    setsFilters, totalReactionsSets, totalMetabolitesSets, reactions
  } = {}) {
    // The filtration procedures are computationally expensive.
    // Determine whether there are any selections of attributes' values to apply
    // as filters.
    if (
      setsFilters.processes.length < 1 && setsFilters.compartments.length < 1
    ) {
      // There are not any selections of attributes' values to apply as filters.
      // Copy information about entities' sets.
      var reactionsSets = {
        access: General.copyValueJSON(totalReactionsSets),
        filter: General.copyValueJSON(totalReactionsSets)
      };
      var metabolitesSets = {
        access: General.copyValueJSON(totalMetabolitesSets),
        filter: General.copyValueJSON(totalMetabolitesSets)
      };
    } else {
      // There are selections of attributes' values to apply as filters.
      // Filter entities and their values of attributes.
      // Filter against all entities and their sets.
      // Filter information about reactions' metabolites and sets.
      var reactionsSets = Attribution
      .filterReactionsMetabolitesAttributesValues({
        setsFilters: setsFilters,
        totalReactionsSets: totalReactionsSets,
        reactions: reactions
      });
      // Filter information about metabolites' reactions and sets.
      var metabolitesSets = Attribution
      .filterMetabolitesReactionsAttributesValues({
        totalMetabolitesSets: totalMetabolitesSets,
        accessReactionsSets: reactionsSets.access,
        filterReactionsSets: reactionsSets.filter,
        reactions: reactions
      });
    }
    // Compile information.
    var currentEntitiesSets = {
      accessReactionsSets: reactionsSets.access,
      accessMetabolitesSets: metabolitesSets.access,
      filterReactionsSets: reactionsSets.filter,
      filterMetabolitesSets: metabolitesSets.filter
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
  * @returns {Object<Object>} Information about reactions' metabolites and sets.
  */
  static collectReactionsMetabolitesAttributesValues(reactions) {
    // Iterate on reactions.
    var reactionsIdentifiers = Object.keys(reactions);
    return reactionsIdentifiers
    .reduce(function (collection, reactionIdentifier) {
      // Access information about reaction.
      var reaction = reactions[reactionIdentifier];
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
      var information = {
        identifier: identifier,
        reaction: identifier,
        metabolites: metabolites,
        compartments: compartments,
        processes: processes
      };
      // Create record.
      var record = {
        [identifier]: information
      };
      // Include record in collection.
      return Object.assign(collection, record);
    }, {});
  }
  /**
  * Collects for all metabolites information about all the reactions in which
  * each metabolite participates and the sets to which each metabolite belongs
  * by all its values of attributes.
  * @param {Object<Object>} reactionsSets Information about reactions'
  * metabolites and sets.
  * @param {Object<Object>} reactions Information about reactions.
  * @returns {Object<Object>} Information about metabolites' reactions and sets.
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
    return metabolitesIdentifiers
    .reduce(function (collection, metaboliteIdentifier) {
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
      var novelInformation = {
        identifier: metaboliteIdentifier,
        metabolite: metaboliteIdentifier
      };
      var information = Object
      .assign({}, reactionsAttributesValues, novelInformation);
      // Create record.
      var record = {
        [metaboliteIdentifier]: information
      };
      // Include record in collection.
      return Object.assign(collection, record);
    }, {});
  }
  /**
  * Collects reactions in which a metabolite participates and values of
  * attributes that the metabolite inherits from these reactions.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a metabolite.
  * @param {Array<string>} parameters.reactionsIdentifiers Identifiers of
  * reactions.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
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
        // Include information in collection.
        var currentReactions = []
        .concat(collection.reactions, reactionIdentifier);
        var currentCompartments = []
        .concat(collection.compartments, inheritance.compartments);
        var currentProcesses = []
        .concat(collection.processes, inheritance.processes);
        return {
          reactions: currentReactions,
          compartments: currentCompartments,
          processes: currentProcesses
        };
      } else {
        // Reaction does not pass filters, or metabolite's participation in the
        // reaction does not pass filters.
        return collection;
      }
    }, initialCollection);
    // Collect unique values of attributes.
    return {
      reactions: General.collectUniqueElements(totalAttributes.reactions),
      compartments: General.collectUniqueElements(totalAttributes.compartments),
      processes: General.collectUniqueElements(totalAttributes.processes)
    };
  }
  /**
  * Determines whether a reaction passes any filters and whether a metabolite's
  * participation in the reaction passes any filters.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.metaboliteIdentifier Identifier of a metabolite.
  * @param {string} parameters.reactionIdentifier Identifier of a reaction.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @returns {boolean} Whether the reaction passes any filters and whether
  * metabolite's participation in the reaction passes any filters.
  */
  static determineMetaboliteReactionPassClaim({
    metaboliteIdentifier, reactionIdentifier, reactionsSets
  } = {}) {
    // Determine whether reaction passes filters.
    var pass = reactionsSets.hasOwnProperty(reactionIdentifier);
    if (pass) {
      // Access information about reaction's sets.
      var reactionSets = reactionsSets[reactionIdentifier];
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
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object} Values of attributes that a metabolite inherits from the
  * reaction in which it participates.
  */
  static collectMetaboliteReactionAttributesValues({
    metaboliteIdentifier, reactionIdentifier, reactionsSets, reactions
  } = {}) {
    // Access information about reaction.
    var reaction = reactions[reactionIdentifier];
    var reactionSets = reactionsSets[reactionIdentifier];
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

  // Management of selections and filters.

  /**
  * Creates initial, empty, sets' filters.
  * @returns {Object<Array<string>>} Sets' filters by attributes' values.
  */
  static createInitialSetsFilters() {
    return {
      processes: [],
      compartments: []
    };
  }
  /**
  * Records a set's selection for filters.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Value of set's attribute.
  * @param {string} parameters.attribute Name of set's attribute.
  * @param {Object<Array<string>>} parameters.setsFilters Sets' filters by
  * attributes' values.
  * @returns {Object<Array<string>>} Sets' filters by attributes' values.
  */
  static recordSetSelectionFilters({
    value, attribute, setsFilters
  } = {}) {
    // Determine whether the attribute is valid.
    if (setsFilters.hasOwnProperty(attribute)) {
      // Attribute is valid.
      // Determine whether previous filters include the attribute's value.
      var match = Attribution.determineSetsFilter({
        value: value,
        attribute: attribute,
        setsFilters: setsFilters
      });
      if (match) {
        // Previous filters include the attribute's value.
        // Remove the attribute's value from filters.
        var currentValues = setsFilters[attribute]
        .filter(function (filterValue) {
          return !(filterValue === value);
        });
        var record = {
          [attribute]: currentValues
        };
        return Object.assign({}, setsFilters, record);
      } else {
        // Previous filters do not include the attribute's value.
        // Include a filter for the attribute's value.
        var currentValues = setsFilters[attribute].concat(value);
        var record = {
          [attribute]: currentValues
        };
        return Object.assign({}, setsFilters, record);
      }
    } else {
      // Attribute is invalid.
      // Preserve filters.
      return setsFilters;
    }
  }
  /**
  * Determines whether sets' filters include an attribute's value.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Value of set's attribute.
  * @param {string} parameters.attribute Name of set's attribute.
  * @param {Object<Array<string>>} parameters.setsFilters Sets' filters by
  * attributes' values.
  * @returns {boolean} Whether sets' filters include the attribute's value.
  */
  static determineSetsFilter({value, attribute, setsFilters} = {}) {
      // Determine whether attribute's values include the value.
      return setsFilters[attribute].includes(value);
  }

  // Filtration of reactions.

  /**
  * Filters for each reaction information about the metabolites that participate
  * and the sets to which the entity belongs by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<string>>} parameters.setsFilters Sets' filters by
  * attributes' values.
  * @param {Object<Object>} parameters.totalReactionsSets Information about all
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object<Object>} Information about reactions' metabolites
  * and sets.
  */
  static filterReactionsMetabolitesAttributesValues({
    setsFilters, totalReactionsSets, reactions
  } = {}) {
    // Filter reactions, their metabolites, and their values of attributes.
    // Initialize collection.
    var initialCollection = {
      access: {},
      filter: {}
    };
    // Iterate on reactions' records.
    var reactionsIdentifiers = Object.keys(totalReactionsSets);
    return reactionsIdentifiers
    .reduce(function (collection, reactionIdentifier) {
      // Access information about reaction.
      var reaction = reactions[reactionIdentifier];
      var reactionSets = totalReactionsSets[reactionIdentifier];
      // Filter and collect reactions and their values of attributes.
      // The filtration method for access retains processes or compartments by
      // whether any values of the other reciprocal attribute pass filters.
      // The method retains all of a reaction's metabolites.
      // The method retains reactions with any metabolites and any processes or
      // compartments that pass filters.
      // access only is 37 seconds for either matrix or cytosol...
      var accessReactionsSets = Attribution.filterCollectReactionsSets({
        method: "access",
        setsFilters: setsFilters,
        reactionSets: reactionSets,
        reaction: reaction,
        collection: collection.access
      });
      // The filtration method for filter retains process and compartments that
      // pass filters.
      // The method retains a reaction's metabolites that participate in
      // contexts that pass filters.
      // The method retains reactions with any metabolites, and any processes,
      // and any compartments that pass filters.
      // filter only is 1 second for matrix, 12 seconds for cytosol...
      // Filter method is much more efficient than access method... ???
      var filterReactionsSets = Attribution.filterCollectReactionsSets({
        method: "filter",
        setsFilters: setsFilters,
        reactionSets: reactionSets,
        reaction: reaction,
        collection: collection.filter
      });
      // Compile information.
      // Include information in collection.
      return {
        access: accessReactionsSets,
        filter: filterReactionsSets
      };
    }, initialCollection);
  }
  /**
  * Filters a reaction's information about the metabolites that participate
  * and the sets to which the entity belongs by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.method Method, access or filter, for filtration
  * of reactions and values of attributes.
  * @param {Object<Array<string>>} parameters.setsFilters Sets' filters by
  * attributes' values.
  * @param {Object} parameters.reactionSets Information about a reaction's
  * metabolites and sets.
  * @param {Object} parameters.reaction Information about a reaction.
  * @param {Object<Object>} parameters.collection Information about reactions'
  * metabolites and sets.
  * @returns {Object<Object>} Information about reactions' metabolites and sets.
  */
  static filterCollectReactionsSets({
    method, setsFilters, reactionSets, reaction, collection
  } = {}) {
    // Determine which method to follow for filtration.
    if (method === "access") {
      // Filter reaction's values of attributes.
      var filterSets = Attribution.filterAccessReactionAttributesValues({
        setsFilters: setsFilters,
        reactionSets: reactionSets,
        reaction: reaction
      });
      // Determine whether the reaction passes filters.
      var pass = Attribution.determineAccessReactionPassFilters(filterSets);
    } else if (method === "filter") {
      // Filter reaction's values of attributes.
      var filterSets = Attribution.filterReactionMetabolitesAttributesValues({
        setsFilters: setsFilters,
        reactionSets: reactionSets,
        reaction: reaction
      });
      // Determine whether the reaction passes filters.
      var pass = Attribution.determineReactionPassFilters(filterSets, reaction);
    }
    if (pass) {
      // Reaction passes filters.
      // Compile information.
      // Replace previous information by current information.
      var information = Object.assign({}, reactionSets, filterSets);
      // Create record.
      var record = {
        [reactionSets.identifier]: information
      };
      // Include record in collection.
      return Object.assign(collection, record);
    } else {
      // Reaction does not pass filters.
      // Omit reaction from the collection.
      return collection;
    }
  }
  /**
  * Filters a reaction's information about the sets to which the entity belongs
  * by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<string>>} parameters.setsFilters Sets' filters by
  * attributes' values.
  * @param {Object} parameters.reactionSets Information about a reaction's
  * metabolites and sets.
  * @param {Object} parameters.reaction Information about a reaction.
  * @returns {Object} Information about a reaction's metabolites and sets that
  * pass filters.
  */
  static filterAccessReactionAttributesValues({
    setsFilters, reactionSets, reaction
  } = {}) {
    // Determine which of reaction's values of attributes to retain for
    // accessibility of sets.
    // Filter values of attributes reciprocally.
    var processes = Attribution.filterReciprocalAttributeValues({
      trialValues: reactionSets.processes,
      trialAttribute: "processes",
      qualifierValues: reactionSets.compartments,
      qualifierAttribute: "compartments",
      setsFilters: setsFilters
    });
    var compartments = Attribution.filterReciprocalAttributeValues({
      trialValues: reactionSets.compartments,
      trialAttribute: "compartments",
      qualifierValues: reactionSets.processes,
      qualifierAttribute: "processes",
      setsFilters: setsFilters
    });
    // Do not filter reaction's metabolites.
    var metabolites = reactionSets.metabolites.slice();
    // It is necessary to retain metabolites to retain accessibility of sets.
    // Compile information.
    return {
      metabolites: metabolites,
      processes: processes,
      compartments: compartments
    };
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
  * @param {Object<Array<string>>} parameters.setsFilters Sets' filters by
  * attributes' values.
  * @returns {Array<string>} Attribute's values that pass filters.
  */
  static filterReciprocalAttributeValues({
    trialValues,
    trialAttribute,
    qualifierValues,
    qualifierAttribute,
    setsFilters
  } = {}) {
    // Determine values of qualifier attribute that pass filters.
    var filterQualifiers = Attribution.filterAttributeValues({
      values: qualifierValues,
      attribute: qualifierAttribute,
      setsFilters: setsFilters
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
  * @param {Object<Array<string>>} parameters.setsFilters Sets' filters by
  * attributes' values.
  * @returns {Array<string>} Attribute's values that pass filters.
  */
  static filterAttributeValues({
    values, attribute, setsFilters
  } = {}) {
    // Determine if there is a filter for the attribute.
    if (setsFilters[attribute].length > 0) {
      // There is a filter for the attribute.
      // Filter the attribute's values.
      var filterValues = values.filter(function (value) {
        return setsFilters[attribute].includes(value);
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
  * @param {Object} filterSets Information about a reaction's metabolites and
  * sets that pass filters.
  * @returns {boolean} Whether the reaction passes filters.
  */
  static determineAccessReactionPassFilters(filterSets) {
    var metabolites = filterSets.metabolites.length > 0;
    var processes = filterSets.processes.length > 0;
    var compartments = filterSets.compartments.length > 0;
    return (metabolites && (processes || compartments));
  }
  /**
  * Filters a reaction's information about the metabolites that participate
  * and the sets to which the entity belongs by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<string>>} parameters.setsFilters Sets' filters by
  * attributes' values.
  * @param {Object} parameters.reactionSets Information about a reaction's
  * metabolites and sets.
  * @param {Object} parameters.reaction Information about a reaction.
  * @returns {Object} Information about a reaction's metabolites and sets that
  * pass filters.
  */
  static filterReactionMetabolitesAttributesValues({
    setsFilters, reactionSets, reaction
  } = {}) {
    // Determine reaction's values of relevant attributes that pass filters.
    // Filter processes.
    var processes = Attribution.filterAttributeValues({
      values: reactionSets.processes,
      attribute: "processes",
      setsFilters: setsFilters
    });
    // Filter compartments.
    var compartments = Attribution.filterAttributeValues({
      values: reactionSets.compartments,
      attribute: "compartments",
      setsFilters: setsFilters
    });
    // Filter metabolites.
    var metabolites = Attribution.filterReactionMetabolites({
      metabolites: reactionSets.metabolites,
      compartments: compartments,
      participants: reaction.participants
    });
    // Compile information.
    return {
      metabolites: metabolites,
      compartments: compartments,
      processes: processes
    };
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
  * @param {Object} filterSets Information about a reaction's metabolites and
  * sets that pass filters.
  * @returns {boolean} Whether the reaction passes filters.
  */
  static determineReactionPassFilters(filterSets) {
    // Combinations of filters against different values of the same attribute
    // use OR logic, since any value of the attribute must pass filters.
    // Combinations of filters against different attributes use AND logic,
    // since all attributes must pass filters.
    var metabolites = filterSets.metabolites.length > 0;
    var processes = filterSets.processes.length > 0;
    var compartments = filterSets.compartments.length > 0;
    return (metabolites && compartments && processes);
  }

  // Filtration of metabolites.

  /**
  * Filters for each metabolite information about the reactions in which it
  * participates and the sets to which the entity belongs by its values of
  * attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.totalMetabolitesSets Information about all
  * metabolites' reactions and sets.
  * @param {Object<Object>} parameters.accessReactionsSets Information about
  * reactions' metabolites and sets that pass filtration by access method.
  * @param {Object<Object>} parameters.filterReactionsSets Information about
  * reactions' metabolites and sets that pass filtration by filter method.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object<Object>} Information about metabolites' reactions and sets.
  */
  static filterMetabolitesReactionsAttributesValues({
    totalMetabolitesSets, accessReactionsSets, filterReactionsSets, reactions
  } = {}) {
    // Filter metabolites, their reactions, and their values of attributes.
    // Initialize collection.
    var initialCollection = {
      access: {},
      filter: {}
    };
    // Iterate on metabolites' records.
    var metabolitesIdentifiers = Object.keys(totalMetabolitesSets);
    return metabolitesIdentifiers
    .reduce(function (collection, metaboliteIdentifier) {
      // Access information about metabolite.
      var metaboliteSets = totalMetabolitesSets[metaboliteIdentifier];
      // Filter and collect metabolites and their values of attributes.
      var accessMetabolitesSets = Attribution.filterCollectMetabolitesSets({
        metaboliteSets: metaboliteSets,
        reactionsSets: accessReactionsSets,
        reactions: reactions,
        collection: collection.access
      });
      var filterMetabolitesSets = Attribution.filterCollectMetabolitesSets({
        metaboliteSets: metaboliteSets,
        reactionsSets: filterReactionsSets,
        reactions: reactions,
        collection: collection.filter
      });
      // Compile information.
      // Include information in collection.
      return {
        access: accessMetabolitesSets,
        filter: filterMetabolitesSets
      };
    }, initialCollection);
  }
  /**
  * Filters a reaction's information about the metabolites that participate
  * and the sets to which the entity belongs by its values of attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.method Method, access or filter, for filtration
  * of reactions and values of attributes.
  * @param {Object<Array<string>>} parameters.filters Values of attributes to
  * apply as filters.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @param {Object<Object>} parameters.collection Information about metabolites'
  * reactions and sets.
  * @returns {Object<Object>} Information about metabolites' reactions and sets.
  */
  static filterCollectMetabolitesSets({
    metaboliteSets, reactionsSets, reactions, collection
  } = {}) {
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
      // Compile information.
      // Replace previous information by current information.
      var information = Object.assign({}, metaboliteSets, filterSets);
      // Create record.
      var record = {
        [metaboliteSets.identifier]: information
      };
      // Include record in collection.
      return Object.assign(collection, record);
    } else {
      // Metabolite does not pass filters.
      // Omit metabolite from the collection.
      return collection;
    }
  }
  /**
  * Filters for a single metabolite information about the reactions in which it
  * participates and the sets to which the entity belongs by its values of
  * attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.metaboliteSets Information about a metabolite's
  * reactions and sets.
  * @param {Object<Object>} parameters.reactionsSets Information about
  * reactions' metabolites and sets.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {Object<Object>} Information about metabolites' reactions and sets
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
