/*
Profondeur supports visual exploration and analysis of metabolic networks.
Copyright (C) 2017 Thomas Cameron Waller

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

This file is part of project Profondeur.
Project repository's address: https://github.com/tcameronwaller/profondeur/
Author's electronic address: tcameronwaller@gmail.com
Author's physical address:
T Cameron Waller
Scientific Computing and Imaging Institute
University of Utah
72 South Central Campus Drive Room 3750
Salt Lake City, Utah 84112
United States of America
*/

/**
* Functionality of utility for managing elements in the document object model
* (DOM).
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
*/
class View {
  /**
  * Inserts or appends an element to a new position in the document.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.element Reference to element for insertion.
  * @param {Object} parameters.target Reference to element for relative
  * position of insertion.
  * @param {string} parameters.position Position of insertion relative to
  * target, either "beforebegin", "afterbegin", "beforeend", or "afterend".
  * @returns {Object} Reference to element.
  */
  static insertElement({element, target, position} = {}) {
    // Method target.appendChild(element) behaves identically to
    // target.insertAdjacentElement("beforeend", element).
    return target.insertAdjacentElement(position, element);
  }
  /**
  * Creates or sets reference to a view's container.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of element.
  * @param {Object} parameters.target Reference to element for relative
  * position of insertion.
  * @param {string} parameters.position Position of insertion relative to
  * target, either "beforebegin", "afterbegin", "beforeend", or "afterend".
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createReferenceContainer({identifier, target, position, documentReference} = {}) {
    // Determine whether container's element exists in the document.
    if (!documentReference.getElementById(identifier)) {
      // Element does not exist in the document.
      // Create element.
      var container = documentReference.createElement("div");
      View.insertElement({
        element: container,
        target: target,
        position: position
      });
      container.setAttribute("id", identifier);
    } else {
      // Element exists in the document.
      // Set reference to element.
      var container = documentReference.getElementById(identifier);
    }
    return container;
  }
  /**
  * Creates a button with a label.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.text Text for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createButton({text, parent, documentReference} = {}) {
    var button = documentReference.createElement("button");
    parent.appendChild(button);
    button.textContent = text;
    return button;
  }
  /**
  * Creates a radio button with a label.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier for element.
  * @param {string} parameters.value Value for element.
  * @param {string} parameters.name Name for element's group.
  * @param {string} parameters.className Class for element.
  * @param {string} parameters.text Text for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createRadioButtonLabel({identifier, value, name, className, text, parent, documentReference} = {}) {
    // Create button.
    var button = View.createRadioButton({
      identifier: identifier,
      value: value,
      name: name,
      className: className,
      parent: parent,
      documentReference: documentReference
    });
    // Create label.
    var label = View.createLabel({
      identifier: identifier,
      text: text,
      parent: parent,
      documentReference: documentReference
    });
    // Return reference to element.
    return button;
  }
  /**
  * Creates a radio button.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier for element.
  * @param {string} parameters.value Value for element.
  * @param {string} parameters.name Name for element's group.
  * @param {string} parameters.className Class for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createRadioButton({identifier, value, name, className, parent, documentReference} = {}) {
    // Create element.
    var button = documentReference.createElement("input");
    parent.appendChild(button);
    button.setAttribute("id", identifier);
    button.setAttribute("type", "radio");
    button.setAttribute("value", value);
    button.setAttribute("name", name);
    button.classList.add(className);
    // Return reference to element.
    return button;
  }
  /**
  * Creates a check box with a label.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier for element.
  * @param {string} parameters.value Value for element.
  * @param {string} parameters.className Class for element.
  * @param {string} parameters.text Text for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createCheckLabel({identifier, value, className, text, parent, documentReference} = {}) {
    // Create check.
    var check = View.createCheck({
      identifier: identifier,
      value: value,
      className: className,
      parent: parent,
      documentReference: documentReference
    });
    // Create label.
    var label = View.createLabel({
      identifier: identifier,
      text: text,
      parent: parent,
      documentReference: documentReference
    });
    // Return reference to element.
    return check;
  }
  /**
  * Creates a check box.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier for element.
  * @param {string} parameters.value Value for element.
  * @param {string} parameters.className Class for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createCheck({identifier, value, className, parent, documentReference} = {}) {
    // Create element.
    var check = documentReference.createElement("input");
    parent.appendChild(check);
    check.setAttribute("id", identifier);
    check.setAttribute("type", "checkbox");
    check.setAttribute("value", value);
    check.classList.add(className);
    // Return reference to element.
    return check;
  }
  /**
  * Creates a label for another element.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier for element.
  * @param {string} parameters.text Text for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createLabel({identifier, text, parent, documentReference} = {}) {
    // Create element.
    var label = documentReference.createElement("label");
    parent.appendChild(label);
    label.setAttribute("for", identifier);
    label.textContent = text;
    // Return reference to element.
    return label;
  }
  /**
  * Creates a scalable vector graphical container.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createGraph({parent, documentReference} = {}) {
    // Create graph.
    var graph = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "svg");
    parent.appendChild(graph);
    return graph;
  }
  /**
  * Creates elements by association to data in data driven documents (D3).
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.parent Selection of parent element.
  * @param {string} parameters.type Type of element to create.
  * @param {Object} parameters.accessor Function to access data.
  * @returns {Object} Selection of elements.
  */
  static createElementsData({parent, type, accessor} = {}) {
    // Create children elements by association to data.
    var dataElements = parent.selectAll(type).data(accessor);
    dataElements.exit().remove();
    var novelElements = dataElements.enter().append(type);
    return novelElements.merge(dataElements);
  }
  /**
  * Creates and appends span with text.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.text Text for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createAppendSpanText({text, parent, documentReference} = {}) {
    // Create element.
    var span = View.createSpanText({
      text: text,
      documentReference: documentReference
    });
    parent.appendChild(span);
    // Return reference to element.
    return span;
  }
  /**
  * Creates span with text.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.text Text for element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createSpanText({text, documentReference} = {}) {
    // Create element.
    var span = documentReference.createElement("span");
    span.textContent = text;
    // Return reference to element.
    return span;
  }
  /**
  * Creates a search tool with label.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.text Text for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createSearchLabel({text, parent, documentReference} = {}) {
    // Create label.
    var label = View.createAppendSpanText({
      text: text,
      parent: parent,
      documentReference: documentReference
    });
    // Create tool for search.
    var search = documentReference.createElement("input");
    parent.appendChild(search);
    search.setAttribute("type", "text");
    search.classList.add("search");
    search.setAttribute("placeholder", "search...");
    // Return reference to element.
    return search;
  }
  /**
  * Creates a table, head, and head row.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.className Class for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createTableHeadRow({className, parent, documentReference} = {}) {
    // Create elements.
    var table = documentReference.createElement("table");
    parent.appendChild(table);
    table.classList.add(className);
    var head = documentReference.createElement("thead");
    table.appendChild(head);
    var row = documentReference.createElement("tr");
    head.appendChild(row);
    // Return reference to element.
    return row;
  }
  /**
  * Creates a table head cell with label.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.text Text for element.
  * @param {string} parameters.className Class for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createTableHeadCellLabel({text, className, parent, documentReference} = {}) {
    // Create elements.
    // Create cell.
    var cell = documentReference.createElement("th");
    parent.appendChild(cell);
    cell.classList.add(className);
    // Create label.
    var label = View.createAppendSpanText({
      text: text,
      parent: cell,
      documentReference: documentReference
    });
    // Return reference to element.
    return cell;
  }
  /**
  * Creates a scroll container, table, and body.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.className Class for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createScrollTableBody({className, parent, documentReference} = {}) {
    // Create elements.
    var container = documentReference.createElement("div");
    parent.appendChild(container);
    container.classList.add("scroll");
    var table = documentReference.createElement("table");
    container.appendChild(table);
    table.classList.add(className);
    var body = documentReference.createElement("tbody");
    table.appendChild(body);
    // Return reference to element.
    return body;
  }
  /**
  * Represents specifications for sorts.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Name of category.
  * @param {string} parameters.attribute Name of attribute.
  * @param {Object<Object<string>>} parameters.sorts Specifications to sort
  * records in multiple categories.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  */
  static representSort({category, attribute, sorts, parent, documentReference} = {}) {
    // Determine whether the attribute is the sort's criterion.
    if (sorts[category].criterion === attribute) {
      // Determine the sort's order.
      if (sorts[category].order === "ascend") {
        // Sort is in ascending order.
        var orientation = "up";
      } else if (sorts[category].order === "descend") {
        // Sort is in descending order.
        var orientation = "down";
      }
      // Determine whether the graphical container contains a polygon.
      if (parent.getElementsByTagName("polygon").length === 0) {
        // Create polygon.
        var mark = documentReference
        .createElementNS("http://www.w3.org/2000/svg", "polygon");
        parent.appendChild(mark);
      } else {
        // Set reference to polygon.
        var mark = parent.getElementsByTagName("polygon").item(0);
      }
      // Create points for polygon.
      var base = 10;
      var altitude = 10;
      var points = General.createIsoscelesTrianglePoints({
        base: base,
        altitude: altitude,
        orientation: orientation
      });
      mark.setAttribute("points", points);
      // Determine the dimensions of the graphical container.
      var width = General.determineElementDimension(parent, "width");
      var height = General.determineElementDimension(parent, "height");
      var x = (width / 2) - (base / 2);
      var y = (height / 2);
      mark.setAttribute("transform", "translate(" + x + "," + y + ")");
    } else {
      // Remove any marks for the criterion.
      General.removeDocumentChildren(parent);
    }
  }
  /**
  * Creates and activates a scroll container, table, and body.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.type Type of summaries.
  * @param {string} parameters.category Name of category.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Reference to element.
  */
  static createActivateSearch({type, category, parent, documentReference, state} = {}) {
    // Create elements.
    var search = View.createSearchLabel({
      text: (category + ": "),
      parent: parent,
      documentReference: documentReference
    });
    // Activate behavior.
    search.addEventListener("input", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine the search's value.
      var value = event.currentTarget.value;
      // Call action.
      Action.changeSearches({
        type: type,
        category: category,
        string: value,
        state: state
      });
    });
    // Return reference to element.
    return search;
  }
  /**
  * Creates and activates a table column's head.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.attribute Name of attribute.
  * @param {string} parameters.text Text for column head's label.
  * @param {string} parameters.type Type of summaries.
  * @param {string} parameters.category Name of category.
  * @param {boolean} parameters.sort Whether column's attribute is a sort
  * criterion.
  * @param {boolean} parameters.scale Whether column's attribute needs a scale.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} References to elements.
  */
  static createActivateTableColumnHead({attribute, text, type, category, sort, scale, parent, documentReference, state} = {}) {
    // Create cell.
    var cell = View.createTableHeadCellLabel({
      text: text,
      className: attribute,
      parent: parent,
      documentReference: documentReference
    });
    // Determine whether column's attribute is a sort criterion.
    if (sort) {
      // Create elements.
      var span = cell.getElementsByTagName("span").item(0);
      var sortGraph = View.createGraph({
        parent: span,
        documentReference: documentReference
      });
      sortGraph.classList.add("sort");
      // Activate behavior.
      cell.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        Action.changeSorts({
          type: type,
          category: category,
          criterion: attribute,
          state: state
        });
      });
      // Compile references to elements.
      var sortReferences = {
        sortGraph: sortGraph
      };
    } else {
      // Compile references to elements.
      var sortReferences = {};
    }
    // Determine whether column's attribute needs a scale.
    if (scale) {
      // Create break.
      cell.appendChild(documentReference.createElement("br"));
      // Create graphical container for scale.
      var scaleGraph = View.createGraph({
        parent: cell,
        documentReference: documentReference
      });
      scaleGraph.classList.add("scale");
      // Determine graphs' dimensions.
      var graphWidth = General.determineElementDimension(scaleGraph, "width");
      var graphHeight = General.determineElementDimension(scaleGraph, "height");
      // Compile references to elements.
      var scaleReferences = {
        scaleGraph: scaleGraph,
        graphWidth: graphWidth,
        graphHeight: graphHeight
      };
    } else {
      // Compile references to elements.
      var scaleReferences = {};
    }
    // Compile references to elements.
    var references = Object.assign(sortReferences, scaleReferences);
    // Return references to elements.
    return references;
  }
  /**
  * Represents a scale.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.scaleGraph Reference to scale's graph.
  * @param {number} parameters.graphHeight Height of scale's graph.
  * @param {Object} parameters.determineScaleValue Function to determine scale
  * value.
  */
  static representScale({scaleGraph, graphHeight, determineScaleValue} = {}) {
    // Remove contents of scale's container.
    General.removeDocumentChildren(scaleGraph);
    // Create scale's representation.
    var scaleSelection = d3.select(scaleGraph);
    var createAxis = d3.axisTop(determineScaleValue).ticks(2);
    var axisGroup = scaleSelection.append("g").call(createAxis);
    // Assign attributes.
    axisGroup.attr("transform", "translate(0," + (graphHeight - 1) + ")");
  }
  /**
  * Represents a summaries' counts.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.cells Selection of cells.
  * @param {number} parameters.graphHeight Height of scale's graph.
  * @param {Object} parameters.determineScaleValue Function to determine scale
  * value.
  * @returns {Object} Selection of elements.
  */
  static representCounts({cells, graphHeight, determineScaleValue} = {}) {
    // Assign attributes to cells.
    // Assign attributes to elements.
    // Select cells for counts.
    var counts = cells.filter(function (element, index, nodes) {
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
    graphs.classed("graph", true);
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
      var x = determineScaleValue(0);
      var y = 0;
      return "translate(" + x + "," + y + ")";
    });
    // Create marks.
    // Create children elements by association to data.
    var barMarks = View.createElementsData({
      parent: barGroups,
      type: "rect",
      accessor: access
    });
    // Assign attributes to elements.
    barMarks
    .classed("mark", true)
    .attr("width", function (element, index, nodes) {
      return determineScaleValue(element.count);
    })
    .attr("height", graphHeight);
    // Return references to elements.
    return barMarks;
  }
}

