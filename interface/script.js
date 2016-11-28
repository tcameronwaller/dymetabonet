
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
        self.degree = self.setDegree();
        self.replication = self.setReplication();
        // A method in class Model sets the attribute replication (boolean) of this class.
        // A method in class Model sets the attribute degree (number) of this class.
    }

    setDegree() {
        var self = this;
        var degree = 0;
        return degree;
    }

    incrementDegree() {
        var self = this;
        self.degree = self.degree + 1;
    }

    setReplication() {
        var self = this;
        var replication = false;
        return replication;
    }

    changeReplication() {
        var self = this;
        if (self.replication == false) {
            self.replication == true;
        } else if (self.replication == true) {
            self.replication == false;
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
class Model {

    constructor(dataModel) {
        var self = this;
        self.dataModel = dataModel;
        self.metabolites = self.setMetabolites();
        self.reactions = self.setReactions();
        //self.nodes = self.setNodes();
        //self.links = self.setLinks();
        //self.setMetaboliteDegree();
        // TODO: Before creating nodes and links, initiate these to make them empty.
        self.setNetwork();
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


    createIdentifiers(arguments) {
        var self = this;
        var reaction = arguments.reaction;
        var metabolite = arguments.metabolite;
        var identifiers = {};
        // Determine identifiers for reaction if reaction is not null.
        if (reaction) {
            identifiers.reaction.original = reaction.identifier;
            identifiers.reaction.in = reaction.identifier + "_in";
            identifiers.reaction.out = reaction.identifier + "_out";
        };
        // Determine identifiers for metabolite if neither reaction nor metabolite is null.
        if (reaction && metabolite) {
            identifiers.metabolite.original = metabolite.identifier;
            identifiers.metabolite.reactionIn = metabolite.identifier + "_" + identifiers.reaction.in;
            identifiers.metabolite.reactionOut = metabolite.identifier + "_" + identifiers.reaction.out;
            identifiers.metabolite.reactant = identifiers.reaction.in + "_" + metabolite.identifier;
            identifiers.metabolite.product = identifiers.reaction.out + "_" + metabolite.identifier;
        };
        return identifiers;
    }


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

    createMetaboliteNode(arguments) {
        var self = this;
        var reaction = arguments.reaction;
        var direction = arguments.direction;
        var metabolite = arguments.metabolite;
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


    createMetaboliteLink(arguments) {
        var self = this;
        var reaction = arguments.reaction;
        var direction = arguments.direction;
        var metabolite = arguments.metabolite;
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
     * Nodes and links relate within the network.
     * Due to this relation, it is more efficient to organize the creation of nodes and links within the same iterative
     * process.
     * As reactions contain the relevant information about connectivity between metabolites, it is most reasonable to
     * guide the creation of nodes and links by iteration over reactions.
     * 1) Iterate over reactions, not metabolites.
     * 2) Create in and out nodes for each reaction with complete information about the reaction.
     * 3) Give each reaction's node a new field, "reference" to store the identifier of the original reaction.
     * 4) Give each reaction's node a new field, "direction", to indicate whether it is an "in" node or an "out" node.
     * 5) Create link between in and out nodes for the reaction with complete information about the reaction.
     * 6) Give reaction's link a new field, "reference", to store the identifier of the original reaction.
     * 7) Iterate over metabolites (reactants and products) of each reaction.
     * 8) For each metabolite, access the corresponding metabolite class instance.
     * 9) Increment the degree of the metabolite.
     * 10) Check the replication flag of the metabolite.
     * 11) If replication flag is false, create a node for the metabolite if a node does not already exist.
     * 12) Also create a link between this metabolite node and it's appropriate reaction node.
     * 13) If replication flag is true, create a special replicate node for the metabolite that is specific to the
     *     reaction.
     * 14) Give this special metabolite node a unique identifier.
     * 15) Give this metabolite node a new field, "reference", to store the identifier of the original metabolite.
     * 16) Give this metabolite node new fields, "reaction" and "direction", that indicate its reaction and in/out.
     * 17) Create a new link between the reaction in or out and the metabolite.
     */
    setNetwork() {
        var self = this;

        // TODO: Before running the portion of code that increments metabolite degrees, set all degrees to 0.
        // TODO: I think just iterate over all metabolites in the model and set their degrees to 0 using setDegree().

        var network = {};
        network.nodes = {};
        network.links = {};
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
                    let role = value2;
                    let metabolite = self.metabolites[role];
                    // Increment the degree of the metabolite.
                    // The degree of each metabolite increments for each reaction in which it participates.
                    metabolite.incrementDegree();
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
        return network;
    }

    // TODO: In the current implementation with setNodes and setLinks, for some reason the reaction instances themselves
    // TODO: are changed to have "source" and "target". That seems like a mistake, maybe of a reference issue.

    /**
     * Declare a function to create nodes for metabolites and reactions (in and out).
     */
    setNodes() {
        var self = this;
        var nodes = {};
        // Iterate over each metabolite to create matching nodes.
        // It is not practical to iterate over values of the object, since these values are all instances of the same
        // Metabolite class.
        // Instead iterate over keys of the object.
        for (let metabolite in self.metabolites) {
            // Create node for each metabolite.
            // The keys of self.metabolites are identical to the identifiers.
            //console.log(metabolite);
            //console.log(self.metabolites[metabolite]);
            nodes[self.metabolites[metabolite].identifier] = self.metabolites[metabolite];
        };
        // Iterate over each reaction to create matching nodes.
        for (let reaction in self.reactions) {
            // Create in and out nodes of type reaction for each reaction.
            // Clone reaction to replicates for in and out.
            // Direct assignment of object only copies reference.
            let reactionIn = Object.assign({}, self.reactions[reaction]);
            let reactionOut = Object.assign({}, self.reactions[reaction]);
            let reactionInId = reactionIn.identifier + "_in";
            let reactionOutId = reactionOut.identifier + "_out";
            //console.log(reactionInId);
            //console.log(reactionOutId);
            reactionIn.identifier = reactionInId;
            reactionOut.identifier = reactionOutId;
            //console.log(reactionIn);
            //console.log(reactionOut);
            nodes[reactionIn.identifier] = reactionIn;
            nodes[reactionOut.identifier] = reactionOut;
        };
        return nodes;
    }

    /**
     * Declare a function to create links for metabolites and reactions.
     * Links between in and out nodes of reactions (type reaction) need complete information about the reaction.
     * Links between metabolite nodes and reaction nodes (type metabolite) do not need complete information.
     * Reactant metabolites link to in nodes for reactions.
     * Product metabolites link to out nodes for reactions.
     */
    setLinks() {
        var self = this;
        var link = {};
        // Iterate over each reaction to create matching links.
        // For each reaction, there is a single link of type reaction, and there are multiple links of type metabolite.
        for (let reaction in self.reactions) {
            // Create link of type reaction for the reaction.
            // As I transfer the reaction information, the type is already reaction.
            let reactionInId = self.reactions[reaction].identifier + "_in";
            let reactionOutId = self.reactions[reaction].identifier + "_out";
            link[self.reactions[reaction].identifier] = self.reactions[reaction];
            link[self.reactions[reaction].identifier]["source"] = reactionInId;
            link[self.reactions[reaction].identifier]["target"] = reactionOutId;
            // Create links of type metabolite for the reaction.
            // Attribute reactant is an array of identifiers for metabolites.
            // Links originate at reactant node (in or out) and terminate at the metabolite (reactant or product).
            for (let reactant of self.reactions[reaction].reactants) {
                let reactantIdentifier = self.reactions[reaction].identifier + "_" + reactant;
                let linkTemporary = {
                    type: "metabolite",
                    source: self.reactions[reaction].identifier + "_in",
                    target: reactant
                };
                link[reactantIdentifier] = linkTemporary;
            };
            // Attribute product is an array of identifiers for metabolites.
            for (let product of self.reactions[reaction].products) {
                let productIdentifier = self.reactions[reaction].identifier + "_" + product;
                let linkTemporary = {
                    type: "metabolite",
                    source: self.reactions[reaction].identifier + "_out",
                    target: product
                };
                link[productIdentifier] = linkTemporary;
            };
        };
        return link;
    }


    // TODO: Determining degree will be straight-forward after definition of nodes and links.
    /**
     * Declare a function to determine the degrees of all metabolites in a model.
     * This functionality is within the Model class since the degree of the metabolite depends on its model context.
     * Consider all links to or from a metabolite in determining its degree.
     * For each metabolite, iterate through all links
     */
    setMetaboliteDegree() {
        var self = this;
        // Iterate over each metabolite to determine its degree in the model.
        for (let entry of self.metabolite) {};
    }
}


