
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
        self.update();
    }

    initialize() {
        var self = this;
        // Create the selector element.
        // TODO: Provide user with a list of all files in the data directory on the SERVER.
        // TODO: Create selector options for all available data sets.
        // TODO: It seems this functionality is difficult.
        // TODO: readdirSync from Node.js might work.
        self.optionsArray = [
            "model_e-coli_citrate-cycle_sub.json", "model_e-coli_citrate-cycle.json"
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
                self.createModel(dataModel);
            });
        });
    }

    createModel(dataModel) {
        var self = this;
        // Create instance of class Model.
        self.model = new Model(dataModel);
        self.send();
    }

    send() {
        var self = this;
        // Send instance of class Model to the Navigation View.
        self.navigationView.receive(self.model);
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
        //self.initialize();
    }

    initialize() {
        // This method creates any necessary elements of the navigation view.
        // This method establishes all necessary event handlers for elements of the navigation view.
        // These event handlers respectively call appropriate methods.
    }

    /**
     * Declare a function to receive a specific instance of class Model.
     */
    receive(model) {
        var self = this;

        // The navigation view supports modification of the data.
        // Copy the data so that it is always possible to revert to the original from the query view.
        // I do not think that is necessary.

        // I want access to the specific instance of the Model class.
        // For that reason, I copy the reference rather than clone content using Object.assign().
        self.model =  model;
        self.createDegreeTable();
    }

    createDegreeTableRows() {
        var self = this;
        // Remove existing rows of table.
        d3.select("#degree-table")
            .select("tbody")
            .selectAll("tr")
            .remove();
        // Create rows of table that associate with data.
        self.degreeTable = d3.select("#degree-table");
        self.degreeTableBody = self.degreeTable.select("tbody");
        self.degreeTableBodyRows = self.degreeTableBody
            .selectAll("tr")
            //.data(self.model.metabolites);
            // It seems that D3's data association only works with arrays.
            .data(Object.values(self.model.metabolites));
        self.degreeTableBodyRows
            .exit()
            .remove();
        self.degreeTableBodyRowsEnter = self.degreeTableBodyRows
            .enter()
            .append("tr");
        self.degreeTableBodyRows = self.degreeTableBodyRowsEnter
            .merge(self.degreeTableBodyRows);

        // TODO: Define interactivity of table rows.
        // Create interactivity (highlighting) of table rows.
    }

    createDegreeTableCells() {
        var self = this;
        // Create cells of table that associate with data.
        self.degreeTableBodyCells = self.degreeTableBodyRows.selectAll("td")
            .data(function (d) {
                var rowData = [];
                var identifier = {};
                identifier.column = "identifier";
                identifier.type = "text";
                identifier.value = d.identifier;
                rowData.push(identifier);
                var degree = {};
                degree.column = "degree";
                degree.type = "numberBar";
                degree.value = d.degree;
                rowData.push(degree);
                var replication = {};
                replication.column = "replication"
                replication.identifier = d.identifier;
                replication.value = d.replication;
                rowData.push(replication);
                return rowData;
            });
        self.degreeTableBodyCells
            .exit()
            .remove();
        self.degreeTableBodyCellsEnter = self.degreeTableBodyCells
            .enter()
            .append("td");
        self.degreeTableBodyCells = self.degreeTableBodyCellsEnter
            .merge(self.degreeTableBodyCells);
    }

    createDegreeTableScale() {
        var self = this;
        // Create scale for degrees.
        // TODO: Determine domain from data.
        self.degreeScale = d3.scaleLinear()
            .domain([0, 5])
            .range([self.cellPad, (self.cellWidth - self.cellPad)])
            .nice();
    }

    createDegreeTableIdentifier() {
        var self = this;
        self.degreeTableIdentifiers = self.degreeTableBodyCells
            .filter(function (d) {
                return d.column == "identifier";
            });
        self.degreeTableIdentifiers
            .append("span")
            .text(function (d) {
                return d.value;
            });
    }

    createDegreeTableDegree() {
        var self = this;
        // TODO: How can I set the dimensions of the SVG element according to the view dimensions?
        self.degreeTableDegrees = self.degreeTableBodyCells
            .filter(function (d) {
                return d.column == "degree";
            });
        self.degreeTableDegreesSVG = self.degreeTableDegrees
            .append("svg")
            .attr("width", self.cellWidth)
            .attr("height", self.cellHeight);
        self.degreeTableDegreesGroup = self.degreeTableDegreesSVG
            .append("g");
        self.degreeTableDegreesBar = self.degreeTableDegreesGroup
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", function (d) {
                return self.degreeScale(d.value);
            })
            .attr("height", self.cellHeight)
            .style("fill", "grey");
        self.degreeTableDegreesLabel = self.degreeTableDegreesGroup
            .append("text")
            .text(function (d) {
                return String(d.value);
            })
            .attr("x", function (d) {
                return self.degreeScale(d.value) - 15;
            })
            .attr("y", 18);
            //.classed("label", true);
    }

    createDegreeTableReplication() {
        var self = this;
        self.degreeTableReplications = self.degreeTableBodyCells
            .filter(function (d) {
                return d.column == "replication";
            });
        self.degreeTableReplicationsSVG = self.degreeTableReplications
            .append("svg")
            .attr("width", 25)
            .attr("height", 25);
        self.degreeTableReplicationsBar = self.degreeTableReplicationsSVG
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 25)
            .attr("height", 25)
            .attr("fill", function (d) {
                if (d.value == false) {
                    return "grey";
                } else if (d.value == true) {
                    return "red";
                };
            });
        // TODO: I will also need to re-create the nodes and links using the Model Class.
        self.degreeTableReplicationsBar
            .on("click", function (d) {
                self.model.metabolites[d.identifier].changeReplication();
                self.model.setNetwork();
                self.createDegreeTable();
            });

    }

    createDegreeTable() {
        var self = this;

        self.cellWidth = 250;
        self.cellHeight = 25;
        self.cellPad = 10;

        // TODO: Sort the rows of the table before drawing the table.
        // TODO: Sort so that metabolites with greater degrees are at top.
        // TODO: Break ties in degree by alphabetical order.

        // Create scale for degrees.
        // TODO: Determine domain from data.
        self.createDegreeTableScale();

        // Create table rows.
        self.createDegreeTableRows();

        // Create table cells.
        self.createDegreeTableCells();

        // Set properties of table cells.
        // Set properties of identifier column.
        self.createDegreeTableIdentifier();

        // Set properties of degree column.
        self.createDegreeTableDegree();

        // Set properties of replication column.
        self.createDegreeTableReplication();

        self.send();
    }

    send() {
        var self = this;
        self.explorationView.receive(self.model);
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
    }

    receive(model) {
        var self = this;
        self.model = Object.assign({}, model);
        //console.log("ExplorationView Data")
        //console.log(self.model);
        // I think that the node-link diagram process modifies the data.
        // Create collections of nodes and links specific to this object.
        self.nodes = Object.values(self.model.nodes);
        self.links = Object.values(self.model.links);
        self.draw();
        // Call update method.
        self.update();
    }

    draw() {
        var self = this;

        // TODO: Modify the force simulation to make links longer.
        // TODO: Give reaction links different force constraint (longer) than metabolite links.
        // TODO: Set radius for collision force according to the radius of the actual node circles.

        self.explorationSVG = d3.select("#exploration").select("svg");

        // Determine dimensions of SVG element.
        self.svgWidth = +self.explorationSVG.attr("width");
        self.svgHeight = +self.explorationSVG.attr("height");

        // Remove existing nodes and links.
        self.explorationSVG
            .selectAll("g")
            .remove();


        // TODO: Use anonymous function and if clauses to set different distances for links of different types.
        // Initiate the force simulation.
        // Collision force prevents overlap occlusion of nodes.
        self.simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody()
                .strength(-250)
            )
            .force("collide", d3.forceCollide()
                .radius(12)
            )
            .force("link", d3.forceLink()
                .id(function (d) {return d.identifier;})
                .distance(65)
            )
            .force("center", d3.forceCenter(self.svgWidth / 2, self.svgHeight / 2));
            //.size([self.svgWidth, self.svgHeight]);

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
            .data(self.links)
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
            .data(self.nodes)
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
            .nodes(self.nodes)
            .on("tick", ticked);

        self.simulation
            .force("link")
            .links(self.links);

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

