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


  // TODO: Try to organize as much control of views as practical here within the Model.
  // TODO: I think the "controlContents" and "explorationContents" approach does work... so consider using it more.
  // TODO: Within ControlView, create tabs and containers for all sub-views... I think
  // TODO: Those sub-views should then establish themselves within approriate containers from ControlView.
  // TODO: Rendering is expensive, so don't use the display: none strategy
  // TODO: Instead, only create the content for ControlView's sub-views that are active.
  // TODO: I think I can create a new state variable to control which sub-view is active? Maybe?


  /**
  * Evaluates the application's state and represents it accordingly in a visual
  * interface.
  * Evaluation only considers which views to initialize or restore in the
  * interface.
  * Individual views' content and behavior depends further on application's
  * state.
  */
  represent(self) {
    // Evaluate the application's state and represent it appropriately in the
    // interface's views.
    // Determine which of interface's views are both relevant and active.
    // Initialize or restore instances of interface's relevant views.
    // For efficiency, changes to application's state only restore variant
    // aspects of views and preserve persistent aspects.
    // Pass these instances a reference to the application's state.
    // Pass these instances references to instances of other relevant views.

    // TODO: Control the control panel active views here and within the ControlView.

    // Tip view.
    var tip = new TipView();
    if (!Model.determineMetabolicEntitiesSets(self.state)) {
      // Control view.
      var controlContents = {
        tabs: ["state"],
        panels: ["state"]
      };
      var control = new ControlView({
        tip: tip,
        contents: controlContents,
        state: self.state
      });
      // State view.
      new StateView({
        tip: tip,
        control: control,
        state: self.state
      });
      // Exploration view.
      //var explorationContents = ["summary"];
      //new ExplorationView(explorationContents, self.state);
      //new SummaryView(self.state);
    } else if (Model.determineMetabolicEntitiesSets(self.state)) {
      if (
        Model.determineTotalEntitiesSets(self.state) &&
        Model.determineFiltersEntitiesSets(self.state) &&
        Model.determineSetsCardinalities(self.state) &&
        Model.determineContextualInterest(self.state) &&
        Model.determineCandidateEntities(self.state) &&
        Model.determineCandidatesSummaries(self.state) &&
        Model.determineNetworkElements(self.state)
      ) {
        // Control view.
        if (Model.determineControlState(self.state)) {
          // Control view.
          var controlContents = {
            tabs: ["state", "set", "candidacy"],
            panels: ["state"]
          };
          var control = new ControlView({
            tip: tip,
            contents: controlContents,
            state: self.state
          });
          // State view.
          new StateView({
            tip: tip,
            control: control,
            state: self.state
          });
        } else if (Model.determineControlSet(self.state)) {
          // Control view.
          var controlContents = {
            tabs: ["state", "set", "candidacy"],
            panels: ["set"]
          };
          var control = new ControlView({
            tip: tip,
            contents: controlContents,
            state: self.state
          });
          // Set view.
          new SetView({
            tip: tip,
            control: control,
            state: self.state
          });
        } else if (Model.determineControlCandidacy(self.state)) {
          // Control view.
          var controlContents = {
            tabs: ["state", "set", "candidacy"],
            panels: ["candidacy"]
          };
          var control = new ControlView({
            tip: tip,
            contents: controlContents,
            state: self.state
          });
          // Candidacy view.
          new CandidacyView({
            tip: tip,
            control: control,
            state: self.state
          });
        } else {
          // Control view.
          var controlContents = {
            tabs: ["state", "set", "candidacy"],
            panels: []
          };
          var control = new ControlView({
            tip: tip,
            contents: controlContents,
            state: self.state
          });
        }
        // Exploration view.

      }


      // Initialize or restore views within exploration view.
      //var explorationContents = ["topology"];
      //new ExplorationView(explorationContents, self.state);
      //new TopologyView(self.state);
    }

    // TODO: The ControlView and ExplorationView should remove all of their sub-views except those with IDs that match their parameters.

    // TODO: Call Model's evaluation methods from within the views to determine how to manage them properly...
    // TODO: Basically try to organize all state evaluation within the Model class...

  }

  // Methods to evaluate application's state.

  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineSource(state) {
    return !(state.source === null);
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineControlState(state) {
    return state.controlState;
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineControlSet(state) {
    return state.controlSet;
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineControlCandidacy(state) {
    return state.controlCandidacy;
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineTopology(state) {
    return state.topology;
  }
  /**
  * Determines whether the application's state has specific information.
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
  * Determines whether the application's state has specific information.
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
  * Determines whether the application's state has specific information.
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
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineSetsCardinalities(state) {
    return (
      !(state.setsEntities === null) &&
      !(state.setsFilter === null) &&
      !(state.setsCardinalities === null) &&
      !(state.setsSearches === null) &&
      !(state.setsSorts === null) &&
      !(state.setsSummaries === null)
    );
  }
  /**
  * Determines whether the application's state has specific information.
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
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineCandidateEntities(state) {
    return (
      !(state.reactionsCandidates === null) &&
      !(state.metabolitesCandidates === null)
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineCandidatesSummaries(state) {
    return (
      !(state.candidatesSearches === null) &&
      !(state.candidatesSorts === null) &&
      !(state.candidatesSummaries === null)
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineNetworkElements(state) {
    return (
      !(state.networkNodesReactions === null) &&
      !(state.networkNodesMetabolites === null) &&
      !(state.networkLinks === null)
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
