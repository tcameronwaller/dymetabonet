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
    // Set reference to browser's window.
    self.window = window;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to body.
    self.body = self.document.getElementsByTagName("body").item(0);
    // Evaluate application's state, respond, and represent accordingly.
    self.act(self);
    self.represent(self);
  }
  /**
  * Evaluates the application's state and responds accordingly.
  */
  act(self) {
    if (!Model.determineMetabolismBaseInformation(self.state)) {
      ActionGeneral.loadMetabolismBaseInformation(self.state);
    } else if (!Model.determineMetabolismSupplementInformation(self.state)) {
      ActionGeneral.loadMetabolismSupplementInformation(self.state);
    } else if (!Model.determineApplicationControls(self.state)) {
      ActionGeneral.initializeApplicationControls(self.state);
    } else if (!Model.determineMetabolismDerivationInformation(self.state)) {
      ActionGeneral.deriveCompleteMetabolismInformation(self.state);
    }
  }

  // TODO: Try to organize as much control of views as practical here within the Model.
  // TODO: I think the "controlContents" and "explorationContents" approach does work... so consider using it more.
  // TODO: Within ViewControl, create tabs and containers for all sub-views... I think
  // TODO: Those sub-views should then establish themselves within approriate containers from ViewControl.
  // TODO: Rendering is expensive, so don't use the display: none strategy
  // TODO: Instead, only create the content for ViewControl's sub-views that are active.
  // TODO: I think I can create a new state variable to control which sub-view is active? Maybe?

  /**
  * Evaluates the application's state and represents it accordingly in a visual
  * interface.
  * All alterations to the application's state initiate restoration of the
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
      Model.determineMetabolismBaseInformation(self.state) &&
      Model.determineMetabolismSupplementInformation(self.state) &&
      Model.determineApplicationControls(self.state) &&
      Model.determineMetabolismDerivationInformation(self.state)
    ) {
      // Interface view.
      var interfaceView = new ViewInterface({
        body: self.body,
        state: self.state,
        documentReference: self.document
      });
      // Tip view.
      // Tip view always exists but is only visible when active.
      var tipView = new ViewTip({
        interfaceView: interfaceView,
        state: self.state,
        documentReference: self.document,
        windowReference: self.window
      });
      // Prompt view.
      // Prompt view always exists but is only visible when active.
      var promptView = new ViewPrompt({
        interfaceView: interfaceView,
        state: self.state,
        documentReference: self.document,
        windowReference: self.window
      });

      // Panel view.
      var panelView = new ViewPanel({
        interfaceView: interfaceView,
        state: self.state,
        documentReference: self.document
      });

      // TODO: rename Detail View to Summary View

      // Summary view.
      var detailView = new ViewSummary({
        interfaceView: interfaceView,
        panelView: panelView,
        tipView: tipView,
        promptView: promptView,
        state: self.state,
        documentReference: self.document
      });
      // Control view.
      // Control view has several subordinate views.
      var controlView = new ViewControl({
        interfaceView: interfaceView,
        panelView: panelView,
        tipView: tipView,
        promptView: promptView,
        state: self.state,
        documentReference: self.document
      });
      // Exploration view.
      var explorationView = new ViewExploration({
        interfaceView: interfaceView,
        tipView: tipView,
        promptView: promptView,
        state: self.state,
        documentReference: self.document,
        windowReference: self.window
      });
    }
  }

  // Methods to evaluate application's state.

  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineMetabolismBaseInformation(state) {
    return (
      !(state.compartments === null) &&
      !(state.processes === null) &&
      !(state.metabolites === null) &&
      !(state.reactions === null)
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineMetabolismSupplementInformation(state) {
    return !(state.defaultSimplificationsMetabolites === null);
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineApplicationControls(state) {
    if (false) {
      state.variablesNamesControls.forEach(function (variable) {
        if (state[variable] === null) {
          console.log("problem with state's variable, " + variable);
        }
      });
    }
    return state.variablesNamesControls.every(function (variable) {
      return !(state[variable] === null);
    });
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineMetabolismDerivationInformation(state) {
    return (
      !(state.totalSetsReactions === null) &&
      !(state.totalSetsMetabolites === null) &&
      !(state.accessSetsReactions === null) &&
      !(state.accessSetsMetabolites === null) &&
      !(state.filterSetsReactions === null) &&
      !(state.filterSetsMetabolites === null) &&
      !(state.setsCardinalities === null) &&
      !(state.setsSummaries === null) &&
      !(state.reactionsSimplifications === null) &&
      !(state.metabolitesSimplifications === null) &&
      !(state.candidatesReactions === null) &&
      !(state.candidatesMetabolites === null) &&
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
  static determineSourceState(state) {
    return (Boolean(state.sourceState.name));
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineSourceData(state) {
    return (Boolean(state.sourceData.name));
  }
  /**
  * Determines tabs within control view.
  * @param {Object} state Application's state.
  * @returns {Array<string>} Names of tabs in control view.
  */
  static determineControlTabs(state) {
    return Object.keys(state.controlViews);
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
  static determineControlFilter(state) {
    return state.controlViews.filter;
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineControlSimplification(state) {
    return state.controlViews.simplification;
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
  static determineControlMeasurement(state) {
    return state.controlViews.measurement;
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineMetabolitesMeasurements(state) {
    return Object.keys(state.metabolitesMeasurements).length > 0;
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineRogueTraversal(state) {
    return (state.traversalRogueFocus.identifier.length > 0);
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineProximityTraversal(state) {
    return (
      (state.traversalProximityFocus.identifier.length > 0) &&
      (
        (state.traversalProximityDirection === "successors") ||
        (state.traversalProximityDirection === "neighbors") ||
        (state.traversalProximityDirection === "predecessors")
      ) &&
      (state.traversalProximityDepth > 0)
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determinePathTraversal(state) {
    return (
      (state.traversalPathSource.identifier.length > 0) &&
      (state.traversalPathTarget.identifier.length > 0) &&
      (
        (state.traversalPathDirection === "forward") ||
        (state.traversalPathDirection === "reverse")
      ) &&
      (state.traversalPathCount > 0)
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineConnectionTraversal(state) {
    return (
      (
        (state.traversalCombination === "union") ||
        (state.traversalCombination === "difference")
      ) &&
      (state.traversalConnectionTargets.length > 1) &&
      (state.traversalConnectionCount > 0)
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineSubnetworkNodes(state) {
    return (state.subnetworkNodesRecords.length > 0);
  }



  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineEntitySelection(state) {
    return (
      (state.entitySelection.type.length > 0) &&
      (state.entitySelection.node.length > 0) &&
      (state.entitySelection.candidate.length > 0) &&
      (state.entitySelection.entity.length > 0)
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.length Length factor in pixels.
  * @param {number} parameters.width Width of container in pixels.
  * @param {number} parameters.height Height of container in pixels.
  * @param {Object} parameters.state Application's state.
  * @returns {boolean} Whether the node's entity has a selection.
  */
  static determineViewSimulationDimensions({length, width, height, state} = {}) {
    return (
      (length === state.simulationDimensions.length) &&
      (width === state.simulationDimensions.width) &&
      (height === state.simulationDimensions.height)
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of entity, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  * @returns {boolean} Whether the node's entity has a selection.
  */
  static determineNodeEntitySelection({identifier, type, state} = {}) {
    return (
      (type === state.entitySelection.type) &&
      (identifier === state.entitySelection.node)
    );
  }
}
