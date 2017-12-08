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
  * @param {Object<Object>} parameters.accessReactionsSets Information about
  * reactions' metabolites and sets that pass filtration by access method.
  * @param {Object<Object>} parameters.accessMetabolitesSets Information about
  * metabolites' reactions and sets that pass filtration by access method.
  * @param {Object<Object>} parameters.filterReactionsSets Information about
  * reactions' metabolites and sets that pass filtration by filter method.
  * @param {Object<Object>} parameters.filterMetabolitesSets Information about
  * metabolites' reactions and sets that pass filtration by filter method.
  * @param {Object<Object<string>>} setsSorts Specifications to sort sets'
  * summaries.
  * @returns {Object} Cardinalities of entities in sets and summaries of these
  * sets' cardinalities.
  */
  static determineSetsCardinalitiesSummaries({
    setsEntities,
    setsFilter,
    accessReactionsSets,
    accessMetabolitesSets,
    filterReactionsSets,
    filterMetabolitesSets,
    setsSorts
  } = {}) {
    // Determine sets' cardinalities.
    var setsCardinalities = Cardinality.determineSetsCardinalities({
      setsEntities: setsEntities,
      setsFilter: setsFilter,
      accessReactionsSets: accessReactionsSets,
      accessMetabolitesSets: accessMetabolitesSets,
      filterReactionsSets: filterReactionsSets,
      filterMetabolitesSets: filterMetabolitesSets
    });
    // Prepare summaries of sets' cardinalities.
    var setsSummaries = Cardinality
    .prepareSetsSummaries(setsCardinalities, setsSorts);
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
  * @param {Object<Object>} parameters.accessReactionsSets Information about
  * reactions' metabolites and sets that pass filtration by access method.
  * @param {Object<Object>} parameters.accessMetabolitesSets Information about
  * metabolites' reactions and sets that pass filtration by access method.
  * @param {Object<Object>} parameters.filterReactionsSets Information about
  * reactions' metabolites and sets that pass filtration by filter method.
  * @param {Object<Object>} parameters.filterMetabolitesSets Information about
  * metabolites' reactions and sets that pass filtration by filter method.
  * @returns {Object<Object<number>>} Cardinalities of entities in sets by
  * attributes and values.
  */
  static determineSetsCardinalities({
    setsEntities,
    setsFilter,
    accessReactionsSets,
    accessMetabolitesSets,
    filterReactionsSets,
    filterMetabolitesSets
  } = {}) {
    // Determine for which type of entities to count sets' cardinalities.
    if (setsEntities === "metabolites") {
      // Entities of interest are metabolites.
      // Determine whether to consider filters in sets' cardinalities.
      if (setsFilter) {
        // Filter selection is true.
        // Consider only entities and their attributes that pass filters.
        var entitiesSets = filterMetabolitesSets;
      } else {
        // Filter selection is false.
        // Consider all accessible entities.
        var entitiesSets = accessMetabolitesSets;
      }
    } else if (setsEntities === "reactions") {
      // Entities of interest are reactions.
      // Determine whether to consider filters in sets' cardinalities.
      if (setsFilter) {
        // Filter selection is true.
        // Consider only entities and their attributes that pass filters.
        var entitiesSets = filterReactionsSets;
      } else {
        // Filter selection is false.
        // Consider all accessible entities.
        var entitiesSets = accessReactionsSets;
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
  static collectAttributesValues({
    entityRecord,
    entitiesCollection
  } = {}) {
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
  static collectValues({
    attributeRecord,
    previousValuesCollection
  } = {}) {
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
  * Prepares summaries of sets's cardinalities.
  * @param {Object<Object<number>>} setsCardinalities Cardinalities of entities
  * in sets by attributes and values.
  * @param {Object<Object<string>>} setsSorts Specifications to sort sets'
  * summaries.
  * @returns {Object<Array<Object>>} Summaries of sets' cardinalities.
  */
  static prepareSetsSummaries(setsCardinalities, setsSorts) {
    // Create sets' summaries.
    var setsSummaries = Cardinality.createSetsSummaries(setsCardinalities);
    // Sort sets' summaries.
    var sortSetsSummaries = Cardinality
    .sortSetsSummaries(setsSummaries, setsSorts);
    return sortSetsSummaries;
  }
  /**
  * Creates summary of sets' cardinalities.
  * @param {Object<Object<number>>} setsCardinalities Cardinalities of entities
  * in sets by attributes and values.
  * @returns {Object<Array<Object>>} Summaries of sets' cardinalities.
  */
  static createSetsSummaries(setsCardinalities) {
    // Prepare records for attributes.
    var attributes = Object.keys(setsCardinalities);
    return attributes.reduce(function (collection, attribute) {
      // Access attributes' values.
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
  * Sorts sets' summaries.
  * @param {Object<Array<Object>>} setsSummaries Summaries of sets'
  * cardinalities.
  * @param {Object<Object<string>>} setsSorts Specifications to sort sets'
  * summaries.
  * @returns {Object<Array<Object>>} Summaries of sets' cardinalities.
  */
  static sortSetsSummaries(setsSummaries, setsSorts) {
    var attributes = Object.keys(setsSummaries);
    return attributes.reduce(function (collection, attribute) {
      // Access information about attributes' values.
      var values = setsSummaries[attribute];
      // Determine appropriate sort function.
      // Sort records for values.
      var sortValues = General.sortArrayRecords({
        array: values,
        key: setsSorts[attribute].criterion,
        order: setsSorts[attribute].order
      });
      // Create entry.
      var entry = {
        [attribute]: sortValues
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
