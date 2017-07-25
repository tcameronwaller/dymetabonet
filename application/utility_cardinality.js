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
     * @param {boolean} parameters.filter Current filter selection.
     * @param {Array<Object>} parameters.currentEntitiesAttributes Attributes of
     * all entities that pass current filters.
     * @param {Array<Object>} parameters.allEntitiesAttributes Attributes of all
     * entities.
     * @returns {Object<Object<Object<number>>>} Cardinalities of sets by
     * entities, attributes, and values.
     */
    static determineSetsCardinalities({
                                         filter,
                                         currentEntitiesAttributes,
                                         allEntitiesAttributes
    } = {}) {
        // Determine which entities' attributes to consider for sets'
        // cardinalities.
        if (filter) {
            // Current filter selection is true.
            // Determine sets' cardinalities to represent all current filters
            // against entities's attributes.
            var entitiesAttributes = currentEntitiesAttributes;
        } else {
            // Current filter selection is false.
            // Determine sets' cardinalities to represent all entities's
            // attributes without regard to current filters.
            var entitiesAttributes = allEntitiesAttributes;
        }
        // There are 3 dimensions of information within the table for values of
        // attributes of entities.
        // Dimension 1 includes the individual entities.
        // Dimension 2 includes all attributes of each individual entity.
        // Dimension 3 includes all values of each attribute.
        // Collect counts of entities with each value of each attribute.
        // Iterate separately across entities, attributes, and values.
        // Each iteration only needs access to information about its dimension.
        return Cardinality.collectEntitiesAttributesValues({
            entitiesAttributes: entitiesAttributes
        });
    }
    /**
     * Collects cardinalities across entities.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<Object>} parameters.entitiesAttributes Attributes of all
     * entities.
     * @returns {Object<Object<Object<number>>>} Cardinalities of sets by
     * entities, attributes, and values.
     */
    static collectEntitiesAttributesValues({entitiesAttributes} = {}) {
        // Iterate on entities.
        return entitiesAttributes
            .reduce(function (entitiesCollection, entityRecord) {
                // Determine entity.
                var entity = entityRecord.entity;
                // Collect counts of values of attributes for current entity.
                if (entitiesCollection.hasOwnProperty(entity)) {
                    // Collection has a record for the current entity.
                    // Preserve existing records in the collection.
                    var attributesCollection = Object
                        .assign({}, entitiesCollection[entity]);
                } else {
                    // Collection does not have a record for the current entity.
                    // Create a new record.
                    var attributesCollection = {};
                }
                var newAttributesCollection = Cardinality
                    .collectAttributesValues({
                        entityRecord: entityRecord,
                        oldAttributesCollection: attributesCollection
                    });
                // Include information from current entity record within the
                // collection.
                var newEntityRecord = {
                    [entity]: newAttributesCollection
                };
                var newEntitiesCollection = Object
                    .assign({}, entitiesCollection, newEntityRecord);
                return newEntitiesCollection;
            }, {});
    }
    /**
     * Collects cardinalities across attributes of a single entity.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<Object>} parameters.entityRecord Record with values of
     * attributes for a single entity.
     * @param {Object<Object>} parameters.oldAttributesCollection
     * Collection of attributes for a single entity.
     * @returns {Object<Object<number>>} Cardinalities of sets by attributes and
     * values.
     */
    static collectAttributesValues({
                                       entityRecord,
                                       oldAttributesCollection
    } = {}) {
        // Determine attributes in entity record.
        var attributes = Object
            .keys(entityRecord).filter(function (key) {
                return (key === "compartments" || key === "processes");
            });
        // Iterate on attributes.
        return attributes
            .reduce(function (attributesCollection, attribute) {
                // Determine attribute record.
                var attributeRecord = entityRecord[attribute];
                // Collect counts of values for current attribute.
                if (attributesCollection.hasOwnProperty(attribute)) {
                    // Collection has a record for the current attribute.
                    // Preserve existing records in the collection.
                    var valuesCollection = Object
                        .assign({}, attributesCollection[attribute]);
                } else {
                    // Collection does not have a record for the current
                    // attribute.
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
            }, oldAttributesCollection);
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
            // Collect counts of values.
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
     * @param {string} entity Type of entity of current selection and interest.
     * @param {Object<Object<Object<number>>>} setCardinalities Cardinalities of
     * sets by entities, attributes, and values.
     * @returns {Array<Object<Array<Object>>>} Summary of sets for a specific
     * type of entity by attributes and values with records in ascending order,
     * incremental sums, and total sums.
     */
    static prepareSetsSummary(entity, setCardinalities) {
        // Prepare the set summary for visual representation.
        // Organize the basic information of set cardinalities by attributes and
        // values.
        var basicSetsSummary = Cardinality
            .organizeSetsSummary(entity, setCardinalities);
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
     * @param {string} entity Type of entity of current selection and interest.
     * @param {Object<Object<Object<number>>>} setCardinalities Cardinalities of
     * sets by entities, attributes, and values.
     * @returns {Array<Object<Array<Object>>>} Summary of sets for a specific
     * type of entity by attributes and values.
     */
    static organizeSetsSummary(entity, setCardinalities) {
        // Prepare records for attributes.
        var attributes = Object.keys(setCardinalities[entity]);
        return attributes.map(function (attribute) {
            // Prepare records for values.
            var values = Object.keys(setCardinalities[entity][attribute]);
            var valueRecords = values.map(function (value) {
                var count = setCardinalities[entity][attribute][value];
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
     * @param {Array<Object<Array<Object>>>} basicSetsSummary Basic information
     * for set summary.
     * @returns {Array<Object<Array<Object>>>} Summary of sets for a specific
     * type of entity by attributes and values.
     */
    static sortSetsSummary(basicSetsSummary) {
        // Sort records for attributes.
        var sortSetAttributes = basicSetsSummary
            .slice().sort(function (value1, value2) {
                // Sort attributes in custom order.
                var order = {
                    compartments: 2,
                    processes: 1
                };
                return order[value1.attribute] - order[value2.attribute];
            });
        return sortSetAttributes.map(function (attributeRecord) {
            // Sort records for values.
            var newValues = {
                values: attributeRecord
                    .values
                    .slice()
                    .sort(function (value1, value2) {
                        return value1.count - value2.count;
                    })
            };
            // Copy existing values in the record and introduce new value.
            return Object.assign({}, attributeRecord, newValues);
        });
    }
    /**
     * Increments counts of cardinalities of sets in set summary in their
     * current order.
     * @returns {Array<Object<Array<Object>>>} sortSetsSummary Basic information
     * for set summary in sort order.
     * @returns {Array<Object<Array<Object>>>} Summary of sets for a specific
     * type of entity by attributes and values.
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
                        var base = collection[index - 1].base +
                            collection[index - 1].count;
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