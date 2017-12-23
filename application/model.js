/*
Profondeur supports visual exploration and analysis of metabolic networks.
Copyright (C) 2017 Thomas Cameron Waller

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.
If not, see <http://www.gnu.org/licenses/>.

This file is part of project Profondeur.
Project repository's address: https://github.com/tcameronwaller/profondeur/
Author's electronic address: tcameronwaller@gmail.com
Author's physical address:
T Cameron Waller
Scientific Computing and Imaging Institute
University of Utah
72 South Central Campus Drive Room 3750
Salt Lake City, Utah 84112
United States of America
*/

/**
* Model representation of the application's state.
* This class stores methods that control the representation of the application's
* state.
* The class evaluates the application's state and responds accordingly.
*/
class Model {
  /**
  * Initializes an instance of the class.
  * @param {Object} state Application's state.
  */
  constructor(state) {
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Evaluate application's state, respond, and represent accordingly.
    self.act(self);
    self.represent(self);
  }
  /**
  * Evaluates the application's state and responds accordingly.
  */
  act(self) {}
  /**
  * Evaluates the application's state and represents it accordingly in a visual
  * interface.
  * Evaluation only considers which views to initialize or restore in the
  * interface.
  * Individual views' content and behavior depends further on application's
  * state.
  */
  represent(self) {
    // Evaluate the application's state and represent it accordingly.
    if (!Model.determineMetabolicEntitiesSets(self.state)) {
      // Initialize or restore instances of interface's views.
      // Pass these instances a reference to the application's state.
      // Initialize or restore views within control view.
      var controlContents = ["state"];
      new ControlView(controlContents, self.state);
      new StateView(self.state);
      // Initialize or restore views within exploration view.
      var explorationContents = ["summary"];
      new ExplorationView(explorationContents, self.state);
      new SummaryView(self.state);
    }
    if (Model.determineMetabolicEntitiesSets(self.state)) {
      // Initialize or restore instances of interface's views.
      // Pass these instances a reference to the application's state.
      // Initialize or restore views within control view.
      var controlContents = ["state", "set", "context"];
      new ControlView(controlContents, self.state);
      new StateView(self.state);
      new SetView(self.state);
      new CandidacyView(self.state);
      // Initialize or restore views within exploration view.
      var explorationContents = ["topology"];
      new ExplorationView(explorationContents, self.state);
      //new TopologyView(self.state);
    }

    // TODO: The ControlView and ExplorationView should remove all of their sub-views except those with IDs that match their parameters.

    // TODO: Call Model's evaluation methods from within the views to determine how to manage them properly...
    // TODO: Basically try to organize all state evaluation within the Model class...



    // TODO: Scrap below here (until the evaluation methods)
    if (false) {
      // If application's state has appropriate information then create
      // interface for persistence.
      if (this.determineMetabolicEntitiesSets()) {
        // Initialize instance of interface.
        // Pass this instance a reference to the model of the application's
        // state.
        new PersistenceView(self.state);
      }
      // If application's state has appropriate information then create
      // interface for set.
      if (
        this.determineMetabolicEntitiesSets() &&
        this.determineTotalEntitiesSets() &&
        this.determineCurrentEntitiesSets() &&
        this.determineSetsCardinalities()
      ) {
        // Initialize instance of interface.
        // Pass this instance a reference to the model of the application's
        // state.
        new SetView(self.state);
      }
      // If application's state has appropriate information then create
      // interface for control of network's assembly.
      if (
        this.determineCandidateContext() &&
        this.determineCandidateEntities()
      ) {
        // Initialize instance of interface.
        // Pass this instance a reference to the model of the application's
        // state.
        new AssemblyView(self.state);
      }
      // If application's state has appropriate information then create
      // interface for place-holder in bottom of interface.
      if (
        this.determineCandidateContext() &&
        this.determineCandidateEntities()
      ) {
        // Initialize instance of interface.
        // Pass this instance a reference to the model of the application's
        // state.
        new BottomView(self.state);
      }
      // If application's state has appropriate information then create
      // interface for visual representation of network's topology.
      // TODO: Eventually, I think I'll need to split "determineNetworkElements"
      // TODO: to consider network's elements and subnetwork's elements... ie, I'll
      // TODO: need network's elements to allow topological traversal, but I won't
      // TODO: necessarily draw the network until I have the current network's elements...
      // TODO: those currently of interest for drawing...
      if (
        this.determineCandidateContext() &&
        this.determineCandidateEntities()
      ) {
        // Initialize instance of interface.
        // Pass this instance a reference to the model of the application's
        // state.
        new TopologyView(self.state);
      }
    }
  }

  // Methods to evaluate application's state.
  // These methods for evaluation have external utility.

  /**
  * Determines whether the application's state has information about a source.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineSource(state) {
    return !(state.source === null);
  }
  /**
  * Determines whether the application's state has raw information about
  * metabolic entities and sets from a model.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineRawModel(state) {
    return !(state.rawModel === null);
  }
  /**
  * Determines whether the application's state has clean information about
  * metabolic entities and sets from a model.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineCleanModel(state) {
    return !(state.cleanModel === null);
  }
  /**
  * Determines whether the application's state has information about metabolic
  * entities and sets.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineMetabolicEntitiesSets(state) {
    return (
      !(state.metabolites === null) &&
      !(state.reactions === null) &&
      !(state.compartments === null) &&
      !(state.genes === null) &&
      !(state.processes === null)
    );
  }
  /**
  * Determines whether the application's state has information about attribution
  * of total entities to sets.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineTotalEntitiesSets(state) {
    return (
      !(state.totalReactionsSets === null) &&
      !(state.totalMetabolitesSets === null)
    );
  }
  /**
  * Determines whether the application's state has information about entities
  * and sets that pass filters by sets.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineFiltersEntitiesSets(state) {
    return (
      !(state.setsFilters === null) &&
      !(state.accessReactionsSets === null) &&
      !(state.accessMetabolitesSets === null) &&
      !(state.filterReactionsSets === null) &&
      !(state.filterMetabolitesSets === null)
    );
  }
  /**
  * Determines whether the application's state has information about sets of
  * entities by their values of attributes.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineSetsCardinalities(state) {
    return (
      !(state.setsEntities === null) &&
      !(state.setsFilter === null) &&
      !(state.setsCardinalities === null) &&
      !(state.setsSummaries === null)
    );
  }
  /**
  * Determines whether the application's state has information about the
  * contextual interest for candidate entities.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineContextualInterest(state) {
    return (
      !(state.compartmentalization === null) &&
      !(state.reactionsSimplifications === null) &&
      !(state.metabolitesSimplifications === null)
    );
  }
  /**
  * Determines whether the application's state has information about candidate
  * entities.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineCandidateEntities(state) {
    return (
      !(state.reactionsCandidates === null) &&
      !(state.metabolitesCandidates === null)
    );
  }

  // TODO: Scrap below here... update as needed...

  /**
  * Determines whether or not the application's state has information about
  * options for assembly of a network of relations between metabolic
  * entities.
  */
  determineNetworkAssembly() {
    return (
      !(self.state.compartmentalization === null) &&
      !(self.state.simplification === null)
    );
  }
  /**
  * Determines whether or not the application's state has information about
  * a network and subnetwork of relations between metabolic entities.
  */
  determineNetworkElements() {
    return (
      !(self.state.metabolitesNodes === null) &&
      !(self.state.reactionsNodes === null) &&
      !(self.state.links === null) &&
      !(self.state.currrentMetabolitesNodes === null) &&
      !(self.state.currentReactionsNodes === null) &&
      !(self.state.currentLinks === null)
    );
  }
}
