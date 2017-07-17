/**
 * Representation of the state of the application.
 * ...
 * This class stores methods that control the creation of a representation of
 * the current state of the application. As part of this process, the methods
 * evaluate the current state of the application to respond appropriately. These
 * methods also call external methods as necessary.
 */
class State {
    /**
     * Initializes an instance of the class.
     * @param {Object} model Model of the comprehensive state of the
     * application.
     */
    constructor(model) {
        // Reference to model of application's state.
        this.model = model;
        // Control representation of the state of the model.
        this.represent();
        // Control action on the state of the model.
        this.act();
        // TODO: I need to go through the logic of what general state the app is in... Has a model been loaded yet?
        // TODO: Store representation-specific versions of data as attributes for the class.
        // TODO: Eventually probably organize some of the control-structure within another method that still assigns attributes to the class.
    }
    /**
     * Evaluates the context of the application's state and creates an
     * appropriate representation in a visual interface.
     */
    represent() {
        // If model does not have records of metabolic entities and sets, then
        // create source interface.
        if (!this.determineMetabolicEntitiesSets()) {
            // Initialize instance of source interface.
            // Pass this instance a reference to the model.
            new SourceView(this.model);

            // Load from file a default persistent state of the application.
            // The intent is for this action to be temporary during development.
            //var path = "../model/homo-sapiens/model_sets_network.json";
            //Action.loadDefaultState(path, this.model);
        }
        // TODO: Get rid of the source view after extraction... then the view
        // TODO: should be blank or something until all state attributes are available for set and entity views.
        // If model has metabolic entities and sets, has entities' attributes,
        // has sets' cardinalities, has basic selections for set summary, and
        // has sets' summary then create state interface, set interface, and entity interface.
        if (
            this.determineMetabolicEntitiesSets() &&
            this.determineEntitiesAttributes() &&
            this.determineCurrentEntitiesAttributes() &&
            this.determineSetCardinalities() &&
            this.determineSetViewEntity() &&
            this.determineSetViewFilter() &&
            this.determineSetSummary()
        ) {
            // Initialize instance of state interface.
            // Pass this instance a reference to the model.
            new StateView(this.model);
            // Initialize instance of set interface.
            // Pass this instance a reference to the model.
            new SetView(this.model);
            // Initialize instance of entity interface.
            // Pass this instance a reference to the model.

        }
    }
    /**
     * Evaluates the context of the application's state and executes automatic
     * actions as appropriate.
     */
    act() {
        // If model has a persistent representation, then save this
        // representation to client's system.
        if (this.determinePersistence()) {
            Action.saveState(this.model);
            // Remove the persistent representation to avoid repetition.
            Action.removeAttribute("persistence", this.model);
        }
        // If model has metabolic entities and sets but does not have entities'
        // attributes, then derive entities' attributes.
        if (
            this.determineMetabolicEntitiesSets() &&
            !this.determineEntitiesAttributes()
        ) {
            Action.collectEntitiesAttributes(this.model);
        }
        // If model has entities' attributes but does not have current entities'
        // attributes, then copy entities' attributes.
        // The current entities' attributes are useful to represent results of
        // filters while maintaining ability to revert to original entities'
        // attributes.
        if (
            this.determineEntitiesAttributes() &&
            !this.determineCurrentEntitiesAttributes()
        ) {
            Action.copyEntitiesAttributes(this.model);
        }
        // If model has current entities' attributes but does not have sets'
        // cardinalities, then determine sets' cardinalities.
        if (
            this.determineCurrentEntitiesAttributes() &&
            !this.determineSetCardinalities()
        ) {
            Action.determineSetCardinalities(this.model);
        }
        // If model has sets' cardinalities but does not have entity
        // specification for set view then initialize entity specification for
        // set view.
        if (
            this.determineSetCardinalities() &&
            !this.determineSetViewEntity()
        ) {
            Action.submitSetViewEntity("metabolite", this.model);
        }
        // If model has sets' cardinalities and entity specification for set
        // view but does not have filter specification for set view then
        // initialize filter specification for set view.
        if (
            this.determineSetCardinalities() &&
            this.determineSetViewEntity() &&
            !this.determineSetViewFilter()
        ) {
            Action.submitSetViewFilter(false, this.model);
        }
        // If model has sets' cardinalities, has entity specification, has
        // filter specification, but does not have sets' summary, then prepare
        // sets' summary.
        if (
            this.determineSetCardinalities() &&
            this.determineSetViewEntity() &&
            this.determineSetViewFilter() &&
            !this.determineSetSummary()
        ) {
            Action.prepareSetSummary(this.model);
        }
    }
    // Methods to evaluate state of application.
    /**
     * Determines whether or not model has a persistent representation.
     */
    determinePersistence() {
        return this.model.persistence;
    }
    /**
     * Determines whether or not model has information about metabolic entities
     * and sets.
     */
    determineMetabolicEntitiesSets() {
        return (
            this.model.metabolites &&
            this.model.reactions &&
            this.model.compartments &&
            this.model.genes &&
            this.model.processes
        )
    }
    /**
     * Determines whether or not model has information about attributes of all
     * entities.
     */
    determineEntitiesAttributes() {
        return this.model.entitiesAttributes;
    }
    /**
     * Determines whether or not model has information about current attributes
     * of all entities.
     */
    determineCurrentEntitiesAttributes() {
        return this.model.currentEntitiesAttributes;
    }
    /**
     * Determines whether or not model has cardinalities of all sets by
     * entities, attributes, and values.
     */
    determineSetCardinalities() {
        return this.model.setCardinalities;
    }
    /**
     * Determines whether or not model has a specification of entity for the set
     * view.
     */
    determineSetViewEntity() {
        return this.model.setViewEntity;
    }
    /**
     * Determines whether or not model has a specification of filter for the set
     * view.
     */
    determineSetViewFilter() {
        return this.model.setViewFilter !== null;
    }
    /**
     * Determines whether or not model has a summary of cardinalities of sets of
     * entities.
     */
    determineSetSummary() {
        return this.model.setSummary;
    }
}