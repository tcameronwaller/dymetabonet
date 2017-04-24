/**
 * Created by Cameron on 4/18/2017.
 */

// TODO: Follow the new data structure, including "identifier" instead of "id".


////////////////////////////////////////////////////////////////////////////////
// Creation of records for metabolites

/**
 * Creates a record for a single metabolite from a metabolic model.
 * @param {string} metaboliteIdentifier Unique identifier of general metabolite.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @returns {Object} Record for a metabolite.
 */
function createMetaboliteRecord(metaboliteIdentifier, metabolites) {
    // Collect all compartmental versions of the metabolite.
    var setMetabolites = filterCompartmentalMetabolitesByMetabolite(
        metabolites, metaboliteIdentifier
    );
    // Confirm that all compartmental records have identical values for relevant
    // properties.
    //checkMetaboliteSet(setMetabolites, metaboliteIdentifier);
    // Optionally introduce a conditional clause here to print the record for
    // specific metabolite sets and confirm proper correction for discrepancies.
    //if (metaboliteIdentifier === "CE7081") {}
    // Collect consensus properties from all metabolites in set.
    return {
        [metaboliteIdentifier]: {
            charge: determineMetaboliteSetCharge(setMetabolites),
            formula: determineMetaboliteSetFormula(setMetabolites),
            id: metaboliteIdentifier,
            name: determineMetaboliteSetName(setMetabolites)
        }
    };
}

/**
 * Creates records for all metabolites from a metabolic model.
 * @param {Array<Object>} metabolites Information for all metabolites of a
 * metabolic model.
 * @returns {Object} Records for metabolites.
 */
function createMetaboliteRecords(metabolites) {
    // Check metabolites.
    // Create records for metabolites.
    return metabolites.reduce(function (collection, metabolite) {
        // Determine if a record already exists for the metabolite.
        if (
            collection[extractMetaboliteIdentifier(metabolite.id)] ===
            undefined
        ) {
            // Create record for the metabolite.
            return Object.assign(
                {},
                collection,
                createMetaboliteRecord(
                    extractMetaboliteIdentifier(metabolite.id), metabolites
                )
            );
        } else {
            return collection;
        }
    }, {});
}

////////////////////////////////////////////////////////////////////////////////
// Assembly of records for entities

// TODO: Follow the new data structure, including "identifier" instead of "id".

/**
 * Assembles relational records for information about entities in a metabolic
 * model.
 * @param {Object} data Information about a metabolic model from systems
 * biology.
 * @param {Object} sets Information about entities in a metabolic model.
 * @returns {Object} Information about entities.
 */
function assembleEntities(data, sets) {
    return {
        entities: {
            //metabolites: createMetaboliteRecords(data.metabolites),
            //reactions: createReactionRecords()
        }
    }
}
