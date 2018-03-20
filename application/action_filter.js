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
class ActionFilter {

  /**
  * Initializes values of variables of application's controls for set view.
  * @param {Object} state Application's state.
  */
  static initializeControls() {
    // Initialize controls.
    var setsFilters = Attribution.createInitialSetsFilters();
    var setsEntities = "metabolites";
    var setsFilter = false;
    var setsSearches = Cardinality.createInitialSetsSearches();
    var setsSorts = Cardinality.createInitialSetsSorts();
    // Compile information.
    var variablesValues = {
      setsFilters: setsFilters,
      setsEntities: setsEntities,
      setsFilter: setsFilter,
      setsSearches: setsSearches,
      setsSorts: setsSorts
    };
    // Return information.
    return variablesValues;
  }
  /**
  * Restores values of variables of application's controls for set view.
  * @param {Object} state Application's state.
  */
  static restoreControls(state) {
    // Initialize controls for set view.
    var setViewControls = ActionFilter.initializeControls();
    // Determine current entities' attribution to sets.
    var currentEntitiesSets = Attribution.determineCurrentEntitiesSets({
      setsFilters: setViewControls.setsFilters,
      totalSetsReactions: state.totalSetsReactions,
      totalSetsMetabolites: state.totalSetsMetabolites,
      reactions: state.reactions
    });
    // Determine sets' cardinalities and prepare sets' summaries.
    var setsCardinalitiesSummaries = Cardinality
    .determineSetsCardinalitiesSummaries({
      setsEntities: setViewControls.setsEntities,
      setsFilter: setViewControls.setsFilter,
      accessSetsReactions: currentEntitiesSets.accessSetsReactions,
      accessSetsMetabolites: currentEntitiesSets.accessSetsMetabolites,
      filterSetsReactions: currentEntitiesSets.filterSetsReactions,
      filterSetsMetabolites: currentEntitiesSets.filterSetsMetabolites,
      setsSearches: setViewControls.setsSearches,
      setsSorts: setViewControls.setsSorts,
      compartments: state.compartments,
      processes: state.processes
    });
    // Determine candidate entities and prepare their summaries.
    var candidatesSummaries = Candidacy.collectCandidatesPrepareSummaries({
      reactionsSets: currentEntitiesSets.filterSetsReactions,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartmentalization: state.compartmentalization,
      candidatesSearches: state.candidatesSearches,
      candidatesSorts: state.candidatesSorts,
      compartments: state.compartments
    });
    // Determine simplifications of candidate entities.
    // Restore simplifications.
    var simplifications = Candidacy.restoreSimplifications({
      candidatesReactions: candidatesSummaries.candidatesReactions,
      candidatesMetabolites: candidatesSummaries.candidatesMetabolites,
      reactionsSets: currentEntitiesSets.filterSetsReactions,
      reactions: state.reactions,
      compartmentalization: state.compartmentalization,
      reactionsSimplifications: state.reactionsSimplifications,
      metabolitesSimplifications: state.metabolitesSimplifications
    });
    // Determine default simplifications.
    // Determine whether simplifications exist for all default entities.
    var defaultSimplifications = Candidacy.determineDefaultSimplifications({
      defaultSimplificationsMetabolites: state
      .defaultSimplificationsMetabolites,
      candidatesMetabolites: candidatesSummaries.candidatesMetabolites,
      metabolitesSimplifications: simplifications.metabolitesSimplifications
    });
    // Create network's elements.
    var networkElements = Network.createNetworkElements({
      candidatesReactions: candidatesSummaries.candidatesReactions,
      candidatesMetabolites: candidatesSummaries.candidatesMetabolites,
      reactionsSimplifications: simplifications.reactionsSimplifications,
      metabolitesSimplifications: simplifications.metabolitesSimplifications,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartmentalization: state.compartmentalization
    });
    // Create subnetwork's elements.
    var subnetworkElements = Network.copyNetworkElementsRecords({
      networkNodesRecords: networkElements.networkNodesRecords,
      networkLinksRecords: networkElements.networkLinksRecords
    });
    // Initialize whether to force representation of topology for networks of
    // excessive scale.
    var forceTopology = false;
    // Compile variables' values.
    var novelVariablesValues = {
      defaultSimplifications: defaultSimplifications,
      forceTopology: forceTopology
    };
    // Compile variables' values.
    var variablesValues = Object.assign(
      novelVariablesValues,
      setViewControls,
      currentEntitiesSets,
      setsCardinalitiesSummaries,
      candidatesSummaries,
      simplifications,
      networkElements,
      subnetworkElements
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the values of attributes to apply as filters to sets.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Value of attribute in current selection.
  * @param {string} parameters.attribute Attribute in current selection.
  * @param {Object} state Application's state.
  */
  static changeSetsFilters({value, attribute, state} = {}) {
    // Record set's selection for filters.
    var setsFilters = Attribution.recordSetSelectionFilters({
      value: value,
      attribute: attribute,
      setsFilters: state.setsFilters
    });
    // Determine current entities' attribution to sets.
    var currentEntitiesSets = Attribution.determineCurrentEntitiesSets({
      setsFilters: setsFilters,
      totalSetsReactions: state.totalSetsReactions,
      totalSetsMetabolites: state.totalSetsMetabolites,
      reactions: state.reactions
    });
    // Determine sets' cardinalities and prepare sets' summaries.
    var setsCardinalitiesSummaries = Cardinality
    .determineSetsCardinalitiesSummaries({
      setsEntities: state.setsEntities,
      setsFilter: state.setsFilter,
      accessSetsReactions: currentEntitiesSets.accessSetsReactions,
      accessSetsMetabolites: currentEntitiesSets.accessSetsMetabolites,
      filterSetsReactions: currentEntitiesSets.filterSetsReactions,
      filterSetsMetabolites: currentEntitiesSets.filterSetsMetabolites,
      setsSearches: state.setsSearches,
      setsSorts: state.setsSorts,
      compartments: state.compartments,
      processes: state.processes
    });
    // Determine candidate entities and prepare their summaries.
    var candidatesSummaries = Candidacy.collectCandidatesPrepareSummaries({
      reactionsSets: currentEntitiesSets.filterSetsReactions,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartmentalization: state.compartmentalization,
      candidatesSearches: state.candidatesSearches,
      candidatesSorts: state.candidatesSorts,
      compartments: state.compartments
    });
    // Determine simplifications of candidate entities.
    // Restore simplifications.
    var simplifications = Candidacy.restoreSimplifications({
      candidatesReactions: candidatesSummaries.candidatesReactions,
      candidatesMetabolites: candidatesSummaries.candidatesMetabolites,
      reactionsSets: currentEntitiesSets.filterSetsReactions,
      reactions: state.reactions,
      compartmentalization: state.compartmentalization,
      reactionsSimplifications: state.reactionsSimplifications,
      metabolitesSimplifications: state.metabolitesSimplifications
    });
    // Determine default simplifications.
    // Determine whether simplifications exist for all default entities.
    var defaultSimplifications = Candidacy.determineDefaultSimplifications({
      defaultSimplificationsMetabolites: state
      .defaultSimplificationsMetabolites,
      candidatesMetabolites: candidatesSummaries.candidatesMetabolites,
      metabolitesSimplifications: simplifications.metabolitesSimplifications
    });
    // Create network's elements.
    var networkElements = Network.createNetworkElements({
      candidatesReactions: candidatesSummaries.candidatesReactions,
      candidatesMetabolites: candidatesSummaries.candidatesMetabolites,
      reactionsSimplifications: simplifications.reactionsSimplifications,
      metabolitesSimplifications: simplifications.metabolitesSimplifications,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartmentalization: state.compartmentalization
    });
    // Create subnetwork's elements.
    var subnetworkElements = Network.copyNetworkElementsRecords({
      networkNodesRecords: networkElements.networkNodesRecords,
      networkLinksRecords: networkElements.networkLinksRecords
    });
    // Initialize whether to force representation of topology for networks of
    // excessive scale.
    var forceTopology = false;
    // Compile variables' values.
    var novelVariablesValues = {
      setsFilters: setsFilters,
      defaultSimplifications: defaultSimplifications,
      forceTopology: forceTopology
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      currentEntitiesSets,
      setsCardinalitiesSummaries,
      candidatesSummaries,
      simplifications,
      networkElements,
      subnetworkElements
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of entities of interest for the sets' summary.
  * @param {Object} state Application's state.
  */
  static changeSetsEntities(state) {
    // Determine entities of interest.
    if (state.setsEntities === "metabolites") {
      var setsEntities = "reactions";
    } else if (state.setsEntities === "reactions") {
      var setsEntities = "metabolites";
    }
    // Determine sets' cardinalities and prepare sets' summaries.
    var setsCardinalitiesSummaries = Cardinality
    .determineSetsCardinalitiesSummaries({
      setsEntities: setsEntities,
      setsFilter: state.setsFilter,
      accessSetsReactions: state.accessSetsReactions,
      accessSetsMetabolites: state.accessSetsMetabolites,
      filterSetsReactions: state.filterSetsReactions,
      filterSetsMetabolites: state.filterSetsMetabolites,
      setsSearches: state.setsSearches,
      setsSorts: state.setsSorts,
      compartments: state.compartments,
      processes: state.processes
    });
    // Compile variables' values.
    var novelVariablesValues = {
      setsEntities: setsEntities
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      setsCardinalitiesSummaries
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the selection of filter for the sets' summary.
  * @param {Object} state Application's state.
  */
  static changeSetsFilter(state) {
    // Determine filter.
    if (state.setsFilter) {
      var setsFilter = false;
    } else {
      var setsFilter = true;
    }
    // Determine sets' cardinalities and prepare sets' summaries.
    var setsCardinalitiesSummaries = Cardinality
    .determineSetsCardinalitiesSummaries({
      setsEntities: state.setsEntities,
      setsFilter: setsFilter,
      accessSetsReactions: state.accessSetsReactions,
      accessSetsMetabolites: state.accessSetsMetabolites,
      filterSetsReactions: state.filterSetsReactions,
      filterSetsMetabolites: state.filterSetsMetabolites,
      setsSearches: state.setsSearches,
      setsSorts: state.setsSorts,
      compartments: state.compartments,
      processes: state.processes
    });
    // Compile variables' values.
    var novelVariablesValues = {
      setsFilter: setsFilter
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      setsCardinalitiesSummaries
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }

}
