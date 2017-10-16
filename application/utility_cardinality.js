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
  * @param {string} parameters.entities Current entities of interest.
  * @param {boolean} parameters.filter Current filter selection.
  * @param {Object} parameters.metabolites Records with information about
  * metabolites.
  * @param {Object} parameters.reactions Records with information about
  * reactions.
  * @param {Object} parameters.currentMetabolites Records with information
  * about metabolites and values of their attributes that pass filters.
  * @param {Object} parameters.currentReactions Records with information
  * about reactions and values of their attributes that pass filters.
  * @returns {Object<Object<number>>} Cardinalities of entities in sets by
  * attributes and values.
  */
  static determineSetsCardinalities({
    entities,
    filter,
    metabolites,
    reactions,
    currentMetabolites,
    currentReactions
  } = {}) {
    // Determine for which collection of entities to count cardinalities of
    // sets.
    if (entities === "metabolites") {
      // Entities of interest are metabolites.
      if (filter) {
        // Filter selection is true.
        // Consider only entities that pass current filters.
        var entitiesRecords = currentMetabolites;
      } else {
        // Filter selection is false.
        // Consider all entities.
        var entitiesRecords = metabolites;
      }
    } else if (entities === "reactions") {
      // Entities of interest are reactions.
      if (filter) {
        // Filter selection is true.
        // Consider only entities that pass current filters.
        var entitiesRecords = currentReactions;
      } else {
        // Filter selection is false.
        // Consider all entities.
        var entitiesRecords = reactions;
      }
    }
    // There are 3 dimensions of information within records for entities'
    // values of attributes.
    // Dimension 1 includes the records for entities.
    // Dimension 2 includes the attributes for each entity.
    // Dimension 3 includes the values of each attribute.
    // Collect counts of entities with each value of each attribute.
    // Iterate separately across entities, attributes, and values.
    // Each iteration only needs access to information about its dimension.
    return Cardinality.collectEntitiesAttributesValues({
      entitiesRecords: entitiesRecords
    });
  }
  /**
  * Collects cardinalities across entities.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.entitiesRecords Records with information about
  * entities and their values of attributes.
  * @returns {Object<Object<number>>} Cardinalities of entities in sets by
  * attributes and values.
  */
  static collectEntitiesAttributesValues({entitiesRecords} = {}) {
    // Iterate on entities.
    var entitiesIdentifiers = Object.keys(entitiesRecords);
    return entitiesIdentifiers
    .reduce(function (entitiesCollection, entityIdentifier) {
      var entityRecord = entitiesRecords[entityIdentifier];
      // Collect counts of entities with each value of each attribute.
      var attributesCollection = Cardinality
      .collectAttributesValues({
        entityRecord: entityRecord,
        entitiesCollection: entitiesCollection
      });
      // Include information from current entity within the
      // collection.
      return attributesCollection;
    }, {});
  }
  /**
  * Collects cardinalities across attributes of a single entity.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.entityRecord Record with values of attributes
  * for a single entity.
  * @param {Object<Object<number>>} parameters.entitiesCollection
  * Cardinalities of entities in sets by attributes and values.
  * @returns {Object<Object<number>>} Cardinalities of entities in sets by
  * attributes and values.
  */
  static collectAttributesValues({
    entityRecord,
    entitiesCollection
  } = {}) {
    // Determine attributes in entity record.
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
        var valuesCollection = Object
        .assign({}, attributesCollection[attribute]);
      } else {
        // Collection does not have a record for the current attribute.
        // Create a new record.
        var valuesCollection = {};
      }
      var newValuesCollection = Cardinality.collectValues({
        attributeRecord: attributeRecord,
        oldValuesCollection: valuesCollection
      });
      // Include information from current attribute record within the
      // collection.
      var newAttributeRecord = {
        [attribute]: newValuesCollection
      };
      var newAttributesCollection = Object
      .assign({}, attributesCollection, newAttributeRecord);
      return newAttributesCollection;
    }, entitiesCollection);
  }
  /**
  * Collects cardinalities across values.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.attributeRecord Record with values of
  * a single attribute.
  * @param {Object<number>} parameters.oldValuesCollection Collection across
  * values.
  * @returns {Object<number>} Cardinalities of sets by values.
  */
  static collectValues({
    attributeRecord,
    oldValuesCollection
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
      var newValueRecord = {
        [value]: count
      };
      var newValuesCollection = Object
      .assign({}, valuesCollection, newValueRecord);
      return newValuesCollection;
    }, oldValuesCollection);
  }

  // Master control of procedure to prepare summary of set cardinality.

  /**
  * Prepares summary of cardinalities of sets of entities.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.selections Selections of
  * attributes' values.
  * @param {Object<Object<number>>} parameters.setsCardinalities Cardinalities
  * of entities in sets by attributes and values.
  * @returns {Array<Object<Array<Object>>>} Summary of sets of entities with
  * information about cardinalities, selections of attributes' values,
  * incremental sums, and total sums, with organization by attributes and values
  * and with records in ascending order.
  */
  static prepareSetsSummary({selections, setsCardinalities} = {}) {
    // Prepare the set summary for visual representation.
    // Organize the basic information of sets cardinalities by attributes and
    // values.
    // Include information about selections of attributes and values.
    var basicSetsSummary = Cardinality.organizeSetsSummary({
      selections: selections,
      setsCardinalities: setsCardinalities
    });
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
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<string>>} parameters.selections Selections of
  * attributes' values.
  * @param {Object<Object<number>>} parameters.setsCardinalities Cardinalities
  * of entities in sets by attributes and values.
  * @returns {Array<Object<Array<Object>>>} Summary of sets of entities with
  * information about cardinalities and selections of attributes' values, with
  * organization by attributes and values.
  */
  static organizeSetsSummary({selections, setsCardinalities} = {}) {
    // Prepare records for attributes.
    var attributes = Object.keys(setsCardinalities);
    return attributes.map(function (attribute) {
      // Prepare records for values.
      var values = Object.keys(setsCardinalities[attribute]);
      var valueRecords = values.map(function (value) {
        var count = setsCardinalities[attribute][value];
        var selection = Attribution.determineSelectionMatch({
          value: value,
          attribute: attribute,
          selections: selections
        });
        return {
          attribute: attribute,
          count: count,
          value: value,
          selection: selection
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
  * @param {Array<Object<Array<Object>>>} basicSetsSummary Basic information
  * for set summary.
  * @returns {Array<Object<Array<Object>>>} Summary of sets of entities with
  * information about cardinalities and selections of attributes' values, with
  * organization by attributes and values and with records in ascending order.
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
  * information about cardinalities, selections of attributes' values,
  * incremental sums, and total sums, with organization by attributes and values
  * and with records in ascending order.
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