/**
 * Declare a class to contain attributes and methods of the query view.
 * In the final implementation, methods of this class will build and execute queries to select subsets of the network
 * data in the original model.
 * Methods of of this class will modify the actual data to create a copy that only includes relevant parts of the
 * network.
 * In this preliminary implementation, methods of this class simply load different versions of a model.
 * Methods of this class then pass the data for the subset of the network to the navigation view for further
 * modification with user interaction.
 */
class QueryView {

    constructor(navigationView) {

        var self = this;
        self.navigationView = navigationView;
        self.initialize();

    }

    initialize() {

        var self = this;

        // Create the selector element.
        // TODO: Provide user with a list of all files in the data directory on the SERVER.
        // TODO: Create selector options for all available data sets.
        // TODO: It seems this functionality is difficult.
        // TODO: readdirSync from Node.js might work.
        self.optionsArray = [
            "model_e-coli_citrate-cycle_sub_node-link.json", "model_e-coli_citrate-cycle_node-link.json"
        ];
        self.selector = d3.select("#selector");
        self.options = self.selector.selectAll("option")
            .data(self.optionsArray)
            .enter()
            .append("option")
            .text(function (d) {
                return d;
            });
        self.submit = d3.select("#submit");

        // Create SVG element with a rectangle as a temporary space-filler.
        // Set dimensions of SVG proportional to dimensions of the viewport or window.
        // Definition of margin, border, and padding is in the style.
        // Define padding again here since it is difficult to access element dimensions without padding.
        // Also artificially adjust height to leave room for the selector.
        self.padding = {top: 20, right: 10, bottom: 20, left: 10};
        self.queryDiv = d3.select("#query");
        self.bounds = {width: (self.queryDiv.node().clientWidth), height: (self.queryDiv.node().clientHeight)}
        self.svgWidth = self.bounds.width - (self.padding.left + self.padding.right);
        self.svgHeight = self.bounds.height - (self.padding.top + self.padding.bottom);

        self.querySVG = self.queryDiv.append("svg")
            .attr("width", self.svgWidth)
            .attr("height", self.svgHeight);
        self.querySVG.append("rect")
            .attr("x", 0)
            .attr("y", 5)
            .attr("width", self.svgWidth)
            .attr("height", self.svgHeight)
            .attr("fill", "grey");

        // Call update method.
        self.update();

    }

