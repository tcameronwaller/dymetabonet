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
      var container = View.createInsertContainer({
        identifier: identifier,
        target: target,
        position: position,
        documentReference: documentReference
      });
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
  * @param {string} parameters.identifier Identifier of element.
  * @param {Object} parameters.target Reference to element for relative
  * position of insertion.
  * @param {string} parameters.position Position of insertion relative to
  * target, either "beforebegin", "afterbegin", "beforeend", or "afterend".
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createInsertContainer({identifier, target, position, documentReference} = {}) {
    var container = documentReference.createElement("div");
    View.insertElement({
      element: container,
      target: target,
      position: position
    });
    container.setAttribute("id", identifier);
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
  * Creates a row within a table's body.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.body Reference to table's body.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createTableBodyRow({body, documentReference} = {}) {
    // Create elements.
    var row = documentReference.createElement("tr");
    body.appendChild(row);
    // Return reference to element.
    return row;
  }
  /**
  * Creates a cell within a row of a table's body.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.row Reference to row within table's body.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createTableBodyRowCell({row, documentReference} = {}) {
    // Create elements.
    var cell = documentReference.createElement("td");
    row.appendChild(cell);
    // Return reference to element.
    return cell;
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
    container.classList = "";
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
      element.parentElement.removeChild(element);
    }
  }
}

/**
* Interface to contain and organize all other interfaces.
*/
class InterfaceView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.body Reference to document's body.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({body, state, documentReference} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.body = body;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
  }
  /**
  * Initializes, creates and activates, view's content and behavior that does
  * not vary with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "view",
      target: self.body,
      position: "beforeend",
      documentReference: self.document
    });
  }
}

/**
* Interface to contain and organize interfaces on left side of window.
*/
class PanelView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({interfaceView, state, documentReference} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = interfaceView;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
  }
  /**
  * Initializes, creates and activates, view's content and behavior that does
  * not vary with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "panel",
      target: self.interfaceView.container,
      position: "beforeend",
      documentReference: self.document
    });
  }
}

/**
* Interface to communicate transient, concise, supplemental information about
* other elements in interface's views.
* This interface is independent of application's persistent state.
*/
class TipView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.windowReference Reference to browser's window.
  */
  constructor ({interfaceView, state, documentReference, windowReference} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to browser's window.
    self.window = windowReference;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = interfaceView;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.clearView(self);
  }
  /**
  * Initializes, creates and activates, view's content and behavior that does
  * not vary with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "tip",
      target: self.interfaceView.container,
      position: "beforeend",
      documentReference: self.document
    });
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.visibility Whether tip view is visible.
  * @param {number} parameters.horizontalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.verticalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.horizontalShift Horizontal shift in pixels
  * relative to reference point.
  * @param {number} parameters.verticalShift Horizontal shift in pixels relative
  * to reference point.
  * @param {Object} parameters.content Reference to element for content.
  * @param {Object} parameters.self Instance of a class.
  */
  restoreView({visibility, horizontalPosition, verticalPosition, horizontalShift, verticalShift, content, self} = {}) {
    // Remove any children.
    if (!(self.container.children.length === 0)) {
      General.removeDocumentChildren(self.container);
    }
    // Create tip's contents.
    self.container.appendChild(content);
    // Determine whether tip is visible.
    if (visibility) {
      self.container.classList.remove("invisible");
      self.container.classList.add("visible");
    } else {
      self.container.classList.remove("visible");
      self.container.classList.add("invisible");
    }
    // Determine positions of view.
    var positions = View.determineTransientViewPositions({
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      horizontalShift: horizontalShift,
      verticalShift: verticalShift,
      viewWidth: self.window.innerWidth,
      viewHeight: self.window.innerHeight
    });
    self.container.style.top = positions.top;
    self.container.style.bottom = positions.bottom;
    self.container.style.left = positions.left;
    self.container.style.right = positions.right;
  }
  /**
  * Clears view.
  * @param {Object} self Instance of a class.
  */
  clearView(self) {
    self.restoreView({
      visibility: false,
      horizontalPosition: 0,
      verticalPosition: 0,
      horizontalShift: 0,
      verticalShift: 0,
      content: View.createSpanText({text: "",documentReference: self.document}),
      self: self
    });
  }
}