// TODO: Enable the tip view to receive any type of content, including other containers like div or table
// TODO: Remove children and re-append with each update to tip.
// TODO: Tip should just accept a child element to append.

/**
* Interface to communicate interactively concise information about other
* elements in any views.
*/
class TipView {
  /**
  * Initializes an instance of a class.
  */
  constructor () {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to document object model (DOM).
    self.document = document;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.clearView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "tip",
      target: self.document.getElementById("view"),
      position: "beforeend",
      documentReference: self.document
    });
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.visible Whether tip view is visible.
  * @param {number} parameters.positionX Pointer's horizontal coordinate.
  * @param {number} parameters.positionY Pointer's vertical coordinate.
  * @param {Object} parameters.summary Reference to summary element.
  * @param {Object} parameters.self Instance of a class.
  */
  restoreView({visible, positionX, positionY, summary, self} = {}) {
    // Remove any children.
    if (!(self.container.children.length === 0)) {
      General.removeDocumentChildren(self.container);
    }
    // Determine whether tip is visible.
    if (visible) {
      self.container.classList.remove("invisible");
      self.container.classList.add("visible");
    } else {
      self.container.classList.remove("visible");
      self.container.classList.add("invisible");
    }
    // Restore tips properties.
    self.container.style.top = ((positionY - 15) + "px");
    self.container.style.left = ((positionX + 15) + "px");
    self.container.appendChild(summary);
  }
  /**
  * Clears view.
  * @param {Object} self Instance of a class.
  */
  clearView(self) {
    self.restoreView({
      visible: false,
      positionX: 0,
      positionY: 0,
      summary: View.createSpanText({text: "",documentReference: self.document}),
      self: self
    });
  }
}

////////////////////////////////////////////////////////////////////////////////
// Control view and views within control view.

/**
* Interface to contain other interfaces for controls.
*/
class ControlView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<string>>} parameters.contents Identifiers of contents
  * within view.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({contents, tip, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views.
    self.view = self.document.getElementById("view");
    self.tip = tip;
    // Set reference to contents.
    self.contents = contents;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "control",
      target: self.view,
      position: "beforeend",
      documentReference: self.document
    });
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Remove any extraneous content from view.
    self.filterContents(self);
    // Create and activate tabs.
    self.createActivateTabs(self);
  }
  /**
  * Filters view's contents to remove all but relevant content.
  * @param {Object} self Instance of a class.
  */
  filterContents(self) {
    // Tabs.
    var tabsIdentifiers = ControlView.createTabsIdentifiers(self.contents.tabs);
    General.filterRemoveDocumentElements({
      values: tabsIdentifiers,
      attribute: "id",
      elements: self.container.children
    });
    // Panels.
    General.filterRemoveDocumentElements({
      values: self.contents.panels,
      attribute: "id",
      elements: self.container.children
    });
  }
  /**
  * Creates and activates tabs.
  * @param {Object} self Instance of a class.
  */
  createActivateTabs(self) {
    self.contents.tabs.forEach(function (category) {
      self.createActivateTab({
        category: category,
        self: self
      });
    });
  }
  /**
  * Creates and activates a tab.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Category of tab.
  * @param {Object} parameters.self Instance of a class.
  */
  createActivateTab({category, self} = {}) {
    // Create or set reference to container.
    var identifier = ControlView.createTabIdentifier(category);
    var reference = (category + "Tab");
    self[reference] = View.createReferenceContainer({
      identifier: identifier,
      target: self.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether the container is empty.
    if (self[reference].children.length === 0) {
      // Container is empty.
      // Create element.
      var label = View.createAppendSpanText({
        text: category,
        parent: self[reference],
        documentReference: self.document
      });
      // Assign attributes.
      self[reference].setAttribute("name", category);
      self[reference].classList.add("tab");
      self[reference].classList.add("normal");
      // Activate behavior.
      self[reference].addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        Action.changeControlViews({
          category: event.currentTarget.getAttribute("name"),
          state: self.state
        });
      });
      self[reference].addEventListener("mouseenter", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        event.currentTarget.classList.remove("normal");
        event.currentTarget.classList.add("emphasis");
      });
      self[reference].addEventListener("mouseleave", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        event.currentTarget.classList.remove("emphasis");
        event.currentTarget.classList.add("normal");
      });
    }
  }
  /**
  * Creates identifiers for tabs.
  * @param {Array<string>} categories Categories for tabs.
  * @returns {Array<string>} Identifiers for tabs.
  */
  static createTabsIdentifiers(categories) {
    return categories.map(function (category) {
      return ControlView.createTabIdentifier(category);
    });
  }
  /**
  * Creates identifier for a tab.
  * @param {string} category Category for a tab.
  * @returns {string} Identifier for a tab.
  */
  static createTabIdentifier(category) {
    return (category + "-tab");
  }
}
/**
* Interface to control load and save of application's state.
*/
class StateView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.control Instance of ControlView's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({tip, control, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views.
    self.view = self.document.getElementById("view");
    self.tip = tip;
    self.control = control;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "state",
      target: self.control.stateTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether the container is empty.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create view's invariant elements.
      // Activate invariant behavior of view's elements.
      // Create text.
      self.sourceLabel = self.document.createElement("span");
      self.container.appendChild(self.sourceLabel);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate file selector.
      //if (!self.container.querySelector("input")) {}
      self.fileSelector = self.document.createElement("input");
      self.container.appendChild(self.fileSelector);
      self.fileSelector.setAttribute("type", "file");
      self.fileSelector.setAttribute("accept", ".json");
      self.fileSelector.addEventListener("change", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        Action.submitSource(event.currentTarget.files[0], self.state);
      });
      // Create and activate buttons.
      self.save = View.createButton({
        text: "save",
        parent: self.container,
        documentReference: self.document
      });
      self.save.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        Action.saveState(self.state);
      });
      // Load button is a facade for the file selector.
      self.load = View.createButton({
        text: "load",
        parent: self.container,
        documentReference: self.document
      });
      self.load.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        self.fileSelector.click();
      });
      self.restore = View.createButton({
        text: "restore",
        parent: self.container,
        documentReference: self.document
      });
      self.restore.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        Action.evaluateLoadSource(self.state);
      });
      self.execute = View.createButton({
        text: "execute",
        parent: self.container,
        documentReference: self.document
      });
      self.execute.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        Action.executeTemporaryProcedure(self.state);
      });
    } else {
      // Container is not empty.
      // Set references to view's variant elements.
      self.sourceLabel = self.container.getElementsByTagName("span").item(0);
    }
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Create view's variant elements.
    // Activate variant behavior of view's elements.
    // Determine whether the application's state includes a source file.
    if (Model.determineSource(self.state)) {
      // Application's state includes a source file.
      self.fileName = self.state.source.name;
    } else {
      // Application's state does not include a source file.
      self.fileName = "select source file...";
    }
    self.sourceLabel.textContent = self.fileName;
  }
}

