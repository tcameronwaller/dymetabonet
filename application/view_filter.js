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
* Interface to summarize sets of entities and control filters by these sets.
*/
class ViewFilter {
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
      identifier: "filter",
      type: "standard",
      target: self.networkView.filterTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create and activate control for filter.
      self.createActivateFilterControl(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate controls for type of entities.
      self.createActivateEntitiesControl("metabolites", self);
      self.createActivateEntitiesControl("reactions", self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create menu for sets by processes.
      new FilterMenuView({
        category: "processes",
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        filterView: self,
        state: self.state,
        documentReference: self.document
      });
      // Create menu for sets by compartments.
      new FilterMenuView({
        category: "compartments",
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        filterView: self,
        state: self.state,
        documentReference: self.document
      });
    } else {
      // Container is not empty.
      // Set references to content.
      // Control for type of entities.
      self.metabolites = self.document.getElementById("set-metabolites");
      self.reactions = self.document.getElementById("set-reactions");
      // Control for filter.
      self.filter = self.document.getElementById("set-filter");
    }
  }
  /**
  * Creates and activates a control for the filter.
  * @param {Object} self Instance of a class.
  */
  createActivateFilterControl(self) {
    // Create control for filter.
    var identifier = "set-filter";
    self.filter = View.createCheckLabel({
      identifier: identifier,
      value: "filter",
      className: "filter",
      text: "filter",
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    self.filter.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionFilter.changeSetsFilter(self.state);
    });
  }
  /**
  * Creates and activates a control for the type of entities.
  * @param {string} entities Type of entities, metabolites or reactions.
  * @param {Object} self Instance of a class.
  */
  createActivateEntitiesControl(entities, self) {
    // Create control for type of entities.
    var identifier = "set-" + entities;
    self[entities] = View.createRadioButtonLabel({
      identifier: identifier,
      value: entities,
      name: "entities",
      className: "entities",
      text: entities,
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    self[entities].addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionFilter.changeSetsEntities(self.state);
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
    self.metabolites.checked = ViewFilter
    .determineEntityMatch("metabolites", self.state);
    self.reactions.checked = ViewFilter
    .determineEntityMatch("reactions", self.state);
    self.filter.checked = ViewFilter.determineFilter(self.state);
    // Create menu for sets by processes.
    new FilterMenuView({
      category: "processes",
      interfaceView: self.interfaceView,
      tipView: self.tipView,
      promptView: self.promptView,
      filterView: self,
      state: self.state,
      documentReference: self.document
    });
    // Create menu for sets by compartments.
    new FilterMenuView({
      category: "compartments",
      interfaceView: self.interfaceView,
      tipView: self.tipView,
      promptView: self.promptView,
      filterView: self,
      state: self.state,
      documentReference: self.document
    });
  }
  /**
  * Determines whether a type of entities matches the value in the application's
  * state.
  * @param {string} type Type of entities, metabolites or reactions.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether type of entities matches the value in the
  * application's state.
  */
  static determineEntityMatch(type, state) {
    var value = state.setsEntities;
    return value === type;
  }
  /**
  * Determines whether the filter has a true value in the application's state.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether filter has a true value in the application's
  * state.
  */
  static determineFilter(state) {
    return state.setsFilter;
  }
}

/**
* Interface to organize menu of sets.
*/
class FilterMenuView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Name of category.
  * @param {Object} parameters.interfaceView Instance of ViewInterface's class.
  * @param {Object} parameters.tipView Instance of ViewTip's class.
  * @param {Object} parameters.promptView Instance of ViewPrompt's class.
  * @param {Object} parameters.filterView Instance of ViewFilter's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({category, interfaceView, tipView, promptView, filterView, state, documentReference} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = interfaceView;
    self.tipView = tipView;
    self.promptView = promptView;
    self.filterView = filterView;
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
      identifier: ("filter-" + self.category + "-menu"),
      type: "standard",
      target: self.filterView.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      self.container.classList.add("menu");
      // Create search.
      self.search = View.createActivateSearch({
        type: "sets",
        category: self.category,
        parent: self.container,
        documentReference: self.document,
        state: self.state
      });
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create table.
      self.createActivateTable(self);
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
      // Count scale.
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
  createActivateTable(self) {
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
    self.createTableHeadColumnScale(self);
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
    var referencesOne = View.createActivateTableColumnTitle({
      attribute: "name",
      text: "Name",
      type: "sets",
      category: self.category,
      sort: true,
      parent: row,
      documentReference: self.document,
      state: self.state
    });
    self.sortGraphName = referencesOne.sortGraph;
    // Create head for counts.
    var referencesTwo = View.createActivateTableColumnTitle({
      attribute: "count",
      text: "Count",
      type: "sets",
      category: self.category,
      sort: true,
      parent: row,
      documentReference: self.document,
      state: self.state
    });
    self.sortGraphCount = referencesTwo.sortGraph;
  }
  /**
  * Creates and activates a table's head.
  * @param {Object} self Instance of a class.
  */
  createTableHeadColumnScale(self) {
    var row = View.createTableRow({
      parent: self.head,
      documentReference: self.document
    });
    // Create empty name cell.
    var cellName = View.createTableHeadCell({
      parent: row,
      className: "name",
      documentReference: self.document
    });
    // Create scale cell.
    var references = View.createTableColumnScale({
      attribute: "count",
      parent: row,
      documentReference: self.document
    });
    self.scaleGraph = references.scaleGraph;
    self.graphWidth = references.graphWidth;
    self.graphHeight = references.graphHeight;
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
    // Determine maximumal value.
    var maximalValue = self.state.setsSummaries[self.category][0].maximum;
    View.restoreTableColumnScale({
      count: maximalValue,
      pad: 3,
      graph: self.scaleGraph
    });
    self.createScale(self);
    self.createActivateSummaries(self);
  }
  /**
  * Represents search's value.
  * @param {Object} self Instance of a class.
  */
  representSearch(self) {
    // Assign value of tool for search.
    self.search.value = self.state.setsSearches[self.category];
  }
  /**
  * Represents specifications to sort summaries.
  * @param {Object} self Instance of a class.
  */
  representSorts(self) {
    View.representSort({
      category: self.category,
      attribute: "name",
      sorts: self.state.setsSorts,
      parent: self.sortGraphName,
      documentReference: self.document
    });
    View.representSort({
      category: self.category,
      attribute: "count",
      sorts: self.state.setsSorts,
      parent: self.sortGraphCount,
      documentReference: self.document
    });
  }
  /**
  * Creates scale.
  * @param {Object} self Instance of a class.
  */
  createScale(self) {
    // Determine maximumal value.
    var maximalValue = self.state.setsSummaries[self.category][0].maximum;
    // Create scale.
    self.determineScaleValue = d3
    .scaleLinear()
    .domain([0, maximalValue])
    .range([5, (self.graphWidth * 0.9)])
    .nice(2);
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
      return self.state.setsSummaries[self.category];
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
    self.rows.on("click", function (element, index, nodes) {
      // Call action.
      ActionFilter.changeSetsFilters({
        value: element.value,
        attribute: element.attribute,
        state: self.state
      });
    });
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
      FilterMenuView.createTip({
        attribute: element.attribute,
        value: element.value,
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
      FilterMenuView.createTip({
        attribute: element.attribute,
        value: element.value,
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
    // Create cells for names and counts.
    // Define function to access data.
    function access(element, index, nodes) {
      // Organize data.
      return [].concat(
        {
          type: "name",
          attribute: element.attribute,
          value: element.value
        },
        {
          type: "count",
          attribute: element.attribute,
          count: element.count,
          maximum: element.maximum,
          value: element.value
        }
      );
    };
    // Create children elements by association to data.
    self.cells = View.createElementsData({
      parent: self.rows,
      type: "td",
      accessor: access
    });
    // Assign attributes to cells for sets' names.
    self.representNames(self);
    // Assign attributes to cells for sets' counts.
    self.representCounts(self);
  }
  /**
  * Represents sets' names.
  * @param {Object} self Instance of a class.
  */
  representNames(self) {
    // Assign attributes to cells.
    // Assign attributes to elements.
    // Select cells for names.
    self.names = self.cells
    .filter(function (element, index, nodes) {
      return element.type === "name";
    });
    self.names
    .classed("name", true)
    .text(function (element, index, nodes) {
      return FilterMenuView.accessName({
        attribute: element.attribute,
        value: element.value,
        state: self.state
      });
    });
  }
  /**
  * Represents counts.
  * @param {Object} self Instance of a class.
  */
  representCounts(self) {
    var barMarks = View.representCounts({
      cells: self.cells,
      graphHeight: self.graphHeight,
      determineScaleValue: self.determineScaleValue
    });
    // Assign attributes to elements.
    barMarks
    .classed("normal", function (element, index, nodes) {
      return !FilterMenuView.determineSetSelection({
        value: element.value,
        attribute: element.attribute,
        state: self.state
      });
    })
    .classed("emphasis", function (element, index, nodes) {
      return FilterMenuView.determineSetSelection({
        value: element.value,
        attribute: element.attribute,
        state: self.state
      });
    });
  }
  /**
  * Creates tip.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.attribute Name of an attribute.
  * @param {string} parameters.value Identifier of a value.
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
  static createTip({attribute, value, count, horizontalPosition, verticalPosition, tipView, documentReference, state} = {}) {
    // Create summary for tip.
    var name = FilterMenuView.accessName({
      attribute: attribute,
      value: value,
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
  * Accesses the name of a value of an attribute.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.attribute Name of an attribute.
  * @param {string} parameters.value Identifier of a value.
  * @param {Object} parameters.state Application's state.
  * @returns {string} Name of the value of the attribute.
  */
  static accessName({attribute, value, state} = {}) {
    return state[attribute][value].name;
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
}
