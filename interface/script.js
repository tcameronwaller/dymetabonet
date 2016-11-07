
/**
 * Declare a class to contain properties and methods of the query view.
 */
class QueryView {

    constructor() {

        var self = this;
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
                var networkView = new NetworkView(data);
            });

        });
    }
}


/**
 * Declare a class to contain properties and methods of the network view.
 */
class NetworkView {

    constructor(data) {
        // Declare variable self to store original instance of the object.
        var self = this;
        self.data = data;

        self.initialize();
        self.update();
    }

    initialize() {

        var self = this;

        console.log(self.data);

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

    update() {

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
    var queryView = new QueryView();
})();

