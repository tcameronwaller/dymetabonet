/*
This file is part of project Profondeur
(https://github.com/tcameronwaller/profondeur/).

Profondeur supports visual exploration and analysis of metabolic networks.
Copyright (C) 2018 Thomas Cameron Waller

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.
If not, see <http://www.gnu.org/licenses/>.

Thomas Cameron Waller
tcameronwaller@gmail.com
Department of Biochemistry
University of Utah
Room 5520C, Emma Eccles Jones Medical Research Building
15 North Medical Drive East
Salt Lake City, Utah 84112
United States of America
*/

/**
* Interface to provide information in detail about the entire network or about
* entities within this network.
*/
class ViewSummary {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of ViewInterface's class.
  * @param {Object} parameters.panelView Instance of ViewPanel's class.
  * @param {Object} parameters.tipView Instance of ViewTip's class.
  * @param {Object} parameters.promptView Instance of ViewPrompt's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({interfaceView, panelView, tipView, promptView, state, documentReference} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = interfaceView;
    self.panelView = panelView;
    self.tipView = tipView;
    self.promptView = promptView;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes, creates and activates, view's content and behavior that does
  * not vary with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "detail",
      type: "standard",
      target: self.panelView.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create container.
      self.summaryContainer = View.createInsertContainer({
        identifier: "detail-summary-container",
        type: "standard",
        target: self.container,
        position: "beforeend",
        documentReference: self.document
      });
      // Create export.
      self.createExport(self);
    } else {
      // Container is not empty.
      // Set references to content.
      // Control for type of entities.
      self.summaryContainer = self
      .document.getElementById("detail-summary-container");
      self.export = self.document.getElementById("detail-export");
    }
  }
  /**
  * Creates a button to export information.
  * @param {Object} self Instance of a class.
  */
  createExport(self) {
    // Create button for export.
    self.export = View.createButton({
      text: "export",
      parent: self.container,
      documentReference: self.document
    });
    self.export.setAttribute("id", "detail-export");
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Determine type of summary to create.
    if (Model.determineEntitySelection(self.state)) {
      // Summarize information about entity.
      // TODO: summarize the entity... similar to old tip for topology view.
    } else {
      // Summarize information about the entirety of entities and their network.
      //self.createRestoreActivateSummaryEntirety(self);
    }
  }
  /**
  * Creates, restores, and activates a summary of the entirety of entities and
  * their network.
  * @param {Object} self Instance of a class.
  */
  createRestoreActivateSummaryEntirety(self) {
    self.createSummaryEntirety(self);
    self.restoreSummaryEntirety(self);
    self.activateSummaryEntirety(self);
  }
  /**
  * Creates summary of the entirety of entities and their network.
  * @param {Object} self Instance of a class.
  */
  createSummaryEntirety(self) {
    // Determine whether container's current content matches view's novel type.
    // Container's class indicates type of content.
    if (!self.summaryContainer.classList.contains("entirety")) {
      // Container's current content does not match view's novel type.
      // Remove container's previous contents and assign a class name to
      // indicate view's novel type.
      View.removeContainerContentSetClass({
        container: self.summaryContainer,
        className: "entirety"
      });
      // Create content.
      var filterReferences = ViewSummary.createSummaryEntiretyTable({
        name: "filter",
        categories: ["metabolites", "reactions"],
        parent: self.summaryContainer,
        documentReference: self.document
      });
      self.filterMetabolitesGraph = filterReferences.graphOne;
      self.filterReactionsGraph = filterReferences.graphTwo;
      var traversalReferences = ViewSummary.createSummaryEntiretyTable({
        name: "traversal",
        categories: ["nodes", "links"],
        parent: self.summaryContainer,
        documentReference: self.document
      });
      self.traversalNodesGraph = traversalReferences.graphOne;
      self.traversalLinksGraph = traversalReferences.graphTwo;
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      self.filterMetabolitesGraph = self
      .summaryContainer.querySelector("table.filter tbody td svg.metabolites");
      self.filterReactionsGraph = self
      .summaryContainer.querySelector("table.filter tbody td svg.reactions");
      self.traversalNodesGraph = self
      .summaryContainer
      .querySelector("table.traversal tbody td svg.nodes");
      self.traversalLinksGraph = self
      .summaryContainer.querySelector("table.traversal tbody td svg.links");
    }
  }
  /**
  * Creates a table to summarize the entirety of entities and their network.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.name Name for table.
  * @param {Array<string>} parameters.categories Names of categories for rows.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} References to elements.
  */
  static createSummaryEntiretyTable({name, categories, parent, documentReference} = {}) {
    // Create title.
    var title = View.createAppendSpanText({
      text: name,
      parent: parent,
      documentReference: documentReference
    });
    // Create break.
    parent.appendChild(documentReference.createElement("br"));
    // Create table body.
    var body = View.createTableBody({
      className: name,
      parent: parent,
      documentReference: documentReference
    });
    // Create table body row, name cell, and graph cell.
    var graphOne = ViewSummary.createSummaryEntiretyTableBodyRowCells({
      category: categories[0],
      body: body,
      documentReference: documentReference
    });
    var graphTwo = ViewSummary.createSummaryEntiretyTableBodyRowCells({
      category: categories[1],
      body: body,
      documentReference: documentReference
    });
    // Compile and return references to elements.
    return {
      graphOne: graphOne,
      graphTwo: graphTwo
    };
  }
  /**
  * Creates a row and cells in a table's body to summarize the entirety of
  * entities and their network.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Names of category for row.
  * @param {Object} parameters.body Reference to tabel's body.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createSummaryEntiretyTableBodyRowCells({category, body, documentReference} = {}) {
    // Create row.
    var row = View.createTableBodyRow({
      body: body,
      documentReference: documentReference
    });
    // Create title cell.
    var titleCell = View.createTableBodyRowCell({
      row: row,
      documentReference: documentReference
    });
    var title = View.createAppendSpanText({
      text: (category + ":"),
      parent: titleCell,
      documentReference: documentReference
    });
    // Create summary cell.
    var summaryCell = View.createTableBodyRowCell({
      row: row,
      documentReference: documentReference
    });
    // Create graphical container.
    var graph = View.createGraph({
      parent: summaryCell,
      documentReference: documentReference
    });
    return graph;
  }
  /**
  * Restores summary of the entirety of entities and their network.
  * @param {Object} self Instance of a class.
  */
  restoreSummaryEntirety(self) {
    // Prepare information for summary.
    // Filter.
    var reactionsTotal = Object.keys(self.state.totalSetsReactions).length;
    var reactionsFilter = Object.keys(self.state.filterSetsReactions).length;
    var metabolitesTotal = Object.keys(self.state.totalSetsMetabolites).length;
    var metabolitesFilter = Object
    .keys(self.state.filterSetsMetabolites).length;
    // Traversal.
    var nodesNetwork = self.state.networkNodesRecords.length;
    var nodesSubnetwork = self.state.subnetworkNodesRecords.length;
    var linksNetwork = self.state.networkLinksRecords.length;
    var linksSubnetwork = self.state.subnetworkLinksRecords.length;

    // TODO: Write a function that accepts the graph, its total and current and
    // TODO: Makes the labeled bar chart.
    //self.filterMetabolitesGraph
    //self.filterReactionsGraph
    //self.traversalNodesGraph
    //self.traversalLinksGraph

    // Determine graphs' dimensions.
    //self.graphWidth = General.determineElementDimension(self.graph, "width");
    //self.graphHeight = General.determineElementDimension(self.graph, "height");
  }
  /**
  * Activates summary of the entirety of entities and their network.
  * @param {Object} self Instance of a class.
  */
  activateSummaryEntirety(self) {
    // Activate behavior.
    self.export.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      // TODO: Update this action... need to be specific to type of summary...
      Action.exportFilterEntitiesSummary(self.state);
    });
  }
}

