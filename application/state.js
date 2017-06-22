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
     * Initializes an instance of class State.
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
    determineEntityAttributes() {
        return this.model.entityAttributes;
    }
    represent() {}
    act() {
        // If model does not have records of metabolic entities and sets, then
        // load from file a default, custom assembly of a model of metabolism.
        // The intent is for this action to be temporary during development.
        // Eventually the interface will support assembly and load from file.
        if (!this.determineMetabolicEntitiesSets()) {
            var path = "../model/homo-sapiens/model_sets_network.json";
            Action.loadDefaultAssemblyFile(path, this.model);
        }
        // If model does has records of metabolic entities and sets but does not
        // have records of attributes of all entities, then derive these
        // attributes of all entities.
        if (
            this.determineMetabolicEntitiesSets() &&
            !this.determineEntityAttributes()
        ) {}
    }
}