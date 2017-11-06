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
* Model of the comprehensive state of the application.
* This class stores attributes that represent the entire state of the
* application.
* It is the role of the model to know which attributes and which values of
* these attributes describe the application.
*/
class Model {
  /**
  * Initializes an instance of class Model.
  */
  constructor() {
    // It is the role of the model to know which attributes and which values
    // of these attributes describe the application.
    // Specify attributes for the model to expect and accept.
    // TODO: Consider splitting up attributes into categories and then concatenating them into attributeNames.
    this.attributeNames = [

      // Source.
      // Attribute "file" stores a reference to a file on client's machine that
      // is a source of information.
      "file",

      // Metabolic entities and sets.
      // Attribute "metabolites" stores information about chemically-unique
      // metabolites.
      "metabolites",
      // Attribute "reactions" stores information about reactions that
      // facilitate chemical conversion or physical transport of metabolites.
      // Information includes references to attributes "metabolites",
      // "compartments", and "processes".
      "reactions",
      // Attribute "genes" stores information about genes.
      "genes",
      // Attribute "compartments" stores information about compartments within a
      // cell.
      "compartments",
      // Attribute "processes" stores information about processes or pathways.
      "processes",

      // Sets.
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
      "totalMetabolitesSets",
      // Attribute "setsFilters" stores information about selections of sets
      // by values of entities' attributes to apply as filters.
      // The purpose of attribute "setsFilters" is to define filters for
      // filtration of entities by their values of attributes.
      // Information includes references to attributes "compartments" and
      // "processes".
      "setsFilters",
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
      "filterMetabolitesSets",
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
      // Attribute "setsSummary" stores information about the counts of entities
      // that belong to each set by their values of attributes.
      // Information includes additional details for representation in the sets'
      // summary.
      // Information includes references to attributes "compartments" and
      // "processes".
      // Information derives from attribute "setsCardinalities".
      "setsSummary",

      // Entities.
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
      "metabolitesSimplifications",

      // TODO: Update this information after I develop the procedure further...
      // Attribute "reactionsCandidates" stores information for each reaction
      // about the metabolites that participate.
      // Information includes compartmentalization of metabolites.
      // Information includes references to attributes "reactions",
      // "metabolites", and "compartments".
      // Information derives from attributes "compartmentalization",
      // "currentReactionsSets", and "reactions".
      "reactionsCandidates",
      // Attribute "metabolitesCandidates" stores information for each
      // metabolite about the reactions in which it participates.
      // Information includes compartmentalization of metabolites.
      // Information includes references to attributes "metabolites",
      // "reactions", and "compartments".
      // Information derives from attribute "reactionsCandidates".
      "metabolitesCandidates",

      // Network.
      "networkNodesReactions",
      "networkNodesMetabolites",
      "networkLinks",
      "subNetworkNodesMetabolites",
      "subNetworkNodesReactions",
      "subNetworkLinks",

      // TODO: Maybe include "relevantEntities" that represent entities that pass filters, are preserved as candidates, represented in network, and also part of specific subnetwork.




      // Network.
      "metabolitesNodes", "reactionsNodes", "links",
      "network",
      // Subnetwork.
      "proximityFocus", "proximityDirection", "proximityDepth",
      "pathOrigin", "pathDestination", "pathDirection", "pathCount",
      "currentMetabolitesNodes", "currentReactionsNodes", "currentLinks",
      "subNetwork",
    ];
  }
  /**
  * Restores the model for changes and initializes representation of the
  * application's state.
  * This method controls the vetting of all proposals for changes to the
  * model.
  * @param {Array<Object>} novelAttributes Collection of novel attributes to
  * replace old attributes in the model.
  * @param {Object} model Model of the application's comprehensive state.
  */
  restore(novelAttributes, model) {
    // Accept novel attributes and assign them to the model.
    novelAttributes.forEach(function (novelAttribute) {
      // Confirm that the record for the novel attribute value is valid.
      if (
        novelAttribute.hasOwnProperty("attribute") &&
        novelAttribute.hasOwnProperty("value")
      ) {
        // Confirm that the attribute exists in the model.
        if (model.attributeNames.includes(novelAttribute.attribute)) {
          model[novelAttribute.attribute] = novelAttribute.value;
        }
      }
    });
    // Initialize instance of state representation.
    // Pass this instance a reference to the model.
    new State(model);
  }
}
