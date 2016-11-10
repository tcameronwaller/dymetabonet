
// TODO: In NavigationView, select between free and restricted compartment layouts.
// TODO: In NavigationView, select whether or not to highlight nodes of a specific compartment or to highlight edges
// TODO: that represent reversible reactions.
// TODO: In NavigationView, select whether or not to show labels by nodes.
// TODO: Implement a tool tip to give more information about nodes AND links.


/**
 * Declare a class to contain properties and methods of the query view.
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
            "model_e-coli_citrate-cycle_node-link.json", "model_e-coli_citrate-cycle_sub_node-link.json"
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

            d3.json(("data/" + self.dataFile), function (error, data) {
                if (error) throw error;
                self.send(data);
            });

        });
    }

    send(data) {

        var self = this;

        self.navigationView.receive(data);
    }
}


/**
 * Declare a class to contain properties and methods of the navigation view.
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

    receive(data) {

        var self = this;

        // The navigation view supports modification of the data.
        // Copy the data so that it is always possible to revert to the original from the query view.
        self.dataOriginal = data;
        self.dataDerivation = data;
        //console.log("NavigationView Data")
        //console.log(self.dataOriginal)
        self.send(self.dataDerivation);
    }

    send(data) {

        var self = this;

        self.explorationView.receive(data);
    }
}


/**
 * Declare a class to contain properties and methods of the network view.
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
        self.explorationSVG.append("rect")
            .attr("x", 0)
            .attr("y", 5)
            .attr("width", self.svgWidth)
            .attr("height", self.svgHeight)
            .attr("fill", "grey");

    }

    receive(data) {

        var self = this;

        self.data = data;

        console.log("ExplorationView Data")
        console.log(self.data);
        self.update();

    }

    update() {

        var self = this;
        //console.log(self.data);

        // Determine dimensions of SVG element.
        // self.svgWidth = +self.networkSVG.attr("width");
        // self.svgHeight = +self.networkSVG.attr("height");

        // The code below is an adaptation of Mike Bostock's "Force-Directed Graph".
        // I do not know yet if it will work.

        // TODO: Remove styling of links and nodes to CSS.

        self.simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody())
            .force("link", d3.forceLink().id(function (d) {return d.id;}))
            .force("center", d3.forceCenter(self.svgWidth / 2, self.svgHeight / 2));

        self.link = self.explorationSVG.append("g")
            .selectAll("line")
            .data(self.data.links)
            .enter()
            .append("line")
            .attr("stroke", "black")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 3);

        self.node = self.explorationSVG.append("g")
            .selectAll("circle")
            .data(self.data.nodes)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("fill", "red")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Create titles for nodes so that mouse hover will display title.
        self.node.append("title")
            .text(function (d) {
                return d.name;
            });

        self.simulation
            .nodes(self.data.nodes)
            .on("tick", ticked);

        self.simulation
            .force("link")
            .links(self.data.links);

        // TODO: In order for this node-link diagram to work, I need a set of links between nodes.
        // TODO: The JSON from the original model includes multiple links in each reaction.
        // TODO: I'll need to change that with a parser.

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

