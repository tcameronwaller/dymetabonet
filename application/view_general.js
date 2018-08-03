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
  * @param {Array<string>} parameters.classNames Class names for elements.
  * @param {string} parameters.type Type of container, "standard" or "graph".
  * @param {Object} parameters.target Reference to element for relative
  * position of insertion.
  * @param {string} parameters.position Position of insertion relative to
  * target, either "beforebegin", "afterbegin", "beforeend", or "afterend".
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createReferenceContainer({identifier, classNames, type, target, position, documentReference} = {}) {
    // Determine whether container's element exists in the document.
    if (!documentReference.getElementById(identifier)) {
      // Element does not exist in the document.
      // Create element.
      var container = View.createInsertContainer({
        classNames: classNames,
        type: type,
        target: target,
        position: position,
        documentReference: documentReference
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
  * Creates a container and inserts it at a specific position in the document.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.classNames Class names for elements.
  * @param {string} parameters.type Type of container, "standard" or "graph".
  * @param {Object} parameters.target Reference to element for relative
  * position of insertion.
  * @param {string} parameters.position Position of insertion relative to
  * target, either "beforebegin", "afterbegin", "beforeend", or "afterend".
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createInsertContainer({classNames, type, target, position, documentReference} = {}) {
    if (type === "standard") {
      var container = documentReference.createElement("div");
    } else if (type === "graph") {
      var container = documentReference
      .createElementNS("http://www.w3.org/2000/svg", "g");
    }
    View.insertElement({
      element: container,
      target: target,
      position: position
    });
    // Include class names.
    container.classList.add(...classNames);
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
  * Creates a button with a label and an identifier.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier for element.
  * @param {string} parameters.text Text for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createButtonIdentifier({identifier, text, parent, documentReference} = {}) {
    var button = View.createButton({
      text: text,
      parent: parent,
      documentReference: documentReference
    });
    button.setAttribute("id", identifier);
    // Return reference to element.
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
  * Creates and appends division with text.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.text Text for element.
  * @param {string} parameters.className Class for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createAppendDivisionText({text, className, parent, documentReference} = {}) {
    // Create element.
    var division = View.createDivisionText({
      text: text,
      documentReference: documentReference
    });
    parent.appendChild(division);
    division.classList.add(className);
    // Return reference to element.
    return division;
  }
  /**
  * Creates division with text.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.text Text for element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createDivisionText({text, documentReference} = {}) {
    // Create element.
    var division = documentReference.createElement("div");
    division.textContent = text;
    // Return reference to element.
    return division;
  }


  // TODO: new method to create a title DIV...
  // TODO: it needs a className.


  /**
  * Creates a table and a head.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createTableHead({parent, documentReference} = {}) {
    // Create elements.
    var table = documentReference.createElement("table");
    parent.appendChild(table);
    var head = documentReference.createElement("thead");
    table.appendChild(head);
    // Return reference to element.
    return head;
  }
  /**
  * Creates a row within a table.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createTableRow({parent, documentReference} = {}) {
    // Create elements.
    var row = documentReference.createElement("tr");
    parent.appendChild(row);
    // Return reference to element.
    return row;
  }
  /**
  * Creates a cell within a row of a table's head.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {string} parameters.className Class for element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createTableHeadCell({parent, className, documentReference} = {}) {
    // Create elements.
    var cell = documentReference.createElement("th");
    parent.appendChild(cell);
    cell.classList.add(className);
    // Return reference to element.
    return cell;
  }
  /**
  * Creates a cell within a row of a table's body.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {string} parameters.className Class for element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createTableBodyCell({parent, className, documentReference} = {}) {
    // Create elements.
    var cell = documentReference.createElement("td");
    parent.appendChild(cell);
    cell.classList.add(className);
    // Return reference to element.
    return cell;
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
    var cell = View.createTableHeadCell({
      parent: parent,
      className: className,
      documentReference: documentReference
    });
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
    var body = View.createTableBody({
      className: className,
      parent: container,
      documentReference: self.document
    });
    // Return reference to element.
    return body;
  }
  /**
  * Creates a table, and body.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.className Class for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createTableBody({className, parent, documentReference} = {}) {
    // Create elements.
    var table = documentReference.createElement("table");
    parent.appendChild(table);
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

  // TODO: I think representScale is becoming obsolete...

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
  * @param {number} parameters.graphHeight Height of graph.
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
  /**
  * Creates a selector menu.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createSelector({identifier, parent, documentReference} = {}) {
    // Create container.
    var container = documentReference.createElement("span");
    parent.appendChild(container);
    // Create selector.
    var selector = documentReference.createElement("select");
    container.appendChild(selector);
    selector.setAttribute("id", identifier);
    // Return reference to element.
    return selector;
  }
  /**
  * Creates options within a selector menu.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.options Information about options.
  * @param {Object} parameters.selector Reference to selector menu.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  static createSelectorOptions({options, selector, documentReference} = {}) {
    // Create options.
    // Select parent.
    var selectorSelection = d3.select(selector);
    // Define function to access data.
    function access() {
      return options;
    };
    // Create children elements by association to data.
    var optionsSelection = View.createElementsData({
      parent: selectorSelection,
      type: "option",
      accessor: access
    });
    // Assign attributes to elements.
    optionsSelection
    .attr("value", function (element, index, nodes) {
      return element.value;
    })
    .text(function (element, index, nodes) {
      return element.label;
    })
    .property("selected", function (element, index, nodes) {
      return element.selection;
    });
  }
  /**
  * Determines the horizontal and vertical positions for the proximal corner of
  * a transient view with absolute position.
  * Positions for transient views are relative to the browser's view window.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.horizontalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.verticalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.horizontalShift Horizontal shift in pixels
  * relative to reference point.
  * @param {number} parameters.verticalShift Horizontal shift in pixels relative
  * to reference point.
  * @param {number} parameters.viewWidth Width in pixels of browser's view
  * window.
  * @param {number} parameters.viewHeight Width in pixels of browser's view
  * window.
  * @returns {Object<number>} Horizontal and vertical positions in pixels
  * relative to the browser's view window of proximal corner of transient view.
  */
  static determineTransientViewPositions({horizontalPosition, verticalPosition, horizontalShift, verticalShift, viewWidth, viewHeight} = {}) {
    // Browser's window is also the viewport.
    // Positions of reference point are relative to origin in the top left
    // corner of the browser's window.
    // Use Element.getBoundingClientRect to determine positions of an element
    // within browser's window.
    // Use MouseEvent.clientX and MouseEvent.clientY to determine positions of
    // a cursor event within browser's window.
    // Use window.innerWidth and window.innerHeight to determine dimensions of
    // browser's window.
    // Elements with absolute position have positions relative to top, bottom,
    // left, and right sides of their parental element.
    // Elements with fixed position have positions relative to top, bottom,
    // left, and right sides of the browser's window.
    // Determine positions of proximal corner of transient view.
    if (verticalPosition < (viewHeight / 2)) {
      // Reference point is on top side of view.
      // Place transient view on bottom of reference point.
      var top = ((verticalPosition + verticalShift) + "px");
      var bottom = "auto";
    } else {
      // Reference point is on bottom side of view.
      // Place transient view on top of reference point.
      var top = "auto";
      var bottom = ((viewHeight - (verticalPosition - verticalShift)) + "px");
    }
    if (horizontalPosition < (viewWidth / 2)) {
      // Reference point is on left side of view.
      // Place transient view on right of reference point.
      var left = ((horizontalPosition + horizontalShift) + "px");
      var right = "auto";
    } else {
      // Reference point is on right side of view.
      // Place transient view on left of reference point.
      var left = "auto";
      var right = ((viewWidth - (horizontalPosition - horizontalShift)) + "px");
    }
    // Compile and return information.
    return {
      top: top,
      bottom: bottom,
      left: left,
      right: right
    };
  }
  /**
  * Removes a container's content, removes all previous class names, and assigns
  * a novel class name.
  * If the content of a container can vary, then it is useful to indicate the
  * current type of its content in its class name.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.container Reference to container element.
  * @param {string} parameters.className Class for element.
  */
  static removeContainerContentSetClass({container, className} = {}) {
    // Remove container's content.
    General.removeDocumentChildren(container);
    // Change container's class.
    Array.from(container.classList).forEach(function (name) {
      container.classList.remove(name);
    });
    //container.classList = "";
    container.classList.add(className);
  }
  /**
  * Removes an element from the document if it exists.
  * @param {string} identifier Identifier for element.
  * @param {Object} documentReference Reference to document object model.
  */
  static removeExistElement(identifier, documentReference) {
    var element = documentReference.getElementById(identifier);
    if (element) {
      View.removeElement(element);
    }
  }
  /**
  * Removes elements from the document.
  * @param {Array<Object>} elements References to elements.
  */
  static removeElements(elements) {
    Array.from(elements).forEach(function (element) {
      View.removeElement(element);
    });
  }
  /**
  * Removes an element from the document.
  * @param {Object} element Reference to element.
  */
  static removeElement(element) {
    element.parentElement.removeChild(element);
  }
  /**
  * Determines an element's dimensions and position relative to browser's
  * window.
  * @param {Object} element Reference to element.
  * @returns {Object<number>} Element's dimensions and position.
  */
  static determineElementPositionDimensions(element) {
    // Determine information about element's dimensions and position relative to
    // browser's window.
    // Alternative is to use window.getComputedStyle().
    var information = element.getBoundingClientRect();
    var width = information.width;
    var height = information.height;
    var horizontalPosition = (information.left + (width / 2));
    var verticalPosition = (information.top + (height / 2));
    // Compile and return information.
    return {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      width: width,
      height: height
    };
  }
  /**
  * Creates file selector with a facade.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.suffix Suffix for file type.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createFileLoadFacade({suffix, parent, documentReference} = {}) {
    var fileSelector = documentReference.createElement("input");
    parent.appendChild(fileSelector);
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("accept", suffix);
    fileSelector.classList.add("hide");
    // Load button is a facade for the file selector.
    var load = View.createButton({
      text: "load",
      parent: parent,
      documentReference: documentReference
    });
    load.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      fileSelector.click();
    });
    // Return reference to element.
    return fileSelector;
  }

  // Tab.
  // TODO: include more class hierarchy for the tabs.

  /**
  * Creates a tab.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.type Type of tab, control, network, or
  * subnetwork.
  * @param {string} parameters.category Category of tab.
  * @param {Array<string>} parameters.classNames Class names for elements.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  static createActivateTab({type, category, classNames, parent, documentReference, state} = {}) {
    // Create container.
    var identifier = View.createTabIdentifier(category);
    var tab = self.document.createElement("div");
    parent.appendChild(tab);
    var label = View.createAppendSpanText({
      text: category,
      parent: tab,
      documentReference: documentReference
    });
    // Assign attributes.
    tab.setAttribute("id", identifier);
    tab.setAttribute("name", category);
    tab.classList.add(type);
    tab.classList.add("normal");
    // Include class names.
    tab.classList.add(...classNames);
    // Activate behavior.
    tab.addEventListener("mouseenter", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      event.currentTarget.classList.remove("normal");
      event.currentTarget.classList.add("emphasis");
    });
    tab.addEventListener("mouseleave", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      event.currentTarget.classList.remove("emphasis");
      event.currentTarget.classList.add("normal");
    });
    tab.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine tab's type.
      if (event.currentTarget.classList.contains("control")) {
        var type = "control";
      } else if (event.currentTarget.classList.contains("network")) {
        var type = "network";
      } else if (event.currentTarget.classList.contains("subnetwork")) {
        var type = "subnetwork";
      }
      // Determine tab's category.
      var category = event.currentTarget.getAttribute("name");
      // Call action.
      if (type === "control") {
        ActionControl.changeView({
          category: category,
          state: state
        });
      } else if (type === "network") {
        ActionNetwork.changeView({
          category: category,
          state: state
        });
      } else if (type === "subnetwork") {
        ActionSubnetwork.changeView({
          category: category,
          state: state
        });
      }
    });
    // Return reference to element.
    return tab;
  }
  /**
  * Creates identifier for a tab.
  * @param {string} category Category for a tab.
  * @returns {string} Identifier for a tab.
  */
  static createTabIdentifier(category) {
    return ("tab-" + category);
  }
  /**
  * Creates reference for a tab.
  * @param {string} category Category for a tab.
  * @returns {string} Reference for a tab.
  */
  static createTabReference(category) {
    return (category + "Tab");
  }

  // Menu.

  /**
  * Creates and activates a table column's head.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.attribute Name of attribute.
  * @param {string} parameters.text Text for column head's label.
  * @param {string} parameters.type Type of summaries.
  * @param {string} parameters.category Name of category.
  * @param {boolean} parameters.sort Whether column's attribute is a sort
  * criterion.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} References to elements.
  */
  static createActivateTableColumnTitle({attribute, text, type, category, sort, parent, documentReference, state} = {}) {
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
        ActionGeneral.changeSorts({
          type: type,
          category: category,
          criterion: attribute,
          state: state
        });
      });
      // Compile references to elements.
      var references = {
        sortGraph: sortGraph
      };
    } else {
      // Compile references to elements.
      var references = {};
    }
    // Return references to elements.
    return references;
  }
  /**
  * Creates a table column's scale.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.attribute Name of attribute.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} References to elements.
  */
  static createTableColumnScale({attribute, parent, documentReference} = {}) {
    // Create cell.
    var cell = View.createTableHeadCell({
      parent: parent,
      className: attribute,
      documentReference: documentReference
    });
    // Create graphical container.
    var graph = View.createGraph({
      parent: cell,
      documentReference: documentReference
    });
    graph.classList.add("scale");
    // Determine graph's dimensions.
    var graphWidth = General.determineElementDimension(graph, "width");
    var graphHeight = General.determineElementDimension(graph, "height");
    // Create chart's representation of scale.
    var groupScale = View.createScaleChart({
      graph: graph,
      documentReference: self.document
    });
    // Compile references.
    var references = {
      cell: cell,
      scaleGraph: graph,
      graphWidth: graphWidth,
      graphHeight: graphHeight
    };
    // Return references.
    return references;
  }
  /**
  * Restores a chart for nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.nodes Count of nodes.
  * @param {number} parameters.nodesMetabolites Count of nodes for metabolites.
  * @param {number} parameters.nodesReactions Count of nodes for reactions.
  * @param {boolean} parameters.selection Whether there is a selection of a
  * subnetwork.
  * @param {number} parameters.nodesMetabolitesSelection Count of nodes for
  * metabolites in selection.
  * @param {number} parameters.nodesReactionsSelection Count of nodes for
  * reactions in selection.
  * @param {number} parameters.pad Dimension for pad space.
  * @param {Object} parameters.graph Reference to graphical container.
  */
  static restoreTableColumnScale({count, pad, graph} = {}) {
    // Determine graph's dimensions.
    var graphWidth = General.determineElementDimension(graph, "width");
    var graphHeight = General.determineElementDimension(graph, "height");
    // Restore chart's representation of scale.
    View.restoreScaleChart({
      minimum: 0,
      maximum: count,
      graphWidth: graphWidth,
      graphHeight: graphHeight,
      pad: pad,
      graph: graph
    });
  }
  /**
  * Creates and activates a table column's search.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.type Type of summaries.
  * @param {string} parameters.category Name of category.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {string} parameters.className Class for element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Reference to element.
  */
  static createTableColumnSearch({type, category, parent, className, documentReference, state} = {}) {
    // Create cell.
    var cell = View.createTableHeadCell({
      parent: parent,
      className: className,
      documentReference: documentReference
    });
    // Create search.
    var search = View.createActivateSearch({
      type: type,
      category: category,
      parent: cell,
      documentReference: documentReference,
      state: state
    });
    // Compile references.
    var references = {
      cell: cell,
      search: search
    };
    // Return references.
    return references;
  }

  // Search.

  /**
  * Creates a search tool with label.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.text Text for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createSearch({text, parent, documentReference} = {}) {
    // Create tool for search.
    var search = documentReference.createElement("input");
    parent.appendChild(search);
    search.setAttribute("type", "text");
    search.classList.add("search");
    search.setAttribute("placeholder", text);
    // Return reference to element.
    return search;
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
    var search = View.createSearch({
      text: ("search " + category + "..."),
      parent: parent,
      documentReference: documentReference
    });
    // Activate behavior.
    search.addEventListener("input", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine the search's value.
      var value = event.currentTarget.value;
      // Call action.
      ActionGeneral.changeSearches({
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
  * Creates a search menu with a list for options for automatic completion.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier for element.
  * @param {string} parameters.prompt Prompt to display within element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createSearchOptionsList({identifier, prompt, parent, documentReference} = {}) {
    // Create container.
    var container = documentReference.createElement("span");
    parent.appendChild(container);
    // Create list of options.
    var listIdentifier = identifier + "-options-list";
    var list = documentReference.createElement("datalist");
    container.appendChild(list);
    list.setAttribute("id", listIdentifier);
    // Create search tool.
    var search = documentReference.createElement("input");
    container.appendChild(search);
    search.setAttribute("id", identifier);
    search.setAttribute("type", "search");
    search.setAttribute("list", listIdentifier);
    search.setAttribute("placeholder", prompt);
    search.setAttribute("autocomplete", "off");
    // Return reference to element.
    return search;
  }
  /**
  * Creates options for a search menu.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.list Reference to list of options.
  * @param {Array<Object>} parameters.records Information about options.
  */
  static createSearchOptions({list, records} = {}) {
    // Create options for search.
    // Select parent.
    var parent = d3.select(list);
    // Define function to access data.
    function access() {
      return records;
    };
    // Create children elements by association to data.
    var options = View.createElementsData({
      parent: parent,
      type: "option",
      accessor: access
    });
    // Assign attributes to elements.
    options
    .attr("value", function (element, index, nodes) {
      return element.name;
    })
    .attr("label", function (element, index, nodes) {
      return element.name;
    })
    .attr("name", function (element, index, nodes) {
      return element.identifier;
    });
  }
  /**
  * Determines the name of an option that matches a search's value.
  * @param {Object} search Reference to search menu element.
  * @returns {string} Name of matching option.
  */
  static determineSearchOptionName(search) {
    // Options from datalist elements do not report events.
    // Rather, search input elements report events.
    // Respond to event on input search element and access relevant information
    // that associates with the element.
    // Determine the search's value.
    var name = search.value;
    // Determine the search's list.
    var list = search.list;
    // Determine the search's options.
    var options = list.getElementsByTagName("option");
    var names = General.extractValuesDocumentElements(options);
    // Determine whether the search value matches a valid option.
    if (names.includes(name)) {
      // The search's value matches a valid option.
      // Select matching option.
      var option = Array.from(options).find(function (element) {
        return element.value === name;
      });
      // Determine option's value.
      var value = option.getAttribute("name");
    } else {
      var value = "";
    }
    return value;
  }

  // Scale chart.

  /**
  * Creates a scale chart.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.graph Reference to graphical container.
  * @param {Object} parameters.documentReference Reference to document object
  * @returns {Object} Reference to element.
  */
  static createScaleChart({graph, documentReference} = {}) {
    // Create group.
    var group = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "g");
    graph.appendChild(group);
    group.classList.add("scale");
    // Create text labels for minimum and maximum.
    var labelMinimum = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "text");
    group.appendChild(labelMinimum);
    labelMinimum.classList.add("minimum");
    var labelMaximum = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "text");
    group.appendChild(labelMaximum);
    labelMaximum.classList.add("maximum");
    // Create line.
    var groupLine = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "g");
    group.appendChild(groupLine);
    var line = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "polyline");
    groupLine.appendChild(line);
    // Return reference to element.
    return group;
  }
  /**
  * Restores a scale chart.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.minimum Minimal value of scale.
  * @param {number} parameters.maximum Maximal value of scale.
  * @param {number} parameters.graphWidth Width of graph.
  * @param {number} parameters.graphHeight Height of graph.
  * @param {number} parameters.pad Dimension for pad space.
  * @param {Object} parameters.graph Reference to graphical container.
  */
  static restoreScaleChart({minimum, maximum, graphWidth, graphHeight, pad, graph} = {}) {
    // Select group.
    var group = graph.querySelector("g.scale");
    // Select labels.
    var labelMinimum = group.querySelector("text.minimum");
    var labelMaximum = group.querySelector("text.maximum");
    // Select line.
    var groupLine = group.querySelector("g");
    var line = group.querySelector("polyline");
    // Restore text content of labels.
    labelMinimum.textContent = String(minimum);
    labelMaximum.textContent = String(maximum);
    // Determine dimensions.
    var width = (graphWidth - (pad * 2));
    var height = (graphHeight - (pad * 2));
    // Restore positions of labels.
    var labelHeight = labelMinimum.getBoundingClientRect().height;
    var labelDimension = (labelHeight / 2);
    labelMinimum.setAttribute("x", 0);
    labelMinimum.setAttribute("y", labelDimension);
    labelMaximum.setAttribute("x", width);
    labelMaximum.setAttribute("y", labelDimension);
    // Restore positions of line.
    line.setAttribute("points", "0,3 0,0 " + width + ",0 " + width + ",3");
    groupLine.setAttribute(
      "transform", "translate(" + 0 + "," + (labelDimension + (pad / 2)) + ")"
    );
    // Restore positions of chart.
    group.setAttribute("transform", "translate(" + pad + "," + pad + ")");
  }

  // Network summary.

  /**
  * Creates a chart to summarize nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.selection Whether there is a selection of a
  * subnetwork.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * @returns {Object} Reference to element.
  */
  static createNodeChart({selection, parent, documentReference} = {}) {
    // Create graphical container.
    var graph = View.createGraph({
      parent: parent,
      documentReference: self.document
    });
    graph.classList.add("node");
    // Create chart's representation of scale.
    var groupScale = View.createScaleChart({
      graph: graph,
      documentReference: self.document
    });
    // Create chart's representation of count.
    var groupCount = View.createNodeCountChart({
      selection: selection,
      graph: graph,
      documentReference: self.document
    });
    // Return reference to element.
    return graph;
  }
  /**
  * Creates a chart to summarize nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.selection Whether there is a selection of a
  * subnetwork.
  * @param {Object} parameters.graph Reference to graphical container.
  * @param {Object} parameters.documentReference Reference to document object
  * @returns {Object} Reference to element.
  */
  static createNodeCountChart({selection, graph, documentReference} = {}) {
    // Create group.
    var group = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "g");
    graph.appendChild(group);
    group.classList.add("chart");
    // Create bars for visual representations of nodes.
    var barMetabolite = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "rect");
    group.appendChild(barMetabolite);
    barMetabolite.classList.add("whole");
    barMetabolite.classList.add("metabolite");
    var barReaction = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "rect");
    group.appendChild(barReaction);
    barReaction.classList.add("whole");
    barReaction.classList.add("reaction");
    if (selection) {
      var barMetaboliteSelection = documentReference
      .createElementNS("http://www.w3.org/2000/svg", "rect");
      group.appendChild(barMetaboliteSelection);
      barMetaboliteSelection.classList.add("selection");
      barMetaboliteSelection.classList.add("metabolite");
      var barReactionSelection = documentReference
      .createElementNS("http://www.w3.org/2000/svg", "rect");
      group.appendChild(barReactionSelection);
      barReactionSelection.classList.add("selection");
      barReactionSelection.classList.add("reaction");
    }
    // Create labels.
    var labelMetabolite = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "text");
    group.appendChild(labelMetabolite);
    labelMetabolite.classList.add("metabolite");
    labelMetabolite.textContent = ("metabolites");
    var labelReaction = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "text");
    group.appendChild(labelReaction);
    labelReaction.classList.add("reaction");
    labelReaction.textContent = ("reactions");
    // Return reference to element.
    return group;
  }
  /**
  * Restores a chart for nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.nodes Count of nodes.
  * @param {number} parameters.nodesMetabolites Count of nodes for metabolites.
  * @param {number} parameters.nodesReactions Count of nodes for reactions.
  * @param {boolean} parameters.selection Whether there is a selection of a
  * subnetwork.
  * @param {number} parameters.nodesMetabolitesSelection Count of nodes for
  * metabolites in selection.
  * @param {number} parameters.nodesReactionsSelection Count of nodes for
  * reactions in selection.
  * @param {number} parameters.pad Dimension for pad space.
  * @param {Object} parameters.graph Reference to graphical container.
  */
  static restoreNodeChart({nodes, nodesMetabolites, nodesReactions, selection, nodesMetabolitesSelection, nodesReactionsSelection, pad, graph} = {}) {
    // Determine graph's dimensions.
    var graphWidth = General.determineElementDimension(graph, "width");
    var graphHeight = General.determineElementDimension(graph, "height");
    // Restore chart's representation of scale.
    View.restoreScaleChart({
      minimum: 0,
      maximum: nodes,
      graphWidth: graphWidth,
      graphHeight: graphHeight,
      pad: pad,
      graph: graph
    });
    // Restore chart's representation of count.
    View.restoreNodeCountChart({
      nodes: nodes,
      nodesMetabolites: nodesMetabolites,
      nodesReactions: nodesReactions,
      selection: selection,
      nodesMetabolitesSelection: nodesMetabolitesSelection,
      nodesReactionsSelection: nodesReactionsSelection,
      graphWidth: graphWidth,
      graphHeight: graphHeight,
      pad: pad,
      graph: graph
    });
  }
  /**
  * Restores a chart for nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.nodes Count of nodes.
  * @param {number} parameters.nodesMetabolites Count of nodes for metabolites.
  * @param {number} parameters.nodesReactions Count of nodes for reactions.
  * @param {boolean} parameters.selection Whether there is a selection of a
  * subnetwork.
  * @param {number} parameters.nodesMetabolitesSelection Count of nodes for
  * metabolites in selection.
  * @param {number} parameters.nodesReactionsSelection Count of nodes for
  * reactions in selection.
  * @param {number} parameters.graphWidth Width of graph.
  * @param {number} parameters.graphHeight Height of graph.
  * @param {number} parameters.pad Dimension for pad space.
  * @param {Object} parameters.graph Reference to graphical container.
  */
  static restoreNodeCountChart({nodes, nodesMetabolites, nodesReactions, selection, nodesMetabolitesSelection, nodesReactionsSelection, graphWidth, graphHeight, pad, graph} = {}) {
    // Select group.
    var group = graph.querySelector("g.chart");
    // Select bars.
    var barMetabolite = group.querySelector("rect.metabolite");
    var barReaction = group.querySelector("rect.reaction");
    if (selection) {
      var barMetaboliteSelection = group
      .querySelector("rect.metabolite.selection");
      var barReactionSelection = group.querySelector("rect.reaction.selection");
    }
    // Select labels.
    var labelMetabolite = group.querySelector("text.metabolite");
    var labelReaction = group.querySelector("text.reaction");
    // Determine dimensions.
    var width = (graphWidth - (pad * 2));
    var height = (graphHeight - (pad * 2));
    // Determine scale for bars' dimensions.
    var scaleValue = d3
    .scaleLinear()
    .domain([0, nodes])
    .range([0, (width)]);
    // Restore bars' dimensions.
    var barHeight = 10;
    barMetabolite.setAttribute("width", scaleValue(nodesMetabolites));
    barMetabolite.setAttribute("height", barHeight);
    barReaction.setAttribute("width", scaleValue(nodesReactions));
    barReaction.setAttribute("height", barHeight);
    if (selection) {
      barMetaboliteSelection
      .setAttribute(
        "width", scaleValue(nodesMetabolites - nodesMetabolitesSelection)
      );
      barMetaboliteSelection.setAttribute("height", barHeight);
      barReactionSelection
      .setAttribute(
        "width", scaleValue(nodesReactions - nodesReactionsSelection)
      );
      barReactionSelection.setAttribute("height", barHeight);
    }
    // Restore bars' positions.
    barMetabolite.setAttribute("x", 0);
    barMetabolite.setAttribute("y", 0);
    barReaction.setAttribute("x", scaleValue(nodesMetabolites));
    barReaction.setAttribute("y", 0);
    if (selection) {
      barMetaboliteSelection
      .setAttribute(
        "x", scaleValue(nodesMetabolitesSelection)
      );
      barMetaboliteSelection.setAttribute("y", 0);
      barReactionSelection
      .setAttribute(
        "x", scaleValue(nodesMetabolites +  nodesReactionsSelection)
      );
      barReactionSelection.setAttribute("y", 0);
    }
    // Restore positions of labels.
    var labelHeight = labelMetabolite.getBoundingClientRect().height;
    var verticalPosition = (barHeight / 2) + (labelHeight / 3);
    labelMetabolite.setAttribute("x", pad);
    labelMetabolite.setAttribute("y", verticalPosition);
    labelReaction.setAttribute("x", (pad + scaleValue(nodesMetabolites)));
    labelReaction.setAttribute("y", verticalPosition);
    // Restore positions of chart.
    group.setAttribute(
      "transform", "translate(" + pad + "," + (graphHeight / 2) + ")"
    );
  }
  /**
  * Creates a chart to summarize links.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.selection Whether there is a selection of a
  * subnetwork.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * @returns {Object} Reference to element.
  */
  static createLinkChart({selection, parent, documentReference} = {}) {
    // Create graphical container.
    var graph = View.createGraph({
      parent: parent,
      documentReference: self.document
    });
    graph.classList.add("link");
    // Create chart's representation of scale.
    var groupScale = View.createScaleChart({
      graph: graph,
      documentReference: self.document
    });
    // Create chart's representation of count.
    var groupCount = View.createLinkCountChart({
      selection: selection,
      graph: graph,
      documentReference: self.document
    });
    // Return reference to element.
    return graph;
  }
  /**
  * Creates a chart to summarize links.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.selection Whether there is a selection of a
  * subnetwork.
  * @param {Object} parameters.graph Reference to graphical container.
  * @param {Object} parameters.documentReference Reference to document object
  * @returns {Object} Reference to element.
  */
  static createLinkCountChart({selection, graph, documentReference} = {}) {
    // Create group.
    var group = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "g");
    graph.appendChild(group);
    group.classList.add("chart");
    // Create bars for visual representations of nodes.
    var barWhole = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "rect");
    group.appendChild(barWhole);
    barWhole.classList.add("whole");
    if (selection) {
      var barSelection = documentReference
      .createElementNS("http://www.w3.org/2000/svg", "rect");
      group.appendChild(barSelection);
      barSelection.classList.add("selection");
    }
    // Return reference to element.
    return group;
  }
  /**
  * Restores a chart for nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.links Count of links.
  * @param {boolean} parameters.selection Whether there is a selection of a
  * subnetwork.
  * @param {number} parameters.linksSelection Count of links in selection.
  * @param {number} parameters.pad Dimension for pad space.
  * @param {Object} parameters.graph Reference to graphical container.
  */
  static restoreLinkChart({links, selection, linksSelection, pad, graph} = {}) {
    // Determine graph's dimensions.
    var graphWidth = General.determineElementDimension(graph, "width");
    var graphHeight = General.determineElementDimension(graph, "height");
    // Restore chart's representation of scale.
    View.restoreScaleChart({
      minimum: 0,
      maximum: links,
      graphWidth: graphWidth,
      graphHeight: graphHeight,
      pad: pad,
      graph: graph
    });
    // Restore chart's representation of count.
    View.restoreLinkCountChart({
      links: links,
      selection: selection,
      linksSelection: linksSelection,
      graphWidth: graphWidth,
      graphHeight: graphHeight,
      pad: pad,
      graph: graph
    });
  }
  /**
  * Restores a chart for links.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.links Count of links.
  * @param {boolean} parameters.selection Whether there is a selection of a
  * subnetwork.
  * @param {number} parameters.linksSelection Count of links in selection.
  * @param {number} parameters.graphWidth Width of graph.
  * @param {number} parameters.graphHeight Height of graph.
  * @param {number} parameters.pad Dimension for pad space.
  * @param {Object} parameters.graph Reference to graphical container.
  */
  static restoreLinkCountChart({links, selection, linksSelection, graphWidth, graphHeight, pad, graph} = {}) {
    // Select group.
    var group = graph.querySelector("g.chart");
    // Select bars.
    var barWhole = graph.querySelector("rect.whole");
    if (selection) {
      var barSelection = graph.querySelector("rect.selection");
    }
    // Determine dimensions.
    var width = (graphWidth - (pad * 2));
    var height = (graphHeight - (pad * 2));
    // Determine scale for bars' dimensions.
    var scaleValue = d3
    .scaleLinear()
    .domain([0, links])
    .range([0, (width)]);
    // Restore bars' dimensions.
    var barHeight = 10;
    barWhole.setAttribute("width", scaleValue(links));
    barWhole.setAttribute("height", barHeight);
    if (selection) {
      barSelection.setAttribute("width", scaleValue(links - linksSelection));
      barSelection.setAttribute("height", barHeight);
    }
    // Restore bars' positions.
    barWhole.setAttribute("x", 0);
    barWhole.setAttribute("y", 0);
    if (selection) {
      barSelection.setAttribute("x", scaleValue(linksSelection));
      barSelection.setAttribute("y", 0);
    }
    // Restore positions of chart.
    group.setAttribute(
      "transform", "translate(" + pad + "," + (graphHeight / 2) + ")"
    );
  }
}
