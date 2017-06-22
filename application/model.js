/**
 * Model of the comprehensive state of the application.
 * This class stores attributes that represent the entire state of the
 * application.
 */
class Model {
    /**
     * Initializes an instance of class Model.
     */
    constructor() {
        // General attributes.
        this.metabolites = null;
        this.reactions = null;
        this.compartments = null;
        this.genes = null;
        this.processes = null;
        this.entityAttributes = null;
        // Interface attributes.
        // Source View.
        this.checkFile = null;
        this.rawFile = null;
        this.assemblyFile = null;
        // Attribute View.
        this.attributeViewEntity = null;
        this.attributeViewFilter = null;
        this.attributeViewAttributeSearches = null;
        this.attributeViewAttributeValueSelections = null;
        // Set View.
        // ...
        // Entity View.
        this.entityViewControlSelection = null;
        this.entityViewCompartmentalization = null;
        this.entityViewReplications = null;
        this.entityViewShowReplications = null;
        this.entityViewNetworkNodes = null;
        this.entityViewNetworkLinks = null;
        this.entityViewProximityFocus = null;
        this.entityViewProximityDirection = null;
        this.entityViewProximityDepth = null;
        this.entityViewSubnetworkNodes = null;
        this.entityViewSubnetworkLinks = null;
    }
    /**
     * Restores the model for changes and initializes representation of the
     * application's state.
     * This method controls the vetting of all proposals for changes to the
     * model.
     * @param {Array<Object>} newAttributes Collection of new attributes to
     * replace old attributes in the model.
     */
    restore(newAttributes) {
        // Accept new attributes and assign them to the model.
        newAttributes.forEach(function (newAttribute) {
            // Confirm that the record for the new attribute value is valid.
            if (
                newAttribute.hasOwnProperty("attribute") &&
                newAttribute.hasOwnProperty("value")
            ) {
                // Confirm that the attribute exists in the model.
                if (this.hasOwnProperty(newAttribute.attribute)) {
                    this[newAttribute.attribute] = newAttribute.value;
                }
            }
        });
        // Initialize instance of state representation.
        // Pass this instance a reference to the model.
        new State(this);
    }

    // TODO: I might want functionality to print a representation of the model to the console.
    // TODO: I might also want the ability to save a JSON of the model to allow session persistence and restoration.

}