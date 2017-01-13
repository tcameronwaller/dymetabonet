/*
 Profondeur supports visual exploration and analysis of metabolic networks.
 Copyright (C) 2016  Thomas Cameron Waller

 Author email: tcameronwaller@gmail.com

 This file is part of Profondeur.

 Profondeur is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Declare a class to contain attributes and methods of the metabolite.
 * This class initiates an instance from a single metabolite object.
 */
class Metabolite {
    constructor(metabolite) {
        // Variable metabolite is a single object for a metabolite from the array of objects in the metabolic model.
        // The data are already in an object (key: value) structure.
        var self = this;
        // Set attributes of the class.
        //self.type = "metabolite";
        self.identifier = metabolite.id;
        self.name = metabolite.name;
        self.formula = metabolite.formula;
        self.charge = metabolite.charge;
        self.compartment = metabolite.compartment;
        // Use methods to manipulate attributes of the class that change.
        self.setDegree();
        self.setReplication();
        // A method in class Model sets the attribute replication (boolean) of this class.
        // A method in class Model sets the attribute degree (number) of this class.
        // This functionality is within the Model class since the degree of the metabolite depends on its model context.
    }

    setDegree() {
        var self = this;
        self.degree = 0;
    }

    incrementDegree() {
        var self = this;
        self.degree = self.degree + 1;
    }

    setReplication() {
        var self = this;
        self.replication = false;
    }

    changeReplication() {
        var self = this;
        if (self.replication == false) {
            self.replication = true;
        } else if (self.replication == true) {
            self.replication = false;
        };
    }
}

// TODO: Determine gene name from the gene objects.
// TODO: That's a low priority.
/**
 * Declare a class to contain attributes and methods of the reaction.
 * This class initiates an instance from a single reaction object.
 */
class Reaction {
    constructor(reaction) {
        var self = this;
        // Set attributes of the class.
        //self.type = "reaction";
        self.identifier = reaction.id;
        self.name = reaction.name;
        self.gene = reaction.gene_reaction_rule;
        self.upperBound = reaction.upper_bound;
        self.lowerBound = reaction.lower_bound;
        self.reversibility = self.setReversibility();
        self.metabolites = reaction.metabolites;
        self.reactants = self.setReactants();
        self.products = self.setProducts();
    }

    /**
     * This method determines the reversibility of a reaction.
     */
    setReversibility() {
        var self = this;
        if (self.upperBound > 0 && self.lowerBound < 0) {
            return true;
        } else {
            return false;
        };
    }

    /**
     * This method determines the reactant(s) of a reaction.
     */
    setReactants() {
        var self = this;
        var reactants = [];
        for (let metabolite in self.metabolites) {
            if (Number(self.metabolites[metabolite]) == -1) {
                reactants.push(metabolite);
            };
        };
        return reactants;
    }

    /**
     * This method determines the product(s) of a reaction.
     */
    setProducts() {
        var self = this;
        var products = [];
        for (let metabolite in self.metabolites) {
            if (Number(self.metabolites[metabolite]) == 1) {
                products.push(metabolite);
            };
        };
        return products;
    }
}


/**
 * Declare a class to contain attributes and methods of the metabolic model.
 * This class initiates an instance from a single metabolic model.
 * This class organizes collections of instances of the classes for metabolite and reaction.
 * It uses objects (instead of arrays) for these collections to enable direct access of values by reference to keys.
 * This class also creates and organizes collections of nodes and links.
 * It again uses objects (instead of arrays) for these collections.
 */
class NetworkAssembly {


    constructor(dataModel) {
        var self = this;
        self.dataModel = dataModel;
        console.log("within NetworkAssembly")
        console.log(self.dataModel);

        self.metaboliteNodes = self.createMetabolites();
        self.reactionNodes = self.createReactions();
        self.links = self.createLinks();

        //self.nodes = self.setNodes();
        //self.links = self.setLinks();
        //self.setMetaboliteDegree();
        //self.testReplication();

        //self.setNetwork();
    }


    testReplication() {
        var self = this;
        self.metabolites["h2o_c"].changeReplication();
    }

    initiateDegrees() {
        var self = this;
        for (let key in self.metabolites) {
            let metabolite = self.metabolites[key];
            metabolite.setDegree();
        };
    }

    setMetabolites() {
        var self = this;
        var metabolites = {};
        for (let value of self.dataModel.metabolites) {
            let metabolite = value;
            metabolites[metabolite.id] = new Metabolite(metabolite);
        };
        return metabolites;
    }


    setReactions() {
        var self = this;
        var reactions = {};
        for (let value of self.dataModel.reactions) {
            let reaction = value;
            reactions[reaction.id] = new Reaction(reaction);
        };
        return reactions;
    }


