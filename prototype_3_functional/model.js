/**
 * A model of the comprehensive application state.
 */
class Model {
    /**
     * Initializes an instance of class Model.
     */
    constructor() {
        // General attributes.
        this.checkFile = null;
        this.rawFile = null;
        this.assemblyFile = null;
        this.metabolites = null;
        this.reaction = null;
        this.compartments = null;
        this.genes = null;
        this.processes = null;
        this.entityAttributes = null;
        // Interface attributes.
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
     * Receives information to modify the model.
     * @param {Array<Object>} newAttributes Collection of new attributes to
     * replace old attributes in the model.
     */
    receive(newAttributes) {}

    // For the receive method... receive an array (called a bundle) of objects...
    // Each object should include information about the attribute type and the actual data for the attribute
}