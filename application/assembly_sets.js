////////////////////////////////////////////////////////////////////////////////
// Assembly of Sets for Model
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Creation of records for compartments

/**
 * Creates a record for a single compartment in a metabolic model.
 * @param {string} identifier Identifier of a single compartment.
 * @param {string} name Name of a single compartment.
 * @returns {Object} Record for a compartment.
 */
function createCompartmentRecord(identifier, name) {
    return {
        [identifier]: {
            identifier: identifier,
            name: name
        }
    };
}

/**
 * Creates records for all compartments in a metabolic model.
 * @param {Object} compartments Information about all compartments in a
 * metabolic model.
 * @returns {Object} Records for compartments.
 */
function createCompartmentRecords(compartments) {
    // Create records for compartments.
    return Object.keys(compartments)
        .reduce(function (collection, identifier) {
            return Object.assign(
                {},
                collection,
                createCompartmentRecord(identifier, compartments[identifier])
            );
        }, {});
}

////////////////////////////////////////////////////////////////////////////////
// Creation of records for genes

/**
 * Creates a record for a single gene in a metabolic model.
 * @param {Object<string>} gene Information about a single gene.
 * @returns {Object} Record for a gene.
 */
function createGeneRecord(gene) {
    return {
        [gene.id]: {
            identifier: gene.id,
            name: gene.name
        }
    };
}

/**
 * Creates records for all genes in a metabolic model.
 * @param {Array<Object>} genes Information for all genes of a metabolic
 * model.
 * @returns {Object} Records for genes.
 */
function createGeneRecords(genes) {
    // Create records for genes.
    return genes.reduce(function (collection, gene) {
        return Object.assign({}, collection, createGeneRecord(gene));
    }, {});
}

////////////////////////////////////////////////////////////////////////////////
// Creation of records for processes

/**
 * Creates a record for a single metabolic process from a metabolic model.
 * @param {string} processName Name of a metabolic subsystem or process.
 * @param {Object} collection Records for processes.
 * @returns {Object} Record for a process.
 */
function createProcessRecord(processName, collection) {
    var processIdentifier = "process_" +
        (Object.keys(collection).length + 1).toString();
    return {
        [processIdentifier]: {
            id: processIdentifier,
            name: processName
        }
    };
}


// TODO: Create unique identifiers for metabolic subsystems or processes.
// TODO: Use these identifiers as keys for a dictionary-like object.

/**
 * Creates records for all processes from a metabolic model.
 * @param {Array<Object>} reactions Information for all reactions of a metabolic
 * model.
 * @returns {Object} Records for processes.
 */
function createProcessRecords(reactions) {
    // Create records for processes.
    // Assume that according to their annotation, all reactions in the metabolic
    // model participate in only a single metabolic process.
    return reactions.reduce(function (collection, reaction) {
        // Determine if the reaction has an annotation for process.
        // Determine if a record already exists for the process.
        if (
            (reaction.subsystem != undefined) &&
            (Object.keys(collection).find(function (key) {
                return collection[key].name === reaction.subsystem;
            }) === undefined)
        ) {
            // Create record for the process.
            return Object.assign(
                {},
                collection,
                createProcessRecord(reaction.subsystem, collection)
            );
        } else {
            return collection;
        }
    }, {});
}

////////////////////////////////////////////////////////////////////////////////
// Assembly of records for sets

// TODO: Follow the new data structure, including "identifier" instead of "id".

/**
 * Assembles relational records for information about sets of entities in a
 * metabolic model.
 * @param {Object} data Information about a metabolic model from systems
 * biology.
 * @returns {Object} Information about sets of entities.
 */
function assembleSets(data) {
    return {
        sets: {
            compartments: createCompartmentRecords(data.compartments),
            genes: createGeneRecords(data.genes),
            processes: createProcessRecords(data.reactions)
        }
    }
}