    update() {

        var self = this;

        //self.selector.on("change", self.update(d3.event));
        self.submit.on("click", function () {
            //console.log(d3.event);
            //console.log(d3.event.srcElement.value);
            //console.log(d3.event.target.value);

            //self.dataFile = d3.event.target.value;
            //console.log(self.selector.node().value);
            self.dataFile = self.selector.node().value;
            //console.log(self.dataFile);

            // Load data from file in JSON format.
            // Create objects that associate with these data.
            d3.json(("data/" + self.dataFile), function (error, dataModel) {
                if (error) throw error;
                // TODO: Create instance of model object here.
                // TODO: Then send that instance of the model object to the navigationView.
                self.send(dataModel);
            });
        });
    }

    send(dataModel) {
        var self = this;
        self.navigationView.receive(dataModel);
    }
}


// TODO: In NavigationView, select between free and restricted compartment layouts.
// TODO: In NavigationView, select whether or not to highlight nodes of a specific compartment or to highlight edges
// TODO: that represent reversible reactions.
// TODO: In NavigationView, select whether or not to show labels by nodes.
// TODO: Implement a tool tip to give more information about nodes AND links.

/**
 * Declare a class to contain attributes and methods of the navigation view.
 * Methods of this class receive data for a subset of the network from the query view.
 * In response to user interaction, methods of this class modify the data further and modify parameters for the visual
 * representation of the network.
 * Methods of this class then pass the data with annotations to the network view.
 * In a typical session, the expectation is that the navigation view will interact with the network view frequently.
 */
class NavigationView {

    constructor(explorationView) {

        var self = this;
        self.explorationView = explorationView;

        self.initialize();
    }

    initialize() {

        // This method creates any necessary elements of the navigation view.
        // This method establishes all necessary event handlers for elements of the navigation view.
        // These event handlers respectively call appropriate methods.
    }

    receive(dataModel) {

        var self = this;

        // The navigation view supports modification of the data.
        // Copy the data so that it is always possible to revert to the original from the query view.
        // TODO: Send the model data to the Model class and let this class construct an instance of class Model.
        self.modelOriginal =  new Model(dataModel);
        self.modelDerivation = self.modelOriginal;
        console.log("NavigationView Model");
        console.log(self.modelDerivation);
        //console.log(self.modelDerivation.metabolite.accoa_c);
        //self.send(self.modelDerivation);
    }

