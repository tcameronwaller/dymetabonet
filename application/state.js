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
     * Determines whether or not model has a persistent representation.
     */
    determinePersistence() {
        return this.model.persistence;
    }
    determineSource() {
        return this.model.assemblyFile;
    }
    determineMetabolicEntitiesSets() {
        return (
            this.model.metabolites &&
            this.model.reactions &&
            this.model.compartments &&
            this.model.genes &&
            this.model.processes
        )
    }
    determineEntitiesAttributes() {
        return this.model.entitiesAttributes;
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

        // TODO: Complete this action driver... derive entity attributes and submit to model...
        // TODO: Then complete an representation for the entity attributes...
        // If model has records of metabolic entities and sets but does not have
        // records of entities' attributes, then derive records of entities'
        // attributes.
        if (
            this.determineMetabolicEntitiesSets() &&
            !this.determineEntitiesAttributes()
        ) {
            Action.collectEntitiesAttributes(this.model);
        }
    }
}