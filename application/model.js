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
      // Attribute "setsTotalReactions" stores information for each reaction
      // about the metabolites that participate and the sets to which the entity
      // belongs by its values of attributes.
      // Information includes references to attributes "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from attribute "reactions".
      "setsTotalReactions",
      // Attribute "setsTotalMetabolites" stores information for each metabolite
      // about the reactions in which it participates and the sets to which the
      // entity belongs by its values of attributes.
      // Information includes references to attributes "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from attributes "setsTotalReactions" and
      // "reactions".
      "setsTotalMetabolites",
      // Attribute "setsSelections" stores information about selections of sets
      // by values of entities' attributes.
      // These selections inform the filtration of entities by their values of
      // attributes.
      // Information includes references to attributes "compartments" and
      // "processes".
      "setsSelections",
      // Attribute "setsCurrentReactions" stores information for each reaction
      // about the metabolites that participate and the sets to which the entity
      // belongs by its values of attributes.
      // Information only includes entities that pass filters and those of their
      // values of attributes that pass filters.
      // Information includes references to attributes "reactions",
      // "metabolites", "compartments", and "processes".
      // Information derives from attributes "setsSelections",
      // "setsTotalReactions", and "reactions".
      "setsCurrentReactions",
      // Attribute "setsCurrentMetabolites" stores information for each
      // metabolite about the reactions in which it participates and the sets to
      // which the entity belongs by its values of attributes.
      // Information only includes entities that pass filters and those of their
      // values of attributes that pass filters.
      // Information includes references to attributes "metabolites",
      // "reactions", "compartments", and "processes".
      // Information derives from attributes "setsCurrentReactions" and
      // "reactions".
      "setsCurrentMetabolites",
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
      // "setsCurrentReactions", "setsCurrentMetabolites", "setsTotalReactions",
      // "setsTotalMetabolites".
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

      // Attribute "entitiesReactions" stores information for each reaction
      // about the metabolites that participate.
      // Information includes compartmentalization of metabolites.
      // Information includes references to attributes "reactions",
      // "metabolites", and "compartments".
      // Information derives from attributes "setsCurrentReactions",
      // "reactions", and "compartmentalization".
      "entitiesReactions",
      // Attribute "entitiesMetabolites" stores information for each metabolite
      // about the reactions in which it participates.
      // Information includes compartmentalization of metabolites.
      // Information includes references to attributes "metabolites",
      // "reactions", and "compartments".
      // Information derives from attribute "entitiesReactions".
      "entitiesMetabolites",
      // Attribute "reactionsSimplification" stores information about selections
      // of reactions for simplification by omission.
      // Information includes references to attribute "entitiesReactions".
      "reactionsSimplification",
      // Attribute "metabolitesSimplification" stores information about
      // selections of metabolites for simplification either by replication or
      // omission.
      // Information includes references to attribute "entitiesMetabolites".
      "metabolitesSimplification",

      // Network.
      "networkNodesReactions",
      "networkNodesMetabolites",
      "networkLinks",
      "subNetworkNodesMetabolites",
      "subNetworkNodesReactions",
      "subNetworkLinks",




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

  // TODO: I might want functionality to print a representation of the model to the console.
  // TODO: I might also want the ability to save a JSON of the model to allow session persistence and restoration.

}
