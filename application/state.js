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

  }
  /**
  * Evaluates the context of the application's state and creates an
  * appropriate representation in a visual interface.
  */
  represent() {
    // If application's state has appropriate information then create
    // interface for source.
    if (!this.determineMetabolicEntitiesSets()) {
      // Initialize instance of interface.
      // Pass this instance a reference to the model of the application's
      // state.
      new SourceView(this.model);
      // Load from file a default persistent state of the application.
      // The intent is for this action to be temporary during development.
      //var path = "../model/homo-sapiens/model_sets_network.json";
      //Action.loadDefaultState(path, this.model);
      // TODO: Get rid of the source view after extraction... then the view
      // TODO: should be blank or something until all state attributes are available for set and entity views.
    }
    // If application's state has appropriate information then create
    // interface for persistence.
    if (this.determineMetabolicEntitiesSets()) {
      // Initialize instance of interface.
      // Pass this instance a reference to the model of the application's
      // state.
      new PersistenceView(this.model);
    }
    // If application's state has appropriate information then create
    // interface for set.
    if (
      this.determineMetabolicEntitiesSets() &&
      this.determineCurrentEntities() &&
      this.determineEntitiesAttributesSets()
    ) {
      // Initialize instance of interface.
      // Pass this instance a reference to the model of the application's
      // state.
      new SetView(this.model);
    }
    // If application's state has appropriate information then create
    // interface for control of network's assembly.
    if (
      this.determineMetabolicEntitiesSets() &&
      this.determineCurrentEntities() &&
      this.determineNetworkAssembly()
    ) {
      // Initialize instance of interface.
      // Pass this instance a reference to the model of the application's
      // state.
      // TODO: I need to re-do the assembly view for the new simplificiation method...
      //new AssemblyView(this.model);
    }
    // If application's state has appropriate information then create
    // interface for visual representation of network's topology.
    if (
      this.determineMetabolicEntitiesSets() &&
      this.determineCurrentEntities() &&
      this.determineNetworkElements()
    ) {
      // Initialize instance of interface.
      // Pass this instance a reference to the model of the application's
      // state.
      new TopologyView(this.model);
    }
  }
  /**
  * Evaluates the context of the application's state and executes automatic
  * actions as appropriate.
  */
  act() {}
  // Methods to evaluate application's state.
  /**
  * Determines whether or not the application's state has information about
  * metabolic entities and sets.
  */
  determineMetabolicEntitiesSets() {
    return (
      !(this.model.metabolites === null) &&
      !(this.model.reactions === null) &&
      !(this.model.compartments === null) &&
      !(this.model.genes === null) &&
      !(this.model.processes === null)
    );
  }
  /**
  * Determines whether or not the application's state has information about
  * values of attributes of metabolic entities.
  */
  determineCurrentEntities() {
    return (
      !(this.model.currentMetabolites === null) &&
      !(this.model.currentReactions === null)
    );
  }
  /**
  * Determines whether or not the application's state has information about
  * sets of metabolic entities by their values of attributes.
  */
  determineEntitiesAttributesSets() {
    return (
      !(this.model.attributesSelections === null) &&
      !(this.model.valuesSelections === null) &&
      !(this.model.setsEntities === null) &&
      !(this.model.setsFilter === null) &&
      !(this.model.setsCardinalities === null) &&
      !(this.model.setsSummary === null)
    );
  }
  /**
  * Determines whether or not the application's state has information about
  * options for assembly of a network of relations between metabolic
  * entities.
  */
  determineNetworkAssembly() {
    return (
      !(this.model.compartmentalization === null) &&
      !(this.model.simplification === null)
    );
  }
  /**
  * Determines whether or not the application's state has information about
  * a network and subnetwork of relations between metabolic entities.
  */
  determineNetworkElements() {
    return (
      !(this.model.metabolitesNodes === null) &&
      !(this.model.reactionsNodes === null) &&
      !(this.model.links === null) &&
      !(this.model.currrentMetabolitesNodes === null) &&
      !(this.model.currentReactionsNodes === null) &&
      !(this.model.currentLinks === null)
    );
  }
}
