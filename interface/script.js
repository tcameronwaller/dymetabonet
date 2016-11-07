
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
        self.optionsArray = ["model_e-coli_core.json", "model_e-coli_2.json"];
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

    constructor(networkView) {

        var self = this;
        self.networkView = networkView;

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
        console.log("NavigationView Data")
        console.log(self.dataOriginal)
        self.send(self.dataDerivation);
    }

    send(data) {

        var self = this;

        self.networkView.receive(data);
    }
}


/**
 * Declare a class to contain properties and methods of the network view.
 * Methods of this class receive data for a subset of the network with annotations from the navigation view.
 * Methods of this class create visual representations of the data for the network.
 */
class NetworkView {

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
        self.networkDiv = d3.select("#network");

        // Determine element dimensions.
        self.padding = {top: 10, right: 10, bottom: 10, left: 10};
        self.bounds = {width: (self.networkDiv.node().clientWidth), height: (self.networkDiv.node().clientHeight)}
        self.svgWidth = self.bounds.width - (self.padding.left + self.padding.right);
        self.svgHeight = self.bounds.height - (self.padding.top + self.padding.bottom);

        // Create SVG element.
        self.networkSVG = self.networkDiv.append("svg")
            .attr("width", self.svgWidth)
            .attr("height", self.svgHeight);
        self.networkSVG.append("rect")
            .attr("x", 0)
            .attr("y", 5)
            .attr("width", self.svgWidth)
            .attr("height", self.svgHeight)
            .attr("fill", "grey");

    }

    receive(data) {

        var self = this;

        self.data = data;

        console.log("NetworkView Data")
        console.log(self.data);

    }

    update() {

        // This method establishes any necessary event handlers for elements of the network view.
        // These event handlers respectively call appropriate methods.


        var self = this;

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
    var networkView = new NetworkView();
    var navigationView = new NavigationView(networkView);
    var queryView = new QueryView(navigationView);

})();

