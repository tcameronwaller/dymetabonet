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
* Functionality of utility for counting the metabolic entities that belong to
* sets according to their values of attributes.
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
*/
class Cardinality {

  /**
  * Determines cardinalities of entities in sets and prepares a summaries of
  * these sets' cardinalities.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.setsEntities Type of entities, metabolites or
  * reactions for sets' cardinalities.
  * @param {boolean} parameters.setsFilter Whether to filter sets' entities for
  * summary.
  * @param {Object<Object>} parameters.accessSetsReactions Information about
  * reactions' metabolites and sets that pass filtration by access method.
  * @param {Object<Object>} parameters.accessSetsMetabolites Information about
  * metabolites' reactions and sets that pass filtration by access method.
  * @param {Object<Object>} parameters.filterSetsReactions Information about
  * reactions' metabolites and sets that pass filtration by filter method.
  * @param {Object<Object>} parameters.filterSetsMetabolites Information about
  * metabolites' reactions and sets that pass filtration by filter method.
  * @param {Object<string>} parameters.setsSearches Searches to filter sets'
  * summaries.
  * @param {Object<Object<string>>} parameters.setsSorts Specifications to sort
  * sets' summaries.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @returns {Object} Cardinalities of entities in sets and summaries of these
  * sets' cardinalities.
  */
  static determineSetsCardinalitiesSummaries({setsEntities, setsFilter, accessSetsReactions, accessSetsMetabolites, filterSetsReactions, filterSetsMetabolites, setsSearches, setsSorts, compartments, processes} = {}) {
    // Determine sets' cardinalities.
    var setsCardinalities = Cardinality.determineSetsCardinalities({
      setsEntities: setsEntities,
      setsFilter: setsFilter,
      accessSetsReactions: accessSetsReactions,
      accessSetsMetabolites: accessSetsMetabolites,
      filterSetsReactions: filterSetsReactions,
      filterSetsMetabolites: filterSetsMetabolites
    });
    // Prepare summaries of sets' cardinalities.
    var setsSummaries = Cardinality.prepareSetsSummaries({
      setsCardinalities: setsCardinalities,
      setsSearches: setsSearches,
      setsSorts: setsSorts,
      compartments: compartments,
      processes: processes
    });
    // Compile information.
    var setsCardinalitiesSummaries = {
      setsCardinalities: setsCardinalities,
      setsSummaries: setsSummaries
    };
    // Return information.
    return setsCardinalitiesSummaries;
  }

  // Master control of procedure to count set cardinality.

