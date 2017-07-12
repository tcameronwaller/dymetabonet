/**
 * Functionality of utility for assigning attributes to metabolic entities.
 * This class does not store any attributes and does not require instantiation.
 * This class stores methods for external utility.
 */
class Attribution {
    // Master control of attribution procedure.
    /**
     * Determines attributes of metabolic entities, metabolites and reactions.
     * @param {Object} metabolites Information about all metabolites.
     * @param {Object} reactions Information about all reactions.
     * @returns {Array<Object>} Attributes of all entities.
     */
    static determineEntitiesAttributes(metabolites, reactions) {
        // Determine attributes of each metabolic entity.
        // Store attributes of entities within a table, an array of objects.
        // Individual objects, analogous to rows in the table, represent
        // individual entities, either metabolites or reactions.
        // All objects in the array have the same keys.
        // These keys are analogous to column headers in the table.
        // Some of these keys designate attributes of the entities.
        // Entities can have multiple values for some attributes, so the
        // attributes come in arrays of unique values.
        // As these values in arrays are unique, each instance of a value
        // corresponds to a single entity with that value.
        var metabolitesAttributes = Attribution
            .determineMetabolitesAttributes(metabolites, reactions);
        var reactionsAttributes = Attribution
            .determineReactionsAttributes(reactions);
        return [].concat(metabolitesAttributes, reactionsAttributes);
    }
    /**
     * Determines attributes of all metabolites.
     * @param {Object} metabolites Information about all metabolites.
     * @param {Object} reactions Information about all reactions.
     * @returns {Array<Object<string>>} Attributes of metabolites.
     */
    static determineMetabolitesAttributes(metabolites, reactions) {
        return Object.keys(metabolites).map(function (key) {
            return Attribution
                .determineMetaboliteAttributes(metabolites[key], reactions);
        });
    }
    /**
     * Determines attributes of a single metabolite.
     * @param {Object} metabolite Information about a metabolite.
     * @param {Object} reactions Information about all reactions.
     * @returns {Object} Attributes of a metabolite.
     */
    static determineMetaboliteAttributes(metabolite, reactions) {
        return {
            compartments: Attribution.determineMetaboliteReactionsCompartments({
                metaboliteIdentifier: metabolite.identifier,
                reactionIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            entity: "metabolite",
            identifier: metabolite.identifier,
            operations: Attribution.determineReactionsOperations({
                reactionIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            processes: Attribution.determineReactionsProcesses({
                reactionIdentifiers: metabolite.reactions,
                reactions: reactions
            }),
            reversibilities: Attribution.determineReactionsReversibilities({
                reactionIdentifiers: metabolite.reactions,
                reactions: reactions
            })
        };
    }
    /**
     * Determines unique processes of multiple reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
     * reactions of interest.
     * @param {Object} parameters.reactions Information about all reactions.
     * @returns {Array<string>} Identifiers of processes.
     */
    static determineReactionsProcesses({reactionIdentifiers, reactions} = {}) {
        var processes = reactionIdentifiers.map(function (reactionIdentifier) {
            var reaction = reactions[reactionIdentifier];
            return reaction.process;
        });
        return General.collectUniqueElements(processes);
    }
    /**
     * Determines unique compartments in which a single metabolite participates
     * in multiple reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {string} parameters.metaboliteIdentifier Identifier for a
     * metabolite of interest.
     * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
     * reactions of interest.
     * @param {Object} parameters.reactions Information for all reactions.
     * @returns {Array<string>} Identifiers of compartments.
     */
    static determineMetaboliteReactionsCompartments({
                                                         metaboliteIdentifier,
                                                         reactionIdentifiers,
                                                         reactions
                                                     } = {}) {
        // Metabolite qualifies for compartment if it participates in any
        // reaction in the compartment.
        var compartments = reactionIdentifiers
            .reduce(function (collection, reactionIdentifier) {
                var reaction = reactions[reactionIdentifier];
                var metabolites = reaction
                    .metabolites.filter(function (metabolite) {
                        return metabolite.identifier === metaboliteIdentifier;
                    });
                var metaboliteReactionCompartments = General
                    .collectValuesFromObjects(metabolites, "compartment");
                return [].concat(collection, metaboliteReactionCompartments);
            }, []);
        return General.collectUniqueElements(compartments);
    }
    /**
     * Determines unique operations, conversion or transport, of multiple
     * reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
     * reactions of interest.
     * @param {Object} parameters.reactions Information for all reactions.
     * @returns {Array<string>} Identifiers of operations.
     */
    static determineReactionsOperations({
                                             reactionIdentifiers,
                                             reactions
                                         } = {}) {
        var operations = reactionIdentifiers
            .reduce(function (collection, reactionIdentifier) {
                var reaction = reactions[reactionIdentifier];
                return [].concat(collection, reaction.operations);
            }, []);
        return General.collectUniqueElements(operations);
    }
    /**
     * Determines unique reversibilities of multiple reactions.
     * @param {Object} parameters Destructured object of parameters.
     * @param {Array<string>} parameters.reactionIdentifiers Identifiers for
     * reactions of interest.
     * @param {Object} parameters.reactions Information for all reactions.
     * @returns {Array<string>} Identifiers of reversibilities.
     */
    static determineReactionsReversibilities({
                                                  reactionIdentifiers,
                                                  reactions
                                              } = {}) {
        var reversibilities = reactionIdentifiers
            .map(function (reactionIdentifier) {
                var reaction = reactions[reactionIdentifier];
                return reaction.reversibility;
            });
        return General.collectUniqueElements(reversibilities);
    }
    /**
     * Determines attributes of all reactions.
     * @param {Object} reactions Information about all reactions.
     * @returns {Array<Object<string>>} Attributes of reactions.
     */
    static determineReactionsAttributes(reactions) {
        return Object.keys(reactions).map(function (key) {
            return Attribution.determineReactionAttributes(reactions[key]);
        });
    }
    /**
     * Determines attributes of a single reaction.
     * @param {Object} reaction Information about a reaction.
     * @returns {Object} Attributes of a reaction.
     */
    static determineReactionAttributes(reaction) {
        return {
            compartments: Extraction
                .extractReactionMetabolitesCompartments(reaction.metabolites),
            entity: "reaction",
            identifier: reaction.identifier,
            operations: reaction.operations,
            processes: [reaction.process],
            reversibilities: [reaction.reversibility]
        };
    }
}