    send(modelDerivation) {
        var self = this;
        self.explorationView.receive(modelDerivation);
    }
}


/**
 * Declare a class to contain attributes and methods of the network view.
 * Methods of this class receive data for a subset of the network with annotations from the navigation view.
 * Methods of this class create visual representations of the data for the network.
 */
class ExplorationView {

    constructor() {
        // Declare variable self to store original instance of the object.
        var self = this;

        self.initialize();

    }

    initialize() {

        // This method creates any necessary elements of the network view.

        var self = this;

        // Create SVG element.
        // Set dimensions of SVG proportional to dimensions of the viewport or window.
        // Definition of margin, border, and padding is in the style.
        // Define padding again here since it is difficult to access element dimensions without padding.
        // Also artificially adjust height to leave room for the selector.

        // Select element for network view from DOM.
        self.explorationDiv = d3.select("#exploration");

        // Determine element dimensions.
        self.padding = {top: 10, right: 10, bottom: 10, left: 10};
        self.bounds = {width: (self.explorationDiv.node().clientWidth), height: (self.explorationDiv.node().clientHeight)}
        self.svgWidth = self.bounds.width - (self.padding.left + self.padding.right);
        self.svgHeight = self.bounds.height - (self.padding.top + self.padding.bottom);

        // Create SVG element.
        self.explorationSVG = self.explorationDiv.append("svg")
            .attr("width", self.svgWidth)
            .attr("height", self.svgHeight);

        function createRectangle(self) {
            var self = self;
            // Create rectangle element to demonstrate dimensions of SVG element.
            self.explorationSVG.append("rect")
                .attr("x", 0)
                .attr("y", 5)
                .attr("width", self.svgWidth)
                .attr("height", self.svgHeight)
                .attr("fill", "grey");
        };
        //createRectangle(self);

    }

    receive(modelDerivation) {

        var self = this;

        self.modelDerivation = modelDerivation;

        //console.log("ExplorationView Data")
        //console.log(self.modelDerivation);
        self.draw();

        // Call update method.
        self.update();
    }

    draw() {

        var self = this;
        //console.log(self.data);

        // Determine dimensions of SVG element.
        // self.svgWidth = +self.networkSVG.attr("width");
        // self.svgHeight = +self.networkSVG.attr("height");

        // TODO: Modify the force simulation to make links longer.
        // TODO: Give reaction links different force constraint (longer) than metabolite links.
        // TODO: Set radius for collision force according to the radius of the actual node circles.

        // Initiate the force simulation.
        // Collision force prevents overlap occlusion of nodes.
        self.simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody()
                .strength(-150)
            )
            .force("collide", d3.forceCollide()
                .radius(12)
            )
            .force("link", d3.forceLink()
                .id(function (d) {return d.id;})
                .distance(65)
            )
            .force("center", d3.forceCenter(self.svgWidth / 2, self.svgHeight / 2));

