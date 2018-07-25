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
class ActionContext {

  // Direct actions.

  /**
  * Changes specification of compartmentalization's relevance.
  * @param {Object} state Application's state.
  */
  static changeCompartmentalization(state) {
    // Determine compartmentalization.
    if (state.compartmentalization) {
      var compartmentalization = false;
    } else {
      var compartmentalization = true;
    }
    // Initialize relevant controls to default values.
    var context = ActionContext.initializeControls();
    // Derive dependent state.
    var dependentStateVariables = ActionContext.deriveState({
      compartmentalization: compartmentalization,
      simplificationPriority: context.simplificationPriority,
      defaultSimplifications: context.defaultSimplifications,
      candidatesSearches: state.candidatesSearches,
      candidatesSorts: state.candidatesSorts,
      defaultSimplificationsMetabolites: state
      .defaultSimplificationsMetabolites,
      reactionsSimplifications: state.reactionsSimplifications,
      metabolitesSimplifications: state.metabolitesSimplifications,
      filterSetsReactions: state.filterSetsReactions,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartments: state.compartments,
      processes: state.processes,
      viewsRestoration: state.viewsRestoration,
      state: state
    });
    // Compile variables' values.
    var novelVariablesValues = {
      simplificationPriority: context.simplificationPriority,
      defaultSimplifications: context.defaultSimplifications,
      compartmentalization: compartmentalization
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      dependentStateVariables
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes whether to create default simplifications.
  * @param {Object} state Application's state.
  */
  static changeDefaultSimplifications(state) {
    // Change simplification priority.
    var simplificationPriority = "default";
    // Determine default simplifications.
    // Determine simplifications of candidate entities.
    if (state.defaultSimplifications) {
      // Change default simplifications to false.
      var defaultSimplifications = false;
    } else {
      // Change default simplifications to true.
      var defaultSimplifications = true;
    }
    // Derive dependent state.
    var dependentStateVariables = ActionContext.deriveState({
      compartmentalization: state.compartmentalization,
      simplificationPriority: simplificationPriority,
      defaultSimplifications: defaultSimplifications,
      candidatesSearches: state.candidatesSearches,
      candidatesSorts: state.candidatesSorts,
      defaultSimplificationsMetabolites: state
      .defaultSimplificationsMetabolites,
      reactionsSimplifications: state.reactionsSimplifications,
      metabolitesSimplifications: state.metabolitesSimplifications,
      filterSetsReactions: state.filterSetsReactions,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartments: state.compartments,
      processes: state.processes,
      viewsRestoration: state.viewsRestoration,
      state: state
    });
    // Compile variables' values.
    var novelVariablesValues = {
      simplificationPriority: simplificationPriority,
      defaultSimplifications: defaultSimplifications
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      dependentStateVariables
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes explicit and implicit simplifications.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {string} parameters.category Category of entities, metabolites or
  * reactions.
  * @param {string} parameters.method Method for simplification, omission or
  * replication.
  * @param {Object} parameters.state Application's state.
  */
  static changeSimplification({identifier, category, method, state} = {}) {
    // Change simplification priority.
    var simplificationPriority = "custom";
    // Change explicit and implicit designations of entities for simplification.
    var simplifications = Candidacy.changeSimplifications({
      identifier: identifier,
      category: category,
      method: method,
      candidatesReactions: state.candidatesReactions,
      candidatesMetabolites: state.candidatesMetabolites,
      reactionsSets: state.filterSetsReactions,
      reactions: state.reactions,
      compartmentalization: state.compartmentalization,
      reactionsSimplifications: state.reactionsSimplifications,
      metabolitesSimplifications: state.metabolitesSimplifications
    });
    // Derive dependent state.
    var dependentStateVariables = ActionContext.deriveState({
      compartmentalization: state.compartmentalization,
      simplificationPriority: simplificationPriority,
      defaultSimplifications: state.defaultSimplifications,
      candidatesSearches: state.candidatesSearches,
      candidatesSorts: state.candidatesSorts,
      defaultSimplificationsMetabolites: state
      .defaultSimplificationsMetabolites,
      reactionsSimplifications: simplifications.reactionsSimplifications,
      metabolitesSimplifications: simplifications.metabolitesSimplifications,
      filterSetsReactions: state.filterSetsReactions,
      reactions: state.reactions,
      metabolites: state.metabolites,
      compartments: state.compartments,
      processes: state.processes,
      viewsRestoration: state.viewsRestoration,
      state: state
    });
    // Compile variables' values.
    var novelVariablesValues = {
      simplificationPriority: simplificationPriority
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      simplifications,
      dependentStateVariables
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }

  // Indirect actions.

  // TODO: I might want to support default simplifications for both metabolites and reactions
  // TODO: as the procedure in utility_candidacy is written, it only considers default metabolite simplifications...

  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeControls() {
    // Initialize controls.
    var compartmentalization = false;
    var simplificationPriority = "default";
    var defaultSimplifications = true;
    var candidatesSearches = Candidacy.createInitialCandidatesSearches();
    var candidatesSorts = Candidacy.createInitialCandidatesSorts();
    // Compile information.
    var variablesValues = {
      compartmentalization: compartmentalization,
      simplificationPriority: simplificationPriority,
      defaultSimplifications: defaultSimplifications,
      candidatesSearches: candidatesSearches,
      candidatesSorts: candidatesSorts
    };
    // Return information.
    return variablesValues;
  }
  /**
  * Derives application's dependent state from controls relevant to view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {string} parameters.simplificationPriority Whether to prioritize
  * derivation of default or custom simplifications.
  * @param {boolean} parameters.defaultSimplifications Whether to include
  * simplifications for default entities.
  * @param {Object<string>} parameters.candidatesSearches Searches to filter
  * candidates' summaries.
  * @param {Object<Object<string>>} parameters.candidatesSorts Specifications to
  * sort candidates' summaries.
  * @param {Array<string>} parameters.defaultSimplificationsMetabolites
  * Identifiers of metabolites for which to create default simplifications.
  * @param {Object<Object>} parameters.reactionsSimplifications Information
  * about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications Information
  * about simplification of metabolites.
  * @param {Object<Object>} parameters.filterSetsReactions Information about
  * reactions' metabolites and sets that pass filtration by filter method.
  * @param {Object} parameters.metabolites Information about metabolites.
  * @param {Object} parameters.reactions Information about reactions.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @param {Object<boolean>} parameters.viewsRestoration Information about
  * whether to restore each view.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Values of application's variables.
  */
  static deriveSubordinateState({compartmentalization, simplificationPriority, defaultSimplifications, candidatesSearches, candidatesSorts, defaultSimplificationsMetabolites, reactionsSimplifications, metabolitesSimplifications, filterSetsReactions, metabolites, reactions, compartments, processes, viewsRestoration, state} = {}) {
    // Determine candidate entities and prepare their summaries.
    var candidatesSummaries = Candidacy.collectCandidatesPrepareSummaries({
      reactionsSets: filterSetsReactions,
      reactions: reactions,
      metabolites: metabolites,
      compartmentalization: compartmentalization,
      candidatesSearches: candidatesSearches,
      candidatesSorts: candidatesSorts,
      compartments: compartments
    });
    // Determine which views to restore.
    var novelViewsRestoration = ActionInterface.changeViewsRestoration({
      views: [
        "context",
      ],
      type: true,
      viewsRestoration: viewsRestoration
    });
    // Compile information.
    var novelVariablesValues = {
      viewsRestoration: novelViewsRestoration
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      candidatesSummaries
    );
    // Return information.
    return variablesValues;
  }
  /**
  * Derives simplifications for metabolites and reactions according to context.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {string} parameters.simplificationPriority Whether to prioritize
  * derivation of default or custom simplifications.
  * @param {boolean} parameters.defaultSimplifications Whether to include
  * simplifications for default entities.
  * @param {Array<string>} parameters.defaultSimplificationsMetabolites
  * Identifiers of metabolites for which to create default simplifications.
  * @param {Object<Object>} parameters.reactionsSimplifications Information
  * about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications Information
  * about simplification of metabolites.
  * @param {Object<Object>} parameters.candidatesReactions Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.candidatesMetabolites Information about
  * candidate metabolites.
  * @param {Object<Object>} parameters.filterSetsReactions Information about
  * reactions' metabolites and sets that pass filtration by filter method.
  * @param {Object} parameters.metabolites Information about metabolites.
  * @param {Object} parameters.reactions Information about reactions.
  * @returns {Object} Values of application's variables.
  */
  static deriveSimplifications({compartmentalization, simplificationPriority, defaultSimplifications, defaultSimplificationsMetabolites, reactionsSimplifications, metabolitesSimplifications, candidatesReactions, candidatesMetabolites, filterSetsReactions, metabolites, reactions} = {}) {
    // Determine simplifications of candidate entities.
    if (simplificationPriority === "default") {
      var novelDefaultSimplifications = defaultSimplifications;
      if (defaultSimplifications) {
        // Create default simplifications.
        // Discard any previous simplifications.
        var simplifications = Candidacy.createIncludeDefaultSimplifications({
          defaultSimplificationsMetabolites: defaultSimplificationsMetabolites,
          candidatesReactions: candidatesReactions,
          candidatesMetabolites: candidatesMetabolites,
          reactionsSets: filterSetsReactions,
          reactions: reactions,
          compartmentalization: compartmentalization,
          reactionsSimplifications: {},
          metabolitesSimplifications: {}
        });
      } else {
        // Remove default simplifications.
        // Discard any previous simplifications.
        var simplifications = Candidacy.removeDefaultSimplifications({
          defaultSimplificationsMetabolites: defaultSimplificationsMetabolites,
          candidatesReactions: candidatesReactions,
          candidatesMetabolites: candidatesMetabolites,
          reactionsSets: filterSetsReactions,
          reactions: reactions,
          compartmentalization: compartmentalization,
          reactionsSimplifications: {},
          metabolitesSimplifications: {}
        });
      }
    } else if (simplificationPriority === "custom") {
      // Determine whether simplifications match defaults.
      var novelDefaultSimplifications = Candidacy
      .determineDefaultSimplifications({
        defaultSimplificationsMetabolites: defaultSimplificationsMetabolites,
        candidatesMetabolites: candidatesMetabolites,
        metabolitesSimplifications: metabolitesSimplifications
      });
      // Compile simplifications.
      var simplifications = {
        metabolitesSimplifications: metabolitesSimplifications,
        reactionsSimplifications: reactionsSimplifications
      };
    }
    // Compile information.
    var novelVariablesValues = {
      defaultSimplifications: novelDefaultSimplifications,
      metabolitesSimplifications: simplifications.metabolitesSimplifications,
      reactionsSimplifications: simplifications.reactionsSimplifications
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
    );
    // Return information.
    return variablesValues;
  }
  /**
  * Derives application's dependent state from controls relevant to view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.compartmentalization Whether
  * compartmentalization is relevant.
  * @param {string} parameters.simplificationPriority Whether to prioritize
  * derivation of default or custom simplifications.
  * @param {boolean} parameters.defaultSimplifications Whether to include
  * simplifications for default entities.
  * @param {Object<string>} parameters.candidatesSearches Searches to filter
  * candidates' summaries.
  * @param {Object<Object<string>>} parameters.candidatesSorts Specifications to
  * sort candidates' summaries.
  * @param {Array<string>} parameters.defaultSimplificationsMetabolites
  * Identifiers of metabolites for which to create default simplifications.
  * @param {Object<Object>} parameters.reactionsSimplifications Information
  * about simplification of reactions.
  * @param {Object<Object>} parameters.metabolitesSimplifications Information
  * about simplification of metabolites.
  * @param {Object<Object>} parameters.filterSetsReactions Information about
  * reactions' metabolites and sets that pass filtration by filter method.
  * @param {Object} parameters.metabolites Information about metabolites.
  * @param {Object} parameters.reactions Information about reactions.
  * @param {Object} parameters.compartments Information about compartments.
  * @param {Object} parameters.processes Information about processes.
  * @param {Object<boolean>} parameters.viewsRestoration Information about
  * whether to restore each view.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Values of application's variables.
  */
  static deriveState({compartmentalization, simplificationPriority, defaultSimplifications, candidatesSearches, candidatesSorts, defaultSimplificationsMetabolites, reactionsSimplifications, metabolitesSimplifications, filterSetsReactions, metabolites, reactions, compartments, processes, viewsRestoration, state} = {}) {
    // Derive state relevant to view.
    var proximalVariables = ActionContext.deriveSubordinateState({
      compartmentalization: compartmentalization,
      simplificationPriority: simplificationPriority,
      defaultSimplifications: defaultSimplifications,
      candidatesSearches: candidatesSearches,
      candidatesSorts: candidatesSorts,
      defaultSimplificationsMetabolites: defaultSimplificationsMetabolites,
      reactionsSimplifications: reactionsSimplifications,
      metabolitesSimplifications: metabolitesSimplifications,
      filterSetsReactions: filterSetsReactions,
      reactions: reactions,
      metabolites: metabolites,
      compartments: compartments,
      processes: processes,
      viewsRestoration: viewsRestoration,
      state: state
    });
    // Determine simplifications of candidate entities.
    var simplifications = ActionContext.deriveSimplifications({
      compartmentalization: compartmentalization,
      simplificationPriority: simplificationPriority,
      defaultSimplifications: defaultSimplifications,
      candidatesSearches: candidatesSearches,
      candidatesSorts: candidatesSorts,
      defaultSimplificationsMetabolites: defaultSimplificationsMetabolites,
      reactionsSimplifications: reactionsSimplifications,
      metabolitesSimplifications: metabolitesSimplifications,
      candidatesReactions: proximalVariables.candidatesReactions,
      candidatesMetabolites: proximalVariables.candidatesMetabolites,
      filterSetsReactions: filterSetsReactions,
      reactions: reactions,
      metabolites: metabolites,
    });
    // Create network's elements.
    var networkElements = Network.createNetworkElements({
      candidatesReactions: proximalVariables.candidatesReactions,
      candidatesMetabolites: proximalVariables.candidatesMetabolites,
      reactionsSimplifications: simplifications.reactionsSimplifications,
      metabolitesSimplifications: simplifications.metabolitesSimplifications,
      reactions: reactions,
      metabolites: metabolites,
      compartmentalization: compartmentalization
    });
    // Determine summary information about network.
    var networkSummary = Network.determineNetworkSummary({
      networkNodesMetabolites: networkElements.networkNodesMetabolites,
      networkNodesReactions: networkElements.networkNodesReactions,
      networkLinks: networkElements.networkLinks
    });
    // Determine which views to restore.
    var novelViewsRestoration = ActionInterface.changeViewsRestoration({
      views: [
        "network",
        "context",
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
    // Derive dependent state.
    var distalVariables = ActionSubnetwork.deriveState({
      networkNodesRecords: networkElements.networkNodesRecords,
      networkLinksRecords: networkElements.networkLinksRecords,
      viewsRestoration: novelViewsRestoration,
      state: state
    });
    // Compile information.
    var novelVariablesValues = {
      networkSummary: networkSummary
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      proximalVariables,
      simplifications,
      networkElements,
      distalVariables
    );
    // Return information.
    return variablesValues;
  }

}
