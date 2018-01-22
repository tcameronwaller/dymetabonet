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
  act(self) {
    if (!Model.determineApplicationControls(self.state)) {
      Action.initializeApplicationControls(self.state);
    } else if (!Model.determineMetabolismBaseInformation(self.state)) {
      Action.loadMetabolismBaseInformation(self.state);
    } else if (!Model.determineMetabolismDerivationInformation(self.state)) {
      Action.deriveTotalMetabolismInformation(self.state);
    }
  }

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
  * All alterations to the application's state initiates restoration of the
  * application's interface.
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
    if (
      Model.determineApplicationControls(self.state) &&
      Model.determineMetabolismBaseInformation(self.state) &&
      Model.determineMetabolismDerivationInformation(self.state)
    ) {

      // TODO: Maybe also introduce a prompt view for pop-up controls on nodes and such.

      // Tip view.
      var tip = new TipView();
      // Control view.
      // TODO: Maybe it would be more orderly to pass ControlView the controlViews variable directly...
      var tabs = Object.keys(self.state.controlViews);
      var panels = tabs.filter(function (tab) {
        return self.state.controlViews[tab];
      });
      var controlContents = {
        tabs: tabs,
        panels: panels
      };
      var control = new ControlView({
        tip: tip,
        contents: controlContents,
        state: self.state
      });
      if (Model.determineControlState(self.state)) {
        // State view.
        new StateView({
          tip: tip,
          control: control,
          state: self.state
        });
      }
      if (Model.determineControlSet(self.state)) {
        // Set view.
        new SetView({
          tip: tip,
          control: control,
          state: self.state
        });
      }
      if (Model.determineControlCandidacy(self.state)) {
        // Candidacy view.
        new CandidacyView({
          tip: tip,
          control: control,
          state: self.state
        });
      }
      if (Model.determineControlTraversal(self.state)) {
        // Traversal view.
        //new TraversalView({
        //  tip: tip,
        //  control: control,
        //  state: self.state
        //});
      }
      // Exploration view.
      if (!Model.determineTopology(self.state)) {
        // Exploration view.
        var explorationContents = ["summary"];
        var exploration = new ExplorationView({
          contents: explorationContents,
          tip: tip,
          state: self.state
        });
        // Summary view.
        new SummaryView({
          tip: tip,
          exploration: exploration,
          state: self.state
        });
      } else {
        // Exploration view.
        var explorationContents = ["topology"];
        var exploration = new ExplorationView({
          contents: explorationContents,
          tip: tip,
          state: self.state
        });
        // Topology view.
        new TopologyView({
          tip: tip,
          exploration: exploration,
          state: self.state
        });
      }
    }
  }

  // Methods to evaluate application's state.

  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineApplicationControls(state) {
    return (
      //(state.source === null) &&
      !(state.controlViews === null) &&
      !(state.topology === null) &&
      !(state.topologyNovelty === null) &&
      !(state.setsFilters === null) &&
      !(state.setsEntities === null) &&
      !(state.setsFilter === null) &&
      !(state.setsSearches === null) &&
      !(state.setsSorts === null) &&
      !(state.compartmentalization === null) &&
      !(state.reactionsSimplifications === null) &&
      !(state.metabolitesSimplifications === null) &&
      !(state.candidatesSearches === null) &&
      !(state.candidatesSorts === null)
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineMetabolismBaseInformation(state) {
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
  static determineMetabolismDerivationInformation(state) {
    return (
      !(state.totalReactionsSets === null) &&
      !(state.totalMetabolitesSets === null) &&
      !(state.accessReactionsSets === null) &&
      !(state.accessMetabolitesSets === null) &&
      !(state.filterReactionsSets === null) &&
      !(state.filterMetabolitesSets === null) &&
      !(state.setsCardinalities === null) &&
      !(state.setsSummaries === null) &&
      !(state.reactionsCandidates === null) &&
      !(state.metabolitesCandidates === null) &&
      !(state.candidatesSummaries === null) &&
      !(state.networkNodesReactions === null) &&
      !(state.networkNodesMetabolites === null) &&
      !(state.networkLinks === null) &&
      !(state.networkNodesRecords === null) &&
      !(state.networkLinksRecords === null) &&
      !(state.subnetworkNodesRecords === null) &&
      !(state.subnetworkLinksRecords === null)
    );
  }
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
    return state.controlViews.state;
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineControlSet(state) {
    return state.controlViews.set;
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineControlCandidacy(state) {
    return state.controlViews.candidacy;
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineControlTraversal(state) {
    return state.controlViews.traversal;
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
  static determineTopologyNovelty(state) {
    return state.topologyNovelty;
  }
}