/**
* Interface to provide transient, specific controls.
* This interface is independent of application's persistent state.
*/
class PromptView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.windowReference Reference to browser's window.
  */
  constructor ({interfaceView, state, documentReference, windowReference} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to browser's window.
    self.window = windowReference;
    // Set reference to document object model (DOM).
    self.document = documentReference;
    // Set reference to other views.
    self.interfaceView = interfaceView;
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
      identifier: "prompt",
      target: self.interfaceView.container,
      position: "beforeend",
      documentReference: self.document
    });
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Determine type of prompt to create if any.
    if (self.state.prompt.type === "none") {
      self.clearView(self);
    } else if (self.state.prompt.type === "network-diagram") {
      self.createActivateRestoreRepresentNetworkDiagramPrompt(self);
    } else if (self.state.prompt.type === "network-node") {
      //self.createActivateRestoreRepresentNetworkNodePrompt(self);
    }
  }
  /**
  * Clears view.
  * @param {Object} self Instance of a class.
  */
  clearView(self) {
    // Remove container's previous contents and assign a class name to indicate
    // view's novel type.
    View.removeContainerContentSetClass({
      container: self.container,
      className: self.state.prompt.type
    });
    // Represent view.
    self.representView({
      visibility: false,
      horizontalPosition: self.state.prompt.horizontalPosition,
      verticalPosition: self.state.prompt.verticalPosition,
      horizontalShift: self.state.prompt.horizontalShift,
      verticalShift: self.state.prompt.verticalShift,
      self: self
    });
  }
  /**
  * Creates, activates, and restores controls for prompt for network's diagram.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreRepresentNetworkDiagramPrompt(self) {
    self.createActivateNetworkDiagramPrompt(self);
    self.restoreNetworkDiagramPrompt(self);
    // Represent view.
    self.representView({
      visibility: true,
      horizontalPosition: self.state.prompt.horizontalPosition,
      verticalPosition: self.state.prompt.verticalPosition,
      horizontalShift: self.state.prompt.horizontalShift,
      verticalShift: self.state.prompt.verticalShift,
      self: self
    });
  }
  /**
  * Creates and activates controls for prompt for network's diagram.
  * @param {Object} self Instance of a class.
  */
  createActivateNetworkDiagramPrompt(self) {
    // Determine whether container's current content matches view's novel type.
    // Container's class indicates type of content.
    if (!self.container.classList.contains(self.state.prompt.type)) {
      // Container's current content does not match view's novel type.
      // Remove container's previous contents and assign a class name to
      // indicate view's novel type.
      View.removeContainerContentSetClass({
        container: self.container,
        className: self.state.prompt.type
      });
      // Create content.
      self.createNetworkDiagramPrompt(self);
      // Activate behavior.
      self.activateNetworkDiagramPrompt(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      self.search = self.document.getElementById("diagram-rogue-focus-search");
    }
  }
  /**
  * Creates controls for prompt for network's diagram.
  * @param {Object} self Instance of a class.
  */
  createNetworkDiagramPrompt(self) {
    // Create button.
    self.remove = View.createButton({
      text: "remove",
      parent: self.container,
      documentReference: self.document
    });
    // Create break.
    self.container.appendChild(self.document.createElement("br"));
    // Create button.
    self.lock = View.createButton({
      text: "lock",
      parent: self.container,
      documentReference: self.document
    });
    // Create break.
    self.container.appendChild(self.document.createElement("br"));
    // Create button.
    self.unlock = View.createButton({
      text: "unlock",
      parent: self.container,
      documentReference: self.document
    });
    // Create break.
    self.container.appendChild(self.document.createElement("br"));
    // Create button.
    self.add = View.createButton({
      text: "+",
      parent: self.container,
      documentReference: self.document
    });
    // Create search menu.
    self.search = View.createSearchOptionsList({
      identifier: "diagram-rogue-focus-search",
      prompt: "select node...",
      parent: self.container,
      documentReference: self.document
    });
  }
  /**
  * Activates controls for prompt for network's diagram.
  * @param {Object} self Instance of a class.
  */
  activateNetworkDiagramPrompt(self) {
    // Activate behavior.
    // Buttons.
    self.remove.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      // TODO: Call appropriate action...
    });
    self.lock.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      // TODO: Call appropriate action...
    });
    self.unlock.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      // TODO: Call appropriate action...
    });
    self.add.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      Action.executeRogueTraversalUnion(self.state);
    });
    // Search.
    TraversalView.activateTraversalSearch({
      search: self.search,
      variableName: "traversalRogueFocus",
      recordSource: "network",
      state: self.state
    });
  }
  /**
  * Restores controls for prompt for network's diagram.
  * @param {Object} self Instance of a class.
  */
  restoreNetworkDiagramPrompt(self) {
    // Create search options.
    TraversalView.restoreTraversalSearch({
      search: self.search,
      variableName: "traversalRogueFocus",
      recordSource: "network",
      state: self.state
    });
  }
  /**
  * Represents view in specific position.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.visibility Whether tip view is visible.
  * @param {number} parameters.horizontalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.verticalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.horizontalShift Horizontal shift in pixels
  * relative to reference point.
  * @param {number} parameters.verticalShift Horizontal shift in pixels relative
  * to reference point.
  * @param {Object} parameters.self Instance of a class.
  */
  representView({visibility, horizontalPosition, verticalPosition, horizontalShift, verticalShift, self} = {}) {
    // Determine whether view is visible.
    if (visibility) {
      self.container.classList.remove("invisible");
      self.container.classList.add("visible");
    } else {
      self.container.classList.remove("visible");
      self.container.classList.add("invisible");
    }
    // Determine positions of view.
    var positions = View.determineTransientViewPositions({
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      horizontalShift: horizontalShift,
      verticalShift: verticalShift,
      viewWidth: self.window.innerWidth,
      viewHeight: self.window.innerHeight
    });
    self.container.style.top = positions.top;
    self.container.style.bottom = positions.bottom;
    self.container.style.left = positions.left;
    self.container.style.right = positions.right;
  }
}

