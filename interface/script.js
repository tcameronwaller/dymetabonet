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

        // TODO: Define appropriate margins for neat layout.

        // Select element for network view from DOM.
        self.divNetwork = d3.select("#network");

        // Determine element dimensions and position.
        var bounds = divNetwork.node().getBoundingClientRect();
        self.width = bounds.width * 0.66;
        self.height = bounds.height;

        // Create SVG element.
        self.svgNetwork = self.divNetwork.append("svg")
            .attr("width", self.width)
            .attr("height", self.height);
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
//(function () {})();

