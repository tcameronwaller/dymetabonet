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
* The application's state.
* This class stores values of variables that define the application's state.
* The class accepts and stores appropriate values of variables that define the
* application's state.
*/
class State {
  /**
  * Initializes an instance of the class.
  */
  constructor() {
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Specify state's variables.
    // Controls
    var interfaceControls = [
      // Variable "views" stores references to instances of views in interface.
      "views",
      // Variable "viewsRestoration" stores information about whether to restore
      // each view in interface.
      "viewsRestoration"
    ];
    var promptControls = [
      // Variable "prompt" stores information about the type and position of the
      // prompt view within the interface.
      "prompt"
    ];
    var controlControls = [
      // Variable "controlViews" stores information about whether each subordinate
      // view within the panel view is active.
      "controlViews"
    ];
    var stateControls = [
      // Variable "sourceState" stores a reference to a file on client's system
      // that is a source of information.
      "sourceState"
    ];
    var networkControls = [
      // Variable "networkViews" stores information about whether each
      // subordinate view within the network view is active.
      "networkViews"
    ];
    var filterControls = [
      // Variable "setsFilters" stores information about selections of sets
      // by values of entities' variables to apply as filters.
      // The purpose of variable "setsFilters" is to define filters for
      // filtration of entities by their values of variables.
      // Information includes references to variables "compartments" and
      // "processes".
      "setsFilters",
      // Variable "setsEntities" stores information about the type of entities,
      // metabolites or reactions, to represent in the sets' summary.
      "setsEntities",
      // Variable "setsFilter" stores information about whether to represent
      // entities and their values of variables after filtration in the sets'
      // summary.
      "setsFilter",
      // Variable "setsSearches" stores information about searches' strings by
      // which to filter the summaries of sets' cardinalities.
      "setsSearches",
      // Variable "setsSorts" stores information about the sort criteria and
      // orders for the summaries of sets' cardinalities.
      // Information includes references to variables "compartments" and
      // "processes".
      "setsSorts"
    ];
    var contextControls = [
      // Variable "compartmentalization" stores information about whether to
      // represent compartmentalization of metabolites.
      "compartmentalization",
      // Variable "defaultSimplifications" stores information about whether to
      // simplify default entities.
      "defaultSimplifications",
      // Variable "candidatesSearches" stores information about searches'
      // strings by which to filter the summaries of candidates' degrees.
      "candidatesSearches",
      // Variable "candidatesSorts" stores information about the sort criteria
      // and orders for the summaries of candidates' degrees.
      // Information includes references to variables "candidatesReactions" and
      // "candidatesMetabolites".
      "candidatesSorts"
    ];
    var subnetworkControls = [
      // Variable "subnetworkViews" stores information about whether each
      // subordinate view within the subnetwork view is active.
      "subnetworkViews"
    ];
    var queryControls = [
      // Variable "queryCombination" stores information about the strategy,
      // union or difference, for combination of sets of nodes from queries
      // in query view.
      "queryCombination",
      // Variable "queryType" stores information about the type of
      // query, rogue, proximity, or path, for which to create controls in
      // query view.
      "queryType",
      // Variable "queryRogueFocus" stores information about a network's
      // single node to include or exclude from the subnetwork.
      // Information includes references to variables
      // "networkNodesMetabolites", "networkNodesReactions", and
      // "networkNodesRecords".
      "queryRogueFocus",
      // Variable "queryProximityFocus" stores information about a
      // network's single focal node for proximity query.
      // Information includes references to variables
      // "networkNodesMetabolites", "networkNodesReactions", and
      // "networkNodesRecords".
      "queryProximityFocus",
      // Variable "queryProximityDirection" stores information about the
      // direction of proximity query, either following successors,
      // neighbors, or predecessors from the focal node.
      "queryProximityDirection",
      // Variable "queryProximityDepth" stores information about the depth
      // of the proximity query in count of links from the focal node.
      "queryProximityDepth",
      // Variable "queryPathSource" stores information about a network's
      // single node for the source of path query.
      // Information includes references to variables
      // "networkNodesMetabolites", "networkNodesReactions", and
      //"networkNodesRecords".
      "queryPathSource",
      // Variable "queryPathTarget" stores information about a network's
      // single node for the target of path query.
      // Information includes references to variables
      // "networkNodesMetabolites", "networkNodesReactions", and
      //"networkNodesRecords".
      "queryPathTarget",
      // Variable "queryPathDirection" stores information about the
      // direction of path query, either forward, reverse, or both.
      "queryPathDirection",
      // Variable "queryPathCount" stores information about the count of
      // simple shortest paths to collect by path query.
      "queryPathCount",
      // Variable "queryConnectionTarget" stores information about a
      // network's node to include or exclude from targets.
      // Information includes references to variables
      // "networkNodesMetabolites", "networkNodesReactions", and
      //"networkNodesRecords".
      "queryConnectionTarget",
      // Variable "queryConnectionTargets" stores information about a
      // network's nodes between which to traverse paths.
      // Information includes references to variables
      // "networkNodesMetabolites", "networkNodesReactions", and
      //"networkNodesRecords".
      "queryConnectionTargets",
      // Variable "queryConnectionCount" stores information about the count
      // of simple shortest paths to collect by path query between each pair
      // of targets.
      "queryConnectionCount"
    ];
    var measurementControls = [
      // Variable "sourceData" stores a reference to a file on client's system
      // that is a source of data for measurements of metabolites.
      "sourceData",
      // Variable "measurementReference" stores information about the reference
      // to use for association of measurements to metabolites.
      "measurementReference",
      // Variable "measurementsSort" stores information about the sort criterion
      // and order for the summary of measurements and their associations to
      // metabolites.
      // Information includes references to variables "metabolites" and
      // "metabolitesMeasurements".
      "measurementsSort"
    ];
    var summaryControls = [];
    var explorationControls = [
      // Variable "forceNetworkDiagram" stores information about whether to draw
      // a network even if it is large.
      "forceNetworkDiagram",
      // Variable "simulationDimensions" stores information about dimensions for
      // the simulation.
      "simulationDimensions",
      // Variable "simulationProgress" stores information about progress of an
      // iterative simulation relative to an estimate of total iterations.
      //"simulationProgress",
      "simulationProgress",
      // Variable "simulation" stores references to iterative functions that
      // determine the positions of the subnetwork's elements in the network's
      // diagram.
      "simulation",
      // Variable "simulationNodesRecords" stores information about network's
      // nodes with positions from simulation.
      "simulationNodesRecords",
      // Variable "simulation" stores information about network's links with
      // positions from simulation.
      "simulationLinksRecords",
      // Variable "entitySelection" stores information about selection of an
      // entity of interest.
      // Information includes references to variables "metabolites",
      // "reactions", "candidatesMetabolites", "candidatesReactions",
      // "networkNodesMetabolites", and "networkNodesReactions".
      "entitySelection"
    ];
    self.variablesNamesControls = [].concat(
      interfaceControls,
      promptControls,
      controlControls,
      stateControls,
      networkControls,
      filterControls,
      contextControls,
      subnetworkControls,
      queryControls,
      measurementControls,
      summaryControls,
      explorationControls
    );

    // TODO: Make it clear that these state variables have to do with the data itself...

    // Metabolic entities and sets
    var metabolicEntities = [
      // Metabolic entities and sets.
      // Variable "metabolites" stores information about chemically-unique
      // metabolites.
      "metabolites",
      // Variable "reactions" stores information about reactions that
      // facilitate chemical conversion or physical transport of metabolites.
      // Information includes references to variables "metabolites",
      // "compartments", and "processes".
      "reactions"
    ];
    var metabolicSets = [
      // Variable "compartments" stores information about compartments within a
      // cell.
      "compartments",
      // Variable "processes" stores information about processes or pathways.
      "processes"
    ];
    var entitiesSets = [
      // Variable "totalSetsReactions" stores information for all reactions
      // about all the metabolites that participate in each reaction and the
      // sets to which each reaction belongs by all its values of variables.
      // The purpose of variable "totalSetsReactions" is to provide complete
      // information against which to apply filters.
      // Information includes references to variables "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from variable "reactions".
      "totalSetsReactions",
      // Variable "totalSetsMetabolites" stores information for all metabolites
      // about all the reactions in which each metabolite participates and the
      // sets to which each metabolite belongs by all its values of variables.
      // The purpose of variable "totalSetsMetabolites" is to provide complete
      // information against which to apply filters.
      // Information includes references to variables "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from variables "totalSetsReactions" and
      // "reactions".
      "totalSetsMetabolites",
      // Variable "accessSetsReactions" stores information for reactions that
      // pass filters about all the metabolites that participate in each
      // reaction and the sets to which each reaction belongs by all its values
      // of variables.
      // The purpose of variable "accessSetsReactions" is to constrain the
      // accessibility of sets for selection in the sets' menu.
      // Information includes references to variables "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from variables "setsFilters",
      // "totalSetsReactions", and "reactions".
      "accessSetsReactions",
      // Variable "accessSetsMetabolites" stores information for metabolites
      // that pass filters about all the reactions in which each metabolite
      // participates and the sets to which each metabolite belongs by all its
      // values of variables.
      // The purpose of variable "accessSetsMetabolites" is to constrain the
      // accessibility of sets for selection in the sets' menu.
      // Information includes references to variables "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from variables "totalSetsMetabolites",
      // "accessSetsReactions" and "reactions".
      "accessSetsMetabolites",
      // Variable "filterSetsReactions" stores information for reactions that
      // pass filters about the metabolites that participate in each reaction in
      // contexts that pass filters and the sets to which each reaction belongs
      // by its values of variables that pass filters.
      // The purpose of variable "filterSetsReactions" is to define reactions,
      // metabolites, and their variables that pass filters.
      // Information includes references to variables "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from variables "setsFilters",
      // "totalSetsReactions", and "reactions".
      "filterSetsReactions",
      // Variable "filterSetsMetabolites" stores information for metabolites
      // that pass filters about the reactions in which each metabolite
      // participates in contexts that pass filters and the sets to which each
      // metabolite belongs by its values of variables that pass filters.
      // The purpose of variable "filterSetsMetabolites" is to define
      // metabolites and their variables that pass filters.
      // Information includes references to variables "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from variables "totalSetsMetabolites",
      // "filterSetsReactions" and "reactions".
      "filterSetsMetabolites",
      // Variable "setsCardinalitites" stores information about the counts of
      // entities that belong to each set by their values of variables.
      // Information includes references to variables "compartments" and
      // "processes".
      // Information derives from variables "setsEntities", "setsFilter",
      // "currentReactionsSets", "currentMetabolitesSets", "totalSetsReactions",
      // "totalSetsMetabolites".
      "setsCardinalities",
      // Variable "setsSummaries" stores information about the counts of
      // entities that belong to each set by their values of variables.
      // Information includes additional details for representation in menus.
      // Information includes references to variables "compartments" and
      // "processes".
      // Information derives from variables "setsCardinalities", "setsSearch",
      // and "setsSorts".
      "setsSummaries"
    ];
    var context = [
      // Variable "defaultSimplificationsMetabolites" stores information about
      // metabolites for which to create default simplifications.
      // Information includes references to variable "metabolites".
      "defaultSimplificationsMetabolites",
      // Variable "reactionsSimplifications" stores information about
      // selections of reactions for simplification by omission.
      // Information includes references to variable "candidatesReactions".
      "reactionsSimplifications",
      // Variable "metabolitesSimplifications" stores information about
      // selections of metabolites for simplification either by replication or
      // omission.
      // Information includes references to variable "candidatesMetabolites".
      "metabolitesSimplifications",
      // Variable "candidatesReactions" stores information about reactions and
      // their metabolites that are relevant in the context of interest and are
      // candidates for representation in the network.
      // Information includes compartmentalization of metabolites.
      // Information includes references to variables "reactions",
      // "metabolites", and "compartments".
      // Information derives from variables "compartmentalization",
      // "filterSetsReactions", and "reactions".
      "candidatesReactions",
      // Variable "candidatesMetabolites" stores information about metabolites
      // and their reactions that are relevant in the context of interest and
      // are candidates for representation in the network.
      // Information includes compartmentalization of metabolites.
      // Information includes references to variables "metabolites",
      // "reactions", and "compartments".
      // Information derives from variable "candidatesReactions".
      "candidatesMetabolites",
      // Variable "candidatesSummaries" stores information about the counts of
      // other candidate entities to which each candidate entity relates.
      // Information includes additional details for representation in menus.
      // Information includes references to variables "candidatesReactions" and
      // "candidatesMetabolites".
      // Information derives from variables "candidatesReactions",
      // "candidatesMetabolites", and "candidatesSorts".
      "candidatesSummaries"
    ];
    var measurement = [
      // Variable "metabolitesMeasurements" stores information about
      // experimental measurements of metabolites.
      // Information includes references to variables "metabolites".
      "metabolitesMeasurements",
      // Variable "measurementsSummaries" stores information about measurements
      // and their associations to metabolites.
      // Information includes additional details for representation in menus.
      // Information includes references to variables "metabolitesMeasurements"
      // and "metabolites".
      // Information derives from variables "metabolitesMeasurements" and
      // "measurementsSort".
      "measurementsSummaries"
    ];
    var network = [
      // Variable "networkNodesReactions" stores information about
      // representations of reactions in the network.
      // Information includes references to variables "reactions" and
      // "candidatesReactions".
      // Information derives from variables "reactions", "candidatesReactions",
      // and "reactionsSimplifications".
      "networkNodesReactions",
      // Variable "networkNodesMetabolites" stores information about
      // representations of metabolites in the network.
      // Information includes references to variables "metabolites" and
      // "candidatesMetabolites".
      // Information derives from variables "metabolites",
      // "candidatesMetabolites", and "metabolitesSimplifications".
      "networkNodesMetabolites",
      // Variable "networkLinks" stores information about representations of
      // relations between reactions and metabolites in the network.
      // Information includes references to variables "networkNodesReactions"
      // and "networkNodesMetabolites".
      // Information derives from variables "reactions",
      // "networkNodesReactions", and "networkNodesMetabolites".
      "networkLinks",
      // Variable "networkNodesRecords" stores concise information about
      // network's nodes.
      // Information includes references to variables "networkNodesReactions",
      // and "networkNodesMetabolites".
      "networkNodesRecords",
      // Variable "networkLinksRecords" stores concise information about
      // network's links.
      // Information includes references to variables "networkNodesReactions",
      // and "networkNodesMetabolites".
      "networkLinksRecords",
      // Variable "networkSummary" stores information about the counts of
      // network's nodes and links.
      // Information derives from variables "networkNodesMetabolites",
      // "networkNodesReactions", and "networkLinks".
      "networkSummary"
    ];
    var subnetwork = [
      // Variable "subnetworkNodesRecords" stores concise information about
      // network's nodes of interest.
      // Information includes references to variables "networkNodesReactions",
      // and "networkNodesMetabolites".
      "subnetworkNodesRecords",
      // Variable "networkLinksRecords" stores concise information about
      // network's links of interest.
      // Information includes references to variables "networkNodesReactions",
      // and "networkNodesMetabolites".
      "subnetworkLinksRecords",
      // Variable "subnetworkSummary" stores information about the counts of
      // subnetwork's nodes and links.
      // Information derives from variables "subnetworkNodesRecords" and
      // "subnetworkLinksRecords".
      "subnetworkSummary"
    ];
    self.variablesNames = [].concat(
      self.variablesNamesControls,
      metabolicEntities,
      metabolicSets,
      entitiesSets,
      context,
      measurement,
      network,
      subnetwork
    );
  }
  /**
  * Restores the values of variables in application's state and restores its
  * representation in the interface.
  * @param {Array<Object>} parameters.variablesValues Names and values of variables.
  * @param {Object} state Application's state.
  */
  restore(variablesValues, state) {
    // Accept novel values of variables and assign them to the state.
    variablesValues.forEach(function (variableValue) {
      // Confirm that the submission is valid.
      if (
        variableValue.hasOwnProperty("variable") &&
        variableValue.hasOwnProperty("value")
      ) {
        // Confirm that the variable is valid.
        if (state.variablesNames.includes(variableValue.variable)) {
          state[variableValue.variable] = variableValue.value;
        }
      }
    });
    // Initialize instance of state's model.
    // Pass this instance a reference to the state.
    new Model(state);
  }
}
