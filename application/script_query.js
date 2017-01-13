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


// I'm just testing to see how typing affects the CPU usange by WebStorm.
// Webstorm


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
            "model_h-sapiens_recon-2.json",
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
            d3.json(("../model/homo-sapiens/" + self.dataFile), function (error, dataModel) {
                if (error) throw error;
                self.assembleNetwork(dataModel);
            });
        });
    }

    assembleNetwork(dataModel) {
        var self = this;
        // Create instance of class Network.
        self.network = new NetworkAssembly(dataModel);
        //self.send();
    }

    send() {
        var self = this;
        // Send instance of class Network to the Navigation View.
        self.navigationView.receive(self.network);
    }
}
