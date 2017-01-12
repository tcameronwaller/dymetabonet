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
        // Prepare data for rows.
        self.metaboliteRows = Object.values(self.model.metabolites);
        // Sort metabolites by degree in descending order, breaking ties by identifier in alphabetical order.
        self.metaboliteRows.sort(function compare(a, b) {
            if (a.degree < b.degree) {
                return 1;
            } else if (a.degree > b.degree) {
                return -1;
            } else if (a.degree == b.degree) {
                if (a.identifier < b.identifier) {
                    return -1;
                } else if (a.identifier > b.identifier) {
                    return 1;
                } else {
                    return 0;
                };
            };
        });
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
            //.data(Object.values(self.model.metabolites));
            .data(self.metaboliteRows);
        self.degreeTableBodyRows
            .exit()
            .remove();
        self.degreeTableBodyRowsEnter = self.degreeTableBodyRows
            .enter()
            .append("tr");
        self.degreeTableBodyRows = self.degreeTableBodyRowsEnter
            .merge(self.degreeTableBodyRows);

        // TODO: The title creation for rows works properly.
        // TODO: For some reason the title does not display on mouse hover.
        // Create titles for rows so that mouse hover will display title.
        self.degreeTableBodyRows
            .append("title")
            .text(function (d) {
                return d.name;
            });

        // Create interactivity (highlighting) of table rows.
        // Use mouseenter and mouseleave to avoid specificity for child elements (tds).
        self.degreeTableBodyRows
            .on("mouseenter", function (d) {
                d3.select(this)
                    .classed("emphasis-row", true);
                self.explorationView.emphasizeNodes(d.identifier);
            });
        self.degreeTableBodyRows
            .on("mouseleave", function (d) {
                d3.select(this)
                    .classed("emphasis-row", false);
                self.explorationView.restoreNodes(d.identifier);
            });
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
        // Find maximal degree of model for domain.
        var degreeArray = [];
        for (let key in self.model.metabolites) {
            let metabolite = self.model.metabolites[key];
            degreeArray.push(metabolite.degree);
        };
        var maximumDegree = Math.max.apply(null, degreeArray);
        self.degreeScale = d3.scaleLinear()
            .domain([0, maximumDegree])
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

    // TODO: Encode degree also in the value of the bars.
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
            .classed("degree-bar", true);

        self.degreeTableDegreesLabel = self.degreeTableDegreesGroup
            .append("text")
            .text(function (d) {
                return String(d.value);
            })
            .attr("x", function (d) {
                return self.degreeScale(d.value) - 10;
            })
            .attr("y", 9)
            .classed("degree-label", true);
    }

    createDegreeTableReplication() {
        var self = this;
        self.degreeTableReplications = self.degreeTableBodyCells
            .filter(function (d) {
                return d.column == "replication";
            });
        self.degreeTableReplicationsSVG = self.degreeTableReplications
            .append("svg")
            .attr("width", (self.cellHeight + self.cellPad))
            .attr("height", (self.cellHeight + self.cellPad));
        self.degreeTableReplicationsBar = self.degreeTableReplicationsSVG
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", self.cellHeight)
            .attr("height", self.cellHeight)
            .attr("fill", function (d) {
                if (d.value == false) {
                    return "grey";
                } else if (d.value == true) {
                    return "red";
                };
            });
        self.degreeTableReplicationsBar
            .on("click", function (d) {
                self.model.metabolites[d.identifier].changeReplication();
                self.model.setNetwork();
                self.createDegreeTable();
            });
    }

    createDegreeTable() {
        var self = this;

        self.cellWidth = 150;
        self.cellHeight = 10;
        self.cellPad = 2;

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
