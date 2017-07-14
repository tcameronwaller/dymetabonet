/**
 * Model of the comprehensive state of the application.
 * This class stores attributes that represent the entire state of the
 * application.
 * It is the role of the model to know which attributes and which values of
 * these attributes describe the application.
 */
class Model {
    /**
     * Initializes an instance of class Model.
     */
    constructor() {
        // It is the role of the model to know which attributes and which values
        // of these attributes describe the application.
        // Specify attributes for the model to expect and accept.
        this.attributeNames = [
            "persistence", "file",
            "compartments", "genes", "operations", "processes",
            "reversibilities",
            "metabolites", "reactions",
            "entitiesAttributes", "currentEntitiesAttributes",
            "setCardinalities", "setSummary",
            "setViewEntity", "setViewFilter", "setViewAttributeSearches",
            "setViewAttributeValueSelections",
            "entityViewControlSelection", "entityViewCompartmentalization",
            "entityViewReplications", "entityViewShowReplications",
            "entityViewNetworkNodes", "entityViewNetworkLinks",
            "entityViewProximityFocus", "entityViewProximityDirection",
            "entityViewProximityDepth", "entityViewSubnetworkNodes",
            "entityViewSubnetworkLinks"
        ];
    }
    /**
     * Restores the model for changes and initializes representation of the
     * application's state.
     * This method controls the vetting of all proposals for changes to the
     * model.
     * @param {Array<Object>} newAttributes Collection of new attributes to
     * replace old attributes in the model.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    restore(newAttributes, model) {
        // Accept new attributes and assign them to the model.
        newAttributes.forEach(function (newAttribute) {
            // Confirm that the record for the new attribute value is valid.
            if (
                newAttribute.hasOwnProperty("attribute") &&
                newAttribute.hasOwnProperty("value")
            ) {
                // Confirm that the attribute exists in the model.
                if (model.attributeNames.includes(newAttribute.attribute)) {
                    model[newAttribute.attribute] = newAttribute.value;
                }
            }
        });
        // Initialize instance of state representation.
        // Pass this instance a reference to the model.
        new State(model);
    }

    // TODO: I might want functionality to print a representation of the model to the console.
    // TODO: I might also want the ability to save a JSON of the model to allow session persistence and restoration.

}