  /**
  * Determines cardinalities of entities in sets for all values of all
  * attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.setsEntities Type of entities, metabolites or
  * reactions for sets' cardinalities.
  * @param {boolean} parameters.setsFilter Whether to filter sets' entities for
  * summary.
  * @param {Object<Object>} parameters.accessSetsReactions Information about
  * reactions' metabolites and sets that pass filtration by access method.
  * @param {Object<Object>} parameters.accessSetsMetabolites Information about
  * metabolites' reactions and sets that pass filtration by access method.
  * @param {Object<Object>} parameters.filterSetsReactions Information about
  * reactions' metabolites and sets that pass filtration by filter method.
  * @param {Object<Object>} parameters.filterSetsMetabolites Information about
  * metabolites' reactions and sets that pass filtration by filter method.
  * @returns {Object<Object<number>>} Cardinalities of entities in sets by
  * attributes and values.
  */
  static determineSetsCardinalities({setsEntities, setsFilter, accessSetsReactions, accessSetsMetabolites, filterSetsReactions, filterSetsMetabolites} = {}) {
    // Determine for which type of entities to count sets' cardinalities.
    if (setsEntities === "metabolites") {
      // Entities of interest are metabolites.
      // Determine whether to consider filters in sets' cardinalities.
      if (setsFilter) {
        // Filter selection is true.
        // Consider only entities and their attributes that pass filters.
        var entitiesSets = filterSetsMetabolites;
      } else {
        // Filter selection is false.
        // Consider all accessible entities.
        var entitiesSets = accessSetsMetabolites;
      }
    } else if (setsEntities === "reactions") {
      // Entities of interest are reactions.
      // Determine whether to consider filters in sets' cardinalities.
      if (setsFilter) {
        // Filter selection is true.
        // Consider only entities and their attributes that pass filters.
        var entitiesSets = filterSetsReactions;
      } else {
        // Filter selection is false.
        // Consider all accessible entities.
        var entitiesSets = accessSetsReactions;
      }
    }
    // There are 3 dimensions of information within records for entities' values
    // of attributes.
    // Dimension 1 includes the records for entities.
    // Dimension 2 includes the attributes for each entity.
    // Dimension 3 includes the values of each attribute.
    // Collect counts of entities with each value of each attribute.
    // Iterate separately across entities, attributes, and values.
    // Each iteration only needs access to information about its dimension.
    return Cardinality.collectEntitiesAttributesValues(entitiesSets);
  }
  /**
  * Collects cardinalities across entities.
  * @param {Object<Object>} entitiesSets Information about entities' attribution
  * to sets.
  * @returns {Object<Object<number>>} Cardinalities of entities in sets by
  * attributes and values.
  */
  static collectEntitiesAttributesValues(entitiesSets) {
    // Iterate on entities.
    var entitiesIdentifiers = Object.keys(entitiesSets);
    return entitiesIdentifiers
    .reduce(function (entitiesCollection, entityIdentifier) {
      // Access information about entity.
      var entityRecord = entitiesSets[entityIdentifier];
      // Collect counts of entities with each value of each attribute.
      var attributesCollection = Cardinality.collectAttributesValues({
        entityRecord: entityRecord,
        entitiesCollection: entitiesCollection
      });
      // Include information for entity within the collection.
      return attributesCollection;
    }, {});
  }
  /**
  * Collects cardinalities across attributes of a single entity.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.entityRecord Information about an entity's
  * attribution to sets.
  * @param {Object<Object<number>>} parameters.entitiesCollection
  * Cardinalities of entities in sets by attributes and values.
  * @returns {Object<Object<number>>} Cardinalities of entities in sets by
  * attributes and values.
  */
  static collectAttributesValues({entityRecord, entitiesCollection} = {}) {
    // Determine attributes in entity's record.
    var attributes = Object.keys(entityRecord).filter(function (key) {
      return (key === "compartments" || key === "processes");
    });
    // Iterate on attributes.
    return attributes.reduce(function (attributesCollection, attribute) {
      // Determine attribute record.
      var attributeRecord = entityRecord[attribute];
      // Collect counts of entities with each value of the attribute.
      if (attributesCollection.hasOwnProperty(attribute)) {
        // Collection has a record for the current attribute.
        // Preserve existing records in the collection.
        var previousValuesCollection = Object
        .assign({}, attributesCollection[attribute]);
      } else {
        // Collection does not have a record for the current attribute.
        // Create a new record.
        var previousValuesCollection = {};
      }
      var currentValuesCollection = Cardinality.collectValues({
        attributeRecord: attributeRecord,
        previousValuesCollection: previousValuesCollection
      });
      // Include information from attribute record within the collection.
      var novelAttributeRecord = {
        [attribute]: currentValuesCollection
      };
      var novelAttributesCollection = Object
      .assign({}, attributesCollection, novelAttributeRecord);
      return novelAttributesCollection;
    }, entitiesCollection);
  }
  /**
  * Collects cardinalities across values.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.attributeRecord Information about values
  * of a single attribute.
  * @param {Object<number>} parameters.previousValuesCollection Cardinalities of
  * entities in sets by values.
  * @returns {Object<number>} Cardinalities of entities in sets by values.
  */
  static collectValues({attributeRecord, previousValuesCollection} = {}) {
    // Determine values of attribute in entity record.
    var values = attributeRecord;
    // Iterate on values.
    return values.reduce(function (valuesCollection, value) {
      // Collect counts of entities with each value.
      if (valuesCollection.hasOwnProperty(value)) {
        // Collection has a record for the current value.
        // Increment count in the record from the collection.
        var count = valuesCollection[value] + 1;
      } else {
        // Collection does not have a record for the current
        // attribute.
        // Initialize count in a new record.
        var count = 1;
      }
      var novelValueRecord = {
        [value]: count
      };
      var currentValuesCollection = Object
      .assign({}, valuesCollection, novelValueRecord);
      return currentValuesCollection;
    }, previousValuesCollection);
  }

