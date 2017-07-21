/**
 * Functionality of utility for collecting nodes for metabolic entities,
 * metabolites and reactions, and links for relations between them.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for external utility.
 */
class Network {
    /**
     * Extracts from a collection of entities' attributes the identifiers of all
     * entities of a specific type, metabolite or reaction.
     * @param {string} entity A type of entity, metabolite or reaction.
     * @param {Array<Object<string>>} entitiesAttributes ...
     * @returns {<Array<string>} Identifiers of entities of specific type.
     */
    static extractEntityIdentifiers(entity, entitiesAttributes) {
        return entitiesAttributes.filter(function (record) {
            return record.entity === entity;
        }).map(function (record) {
            return record.identifier;
        });
    }

}