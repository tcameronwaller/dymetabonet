/**
* Functionality of utility for counting the metabolic entities that belong to
* sets according to their values of attributes.
* This class does not store any attributes and does not require instantiation.
* This class stores methods for external utility.
*/
class Cardinality {
  // Master control of procedure to count set cardinality.

  /**
  * Determines cardinalities of entities in sets for all values of all
  * attributes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.setsEntities Selection of type of entities for
  * sets' cardinalities.
  * @param {boolean} parameters.setsFilter Selection of whether to filter sets'
  * entities for summary.
  * @param {Array<Object>} parameters.setsCurrentReactions Information about
  * reactions' metabolites and sets that pass filters.
  * @param {Array<Object>} parameters.setsCurrentMetabolites Information about
  * metabolites' reactions and sets that pass filters.
  * @param {Array<Object>} parameters.setsTotalReactions Information about all
  * reactions' metabolites and sets.
  * @param {Array<Object>} parameters.setsTotalMetabolites Information about all
  * metabolites' reactions and sets.
  * @returns {Object<Object<number>>} Cardinalities of entities in sets by
  * attributes and values.
  */
  static determineSetsCardinalities({
    setsEntities,
    setsFilter,
    setsCurrentReactions,
    setsCurrentMetabolites,
    setsTotalReactions,
    setsTotalMetabolites
  } = {}) {
    // Determine for which type of entities to count sets' cardinalities.
    if (setsEntities === "metabolites") {
      // Entities of interest are metabolites.
      // Determine whether to consider filters in sets' cardinalities.
      if (setsFilter) {
        // Filter selection is true.
        // Consider only entities and their attributes that pass filters.
        var setsEntities = setsCurrentMetabolites;
      } else {
        // Filter selection is false.
        // Consider all entities.
        var setsEntities = setsTotalMetabolites;
      }
    } else if (setsEntities === "reactions") {
      // Entities of interest are reactions.
      // Determine whether to consider filters in sets' cardinalities.
      if (setsFilter) {
        // Filter selection is true.
        // Consider only entities and their attributes that pass filters.
        var setsEntities = setsCurrentReactions;
      } else {
        // Filter selection is false.
        // Consider all entities.
        var setsEntities = setsTotalReactions;
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
    return Cardinality.collectEntitiesAttributesValues(setsEntities);
  }
  /**
  * Collects cardinalities across entities.
  * @param {Array<Object>} setsEntities Information about entities' attribution
  * to sets.
  * @returns {Object<Object<number>>} Cardinalities of entities in sets by
  * attributes and values.
  */
  static collectEntitiesAttributesValues(setsEntities) {
    // Iterate on entities.
    return setsEntities.reduce(function (entitiesCollection, entityRecord) {
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

  // Master control of procedure to prepare summary of set cardinality.

  /**
  * Prepares summary of cardinalities of sets of entities.
  * @param {Object<Object<number>>} setsCardinalities Cardinalities of entities
  * in sets by attributes and values.
  * @returns {Array<Object<Array<Object>>>} Summary of sets of entities with
  * information about cardinalities, incremental sums, and total sums, with
  * organization by attributes and values and with records in ascending order.
  */
  static prepareSetsSummary(setsCardinalities) {
    // Prepare the set summary for visual representation.
    // Organize the basic information of sets cardinalities by attributes and
    // values.
    // Include information about selections of attributes and values.
    var basicSetsSummary = Cardinality.organizeSetsSummary(setsCardinalities);
    // Sort attribute values by increasing cardinality counts.
    var sortSetsSummary = Cardinality.sortSetsSummary(basicSetsSummary);
    // Calculate incremental counts in set summary.
    // These sums are necessary for positions of bar stacks.
    var incrementSetsSummary = Cardinality
    .incrementSetsSummary(sortSetsSummary);
    return incrementSetsSummary;
  }
  /**
  * Organizes basic information in set summary.
  * @param {Object<Object<number>>} setsCardinalities Cardinalities of entities
  * in sets by attributes and values.
  * @returns {Array<Object<Array<Object>>>} Summary of sets of entities with
  * information about cardinalities with organization by attributes and values.
  */
  static organizeSetsSummary(setsCardinalities) {
    // Prepare records for attributes.
    var attributes = Object.keys(setsCardinalities);
    return attributes.map(function (attribute) {
      // Prepare records for values.
      var values = Object.keys(setsCardinalities[attribute]);
      var valueRecords = values.map(function (value) {
        var count = setsCardinalities[attribute][value];
        return {
          attribute: attribute,
          count: count,
          value: value
        };
      });
      return {
        attribute: attribute,
        values: valueRecords
      };
    });
  }
  /**
  * Sorts records for attributes and values within set summary.
  * @param {Array<Object<Array<Object>>>} basicSetsSummary Basic information for
  * sets' summary.
  * @returns {Array<Object<Array<Object>>>} Summary of sets of entities with
  * information about cardinalities with organization by attributes and values
  * and with records in ascending order.
  */
  static sortSetsSummary(basicSetsSummary) {
    // Sort records for attributes.
    var sortSetAttributes = basicSetsSummary
    .slice().sort(function (firstValue, secondValue) {
      // Sort attributes in custom order.
      var order = {
        compartments: 2,
        processes: 1
      };
      return order[firstValue.attribute] - order[secondValue.attribute];
    });
    return sortSetAttributes.map(function (attributeRecord) {
      // Sort records for values.
      var novelValues = attributeRecord
      .values.slice().sort(function (firstValue, secondValue) {
        return firstValue.count - secondValue.count;
      });
      var novelValuesRecords = {
        values: novelValues
      };
      // Copy existing values in the record and introduce new value.
      return Object.assign({}, attributeRecord, novelValuesRecords);
    });
  }
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
