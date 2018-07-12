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
* Actions that modify the application's state.
* This class does not store any attributes and does not require instantiation.
* This class stores methods that control actions that modify the application's
* state.
* The methods require a reference to the instance of the state.
* These methods also call external methods as necessary.
*/
class ActionSubnetwork {

  // Direct actions.

  /**
  * Restores values of application's variables for controls relevant to view.
  * @param {Object} state Application's state.
  */
  static restoreControls(state) {
    // Initialize relevant controls to default values.
    var subnetwork = ActionSubnetwork.initializeControls();
    var query = ActionQuery.initializeControls();
    // Copy information about application's state.
    var stateCopy = ActionState.createPersistence(state);
    // Replace information about relevant controls.
    var novelState = Object.assign(
      stateCopy,
      subnetwork,
      query
    );
    // Determine which views to restore.
    var novelViewsRestoration = ActionInterface.changeViewsRestoration({
      views: [
        "subnetwork",
        "query",
        "measurement",
        "summary",
        "exploration"
      ],
      type: true,
      viewsRestoration: state.viewsRestoration
    });
    // Derive dependent state.
    var dependentStateVariables = ActionSubnetwork.deriveState({
      networkNodesRecords: state.networkNodesRecords,
      networkLinksRecords: state.networkLinksRecords,
      viewsRestoration: novelViewsRestoration,
      state: novelState
    });
    // Compile information.
    var novelVariablesValues = {};
    var variablesValues = Object.assign(
      novelVariablesValues,
      subnetwork,
      query,
      dependentStateVariables
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Exports information.
  * @param {Object} state Application's state.
  */
  static export(state) {
    // Prepare, compile, and save information.
    // Entities.
    // Export information about entities that pass filters.
    ActionSubnetwork.exportEntities(state);
    // Network.
    // Export information about network's elements.
    ActionSubnetwork.exportNetworkElements(state);
  }
  /**
  * Exports information about metabolic entities.
  * @param {Object} state Application's state.
  */
  static exportEntities(state) {
    // Export information about entities within subnetwork.
    // Reactions.
    var nodesReactions = state.subnetworkNodesRecords.filter(function (record) {
      return record.type === "reaction";
    });
    var identifiersReactions = General.collectValueFromObjects(
      "identifier", nodesReactions
    );
    var reactionsSummary = Evaluation.createEntitiesSummary({
      type: "reaction",
      identifiers: identifiersReactions,
      reactions: state.reactions,
      metabolites: state.metabolites,
      reactionsSets: state.totalSetsReactions,
      metabolitesSets: state.totalSetsMetabolites,
      compartments: state.compartments,
      processes: state.processes
    });
    var reactionsSummaryString = General
    .convertRecordsStringTabSeparateTable(reactionsSummary);
    General.saveString("subnetwork_reactions.txt", reactionsSummaryString);
    // Metabolites.
    var nodesMetabolites = state
    .subnetworkNodesRecords.filter(function (record) {
      return record.type === "metabolite";
    });
    var identifiersMetabolites = General.collectValueFromObjects(
      "identifier", nodesMetabolites
    );
    var metabolitesSummary = Evaluation.createEntitiesSummary({
      type: "metabolite",
      identifiers: identifiersMetabolites,
      reactions: state.reactions,
      metabolites: state.metabolites,
      reactionsSets: state.totalSetsReactions,
      metabolitesSets: state.totalSetsMetabolites,
      compartments: state.compartments,
      processes: state.processes
    });
    var metabolitesSummaryString = General
    .convertRecordsStringTabSeparateTable(metabolitesSummary);
    General.saveString("subnetwork_metabolites.txt", metabolitesSummaryString);
  }
  /**
  * Exports information about network's elements.
  * @param {Object} state Application's state.
  */
  static exportNetworkElements(state) {
    // Export information about subnetwork's elements.
    // Nodes.
    var nodesExport = Evaluation.createNetworkNodesExport({
      nodesRecords: state.subnetworkNodesRecords,
      networkNodesReactions: state.networkNodesReactions,
      networkNodesMetabolites: state.networkNodesMetabolites,
      candidatesReactions: state.candidatesReactions,
      candidatesMetabolites: state.candidatesMetabolites,
      reactions: state.reactions,
      metabolites: state.metabolites
    });
    var nodesExportString = General
    .convertRecordsStringTabSeparateTable(nodesExport);
    General.saveString("subnetwork_nodes.txt", nodesExportString);
    // Links.
    var linksExport = Evaluation.createNetworkLinksExport({
      linksRecords: state.subnetworkLinksRecords,
      networkLinks: state.networkLinks
    });
    var linksExportString = General
    .convertRecordsStringTabSeparateTable(linksExport);
    General.saveString("subnetwork_links.txt", linksExportString);
  }
  /**
  * Changes the selections of active panels within the panel view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Category of panel.
  * @param {Object} parameters.state Application's state.
  */
  static changeView({category, state}) {
    // Multiple subordinate views within control view can be active
    // simultaneously.
    // Change the view's selection.
    if (state.subnetworkViews[category]) {
      var selection = false;
    } else {
      var selection = true;
    }
    // Create entry.
    var entry = {
      [category]: selection
    };
    var subnetworkViews = Object.assign(state.subnetworkViews, entry);
    // Determine which views to restore.
    var viewsRestoration = ActionInterface.changeViewsRestoration({
      views: [category],
      type: true,
      viewsRestoration: state.viewsRestoration
    });
    // Compile variables' values.
    var novelVariablesValues = {
      subnetworkViews: subnetworkViews,
      viewsRestoration: viewsRestoration
    };
    var variablesValues = novelVariablesValues;
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }

  // Indirect actions.

  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeControls() {
    // Initialize controls.
    var subnetworkViews = {
      query: false
    };
    // Compile information.
    var variablesValues = {
      subnetworkViews: subnetworkViews
    };
    // Return information.
    return variablesValues;
  }
  /**
  * Derives application's dependent state from controls relevant to view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.networkNodesRecords Information about
  * network's nodes.
  * @param {Array<Object>} parameters.networkLinksRecords Information about
  * network's links.
  * @param {Object<boolean>} parameters.viewsRestoration Information about
  * whether to restore each view.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Values of application's variables.
  */
  static deriveState({networkNodesRecords, networkLinksRecords, viewsRestoration, state} = {}) {
    // Derive state relevant to view.
    // Determine which views to restore.
    var novelViewsRestoration = ActionInterface.changeViewsRestoration({
      views: [
        "subnetwork",
        "query",
        "measurement",
        "summary",
        "exploration",
        "notice",
        "progress",
        "topology"
      ],
      type: true,
      viewsRestoration: viewsRestoration
    });
    // Initialize subordinate controls relevant to dependent state.
    var queryControls = ActionQuery.initializeControls();
    // Derive dependent state.
    var dependentStateVariables = ActionQuery.deriveState({
      networkNodesRecords: networkNodesRecords,
      networkLinksRecords: networkLinksRecords,
      subnetworkRestoration: queryControls.subnetworkRestoration,
      queryCombination: queryControls.queryCombination,
      viewsRestoration: novelViewsRestoration,
      state: state
    });
    // Compile information.
    var novelVariablesValues = {};
    var variablesValues = Object.assign(
      novelVariablesValues,
      queryControls,
      dependentStateVariables
    );
    // Return information.
    return variablesValues;
  }

}
