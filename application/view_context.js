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
* Interface to summarize candidate entities and control simplifications.
*/
class ViewContext {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({documentReference, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = self.state.views.interface;
    self.tipView = self.state.views.tip;
    self.promptView = self.state.views.prompt;
    self.networkView = self.state.views.network;
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
      identifier: "context",
      classNames: ["container", "panel", "control", "tierThree"],
      type: "standard",
      target: self.networkView.contextTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create and activate control for compartmentalization.
      self.createActivateCompartmentalizationControl(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate control for default simplifications.
      self.createActivateDefaultSimplificationsControl(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create menu for sets by processes.
      new ViewContextMenu({
        category: "metabolites",
        contextView: self,
        documentReference: self.document,
        state: self.state
      });
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create menu for sets by compartments.
      new ViewContextMenu({
        category: "reactions",
        contextView: self,
        documentReference: self.document,
        state: self.state
      });
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
    } else {
      // Container is not empty.
      // Set references to content.
      self.compartmentalization = self
      .document.getElementById("candidacy-compartmentalization");
      self.simplifications = self
      .document.getElementById("candidacy-simplifications");
    }
  }
  /**
  * Creates and activates a control for compartmentalization.
  * @param {Object} self Instance of a class.
  */
  createActivateCompartmentalizationControl(self) {
    // Create control for compartmentalization.
    var identifier = "candidacy-compartmentalization";
    self.compartmentalization = View.createCheckLabel({
      identifier: identifier,
      value: "compartmentalization",
      className: "compartmentalization",
      text: "compartmentalization",
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    self.compartmentalization.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionContext.changeCompartmentalization(self.state);
    });
  }
  /**
  * Creates and activates a control for default simplifications.
  * @param {Object} self Instance of a class.
  */
  createActivateDefaultSimplificationsControl(self) {
    // Create control for default simplifications.
    var identifier = "candidacy-simplifications";
    self.simplifications = View.createCheckLabel({
      identifier: identifier,
      value: "simplifications",
      className: "simplifications",
      text: "default simplifications",
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    self.simplifications.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionContext.changeDefaultSimplifications(self.state);
    });
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Create view's variant elements.
    // Activate variant behavior of view's elements.
    self.compartmentalization.checked = ViewContext
    .determineCompartmentalization(self.state);
    self.simplifications.checked = ViewContext
    .determineSimplifications(self.state);
    // Create menu for candidate metabolites.
    new ViewContextMenu({
      category: "metabolites",
      contextView: self,
      documentReference: self.document,
      state: self.state
    });
    // Create menu for candidate reactions.
    new ViewContextMenu({
      category: "reactions",
      contextView: self,
      documentReference: self.document,
      state: self.state
    });
  }
  /**
  * Determines whether compartmentalization has a true value in the
  * application's state.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether compartmentalization has a true value in the
  * application's state.
  */
  static determineCompartmentalization(state) {
    return state.compartmentalization;
  }
  /**
  * Determines whether default simplifications has a true value in the
  * application's state.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether default simplifications has a true value in the
  * application's state.
  */
  static determineSimplifications(state) {
    return state.defaultSimplifications;
  }
}

// TODO: Change order of columns in the context menus...
// TODO: name, replicate, omit, count

/**
* Interface to organize menu of candidates for simplification.
*/
class ViewContextMenu {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Name of category.
  * @param {Object} parameters.contextView Instance of ViewContext's class.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({category, contextView, documentReference, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = self.state.views.interface;
    self.tipView = self.state.views.tip;
    self.promptView = self.state.views.prompt;
    self.networkView = self.state.views.network;
    self.contextView = contextView;
    // Set reference to category.
    self.category = category;
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
      identifier: ("simplification-" + self.category + "-menu"),
      classNames: ["container", "menu"],
      type: "standard",
      target: self.contextView.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create menu.
      self.createActivateMenu(self);
    } else {
      // Container is not empty.
      // Set references to content.
      // Search.
      self.search = self.container.querySelector("input.search");
      // Sorts.
      self.sortGraphName = self
      .container.querySelector("table thead tr th.name svg.sort");
      self.sortGraphCount = self
      .container.querySelector("table thead tr th.count svg.sort");
      // Scale.
      self.scaleGraph = self
      .container.querySelector("table thead tr th.count svg.scale");
      self.graphWidth = General
      .determineElementDimension(self.scaleGraph, "width");
      self.graphHeight = General
      .determineElementDimension(self.scaleGraph, "height");
      // Table body.
      self.body = self.container.getElementsByTagName("tbody").item(0);
    }
  }
  /**
  * Creates and activates a table.
  * @param {Object} self Instance of a class.
  */
  createActivateMenu(self) {
    // Create separate tables for head and body to support stationary head and
    // scrollable body.
    // Create head table.
    self.createActivateTableHead(self);
    // Create body table.
    self.createTableBody(self);
  }
  /**
  * Creates and activates a table's head.
  * @param {Object} self Instance of a class.
  */
  createActivateTableHead(self) {
    // Create head table.
    self.head = View.createTableHead({
      parent: self.container,
      documentReference: self.document
    });
    // Create column titles.
    self.createActivateTableHeadColumnTitles(self);
    // Create column scale.
    self.createTableHeadColumnSearchScale(self);
  }
  /**
  * Creates and activates a table's head.
  * @param {Object} self Instance of a class.
  */
  createActivateTableHeadColumnTitles(self) {
    var row = View.createTableRow({
      parent: self.head,
      documentReference: self.document
    });
    // Create titles and sorts.
    // Create head for names.
    var referencesName = View.createActivateTableColumnTitle({
      attribute: "name",
      text: General.capitalizeString(self.category),
      type: "candidates",
      category: self.category,
      sort: true,
      parent: row,
      documentReference: self.document,
      state: self.state
    });
    self.sortGraphName = referencesName.sortGraph;
    // Create head for omission.
    var referencesOmission = View.createActivateTableColumnTitle({
      attribute: "omission",
      text: "X",
      type: "candidates",
      category: self.category,
      sort: false,
      parent: row,
      documentReference: self.document,
      state: self.state
    });

    // TODO: Create column for replication once replication procedure is active.
    // TODO: Will need to adjust column widths. Widths of metabolite count and reaction count will differ.
    // Create head for replication.
    if (false) {
      var referencesOmission = View.createActivateTableColumnTitle({
        attribute: "replication",
        text: "...",
        type: "candidates",
        category: self.category,
        sort: false,
        parent: row,
        documentReference: self.document,
        state: self.state
      });
    }
    // Create head for counts.
    var referencesCount = View.createActivateTableColumnTitle({
      attribute: "count",
      text: "Count",
      type: "candidates",
      category: self.category,
      sort: true,
      parent: row,
      documentReference: self.document,
      state: self.state
    });
    self.sortGraphCount = referencesCount.sortGraph;
  }
  /**
  * Creates and activates a table's head.
  * @param {Object} self Instance of a class.
  */
  createTableHeadColumnSearchScale(self) {
    var row = View.createTableRow({
      parent: self.head,
      documentReference: self.document
    });
    // Create cell with search for name column.
    var referencesSearch = View.createTableColumnSearch({
      type: "sets",
      category: self.category,
      parent: row,
      className: "name",
      documentReference: self.document,
      state: self.state
    });
    self.search = referencesSearch.search;
    // Create empty cell for omission column.
    var cell = View.createTableHeadCell({
      parent: row,
      className: "omission",
      documentReference: self.document
    });
    // Create cell with scale for count column.
    var referencesScale = View.createTableColumnScale({
      attribute: "count",
      parent: row,
      documentReference: self.document
    });
    self.scaleGraph = referencesScale.scaleGraph;
    self.graphWidth = referencesScale.graphWidth;
    self.graphHeight = referencesScale.graphHeight;
  }
  /**
  * Creates and activates a table's body.
  * @param {Object} self Instance of a class.
  */
  createTableBody(self) {
    self.body = View.createScrollTableBody({
      className: self.category,
      parent: self.container,
      documentReference: self.document
    });
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    self.representSearch(self);
    self.representSorts(self);
    // Determine values for representation of counts.
    self.maximalValue = self.state.candidatesSummaries[self.category][0].maximum;
    self.pad = 1.5;
    View.restoreTableColumnScale({
      count: self.maximalValue,
      pad: self.pad,
      graph: self.scaleGraph
    });
    self.createActivateSummaries(self);
  }
  /**
  * Represents search's value.
  * @param {Object} self Instance of a class.
  */
  representSearch(self) {
    // Assign value of tool for search.
    self.search.value = self.state.candidatesSearches[self.category];
  }
  /**
  * Represents specifications to sort summaries.
  * @param {Object} self Instance of a class.
  */
  representSorts(self) {
    View.representSort({
      category: self.category,
      attribute: "name",
      sorts: self.state.candidatesSorts,
      parent: self.sortGraphName,
      documentReference: self.document
    });
    View.representSort({
      category: self.category,
      attribute: "count",
      sorts: self.state.candidatesSorts,
      parent: self.sortGraphCount,
      documentReference: self.document
    });
  }
  /**
  * Creates and activates summaries.
  * @param {Object} self Instance of a class.
  */
  createActivateSummaries(self) {
    // Create and activate rows for summaries.
    self.createActivateRows(self);
    // Create cells for attributes.
    self.createCells(self);
  }
  /**
  * Creates and activates rows.
  * @param {Object} self Instance of a class.
  */
  createActivateRows(self) {
    // Create and activate rows.
    // Select parent.
    var body = d3.select(self.body);
    // Define function to access data.
    function access() {
      return self.state.candidatesSummaries[self.category];
    };
    // Create children elements by association to data.
    self.rows = View.createElementsData({
      parent: body,
      type: "tr",
      accessor: access
    });
    // Assign attributes to elements.
    self.rows.classed("normal", true);
    // Activate behavior.
    self.rows.on("mouseenter", function (element, index, nodes) {
      // Select element.
      var row = nodes[index];
      var rowSelection = d3.select(row);
      // Determine cursor's positions.
      var horizontalPosition = d3.event.clientX;
      var verticalPosition = d3.event.clientY;
      // Call action.
      rowSelection.classed("normal", false);
      rowSelection.classed("emphasis", true);
      ViewContextMenu.createTip({
        identifier: element.candidate,
        entity: element.entity,
        count: element.count,
        horizontalPosition: horizontalPosition,
        verticalPosition: verticalPosition,
        tipView: self.tipView,
        documentReference: self.document,
        state: self.state
      });
    });
    self.rows.on("mousemove", function (element, index, nodes) {
      // Determine cursor's positions.
      var horizontalPosition = d3.event.clientX;
      var verticalPosition = d3.event.clientY;
      // Call action.
      ViewContextMenu.createTip({
        identifier: element.candidate,
        entity: element.entity,
        count: element.count,
        horizontalPosition: horizontalPosition,
        verticalPosition: verticalPosition,
        tipView: self.tipView,
        documentReference: self.document,
        state: self.state
      });
    });
    self.rows.on("mouseleave", function (element, index, nodes) {
      // Select element.
      var row = nodes[index];
      var rowSelection = d3.select(row);
      // Call action.
      rowSelection.classed("emphasis", false);
      rowSelection.classed("normal", true);
      self.tipView.clearView(self.tipView);
    });
  }
  /**
  * Creates cells.
  * @param {Object} self Instance of a class.
  */
  createCells(self) {
    // Create cells for names, counts, omissions, and replications.
    // Define function to access data.
    function access(element, index, nodes) {
      // Organize data.
      var name = {
        type: "name",
        entity: element.entity,
        identifier: element.candidate
      };
      var omission = {
        type: "omission",
        entity: element.entity,
        identifier: element.candidate
      };
      var count = {
        type: "count",
        count: element.count
      };
      if (false) {
        var replication = {
          type: "replication",
          entity: element.entity,
          identifier: element.candidate
        };
        return [].concat(name, count, omission, replication);
      } else {
        return [].concat(name, omission, count);
      }
    };
    // Create children elements by association to data.
    self.cells = View.createElementsData({
      parent: self.rows,
      type: "td",
      accessor: access
    });
    // Assign attributes to cells for names.
    self.representNames(self);
    // Assign attributes to cells for omission.
    self.representActivateSimplifications("omission", self);
    // Assign attributes to cells for counts.
    self.representCounts(self);
    if (false) {
      // Assign attributes to cells for replication.
      self.representActivateSimplifications("replication", self);
    }
  }
  /**
  * Represents names.
  * @param {Object} self Instance of a class.
  */
  representNames(self) {
    // Assign attributes to cells.
    // Assign attributes to elements.
    // Select cells for names.
    self.names = self.cells.filter(function (element, index, nodes) {
      return element.type === "name";
    });
    self.names
    .classed("name", true)
    .text(function (element, index, nodes) {
      return ViewContextMenu.accessName({
        identifier: element.identifier,
        entity: element.entity,
        state: self.state
      });
    });
  }
  /**
  * Represents and activates controls for simplifications.
  * @param {string} method Method for simplification, omission or replication.
  * @param {Object} self Instance of a class.
  */
  representActivateSimplifications(method, self) {
    // Assign attributes to cells.
    // Assign attributes to elements.
    // Select cells.
    var reference = (method + "s");
    self[reference] = self.cells.filter(function (element, index, nodes) {
      return element.type === method;
    });
    self[reference].classed(method, true);
    // Create check boxes.
    // Define function to access data.
    function access(element, index, nodes) {
      return [element];
    };
    // Create children elements by association to data.
    var checks = View.createElementsData({
      parent: self[reference],
      type: "input",
      accessor: access
    });
    // Assign attributes to elements.
    checks
    .attr("type", "checkbox")
    .property("checked", function (element, index, nodes) {
      return ViewContextMenu.determineSimplification({
        identifier: element.identifier,
        category: element.entity,
        method: element.type,
        state: self.state
      });
    });
    // Activate behavior.
    checks.on("change", function (element, index, nodes) {
      // Call action.
      ActionContext.changeSimplification({
        identifier: element.identifier,
        method: element.type,
        category: element.entity,
        state: self.state
      });
    });
  }
  /**
  * Represents counts.
  * @param {Object} self Instance of a class.
  */
  representCounts(self) {
    // Assign attributes to cells.
    // Assign attributes to elements.
    // Select cells for counts.
    var counts = self.cells.filter(function (element, index, nodes) {
      return element.type === "count";
    });
    counts.classed("count", true);
    // Create graphs to represent summaries' counts.
    // Graph structure.
    // - graphs (scalable vector graphical container)
    // -- barGroups (group)
    // --- barMarks (rectangle)
    // Create graphs.
    // Define function to access data.
    function access(element, index, nodes) {
      return [element];
    };
    // Create children elements by association to data.
    var graphs = View.createElementsData({
      parent: counts,
      type: "svg",
      accessor: access
    });
    // Assign attributes to elements.
    graphs.classed("chart", true);
    // Create groups.
    // Create children elements by association to data.
    var barGroups = View.createElementsData({
      parent: graphs,
      type: "g",
      accessor: access
    });
    // Assign attributes to elements.
    barGroups
    .classed("group", true)
    .attr("transform", function (element, index, nodes) {
      return "translate(" + self.pad + "," + self.pad + ")";
    });
    // Create marks.
    // Create children elements by association to data.
    var barMarks = View.createElementsData({
      parent: barGroups,
      type: "rect",
      accessor: access
    });
    // Determine dimensions.
    var width = (self.graphWidth - (self.pad * 2));
    // Determine scale for bars' dimensions.
    var scaleValue = d3
    .scaleLinear()
    .domain([0, self.maximalValue])
    .range([0, (width)]);
    // Restore bars' dimensions.
    var barHeight = 10;
    // Assign attributes to elements.
    barMarks
    .classed("mark", true)
    .attr("width", function (element, index, nodes) {
      return scaleValue(element.count);
    })
    .attr("height", barHeight);
    // Assign attributes to elements.
    barMarks
    .classed("normal", function (element, index, nodes) {
      return !ViewContextMenu.determineSimplification({
        identifier: element.identifier,
        category: element.entity,
        method: element.type,
        state: self.state
      });
    })
    .classed("emphasis", function (element, index, nodes) {
      return ViewContextMenu.determineSimplification({
        identifier: element.identifier,
        category: element.entity,
        method: element.type,
        state: self.state
      });
    });
  }
  /**
  * Creates tip.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {string} parameters.entity Type of entity, metabolites or reactions.
  * @param {number} parameters.count Count of entity's relations.
  * @param {number} parameters.horizontalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.verticalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {Object} parameters.tipView Instance of ViewTip's class.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  static createTip({identifier, entity, count, horizontalPosition, verticalPosition, tipView, documentReference, state} = {}) {
    // Create summary for tip.
    var name = ViewContextMenu.accessName({
      identifier: identifier,
      entity: entity,
      state: state
    });
    var message = (name + " (" + count + ")");
    var summary = View.createSpanText({
      text: message,
      documentReference: documentReference
    });
    // Create tip.
    tipView.restoreView({
      visibility: true,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      horizontalShift: 15,
      verticalShift: 0,
      content: summary,
      self: tipView
    });
  }
  /**
  * Accesses the name of a record.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {string} parameters.entity Type of entity, metabolites or reactions.
  * @param {Object} parameters.state Application's state.
  * @returns {string} Name of the value of the attribute.
  */
  static accessName({identifier, entity, state} = {}) {
    // Determine reference.
    if (entity === "metabolites") {
      var reference = state.candidatesMetabolites;
    } else if (entity === "reactions") {
      var reference = state.candidatesReactions;
    }
    return reference[identifier].name;
  }
  /**
  * Determines whether an attribute's value has a selection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Identifier of a value.
  * @param {string} parameters.attribute Name of an attribute.
  * @param {Object} parameters.state Application's state.
  * @returns {boolean} Whether a selection exists for the value of the
  * attribute.
  */
  static determineSetSelection({value, attribute, state} = {}) {
    return Attribution.determineSetsFilter({
      value: value,
      attribute: attribute,
      setsFilters: state.setsFilters
    });
  }
  /**
  * Determines whether a specific candidate entity has a designation for
  * simplification by a specific method.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {string} parameters.category Name of category for simplifications,
  * metabolites or reactions.
  * @param {string} parameters.method Method for simplification, omission or
  * replication.
  * @param {Object} parameters.state Application's state.
  * @returns {boolean} Whether the candidate entity has a designation for
  * simplification by the method.
  */
  static determineSimplification({identifier, category, method, state} = {}) {
    // Determine reference.
    if (category === "metabolites") {
      var simplifications = state.metabolitesSimplifications;
    } else if (category === "reactions") {
      var simplifications = state.reactionsSimplifications;
    }
    // Determine whether a simplification exists for the entity.
    if (simplifications.hasOwnProperty(identifier)) {
      // Determine whether the simplification matches the method.
      var match = (simplifications[identifier].method === method);
    } else {
      var match = false;
    }
    return match;
  }
}