  // Master control of procedure to prepare summary of sets' cardinalities.

  /**
  * Creates initial specifications to sort sets' summaries.
  * @returns {Object<Object<string>>} Specifications to sort sets' summaries.
  */
  static createInitialSetsSorts() {
    return {
      processes: {
        criterion: "count", // or "name"
        order: "descend" // or "ascend"
      },
      compartments: {
        criterion: "count",
        order: "descend"
      }
    };
  }
  /**
  * Creates initial searches to filter sets' summaries.
  * @returns {Object<string>} Searches to filter sets' summaries.
  */
  static createInitialSetsSearches() {
    return {
      processes: "",
      compartments: ""
    };
  }
  /**
  * Prepares summaries of sets' cardinalities.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object<number>>} parameters.setsCardinalities Cardinalities
  * of entities in sets by attributes and values.
  * @param {Object<string>} parameters.setsSearches Searches to filter sets'
  * summaries.
  * @param {Object<Object<string>>} parameters.setsSorts Specifications to sort
  * sets' summaries.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @returns {Object<Array<Object>>} Summaries of sets' cardinalities.
  */
  static prepareSetsSummaries({setsCardinalities, setsSearches, setsSorts, compartments, processes} = {}) {
    // Create sets' summaries.
    var setsSummaries = Cardinality.createSetsSummaries(setsCardinalities);
    // Filter sets' summaries.
    var filterSetsSummaries = Cardinality.filterSetsSummaries({
      setsSummaries: setsSummaries,
      setsSearches: setsSearches,
      compartments: compartments,
      processes: processes
    });
    // Sort sets' summaries.
    var sortSetsSummaries = Cardinality.sortSetsSummaries({
      setsSummaries: filterSetsSummaries,
      setsSorts: setsSorts,
      compartments: compartments,
      processes: processes
    });
    return sortSetsSummaries;
  }
  /**
  * Creates summaries of sets' cardinalities.
  * @param {Object<Object<number>>} setsCardinalities Cardinalities of entities
  * in sets by attributes and values.
  * @returns {Object<Array<Object>>} Summaries of sets' cardinalities.
  */
  static createSetsSummaries(setsCardinalities) {
    // Prepare records for attributes.
    var attributes = Object.keys(setsCardinalities);
    return attributes.reduce(function (collection, attribute) {
      // Access attribute's values.
      var values = Object.keys(setsCardinalities[attribute]);
      // Determine maximal count of sets for attribute's values.
      var maximum = values.reduce(function (maximum, value) {
        // Access count of set for attribute's value.
        var count = setsCardinalities[attribute][value];
        return Math.max(maximum, count);
      }, 0);
      // Create records for values.
      var valuesRecords = values.map(function (value) {
        // Access count of set for attribute's value.
        var count = setsCardinalities[attribute][value];
        // Create record.
        // Return record.
        return {
          attribute: attribute,
          count: count,
          value: value,
          maximum: maximum
        };
      });
      // Create entry.
      var entry = {
        [attribute]: valuesRecords
      };
      // Include entry in collection.
      return Object.assign(collection, entry);
    }, {});
  }
  /**
  * Filters sets' summaries.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<Object>>} parameters.setsSummaries Summaries of sets'
  * cardinalities.
  * @param {Object<string>} parameters.setsSearches Searches to filter sets'
  * summaries.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @returns {Object<Array<Object>>} Summaries of sets' cardinalities.
  */
  static filterSetsSummaries({setsSummaries, setsSearches, compartments, processes} = {}) {
    // Iterate on categories.
    var categories = Object.keys(setsSummaries);
    return categories.reduce(function (collection, category) {
      // Determine reference.
      if (category === "compartments") {
        var reference = compartments;
      } else if (category === "processes") {
        var reference = processes;
      }
      // Access category's records.
      var records = setsSummaries[category];
      // Filter records.
      var filterRecords = records.filter(function (record) {
        var name = reference[record.value].name.toLowerCase();
        return name.includes(setsSearches[category]);
      });
      if (filterRecords.length > 0) {
        var finalRecords = filterRecords;
      } else {
        var finalRecords = records;
      }
      // Create entry.
      var entry = {
        [category]: finalRecords
      };
      // Include entry in collection.
      return Object.assign(collection, entry);
    }, {});
  }
  /**
  * Sorts sets' summaries.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<Object>>} parameters.setsSummaries Summaries of sets'
  * cardinalities.
  * @param {Object<Object<string>>} parameters.setsSorts Specifications to sort
  * sets' summaries.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @returns {Object<Array<Object>>} Summaries of sets' cardinalities.
  */
  static sortSetsSummaries({setsSummaries, setsSorts, compartments, processes}) {
    // Iterate on categories.
    var categories = Object.keys(setsSummaries);
    return categories.reduce(function (collection, category) {
      // Determine reference.
      if (category === "compartments") {
        var reference = compartments;
      } else if (category === "processes") {
        var reference = processes;
      }
      // Determine appropriate value by which to sort records.
      if (setsSorts[category].criterion === "count") {
        var key = setsSorts[category].criterion;
      } else if (setsSorts[category].criterion === "name") {
        var key = "value";
      }
      // Access category's records.
      var records = setsSummaries[category];
      // Determine whether records exist.
      if (records.length > 0) {
        // Records exist.
        // Sort records.
        var sortRecords = General.sortArrayRecords({
          array: records,
          key: key,
          order: setsSorts[category].order,
          reference: reference,
        });
      } else {
        // Records do not exist.
        var sortRecords = records;
      }
      // Create entry.
      var entry = {
        [category]: sortRecords
      };
      // Include entry in collection.
      return Object.assign(collection, entry);
    }, {});
  }