    /**
     * Declare a function to create identifiers for nodes and links for reactions and metabolites.
     * Identifiers for all links begin with a reference to their reaction.
     */
    createIdentifiers(parameters) {
        var self = this;
        var reaction = parameters.reaction;
        var metabolite = parameters.metabolite;
        var identifiers = {};
        // Determine identifiers for reaction if reaction is not null.
        if (reaction) {
            identifiers.reaction = {};
            identifiers.reaction.original = reaction.identifier;
            identifiers.reaction.in = reaction.identifier + "_in";
            identifiers.reaction.out = reaction.identifier + "_out";
        };
        // Determine identifiers for metabolite if neither reaction nor metabolite is null.
        if (reaction && metabolite) {
            identifiers.metabolite = {};
            identifiers.metabolite.original = metabolite.identifier;
            identifiers.metabolite.reactionIn = metabolite.identifier + "_" + identifiers.reaction.in;
            identifiers.metabolite.reactionOut = metabolite.identifier + "_" + identifiers.reaction.out;
            identifiers.metabolite.reactant = identifiers.reaction.in + "_" + metabolite.identifier;
            identifiers.metabolite.product = identifiers.reaction.out + "_" + metabolite.identifier;
        };
        return identifiers;
    }


    /**
     * Declare a function to create nodes for reactions.
     * Create in and out nodes for each reaction with complete information about the reaction.
     * Give each reaction's node a new field, "type", to indicate the type of node, "reaction".
     * Give each reaction's node a new field, "reference", to store the identifier of the original reaction.
     * Give each reaction's node a new field, "direction", to indicate whether it is an "in" node or an "out" node.
     */
    createReactionNode(reaction) {
        var self = this;
        var reaction = reaction;
        var identifiers = self.createIdentifiers({reaction: reaction, metabolite: null});
        // Create in and out nodes for reaction.
        var index = ["in", "out"];
        for (let value of index) {
            let direction = value;
            // Clone reaction to replicates for in and out.
            // Direct assignment of object only copies reference.
            let reactionNode = Object.assign({}, reaction);
            reactionNode.identifier = identifiers.reaction[direction];
            reactionNode.type = "reaction";
            reactionNode.reference = identifiers.reaction.original;
            reactionNode.direction = direction;
            self.nodes[reactionNode.identifier] = Object.assign({}, reactionNode);
        };
    }


    /**
     * Declare a function to create links for reactions.
     * Create link between in and out nodes for each reaction with complete information about the reaction.
     * Give each reaction's link a new field, "type", to indicate the type of link, "reaction".
     * Give each reaction's link a new field, "reference", to store the identifier of the original reaction.
     * Links for reactions originate at the reaction's in node and terminate at the reaction's out node.
     */
    createReactionLink(reaction) {
        var self = this;
        var reaction = reaction;
        var identifiers = self.createIdentifiers({reaction: reaction, metabolite: null});
        // Create link for reaction.
        var reactionLink = Object.assign({}, reaction);
        reactionLink.identifier = identifiers.reaction.original;
        reactionLink.type = "reaction";
        reactionLink.reference = identifiers.reaction.original;
        reactionLink.source = identifiers.reaction.in;
        reactionLink.target = identifiers.reaction.out;
        self.links[reactionLink.identifier] = Object.assign({}, reactionLink);
    }


    /**
     * Declare a function to create nodes for metabolites.
     * If a metabolite's replication flag is false, and if a node does not already exist, then create a node for the
     *     metabolite.
     * If replication flag is true, create a special replicate node for the metabolite that is specific to the reaction.
     * Give this special metabolite node a unique identifier.
     * Maybe give this metabolite node new fields, "reaction" and "direction", that indicate its reaction and in/out?
     * Give each metabolite's node a new field, "type", to indicate the type of node, "metabolite".
     * Give each metabolite's node a new field, "reference", to store the identifier of the original metabolite.
     */
    createMetaboliteNode(parameters) {
        var self = this;
        var reaction = parameters.reaction;
        var direction = parameters.direction;
        var metabolite = parameters.metabolite;
        var identifiers = self.createIdentifiers({reaction: reaction, metabolite: metabolite});
        // Determine whether the metabolite's replication flag is false or true.
        if (metabolite.replication == false) {
            // Determine whether or not a node already exists for the metabolite.
            if (!(identifiers.metabolite.original in Object.keys(self.nodes))) {
                // Create node for metabolite.
                var metaboliteNode = Object.assign({}, metabolite);
                metaboliteNode.identifier = identifiers.metabolite.original;
                metaboliteNode.type = "metabolite";
                metaboliteNode.reference = identifiers.metabolite.original;
                self.nodes[metaboliteNode.identifier] = Object.assign({}, metaboliteNode);
            };
        } else if (metabolite.replication == true) {
            // Create node for metabolite.
            var metaboliteNode = Object.assign({}, metabolite);
            if (direction == "in") {
                metaboliteNode.identifier = identifiers.metabolite.reactionIn;
            } else if (direction == "out") {
                metaboliteNode.identifier = identifiers.metabolite.reactionOut;
            };
            metaboliteNode.type = "metabolite";
            metaboliteNode.reference = identifiers.metabolite.original;
            self.nodes[metaboliteNode.identifier] = Object.assign({}, metaboliteNode);
        };
    }