        // TODO: Make markers bi-directional according to model.
        // TODO: I will need to encode that information in the data.
        // Create elements for markers (arrows) on reaction links.
        // Apparently markers do not inherit styles from CSS.
        // I tried.
        // Also, due to the necessary method of defining markers, the marker itself does not associate with useful data.
        // Instead, the link itself (that the marker is a part of) has the data.
        self.marker = self.explorationSVG.append("defs")
            .selectAll("marker")
            .data("marker")
            .enter()
            .append("marker")
            .attr("id", "marker")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 20)
            .attr("refY", 5)
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z");

        // TODO: Implement highlighting and tool tip for reaction links.
        // TODO: I don't think I want that for metabolite links.
        // TODO: I think tool tips should probably appear in a corner of the view rather than over the network.
        // TODO: They would occlude parts of the network otherwise.
        // Create links.
        self.link = self.explorationSVG.append("g")
            .selectAll("line")
            .data(self.data.links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("class", function (d) {
                var type = d.type;
                if (type === "metabolite") {
                    return "linkmetabolite";
                } else if (type === "reaction") {
                    return "linkreaction";
                };
            });

        // TODO: Implement highlighting and tool tip for metabolite links.
        // TODO: I think tool tips should probably appear in a corner of the view rather than over the network.
        // TODO: They would occlude parts of the network otherwise.
        // Create nodes.
        self.node = self.explorationSVG.append("g")
        //self.node = self.nodes
            .selectAll("circle")
            .data(self.data.nodes)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                var type = d.type;
                if (type === "metabolite") {
                    return "nodemetabolite";
                } else if (type === "reaction") {
                    return "nodereaction";
                };
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Create titles for nodes so that mouse hover will display title.
        self.node.append("title")
            .text(function (d) {
                return d.name;
            });

        self.link.append("title")
            .text(function (d) {
                return d.name;
            });

        self.simulation
            .nodes(self.data.nodes)
            .on("tick", ticked);

        self.simulation
            .force("link")
            .links(self.data.links);

        // Declare function to increment the force simulation.

        function ticked() {
            self.link
                .attr("x1", function (d) {return d.source.x;})
                .attr("y1", function (d) {return d.source.y;})
                .attr("x2", function (d) {return d.target.x;})
                .attr("y2", function (d) {return d.target.y;});

            self.node
                .attr("cx", function (d) {return d.x;})
                .attr("cy", function (d) {return d.y;});
        };

        // Declare functions to control user interaction with nodes of the graph.

        function dragstarted(d) {
            if (!d3.event.active) self.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        };

        function dragended(d) {
            if (!d3.event.active) self.simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        };

    }

    update() {

        var self = this;

        // Define interaction for nodes.

        self.node.on("mouseover", function (d) {
            //console.log(d3.event);
            //console.log(d3.event.srcElement);
            //console.log(d3.event.target);
            //self.selectionNode = d3.select(d3.event.srcElement);
            console.log("----------");
            console.log("Element Type: " + d.type);
            console.log("Name: " + d.name);
            console.log("----------");
            console.log(d);
            console.log("----------");

            // Display highlight edge around node.
            self.highlight = d3.select(this)
                .classed("highlightnode", true);

            // Display panel in top left of view with information about the node.
            // TODO: Make this a group so that it can include text elements in addition to the rectangle.
            self.panel = self.explorationSVG
                .append("g");
                //.data(d);
            self.panel
                .append("rect")
                .attr("x", 5)
                .attr("y", 5)
                .attr("width", 250)
                .attr("height", 125)
                .attr("fill", "black")
                .attr("fill-opacity", 0.25)
                .attr("stroke", "black")
                .attr("stroke-width", 5);
                //.attr("class", "panel")
            //self.panel
            //    .append("text")
            //    .attr("x", 25)
            //    .attr("y", 25)
            //    .text(function (d) {
            //        return d.type;
            //    })

        });

        self.node.on("mouseout", function () {

            // Remove highlight edge around node.
            self.unhighlight = d3.select(this)
                .classed("highlightnode", false);

            // Remove panel in top left of view with information about the node.
            self.panel.remove()

        });

        // Define interaction for links.

        self.link.on("mouseover", function (d) {
            console.log("----------");
            console.log("Element Type: " + d.type);
            console.log("Name: " + d.name);
            console.log("----------");

            // Display highlight edge around node.
            self.highlight = d3.select(this)
                .classed("highlightlink", true);

            // Display panel in top left of view with information about the node.
            // TODO: Make this a group so that it can include text elements in addition to the rectangle.
            self.panel = self.explorationSVG
                .append("g");
            //.data(d);
            self.panel
                .append("rect")
                .attr("x", 5)
                .attr("y", 5)
                .attr("width", 250)
                .attr("height", 125)
                .attr("fill", "black")
                .attr("fill-opacity", 0.25)
                .attr("stroke", "black")
                .attr("stroke-width", 5);

        });

        self.link.on("mouseout", function () {

            // Remove highlight edge around node.
            self.unhighlight = d3.select(this)
                .classed("highlightlink", false);

            // Remove panel in top left of view with information about the node.
            self.panel.remove()

        });
    }
}

// Use element dimensions and position to scale SVG element according to window size.
// var divNetwork = d3.select(#network);
// var bounds = divNetwork.node().getBoundingClientRect();


/**
 * Use an immediately-invoked function expression (IIFE) to establish scope in a convenient container.
 * An alternative style would be to declare the function and subsequently call it.
 */
(function () {

    // Create single instance objects of each view's class.
    // Pass instance objects as arguments to classes that need to interact with them.
    // This strategy avoids creation of replicate instances of each class and enables instances to communicate together.
    var explorationView = new ExplorationView();
    var navigationView = new NavigationView(explorationView);
    var queryView = new QueryView(navigationView);

})();