/**
* Interface to provide information in detail about the entire network or about
* entities within this network.
*/
class DetailView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.panelView Instance of PanelView's class.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.promptView Instance of PromptView's class.
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
      self.createRestoreActivateSummaryEntirety(self);
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
      var filterReferences = DetailView.createSummaryEntiretyTable({
        name: "filter",
        categories: ["metabolites", "reactions"],
        parent: self.summaryContainer,
        documentReference: self.document
      });
      self.filterMetabolitesGraph = filterReferences.graphOne;
      self.filterReactionsGraph = filterReferences.graphTwo;
      var traversalReferences = DetailView.createSummaryEntiretyTable({
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
    var graphOne = DetailView.createSummaryEntiretyTableBodyRowCells({
      category: categories[0],
      body: body,
      documentReference: documentReference
    });
    var graphTwo = DetailView.createSummaryEntiretyTableBodyRowCells({
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

////////////////////////////////////////////////////////////////////////////////
// Control view and views within control view.

/**
* Interface to contain other interfaces for controls.
*/
class ControlView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.panelView Instance of PanelView's class.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.promptView Instance of PromptView's class.
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
      identifier: "control",
      target: self.panelView.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create and activate tabs.
      self.createActivateTabs(self);
    } else {
      // Container is not empty.
      // Set references to content.
      // Tabs.
      self.stateTab = self.document.getElementById("state-tab");
      self.filterTab = self.document.getElementById("filter-tab");
      self.simplificationTab = self
      .document.getElementById("simplification-tab");
      self.traversalTab = self.document.getElementById("traversal-tab");
    }
  }
  /**
  * Creates and activates tabs.
  * @param {Object} self Instance of a class.
  */
  createActivateTabs(self) {
    var tabs = Model.determineControlTabs(self.state);
    tabs.forEach(function (category) {
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
    // Create container.
    var identifier = ControlView.createTabIdentifier(category);
    var reference = ControlView.createTabReference(category);
    self[reference] = self.document.createElement("div");
    self.container.appendChild(self[reference]);
    var label = View.createAppendSpanText({
      text: category,
      parent: self[reference],
      documentReference: self.document
    });
    // Assign attributes.
    self[reference].setAttribute("id", identifier);
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
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Determine which subordinate views to create, activate, and restore.
    // Multiple subordinate views within control view can be active
    // simultaneously.
    if (Model.determineControlState(self.state)) {
      new StateView({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        controlView: self,
        state: self.state,
        documentReference: self.document
      });
    } else {
      View.removeExistElement("state", self.document);
    }
    if (Model.determineControlFilter(self.state)) {
      new FilterView({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        controlView: self,
        state: self.state,
        documentReference: self.document
      });
    } else {
      View.removeExistElement("filter", self.document);
    }
    if (Model.determineControlSimplification(self.state)) {
      new SimplificationView({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        controlView: self,
        state: self.state,
        documentReference: self.document
      });
    } else {
      View.removeExistElement("simplification", self.document);
    }
    if (Model.determineControlTraversal(self.state)) {
      new TraversalView({
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        controlView: self,
        state: self.state,
        documentReference: self.document
      });
    } else {
      View.removeExistElement("traversal", self.document);
    }
  }
  /**
  * Creates identifier for a tab.
  * @param {string} category Category for a tab.
  * @returns {string} Identifier for a tab.
  */
  static createTabIdentifier(category) {
    return (category + "-tab");
  }
  /**
  * Creates reference for a tab.
  * @param {string} category Category for a tab.
  * @returns {string} Reference for a tab.
  */
  static createTabReference(category) {
    return (category + "Tab");
  }
}

/**
* Interface to control load and save of application's state.
*/
class StateView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.promptView Instance of PromptView's class.
  * @param {Object} parameters.controlView Instance of ControlView's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({interfaceView, tipView, promptView, controlView, state, documentReference} = {}) {
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
    self.controlView = controlView;
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
      identifier: "state",
      target: self.controlView.stateTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
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
        Action.evaluateSourceLoadRestoreState(self.state);
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
      // Set references to content.
      self.sourceLabel = self.container.getElementsByTagName("span").item(0);
    }
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
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

/**
* Interface to summarize sets of entities and control filters by these sets.
*/
class FilterView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.promptView Instance of PromptView's class.
  * @param {Object} parameters.controlView Instance of ControlView's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({interfaceView, tipView, promptView, controlView, state, documentReference} = {}) {
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
    self.controlView = controlView;
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
      target: self.controlView.filterTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
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
      Action.restoreFilterViewControls(self.state);
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
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Create view's variant elements.
    // Activate variant behavior of view's elements.
    self.metabolites.checked = FilterView
    .determineEntityMatch("metabolites", self.state);
    self.reactions.checked = FilterView
    .determineEntityMatch("reactions", self.state);
    self.filter.checked = FilterView.determineFilter(self.state);
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
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.promptView Instance of PromptView's class.
  * @param {Object} parameters.filterView Instance of FilterView's class.
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
  * Restores view's content and behavior that varies with changes to the
  * application's state.
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
  * @param {Object} parameters.tipView Instance of TipView's class.
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

/**
* Interface to summarize candidate entities and control simplifications.
*/
class SimplificationView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.promptView Instance of PromptView's class.
  * @param {Object} parameters.controlView Instance of ControlView's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({interfaceView, tipView, promptView, controlView, state, documentReference} = {}) {
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
    self.controlView = controlView;
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
      identifier: "simplification",
      target: self.controlView.simplificationTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create and activate restore.
      self.createActivateRestore(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate control for compartmentalization.
      self.createActivateCompartmentalizationControl(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate control for default simplifications.
      self.createActivateDefaultSimplificationsControl(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create menu for candidate metabolites.
      new SimplificationMenuView({
        category: "metabolites",
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        simplificationView: self,
        state: self.state,
        documentReference: self.document
      });
      // Create menu for candidate reactions.
      new SimplificationMenuView({
        category: "reactions",
        interfaceView: self.interfaceView,
        tipView: self.tipView,
        promptView: self.promptView,
        simplificationView: self,
        state: self.state,
        documentReference: self.document
      });
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
      Action.changeCompartmentalization(self.state);
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
      Action.changeDefaultSimplifications(self.state);
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
      Action.restoreSimplificationViewControls(self.state);
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
    self.compartmentalization.checked = SimplificationView
    .determineCompartmentalization(self.state);
    self.simplifications.checked = SimplificationView
    .determineSimplifications(self.state);
    // Create menu for candidate metabolites.
    new SimplificationMenuView({
      category: "metabolites",
      interfaceView: self.interfaceView,
      tipView: self.tipView,
      promptView: self.promptView,
      simplificationView: self,
      state: self.state,
      documentReference: self.document
    });
    // Create menu for candidate reactions.
    new SimplificationMenuView({
      category: "reactions",
      interfaceView: self.interfaceView,
      tipView: self.tipView,
      promptView: self.promptView,
      simplificationView: self,
      state: self.state,
      documentReference: self.document
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

/**
* Interface to organize menu of candidates for simplification.
*/
class SimplificationMenuView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.category Name of category.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.promptView Instance of PromptView's class.
  * @param {Object} parameters.simplificationView Instance of
  * SimplificationView's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({category, interfaceView, tipView, promptView, simplificationView, state, documentReference} = {}) {
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
    self.simplificationView = simplificationView;
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
      target: self.simplificationView.container,
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
  * Restores view's content and behavior that varies with changes to the
  * application's state.
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
      // Select element.
      var row = nodes[index];
      var rowSelection = d3.select(row);
      // Determine cursor's positions.
      var horizontalPosition = d3.event.clientX;
      var verticalPosition = d3.event.clientY;
      // Call action.
      rowSelection.classed("normal", false);
      rowSelection.classed("emphasis", true);
      SimplificationMenuView.createTip({
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
      SimplificationMenuView.createTip({
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
      return SimplificationMenuView.accessName({
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
      return SimplificationMenuView.determineSimplification({
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
  * @param {number} parameters.horizontalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.verticalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  static createTip({identifier, entity, count, horizontalPosition, verticalPosition, tipView, documentReference, state} = {}) {
    // Create summary for tip.
    var name = SimplificationMenuView.accessName({
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

/**
* Interface to control selections by traversal of network.
*/
class TraversalView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.promptView Instance of PromptView's class.
  * @param {Object} parameters.controlView Instance of ControlView's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({interfaceView, tipView, promptView, controlView, state, documentReference} = {}) {
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
    self.controlView = controlView;
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
      identifier: "traversal",
      target: self.controlView.traversalTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // TODO: Add informative tips on hover over each button...
      // Create and activate restore.
      self.createActivateRestore(self);
      // Create and activate clear.
      self.createActivateClear(self);
      // Create and activate export.
      self.createActivateExport(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate controls for combination.
      self.createActivateCombinationControl("union", self);
      self.createActivateCombinationControl("difference", self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate controls for type of traversal.
      self.createActivateTraversalTypeControl("rogue", self);
      self.createActivateTraversalTypeControl("proximity", self);
      self.createActivateTraversalTypeControl("path", self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create container.
      self.controlContainer = View.createInsertContainer({
        identifier: "traversal-control-container",
        target: self.container,
        position: "beforeend",
        documentReference: self.document
      });
    } else {
      // Container is not empty.
      // Set references to content.
      // Control for combination.
      self.union = self.document.getElementById("combination-union");
      self.difference = self.document.getElementById("combination-difference");
      // Control for type of traversal.
      self.rogue = self.document.getElementById("traversal-rogue");
      self.proximity = self.document.getElementById("traversal-proximity");
      self.path = self.document.getElementById("traversal-path");
      // Container for traversal's controls.
      self.controlContainer = self
      .document.getElementById("traversal-control-container");
    }
  }
  /**
  * Creates and activates a button to copy subnetwork from network and restore
  * the view's controls.
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
      Action.copySubnetworkRestoreTraversalViewControls(self.state);
    });
  }
  /**
  * Creates and activates a button to clear the subnetwork and restore the
  * view's controls.
  * @param {Object} self Instance of a class.
  */
  createActivateClear(self) {
    // Create button for clear.
    var clear = View.createButton({
      text: "clear",
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    clear.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      Action.clearSubnetworkRestoreTraversalViewControls(self.state);
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
      Action.exportNetworkEntitiesSummary(self.state);
    });
  }
  /**
  * Creates and activates a control for the combination of sets of nodes.
  * @param {string} type Type of combination, union or difference.
  * @param {Object} self Instance of a class.
  */
  createActivateCombinationControl(type, self) {
    // Create control for combination.
    var identifier = "combination-" + type;
    self[type] = View.createRadioButtonLabel({
      identifier: identifier,
      value: type,
      name: "combination",
      className: "combination",
      text: type,
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    self[type].addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine method of combination.
      var combination = event.currentTarget.value;
      // Call action.
      Action.changeCombination(combination, self.state);
    });
  }
  /**
  * Creates and activates a control for the type of traversal.
  * @param {string} type Type of traversal, rogue, proximity, or path.
  * @param {Object} self Instance of a class.
  */
  createActivateTraversalTypeControl(type, self) {
    // Create control for type of traversal.
    var identifier = "traversal-" + type;
    self[type] = View.createRadioButtonLabel({
      identifier: identifier,
      value: type,
      name: "traversal",
      className: "traversal",
      text: type,
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    self[type].addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine type.
      var type = event.currentTarget.value;
      // Call action.
      Action.changeTraversalType(type, self.state);
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
    self.union.checked = TraversalView
    .determineTraversalCombinationMatch("union", self.state);
    self.difference.checked = TraversalView
    .determineTraversalCombinationMatch("difference", self.state);
    self.rogue.checked = TraversalView
    .determineTraversalTypeMatch("rogue", self.state);
    self.proximity.checked = TraversalView
    .determineTraversalTypeMatch("proximity", self.state);
    self.path.checked = TraversalView
    .determineTraversalTypeMatch("path", self.state);
    // Create, activate, and restore controls for traversal.
    self.createActivateRestoreTraversalControl(self);
  }
  /**
  * Creates, activates, and restores controls for traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreTraversalControl(self) {
    // Determine which type of traversal for which to create controls.
    if (self.state.traversalType === "rogue") {
      self.createActivateRestoreRogueTraversalControl(self);
    } else if (self.state.traversalType === "proximity") {
      self.createActivateRestoreProximityTraversalControl(self);
    } else if (self.state.traversalType === "path") {
      self.createActivateRestorePathTraversalControl(self);
    }
  }
  /**
  * Creates, activates, and restores controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreRogueTraversalControl(self) {
    self.createActivateRogueTraversalControl(self);
    self.restoreRogueTraversalControl(self);
  }
  /**
  * Creates and activates controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRogueTraversalControl(self) {
    // Determine whether container's current content matches view's novel type.
    // Container's class indicates type of content.
    if (!self.controlContainer.classList.contains("rogue")) {
      // Container's current content does not match view's novel type.
      // Remove container's previous contents and assign a class name to
      // indicate view's novel type.
      View.removeContainerContentSetClass({
        container: self.controlContainer,
        className: "rogue"
      });
      // Create content.
      self.createRogueTraversalControl(self);
      // Activate behavior.
      self.activateRogueTraversalControl(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      self.traversalRogueFocusSearch = self
      .document.getElementById("traversal-rogue-focus-search");
    }
  }
  /**
  * Creates controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  createRogueTraversalControl(self) {
    // Create and activate elements.
    // Create search menu.
    self.traversalRogueFocusSearch = View.createSearchOptionsList({
      identifier: "traversal-rogue-focus-search",
      prompt: "select node...",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create execute.
    // Create button for execution.
    self.execute = View.createButton({
      text: "execute",
      parent: self.controlContainer,
      documentReference: self.document
    });
  }
  /**
  * Activates controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  activateRogueTraversalControl(self) {
    // Activate search.
    TraversalView.activateTraversalSearch({
      search: self.traversalRogueFocusSearch,
      variableName: "traversalRogueFocus",
      recordSource: "network",
      state: self.state
    });
    // Activate execute.
    self.execute.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      Action.executeRogueTraversalCombination(self.state);
    });
  }
  /**
  * Restores controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  restoreRogueTraversalControl(self) {
    // Restore controls' settings.
    // Restore search.
    TraversalView.restoreTraversalSearch({
      search: self.traversalRogueFocusSearch,
      variableName: "traversalRogueFocus",
      recordSource: "network",
      state: self.state
    });
  }
  /**
  * Creates, activates, and restores controls for proximity traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreProximityTraversalControl(self) {
    self.createActivateProximityTraversalControl(self);
    self.restoreProximityTraversalControl(self);
  }
  /**
  * Creates and activates controls for proximity traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateProximityTraversalControl(self) {
    // Determine whether container's current content matches view's novel type.
    // Container's class indicates type of content.
    if (!self.container.classList.contains("proximity")) {
      // Container's current content does not match view's novel type.
      // Remove container's previous contents and assign a class name to
      // indicate view's novel type.
      View.removeContainerContentSetClass({
        container: self.controlContainer,
        className: "proximity"
      });
      // Create content.
      self.createProximityTraversalControl(self);
      // Activate behavior.
      self.activateProximityTraversalControl(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      self.traversalProximityFocusSearch = self
      .document.getElementById("traversal-proximity-focus-search");
      self.traversalProximityDirection = self
      .document.getElementById("traversal-proximity-direction");
      self.traversalProximityDepth = self
      .document.getElementById("traversal-proximity-depth");
    }
  }
  /**
  * Creates controls for proximity traversal.
  * @param {Object} self Instance of a class.
  */
  createProximityTraversalControl(self) {
    // Create and activate elements.
    // Create search menu.
    self.traversalProximityFocusSearch = View.createSearchOptionsList({
      identifier: "traversal-proximity-focus-search",
      prompt: "select node...",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create direction.
    // Create control for direction.
    self.traversalProximityDirection = View.createButtonIdentifier({
      identifier: "traversal-proximity-direction",
      text: "",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create control for depth.
    self.traversalProximityDepth = View.createSelector({
      identifier: "traversal-proximity-depth",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create execute.
    // Create button for execution.
    self.execute = View.createButton({
      text: "execute",
      parent: self.controlContainer,
      documentReference: self.document
    });
  }
  /**
  * Activates controls for proximity traversal.
  * @param {Object} self Instance of a class.
  */
  activateProximityTraversalControl(self) {
    // Activate search.
    TraversalView.activateTraversalSearch({
      search: self.traversalProximityFocusSearch,
      variableName: "traversalProximityFocus",
      recordSource: "subnetwork",
      state: self.state
    });
    // Activate direction.
    self
    .traversalProximityDirection.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      Action.changeTraversalProximityDirection(self.state);
    });
    // Activate depth.
    self
    .traversalProximityDepth.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine value.
      var value = Number(event.currentTarget.value);
      // Call action.
      Action.changeTraversalProximityDepth(value, self.state);
    });
    // Activate execute.
    self.execute.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      Action.executeProximityTraversalCombination(self.state);
    });
  }
  /**
  * Restores controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  restoreProximityTraversalControl(self) {
    // Restore controls' settings.
    // Restore search.
    TraversalView.restoreTraversalSearch({
      search: self.traversalProximityFocusSearch,
      variableName: "traversalProximityFocus",
      recordSource: "subnetwork",
      state: self.state
    });
    // Restore direction.
    // Represent direction.
    if (self.state.traversalProximityDirection === "successors") {
      self.traversalProximityDirection.textContent = "->";
    } else if (self.state.traversalProximityDirection === "neighbors") {
      self.traversalProximityDirection.textContent = "<->";
    } else if (self.state.traversalProximityDirection === "predecessors") {
      self.traversalProximityDirection.textContent = "<-";
    }
    // Restore depth.
    // Create options.
    var options = [1, 2, 3, 4, 5].map(function (depth) {
      // Determine whether depth matches state variable.
      var match = (depth === self.state.traversalProximityDepth);
      return {
        label: String(depth) + " links",
        value: depth,
        selection: match
      };
    });
    View.createSelectorOptions({
      options: options,
      selector: self.traversalProximityDepth,
      documentReference: self.document
    });
  }
  /**
  * Creates, activates, and restores controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRestorePathTraversalControl(self) {
    self.createActivatePathTraversalControl(self);
    self.restorePathTraversalControl(self);
  }
  /**
  * Creates and activates controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  createActivatePathTraversalControl(self) {
    // Determine whether container's current content matches view's novel type.
    // Container's class indicates type of content.
    if (!self.container.classList.contains("path")) {
      // Container's current content does not match view's novel type.
      // Remove container's previous contents and assign a class name to
      // indicate view's novel type.
      View.removeContainerContentSetClass({
        container: self.controlContainer,
        className: "path"
      });
      // Create content.
      self.createPathTraversalControl(self);
      // Activate behavior.
      self.activatePathTraversalControl(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      self.traversalPathSourceSearch = self
      .document.getElementById("traversal-path-source-search");
      self.traversalPathTargetSearch = self
      .document.getElementById("traversal-path-target-search");
      self.traversalPathDirection = self
      .document.getElementById("traversal-path-direction");
      self.traversalPathCount = self
      .document.getElementById("traversal-path-count");
    }
  }
  /**
  * Creates controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  createPathTraversalControl(self) {
    // Create and activate elements.
    // Create search menu.
    self.traversalPathSourceSearch = View.createSearchOptionsList({
      identifier: "traversal-path-source-search",
      prompt: "select node...",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create direction.
    // Create control for direction.
    self.traversalPathDirection = View.createButtonIdentifier({
      identifier: "traversal-path-direction",
      text: "",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create control for count.
    self.traversalPathCount = View.createSelector({
      identifier: "traversal-path-count",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create search menu.
    self.traversalPathTargetSearch = View.createSearchOptionsList({
      identifier: "traversal-path-target-search",
      prompt: "select node...",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create execute.
    // Create button for execution.
    self.execute = View.createButton({
      text: "execute",
      parent: self.controlContainer,
      documentReference: self.document
    });
  }
  /**
  * Activates controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  activatePathTraversalControl(self) {
    // Activate search.
    TraversalView.activateTraversalSearch({
      search: self.traversalPathSourceSearch,
      variableName: "traversalPathSource",
      recordSource: "subnetwork",
      state: self.state
    });
    // Activate direction.
    self
    .traversalPathDirection.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      Action.changeTraversalPathDirection(self.state);
    });
    // Activate count.
    self
    .traversalPathCount.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine value.
      var value = Number(event.currentTarget.value);
      // Call action.
      Action.changeTraversalPathCount(value, self.state);
    });
    // Activate search.
    TraversalView.activateTraversalSearch({
      search: self.traversalPathTargetSearch,
      variableName: "traversalPathTarget",
      recordSource: "subnetwork",
      state: self.state
    });
    // Activate execute.
    self.execute.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      Action.executePathTraversalCombination(self.state);
    });
  }
  /**
  * Restores controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  restorePathTraversalControl(self) {
    // Restore controls' settings.
    // Restore search.
    TraversalView.restoreTraversalSearch({
      search: self.traversalPathSourceSearch,
      variableName: "traversalPathSource",
      recordSource: "subnetwork",
      state: self.state
    });
    // Restore direction.
    // Represent direction.
    if (self.state.traversalPathDirection === "forward") {
      self.traversalPathDirection.textContent = "->";
    } else if (self.state.traversalPathDirection === "both") {
      self.traversalPathDirection.textContent = "<->";
    } else if (self.state.traversalPathDirection === "reverse") {
      self.traversalPathDirection.textContent = "<-";
    }
    // Restore count.
    // Create options.
    var options = [1, 2, 3, 4, 5].map(function (count) {
      // Determine whether depth matches state variable.
      var match = (count === self.state.traversalPathCount);
      return {
        label: String(count) + " paths",
        value: count,
        selection: match
      };
    });
    View.createSelectorOptions({
      options: options,
      selector: self.traversalPathCount,
      documentReference: self.document
    });
    // Restore search.
    TraversalView.restoreTraversalSearch({
      search: self.traversalPathTargetSearch,
      variableName: "traversalPathTarget",
      recordSource: "subnetwork",
      state: self.state
    });
  }
  /**
  * Determines whether a combination strategy matches the value in the
  * application's state.
  * @param {string} type Type of combination, union or difference.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether combination strategy matches the value in the
  * application's state.
  */
  static determineTraversalCombinationMatch(type, state) {
    return type === state.traversalCombination;
  }
  /**
  * Determines whether a type of traversal matches the value in the
  * application's state.
  * @param {string} type Type of traversal, rogue, proximity, or path.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether type of traversal matches the value in the
  * application's state.
  */
  static determineTraversalTypeMatch(type, state) {
    var value = state.traversalType;
    return value === type;
  }
  /**
  * Activates the search for a focal node for rogue traversal.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.search Reference to search menu.
  * @param {string} parameters.variableName Name of state variable.
  * @param {string} parameters.recordSource Source of records for nodes, either
  * "subnetwork" or "network".
  * @param {Object} parameters.state Application's state.
  */
  static activateTraversalSearch({search, variableName, recordSource, state} = {}) {
    // Determine source of nodes' records.
    if (recordSource === "subnetwork") {
      var nodesRecords = state.subnetworkNodesRecords;
    } else if (recordSource === "network") {
      var nodesRecords = state.networkNodesRecords;
    }
    // Activate behavior.
    search.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine identifier of any option that matches the search's value.
      var identifier = View.determineSearchOptionName(event.currentTarget);
      // Determine whether search's value matches a valid option.
      if (identifier.length > 0) {
        // Access information.
        var node = state.networkNodesRecords.find(function (record) {
          return identifier === record.identifier;
        });
        // Call action.
        if (variableName === "traversalRogueFocus") {
          Action.changeTraversalRogueFocus({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "traversalProximityFocus") {
          Action.changeTraversalProximityFocus({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "traversalPathSource") {
          Action.changeTraversalPathSource({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "traversalPathTarget") {
          Action.changeTraversalPathTarget({
            identifier: identifier,
            type: node.type,
            state: state
          });
        }
      } else {
        // Restore search.
        TraversalView.restoreTraversalSearch({
          search: search,
          variableName: variableName,
          recordSource: recordSource,
          state: state
        });
      }
    });
  }
  /**
  * Restores the options and value of a search menu for network's nodes.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.search Reference to search menu.
  * @param {string} parameters.variableName Name of state variable.
  * @param {string} parameters.recordSource Source of records for nodes, either
  * "subnetwork" or "network".
  * @param {Object} parameters.state Application's state.
  */
  static restoreTraversalSearch({search, variableName, recordSource, state} = {}) {
    // Determine source of nodes' records.
    if (recordSource === "subnetwork") {
      var nodesRecords = state.subnetworkNodesRecords;
    } else if (recordSource === "network") {
      var nodesRecords = state.networkNodesRecords;
    }
    // Prepare records for search menu's options.
    var optionsRecords = nodesRecords.map(function (record) {
      if (record.type === "metabolite") {
        // Access information.
        var node = state.networkNodesMetabolites[record.identifier];
        var candidate = state.candidatesMetabolites[node.candidate];
        var name = candidate.name;
      } else if (record.type === "reaction") {
        // Access information.
        var node = state.networkNodesReactions[record.identifier];
        var candidate = state.candidatesReactions[node.candidate];
        var name = candidate.name;
      }
      // Create record.
      return {
        identifier: record.identifier,
        name: name,
        type: record.type
      };
    });
    // Sort recirds for search menu's options.
    // Sort records in ascending order first by their names' lengths and then by
    // their names' characters.
    var sortOptionsRecords = General
    .sortArrayRecordsByNameLengthCharacter(optionsRecords);
    // Create search menu's options.
    View.createSearchOptions({
      list: search.list,
      records: sortOptionsRecords
    });
    // Represent search's current value.
    if (state[variableName].type.length > 0) {
      if (state[variableName].type === "metabolite") {
        // Access information.
        var node = state
        .networkNodesMetabolites[state[variableName].identifier];
        var candidate = state.candidatesMetabolites[node.candidate];
        var name = candidate.name;
      } else if (state[variableName].type === "reaction") {
        // Access information.
        var node = state
        .networkNodesReactions[state[variableName].identifier];
        var candidate = state.candidatesReactions[node.candidate];
        var name = candidate.name;
      }
      search.value = name;
    } else {
      search.value = "";
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Exploration view and views within exploration view.

// TODO: Re-organize ExplorationView as I did for ControlView...

/**
* Interface to contain other interfaces for exploration.
*/
class ExplorationView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of InterfaceView's class.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.promptView Instance of PromptView's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({interfaceView, tipView, promptView, state, documentReference} = {}) {
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
      identifier: "exploration",
      target: self.interfaceView.container,
      position: "beforeend",
      documentReference: self.document
    });
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
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

// TODO: Move the information in the SummaryView to the DetailView?

/**
* Interface to summarize filters and network's elements and control visual
* representation of network's topology.
*/
class SummaryView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.exploration Instance of ExplorationView's class.
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

/**
* Interface to represent visually the network's topology.
*/
class TopologyView {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.promptView Instance of PromptView's class.
  * @param {Object} parameters.exploration Instance of ExplorationView's class.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({tipView, prompt, exploration, state} = {}) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to other views..
    self.view = self.document.getElementById("view");
    self.tipView = tipView;
    self.prompt = prompt;
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
      identifier: "topology",
      target: self.exploration.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create graphical container.
      self.createGraph(self);
      // Define links' directional marker.
      self.defineLinkDirectionalMarker(self);
      // Create graph's base.
      self.createActivateBase(self);
      // Create group for links.
      self.createLinksGroup(self);
      // Create group for nodes.
      self.createNodesGroup(self);
    } else {
      // Container is not empty.
      // Set references to content.
      self.graph = self.container.getElementsByTagName("svg").item(0);
      self.graphWidth = General.determineElementDimension(self.graph, "width");
      self.graphHeight = General
      .determineElementDimension(self.graph, "height");
      self.base = self.graph.querySelector("rect.base")
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
  * Creates and activates a base within a graphical container.
  * @param {Object} self Instance of a class.
  */
  createActivateBase(self) {
    // Create base.
    var base = self
    .document.createElementNS("http://www.w3.org/2000/svg", "rect");
    self.graph.appendChild(base);
    base.classList.add("base");
    base.setAttribute("x", "0px");
    base.setAttribute("y", "0px");
    base.setAttribute("width", self.graphWidth);
    base.setAttribute("height", self.graphHeight);
    // Activate behavior.
    base.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine event's positions.
      var horizontalPosition = event.clientX;
      var verticalPosition = event.clientY;
      // Call action.
      Action.selectNetworkDiagram({
        horizontalPosition: horizontalPosition,
        verticalPosition: verticalPosition,
        state: self.state
      });
    });
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

  // TODO: no more need for flag for topology novelty.
  // TODO: I guess just restore the network's diagram with each update to state and view

  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
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
    // TODO: I don't think that the flag for topology novelty will be necessary anymore...
    if (Model.determineTopologyNovelty(self.state)) {
      self.createNetworkLayout(self);
    }
  }
  /**
  * Prepares local records of information about network's elements.
  * @param {Object} self Instance of a class.
  */
  prepareNetworkElementsRecords(self) {
    // Records for subnetwork's elements contain mutable information, especially
    // about positions of elements within network's diagram.
    self.nodesRecords = self.state.subnetworkNodesRecords;
    self.linksRecords = self.state.subnetworkLinksRecords;
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

  // TODO: Implement tip view
  // TODO: Implement prompt view with controls for individual nodes
  // TODO: Selection of node highlights node (emphasis class), activates detail view, and displays details in detail view
  // TODO: Maybe only create and display prompt view for current node selection.
  // TODO: Click and drag moves node and locks in new position...
  // TODO: I want new classes for selected (emphasis) and anchored nodes.

  //nodes.call(
  //  d3.drag()
  //  .on("start", startDrag)
  //  .on("drag", drag)
  //  .on("end", endDrag)
  //)
  //.on("dblclick", relsease);

//  function dragStart(d) {
//    if (!d3.event.active) self.simulation.alphaTarget(0.3).restart();
//    d.fx = d.x;
//    d.fy = d.y;
//    d3.select(this)
//        .classed("fixed", true);
//};
//function dragged(d) {
//    d.fx = d3.event.x;
//    d.fy = d3.event.y;
//};
//function dragEnd(d) {
//    if (!d3.event.active) self.simulation.alphaTarget(0);
//    //d.fx = null;
//    //d.fy = null;
//};
//function release(d) {
//    d.fx = null;
//    d.fy = null;
//    d3.select(this)
//        .classed("fixed", false);
//};

  /**
  * Creates and activates nodes.
  * @param {Object} self Instance of a class.
  */
  createActivateNodes(self) {
    // Create nodes.
    // Create groups to contain elements for individual nodes.
    self.createNodesGroups(self);
    self.activateNodesGroups(self);
    // Create marks for individual nodes.
    self.createNodesMarks(self);
  }
  /**
  * Creates nodes's groups.
  * @param {Object} self Instance of a class.
  */
  createNodesGroups(self) {
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
    .classed("metabolite", function (element, index, nodes) {
      return element.type === "metabolite";
    })
    .classed("reaction", function (element, index, nodes) {
      return element.type === "reaction";
    })
    .classed("normal", function (element, index, nodes) {
      return !TopologyView.determineNodeEntitySelection({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
    })
    .classed("emphasis", function (element, index, nodes) {
      return TopologyView.determineNodeEntitySelection({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
    })
    .classed("anchor", function (element, index, nodes) {
      return ((element.fx !== null) && (element.fy !== null));
    });
  }
  /**
  * Activates nodes's groups.
  * @param {Object} self Instance of a class.
  */
  activateNodesGroups(self) {
    // Activate behavior.
    self.nodesGroups.on("click", function (element, index, nodes) {
      // Call action.
      Action.changeEntitySelection({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
    });
    self.nodesGroups.on("mouseenter", function (element, index, nodes) {
      // Select element.
      var node = nodes[index];
      var nodeSelection = d3.select(node);
      // Determine whether node's entity has a selection.
      var selection = TopologyView.determineNodeEntitySelection({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });

      // Write new function in View container to translate coordinates for tip and prompt...
      // containerWidth (use to determine left/right side)
      // containerHeight (use to determine top/bottom side)
      // horizontalPosition (use to determine left/right side)
      // verticalPosition (use to determine top/bottom side)
      // horizontalShift (either 15 for cursor or node's width)
      // verticalShift (similar)

      if (selection) {
        // Determine dimensions and positions.
        var dimensionsPositions = TopologyView
        .determineNodeDimensionsPositions({
          node: node,
          windowReference: self.window
        });


        // Create stationary tip.
        // Create tip.

        // TODO: Maybe split up "createTipSummary" and "createTip"


        TopologyView.createTip({
          identifier: element.identifier,
          type: element.type,
          containerWidth: 20,
          horizontalPosition: horizontalPosition,
          verticalPosition: verticalPosition,
          horizontalShift: horizontalShift,
          verticalShift: verticalShift,
          positionX: positionX,
          positionY: positionY,
          tipView: self.tipView,
          documentReference: self.document,
          state: self.state
        });
        // Create prompt's abbreviation.

      } else {
        // Create mobile tip.
        // Determine cursor's positions.
        //.clientX
        //.clientY
        var positionX = d3.mouse(self.view)[0];
        var positionY = d3.mouse(self.view)[1];
        // Create tip.
        TopologyView.createTip({
          identifier: element.identifier,
          type: element.type,
          positionX: positionX,
          positionY: positionY,
          tipView: self.tipView,
          documentReference: self.document,
          state: self.state
        });
      }

      // TODO: Behavior should differ dependent on whether node has class emphasis (meaning its selected)
      // TODO: Activate on click behavior to change entity selection state variable.

    });
    self.nodesGroups.on("mousemove", function (element, index, nodes) {
      // Determine cursor's positions.
      var positionX = d3.mouse(self.view)[0];
      var positionY = d3.mouse(self.view)[1];
      // Call action.
      TopologyView.createTip({
        identifier: element.identifier,
        type: element.type,
        positionX: positionX,
        positionY: positionY,
        tipView: self.tipView,
        documentReference: self.document,
        state: self.state
      });
    });
    self.nodesGroups.on("mouseleave", function (element, index, nodes) {
      // Select element.
      var node = nodes[index];
      var nodeSelection = d3.select(node);
      // Call action.
      self.tipView.clearView(self.tipView);
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
    nodesMarksMetabolites.attr("rx", function (element, index, nodes) {
      var node = TopologyView.accessNode({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
      if (node.replication) {
        return (self.metaboliteNodeWidth / 3);
      } else {
        return self.metaboliteNodeWidth;
      }
    });
    nodesMarksMetabolites.attr("ry", function (element, index, nodes) {
      var node = TopologyView.accessNode({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
      if (node.replication) {
        return (self.metaboliteNodeHeight / 3);
      } else {
        return self.metaboliteNodeHeight;
      }
    });
    // Set dimensions of reactions' nodes.
    self.reactionNodeWidth = self.scaleNodeDimension * 2.5;
    self.reactionNodeHeight = self.scaleNodeDimension * 0.75;
    var nodesMarksReactions = nodesMarks
    .filter(function (element, index, nodes) {
      return element.type === "reaction";
    });
    nodesMarksReactions
    .classed("supplement", function (element, index, nodes) {
      // Access information.
      var node = self.state.networkNodesReactions[element.identifier];
      var candidate = self.state.candidatesReactions[node.candidate];
      return candidate.supplement;
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

  // TODO: Probably call this "restoreNetworkDiagramPositions" or something.
  // TODO: I want to be able to call this method conveniently to re-initiate
  // TODO: simulations when I drag a node and that sort of thing.
  // TODO: I should only need to re-initiate the force simulation for drags...
  // TODO: I can probably just call self.simulation.restart();
  // TODO: No need to re-define the simulation after I've already defined it.

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
    .range([0.02, 0.02, 0.02, 0.02, 0.025, 0.025, 0.03]);
    // Define scale for velocity decay rate in force simulation.
    // Domain's unit is count of nodes.
    // Range's unit is arbitrary for decay rates.
    //domain: range
    //0-100: 0.2
    //100-500: 0.2
    //500-1000: 0.2
    //1000-2500: 0.2
    //2500-5000: 0.25
    //5000-10000: 0.3
    //10000-1000000: 0.3
    var velocityDecayScale = d3
    .scaleThreshold()
    .domain(domainCounts)
    .range([0.2, 0.2, 0.2, 0.2, 0.25, 0.3, 0.3]);
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
          var node = TopologyView.accessNode({
            identifier: element.identifier,
            type: element.type,
            state: self.state
          });
          if (node.replication) {
            return (self.metaboliteNodeWidth / 3);
          } else {
            return self.metaboliteNodeWidth;
          }
        } else if (element.type === "reaction") {
          return self.reactionNodeWidth;
        }
      })
      .strength(0.7)
      .iterations(1)
    )
    .force("charge", d3.forceManyBody()
      .theta(0.3)
      .strength(function (element, index, nodes) {
        if (element.type === "metabolite") {
          var node = TopologyView.accessNode({
            identifier: element.identifier,
            type: element.type,
            state: self.state
          });
          if (node.replication) {
            return -1;
          } else {
            return -500;
          }
        } else if (element.type === "reaction") {
          return -500;
        }
      })
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
        var link = TopologyView.accessLink({
          identifier: element.identifier,
          state: self.state
        });
        if (link.replication) {
          // Link is for a replicate node.
          return (self.metaboliteNodeWidth * 0.1);
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
    self.nodesGroups.attr("transform", function (element, index, nodes) {
      // Constrain nodes' positions according to dimensions of graphical
      // container.
      element.x = Math
      .max(radius, Math.min(self.graphWidth - radius, element.x));
      element.y = Math
      .max(radius, Math.min(self.graphHeight - radius, element.y));
      // Determine coordinates for nodes' marks from results of simulation in
      // nodes' records.
      return "translate(" + element.x + "," + element.y + ")";
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
      var candidate = self.state.candidatesReactions[node.candidate];
      var reaction = self.state.reactions[candidate.reaction];
      // Collect identifiers of metabolites' nodes that surround the reaction's
      // node.
      var neighbors = Traversal.collectNodeNeighbors({
        focus: reactionNode.identifier,
        direction: "neighbors",
        omissionNodes: [],
        omissionLinks: [],
        links: self.linksRecords
      });
      // Determine the roles in which metabolites participate in the reaction.
      // Reaction's store information about metabolites' participation.
      // Metabolites can participate in multiple reactions.
      var neighborsRoles = TopologyView.sortMetabolitesNodesReactionRoles({
        identifiers: neighbors,
        participants: reaction.participants,
        networkNodesmetabolites: self.state.networkNodesMetabolites,
        candidatesMetabolites: self.state.candidatesMetabolites
      });
      // Collect records for nodes of metabolites that participate in the
      // reaction in each role.
      var reactantsNodes = General.filterArrayRecordsByIdentifiers(
        neighborsRoles.reactants, metabolitesNodes
      );
      var productsNodes = General.filterArrayRecordsByIdentifiers(
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
        candidatesReactions: self.state.candidatesReactions,
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
        candidatesReactions: self.state.candidatesReactions,
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
        var candidate = self.state.candidatesMetabolites[node.candidate];
        var name = candidate.name;
      } else if (element.type === "reaction") {
        // Access information.
        var node = self.state.networkNodesReactions[element.identifier];
        var candidate = self.state.candidatesReactions[node.candidate];
        var name = candidate.name;
      }
      return (name.slice(0, 5) + "...");
    });
    // Determine size of font for annotations of network's elements.
    nodesLabels.attr("font-size", self.scaleFont + "px");
  }

  // TODO: Consider creating a new class, TopologyViewUtility to store the static
  // TODO: methods with utility to TopologyView...

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
  * Determines whether a node's entity has a selection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of entity, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  * @returns {boolean} Whether the node's entity has a selection.
  */
  static determineNodeEntitySelection({identifier, type, state} = {}) {
    return (
      (type === state.entitySelection.type) &&
      (identifier === state.entitySelection.node)
    );
  }
  /**
  * Creates tip.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of entity, metabolite or reaction.
  * @param {number} parameters.positionX Pointer's horizontal coordinate.
  * @param {number} parameters.positionY Pointer's vertical coordinate.
  * @param {Object} parameters.tipView Instance of TipView's class.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  static createTip({identifier, type, positionX, positionY, tipView, documentReference, state} = {}) {
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
    tipView.restoreView({
      visibility: true,
      positionX: positionX,
      positionY: positionY,
      content: summary,
      self: tipView
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
    var candidate = state.candidatesMetabolites[node.candidate];
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
    var candidate = state.candidatesReactions[node.candidate];
    var reaction = state.reactions[candidate.reaction];
    var replicates = [].concat(reaction.identifier, candidate.replicates);
    // Collect consensus properties of replicates.
    var properties = Evaluation.collectReplicateReactionsConsensusProperties({
      identifiers: replicates,
      reactions: state.reactions,
      metabolites: state.metabolites,
      reactionsSets: state.filterSetsReactions,
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
  * @param {Object<Object>} parameters.candidatesMetabolites Information about
  * candidate metabolites.
  * @returns {Object<Array<string>>} Identifiers of nodes for metabolites that
  * participate in a reaction either as reactants or products.
  */
  static sortMetabolitesNodesReactionRoles({identifiers, participants, networkNodesMetabolites, candidatesMetabolites} = {}) {
    // Initialize a collection of metabolites' nodes by roles in a reaction.
    var initialCollection = {
      reactants: [],
      products: []
    };
    // Iterate on identifiers for metabolites' nodes.
    return identifiers.reduce(function (collection, identifier) {
      // Access information.
      var node = networkNodesMetabolites[identifier];
      var candidate = candidatesMetabolites[node.candidate];
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
  * @param {Object<Object>} parameters.candidatesReactions Information about
  * candidate reactions.
  * @param {Object<Object>} parameters.reactions Information about reactions.
  * @returns {string} Type of graphical element to represet direction of a
  * reaction's node.
  */
  static determineDirectionalMarkType({side, reactionNode, networkNodesReactions, candidatesReactions, reactions} = {}) {
    // Access information.
    var node = networkNodesReactions[reactionNode.identifier];
    var candidate = candidatesReactions[node.candidate];
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
  /**
  * Determines dimensions and positions for a node.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.node Reference to node's element.
  * @param {Object} parameters.windowReference Referece to view of browser's
  * window.
  * @returns {Object<number>} Dimensions and positions.
  */
  static determineNodeDimensionsPositions({node, windowReference} = {}) {
    var nodeDimensions = node.getBoundingClientRect();
    var horizontalPosition = (
      nodeDimensions.left + (nodeDimensions.width / 2)
    );
    var verticalPosition = (
      nodeDimensions.top + (nodeDimensions.height / 2)
    );
    var horizontalShift = (nodeDimensions.width / 2);
    var verticalShift = (nodeDimensions.height / 2);
    return View.determineTipPrompPositions({
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      horizontalShift: horizontalShift,
      verticalShift: verticalShift,
      viewWidth: viewWidth,
      viewHeight: viewHeight
    });
  }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
