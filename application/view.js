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
  * Creates or sets reference to a view's container.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of element.
  * @param {string} parameters.parent Identifier of parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createReferenceContainer({identifier, parent, documentReference} = {}) {
    // Select parent element of view's container element in document.
    var parent = documentReference.getElementById(parent);
    // Determine whether view's container exists in the document.
    if (!documentReference.getElementById(identifier)) {
      // View's container does not exist in the document.
      // Create view's container.
      var container = documentReference.createElement("div");
      parent.appendChild(container);
      container.setAttribute("id", identifier);
    } else {
      // View's container exists in the document.
      // Set reference to view's container.
      var container = documentReference.getElementById(identifier);
    }
    return container;
  }
  /**
  * Creates a button with a label.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.label Label for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createButton({label, parent, documentReference} = {}) {
    var button = documentReference.createElement("button");
    parent.appendChild(button);
    button.textContent = label;
    return button;
  }
  /**
  * Creates a radio button with a label.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier for element.
  * @param {string} parameters.value Value for element.
  * @param {string} parameters.name Name for element's group.
  * @param {string} parameters.className Class for element.
  * @param {string} parameters.label Label for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createRadioButtonLabel({identifier, value, name, className, label, parent, documentReference} = {}) {
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
      label: label,
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
  * @param {string} parameters.label Label for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createCheckLabel({identifier, value, className, label, parent, documentReference} = {}) {
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
      label: label,
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
  * @param {string} parameters.label Label for element.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @returns {Object} Reference to element.
  */
  static createLabel({identifier, label, parent, documentReference} = {}) {
    // Create element.
    var labelReference = documentReference.createElement("label");
    parent.appendChild(labelReference);
    labelReference.setAttribute("for", identifier);
    labelReference.textContent = label;
    // Return reference to element.
    return labelReference;
  }
  /**
  * Creates a scalable vector graphical container.
  * @param {Object} documentReference Reference to document object model.
  * @returns {Object} Reference to element.
  */
  static createGraph(documentReference) {
    // Create graph.
    var graph = documentReference
    .createElementNS("http://www.w3.org/2000/svg", "svg");
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
}

// Control view and views within control view.