// TODO: Restore button should restore defaults ONLY for Set View.

/**
* Interface to summarize sets of entities and control filters by these sets.
*/
class SetView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.control Instance of ControlView's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({tip, control, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views.
    self.view = self.document.getElementById("view");
    self.tip = tip;
    self.control = control;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "set",
      target: self.control.setTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether the container is empty.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create view's invariant elements.
      // Activate invariant behavior of view's elements.
      // Create and activate restore.
      self.createActivateRestore(self);
      // Create and activate export.
      self.createActivateExport(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate controls for type of entities.
      self.createActivateEntitiesControl("metabolites", self);
      self.createActivateEntitiesControl("reactions", self);
      // Create and activate control for filter.
      self.createActivateFilterControl(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create menu for sets by processes.
      new SetMenuView({
        category: "processes",
        tip: self.tip,
        set: self,
        state: self.state
      });
      // Create menu for sets by compartments.
      new SetMenuView({
        category: "compartments",
        tip: self.tip,
        set: self,
        state: self.state
      });
    } else {
      // Container is not empty.
      // Set references to view's variant elements.
      // Control for type of entities.
      self.metabolites = self.document.getElementById("set-metabolites");
      self.reactions = self.document.getElementById("set-reactions");
      // Control for filter.
      self.filter = self.document.getElementById("set-filter");
    }
  }
  /**
  * Creates and activates a button to restore the menu.
  * @param {Object} self Instance of a class.
  */
  createActivateRestore(self) {
    // Create button for restoration.
    var restore = View.createButton({
      text: "restore",
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    restore.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      // TODO: This should call a restore button that's specific to the sets' view...
      Action.restoreApplicationInitialState(self.state);
    });
  }
  /**
  * Creates and activates a button to export information.
  * @param {Object} self Instance of a class.
  */
  createActivateExport(self) {
    // Create button for export.
    var exporter = View.createButton({
      text: "export",
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    exporter.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      Action.exportFilterEntitiesSummary(self.state);
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
      Action.changeSetsEntities(self.state);
    });
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
      Action.changeSetsFilter(self.state);
    });
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Create view's variant elements.
    // Activate variant behavior of view's elements.
    self.metabolites.checked = SetView
    .determineEntityMatch("metabolites", self.state);
    self.reactions.checked = SetView
    .determineEntityMatch("reactions", self.state);
    self.filter.checked = SetView.determineFilter(self.state);
    // Create menu for sets by processes.
    new SetMenuView({
      category: "processes",
      tip: self.tip,
      set: self,
      state: self.state
    });
    // Create menu for sets by compartments.
    new SetMenuView({
      category: "compartments",
      tip: self.tip,
      set: self,
      state: self.state
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

// TODO: Introduce concise changes from candidacy menu...

/**
* Interface to organize menu of sets.
*/
class SetMenuView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Name of category.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.set Instance of SetView's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({category, tip, set, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views.
    self.view = self.document.getElementById("view");
    self.tip = tip;
    self.set = set;
    // Set reference to category.
    self.category = category;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: ("set-" + self.category + "-menu"),
      target: self.set.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether the container is empty.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create view's invariant elements.
      // Activate invariant behavior of view's elements.
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
      // Set references to view's variant elements.
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
    var tableHeadRow = View.createTableHeadRow({
      className: self.category,
      parent: self.container,
      documentReference: self.document
    });
    // Create titles, sorts, and scale in table's header.
    // Create head for names.
    var referencesOne = View.createActivateTableColumnHead({
      attribute: "name",
      text: "Name",
      type: "sets",
      category: self.category,
      sort: true,
      scale: false,
      parent: tableHeadRow,
      documentReference: self.document,
      state: self.state
    });
    self.sortGraphName = referencesOne.sortGraph;
    // Create head for counts.
    var referencesTwo = View.createActivateTableColumnHead({
      attribute: "count",
      text: "Count",
      type: "sets",
      category: self.category,
      sort: true,
      scale: true,
      parent: tableHeadRow,
      documentReference: self.document,
      state: self.state
    });
    self.sortGraphCount = referencesTwo.sortGraph;
    self.scaleGraph = referencesTwo.scaleGraph;
    self.graphWidth = referencesTwo.graphWidth;
    self.graphHeight = referencesTwo.graphHeight;
    // Create body table.
    self.body = View.createScrollTableBody({
      className: self.category,
      parent: self.container,
      documentReference: self.document
    });
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    self.representSearch(self);
    self.representSorts(self);
    self.createScale(self);
    View.representScale({
      scaleGraph: self.scaleGraph,
      graphHeight: self.graphHeight,
      determineScaleValue: self.determineScaleValue
    });
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
      Action.changeSetsFilters({
        value: element.value,
        attribute: element.attribute,
        state: self.state
      });
    });
    self.rows.on("mouseenter", function (element, index, nodes) {
      // Determine pointer coordinates.
      var positionX = d3.mouse(self.view)[0];
      var positionY = d3.mouse(self.view)[1];
      // Select element.
      var row = nodes[index];
      var rowSelection = d3.select(row);
      // Call action.
      rowSelection.classed("normal", false);
      rowSelection.classed("emphasis", true);
      SetMenuView.createTip({
        attribute: element.attribute,
        value: element.value,
        count: element.count,
        positionX: positionX,
        positionY: positionY,
        tip: self.tip,
        documentReference: self.document,
        state: self.state
      });
    });
    self.rows.on("mousemove", function (element, index, nodes) {
      // Determine pointer coordinates.
      var positionX = d3.mouse(self.view)[0];
      var positionY = d3.mouse(self.view)[1];
      // Call action.
      SetMenuView.createTip({
        attribute: element.attribute,
        value: element.value,
        count: element.count,
        positionX: positionX,
        positionY: positionY,
        tip: self.tip,
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
      self.tip.clearView(self.tip);
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
      return SetMenuView.accessName({
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
      return !SetMenuView.determineSetSelection({
        value: element.value,
        attribute: element.attribute,
        state: self.state
      });
    })
    .classed("emphasis", function (element, index, nodes) {
      return SetMenuView.determineSetSelection({
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
  * @param {number} parameters.positionX Pointer's horizontal coordinate.
  * @param {number} parameters.positionY Pointer's vertical coordinate.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  static createTip({attribute, value, count, positionX, positionY, tip, documentReference, state} = {}) {
    // Create summary for tip.
    var name = SetMenuView.accessName({
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
    tip.restoreView({
      visible: true,
      positionX: positionX,
      positionY: positionY,
      summary: summary,
      self: tip
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

// TODO: Restore button should restore defaults ONLY for Candidacy View.

/**
* Interface to summarize candidate entities and control simplifications.
*/
class CandidacyView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.control Instance of ControlView's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({tip, control, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views.
    self.view = self.document.getElementById("view");
    self.tip = tip;
    self.control = control;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "candidacy",
      target: self.control.candidacyTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether the container is empty.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create view's invariant elements.
      // Activate invariant behavior of view's elements.
      // Create and activate restore.
      self.createActivateRestore(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate control for compartmentalization.
      self.createActivateCompartmentalizationControl(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create menu for candidate metabolites.
      new CandidacyMenuView({
        category: "metabolites",
        tip: self.tip,
        candidacy: self,
        state: self.state
      });
      // Create menu for candidate reactions.
      new CandidacyMenuView({
        category: "reactions",
        tip: self.tip,
        candidacy: self,
        state: self.state
      });
    } else {
      // Container is not empty.
      // Set references to view's variant elements.
      // Control for filter.
      self.compartmentalization = self
      .document.getElementById("candidacy-compartmentalization");
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
      Action.changeCompartmentalization(self.state);
    });
  }
  /**
  * Creates and activates a button to restore the menu.
  * @param {Object} self Instance of a class.
  */
  createActivateRestore(self) {
    // Create button for restoration.
    var restore = View.createButton({
      text: "restore",
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    restore.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      // TODO: This should call a restore button that's specific to the sets' view...
      Action.restoreApplicationInitialState(self.state);
    });
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Create view's variant elements.
    // Activate variant behavior of view's elements.
    self.compartmentalization.checked = CandidacyView
    .determineCompartmentalization(self.state);
    // Create menu for candidate metabolites.
    new CandidacyMenuView({
      category: "metabolites",
      tip: self.tip,
      candidacy: self,
      state: self.state
    });
    // Create menu for candidate reactions.
    new CandidacyMenuView({
      category: "reactions",
      tip: self.tip,
      candidacy: self,
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
}

/**
* Interface to organize menu of candidates.
*/
class CandidacyMenuView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Name of category.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.candidacy Instance of CandidacyView's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({category, tip, candidacy, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views.
    self.view = self.document.getElementById("view");
    self.tip = tip;
    self.candidacy = candidacy;
    // Set reference to category.
    self.category = category;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: ("candidacy-" + self.category + "-menu"),
      target: self.candidacy.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether the container is empty.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create view's invariant elements.
      // Activate invariant behavior of view's elements.
      self.container.classList.add("menu");
      // Create search.
      self.search = View.createActivateSearch({
        type: "candidates",
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
      // Set references to view's variant elements.
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
  createActivateTable(self) {
    // Create separate tables for head and body to support stationary head and
    // scrollable body.
    // Create head table.
    var tableHeadRow = View.createTableHeadRow({
      className: self.category,
      parent: self.container,
      documentReference: self.document
    });
    // Create titles, sorts, and scale in table's header.
    // Create head for names.
    var referencesOne = View.createActivateTableColumnHead({
      attribute: "name",
      text: "Name",
      type: "candidates",
      category: self.category,
      sort: true,
      scale: false,
      parent: tableHeadRow,
      documentReference: self.document,
      state: self.state
    });
    self.sortGraphName = referencesOne.sortGraph;
    // Create head for counts.
    var referencesTwo = View.createActivateTableColumnHead({
      attribute: "count",
      text: "Count",
      type: "candidates",
      category: self.category,
      sort: true,
      scale: true,
      parent: tableHeadRow,
      documentReference: self.document,
      state: self.state
    });
    self.sortGraphCount = referencesTwo.sortGraph;
    self.scaleGraph = referencesTwo.scaleGraph;
    self.graphWidth = referencesTwo.graphWidth;
    self.graphHeight = referencesTwo.graphHeight;
    // Create head for omission.
    var referencesThree = View.createActivateTableColumnHead({
      attribute: "omission",
      text: "X",
      type: "candidates",
      category: self.category,
      sort: false,
      scale: false,
      parent: tableHeadRow,
      documentReference: self.document,
      state: self.state
    });
    if (self.category === "metabolites") {
      // Create head for replication.
      var referencesFour = View.createActivateTableColumnHead({
        attribute: "replication",
        text: "...",
        type: "candidates",
        category: self.category,
        sort: false,
        scale: false,
        parent: tableHeadRow,
        documentReference: self.document,
        state: self.state
      });
    }
    // Create body table.
    self.body = View.createScrollTableBody({
      className: self.category,
      parent: self.container,
      documentReference: self.document
    });
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    self.representSearch(self);
    self.representSorts(self);
    self.createScale(self);
    View.representScale({
      scaleGraph: self.scaleGraph,
      graphHeight: self.graphHeight,
      determineScaleValue: self.determineScaleValue
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
  * Creates scale.
  * @param {Object} self Instance of a class.
  */
  createScale(self) {
    // Determine maximal value.
    var maximalValue = self.state.candidatesSummaries[self.category][0].maximum;
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
    function accessOne() {
      return self.state.candidatesSummaries[self.category];
    };
    // Create children elements by association to data.
    self.rows = View.createElementsData({
      parent: body,
      type: "tr",
      accessor: accessOne
    });
    // Assign attributes to elements.
    self.rows.classed("normal", true);
    // Activate behavior.
    self.rows.on("mouseenter", function (element, index, nodes) {
      // Determine pointer coordinates.
      var positionX = d3.mouse(self.view)[0];
      var positionY = d3.mouse(self.view)[1];
      // Select element.
      var row = nodes[index];
      var rowSelection = d3.select(row);
      // Call action.
      rowSelection.classed("normal", false);
      rowSelection.classed("emphasis", true);
      CandidacyMenuView.createTip({
        identifier: element.candidate,
        entity: element.entity,
        count: element.count,
        positionX: positionX,
        positionY: positionY,
        tip: self.tip,
        documentReference: self.document,
        state: self.state
      });
    });
    self.rows.on("mousemove", function (element, index, nodes) {
      // Determine pointer coordinates.
      var positionX = d3.mouse(self.view)[0];
      var positionY = d3.mouse(self.view)[1];
      // Call action.
      CandidacyMenuView.createTip({
        identifier: element.candidate,
        entity: element.entity,
        count: element.count,
        positionX: positionX,
        positionY: positionY,
        tip: self.tip,
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
      self.tip.clearView(self.tip);
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
      var count = {
        type: "count",
        count: element.count
      };
      var omission = {
        type: "omission",
        entity: element.entity,
        identifier: element.candidate
      };
      if (self.category === "metabolites") {
        var replication = {
          type: "replication",
          entity: element.entity,
          identifier: element.candidate
        };
        return [].concat(name, count, omission, replication);
      } else if (self.category === "reactions") {
        return [].concat(name, count, omission);
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
    // Assign attributes to cells for counts.
    self.representCounts(self);
    // Assign attributes to cells for omission.
    self.representActivateSimplifications("omission", self);
    if (self.category === "metabolites") {
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
      return CandidacyMenuView.accessName({
        identifier: element.identifier,
        entity: element.entity,
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
    barMarks.classed("normal", true);
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
      return CandidacyMenuView.determineSimplification({
        identifier: element.identifier,
        category: element.entity,
        method: element.type,
        state: self.state
      });
    });
    // Activate behavior.
    checks.on("change", function (element, index, nodes) {
      // Call action.
      Action.changeSimplification({
        identifier: element.identifier,
        method: element.type,
        category: element.entity,
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
  * @param {number} parameters.positionX Pointer's horizontal coordinate.
  * @param {number} parameters.positionY Pointer's vertical coordinate.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  static createTip({identifier, entity, count, positionX, positionY, tip, documentReference, state} = {}) {
    // Create summary for tip.
    var name = CandidacyMenuView.accessName({
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
    tip.restoreView({
      visible: true,
      positionX: positionX,
      positionY: positionY,
      summary: summary,
      self: tip
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
      var reference = state.metabolitesCandidates;
    } else if (entity === "reactions") {
      var reference = state.reactionsCandidates;
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

////////////////////////////////////////////////////////////////////////////////
// Exploration view and views within exploration view.

/**
* Interface to contain other interfaces for exploration.
*/
class ExplorationView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Array<string>>} parameters.contents Identifiers of contents
  * within view.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({contents, tip, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views.
    self.view = self.document.getElementById("view");
    self.tip = tip;
    // Set reference to contents.
    self.contents = contents;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "exploration",
      target: self.view,
      position: "beforeend",
      documentReference: self.document
    });
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Remove any extraneous content from view.
    self.filterContents(self);
  }
  /**
  * Filters view's contents to remove all but relevant content.
  * @param {Object} self Instance of a class.
  */
  filterContents(self) {
    General.filterRemoveDocumentElements({
      values: self.contents,
      attribute: "id",
      elements: self.container.children
    });
  }
}

/**
* Interface to summarize filters and network's elements and control visual
* representation of network's topology.
*/
class SummaryView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.exploration Instance of ExplorationView's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({tip, exploration, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views.
    self.view = self.document.getElementById("view");
    self.tip = tip;
    self.exploration = exploration;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "summary",
      target: self.exploration.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether the container is empty.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create view's invariant elements.
      // Activate invariant behavior of view's elements.
      // Create text.
      self.summary = self.document.createElement("span");
      self.container.appendChild(self.summary);
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
      // Set references to view's variant elements.
      self.summary = self.container.getElementsByTagName("span").item(0);
    }
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Create view's variant elements.
    // Activate variant behavior of view's elements.
    // Summarize the network's elements.
    var nodes = self.state.networkNodesRecords.length;
    var links = self.state.networkLinksRecords.length;
    var message = (
      "nodes : " + nodes + "... links: " + links
    );
    self.summary.textContent = message;
  }
}

/**
* Interface to represent visually the network's topology.
*/
class TopologyView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.exploration Instance of ExplorationView's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({tip, exploration, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views.
    self.view = self.document.getElementById("view");
    self.tip = tip;
    self.exploration = exploration;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "topology",
      target: self.exploration.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether the container is empty.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create view's invariant elements.
      // Activate invariant behavior of view's elements.
      // Create graphical container.
      self.createGraph(self);
      // Define links' directional marker.
      self.defineLinkDirectionalMarker(self);
      // Create graph's base.
      self.createBase(self);
      // Create group for links.
      self.createLinksGroup(self);
      // Create group for nodes.
      self.createNodesGroup(self);
    } else {
      // Container is not empty.
      // Set references to view's variant elements.
      self.graph = self.container.getElementsByTagName("svg").item(0);
      self.graphWidth = General.determineElementDimension(self.graph, "width");
      self.graphHeight = General
      .determineElementDimension(self.graph, "height");
      self.linksGroup = self.container.querySelector("svg g.links");
      self.nodesGroup = self.container.querySelector("svg g.nodes");
    }
  }
  /**
  * Creates a graphical container.
  * @param {Object} self Instance of a class.
  */
  createGraph(self) {
    // Create graphical container.
    self.graph = View.createGraph({
      parent: self.container,
      documentReference: self.document
    });
    // Determine graphs' dimensions.
    self.graphWidth = General.determineElementDimension(self.graph, "width");
    self.graphHeight = General.determineElementDimension(self.graph, "height");
  }
  /**
  * Defines link's directional marker.
  * @param {Object} self Instance of a class.
  */
  defineLinkDirectionalMarker(self) {
    // Define links' directional marker.
    var definition = self
    .document.createElementNS("http://www.w3.org/2000/svg", "defs");
    self.graph.appendChild(definition);
    var marker = self
    .document.createElementNS("http://www.w3.org/2000/svg", "marker");
    definition.appendChild(marker);
    marker.setAttribute("id", "link-marker");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", -5);
    marker.setAttribute("refY", 5);
    marker.setAttribute("markerWidth", 5);
    marker.setAttribute("markerHeight", 5);
    marker.setAttribute("orient", "auto");
    var path = self
    .document.createElementNS("http://www.w3.org/2000/svg", "path");
    marker.appendChild(path);
    path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");

    if (false) {
      // Define by D3.
      var marker = self.graphSelection
      .append("defs")
      .append("marker")
      .attr("id", "link-marker")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", -5)
      .attr("refY", 5)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z");
    }
  }
  /**
  * Creates a base within a graphical container.
  * @param {Object} self Instance of a class.
  */
  createBase(self) {
    // Create base.
    var base = self
    .document.createElementNS("http://www.w3.org/2000/svg", "rect");
    self.graph.appendChild(base);
    base.classList.add("base");
    base.setAttribute("x", "0px");
    base.setAttribute("y", "0px");
    base.setAttribute("width", self.graphWidth);
    base.setAttribute("height", self.graphHeight);
  }
  /**
  * Creates a single group to contain all links.
  * @param {Object} self Instance of a class.
  */
  createLinksGroup(self) {
    // Create group.
    self.linksGroup = self
    .document.createElementNS("http://www.w3.org/2000/svg", "g");
    self.graph.appendChild(self.linksGroup);
    self.linksGroup.classList.add("links");
  }
  /**
  * Creates a single group to contain all nodes.
  * @param {Object} self Instance of a class.
  */
  createNodesGroup(self) {
    // Create group.
    self.nodesGroup = self
    .document.createElementNS("http://www.w3.org/2000/svg", "g");
    self.graph.appendChild(self.nodesGroup);
    self.nodesGroup.classList.add("nodes");
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Prepare information about network's elements.
    self.prepareNetworkElementsRecords(self);
    // Create, activate, and restore visual representations of network's
    // elements.
    self.createActivateNetworkRepresentation(self);
    // Many alterations to the application's state do not change the network's
    // elements or topology.
    // As calculation of layout by force simulations is computationally
    // expensive, only initiate this procedure if necessary.
    // Determine whether to determine layout for network's elements and
    // topology.
    if (Model.determineTopologyNovelty(self.state)) {
      self.createNetworkLayout(self);
    }
  }
  /**
  * Prepares local records of information about network's elements.
  * @param {Object} self Instance of a class.
  */
  prepareNetworkElementsRecords(self) {
    // Copy information about network's elements, nodes and links, to preserve
    // original information against modifications, especially due to the force
    // simulation.
    self.nodesRecords = General
    .copyDeepArrayElements(self.state.networkNodesRecords, true);
    self.linksRecords = General
    .copyDeepArrayElements(self.state.networkLinksRecords, true);
  }
  /**
  * Creates and activates a visual representation of a network.
  * @param {Object} self Instance of a class.
  */
  createActivateNetworkRepresentation(self) {
    // Create scales for the visual representation of network's elements.
    // Determine these scales dynamically within the script.
    // Otherwise an alternative is to determine dimensions within style and then
    // access the dimension using element.getBoundingClientRect or
    // window.getComputeStyle.
    // Create scales for representation of network's elements.
    self.createRepresentationScales(self);
    // Create graph to represent metabolic network.
    // Graph structure.
    // - graph (scalable vector graphical container)
    // -- linksGroup (group)
    // --- linksMarks (polylines)
    // -- nodesGroup (group)
    // --- nodesGroups (groups)
    // ---- nodesMarks (ellipses, rectangles)
    // ---- nodesDirectionalMarks (rectangles, polygons)
    // ---- nodesLabels (text)
    // Create links.
    // Create links before nodes so that nodes will appear over the links.
    self.createLinks(self);
    // Create nodes.
    self.createActivateNodes(self);
  }
  /**
  * Creates scales for visual representation of network's elements.
  * @param {Object} self Instance of a class.
  */
  createRepresentationScales(self) {
    // The optimal dimensions for visual marks that represent network's elements
    // depend on the dimensions of the graphical container and on the count of
    // elements.
    //var node = self.graph.querySelector(".node.mark.metabolite .entity");
    // Define scales' domain on the basis of the ratio of the graphical
    // container's width to the count of nodes.
    var domainRatios = [0.3, 1, 5, 10, 15, 25, 50, 100, 150];
    // Define scale for dimensions of nodes' representations.
    // Domain's unit is pixel for ratio of graphical container's width to count
    // of nodes.
    // Range's unit is pixel for dimension of graphical elements.
    //domain: range
    //0-0.3: 1
    //0.3-1: 3
    //1-5: 5
    //5-10: 7
    //10-15: 10
    //15-25: 15
    //25-50: 25
    //50-100: 30
    //100-150: 35
    //150-10000: 50
    var nodeDimensionScale = d3
    .scaleThreshold()
    .domain(domainRatios)
    .range([1, 3, 5, 7, 10, 15, 30, 40, 50, 60]);
    // Define scale for dimensions of links' representations.
    // Domain's unit is pixel for ratio of graphical container's width to count
    // of nodes.
    // Range's unit is pixel for dimension of graphical elements.
    //domain: range
    //0-0.3: 0.03
    //0.3-1: 0.05
    //1-5: 0.1
    //5-10: 0.3
    //10-15: 0.5
    //15-25: 0.7
    //25-50: 1
    //50-100: 2
    //100-150: 3
    //150-10000: 5
    var linkDimensionScale = d3
    .scaleThreshold()
    .domain(domainRatios)
    .range([0.03, 0.05, 0.1, 0.3, 0.5, 0.7, 1, 2, 3, 5]);
    // Define scale for size of font in annotations.
    // Domain's unit is pixel for ratio of graphical container's width to count
    // of nodes.
    // Range's unit is pixel for dimension of font characters.
    //domain: range
    //0-0.3: 1
    //0.3-1: 2
    //1-5: 3
    //5-10: 4
    //10-15: 5
    //15-25: 7
    //25-50: 12
    //50-100: 15
    //100-150: 17
    //150-10000: 20
    var fontScale = d3
    .scaleThreshold()
    .domain(domainRatios)
    .range([1, 2, 3, 4, 5, 7, 11, 13, 15, 17]);
    // Compute ratio for scales' domain.
    self.scaleRatio = self.graphWidth / self.nodesRecords.length;
    // Compute dimensions from scale.
    self.scaleNodeDimension = nodeDimensionScale(self.scaleRatio);
    self.scaleLinkDimension = linkDimensionScale(self.scaleRatio);
    // Compute font size from scale.
    self.scaleFont = fontScale(self.scaleRatio);
  }
  /**
  * Creates links.
  * @param {Object} self Instance of a class.
  */
  createLinks(self) {
    // Create links.
    // Select parent.
    var selection = d3.select(self.linksGroup);
    // Define function to access data.
    function access(element, index, nodes) {
      return self.linksRecords;
    };
    // Create children elements by association to data.
    self.linksMarks = View.createElementsData({
      parent: selection,
      type: "polyline",
      accessor: access
    });
    // Assign attributes to elements.
    self.linksMarks.classed("link", true);
    self.linksMarks.classed("reactant", function (element, index, nodes) {
      var link = TopologyView.accessLink({
        identifier: element.identifier,
        state: self.state
      });
      return link.role === "reactant";
    });
    self.linksMarks.classed("product", function (element, index, nodes) {
      var link = TopologyView.accessLink({
        identifier: element.identifier,
        state: self.state
      });
      return link.role === "product";
    });
    self.linksMarks.classed("replication", function (element, index, nodes) {
      var link = TopologyView.accessLink({
        identifier: element.identifier,
        state: self.state
      });
      return link.replication;
    });
    self.linksMarks.attr("marker-mid", "url(#link-marker)");
    // Determine dimensions for representations of network's elements.
    // Set dimensions of links.
    self.linksMarks.attr("stroke-width", (self.scaleLinkDimension * 1));
  }
  /**
  * Creates and activates nodes.
  * @param {Object} self Instance of a class.
  */
  createActivateNodes(self) {
    // Create nodes.
    // Create groups to contain elements for individual nodes.
    self.createActivateNodesGroups(self);
    // Create marks for individual nodes.
    self.createNodesMarks(self);
  }
  /**
  * Creates and activates nodes's groups.
  * @param {Object} self Instance of a class.
  */
  createActivateNodesGroups(self) {
    // Create nodes.
    // Select parent.
    var selection = d3.select(self.nodesGroup);
    // Define function to access data.
    function access(element, index, nodes) {
      return self.nodesRecords;
    };
    // Create children elements by association to data.
    self.nodesGroups = View.createElementsData({
      parent: selection,
      type: "g",
      accessor: access
    });
    // Assign attributes to elements.
    self
    .nodesGroups
    .attr("id", function (element, index, nodes) {
      return "node-" + element.identifier;
    })
    .classed("node", true)
    .classed("normal", true)
    .classed("metabolite", function (element, index, nodes) {
      return element.type === "metabolite";
    })
    .classed("reaction", function (element, index, nodes) {
      return element.type === "reaction";
    })
    .classed("replication", function (element, index, nodes) {
      var node = TopologyView.accessNode({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
      return node.replication;
    });
    // Activate behavior.
    self.nodesGroups.on("mouseenter", function (element, index, nodes) {
      // Determine pointer coordinates.
      var positionX = d3.mouse(self.view)[0];
      var positionY = d3.mouse(self.view)[1];
      // Select element.
      var node = nodes[index];
      var nodeSelection = d3.select(node);
      // Call action.
      nodeSelection.classed("normal", false);
      nodeSelection.classed("emphasis", true);
      TopologyView.createTip({
        identifier: element.identifier,
        type: element.type,
        positionX: positionX,
        positionY: positionY,
        tip: self.tip,
        documentReference: self.document,
        state: self.state
      });
    });
    self.nodesGroups.on("mousemove", function (element, index, nodes) {
      // Determine pointer coordinates.
      var positionX = d3.mouse(self.view)[0];
      var positionY = d3.mouse(self.view)[1];
      // Call action.
      TopologyView.createTip({
        identifier: element.identifier,
        type: element.type,
        positionX: positionX,
        positionY: positionY,
        tip: self.tip,
        documentReference: self.document,
        state: self.state
      });
    });
    self.nodesGroups.on("mouseleave", function (element, index, nodes) {
      // Select element.
      var node = nodes[index];
      var nodeSelection = d3.select(node);
      // Call action.
      nodeSelection.classed("emphasis", false);
      nodeSelection.classed("normal", true);
      self.tip.clearView(self.tip);
    });
  }
  /**
  * Creates nodes's marks.
  * @param {Object} self Instance of a class.
  */
  createNodesMarks(self) {
    // Define function to access data.
    function access(element, index, nodes) {
      return [element];
    };
    // Create children elements by association to data.
    var dataElements = self
    .nodesGroups.selectAll("ellipse, rect").filter(".mark").data(access);
    dataElements.exit().remove();
    var novelElements = dataElements
    .enter().append(function (element, index, nodes) {
      // Append different types of elements for different types of entities.
      if (element.type === "metabolite") {
        // Node represents a metabolite.
        return self
        .document
        .createElementNS("http://www.w3.org/2000/svg", "ellipse");
      } else if (element.type === "reaction") {
        // Node represents a reaction.
        return self
        .document
        .createElementNS("http://www.w3.org/2000/svg", "rect");
      }
    });
    var nodesMarks = novelElements.merge(dataElements);
    // Assign attributes to elements.
    nodesMarks.classed("mark", true);
    // Determine dimensions for representations of network's elements.
    // Set dimensions of metabolites' nodes.
    self.metaboliteNodeWidth = self.scaleNodeDimension * 1;
    self.metaboliteNodeHeight = self.scaleNodeDimension * 0.5;
    var nodesMarksMetabolites = nodesMarks
    .filter(function (element, index, nodes) {
      return element.type === "metabolite";
    });
    nodesMarksMetabolites.attr("rx", self.metaboliteNodeWidth);
    nodesMarksMetabolites.attr("ry", self.metaboliteNodeHeight);
    // Set dimensions of reactions' nodes.
    self.reactionNodeWidth = self.scaleNodeDimension * 2.5;
    self.reactionNodeHeight = self.scaleNodeDimension * 0.75;
    var nodesMarksReactions = nodesMarks
    .filter(function (element, index, nodes) {
      return element.type === "reaction";
    });
    nodesMarksReactions.attr("width", self.reactionNodeWidth);
    nodesMarksReactions.attr("height", self.reactionNodeHeight);
    // Shift reactions' nodes according to their dimensions.
    nodesMarksReactions.attr("transform", function (element, index, nodes) {
      var x = - (self.reactionNodeWidth / 2);
      var y = - (self.reactionNodeHeight / 2);
      return "translate(" + x + "," + y + ")";
    });
  }
  /**
  * Creates layout for visual representations of network's elements.
  * @param {Object} self Instance of a class.
  */
  createNetworkLayout(self) {
    // Create scales for simulation of forces between network's elements.
    self.createSimulationScales(self);
    // Create scales for efficiency.
    self.createEfficiencyScales(self);
    // Remove nodes' labels.
    // For efficiency, only include node's labels after simulation completes.
    self.removeNodesLabels(self);
    // Initiate force simulation.
    self.initiateForceSimulation(self);
  }
  /**
  * Creates scales for simulations of forces between network's elements.
  * @param {Object} self Instance of a class.
  */
  createSimulationScales(self) {
    // Simulations of forces between network's elements are computationally
    // expensive.
    // The computational cost varies with the counts of network's elements.
    // To maintain efficiency, vary the rigor of these simulations by the counts
    // of network's elements.
    // Define scales' domain on the basis of the count of nodes.
    var domainCounts = [100, 500, 1000, 2500, 5000, 10000];
    // Define scale for alpha decay rate in force simulation.
    // alpha = 1, alphaMinimum = 0.001, alphaDecay = 0.05, iterations = 134.
    // alpha = 1, alphaMinimum = 0.001, alphaDecay = 0.03, iterations = 227.
    // alpha = 1, alphaMinimum = 0.001, alphaDecay = 0.02, iterations = 300.
    // alpha = 1, alphaMinimum = 0.001, alphaDecay = 0.015, iterations = 458.
    // alpha = 1, alphaMinimum = 0.001, alphaDecay = 0.013, iterations = 528.
    // alpha = 1, alphaMinimum = 0.001, alphaDecay = 0.01, iterations = 688.
    // alpha = 1, alphaMinimum = 0.001, alphaDecay = 0.005, iterations = 1379.
    // Domain's unit is count of nodes.
    // Range's unit is arbitrary for decay rates.
    //domain: range
    //0-100: 0.005
    //100-500: 0.006
    //500-1000: 0.007
    //1000-2500: 0.008
    //2500-5000: 0.009
    //5000-10000: 0.01
    //10000-1000000: 0.011
    var alphaDecayScale = d3
    .scaleThreshold()
    .domain(domainCounts)
    .range([0.013, 0.013, 0.014, 0.015, 0.017, 0.02, 0.03]);
    // Define scale for velocity decay rate in force simulation.
    // Domain's unit is count of nodes.
    // Range's unit is arbitrary for decay rates.
    //domain: range
    //0-100: 0.2
    //100-500: 0.2
    //500-1000: 0.25
    //1000-2500: 0.25
    //2500-5000: 0.25
    //5000-10000: 0.3
    //10000-1000000: 0.3
    var velocityDecayScale = d3
    .scaleThreshold()
    .domain(domainCounts)
    .range([0.2, 0.2, 0.25, 0.25, 0.25, 0.3, 0.3]);
    // Compute simulation decay rates from scale.
    self.scaleAlphaDecay = alphaDecayScale(self.nodesRecords.length);
    self.scaleVelocityDecay = velocityDecayScale(self.nodesRecords.length);
  }
  /**
  * Creates scale for efficiency in the application.
  * @param {Object} self Instance of a class.
  */
  createEfficiencyScales(self) {
    // Graphical rendering of visual elements for network's elements is
    // computationally expensive
    // The maintenance of efficient interactivity in the application requires
    // restriction on behavior.
    // Greater scale of the network requires more stringent restriction for
    // computational efficiency.
    // Define scale's domain on the basis of the count of nodes.
    var domainCounts = [100, 500, 1000, 2500, 5000, 10000];
    // Define scale for intervals at which to restore positions of nodes and
    // links during simulation's iterations.
    // Domain's unit is count of nodes.
    // Range's unit is arbitrary.
    //domain: range
    //0-100: 3
    //100-500: 5
    //500-1000: 10
    //1000-2500: 15
    //2500-5000: 25
    //5000-10000: 50
    //10000-1000000: 100
    var intervalScale = d3
    .scaleThreshold()
    .domain(domainCounts)
    .range([3, 5, 10, 15, 25, 50, 100]);
    // Define scale for representation of labels for nodes.
    // Domain's unit is count of nodes.
    // Range's unit is arbitrary.
    //domain: range
    //0-100: true
    //100-500: true
    //500-1000: true
    //1000-2500: true
    //2500-5000: false
    //5000-10000: false
    //10000-1000000: false
    var labelScale = d3
    .scaleThreshold()
    .domain(domainCounts)
    .range([true, true, true, true, false, false, false]);
    // Compute efficient behavior rules from scales.
    self.scaleInterval = intervalScale(self.nodesRecords.length);
    self.scaleLabel = labelScale(self.nodesRecords.length);
  }
  /**
  * Removes nodes' labels from a node-link diagram.
  * @param {Object} self Instance of a class.
  */
  removeNodesLabels(self) {
    // Remove labels for individual nodes.
    self.nodesGroups.selectAll("text").remove();
  }
  /**
  * Initiates a force simulation for placement of network's nodes and links in a
  * node-link diagram.
  * @param {Object} self Instance of a class.
  */
  initiateForceSimulation(self) {
    // Define parameters of the force simulation.
    self.alpha = 1;
    self.alphaMinimum = 0.001;
    // Initiate monitor of simulation's progress.
    self.initiateForceSimulationProgress(self);
    // Initiate the force simulation.
    // The force method assigns a specific force simulation to the name.
    // Collision force prevents overlap and occlusion of nodes.
    // The center force causes nodes to behave strangely when user repositions
    // them manually.
    // The force simulation assigns positions to the nodes, recording
    // coordinates of these positions in novel attributes within nodes' records.
    // These coordinates are accessible in the original data that associates
    // with node elements.
    // Any elements with access to the nodes' data, such as nodes' marks and
    // labels, also have access to the coordinates of these positions.
    self.simulation = d3.forceSimulation()
    .alphaTarget(0)
    .alpha(self.alpha)
    .alphaDecay(self.scaleAlphaDecay)
    .alphaMin(self.alphaMinimum)
    .velocityDecay(self.scaleVelocityDecay)
    .nodes(self.nodesRecords)
    .force("center", d3.forceCenter()
      .x(self.graphWidth / 2)
      .y(self.graphHeight / 2)
    )
    .force("collision", d3.forceCollide()
      .radius(function (element, index, nodes) {
        if (element.type === "metabolite") {
          return self.metaboliteNodeWidth;
        } else if (element.type === "reaction") {
          return self.reactionNodeWidth;
        }
      })
      .strength(0.7)
      .iterations(1)
    )
    .force("charge", d3.forceManyBody()
      .theta(0.3)
      .strength(-500)
      .distanceMin(1)
      .distanceMax(self.scaleNodeDimension * 25)
    )
    .force("link", d3.forceLink()
      .links(self.linksRecords)
      .id(function (element, index, nodes) {
        return element.identifier;
      })
      .distance(function (element, index, nodes) {
        // Determine whether the link represents relation between nodes that
        // have designations for simplification.
        if (element.replication) {
          // Link is for a replicate node.
          return (self.metaboliteNodeWidth * 0.5);
        } else {
          // Link is not for a replicate node.
          return (1.3 * (self.reactionNodeWidth + self.metaboliteNodeWidth));
        }
      })
      //.strength()
      //.iterations()
    )
    .force("positionX", d3.forceX()
      .x(self.graphWidth / 2)
      .strength(0.00007)
    )
    .force("positionY", d3.forceY()
      .y(self.graphWidth / 2)
      .strength(0.03)
    )
    .on("tick", function () {
      // Restore monitor of simulation's progress.
      self.restoreForceSimulationProgress(self);
    })
    .on("end", function () {
      // Complete tasks dependent on simulation's completion.
      self.completeForceSimulation(self);
    });
  }
  /**
  * Initiates a monitor of force simulation's progress.
  * @param {Object} self Instance of a class.
  */
  initiateForceSimulationProgress(self) {
    // Compute an estimate of the simulation's iterations.
    self.estimateIterations = self.computeSimulationIterations(self);
    // Initiate counter for simulation's iterations.
    self.simulationCounter = 0;
  }
  /**
  * Computes an estimate of iterations for a simulation.
  * @param {Object} self Instance of a class.
  */
  computeSimulationIterations(self) {
    return (
      (Math.log10(self.alphaMinimum)) /
      (Math.log10(self.alpha - self.scaleAlphaDecay))
    );
  }
  /**
  * Restores a monitor of force simulation's progress.
  * @param {Object} self Instance of a class.
  */
  restoreForceSimulationProgress(self) {
    // Increment count of simulation's iterations.
    self.simulationCounter += 1;
    // Report simulation's progress.
    var percentage = Math
    .round((self.simulationCounter / self.estimateIterations) * 100);
    if (percentage % 10 === 0) {
      //console.log("simulation: " + percentage + "%");
    }
    // Restore positions of nodes and links periodically throughout the
    // simulation.
    if (self.simulationCounter % self.scaleInterval === 0) {
      self.restoreNodesPositions(self);
      self.restoreLinksPositions(self);
    }
  }
  /**
  * Completes tasks dependent on force simulation.
  * @param {Object} self Instance of a class.
  */
  completeForceSimulation(self) {
    // Restore and refine network's representation.
    self.restoreNodesPositions(self);
    self.restoreLinksPositions(self);
    self.refineNodesLinksRepresentations(self);
    // Report completion of network's representation.
    var message = (
      "network representation complete... " +
      self.simulationCounter + " iterations"
    );
    //console.log(message);
    //window.alert(message);
    // Change the novelty of the network's topology to indicate unnecessity of
    // determination of layout until the network changes.
    Action.changeTopologyNovelty(self.state);
  }
  /**
  * Restores positions of nodes' visual representations according to results of
  * force simulation.
  * @param {Object} self Instance of a class.
  */
  restoreNodesPositions(self) {
    // Set radius.
    var radius = self.reactionNodeWidth;
    // Restore positions of nodes' marks according to results of simulation.
    // Impose constraints on node positions according to dimensions of graphical
    // container.
    self.nodesGroups.attr("transform", function (data) {
      // Constrain nodes' positions according to dimensions of graphical
      // container.
      data.x = Math.max(radius, Math.min(self.graphWidth - radius, data.x));
      data.y = Math.max(radius, Math.min(self.graphHeight - radius, data.y));
      // Determine coordinates for nodes' marks from results of simulation in
      // nodes' records.
      return "translate(" + data.x + "," + data.y + ")";
    });
  }
  /**
  * Refines the representations of nodes and links.
  * @param {Object} self Instance of a class.
  */
  refineNodesLinksRepresentations(self) {
    // Determine orientations of reaction's nodes.
    self.determineReactionsNodesOrientations(self);
    // Represent reactions' directionalities on their nodes.
    self.createReactionsNodesDirectionalMarks(self);
    // Create nodes' labels.
    if (self.scaleLabel) {
      self.createNodesLabels(self);
    }
    // Represent reactions' directionalities in links.
    self.restoreLinksPositions(self);
  }
  /**
  * Determines the orientations of reactions' nodes relative to sides for
  * reactants and products.
  * @param {Object} self Instance of a class.
  */
  determineReactionsNodesOrientations(self) {
    // Separate records of nodes for metabolites and reactions with access to
    // positions from force simulation.
    var metabolitesNodes = self.nodesRecords.filter(function (record) {
      return record.type === "metabolite";
    });
    var reactionsNodes = self.nodesRecords.filter(function (record) {
      return record.type === "reaction";
    });
    // Iterate on records for reactions' nodes with access to positions from
    // force simulation.
    reactionsNodes.forEach(function (reactionNode) {
      // Access information.
      var node = self.state.networkNodesReactions[reactionNode.identifier];
      var candidate = self.state.reactionsCandidates[node.candidate];
      var reaction = self.state.reactions[candidate.reaction];
      // Collect identifiers of metabolites' nodes that surround the reaction's
      // node.
      var neighbors = Network.collectNeighborsNodes({
        focus: reactionNode.identifier,
        links: self.linksRecords
      });
      // Determine the roles in which metabolites participate in the reaction.
      // Reaction's store information about metabolites' participation.
      // Metabolites can participate in multiple reactions.
      var neighborsRoles = TopologyView.sortMetabolitesNodesReactionRoles({
        identifiers: neighbors,
        participants: reaction.participants,
        networkNodesmetabolites: self.state.networkNodesMetabolites,
        metabolitesCandidates: self.state.metabolitesCandidates
      });
      // Collect records for nodes of metabolites that participate in the
      // reaction in each role.
      var reactantsNodes = General.filterArrayRecordsByIdentifier(
        neighborsRoles.reactants, metabolitesNodes
      );
      var productsNodes = General.filterArrayRecordsByIdentifier(
        neighborsRoles.products, metabolitesNodes
      );
      // Determine orientation of reaction's node.
      // Include designations of orientation in record for reaction's node.
      var orientations = TopologyView.determineReactionNodeOrientation({
        reactionNode: reactionNode,
        reactantsNodes: reactantsNodes,
        productsNodes: productsNodes,
        graphHeight: self.graphHeight
      });
      // Include information about orientation in record for reaction's node.
      // Modify current record to preserve references from existing elements.
      reactionNode.left = orientations.left;
      reactionNode.right = orientations.right;
    });
  }
  /**
  * Creates representations of reactions' directions on their nodes.
  * @param {Object} self Instance of a class.
  */
  createReactionsNodesDirectionalMarks(self) {
    // Select groups of reactions' nodes.
    var nodesGroupsReactions = self
    .nodesGroups.filter(function (element, index, nodes) {
      return element.type === "reaction";
    });
    // Create directional marks.
    var leftDirectionalMarks = nodesGroupsReactions
    .append(function (element, index, nodes) {
      // Append different types of elements for different properties.
      var type = TopologyView.determineDirectionalMarkType({
        side: "left",
        reactionNode: element,
        networkNodesReactions: self.state.networkNodesReactions,
        reactionsCandidates: self.state.reactionsCandidates,
        reactions: self.state.reactions
      });
      return self.document.createElementNS("http://www.w3.org/2000/svg", type);
    });
    var rightDirectionalMarks = nodesGroupsReactions
    .append(function (element, index, nodes) {
      // Append different types of elements for different properties.
      var type = TopologyView.determineDirectionalMarkType({
        side: "right",
        reactionNode: element,
        networkNodesReactions: self.state.networkNodesReactions,
        reactionsCandidates: self.state.reactionsCandidates,
        reactions: self.state.reactions
      });
      return self.document.createElementNS("http://www.w3.org/2000/svg", type);
    });
    // Set attributes of directional marks.
    // Determine dimensions for directional marks.
    var width = self.reactionNodeWidth / 7;
    var height = self.reactionNodeHeight;
    leftDirectionalMarks.classed("direction", true);
    rightDirectionalMarks.classed("direction", true);
    leftDirectionalMarks
    .filter("polygon")
    .attr("points", function (element, index, nodes) {
      return General.createIsoscelesTrianglePoints({
        base: height,
        altitude: width,
        orientation: "left"
      });
    });
    rightDirectionalMarks
    .filter("polygon")
    .attr("points", function (element, index, nodes) {
      return General.createIsoscelesTrianglePoints({
        base: height,
        altitude: width,
        orientation: "right"
      });
    });
    leftDirectionalMarks
    .filter("rect")
    .attr("height", height)
    .attr("width", width);
    rightDirectionalMarks
    .filter("rect")
    .attr("height", height)
    .attr("width", width);
    leftDirectionalMarks.attr("transform", function (data) {
      var x = - (self.reactionNodeWidth / 2);
      var y = - (height / 2);
      return "translate(" + x + "," + y + ")";
    });
    rightDirectionalMarks.attr("transform", function (data) {
      var x = ((self.reactionNodeWidth / 2) - width);
      var y = - (height / 2);
      return "translate(" + x + "," + y + ")";
    });
  }
  /**
  * Restores links' positions according to results of force simulation.
  * @param {Object} self Instance of a class.
  */
  restoreLinksPositions(self) {
    // Restore positions of links according to results of simulation.
    // D3's procedure for force simulation copies references to records for
    // source and target nodes within records for links.
    self.linksMarks.attr("points", function (element, index, nodes) {
      // Determine positions of link's termini.
      var link = TopologyView.accessLink({
        identifier: element.identifier,
        state: self.state
      });
      var termini = TopologyView.determineLinkTermini({
        role: link.role,
        source: element.source,
        target: element.target,
        width: self.reactionNodeWidth
      });
      // Create points for vertices at source, center, and target of polyline.
      var points = General.createStraightPolylinePoints({
        source: termini.source,
        target: termini.target
      });
      return points;
    });
  }
  /**
  * Creates labels for nodes in a node-link diagram.
  * @param {Object} self Instance of a class.
  */
  createNodesLabels(self) {
    // Define function to access data.
    function access(element, index, nodes) {
      return [element];
    };
    // Create children elements by association to data.
    var nodesLabels = View.createElementsData({
      parent: self.nodesGroups,
      type: "text",
      accessor: access
    });
    // Assign attributes to elements.
    nodesLabels.classed("label", true);
    nodesLabels.text(function (element, index, nodes) {
      if (element.type === "metabolite") {
        // Access information.
        var node = self.state.networkNodesMetabolites[element.identifier];
        var candidate = self.state.metabolitesCandidates[node.candidate];
        var name = candidate.name;
      } else if (element.type === "reaction") {
        // Access information.
        var node = self.state.networkNodesReactions[element.identifier];
        var candidate = self.state.reactionsCandidates[node.candidate];
        var name = candidate.name;
      }
      return (name.slice(0, 5) + "...");
    });
    // Determine size of font for annotations of network's elements.
    nodesLabels.attr("font-size", self.scaleFont + "px");
  }
  /**
  * Accesses a link.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a candidate entity.
  * @param {Object} parameters.state Application's state.
  * @returns {string} Name of the value of the attribute.
  */
  static accessLink({identifier, state} = {}) {
    return state.networkLinks[identifier];
  }
  /**
  * Accesses a node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of entity, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  * @returns {string} Name of the value of the attribute.
  */
  static accessNode({identifier, type, state} = {}) {
    if (type === "metabolite") {
      return state.networkNodesMetabolites[identifier];
    } else if (type === "reaction") {
      return state.networkNodesReactions[identifier];
    }
  }
  /**
  * Creates tip.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of entity, metabolite or reaction.
  * @param {number} parameters.positionX Pointer's horizontal coordinate.
  * @param {number} parameters.positionY Pointer's vertical coordinate.
  * @param {Object} parameters.tip Instance of TipView's class.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  static createTip({identifier, type, positionX, positionY, tip, documentReference, state} = {}) {
    // Create summary for tip.
    // Determine the type of entity.
    if (type === "metabolite") {
      var summary = TopologyView.createTipSummaryMetabolite({
        identifier: identifier,
        documentReference: documentReference,
        state: state
      });
    } else if (type === "reaction") {
      var summary = TopologyView.createTipSummaryReaction({
        identifier: identifier,
        documentReference: documentReference,
        state: state
      });
    }
    // Create tip.
    tip.restoreView({
      visible: true,
      positionX: positionX,
      positionY: positionY,
      summary: summary,
      self: tip
    });
  }
  /**
  * Creates tip's summary for a metabolite.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  static createTipSummaryMetabolite({identifier, documentReference, state} = {}) {
    // Access information.
    var node = state.networkNodesMetabolites[identifier];
    var candidate = state.metabolitesCandidates[node.candidate];
    var metabolite = state.metabolites[candidate.metabolite];
    var name = metabolite.name;
    var formula = metabolite.formula;
    var charge = metabolite.charge;
    var compartment = state.compartments[candidate.compartment];
    // Compile information.
    var information = [
      {title: "name:", value: name},
      {title: "formula:", value: formula},
      {title: "charge:", value: charge},
      {title: "compartment:", value: compartment}
    ];
    // Create table.
    // Select parent.
    var table = d3.select("body").append("table");
    // Define function to access data.
    function accessOne() {
      return information;
    };
    // Create children elements by association to data.
    var rows = View.createElementsData({
      parent: table,
      type: "tr",
      accessor: accessOne
    });
    // Define function to access data.
    function accessTwo(element, index, nodes) {
      // Organize data.
      return [].concat(element.title, element.value);
    };
    // Create children elements by association to data.
    var cells = View.createElementsData({
      parent: rows,
      type: "td",
      accessor: accessTwo
    });
    // Assign attributes to elements.
    cells.text(function (element, index, nodes) {
      return element;
    });
    // Return reference to element.
    return table.node();
  }
  /**
  * Creates tip's summary for a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  static createTipSummaryReaction({identifier, documentReference, state} = {}) {
    // Access information.
    var node = state.networkNodesReactions[identifier];
    var candidate = state.reactionsCandidates[node.candidate];
    var reaction = state.reactions[candidate.reaction];
    var replicates = [].concat(reaction.identifier, candidate.replicates);
    // Collect consensus properties of replicates.
    var properties = Evaluation.collectReplicateReactionsConsensusProperties({
      identifiers: replicates,
      reactions: state.reactions,
      metabolites: state.metabolites,
      reactionsSets: state.filterReactionsSets,
      compartments: state.compartments,
      processes: state.processes
    });
    // Compile information.
    var information = [
      {title: "name:", value: properties.name},
      {title: "reactants:", value: properties.reactants.join(", ")},
      {title: "products:", value: properties.products.join(", ")},
      {title: "reversibility:", value: properties.reversibility},
      {title: "conversion:", value: properties.conversion},
      {title: "dispersal:", value: properties.dispersal},
      {title: "transport:", value: properties.transport},
      {title: "compartments:", value: properties.compartments.join(", ")},
      {title: "processes:", value: properties.processes.join(", ")},
      {title: "genes:", value: properties.genes.join(", ")},
    ];
    // Create table.
    // Select parent.
    var table = d3.select("body").append("table");
    // Define function to access data.
    function accessOne() {
      return information;
    };
    // Create children elements by association to data.
    var rows = View.createElementsData({
      parent: table,
      type: "tr",
      accessor: accessOne
    });
    // Define function to access data.
    function accessTwo(element, index, nodes) {
      // Organize data.
      return [].concat(element.title, element.value);
    };
    // Create children elements by association to data.
    var cells = View.createElementsData({
      parent: rows,
      type: "td",
      accessor: accessTwo
    });
    // Assign attributes to elements.
    cells.text(function (element, index, nodes) {
      return element;
    });
    // Return reference to element.
    return table.node();
  }
  /**
  * Sorts identifiers of nodes for metabolites by their roles in a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.identifiers Identifiers of nodes for
  * metabolites.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' and compartments' participation in a reaction.
  * @param {Object} parameters.networkNodesMetabolites Information about
  * network's nodes for metabolites.
  * @param {Object<Object>} parameters.metabolitesCandidates Information about
  * candidate metabolites.
  * @returns {Object<Array<string>>} Identifiers of nodes for metabolites that
  * participate in a reaction either as reactants or products.
  */
  static sortMetabolitesNodesReactionRoles({identifiers, participants, networkNodesMetabolites, metabolitesCandidates} = {}) {
    // Initialize a collection of metabolites' nodes by roles in a reaction.
    var initialCollection = {
      reactants: [],
      products: []
    };
    // Iterate on identifiers for metabolites' nodes.
    return identifiers.reduce(function (collection, identifier) {
      // Access information.
      var node = networkNodesMetabolites[identifier];
      var candidate = metabolitesCandidates[node.candidate];
      // Determine details of node's relation to the reaction.
      if (candidate.compartment) {
        // Node represents compartmentalization.
        var matches = Extraction.filterReactionParticipants({
          criteria: {
            metabolites: [candidate.metabolite],
            compartments: [candidate.compartment]
          },
          participants: participants
        });
      } else {
        // Node does not represent compartmentalization.
        var matches = Extraction.filterReactionParticipants({
          criteria: {metabolites: [candidate.metabolite]},
          participants: participants
        });
      }
      var roles = General.collectValueFromObjects("role", matches);
      // Include identifier of metabolite's node in the collection according to
      // its role in the reaction.
      if (
        roles.includes("reactant") && !collection.reactants.includes(identifier)
      ) {
        var reactants = [].concat(collection.reactants, identifier);
      } else {
        var reactants = collection.reactants;
      }
      if (
        roles.includes("product") && !collection.products.includes(identifier)
      ) {
        var products = [].concat(collection.products, identifier);
      } else {
        var products = collection.products;
      }
      var currentCollection = {
        reactants: reactants,
        products: products
      };
      return currentCollection;
    }, initialCollection);
  }
  /**
  * Determines the orientation of a reaction's node relative to sides for
  * reactants and products.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.reactionNode Record for node for a reaction.
  * @param {Array<Object>} parameters.reactantsNodes Records of nodes
  * for metabolites that participate as reactants in a reaction.
  * @param {Array<Object>} parameters.productsNodes Records of nodes
  * for metabolites that participate as products in a reaction.
  * @param {number} parameters.graphHeight Vertical dimension of graphical
  * container.
  * @returns {Object<string>} Record with indicators of sides of reaction's node
  * for reactants and products.
  */
  static determineReactionNodeOrientation({reactionNode, reactantsNodes, productsNodes, graphHeight} = {}) {
    // Extract coordinates for position of reaction's node.
    var reactionCoordinates = General.extractNodeCoordinates(reactionNode);
    // Extract coordinates of positions of nodes for metabolites that
    // participate in reaction as reactants and products.
    var reactantsCoordinates = General.extractNodesCoordinates(reactantsNodes);
    var productsCoordinates = General.extractNodesCoordinates(productsNodes);
    // Convert coordinates of nodes for metabolites that participate in reaction
    // as reactants and products.
    var reactantsRadialCoordinates = General.convertNormalizeRadialCoordinates({
      pointsCoordinates: reactantsCoordinates,
      originCoordinates: reactionCoordinates,
      graphHeight: graphHeight
    });
    var productsRadialCoordinates = General.convertNormalizeRadialCoordinates({
      pointsCoordinates: productsCoordinates,
      originCoordinates: reactionCoordinates,
      graphHeight: graphHeight
    });
    // Determine mean of horizontal coordinates for reactants and products.
    var reactantsXCoordinates = General
    .collectValueFromObjects("x", reactantsRadialCoordinates);
    var reactantsMeanX = General.computeElementsMean(reactantsXCoordinates);
    var productsXCoordinates = General
    .collectValueFromObjects("x", productsRadialCoordinates);
    var productsMeanX = General.computeElementsMean(productsXCoordinates);
    // Determine orientation of reaction's node.
    if (reactantsMeanX < productsMeanX) {
      // Reactants dominate left side of reaction's node.
      var orientation = {
        left: "reactant",
        right: "product"
      };
    } else if (productsMeanX < reactantsMeanX) {
      // Products dominate left side of reaction's node.
      var orientation = {
        left: "product",
        right: "reactant"
      };
    } else {
      // Neither reactants nor products dominate.
      // Prioritize orientation with reactants on left and products on right.
      var orientation = {
        left: "reactant",
        right: "product"
      };
    }
    // Return orientation of reaction's node.
    return orientation;
  }
  /**
  * Determines the type of graphical element to represent the direction of a
  * reaction's node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.side Side of reaction's node, left or right.
  * @param {Object} parameters.reactionNode Record of a reaction's node.
  * @param {Object} parameters.networkNodesReactions Information about network's
  * nodes for reactions.
  * @param {Object<Object>} parameters.reactionsCandidates Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {string} Type of graphical element to represet direction of a
  * reaction's node.
  */
  static determineDirectionalMarkType({side, reactionNode, networkNodesReactions, reactionsCandidates, reactions} = {}) {
    // Access information.
    var node = networkNodesReactions[reactionNode.identifier];
    var candidate = reactionsCandidates[node.candidate];
    var reaction = reactions[candidate.reaction];
    var direction = TopologyView.determineReactionDirection({
      left: reactionNode.left,
      right: reactionNode.right,
      reversibility: reaction.reversibility
    });
    if (direction === "both") {
      // Side of reaction's node needs directional marker.
      var type = "polygon";
    } else if (side === direction) {
      // Side of reaction's node needs directional marker.
      var type = "polygon";
    } else if (side !== direction) {
      // Side of reaction's node does not need directional marker.
      var type = "rect";
    }
    return type;
  }
  /**
  * Determines the direction of a reaction's node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.left Role in reaction to represent on left side
  * of reaction's node.
  * @param {string} parameters.right Role in reaction to represent on right side
  * of reaction's node.
  * @param {boolean} parameters.reversibility Whether reaction is reversible.
  * @returns {string} Indicator of direction of a reaction's node, left, right,
  * or both.
  */
  static determineReactionDirection({left, right, reversibility} = {}) {
    // Determine whether reaction is reversible.
    if (reversibility) {
      // Reaction is reversible.
      return "both";
    } else {
      // Reaction is irreversible.
      // Determine reaction's direction.
      if (left === "reactant" && right === "product") {
        // Reaction's direction is to the right.
        return "right";
      } else if (left === "product" && right === "reactant") {
        // Reaction's direction is to the left.
        return "left";
      }
    }
  }
  /**
  * Determines the coordinates of termini for a link.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.role Role in a reaction, reactant or product,
  * that link represents.
  * @param {Object} parameters.source Record of node that is link's source.
  * @param {Object} parameters.target Record of node that is link's target.
  * @param {number} parameters.width Width of reactions' nodes.
  * @returns {Object<Object<number>>} Records with coordinates of link's
  * termini.
  */
  static determineLinkTermini({role, source, target, width} = {}) {
    // Determine shift proportionate to width of reactions' nodes.
    var shift = width / 2;
    // Determine horizontal shifts for link's termini.
    var sourceShift = TopologyView.determineLinkTerminusHorizontalShift({
      role: role,
      terminus: source,
      shift: shift
    });
    var targetShift = TopologyView.determineLinkTerminusHorizontalShift({
      role: role,
      terminus: target,
      shift: shift
    });
    // Compile coordinates of termini.
    var shiftSource = {
      x: source.x + sourceShift,
      y: source.y
    };
    var shiftTarget = {
      x: target.x + targetShift,
      y: target.y
    };
    return {
      source: shiftSource,
      target: shiftTarget
    };
  }
  /**
  * Determines the horizontal shift of a link's terminus.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.role Role in a reaction, reactant or product,
  * that link represents.
  * @param {Object} parameters.terminus Record of node that is link's terminus.
  * @param {number} parameters.shift Horizontal shift to accommodate width of
  * reactions' nodes.
  * @returns {number} Horizontal shift for link's terminus.
  */
  static determineLinkTerminusHorizontalShift({role, terminus, shift} = {}) {
    // Determine whether link's terminus connects to a reaction's node.
    if (terminus.type === "reaction") {
      // Link's terminus connects to a reaction's node.
      // Determine whether reaction's node has an orientation.
      if (terminus.left && terminus.right) {
        // Reaction's node has an orientation.
        // Determine which side matches the link's role.
        if (terminus.left === role) {
          // Link's role matches left side of reaction's node.
          //return terminus.x - shift;
          return -shift;
        } else if (terminus.right === role) {
          // Link's role matches right side of reaction's node.
          //return terminus.x + shift;
          return shift;
        }
      } else {
        // Reaction's node does not have an orientation.
        //return terminus.x
        return 0;
      }
    } else {
      // Link's terminus does not connect to a reaction's node.
      //return terminus.x
      return 0;
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
