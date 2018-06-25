/*
This file is part of project Profondeur
(https://github.com/tcameronwaller/profondeur/).

Profondeur supports visual exploration and analysis of metabolic networks.
Copyright (C) 2018 Thomas Cameron Waller

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

Thomas Cameron Waller
tcameronwaller@gmail.com
Department of Biochemistry
University of Utah
Room 5520C, Emma Eccles Jones Medical Research Building
15 North Medical Drive East
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
    // TODO: Temporarily off to simplify...
    //self.represent(self);
  }
  /**
  * Evaluates the application's state and responds accordingly.
  */
  act(self) {
    // TODO: I'll need to update Model.determineApplicationControls...
    if (!Model.determineApplicationControls(self.state)) {
      ActionGeneral.initializeApplicationControls(self.state);
    } else if (!Model.determineMetabolismBaseInformation(self.state)) {
      ActionGeneral.loadMetabolismBaseInformation(self.state);
    } else if (!Model.determineMetabolismSupplementInformation(self.state)) {
      ActionGeneral.loadMetabolismSupplementInformation(self.state);
    } else if (!Model.determineMetabolismDerivationInformation(self.state)) {
      ActionGeneral.deriveState(self.state);
    } else {
      console.log("passed all act steps");
      ActionState.saveState(self.state);
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
      Model.determineApplicationControls(self.state) &&
      Model.determineMetabolismBaseInformation(self.state) &&
      Model.determineMetabolismSupplementInformation(self.state) &&
      Model.determineMetabolismDerivationInformation(self.state)
    ) {
      // Determine which views to restore.
      // Every change to application's state sets a parameter to control which
      // views to restore.
      // Interface view.
      if (self.state.viewsRestoration.interface) {
        // Restore views.
        self.state.views.interface = new ViewInterface({
          body: self.body,
          state: self.state,
          documentReference: self.document
        });
      }
      // Tip view.
      // Tip view always exists but is only visible when active.
      if (self.state.viewsRestoration.tip) {
        // Restore views.
        self.state.views.tip = new ViewTip({
          interfaceView: self.state.views.interface,
          state: self.state,
          documentReference: self.document,
          windowReference: self.window
        });
      }
      // Prompt view.
      // Prompt view always exists but is only visible when active.
      if (self.state.viewsRestoration.prompt) {
        // Restore views.
        self.state.views.prompt = new ViewPrompt({
          interfaceView: self.state.views.interface,
          state: self.state,
          documentReference: self.document,
          windowReference: self.window
        });
      }

      // TODO: Panel View has subordinate views...
      // TODO: maybe I don't want to create the subordinate views within panel view... it's messy
      // TODO: instead create those here within the Model...


      // Panel view.
      if (self.state.viewsRestoration.panel) {
        // Restore views.
        self.state.views.panel = new ViewPanel({
          interfaceView: self.state.views.interface,
          state: self.state,
          documentReference: self.document
        });

        // TODO: I might need to create subordinate views within PanelView...
        // TODO: yep... I think so... like state, network, subnetwork, and measurement
      }

      // TODO: Keep new summary view separate from the panel view...


      // Network view.
      // View has subordinate views.
      if (self.state.viewsRestoration.network) {
        // Restore views.
        self.state.views.network = new ViewNetwork({
          interfaceView: self.state.views.interface,
          tipView: self.state.views.tip,
          promptView: self.state.views.prompt,
          panelView: self.state.views.panel,
          state: self.state,
          documentReference: self.document
        });
      }
      // Subnetwork view.
      // View has subordinate views.
      if (self.state.viewsRestoration.subnetwork) {
        // Restore views.
        self.state.views.subnetwork = new ViewSubnetwork({
          interfaceView: self.state.views.interface,
          tipView: self.state.views.tip,
          promptView: self.state.views.prompt,
          panelView: self.state.views.panel,
          state: self.state,
          documentReference: self.document
        });
      }

      // TODO: Create measurement view...

      // TODO: Summary view will go at the very bottom of the panel view...
      if (false) {
        // Summary view.
        if (self.state.viewsRestoration.summary) {
          // Restore views.
          self.state.views.summary = new ViewSummary({
            interfaceView: self.state.views.interface,
            tipView: self.state.views.tip,
            promptView: self.state.views.prompt,
            panelView: self.state.views.panel,
            state: self.state,
            documentReference: self.document
          });
        }
        // TODO: no more control view...
        // Control view.
        // Control view has several subordinate views.
        if (self.state.viewsRestoration.control) {
          // Restore views.
          self.state.views.control = new ViewControl({
            interfaceView: self.state.views.interface,
            panelView: self.state.views.panel,
            tipView: self.state.views.tip,
            promptView: self.state.views.prompt,
            state: self.state,
            documentReference: self.document
          });
        }
      }

      // Exploration view.
      if (false) {
        if (self.state.viewsRestoration.exploration) {
          // Restore views.
          self.state.views.exploration = new ViewExploration({
            interfaceView: self.state.views.interface,
            tipView: self.state.views.tip,
            promptView: self.state.views.prompt,
            state: self.state,
            documentReference: self.document,
            windowReference: self.window
          });
        }
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
  static determineNetworkDiagram(state) {
    return (
      Model.determineSubnetworkNodesMinimum(state) &&
      (
        Model.determineSubnetworkNodesMaximum(state) ||
        Model.determineForceNetworkDiagram(state)
      )
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineSubnetworkNodesMinimum(state) {
    return (state.subnetworkNodesRecords.length > 0);
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineSubnetworkNodesMaximum(state) {
    return (state.subnetworkNodesRecords.length < 500);
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineForceNetworkDiagram(state) {
    return (state.forceNetworkDiagram);
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineSimulationPreparation(state) {
    return (
      state.simulationProgress.count > state.simulationProgress.preparation
    );
  }
  /**
  * Determines whether the application's state has specific information.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether the application's state matches criteria.
  */
  static determineSimulationCompletion(state) {
    return (state.simulationProgress.completion);
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