/**
* Interface to summarize filters and network's elements and control visual
* representation of network's topology.
*/
class SummaryViewScrap {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.tipView Instance of ViewTip's class.
  * @param {Object} parameters.exploration Instance of ViewExploration's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({tipView, exploration, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views.
    self.view = self.document.getElementById("view");
    self.tipView = tipView;
    self.exploration = exploration;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes, creates and activates, view's content and behavior that does
  * not vary with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "summary",
      type: "standard",
      target: self.exploration.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create instructions.
      var instruction = self.document.createElement("div");
      self.container.appendChild(instruction);
      var message = (
        "Filters from Set View and simplifications from Candidacy View define "
        + "network's elements. Network is then accessible to traversals from "
        + "Traversal View. Subnetwork is actually represented or exported."
      );
      instruction.textContent = message;
      // Create summary.
      self.createSummary(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate buttons.
      self.draw = View.createButton({
        text: "draw",
        parent: self.container,
        documentReference: self.document
      });
      self.draw.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        Action.changeTopology(self.state);
      });
    } else {
      // Container is not empty.
      // Set references to content.
      self.summaryNetwork = self.container.querySelector("div span.network");
      self.summarySubnetwork = self
      .container.querySelector("div span.subnetwork");
    }
  }
  /**
  * Creates a summary of the network and subnetwork.
  * @param {Object} self Instance of a class.
  */
  createSummary(self) {
    var summary = self.document.createElement("div");
    self.container.appendChild(summary);
    self.summaryNetwork = self.document.createElement("span");
    summary.appendChild(self.summaryNetwork);
    self.summaryNetwork.classList.add("network");
    // Create break.
    summary.appendChild(self.document.createElement("br"));
    self.summarySubnetwork = self.document.createElement("span");
    summary.appendChild(self.summarySubnetwork);
    self.summarySubnetwork.classList.add("subnetwork");
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Create view's variant elements.
    // Activate variant behavior of view's elements.
    // Summarize the network's elements.
    var networkNodes = self.state.networkNodesRecords.length;
    var networkLinks = self.state.networkLinksRecords.length;
    var networkMessage = (
      "Network's nodes : " + networkNodes + "... links: " + networkLinks
    );
    self.summaryNetwork.textContent = networkMessage;
    // Summarize the subnetwork's elements.
    var subnetworkNodes = self.state.subnetworkNodesRecords.length;
    var subnetworkLinks = self.state.subnetworkLinksRecords.length;
    var subnetworkMessage = (
      "Subnetwork's nodes : " + subnetworkNodes + "... links: " + subnetworkLinks
    );
    self.summarySubnetwork.textContent = subnetworkMessage;
  }
}