/**
* Interface to contain other interfaces for controls.
*/
class ControlView {
  /**
  * Initializes an instance of a class.
  * @param {Array<string>} contents Identifiers of contents within view.
  * @param {Object} state Application's state.
  */
  constructor (contents, state) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
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
    // Create or set reference to view's container.
    self.container = View.createReferenceContainer({
      identifier: "control",
      parent: "view",
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
    General.filterRemoveDocumentElements({
      values: self.contents,
      attribute: "id",
      elements: self.container.children
    });
  }
}
/**
* Interface for controls to load and save application's state.
*/
class StateView {
  /**
  * Initializes an instance of a class.
  * @param {Object} state Application's state.
  */
  constructor (state) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
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
    // Create or set reference to view's container.
    self.container = View.createReferenceContainer({
      identifier: "state",
      parent: "control",
      documentReference: self.document
    });
    // Determine whether the view's container is empty.
    if (self.container.children.length === 0) {
      // View's container is empty.
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
        label: "save",
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
        label: "load",
        parent: self.container,
        documentReference: self.document
      });
      self.load.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        self.fileSelector.click();
      });
      self.restore = View.createButton({
        label: "restore",
        parent: self.container,
        documentReference: self.document
      });
      self.restore.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        Action.evaluateLoadSource(self.state);
      });
      self.execute = View.createButton({
        label: "execute",
        parent: self.container,
        documentReference: self.document
      });
      self.execute.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        Action.executeTemporaryProcedure(self.state);
      });
    } else {
      // View's container is not empty.
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

/**
* Interface for sets of entities.
*/
class SetView {
  /**
  * Initializes an instance of a class.
  * @param {Object} state Application's state.
  */
  constructor (state) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
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
    // Create or set reference to view's container.
    self.container = View.createReferenceContainer({
      identifier: "set",
      parent: "control",
      documentReference: self.document
    });
    // Determine whether the view's container is empty.
    if (self.container.children.length === 0) {
      // View's container is empty.
      // Create view's invariant elements.
      // Activate invariant behavior of view's elements.
      // Create title.
      self.createTitle(self);
      // Create and activate controls for type of entities.
      self.createActivateEntitiesControl("metabolites", self);
      self.createActivateEntitiesControl("reactions", self);
      // Create and activate control for filter.
      self.createActivateFilterControl(self);
      // Create and activate restore.
      self.createActivateRestore(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create menu for sets by processes.
      new SetMenuView("processes", self.state);
      // Create menu for sets by compartments.
      new SetMenuView("compartments", self.state);
    } else {
      // View's container is not empty.
      // Set references to view's variant elements.
      // Control for type of entities.
      self.metabolites = self
      .document.getElementById("set-metabolites");
      self.reactions = self
      .document.getElementById("set-reactions");
      // Control for filter.
      self.filter = self.document.getElementById("set-filter");
    }
  }
  /**
  * Creates a title.
  * @param {Object} self Instance of a class.
  */
  createTitle(self) {
    // Create title.
    var title = self.document.createElement("div");
    self.container.appendChild(title);
    title.classList.add("title");
    title.textContent = "Set";
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
      label: entities,
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
      label: "filter",
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
  * Creates and activates a button to restore the menu.
  * @param {Object} self Instance of a class.
  */
  createActivateRestore(self) {
    // Create button for restoration.
    var restore = View.createButton({
      label: "restore",
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    restore.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
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
    self.metabolites.checked = SetView
    .determineEntityMatch("metabolites", self.state);
    self.reactions.checked = SetView
    .determineEntityMatch("reactions", self.state);
    self.filter.checked = SetView.determineFilter(self.state);
    // Create menu for sets by processes.
    new SetMenuView("processes", self.state);
    // Create menu for sets by compartments.
    new SetMenuView("compartments", self.state);
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
* Interface for menu of sets of entities.
*/
class SetMenuView {
  /**
  * Initializes an instance of a class.
  * @param {string} category Name of category.
  * @param {Object} state Application's state.
  */
  constructor (category, state) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Set reference to type of sets.
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
    // Create or set reference to view's container.
    self.container = View.createReferenceContainer({
      identifier: "set-" + self.category + "-menu",
      parent: "set",
      documentReference: self.document
    });
    // Determine whether the view's container is empty.
    if (self.container.children.length === 0) {
      // View's container is empty.
      // Create view's invariant elements.
      // Activate invariant behavior of view's elements.
      self.container.classList.add("menu");
      // Create title.
      self.createTitle(self);
      // Create search.
      self.createActivateSearch(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create table.
      self.createActivateTable(self);
    } else {
      // View's container is not empty.
      // Set references to view's variant elements.
      // Sets' search.
      self.search = self.container.querySelector("input.search");
      // Sets' sorts.
      self.nameSort = self
      .container.querySelector("table thead tr th.name svg.sort");
      self.countSort = self
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
  * Creates a title.
  * @param {Object} self Instance of a class.
  */
  createTitle(self) {
    // Create title.
    var title = self.document.createElement("span");
    self.container.appendChild(title);
    title.classList.add("title");
    title.textContent = self.category + ": ";
  }
  /**
  * Creates and activates a search.
  * @param {Object} self Instance of a class.
  */
  createActivateSearch(self) {
    // Create tool for search.
    self.search = self.document.createElement("input");
    self.container.appendChild(self.search);
    self.search.setAttribute("type", "text");
    self.search.classList.add("search");
    self.search.setAttribute("placeholder", "search...");
    // Activate behavior.
    self.search.addEventListener("input", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine the search's value.
      var value = event.currentTarget.value;
      // Call action.
      Action.changeSetsSearches({
        category: self.category,
        string: value,
        state: self.state
      });
    });
  }
  /**
  * Creates and activates a table.
  * @param {Object} self Instance of a class.
  */
  createActivateTable(self) {
    // Create separate tables for head and body to support stationary head and
    // scrollable body.
    // Create head table.
    var headTable = self.document.createElement("table");
    self.container.appendChild(headTable);
    // Create head table's header.
    var tableHead = self.document.createElement("thead");
    headTable.appendChild(tableHead);
    var tableHeadRow = self.document.createElement("tr");
    tableHead.appendChild(tableHeadRow);
    // Create titles, sorts, and scale in table's header.
    // Create header for sets' names.
    var tableHeadRowCellName = self.document.createElement("th");
    tableHeadRow.appendChild(tableHeadRowCellName);
    tableHeadRowCellName.classList.add("name");
    self.createActivateTableColumnHead({
      title: "Name",
      attribute: "name",
      parent: tableHeadRowCellName,
      self: self
    });
    // Create header for sets' counts.
    self.tableHeadRowCellCount = self.document.createElement("th");
    tableHeadRow.appendChild(self.tableHeadRowCellCount);
    self.tableHeadRowCellCount.classList.add("count");
    self.createActivateTableColumnHead({
      title: "Count",
      attribute: "count",
      parent: self.tableHeadRowCellCount,
      self: self
    });
    // Create break.
    self.tableHeadRowCellCount.appendChild(self.document.createElement("br"));
    // Create graphical container for scale.
    self.scaleGraph = self
    .document.createElementNS("http://www.w3.org/2000/svg", "svg");
    self.tableHeadRowCellCount.appendChild(self.scaleGraph);
    self.scaleGraph.classList.add("scale");
    // Determine graphs' dimensions.
    self.graphWidth = General
    .determineElementDimension(self.scaleGraph, "width");
    self.graphHeight = General
    .determineElementDimension(self.scaleGraph, "height");
    // Create body table.
    var bodyTableContainer = self.document.createElement("div");
    self.container.appendChild(bodyTableContainer);
    bodyTableContainer.classList.add("scroll");
    var bodyTable = self.document.createElement("table");
    bodyTableContainer.appendChild(bodyTable);
    // Create body table's body.
    self.body = self.document.createElement("tbody");
    bodyTable.appendChild(self.body);
  }
  /**
  * Creates and activates a title and sort.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.title Title for column head.
  * @param {string} parameters.attribute Name of sets' attribute.
  * @param {Object} parameters.parent Reference to parent element.
  * @param {Object} parameters.self Instance of a class.
  */
  createActivateTableColumnHead({title, attribute, parent, self} = {}) {
    // Create elements.
    var container = self.document.createElement("span");
    parent.appendChild(container);
    container.textContent = title;
    container.classList.add("title");
    var reference = attribute + "Sort";
    self[reference] = self
    .document.createElementNS("http://www.w3.org/2000/svg", "svg");
    container.appendChild(self[reference]);
    self[reference].classList.add("sort");
    // Activate behavior.
    container.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      Action.changeSetsSorts({
        category: self.category,
        criterion: attribute,
        state: self.state
      });
    });
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    self.representSearch(self);
    self.representSetsSorts(self);
    self.createScale(self);
    self.representScale(self);
    self.createActivateSetsSummaries(self);
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
  * Represents specifications to sort sets' summaries.
  * @param {Object} self Instance of a class.
  */
  representSetsSorts(self) {
    self.representSetsSort({
      graph: self.nameSort,
      attribute: self.category,
      criterion: "name",
      self: self
    });
    self.representSetsSort({
      graph: self.countSort,
      attribute: self.category,
      criterion: "count",
      self: self
    });
  }
  /**
  * Represents specifications to sort sets' summaries.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.graph Reference to graphical container.
  * @param {string} parameters.attribute Name of sets' attribute.
  * @param {string} parameters.criterion Criterion for sort.
  * @param {Object} parameters.self Instance of a class.
  */
  representSetsSort({graph, attribute, criterion, self} = {}) {
    // Determine whether the criterion defines the sort for the attribute's
    // sets.
    if (self.state.setsSorts[attribute].criterion === criterion) {
      // The criterion defines the sort.
      // Determine the sort order.
      if (self.state.setsSorts[attribute].order === "ascend") {
        // Sort is in ascending order.
        var orientation = "up";
      } else if (self.state.setsSorts[attribute].order === "descend") {
        // Sort is in descending order.
        var orientation = "down";
      }
      // Determine whether the graphical container contains a polygon.
      if (graph.getElementsByTagName("polygon").length === 0) {
        // Graphical container does not contain a polygon.
        // Create polygon.
        var mark = self
        .document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        graph.appendChild(mark);
      } else {
        // Graphical container contains a polygon.
        // Set reference to polygon.
        var mark = graph.getElementsByTagName("polygon").item(0);
      }
      var base = 10;
      var altitude = 10;
      // Determine
      var points = General.createIsoscelesTrianglePoints({
        base: base,
        altitude: altitude,
        orientation: orientation
      });
      mark.setAttribute("points", points);
      // Determine the dimensions of the graphical container.
      var width = General.determineElementDimension(graph, "width");
      var height = General.determineElementDimension(graph, "height");
      var x = (width / 2) - (base / 2);
      var y = (height / 2);
      mark.setAttribute("transform", "translate(" + x + "," + y + ")");
    } else {
      // The criterion does not define the sort.
      // Remove any marks for the criterion.
      General.removeDocumentChildren(graph);
    }
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
    .range([5, (self.graphWidth * 0.8)])
    .nice(2);
  }
  /**
  * Represents scale.
  * @param {Object} self Instance of a class.
  */
  representScale(self) {
    // Remove contents of scale's container.
    General.removeDocumentChildren(self.scaleGraph);
    // Create scale's representation.
    var scaleSelection = d3.select(self.scaleGraph);
    var createAxis = d3.axisTop(self.determineScaleValue).ticks(2);
    var axisGroup = scaleSelection.append("g").call(createAxis);
    // Assign attributes.
    axisGroup.attr("transform", "translate(0," + (self.graphHeight - 1) + ")");
  }
  /**
  * Creates and activates sets' summaries.
  * @param {Object} self Instance of a class.
  */
  createActivateSetsSummaries(self) {
    // Create and activate rows for sets's summaries.
    self.createActivateRows(self);
    // Create cells for sets' names and counts.
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
      // Call action.
      rowSelection.classed("normal", false);
      rowSelection.classed("emphasis", true);
    });
    self.rows.on("mouseleave", function (element, index, nodes) {
      // Select element.
      var row = nodes[index];
      var rowSelection = d3.select(row);
      // Call action.
      rowSelection.classed("emphasis", false);
      rowSelection.classed("normal", true);
    });
  }
  /**
  * Creates cells.
  * @param {Object} self Instance of a class.
  */
  createCells(self) {
    // Create cells for sets' names and counts.
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
    // Assign attributes to cells for sets' names.
    // Assign attributes to elements.
    // Select cells for sets' names.
    self.names = self.cells
    .filter(function (element, index, nodes) {
      return element.type === "name";
    });
    self.names
    .classed("name", true)
    .text(function (element, index, nodes) {
      return SetMenuView.accessAttributeValueName({
        attribute: element.attribute,
        value: element.value,
        state: self.state
      });
    });
  }
  /**
  * Represents sets' counts.
  * @param {Object} self Instance of a class.
  */
  representCounts(self) {
    // Assign attributes to cells for sets' counts.
    // Assign attributes to elements.
    // Select cells for sets' counts.
    self.counts = self.cells
    .filter(function (element, index, nodes) {
      return element.type === "count";
    });
    self.counts.classed("count", true);
    // Create graphs to represent sets' cardinalities.
    // It is possible to contain a graph's visual representations and textual
    // annotations within separate groups in order to segregate these within
    // separate layers.
    // This strategy avoids occlusion of textual annotations by visual
    // representations.
    // In these graphs, this occlusion is impossible, so a simpler structure is
    // preferrable.
    // Graph structure.
    // - graphs (scalable vector graphical container)
    // -- barGroups (group)
    // --- barTitles (title)
    // --- barMarks (rectangle)
    // --- barLabels (text) -- none in this case
    // Create graphs.
    // Define function to access data.
    function access(element, index, nodes) {
      return [element];
    };
    // Create children elements by association to data.
    var graphs = View.createElementsData({
      parent: self.counts,
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
      var x = self.determineScaleValue(0);
      var y = 0;
      return "translate(" + x + "," + y + ")";
    });
    // Create titles.
    // Create children elements by association to data.
    var barTitles = View.createElementsData({
      parent: barGroups,
      type: "title",
      accessor: access
    });
    // Assign attributes to elements.
    barTitles.text(function (element, index, nodes) {
      var name = SetMenuView.accessAttributeValueName({
        attribute: element.attribute,
        value: element.value,
        state: self.state
      });
      var message = (name + " (" + element.count + ")");
      return message;
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
    })
    .attr("width", function (element, index) {
      return self.determineScaleValue(element.count);
    })
    .attr("height", self.graphHeight);
  }
  /**
  * Accesses the name of a value of an attribute.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.attribute Name of an attribute.
  * @param {string} parameters.value Identifier of a value.
  * @param {Object} parameters.state Application's state.
  * @returns {string} Name of the value of the attribute.
  */
  static accessAttributeValueName({attribute, value, state} = {}) {
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


// Exploration view and views within exploration view.

/**
* Interface to contain other interfaces for exploration.
*/
class ExplorationView {
  /**
  * Initializes an instance of a class.
  * @param {Array<string>} contents Identifiers of contents within view.
  * @param {Object} state Application's state.
  */
  constructor (contents, state) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(contents, self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to view's container.
    self.container = View.createReferenceContainer({
      identifier: "exploration",
      parent: "view",
      documentReference: self.document
    });
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Array<string>} contents Identifiers of contents within view.
  * @param {Object} self Instance of a class.
  */
  restoreView(contents, self) {
    // Remove any extraneous content from view.
    General.filterRemoveDocumentElements({
      values: contents,
      attribute: "id",
      elements: self.container.children
    });
  }
}
/**
* Interface for communication of summary information about selections.
*/
class SummaryView {
  /**
  * Initializes an instance of a class.
  * @param {Object} state Application's state.
  */
  constructor (state) {
    // Set common references.
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.state = state;
    // Set reference to document object model (DOM).
    self.document = document;
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
    // Create or set reference to view's container.
    self.container = View.createReferenceContainer({
      identifier: "summary",
      parent: "exploration",
      documentReference: self.document
    });
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // TODO: This part should control the communication of summary info.
  }
}


////////////////////////////////////////////////////////////////////////////////


// TODO: Consider re-naming "PersistenceView" as "StateView" or something...
/**
* Interface to save and restore a persistent state of the application.
*/
class PersistenceView {
  /**
  * Initializes an instance of the class.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  constructor (model) {
    // Remove all contents of container.
    General.removeDocumentChildren(self.container);
    //
    // Create and activate button to restore application to initial state.
    self.restoration = self.document.createElement("button");
    self.container.appendChild(self.restoration);
    self.restoration.textContent = "Restore";
    self.restoration.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Restore application to initial state.
      Action.initializeApplication(self.model);
    });
    self.container.appendChild(self.document.createElement("br"));
    // Create and activate button to save current state of application.
    self.save = self.document.createElement("button");
    self.container.appendChild(self.save);
    self.save.textContent = "Save";
    self.save.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Save current state of application.
      Action.saveState(self.model);
    });
    self.container.appendChild(self.document.createElement("br"));
    // Create and activate button to execute temporary procedure during
    // development.
    self.procedure = self.document.createElement("button");
    self.container.appendChild(self.procedure);
    self.procedure.textContent = "Execute";
    self.procedure.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Execute temporary procedure for development.
      Action.executeTemporaryProcedure(self.model);
    });
    self.container.appendChild(self.document.createElement("br"));
  }
}

/**
* Interface to represent summary of sets of metabolic entities and to select
* filters for these entities.
*/
class SetViewOld {
  initializeSummaryMenu(view) {
    // Create elements that persist across interactive, dynamic changes to the
    // application's state.
    // Activate behavior that is consistent across interactive, dynamic changes
    // to the application's state.
    // Determine whether the summary's menu already exists within the view.
    if (!self.container.getElementsByTagName("table").item(0)) {
    } else {
      // Interface's container includes a table element.
      // Establish references to existing elements.
      // References are only necessary for elements that vary with changes to
      // the application's state.
      self.table = self.container.getElementsByTagName("table").item(0);
      self.tableHead = self.container.getElementsByTagName("thead").item(0);
      self.tableHead = self.container.getElementsByTagName("thead").item(0);
      var tableHeadRow = self.tableHead.getElementsByTagName("tr").item(0);
      self.tableHeadRowCellValue = tableHeadRow
      .getElementsByClassName("value").item(0);
      self.compartmentalizationControl = self
      .document.getElementById("compartmentalization");
      self.tableBody = self.container.getElementsByTagName("tbody").item(0);
    }
  }


  // TODO: I need to move the compartmentalization control...
  /**
  * Creates and activates control to select whether to represent
  * compartmentalization in the network.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateCompartmentalizationControl(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and activate control for compartmentalization.
    var identifier = "compartmentalization";
    self.compartmentalizationControl = self.document.createElement("input");
    self.tableHeadRowCellValue.appendChild(self.compartmentalizationControl);
    self.compartmentalizationControl.setAttribute("id", identifier);
    self.compartmentalizationControl.setAttribute("type", "checkbox");
    self
    .compartmentalizationControl.setAttribute("value", "compartmentalization");
    self
    .compartmentalizationControl.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Change current selection of filter in application's state.
      Action.changeCompartmentalization(self.model);
    });
    var compartmentalizationLabel = self.document.createElement("label");
    self.tableHeadRowCellValue.appendChild(compartmentalizationLabel);
    compartmentalizationLabel.setAttribute("for", identifier);
    compartmentalizationLabel.textContent = "compartmentalization";
  }


  /**
  * Creates and activates cells for data's attributes in body of summary table.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateSummaryBodyCellsAttributes(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Select cells for data's attributes.
    self.tableBodyCellsAttributes = self
    .tableBodyCells.filter(function (data, index) {
      return data.type === "attribute";
    });
    // Assign attributes to cells for attributes.
    self.tableBodyCellsAttributes.classed("attribute", true);
    // Create labels.
    var dataLabels = self
    .tableBodyCellsAttributes.selectAll("div")
    .filter(".label")
    .data(function (element, index, nodes) {
      return [element];
    });
    dataLabels.exit().remove();
    var novelLabels = dataLabels.enter().append("div");
    var labels = novelLabels.merge(dataLabels);
    // Assign attributes.
    labels
    .classed("label", true)
    .text(function (element, index, nodes) {
      return element.attribute;
    });

    // Activate behavior.
    self.activateSummaryBodyCellsAttributes(self);
  }
  /**
  * Activates cells for data's attributes in body of summary
  * table.
  * @param {Object} view Instance of interface's current view.
  */
  activateSummaryBodyCellsAttributes(view) {
    // Set reference to class' current instance to transfer across changes in
    // scope.
    var self = view;
  }




  /**
  * Creates and activates cells for data's values in body of summary table.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateSummaryBodyCellsValues(view) {

    // Assign attributes.
    self.tableBodyCellsValuesGraphBarGroups
    .classed("group", true)
    .attr("transform", function (element, index) {
      // Determine scale between value and graph's dimension.
      var scale = d3
      .scaleLinear()
      .domain([0, element.total])
      .range([0, self.graphWidth]);
      var x = scale(element.base);
      var y = 0;
      return "translate(" + x + "," + y + ")";
    });


    // Activate cells for data's values.
    self.activateSummaryBodyCellsValues(self);
  }
  /**
  * Activates cells for data's values in body of summary table.
  * @param {Object} view Instance of interface's current view.
  */
  activateSummaryBodyCellsValues(view) {
    // Set reference to class' current instance to transfer across changes in
    // scope.
    var self = view;
    // Remove any existing event listeners and handlers from bars.
    self.tableBodyCellsValuesGraphBarGroups.on("click", null);
    // Assign event listeners and handlers to bars.
    self.tableBodyCellsValuesGraphBarGroups
    .on("click", function (data, index, nodes) {
      // Submit selection of attribute's value.
      Action.selectSetsAttributeValue({
        value: data.value,
        attribute: data.attribute,
        model: self.model
      });
    });
  }
  /**
  * Determines the current selection in the application's state of whether to
  * represent compartmentalization in the network.
  * @param {Object} view Instance of interface's current view.
  */
  determineCompartmentalization(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    return self.model.compartmentalization;
  }
}

// TODO: EntityView should give information about counts of metabolites and
// TODO: reactions in current selection (pass filters from SetView).
// TODO: EntityView should display controls to define network:
// TODO: compartmentalization, replications, submit button (since it takes a while).
// TODO: Don't worry about giving any sort of warning about size threshold...
// TODO: just tell the user counts of metabolites and reactions and let user
// TODO: initiate assembly.
/**
* Interface to control network's assembly, selection, and visual
* representation.
*/
class AssemblyView {
  /**
  * Initializes an instance of the class.
  * @param {Object} model Model of the application's comprehensive state.
  */
  constructor (model) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = this;
    // Set reference to model of application's state.
    self.model = model;
    // Set reference to document object model (DOM).
    self.document = document;
    // Initialize container for interface.
    //self.initializeContainer(self);
    // Initialize interface for control of network's assembly.
    //self.initializeAssemblyControls(self);
    // Restore interface for control of network's assembly.
    //self.restoreAssemblyControls(self);
  }
  /**
  * Initializes the container for the interface.
  * @param {Object} view Instance of interface's current view.
  */
  initializeContainer(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and set references to elements for interface.
    // Select view in document object model.
    self.view = self.document.getElementById("view");
    // Remove any extraneous content within view.
    // Initialization of the persistence view already removes extraneous
    // content from view.
    General.filterRemoveDocumentElements({
      values: ["top", "bottom"],
      attribute: "id",
      elements: self.view.children
    });
    // Create container for interfaces within bottom of view.
    if (!self.document.getElementById("bottom")) {
      self.bottom = self.document.createElement("div");
      self.view.appendChild(self.bottom);
      self.bottom.setAttribute("id", "bottom");
    } else {
      self.bottom = self.document.getElementById("bottom");
    }
    // Remove any extraneous content within bottom.
    General.filterRemoveDocumentElements({
      values: ["control", "topology"],
      attribute: "id",
      elements: self.bottom.children
    });
    // Create container for interfaces that control network's assembly and
    // visual representation.
    if (!self.document.getElementById("control")) {
      self.control = self.document.createElement("div");
      self.bottom.appendChild(self.control);
      self.control.setAttribute("id", "control");
    } else {
      self.control = self.document.getElementById("control");
    }
    // Remove any extraneous content within control view.
    General.filterRemoveDocumentElements({
      values: ["assembly", "traversal"],
      attribute: "id",
      elements: self.control.children
    });
    // Create container for interface within control view.
    // Set reference to current interface's container.
    if (!self.document.getElementById("assembly")) {
      self.container = self.document.createElement("div");
      self.control.appendChild(self.container);
      self.container.setAttribute("id", "assembly");
    } else {
      self.container = self.document.getElementById("assembly");
    }
  }
  /**
  * Initializes the interface for control of network's assembly.
  * Creates new elements that do not exist and do not vary with data.
  * Sets references to elements that already exist.
  * @param {Object} view Instance of interface's current view.
  */
  initializeAssemblyControls(view) {
    // Preserve reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // As their actions do not change and they have access to the dynamic model,
    // it is only necessary to define event handlers upon initialization of
    // control elements.
    // Create and set references to elements for interface.
    // Initialize interface.
    if (!self.container.hasChildNodes()) {
      // Interface's container does not include child elements for control
      // of network's assembly.
      // Create interface.
      // Create and activate reset button.
      self.createActivateReset(self);
      // Create and activate assemble button.
      self.createActivateAssemble(self);
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate compartmentalization selector.
      self.createActivateCompartmentalizationSelector(self);
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate simplification control.
      // TODO: Create and activate simplification control.
      // Create and activate menu for simplification candidates.
      // TODO: Create summary candidates menu...
      if (false) {
        // Initialize interface to summarize and modify replications for
        // network's assembly.
        self.initializeReplicationInterface(self);
      }
    } else {
      // Interface's container includes child elements for control of
      // network's assembly.
      // Set references to existing elements.
      // References are only necessary for elements that depend on the
      // application's state in order to restore these as the state
      // changes.
      self.compartmentalizationSelector = self
      .document.getElementById("compartmentalization");
      if (false) {
        self.replication = self
        .document.getElementById("assembly-replication");
        self.currentReplications = self
        .document.getElementById("assembly-replication-current");
        self.replicationTableBody = self
        .currentReplications.getElementsByTagName("tbody").item(0);
        self.novelReplications = self
        .document.getElementById("assembly-replication-novel");
        self.replicationOptions = self
        .novelReplications.getElementsByTagName("datalist").item(0);
        self.replicationSearch = self
        .novelReplications.getElementsByTagName("input").item(0);
      }
    }
  }
  /**
  * Creates and activates button to restore controls for network's assembly
  * to initial state.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateReset(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and activate button to restore controls for network's assembly
    // to initial state.
    self.reset = self.document.createElement("button");
    self.container.appendChild(self.reset);
    self.reset.textContent = "reset";
    self.reset.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Restore controls for network's assembly to initial state.
      Action.restoreNetworkAssembly(self.model);
    });
  }
  /**
  * Creates and activates button to assemble network's nodes and links for
  * entity view.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateAssemble(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and activate button to assemble network's nodes and links.
    self.assemble = self.document.createElement("button");
    self.container.appendChild(self.assemble);
    self.assemble.textContent = "assemble";
    self.assemble.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Assemble network's nodes and links.
      Action.createNetwork(self.model);
    });
  }
  /**
  * Creates and activates selector for compartmentalization in the network's
  * assembly.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateCompartmentalizationSelector(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and activate compartmentalization selector.
    var identifier = "compartmentalization";
    self.compartmentalizationSelector = self.document.createElement("input");
    self.container.appendChild(self.compartmentalizationSelector);
    self.compartmentalizationSelector.setAttribute("id", identifier);
    self.compartmentalizationSelector.setAttribute("type", "checkbox");
    self
    .compartmentalizationSelector
    .setAttribute("value", "compartmentalization");
    self
    .compartmentalizationSelector
    .addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Change current selection of compartmentalization in
      // application's state.
      Action.changeCompartmentalization(self.model);
    });
    var label = self.document.createElement("label");
    self.container.appendChild(label);
    label.setAttribute("for", identifier);
    label.textContent = "compartmentalization";
  }
  /**
  * Initializes interface to summarize and modify replications for the
  * network's assembly.
  * Creates new elements that do not exist and do not vary with data.
  * @param {Object} view Instance of interface's current view.
  */
  initializeReplicationInterface(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create container for the replication interface.
    self.replication = self.document.createElement("div");
    self.container.appendChild(self.replication);
    self.replication.setAttribute("id", "assembly-replication");
    self.replication.textContent = "Replications";
    // Initialize summary of current replications.
    // Create container for the summary of current replications.
    self.currentReplications = self.document.createElement("div");
    self.replication.appendChild(self.currentReplications);
    self
    .currentReplications
    .setAttribute("id", "assembly-replication-current");
    // Create table for summary of current replications.
    var table = self.document.createElement("table");
    self.currentReplications.appendChild(table);
    var tableHead = self.document.createElement("thead");
    table.appendChild(tableHead);
    var tableHeadRow = self.document.createElement("tr");
    tableHead.appendChild(tableHeadRow);
    var tableHeadRowCellName = self.document.createElement("th");
    tableHeadRow.appendChild(tableHeadRowCellName);
    tableHeadRowCellName.textContent = "Name";
    var tableHeadRowCellRemove = self.document.createElement("th");
    tableHeadRow.appendChild(tableHeadRowCellRemove);
    tableHeadRowCellRemove.textContent = "Remove";
    self.replicationTableBody = self.document.createElement("tbody");
    table.appendChild(self.replicationTableBody);
    // Initialize menu to include new replications.
    // Create container for the menu for new replications.
    self.novelReplications = self.document.createElement("div");
    self.replication.appendChild(self.novelReplications);
    self
    .novelReplications
    .setAttribute("id", "assembly-replication-novel");
    // Create list for replication options.
    var listIdentifier = "assembly-replication-options";
    self.replicationOptions = self.document.createElement("datalist");
    self.novelReplications.appendChild(self.replicationOptions);
    self.replicationOptions.setAttribute("id", listIdentifier);
    // Create search menu.
    // Attribute "minlength" of input element does not make the drop-down
    // list of options wait for at least the minimal length of characters.
    self.replicationSearch = self.document.createElement("input");
    self.novelReplications.appendChild(self.replicationSearch);
    self.replicationSearch.setAttribute("type", "search");
    self.replicationSearch.setAttribute("autocomplete", "off");
    self.replicationSearch.setAttribute("list", listIdentifier);
    self
    .replicationSearch
    .setAttribute("placeholder", "new replication...");
    self.replicationSearch.setAttribute("size", "20");
    // Activate search menu.
    self.replicationSearch.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Event originates on search menu, not on datalist's options.
      // Search menu's value is the prospective name of a novel metabolite
      // to include in replications.
      // Include metabolite in replications.
      Action.includeNovelReplication({
        name: event.currentTarget.value,
        model: self.model
      });
    });
  }
  /**
  * Restores the interface for control of network's assembly.
  * @param {Object} view Instance of interface's current view.
  */
  restoreAssemblyControls(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Restore compartmentalization selector according to application's
    // state.
    self.compartmentalizationSelector.checked = self
    .determineCompartmentalization(self);
    if (false) {
      // Create and activate data-dependent summary of replications.
      self.createActivateReplicationsSummary(self);
      // Create and activate menu to include new replications.
      self.createNovelReplicationsMenu(self);
    }
  }
  /**
  * Creates and activates body of table for summary of current replications.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateReplicationsSummary(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Select summary table's body.
    var body = d3.select(self.replicationTableBody);
    // Append rows to table with association to data.
    var dataRows = body.selectAll("tr").data(self.model.replications);
    dataRows.exit().remove();
    var newRows = dataRows.enter().append("tr");
    var rows = newRows.merge(dataRows);
    // Append cells to table with association to data.
    var dataCells = rows.selectAll("td").data(function (element, index) {
      // Organize data for table cells in each row.
      return [].concat(
        {
          type: "name",
          value: element
        },
        {
          type: "removal",
          value: element
        }
      );
    });
    dataCells.exit().remove();
    var newCells = dataCells.enter().append("td");
    var cells = newCells.merge(dataCells);
    self.replicationsTableBodyCells = cells;
    // Cells for data's name.
    self.createCurrentReplicationsNames(self);
    // Cells for data's values.
    self.createActivateCurrentReplicationsRemovals(self);
  }
  /**
  * Creates cells for names of current replications.
  * @param {Object} view Instance of interface's current view.
  */
  createCurrentReplicationsNames(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Select cells for data's name.
    self.replicationTableBodyCellsNames = self
    .replicationsTableBodyCells.filter(function (data, index) {
      return data.type === "name";
    });
    // Assign attributes to cells for attributes.
    self.replicationTableBodyCellsNames.text(function (data) {
      return self.model.metabolites[data.value].name;
    });
  }
  /**
  * Creates and activates cells for removal of current replications.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateCurrentReplicationsRemovals(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Select cells for data's values.
    self.replicationTableBodyCellsRemovals = self
    .replicationsTableBodyCells.filter(function (data, index) {
      return data.type === "removal";
    });
    // Assign attributes to cells for removal.
    // Append buttons.
    var dataButtons = self.replicationTableBodyCellsRemovals
    .selectAll("button")
    .data(function (element, index) {
      return [element];
    });
    dataButtons.exit().remove();
    var newButtons = dataButtons.enter().append("button");
    var buttons = newButtons.merge(dataButtons);
    // Assign attributes to buttons.
    buttons.text(function (data) {
      return "x";
    });
    // Assign position and dimension to rectangles.
    // Activate buttons.
    // Assign event listeners and handlers to bars.
    buttons.on("click", function (data, index, nodes) {
      Action.removeCurrentReplication({
        identifier: data.value,
        model: self.model
      });
    });
  }
  /**
  * Creates menu to include novel replications.
  * @param {Object} view Instance of interface's current view.
  */
  createNovelReplicationsMenu(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Restore search menu to empty value.
    self.replicationSearch.value = "";
    // Select list for replication options.
    var list = d3.select(self.replicationOptions);
    // Append options to list with association to data.
    var dataOptions = list
    .selectAll("option").data(self.model.currentMetabolites);
    dataOptions.exit().remove();
    var newOptions = dataOptions.enter().append("option");
    var options = newOptions.merge(dataOptions);
    // Set attributes of options.
    // It is possible to assign both value and label attributes to each
    // option.
    // Both value and label attributes appear in the drop-down list of
    // options for the search menu, but value attributes are most prominent.
    // Only the value attribute remains in the search menu after selection,
    // and only this attribute is accessible to the event handler of the
    // search menu.
    // A potential strategy is to assign metabolite's identifiers to values
    // and metabolite's names to labels of options.
    // This strategy conveniently makes metabolite's identifiers accessible
    // to the event handler of the search menu.
    // The disadvantage of this strategy is that the user must see and
    // select between the sometimes meaningless identifiers of metabolites.
    // Instead, another strategy is to assign metabolite's names to values
    // of options and subsequently determine metabolite's identifiers from
    // those names.
    // This determination of metabolite's names from identifiers requires a
    // filter operation, but this operation is reasonably quick.
    // Metabolites have both unique identifiers and unique names.
    options.attr("value", function (data, index) {
      return self.model.metabolites[data].name;
    });
  }
  /**
  * Determines the current value of compartmentalization in the application's
  * state.
  * @param {Object} view Instance of interface's current view.
  */
  determineCompartmentalization(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    return self.model.compartmentalization;
  }
  /**
  * Determines whether or not the application state has a subnetwork.
  */
  determineSubnetwork() {
    return (
      !(this.model.entityViewSubNetworkNodes === null) &&
      !(this.model.entityViewSubNetworkLinks === null)
    );
  }
}

/**
* Interface to represent a temporary place-holder in bottom of interface.
*/
class BottomView {
  /**
  * Initializes an instance of the class.
  * @param {Object} model Model of the application's comprehensive state.
  */
  constructor (model) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = this;
    // Set reference to model of application's state.
    self.model = model;
    // Set reference to document object model (DOM).
    self.document = document;
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes the interface's view.
  * Controls aspects of view's composition and behavior that persist with
  * changes to the application's state.
  * @param {Object} view Instance of interface's current view.
  */
  initializeView(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Initialize view's container.
    self.initializeContainer(self);
  }
  /**
  * Initializes the container for the interface.
  * @param {Object} view Instance of interface's current view.
  */
  initializeContainer(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and set references to elements for interface.
    // Select view in document object model.
    self.view = self.document.getElementById("view");
    // Remove any extraneous content within view.
    // Initialization of the persistence view already removes extraneous
    // content from view.
    General.filterRemoveDocumentElements({
      values: ["top", "bottom"],
      attribute: "id",
      elements: self.view.children
    });
    // Create container for interfaces within bottom of view.
    if (!self.document.getElementById("bottom")) {
      self.bottom = self.document.createElement("div");
      self.view.appendChild(self.bottom);
      self.bottom.setAttribute("id", "bottom");
    } else {
      self.bottom = self.document.getElementById("bottom");
    }
    // Remove any extraneous content within bottom.
    General.filterRemoveDocumentElements({
      values: ["control", "panel"],
      attribute: "id",
      elements: self.bottom.children
    });
    // Create container for interface within bottom.
    // Set reference to current interface's container.
    if (!self.document.getElementById("panel")) {
      self.container = self.document.createElement("div");
      self.bottom.appendChild(self.container);
      self.container.setAttribute("id", "panel");
    } else {
      self.container = self.document.getElementById("panel");
    }
  }
  /**
  * Restores the interface's view.
  * Controls aspects of view's composition and behavior that vary with changes
  * to the application's state.
  * @param {Object} view Instance of interface's current view.
  */
  restoreView(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
  }
}

/**
* Interface to represent the topology of the network of relations between
* metabolic entities.
*/
class TopologyView {
  /**
  * Initializes an instance of the class.
  * @param {Object} model Model of the application's comprehensive state.
  */
  constructor (model) {
    // Set reference to class' current instance to persist across scopes.
    var self = this;
    // Set reference to application's state.
    self.model = model;
    // Set reference to document object model (DOM).
    self.document = document;
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    self.restoreView(self);
  }
  /**
  * Initializes aspects of the view's composition and behavior that do not vary
  * with changes to the application's state.
  * @param {Object} view Instance of interface's current view.
  */
  initializeView(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Initialize view's container.
    self.initializeContainer(self);
    // Initialize view's graphical container for network's node-link diagram.
    self.initializeGraph(self);
  }
  /**
  * Initializes the container for the interface.
  * @param {Object} view Instance of interface's current view.
  */
  initializeContainer(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and set references to elements for interface.
    // Select view in document object model.
    self.view = self.document.getElementById("view");
    // Remove any extraneous content within view.
    // Initialization of the persistence view already removes extraneous
    // content from view.
    General.filterRemoveDocumentElements({
      values: ["top", "bottom"],
      attribute: "id",
      elements: self.view.children
    });
    // Create container for interfaces within bottom of view.
    if (!self.document.getElementById("bottom")) {
      self.bottom = self.document.createElement("div");
      self.view.appendChild(self.bottom);
      self.bottom.setAttribute("id", "bottom");
    } else {
      self.bottom = self.document.getElementById("bottom");
    }
    // Remove any extraneous content within bottom.
    General.filterRemoveDocumentElements({
      values: ["control", "topology"],
      attribute: "id",
      elements: self.bottom.children
    });
    // Create container for interface within bottom.
    // Set reference to current interface's container.
    if (!self.document.getElementById("topology")) {
      self.container = self.document.createElement("div");
      self.bottom.appendChild(self.container);
      self.container.setAttribute("id", "topology");
    } else {
      self.container = self.document.getElementById("topology");
    }
  }
  /**
  * Initializes the graphical container for the network's node-link diagram.
  * @param {Object} view Instance of interface's current view.
  */
  initializeGraph(view) {
    // Set reference to class' current instance to transfer across changes in
    // scope.
    var self = view;
    // Determine whether the graph already exists within the view.
    if (!self.container.getElementsByTagName("svg").item(0)) {
      // Graph does not exist within view.
      // Create graph for network visualization.
      //self.graph = self.document.createElement("svg");
      //self.container.appendChild(self.graph);
      //self.graph.classList.add("graph");
      //self.graphSelection = d3.select(self.graph);
      // Create graph with D3 so that styles in CSS will control dimensions.
      self.graphSelection = d3.select(self.container).append("svg");
      self.graphSelection.classed("graph", true);
      self.graph = self.graphSelection.node();
      // Create basic elements within graph.
      // Create base for graph's background.
      var base = self
      .document.createElementNS("http://www.w3.org/2000/svg", "rect");
      self.graph.appendChild(base);
      base.classList.add("base");
      // Define links' directional marker.
      self.defineLinkDirectionalMarker(self);
    } else {
      // Graph exists within view.
      // Set references to graph.
      self.graph = self.container.getElementsByTagName("svg").item(0);
      self.graphSelection = d3.select(self.graph);
      // Set references to basic elements within graph.
    }
    // Determine the dimensions of the graphical containers.
    // Set references to dimensions of graphical container.
    self.graphWidth = General.determineElementDimension(self.graph, "width");
    self.graphHeight = General.determineElementDimension(self.graph, "height");
  }
  /**
  * Defines link's directional marker.
  * @param {Object} view Instance of interface's current view.
  */
  defineLinkDirectionalMarker(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Define links' directional marker.
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
    if (false) {
      // Define directly.
      var definition = self.document.createElement("defs");
      self.graph.appendChild(definition);
      var marker = self.document.createElement("marker");
      definition.appendChild(marker);
      marker.setAttribute("id", "link-marker");
      marker.setAttribute("viewBox", "0 0 10 10");
      marker.setAttribute("refX", -3);
      marker.setAttribute("refY", 5);
      marker.setAttribute("markerWidth", 5);
      marker.setAttribute("markerHeight", 5);
      marker.setAttribute("orient", "auto");
      var path = self.document.createElement("path");
      marker.appendChild(path);
      path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
    }
  }
  /**
  * Restores aspects of the view's composition and behavior that vary with
  * changes to the application's state.
  * @param {Object} view Instance of interface's current view.
  */
  restoreView(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and activate network.
    self.createActivateNetwork(self);
  }
  /**
  * Creates and activates a visual representation of a network.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateNetwork(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Prepare information about network's elements.
    self.prepareNetworkElementsInformation(self);
    // Create scales for representations of network's elements.
    self.createRepresentationsScales(self);
    // Create scales for simulations of forces between network's elements.
    self.createSimulationsScales(self);
    // Create scales for efficiency.
    self.createEfficiencyScales(self);
    // Create graph to represent metabolic network.
    // Graph structure.
    // - graph (scalable vector graphical container)
    // -- linksGroup (group)
    // --- linksMarks (polylines)
    // -- nodesGroup (group)
    // --- nodesGroups (groups)
    // ---- nodesTitles (titles)
    // ---- nodesMarks (ellipses, rectangles)
    // ---- nodesDirectionalMarks (rectangles, polygons)
    // ---- nodesLabels (text)
    // Create links.
    // Create links before nodes so that nodes will appear over the links.
    self.createLinks(self);
    // Create nodes.
    self.createNodes(self);
    // Initiate force simulation.
    self.initiateForceSimulation(self);
  }
  /**
  * Prepares information about network's elements.
  * @param {Object} view Instance of interface's current view.
  */
  prepareNetworkElementsInformation(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Copy information about network's elements, nodes and links, to preserve
    // original information against modifications, especially due to the force
    // simulation.
    self.linksRecords = General.copyValueJSON(self.model.currentLinks);
    // Combine records for nodes.
    self.nodesRecords = [].concat(
      General.copyValueJSON(self.model.currentMetabolitesNodes),
      General.copyValueJSON(self.model.currentReactionsNodes)
    );
    //console.log("links: " + self.linksRecords.length);
    //console.log("nodes: " + self.nodesRecords.length);
    //console.log("metabolites: " + self.model.currentMetabolitesNodes.length);
    //console.log("reactions: " + self.model.currentReactionsNodes.length);
  }
  /**
  * Creates scales for representations of network's elements.
  * @param {Object} view Instance of interface's current view.
  */
  createRepresentationsScales(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // The optimal scales for representations of network's elements depend on
    // the dimensions of the graphical container or view and on the count of
    // elements.
    // Determine these scales dynamically within script since they depend on
    // context of use.
    // Otherwise an alternative is to determine dimension within style and then
    // access the dimension using element.getBoundingClientRect or
    // window.getComputeStyle.
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
    .range([1, 3, 5, 7, 10, 15, 25, 30, 35, 50]);
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
    .range([1, 2, 3, 4, 5, 7, 12, 15, 17, 20]);
    // Compute ratio for scales' domain.
    self.scaleRatio = self.graphWidth / self.nodesRecords.length;
    //console.log("nodes: " + self.nodesRecords.length);
    //console.log("links: " + self.linksRecords.length);
    //console.log("scale ratio: " + self.scaleRatio);
    // Compute dimensions from scale.
    self.scaleNodeDimension = nodeDimensionScale(self.scaleRatio);
    self.scaleLinkDimension = linkDimensionScale(self.scaleRatio);
    // Compute font size from scale.
    self.scaleFont = fontScale(self.scaleRatio);
  }
  /**
  * Creates scales for simulations of forces between network's elements.
  * @param {Object} view Instance of interface's current view.
  */
  createSimulationsScales(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Simulations of forces between network's elements are computationally
    // expensive.
    // The computational cost varies with the counts of network's elements.
    // To maintain efficiency, vary the rigor of these simulations by the counts
    // of network's elements.
    // Determine these scales dynamically within script since they depend on
    // context of use.
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
    .range([0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.025]);
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
  * @param {Object} view Instance of interface's current view.
  */
  createEfficiencyScales(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Graphical rendering of visual elements for network's elements is
    // computationally expensive
    // The maintenance of efficient interactivity in the application requires
    // restriction on behavior.
    // Greater scale of the network requires more stringent restriction for
    // computational efficiency.
    // Determine a scale for this efficiency dynamically within script since it
    // depends on context of use.
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
  * Creates links in a node-link diagram.
  * @param {Object} view Instance of interface's current view.
  */
  createLinks(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create links.
    // Contain all links within a single group.
    var dataLinksGroup = self
    .graphSelection.selectAll("g").data([self.linksRecords]);
    dataLinksGroup.exit().remove();
    var novelLinksGroup = dataLinksGroup.enter().append("g");
    var linksGroup = novelLinksGroup.merge(dataLinksGroup);
    // Create elements to represent links.
    var dataLinksMarks = linksGroup
    .selectAll("polyline").data(function (element, index, nodes) {
      return element;
    });
    dataLinksMarks.exit().remove();
    var novelLinksMarks = dataLinksMarks.enter().append("polyline");
    self.linksMarks = novelLinksMarks.merge(dataLinksMarks);
    // Assign attributes.
    self.linksMarks.classed("link", true);
    self.linksMarks.classed("reactant", function (data) {
      return data.role === "reactant";
    });
    self.linksMarks.classed("product", function (data) {
      return data.role === "product";
    });
    self.linksMarks.classed("simplification", function (data) {
      return data.simplification;
    });
    self.linksMarks.attr("marker-mid", "url(#link-marker)");
    // Determine dimensions for representations of network's elements.
    // Set dimensions of links.
    self.linkStrokeWidth = self.scaleLinkDimension * 1;
    self.linksMarks.attr("stroke-width", self.linkStrokeWidth);
  }
  /**
  * Creates nodes in a node-link diagram.
  * @param {Object} view Instance of interface's current view.
  */
  createNodes(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create nodes.
    // Contain all nodes within a single group.
    var dataNodesGroup = self
    .graphSelection.selectAll("g").data([self.nodesRecords]);
    dataNodesGroup.exit().remove();
    var novelNodesGroup = dataNodesGroup.enter().append("g");
    self.nodesGroup = novelNodesGroup.merge(dataNodesGroup);
    // Create groups to contain individual nodes' visual representations and
    // textual annotations.
    self.createNodesGroups(self);
    // Create titles for individual nodes.
    self.createNodesTitles(self);
    // Create marks for individual nodes.
    self.createNodesMarks(self);
    // Remove nodes' labels.
    // For efficiency, only include node's labels after simulation completes.
    self.removeNodesLabels(self);
  }
  /**
  * Creates nodes's groups.
  * @param {Object} view Instance of interface's current view.
  */
  createNodesGroups(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create groups to contain individual nodes' visual representations and
    // textual annotations.
    var dataNodesGroups = self.nodesGroup
    .selectAll("g").data(function (element, index, nodes) {
      return element;
    });
    dataNodesGroups.exit().remove();
    var novelNodesGroups = dataNodesGroups.enter().append("g");
    self.nodesGroups = novelNodesGroups.merge(dataNodesGroups);
    // Assign attributes.
    self
    .nodesGroups
    .attr("id", function (element, index, nodes) {
      return "node-" + element.identifier;
    })
    .classed("node", true)
    .classed("metabolite", function (element, index, nodes) {
      return element.entity === "metabolite";
    })
    .classed("reaction", function (element, index, nodes) {
      return element.entity === "reaction";
    })
    .classed("simplification", function (element, index, nodes) {
      return element.simplification;
    });
  }
  /**
  * Creates nodes's titles.
  * @param {Object} view Instance of interface's current view.
  */
  createNodesTitles(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create titles for individual nodes.
    var dataNodesTitles = self.nodesGroups
    .selectAll("title").data(function (element, index, nodes) {
      return [element];
    });
    dataNodesTitles.exit().remove();
    var novelNodesTitles = dataNodesTitles.enter().append("title");
    var nodesTitles = novelNodesTitles.merge(dataNodesTitles);
    // Assign attributes.
    nodesTitles.text(function (element, index, nodes) {
      return element.name;
    });
  }
  /**
  * Creates nodes's marks.
  * @param {Object} view Instance of interface's current view.
  */
  createNodesMarks(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create marks for individual nodes.
    var dataNodesMarks = self
    .nodesGroups
    .selectAll("ellipse", "rect")
    .filter(".mark")
    .data(function (element, index, nodes) {
      return [element];
    });
    dataNodesMarks.exit().remove();
    var novelNodesMarks = dataNodesMarks
    .enter()
    .append(function (element, index, nodes) {
      // Append different types of elements for different types of entities.
      if (element.entity === "metabolite") {
        // Node represents a metabolite.
        return self
        .document
        .createElementNS("http://www.w3.org/2000/svg", "ellipse");
      } else if (element.entity === "reaction") {
        // Node represents a reaction.
        return self
        .document
        .createElementNS("http://www.w3.org/2000/svg", "rect");
      }
    });
    var nodesMarks = novelNodesMarks.merge(dataNodesMarks);
    // Assign attributes.
    nodesMarks.classed("mark", true)
    // Determine dimensions for representations of network's elements.
    // Set dimensions of metabolites' nodes.
    self.metaboliteNodeWidth = self.scaleNodeDimension * 1;
    self.metaboliteNodeHeight = self.scaleNodeDimension * 0.5;
    var nodesMarksMetabolites = nodesMarks
    .filter(function (element, index, nodes) {
      return element.entity === "metabolite";
    });
    nodesMarksMetabolites.attr("rx", self.metaboliteNodeWidth);
    nodesMarksMetabolites.attr("ry", self.metaboliteNodeHeight);
    // Set dimensions of reactions' nodes.
    self.reactionNodeWidth = self.scaleNodeDimension * 2.5;
    self.reactionNodeHeight = self.scaleNodeDimension * 0.75;
    var nodesMarksReactions = nodesMarks
    .filter(function (element, index, nodes) {
      return element.entity === "reaction";
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
  * Removes nodes' labels from a node-link diagram.
  * @param {Object} view Instance of interface's current view.
  */
  removeNodesLabels(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Remove labels for individual nodes.
    self.nodesGroups.selectAll("text").remove();
  }
  /**
  * Initiates a force simulation for placement of network's nodes and links in a
  * node-link diagram.
  * @param {Object} view Instance of interface's current view.
  */
  initiateForceSimulation(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
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
      .radius(function (data) {
        if (data.entity === "metabolite") {
          return self.metaboliteNodeWidth;
        } else if (data.entity === "reaction") {
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
      .id(function (data) {
        return data.identifier;
      })
      .distance(function (data) {
        // Determine whether the link represents relation between nodes that
        // have designations for simplification.
        if (data.simplification) {
          // Link has designation for simplification.
          return self.metaboliteNodeWidth;
        } else {
          // Link does not have designation for simplification.
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
  * @param {Object} view Instance of interface's current view.
  */
  initiateForceSimulationProgress(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Compute an estimate of the simulation's iterations.
    self.estimateIterations = self.computeSimulationIterations(self);
    // Initiate counter for simulation's iterations.
    self.simulationCounter = 0;
  }
  /**
  * Computes an estimate of iterations for a simulation.
  * @param {Object} view Instance of interface's current view.
  */
  computeSimulationIterations(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    return (
      (Math.log10(self.alphaMinimum)) /
      (Math.log10(self.alpha - self.scaleAlphaDecay))
    );
  }
  /**
  * Restores a monitor of force simulation's progress.
  * @param {Object} view Instance of interface's current view.
  */
  restoreForceSimulationProgress(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Increment count of simulation's iterations.
    self.simulationCounter += 1;
    // Report simulation's progress.
    var percentage = Math
    .round((self.simulationCounter / self.estimateIterations) * 100);
    if (percentage % 10 === 0) {
      console.log("simulation: " + percentage + "%");
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
  * @param {Object} view Instance of interface's current view.
  */
  completeForceSimulation(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Restore and refine network's representation.
    self.restoreNodesPositions(self);
    self.restoreLinksPositions(self);
    self.refineNodesLinksRepresentations(self);
    // Report completion of network's representation.
    var message = (
      "network representation complete... " +
      self.simulationCounter + " iterations"
    );
    console.log(message);
    window.alert(message);
  }
  /**
  * Restores positions of nodes' visual representations according to results of
  * force simulation.
  * @param {Object} view Instance of interface's current view.
  */
  restoreNodesPositions(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
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
  * Restores links' positions according to results of force simulation.
  * @param {Object} view Instance of interface's current view.
  */
  restoreLinksPositions(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Restore positions of links according to results of simulation.
    // D3's procedure for force simulation copies references to records for
    // source and target nodes within records for links.
    self.linksMarks.attr("points", function (data) {
      // Determine positions of link's termini.
      var termini = TopologyView.determineLinkTermini({
        role: data.role,
        source: data.source,
        target: data.target,
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
    if (terminus.entity === "reaction") {
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
  * Refines the representations of nodes and links.
  * @param {Object} view Instance of interface's current view.
  */
  refineNodesLinksRepresentations(view) {
    // Set reference to class' current instance to transfer across changes in
    // scope.
    var self = view;
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
  * @param {Object} view Instance of interface's current view.
  */
  determineReactionsNodesOrientations(view) {
    // Set reference to class' current instance to transfer across changes in
    // scope.
    var self = view;
    // Separate records of nodes for metabolites and reactions with access to
    // positions from force simulation.
    var metabolitesNodes = self.nodesRecords.filter(function (record) {
      return record.entity === "metabolite";
    });
    var reactionsNodes = self.nodesRecords.filter(function (record) {
      return record.entity === "reaction";
    });
    // Iterate on records for reactions' nodes with access to positions from
    // force simulation.
    reactionsNodes.forEach(function (reactionNode) {
      // Collect identifiers of metabolites' nodes that surround the reaction's
      // node.
      // Use original records without access to positions from force simulation.
      var neighbors = Network.collectNeighborsNodes({
        focus: reactionNode.identifier,
        links: self.model.currentLinks
      });
      // Determine the roles in which metabolites participate in the reaction.
      // Reaction's store information about metabolites' participation.
      // Metabolites can participate in multiple reactions.
      var neighborsRoles = TopologyView.sortMetabolitesNodesReactionRoles({
        nodesIdentifiers: neighbors,
        participants: reactionNode.participants,
        metabolitesNodes: self.model.currentMetabolitesNodes
      });
      // Collect records for nodes of metabolites that participate in the
      // reaction in each role.
      var reactantsNodes = Network
      .collectElementsRecords(neighborsRoles.reactants, metabolitesNodes);
      var productsNodes = Network
      .collectElementsRecords(neighborsRoles.products, metabolitesNodes);
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
  * Sorts identifiers of nodes for metabolites by their roles in a reaction.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.nodesIdentifiers Identifiers of nodes for
  * metabolites that participate in a reaction.
  * @param {Array<Object<string>>} parameters.participants Information about
  * metabolites' participation in a reaction.
  * @param {Array<Object>} parameters.metabolitesNodes Records for network's
  * nodes for metabolites.
  * @returns {Object<Array<string>>} Identifiers of nodes for metabolites that
  * participate in a reaction either as reactants or products.
  */
  static sortMetabolitesNodesReactionRoles({
    nodesIdentifiers, participants, metabolitesNodes
  } = {}) {
    // Initialize a collection of metabolites' nodes by roles in a reaction.
    var initialCollection = {
      reactants: [],
      products: []
    };
    // Iterate on identifiers for metabolites' nodes.
    var nodesRoles = nodesIdentifiers
    .reduce(function (collection, nodeIdentifier) {
      // Access record of node for metabolite.
      var nodeRecord = Network
      .accessElementRecord(nodeIdentifier, metabolitesNodes);
      // Determine details of node's relation to the reaction.
      // TODO: Some problem here with general network.
      if (nodeRecord.compartment) {
        // Node represents compartmentalization.
        var matches = Extraction.filterReactionParticipants({
          criteria: {
            metabolites: [nodeRecord.metabolite],
            compartments: [nodeRecord.compartment]
          },
          participants: participants
        });
      } else {
        // Node does not represent compartmentalization.
        var matches = Extraction.filterReactionParticipants({
          criteria: {metabolites: [nodeRecord.metabolite]},
          participants: participants
        });
      }
      var roles = General.collectValueFromObjects("role", matches);
      // Include identifier of metabolite's node in the collection according to
      // its role in the reaction.
      if (roles.includes("reactant")) {
        var reactants = [].concat(collection.reactants, nodeRecord.identifier);
      } else {
        var reactants = collection.reactants.slice();
      }
      if (roles.includes("product")) {
        var products = [].concat(collection.products, nodeRecord.identifier);
      } else {
        var products = collection.products.slice();
      }
      var currentCollection = {
        reactants: reactants,
        products: products
      };
      return currentCollection;
    }, initialCollection);
    // Return identifiers of unique nodes by roles.
    return {
      reactants: General.collectUniqueElements(nodesRoles.reactants),
      products: General.collectUniqueElements(nodesRoles.products)
    };
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
  static determineReactionNodeOrientation({
    reactionNode,
    reactantsNodes,
    productsNodes,
    graphHeight
  } = {}) {
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
  * Creates representations of reactions' directions on their nodes.
  * @param {Object} view Instance of interface's current view.
  */
  createReactionsNodesDirectionalMarks(view) {
    // Set reference to class' current instance to transfer across changes in
    // scope.
    var self = view;
    // Select groups of reactions' nodes.
    var nodesReactionsGroups = self
    .nodesGroups.filter(function (element, index, nodes) {
      return element.entity === "reaction";
    });
    var leftDirectionalMarks = nodesReactionsGroups
    .append(function (element, index, nodes) {
      // Append different types of elements for different properties.
      var type = TopologyView.determineDirectionalMarkType("left", element);
      return self.document.createElementNS("http://www.w3.org/2000/svg", type);
    });
    var rightDirectionalMarks = nodesReactionsGroups
    .append(function (element, index, nodes) {
      // Append different types of elements for different properties.
      var type = TopologyView.determineDirectionalMarkType("right", element);
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
    .attr("points", function (data) {
      return General.createIsoscelesTrianglePoints({
        base: height,
        altitude: width,
        orientation: "left"
      });
    });
    rightDirectionalMarks
    .filter("polygon")
    .attr("points", function (data) {
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
  * Determines the type of graphical element to represent the direction of a
  * reaction's node.
  * @param {string} side Side of reaction's node, left or right.
  * @param {Object} reaction Record for a reaction with information about its
  * node's orientation.
  * @returns {string} Type of graphical element to represet direction of a
  * reaction's node.
  */
  static determineDirectionalMarkType(side, reaction) {
    var direction = TopologyView.determineReactionDirection({
      left: reaction.left,
      right: reaction.right,
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
  * Creates labels for nodes in a node-link diagram.
  * @param {Object} view Instance of interface's current view.
  */
  createNodesLabels(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create labels for individual nodes.
    var dataNodesLabels = self.nodesGroups
    .selectAll("text").data(function (element, index, nodes) {
      return [element];
    });
    dataNodesLabels.exit().remove();
    var novelNodesLabels = dataNodesLabels.enter().append("text");
    var nodesLabels = novelNodesLabels.merge(dataNodesLabels);
    // Assign attributes.
    nodesLabels.text(function (data) {
      return data.name.slice(0, 5) + "...";
    });
    nodesLabels.classed("label", true);
    // Determine size of font for annotations of network's elements.
    nodesLabels.attr("font-size", self.scaleFont + "px");
  }
}