    /**
     * Declare a function to create links for metabolites.
     * Create link between each metabolite node and the appropriate reaction node.
     * Give each metabolite's link a new field, "type", to indicate the type of link, "metabolite".
     * Links for metabolites originate at the reaction's in or out node and terminate at the metabolite's node.
     */
    createMetaboliteLink(parameters) {
        var self = this;
        var reaction = parameters.reaction;
        var direction = parameters.direction;
        var metabolite = parameters.metabolite;
        var identifiers = self.createIdentifiers({reaction: reaction, metabolite: metabolite});
        // Create link for metabolite.
        // Link originates at reaction node (in or out) and terminates at the metabolite (reactant or product).
        var metaboliteLink = Object.assign({}, metabolite);
        if (direction == "in") {
            metaboliteLink.identifier = identifiers.metabolite.reactant;
            metaboliteLink.source = identifiers.reaction.in;
        } else if (direction == "out") {
            metaboliteLink.identifier = identifiers.metabolite.product;
            metaboliteLink.source = identifiers.reaction.out;
        };
        metaboliteLink.type = "metabolite";
        metaboliteLink.reference = identifiers.metabolite.original;
        // Determine whether the metabolite's replication flag is false or true.
        if (metabolite.replication == false) {
            metaboliteLink.target = identifiers.metabolite.original;
        } else if (metabolite.replication == true) {
            if (direction == "in") {
                metaboliteLink.target = identifiers.metabolite.reactionIn;
            } else if (direction == "out") {
                metaboliteLink.target = identifiers.metabolite.reactionOut;
            };
        };
        self.links[metaboliteLink.identifier] = Object.assign({}, metaboliteLink);
    }


    /**
     * Declare a function to create a node-link network representation of the metabolic model.
     * Nodes and links relate within the network.
     * Due to this relation, it is efficient to organize the creation of nodes and links within the same iterative
     * process.
     * As reactions contain the relevant information about connectivity between metabolites, it is most reasonable to
     * guide the creation of nodes and links by iteration over reactions.
     * Procedure:
     * 1) Iterate over reactions, not metabolites.
     * 2) Create nodes for each reaction.
     * 3) Create link between in and out nodes for each reaction.
     * 4) Iterate over metabolites (reactants and products) of each reaction.
     * 5) Increment the degree of each metabolite for each reaction in which it participates.
     * 6) Create node for each metabolite.
     * 7) Create link between each metabolite node and the appropriate reaction node.
     */
    setNetwork() {
        var self = this;
        self.initiateDegrees();
        // Before creating nodes and links, initiate these to make them empty.
        self.nodes = {};
        self.links = {};
        // Iterate over reactions.
        // Iterate over keys, not values, of the object.
        for (let key in self.reactions) {
            let reaction = self.reactions[key];
            // Create in and out nodes for reaction.
            self.createReactionNode(reaction);
            // Create link for reaction.
            self.createReactionLink(reaction);
            // Iterate over reactant and product metabolites of the reaction.
            // Attribute reactant is an array of identifiers for metabolites that are reactants for a reaction.
            // Attribute product is an array of identifiers for metabolites that are products for a reaction.
            let index = ["reactants", "products"];
            for (let value1 of index) {
                let side = value1;
                for (let value2 of reaction[side]) {
                    let metabolite = self.metabolites[value2];
                    // Increment the degree of the metabolite.
                    // The degree of each metabolite increments for each reaction of the model in which it participates.
                    // The degree of the metabolite instance increments before creation of the node, so the increment
                    // affects both.
                    metabolite.incrementDegree();
                    // TODO: Maybe also keep track of all reactions in which a metabolite participates.
                    // TODO: For that, give metabolites an array attribute and append to it with each instance.
                    if (side == "reactants") {
                        // Create node for metabolite.
                        self.createMetaboliteNode({reaction: reaction, direction: "in", metabolite: metabolite});
                        // Create link for metabolite.
                        self.createMetaboliteLink({reaction: reaction, direction: "in", metabolite: metabolite});
                    } else if (side == "products") {
                        // Create node for the metabolite.
                        self.createMetaboliteNode({reaction: reaction, direction: "out", metabolite: metabolite});
                        // Create link for metabolite.
                        self.createMetaboliteLink({reaction: reaction, direction: "out", metabolite: metabolite});
                    };
                };
            };
        };
    }
}
