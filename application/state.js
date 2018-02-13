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
    var control = [
      // Variable "source" stores a reference to a file on client's system that
      // is a source of information.
      "source",
      // Variable "controlViews" stores information about whether each view
      // within the control view is active.
      "controlViews",
      // Variable "prompt" stores information about the type and position of the
      // prompt view within the interface.
      "prompt",
      // Variable "topology" stores information about whether to draw a visual
      // representation of the network's topology.
      "topology",
      // Variable "topologyNovelty" stores information about whether to current
      // network's topology is novel in comparison to any current visual
      // representations.
      "topologyNovelty"
    ];
    var entities = [
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
    var sets = [
      // Variable "genes" stores information about genes.
      "genes",
      // Variable "compartments" stores information about compartments within a
      // cell.
      "compartments",
      // Variable "processes" stores information about processes or pathways.
      "processes"
    ];
    var totalEntitiesSets = [
      // Variable "totalReactionsSets" stores information for all reactions
      // about all the metabolites that participate in each reaction and the
      // sets to which each reaction belongs by all its values of variables.
      // The purpose of variable "totalReactionsSets" is to provide complete
      // information against which to apply filters.
      // Information includes references to variables "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from variable "reactions".
      "totalReactionsSets",
      // Variable "totalMetabolitesSets" stores information for all metabolites
      // about all the reactions in which each metabolite participates and the
      // sets to which each metabolite belongs by all its values of variables.
      // The purpose of variable "totalMetabolitesSets" is to provide complete
      // information against which to apply filters.
      // Information includes references to variables "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from variables "totalReactionsSets" and
      // "reactions".
      "totalMetabolitesSets"
    ];
    var entitiesSetsFilters = [
      // Variable "setsFilters" stores information about selections of sets
      // by values of entities' variables to apply as filters.
      // The purpose of variable "setsFilters" is to define filters for
      // filtration of entities by their values of variables.
      // Information includes references to variables "compartments" and
      // "processes".
      "setsFilters"
    ];
    var currentEntitiesSets = [
      // Variable "accessReactionsSets" stores information for reactions that
      // pass filters about all the metabolites that participate in each
      // reaction and the sets to which each reaction belongs by all its values
      // of variables.
      // The purpose of variable "accessReactionsSets" is to constrain the
      // accessibility of sets for selection in the sets' menu.
      // Information includes references to variables "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from variables "setsFilters",
      // "totalReactionsSets", and "reactions".
      "accessReactionsSets",
      // Variable "accessMetabolitesSets" stores information for metabolites
      // that pass filters about all the reactions in which each metabolite
      // participates and the sets to which each metabolite belongs by all its
      // values of variables.
      // The purpose of variable "accessMetabolitesSets" is to constrain the
      // accessibility of sets for selection in the sets' menu.
      // Information includes references to variables "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from variables "totalMetabolitesSets",
      // "accessReactionsSets" and "reactions".
      "accessMetabolitesSets",
      // Variable "filterReactionsSets" stores information for reactions that
      // pass filters about the metabolites that participate in each reaction in
      // contexts that pass filters and the sets to which each reaction belongs
      // by its values of variables that pass filters.
      // The purpose of variable "filterReactionsSets" is to define reactions,
      // metabolites, and their variables that pass filters.
      // Information includes references to variables "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from variables "setsFilters",
      // "totalReactionsSets", and "reactions".
      "filterReactionsSets",
      // Variable "filterMetabolitesSets" stores information for metabolites
      // that pass filters about the reactions in which each metabolite
      // participates in contexts that pass filters and the sets to which each
      // metabolite belongs by its values of variables that pass filters.
      // The purpose of variable "filterMetabolitesSets" is to define
      // metabolites and their variables that pass filters.
      // Information includes references to variables "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from variables "totalMetabolitesSets",
      // "filterReactionsSets" and "reactions".
      "filterMetabolitesSets"
    ];
    var setsCardinalitiesSummaries = [
      // Variable "setsEntities" stores information about the type of entities,
      // metabolites or reactions, to represent in the sets' summary.
      "setsEntities",
      // Variable "setsFilter" stores information about whether to represent
      // entities and their values of variables after filtration in the sets'
      // summary.
      "setsFilter",
      // Variable "setsCardinalitites" stores information about the counts of
      // entities that belong to each set by their values of variables.
      // Information includes references to variables "compartments" and
      // "processes".
      // Information derives from variables "setsEntities", "setsFilter",
      // "currentReactionsSets", "currentMetabolitesSets", "totalReactionsSets",
      // "totalMetabolitesSets".
      "setsCardinalities",
      // Variable "setsSearches" stores information about searches' strings by
      // which to filter the summaries of sets' cardinalities.
      "setsSearches",
      // Variable "setsSorts" stores information about the sort criteria and
      // orders for the summaries of sets' cardinalities.
      // Information includes references to variables "compartments" and
      // "processes".
      "setsSorts",
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
      // Variable "compartmentalization" stores information about whether to
      // represent compartmentalization of metabolites.
      "compartmentalization",
      // Variable "defaultSimplifications" stores information about whether to
      // simplify default entities.
      "defaultSimplifications",
      // Variable "reactionsSimplifications" stores information about
      // selections of reactions for simplification by omission.
      // Information includes references to variable "reactionsCandidates".
      "reactionsSimplifications",
      // Variable "metabolitesSimplifications" stores information about
      // selections of metabolites for simplification either by replication or
      // omission.
      // Information includes references to variable "metabolitesCandidates".
      "metabolitesSimplifications"
    ];
    var candidateEntities = [
      // Variable "reactionsCandidates" stores information about reactions and
      // their metabolites that are relevant in the context of interest and are
      // candidates for representation in the network.
      // Information includes compartmentalization of metabolites.
      // Information includes references to variables "reactions",
      // "metabolites", and "compartments".
      // Information derives from variables "compartmentalization",
      // "filterReactionsSets", and "reactions".
      "reactionsCandidates",
      // Variable "metabolitesCandidates" stores information about metabolites
      // and their reactions that are relevant in the context of interest and
      // are candidates for representation in the network.
      // Information includes compartmentalization of metabolites.
      // Information includes references to variables "metabolites",
      // "reactions", and "compartments".
      // Information derives from variable "reactionsCandidates".
      "metabolitesCandidates"
    ];
    var candidatesSummaries = [
      // Variable "candidatesSearches" stores information about searches'
      // strings by which to filter the summaries of candidates' degrees.
      "candidatesSearches",
      // Variable "candidatesSorts" stores information about the sort criteria
      // and orders for the summaries of candidates' degrees.
      // Information includes references to variables "reactionsCandidates" and
      // "metabolitesCandidates".
      "candidatesSorts",
      // Variable "candidatesSummaries" stores information about the counts of
      // other candidate entities to which each candidate entity relates.
      // Information includes additional details for representation in menus.
      // Information includes references to variables "reactionsCandidates" and
      // "metabolitesCandidates".
      // Information derives from variables "reactionsCandidates",
      // "metabolitesCandidates", and "candidatesSorts".
      "candidatesSummaries"
    ];
    var network = [
      // Variable "networkNodesReactions" stores information about
      // representations of reactions in the network.
      // Information includes references to variables "reactions" and
      // "reactionsCandidates".
      // Information derives from variables "reactions", "reactionsCandidates",
      // and "reactionsSimplifications".
      "networkNodesReactions",
      // Variable "networkNodesMetabolites" stores information about
      // representations of metabolites in the network.
      // Information includes references to variables "metabolites" and
      // "metabolitesCandidates".
      // Information derives from variables "metabolites",
      // "metabolitesCandidates", and "metabolitesSimplifications".
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
      "networkLinksRecords"
    ];
    var subnetwork = [
      // Variable "traversalCombination" stores information about the strategy,
      // union or difference, for combination of sets of nodes from traversals
      // in traversal view.
      "traversalCombination",
      // Variable "traversalType" stores information about the type of
      // traversal, rogue, proximity, or path, for which to create controls in
      // traversal view.
      "traversalType",
      // Variable "traversalRogueFocus" stores information about a network's
      // single node to include or exclude from the subnetwork.
      // Information includes references to variables
      // "networkNodesMetabolites", "networkNodesReactions", and
      // "networkNodesRecords".
      "traversalRogueFocus",
      // Variable "traversalProximityFocus" stores information about a
      // network's single focal node for proximity traversal.
      // Information includes references to variables
      // "networkNodesMetabolites", "networkNodesReactions", and
      // "networkNodesRecords".
      "traversalProximityFocus",
      // Variable "traversalProximityDirection" stores information about the
      // direction of proximity traversal, either following successors,
      // neighbors, or predecessors from the focal node.
      "traversalProximityDirection",
      // Variable "traversalProximityDepth" stores information about the depth
      // of the proximity traversal in count of links from the focal node.
      "traversalProximityDepth",
      // Variable "traversalPathSource" stores information about a network's
      // single node for the source of path traversal.
      // Information includes references to variables
      // "networkNodesMetabolites", "networkNodesReactions", and
      //"networkNodesRecords".
      "traversalPathSource",
      // Variable "traversalPathTarget" stores information about a network's
      // single node for the target of path traversal.
      // Information includes references to variables
      // "networkNodesMetabolites", "networkNodesReactions", and
      //"networkNodesRecords".
      "traversalPathTarget",
      // Variable "traversalPathDirection" stores information about the
      // direction of path traversal, either forward, reverse, or both.
      "traversalPathDirection",
      // Variable "traversalPathCount" stores information about the count of
      // simple shortest paths to collect by path traversal.
      "traversalPathCount",
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
      // Variable "entitySelection" stores information about selection of an
      // entity of interest.
      // Information includes references to variables "metabolites",
      // "reactions", "metabolitesCandidates", "reactionsCandidates",
      // "networkNodesMetabolites", and "networkNodesReactions".
      "entitySelection"
    ];
    self.variablesNames = [].concat(
      control,
      entities,
      sets,
      totalEntitiesSets,
      entitiesSetsFilters,
      currentEntitiesSets,
      setsCardinalitiesSummaries,
      context,
      candidateEntities,
      candidatesSummaries,
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