  // TODO: I don't need the increment anymore...

  /**
  * Increments counts of cardinalities of sets in set summary in their
  * current order.
  * @returns {Array<Object<Array<Object>>>} sortSetsSummary Basic information
  * for set summary in sort order.
  * @returns {Array<Object<Array<Object>>>} Summary of sets of entities with
  * information about cardinalities, incremental sums, and total sums, with
  * organization by attributes and values and with records in ascending order.
  */
  static incrementSetsSummary(sortSetsSummary) {
    return sortSetsSummary.map(function (attributeRecord) {
      var incrementalValues = attributeRecord
      .values
      .reduce(function (collection, record, index) {
        // Calculate incremental count.
        if (index > 0) {
          // Current record is not the first of the collection.
          // Increment the magnitude on the base from the previous
          // record.
          var base = collection[index - 1].base + collection[index - 1].count;
        } else {
          // Current record is the first of the collection.
          // Initialize the increment at zero.
          var base = 0;
        }
        // The only value to change in the record is the base.
        var newBase = {
          base: base
        };
        // Copy existing values in the record and introduce new
        // value.
        var newRecord = Object.assign({}, record, newBase);
        return [].concat(collection, newRecord);
      }, []);
      // Determine total sum of counts of all values of the attribute.
      var total = incrementalValues[incrementalValues.length - 1].base +
      incrementalValues[incrementalValues.length - 1].count;
      var incrementalTotalValues = incrementalValues
      .map(function (record) {
        var newTotal = {
          total: total
        };
        // Copy existing values in the record and introduce new value.
        var newRecord = Object.assign({}, record, newTotal);
        return newRecord;
      });
      var newValues = {
        values: incrementalTotalValues
      };
      // Copy existing values in the record and introduce new value.
      return Object.assign({}, attributeRecord, newValues);
    });
  }
}
