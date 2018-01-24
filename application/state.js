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
* This class stores values of attributes that define the application's state.
* The class accepts and stores appropriate values of attributes that define the
* application's state.
*/
class State {
  /**
  * Initializes an instance of the class.
  */
  constructor() {
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Specify state's attributes.
    var control = [
      // Attribute "source" stores a reference to a file on client's system that
      // is a source of information.
      "source",
      // Attribute "controlViews" stores information about whether each view
      // within the control view is active.
      "controlViews",
      // Attribute "topology" stores information about whether to draw a visual
      // representation of the network's topology.
      "topology",
      // Attribute "topologyNovelty" stores information about whether to current
      // network's topology is novel in comparison to any current visual
      // representations.
      "topologyNovelty"
    ];
    var entities = [
      // Metabolic entities and sets.
      // Attribute "metabolites" stores information about chemically-unique
      // metabolites.
      "metabolites",
      // Attribute "reactions" stores information about reactions that
      // facilitate chemical conversion or physical transport of metabolites.
      // Information includes references to attributes "metabolites",
      // "compartments", and "processes".
      "reactions"
    ];
    var sets = [
      // Attribute "genes" stores information about genes.
      "genes",
      // Attribute "compartments" stores information about compartments within a
      // cell.
      "compartments",
      // Attribute "processes" stores information about processes or pathways.
      "processes"
    ];
    var totalEntitiesSets = [
      // Attribute "totalReactionsSets" stores information for all reactions
      // about all the metabolites that participate in each reaction and the
      // sets to which each reaction belongs by all its values of attributes.
      // The purpose of attribute "totalReactionsSets" is to provide complete
      // information against which to apply filters.
      // Information includes references to attributes "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from attribute "reactions".
      "totalReactionsSets",
      // Attribute "totalMetabolitesSets" stores information for all metabolites
      // about all the reactions in which each metabolite participates and the
      // sets to which each metabolite belongs by all its values of attributes.
      // The purpose of attribute "totalMetabolitesSets" is to provide complete
      // information against which to apply filters.
      // Information includes references to attributes "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from attributes "totalReactionsSets" and
      // "reactions".
      "totalMetabolitesSets"
    ];
    var entitiesSetsFilters = [
      // Attribute "setsFilters" stores information about selections of sets
      // by values of entities' attributes to apply as filters.
      // The purpose of attribute "setsFilters" is to define filters for
      // filtration of entities by their values of attributes.
      // Information includes references to attributes "compartments" and
      // "processes".
      "setsFilters"
    ];
    var currentEntitiesSets = [
      // Attribute "accessReactionsSets" stores information for reactions that
      // pass filters about all the metabolites that participate in each
      // reaction and the sets to which each reaction belongs by all its values
      // of attributes.
      // The purpose of attribute "accessReactionsSets" is to constrain the
      // accessibility of sets for selection in the sets' menu.
      // Information includes references to attributes "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from attributes "setsFilters",
      // "totalReactionsSets", and "reactions".
      "accessReactionsSets",
      // Attribute "accessMetabolitesSets" stores information for metabolites
      // that pass filters about all the reactions in which each metabolite
      // participates and the sets to which each metabolite belongs by all its
      // values of attributes.
      // The purpose of attribute "accessMetabolitesSets" is to constrain the
      // accessibility of sets for selection in the sets' menu.
      // Information includes references to attributes "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from attributes "totalMetabolitesSets",
      // "accessReactionsSets" and "reactions".
      "accessMetabolitesSets",
      // Attribute "filterReactionsSets" stores information for reactions that
      // pass filters about the metabolites that participate in each reaction in
      // contexts that pass filters and the sets to which each reaction belongs
      // by its values of attributes that pass filters.
      // The purpose of attribute "filterReactionsSets" is to define reactions,
      // metabolites, and their attributes that pass filters.
      // Information includes references to attributes "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from attributes "setsFilters",
      // "totalReactionsSets", and "reactions".
      "filterReactionsSets",
      // Attribute "filterMetabolitesSets" stores information for metabolites
      // that pass filters about the reactions in which each metabolite
      // participates in contexts that pass filters and the sets to which each
      // metabolite belongs by its values of attributes that pass filters.
      // The purpose of attribute "filterMetabolitesSets" is to define
      // metabolites and their attributes that pass filters.
      // Information includes references to attributes "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from attributes "totalMetabolitesSets",
      // "filterReactionsSets" and "reactions".
      "filterMetabolitesSets"
    ];
    var setsCardinalitiesSummaries = [
      // Attribute "setsEntities" stores information about the type of entities,
      // metabolites or reactions, to represent in the sets' summary.
      "setsEntities",
      // Attribute "setsFilter" stores information about whether to represent
      // entities and their values of attributes after filtration in the sets'
      // summary.
      "setsFilter",
      // Attribute "setsCardinalitites" stores information about the counts of
      // entities that belong to each set by their values of attributes.
      // Information includes references to attributes "compartments" and
      // "processes".
      // Information derives from attributes "setsEntities", "setsFilter",
      // "currentReactionsSets", "currentMetabolitesSets", "totalReactionsSets",
      // "totalMetabolitesSets".
      "setsCardinalities",
      // Attribute "setsSearches" stores information about searches' strings by
      // which to filter the summaries of sets' cardinalities.
      "setsSearches",
      // Attribute "setsSorts" stores information about the sort criteria and
      // orders for the summaries of sets' cardinalities.
      // Information includes references to attributes "compartments" and
      // "processes".
      "setsSorts",
      // Attribute "setsSummaries" stores information about the counts of
      // entities that belong to each set by their values of attributes.
      // Information includes additional details for representation in menus.
      // Information includes references to attributes "compartments" and
      // "processes".
      // Information derives from attributes "setsCardinalities", "setsSearch",
      // and "setsSorts".
      "setsSummaries"
    ];
    var context = [
      // Attribute "compartmentalization" stores information about whether to
      // represent compartmentalization of metabolites.
      "compartmentalization",
      // Attribute "reactionsSimplifications" stores information about
      // selections of reactions for simplification by omission.
      // Information includes references to attribute "reactionsCandidates".
      "reactionsSimplifications",
      // Attribute "metabolitesSimplifications" stores information about
      // selections of metabolites for simplification either by replication or
      // omission.
      // Information includes references to attribute "metabolitesCandidates".
      "metabolitesSimplifications"
    ];
    var candidateEntities = [
      // Attribute "reactionsCandidates" stores information about reactions and
      // their metabolites that are relevant in the context of interest and are
      // candidates for representation in the network.
      // Information includes compartmentalization of metabolites.
      // Information includes references to attributes "reactions",
      // "metabolites", and "compartments".
      // Information derives from attributes "compartmentalization",
      // "filterReactionsSets", and "reactions".
      "reactionsCandidates",
      // Attribute "metabolitesCandidates" stores information about metabolites
      // and their reactions that are relevant in the context of interest and
      // are candidates for representation in the network.
      // Information includes compartmentalization of metabolites.
      // Information includes references to attributes "metabolites",
      // "reactions", and "compartments".
      // Information derives from attribute "reactionsCandidates".
      "metabolitesCandidates"
    ];
    var candidatesSummaries = [
      // Attribute "candidatesSearches" stores information about searches'
      // strings by which to filter the summaries of candidates' degrees.
      "candidatesSearches",
      // Attribute "candidatesSorts" stores information about the sort criteria
      // and orders for the summaries of candidates' degrees.
      // Information includes references to attributes "reactionsCandidates" and
      // "metabolitesCandidates".
      "candidatesSorts",
      // Attribute "candidatesSummaries" stores information about the counts of
      // other candidate entities to which each candidate entity relates.
      // Information includes additional details for representation in menus.
      // Information includes references to attributes "reactionsCandidates" and
      // "metabolitesCandidates".
      // Information derives from attributes "reactionsCandidates",
      // "metabolitesCandidates", and "candidatesSorts".
      "candidatesSummaries"
    ];
    var network = [
      // Attribute "networkNodesReactions" stores information about
      // representations of reactions in the network.
      // Information includes references to attributes "reactions" and
      // "reactionsCandidates".
      // Information derives from attributes "reactions", "reactionsCandidates",
      // and "reactionsSimplifications".
      "networkNodesReactions",
      // Attribute "networkNodesMetabolites" stores information about
      // representations of metabolites in the network.
      // Information includes references to attributes "metabolites" and
      // "metabolitesCandidates".
      // Information derives from attributes "metabolites",
      // "metabolitesCandidates", and "metabolitesSimplifications".
      "networkNodesMetabolites",
      // Attribute "networkLinks" stores information about representations of
      // relations between reactions and metabolites in the network.
      // Information includes references to attributes "networkNodesReactions"
      // and "networkNodesMetabolites".
      // Information derives from attributes "reactions",
      // "networkNodesReactions", and "networkNodesMetabolites".
      "networkLinks",
      // Attribute "networkNodesRecords" stores concise information about
      // network's nodes.
      // Information includes references to attributes "networkNodesReactions",
      // and "networkNodesMetabolites".
      "networkNodesRecords",
      // Attribute "networkLinksRecords" stores concise information about
      // network's links.
      // Information includes references to attributes "networkNodesReactions",
      // and "networkNodesMetabolites".
      "networkLinksRecords"
    ];
    var subnetwork = [
      // Attribute "traversalCombination" stores information about the strategy,
      // union or difference, for combination of sets of nodes from traversals
      // in traversal view.
      "traversalCombination",
      // Attribute "traversalType" stores information about the type of
      // traversal, rogue, proximity, or path, for which to create controls in
      // traversal view.
      "traversalType",
      // Attribute "traversalRogueFocus" stores information about a network's
      // single node to include or exclude from the subnetwork.
      // Information includes references to attributes
      // "networkNodesMetabolites", "networkNodesReactions", and
      // "networkNodesRecords".
      "traversalRogueFocus",
      // Attribute "traversalProximityFocus" stores information about a
      // network's single focal node for proximity traversal.
      // Information includes references to attributes
      // "networkNodesMetabolites", "networkNodesReactions", and
      // "networkNodesRecords".
      "traversalProximityFocus",
      // Attribute "traversalProximityDirection" stores information about the
      // direction of proximity traversal, either following predecessors,
      // neighbors, or successors from the focal node.
      "traversalProximityDirection",
      // Attribute "traversalProximityDepth" stores information about the depth
      // of the proximity traversal in links from the focal node.
      "traversalProximityDepth",
      // Attribute "subnetworkNodesRecords" stores concise information about
      // network's nodes of interest.
      // Information includes references to attributes "networkNodesReactions",
      // and "networkNodesMetabolites".
      "subnetworkNodesRecords",
      // Attribute "networkLinksRecords" stores concise information about
      // network's links of interest.
      // Information includes references to attributes "networkNodesReactions",
      // and "networkNodesMetabolites".
      "subnetworkLinksRecords",
    ];
    var inProgress = [
      // Subnetwork.
      "proximityFocus", "proximityDirection", "proximityDepth",
      "pathOrigin", "pathDestination", "pathDirection", "pathCount",
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
