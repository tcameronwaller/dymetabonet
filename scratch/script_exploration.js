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
        //self.nodes = Object.values(self.model.nodes);
        //self.links = Object.values(self.model.links);
        self.draw();
        // Call update method.
        self.update();
    }

    emphasizeNodes(identifier) {
        var self = this;
        var identifier = identifier;
        // Use a filter to accommodate multiple nodes that match the criteria.
        // If there was a single node, it might be more reasonable to assign unique identifiers to every node when
        // creating them.
        // .attr("id", function(d) { return d.identifier; })
        // Then select by nodes by their identifiers.
        // d3.select("#" + identifier);
        self.nodeCircles
            .filter(function (d) {
                return (d.reference == identifier);
            })
            .classed("emphasis-node", true);
    }

    restoreNodes(identifier) {
        var self = this;
        var identifier = identifier;
        self.nodeCircles
            .filter(function (d) {
                return (d.reference == identifier);
            })
            .classed("emphasis-node", false);
    }

    draw() {
        var self = this;

        // Select SVG element in Exploration DIV.
        self.explorationSVG = d3.select("#exploration").select("svg");

        // Determine dimensions of SVG element.
        //self.svgWidth = +self.explorationSVG.attr("width");
        //self.svgHeight = +self.explorationSVG.attr("height");
        self.svgWidth = 924;
        self.svgHeight = 572;

        // Remove existing nodes and links.
        self.explorationSVG
            .selectAll("g")
            .remove();

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

        // Create links.
        // Create links before nodes so that nodes will appear over the links.
        self.links = self.explorationSVG.append("g")
            .selectAll("line")
            .data(Object.values(self.model.links))
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("class", function (d) {
                var type = d.type;
                if (type === "metabolite") {
                    return "link-metabolite";
                } else if (type === "reaction") {
                    return "link-reaction";
                };
            });

        // Create titles for links so that mouse hover will display title.
        self.links.append("title")
            .text(function (d) {
                return d.name;
            });

        // TODO: Represent nodes for replicated nodes differently... maybe... that might be confusing.
        // TODO: Use circles of different radii for metabolites and reactions.
        // TODO: Use larger circles for metabolites.
        // TODO: Add labels for the metabolites.
        // Create nodes.
        // I wanted to use groups for nodes instead of circles...
        self.nodes = self.explorationSVG
            .append("g");
        self.nodeCircles = self.nodes
            .selectAll("circle")
            .data(Object.values(self.model.nodes));
        self.nodeCircles
            .exit()
            .remove();
        self.nodeCirclesEnter = self.nodeCircles
            .enter()
            .append("circle");
        self.nodeCircles = self.nodeCirclesEnter
            .merge(self.nodeCircles);
        self.nodeCircles
            .attr("class", function (d) {
                var type = d.type;
                if (type === "metabolite") {
                    var replication = d.replication;
                    if (replication == true) {
                        return "node-metabolite-replication";
                    } else if (replication == false) {
                        return "node-metabolite";
                    };
                } else if (type === "reaction") {
                    return "node-reaction";
                };
            })
        self.nodeCircles
            .call(d3.drag()
                .on("start", dragStart)
                .on("drag", dragged)
                .on("end", dragEnd)
            )
            .on("dblclick", release);

        // Create titles for nodes so that mouse hover will display title.
        self.nodeCircles.append("title")
            .text(function (d) {
                return d.name;
            });

        // Initiate the force simulation.
        // Collision force prevents overlap occlusion of nodes.
        // The center force causes nodes to behave strangely when user repositions them manually.
        self.simulation = d3.forceSimulation()
            .nodes(Object.values(self.model.nodes))
            .force("charge", d3.forceManyBody()
                .strength(-250)
            )
            .force("collide", d3.forceCollide()
                .radius(10)
                .strength(0.9)
            )
            .force("link", d3.forceLink()
                .links(Object.values(self.model.links))
                .id(function (d) {
                    return d.identifier;
                })
                .distance(function (d) {
                    if (d.type == "reaction") {
                        return 7;
                    } else if (d.type == "metabolite") {
                        return 5;
                    };
                })
            )
            .force("positionX", d3.forceX()
                .x(self.svgWidth / 2)
                .strength(0.1)
            )
            .force("positionY", d3.forceY()
                .y(self.svgHeight / 2)
                .strength(0.1)
            )
            //.force("center", d3.forceCenter()
            //    .x(self.svgWidth / 2)
            //    .y(self.svgHeight / 2)
            //)
            .on("tick", ticker);

        // Declare function to increment the force simulation.
        // Impose constraints on node positions (d.x and d.y) according to dimensions of bounding SVG element.
        var radius = 9;
        function ticker() {
            self.nodeCircles
                .attr("cx", function (d) {
                    return d.x = Math.max(radius, Math.min(self.svgWidth - radius, d.x));
                })
                .attr("cy", function (d) {
                    return d.y = Math.max(radius, Math.min(self.svgHeight - radius, d.y));
                });
            self.links
                .attr("x1", function (d) {return d.source.x;})
                .attr("y1", function (d) {return d.source.y;})
                .attr("x2", function (d) {return d.target.x;})
                .attr("y2", function (d) {return d.target.y;});
        };

        // Declare functions to control user interaction with nodes of the graph.
        // Allow user to drag nodes.
        // Anchor nodes in new position after drag.
        // Release nodes on double click.

        function dragStart(d) {
            if (!d3.event.active) self.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            d3.select(this)
                .classed("fixed", true);
        };

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        };

        function dragEnd(d) {
            if (!d3.event.active) self.simulation.alphaTarget(0);
            //d.fx = null;
            //d.fy = null;
        };

        function release(d) {
            d.fx = null;
            d.fy = null;
            d3.select(this)
                .classed("fixed", false);
        };
    }

    update() {
        var self = this;

        // Define interaction for nodes.
        self.nodeCircles.on("mouseover", function (d) {
            //console.log(d3.event);
            //console.log(d3.event.srcElement);
            //console.log(d3.event.target);
            //self.selectionNode = d3.select(d3.event.srcElement);
            //console.log("----------");
            //console.log("Element Type: " + d.type);
            //console.log("Name: " + d.name);
            //console.log("----------");
            //console.log(d);
            //console.log("----------");
            // Display highlight edge around node.
            d3.select(this)
                .classed("emphasis-node", true);
        });
        self.nodeCircles.on("mouseout", function () {
            // Remove highlight edge around node.
            d3.select(this)
                .classed("emphasis-node", false);
        });

        // Define interaction for links.
        self.links
            .filter(function (d) {
                return (d.type == "reaction");
            })
            .on("mouseover", function (d) {
                //console.log("----------");
                //console.log("Element Type: " + d.type);
                //console.log("Name: " + d.name);
                //console.log("----------");
                // Display highlight edge around node.
                d3.select(this)
                    .classed("emphasis-link", true);
            });
        self.links.on("mouseout", function () {
            // Remove highlight edge around node.
            d3.select(this)
                .classed("emphasis-link", false);
        });
    }
}
