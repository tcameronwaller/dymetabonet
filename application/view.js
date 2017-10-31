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

// TODO: Organize common procedures for constructor's and initializeContainer's within another function.
// TODO: Simply calling these procedures from respective class instances and passing "self" will work.
// TODO: Maybe group this general functionality within some sort of utility class...

/**
* Interface to select file, check and extract information about metabolic
* entities and sets, and restore application's state.
*/
class SourceView {
  /**
  * Initializes an instance of the class.
  * @param {Object} model Model of the comprehensive state of the
  * application.
  */
  constructor(model) {
    // Reference current instance of class to transfer across changes in
    // scope.
    var self = this;
    // Reference model of application's state.
    self.model = model;
    // Reference document object model.
    self.document = document;
    // Select view in document object model.
    self.view = self.document.getElementById("view");
    // Remove any extraneous content within view.
    General.filterRemoveDocumentElements({
      values: ["source"],
      attribute: "id",
      elements: self.view.children
    });
    // Create container for interface within view.
    if (!self.document.getElementById("source")) {
      self.container = self.document.createElement("div");
      self.container.setAttribute("id", "source");
      self.view.appendChild(self.container);
    } else {
      self.container = self.document.getElementById("source");
    }
    // Remove all contents of container.
    General.removeDocumentChildren(self.container);
    //
    // Display current selection of file.
    if (!self.determineFile()) {
      // Application does not have a current selection of file.
      self.fileName = "Please select a file.";
    } else {
      // Application has a current file selection.
      self.fileName = self.model.file.name;
    }
    self.fileLabel = self.document.createElement("span");
    self.fileLabel.textContent = self.fileName;
    self.container.appendChild(self.fileLabel);
    self.container.appendChild(self.document.createElement("br"));
    // Create and activate file selector.
    // File selector needs to be accessible always to change selection of
    // file.
    //if (!self.container.querySelector("input")) {}
    self.selector = self.document.createElement("input");
    self.selector.setAttribute("type", "file");
    self.selector.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      Action.submitFile(event.currentTarget.files[0], self.model);
    });
    self.container.appendChild(self.selector);
    // Display a facade, any element, to control the file selector.
    // Alternatively use a label that references the file selector.
    self.facade = self.document.createElement("button");
    self.facade.textContent = "Select";
    self.facade.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      self.selector.click();
    });
    self.container.appendChild(self.facade);
    self.container.appendChild(self.document.createElement("br"));
    // Create and activate interface controls according to file selection.
    if (self.determineFile()) {
      // Application state has a current file selection.
      // Create and activate button to check and clean a raw model of
      // metabolism.
      self.clean = self.document.createElement("button");
      self.clean.textContent = "Clean";
      self.clean.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Check and clean a raw model of metabolism.
        Action.loadCheckMetabolicEntitiesSets(self.model);
      });
      self.container.appendChild(self.clean);
      //self.container.appendChild(self.document.createElement("br"));
      // Create and activate button to extract information about metabolic
      // entities and sets from a raw model of metabolism.
      self.extractor = self.document.createElement("button");
      self.extractor.textContent = "Extract";
      self.extractor.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Extract information about metabolic entities and sets from a
        // clean model of metabolism and use this information to
        // initialize the application.
        Action.loadExtractInitializeMetabolicEntitiesSets(self.model);
      });
      self.container.appendChild(self.extractor);
      //self.container.appendChild(self.document.createElement("br"));
      // Create and activate button to restore application to a state from
      // a persistent representation.
      self.restoration = self.document.createElement("button");
      self.restoration.textContent = "Restore";
      self.restoration.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Restore state from persistent representation.
        Action.loadRestoreState(self.model);
      });
      self.container.appendChild(self.restoration);
      //self.container.appendChild(self.document.createElement("br"));
    }
  }
  /**
  * Determines whether or not the application's state has information about a
  * file.
  */
  determineFile() {
    return this.model.file;
  }
}

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
    // Reference current instance of class to transfer across changes in
    // scope.
    var self = this;
    // Reference model of application's state.
    self.model = model;
    // Reference document object model.
    self.document = document;
    // Select view in document object model.
    self.view = self.document.getElementById("view");
    // Remove any extraneous content within view.
    General.filterRemoveDocumentElements({
      values: ["top", "bottom"],
      attribute: "id",
      elements: self.view.children
    });
    // Create container for interfaces within top of view.
    if (!self.document.getElementById("top")) {
      self.top = self.document.createElement("div");
      self.top.setAttribute("id", "top");
      self.view.appendChild(self.top);
    } else {
      self.top = self.document.getElementById("top");
    }
    // Remove any extraneous content within top.
    General.filterRemoveDocumentElements({
      values: ["persistence", "set"],
      attribute: "id",
      elements: self.top.children
    });
    // Create container for interface within top.
    if (!self.document.getElementById("persistence")) {
      self.container = self.document.createElement("div");
      self.container.setAttribute("id", "persistence");
      self.top.appendChild(self.container);
    } else {
      self.container = self.document.getElementById("persistence");
    }
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
class SetView {
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
    self.initializeContainer(self);
    // Initialize menu for summary of sets' cardinalities.
    self.initializeSummaryMenu(self);
    // Restore menu for summary of sets' cardinalitites.
    self.restoreSummaryMenu(self);
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
    // Create container for interfaces within top of view.
    // Initialization of the persistence view already creates the top
    // container.
    if (!self.document.getElementById("top")) {
      self.top = self.document.createElement("div");
      self.top.setAttribute("id", "top");
      self.view.appendChild(self.top);
    } else {
      self.top = self.document.getElementById("top");
    }
    // Remove any extraneous content within top.
    General.filterRemoveDocumentElements({
      values: ["persistence", "set"],
      attribute: "id",
      elements: self.top.children
    });
    // Create container for interface within top.
    // Set reference to current interface's container.
    if (!self.document.getElementById("set")) {
      self.container = self.document.createElement("div");
      self.container.setAttribute("id", "set");
      self.top.appendChild(self.container);
    } else {
      self.container = self.document.getElementById("set");
    }
  }
  /**
  * Initializes the menu to summarize sets' cardinalities.
  * Creates elements that do not yet exist.
  * Sets references to elements that already exist.
  * @param {Object} view Instance of interface's current view.
  */
  initializeSummaryMenu(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create elements that persist across interactive, dynamic changes to the
    // application's state.
    // Activate behavior that is consistent across interactive, dynamic changes
    // to the application's state.
    // Determine whether the summary's menu already exists within the view.
    if (!self.container.getElementsByTagName("table").item(0)) {
      // Interface's container does not include a table element.
      // Create table.
      self.table = self.document.createElement("table");
      self.container.appendChild(self.table);
      // Create table's header.
      self.tableHead = self.document.createElement("thead");
      self.table.appendChild(self.tableHead);
      var tableHeadRow = self.document.createElement("tr");
      self.tableHead.appendChild(tableHeadRow);
      var tableHeadRowCellAttribute = self.document.createElement("th");
      tableHeadRow.appendChild(tableHeadRowCellAttribute);
      tableHeadRowCellAttribute.textContent = "Attribute";
      tableHeadRowCellAttribute.classList.add("attribute");
      self.tableHeadRowCellValue = self.document.createElement("th");
      tableHeadRow.appendChild(self.tableHeadRowCellValue);
      self.tableHeadRowCellValue.classList.add("value");
      // Create and activate controls for entities.
      self.createActivateEntitiesControl("metabolites", self);
      self.createActivateEntitiesControl("reactions", self);
      // Create and activate control for filter.
      self.createActivateFilterControl(self);
      // Create and activate reset button.
      self.createActivateRestore(self);

      // TODO: This control is temporary for the sake of demonstration on 10 October 2017.
      // Create and control for compartmentalization.
      self.createActivateCompartmentalizationControl(self);




      // Create table's body.
      self.tableBody = self.document.createElement("tbody");
      self.table.appendChild(self.tableBody);
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
      self.metabolitesControl = self
      .document.getElementById("sets-entities-metabolites");
      self.reactionsControl = self
      .document.getElementById("sets-entities-reactions");
      self.filterControl = self.document.getElementById("sets-filter");


      self.compartmentalizationControl = self
      .document.getElementById("compartmentalization");



      self.tableBody = self.container.getElementsByTagName("tbody").item(0);
    }
  }
  /**
  * Creates and activates controls to select the type of entity in the menu to
  * summarize sets' cardinalities.
  * @param {string} entities Type of entities, metabolites or reactions, for
  * which to create and activate selector.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateEntitiesControl(entities, view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create entity selector.
    var entitiesControl = entities + "Control";
    var identifier = "sets-entities-" + entities;
    self[entitiesControl] = self.document.createElement("input");
    self.tableHeadRowCellValue.appendChild(self[entitiesControl]);
    self[entitiesControl].setAttribute("id", identifier);
    self[entitiesControl].setAttribute("type", "radio");
    self[entitiesControl].setAttribute("value", entities);
    self[entitiesControl].setAttribute("name", "entities");
    self[entitiesControl].classList.add("entities");
    self[entitiesControl].addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Change current selection of entity in application's state.
      //var radios = self
      //    .tableHeadRowCellValue.getElementsByClassName("entity");
      //var value = General.determineRadioGroupValue(radios);
      //Action.submitSetViewEntity(value, self.model);
      Action.changeSetsEntities(self.model);
    });
    var entityLabel = self.document.createElement("label");
    self.tableHeadRowCellValue.appendChild(entityLabel);
    entityLabel.setAttribute("for", identifier);
    entityLabel.textContent = entities;
  }
  /**
  * Creates and activates control to select whether to filter the menu to
  * summarize sets' cardinalities.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateFilterControl(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and activate filter selector.
    var identifier = "sets-filter";
    self.filterControl = self.document.createElement("input");
    self.tableHeadRowCellValue.appendChild(self.filterControl);
    self.filterControl.setAttribute("id", identifier);
    self.filterControl.setAttribute("type", "checkbox");
    self.filterControl.setAttribute("value", "filter");
    self.filterControl.classList.add("filter");
    self.filterControl.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Change current selection of filter in application's state.
      Action.changeSetsFilter(self.model);
    });
    var filterLabel = self.document.createElement("label");
    self.tableHeadRowCellValue.appendChild(filterLabel);
    filterLabel.setAttribute("for", identifier);
    filterLabel.textContent = "filter";
  }
  /**
  * Creates and activates control to restore the menu to summarize sets'
  * cardinalities to its original state.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateRestore(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and activate button to restore application to initial state.
    self.restore = self.document.createElement("button");
    self.tableHeadRowCellValue.appendChild(self.restore);
    self.restore.textContent = "restore";
    self.restore.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Restore sets' summary to initial state.
      Action.restoreSetsSummary(self.model);
    });
  }
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
  * Restores the menu to summarize sets' cardinalities.
  * @param {Object} view Instance of interface's current view.
  */
  restoreSummaryMenu(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Create and restore elements that vary across interactive, dynamic changes
    // to the application's state.
    // Activate behavior that varies across interactive, dynamic changes to the
    // application's state.
    // Restore the summary menu to match the application's dynamic state.
    // Restore state's of controls.
    self.metabolitesControl.checked = self
    .determineEntityMatch("metabolites", self);
    self.reactionsControl.checked = self
    .determineEntityMatch("reactions", self);
    self.filterControl.checked = self.determineFilter(self);
    self.compartmentalizationControl.checked = self
    .determineCompartmentalization(self);
    // Create and activate data-dependent summary's menu.
    self.createActivateSummaryBody(self);
  }
  /**
  * Creates and activates body of summary table.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateSummaryBody(view) {

    // TODO: Attribute Search Menu... make them always present...
    // TODO: Handle text overflow of options in search menu.
    // TODO: Handle scrolling through options in search menu.
    // TODO: Include some indicator of selection status in options in search menu.

    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Select summary table's body.
    var body = d3.select(self.tableBody);
    // Append rows to table with association to data.
    var dataRows = body.selectAll("tr").data(self.model.setsSummary);
    dataRows.exit().remove();
    var newRows = dataRows.enter().append("tr");
    var rows = newRows.merge(dataRows);
    // Append cells to table with association to data.
    var dataCells = rows.selectAll("td").data(function (element, index) {
      // Organize data for table cells in each row.
      return [].concat(
        {
          type: "attribute",
          attribute: element.attribute,
          values: element.values
        },
        {
          type: "value",
          attribute: element.attribute,
          values: element.values
        }
      );
    });
    dataCells.exit().remove();
    var newCells = dataCells.enter().append("td");
    self.tableBodyCells = newCells.merge(dataCells);
    // Create and activate summary table's cells.
    self.createActivateSummaryBodyCellsAttributes(self);
    self.createActivateSummaryBodyCellsValues(self);
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
    // Create search menus.
    var dataSearches = self
    .tableBodyCellsAttributes.selectAll("div")
    .filter(".search")
    .data(function (element, index, nodes) {
      return [element];
    });
    dataSearches.exit().remove();
    var novelSearches = dataSearches.enter().append("div");
    var searches = novelSearches.merge(dataSearches);
    // Assign attributes.
    searches.classed("search", true);
    // Create list of options for search menu.
    var dataOptionsLists = searches.selectAll("datalist")
    .data(function (element, index, nodes) {
      return [element];
    });
    dataOptionsLists.exit().remove();
    var novelOptionsLists = dataOptionsLists.enter().append("datalist");
    var optionsLists = novelOptionsLists.merge(dataOptionsLists);
    // Assign attributes.
    optionsLists.attr("id", function (element, index, nodes) {
      return element.attribute + "-options-list";
    });
    // Create options within list.
    var dataOptions = optionsLists.selectAll("option")
    .data(function (element, index, nodes) {
      return element.values;
    });
    dataOptions.exit().remove();
    var novelOptions = dataOptions.enter().append("option");
    var options = novelOptions.merge(dataOptions);
    // Assign attributes.
    options.text(function (element, index, nodes) {
      // Determine whether the option corresponds to a current selection of the
      // attribute's value.
      var selection = SetView.determineAttributeValueSelection({
        value: element.value,
        attribute: element.attribute,
        model: self.model
      });
      if (selection) {
        var selection = "selection";
      } else {
        var selection = "";
      }
      return selection;
    })
    .attr("value", function (element, index, nodes) {
      var name = SetView.determineAttributeValueName({
        attribute: element.attribute,
        valueIdentifier: element.value,
        model: self.model
      });
      return name;
    });
    // Create search menu.
    var dataMenus = searches.selectAll("input")
    .data(function (element, index, nodes) {
      return [element];
    });
    dataMenus.exit().remove();
    var novelMenus = dataMenus.enter().append("input");
    self.searchMenus = novelMenus.merge(dataMenus);
    // Assign attributes.
    self.searchMenus
    .attr("id", function (element, index, nodes) {
      return element.attribute + "-search-menu";
    })
    .classed("processes", function (element, index, nodes) {
      return element.attribute === "processes";
    })
    .classed("compartments", function (element, index, nodes) {
      return element.attribute === "compartments";
    })
    .attr("type", "search")
    .attr("list", function (element, index, nodes) {
      return element.attribute + "-options-list";
    })
    .attr("placeholder", function (element, index, nodes) {
      return "search " + element.attribute;
    })
    .attr("autocomplete", "off");
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
    // Assign event listeners and handlers to search menus.
    // Options from datalist elements do not report events.
    // Rather, search input elements report events.
    // Respond to event on input search element and access relevant information
    // that associates with the element.
    // Remove any existing event listeners.
    self.searchMenus.on("change", null);
    // Assign event listeners and handlers.
    self.searchMenus.on("change", function (element, index, nodes) {
      // Determine the search menu's value, which is the name of the attribute's
      // value.
      var menu = nodes[index];
      var name = menu.value;
      //var list = menu.list;
      // Determine the attribute and value of the search menu's selection.
      // Determine whether the search menu's selection matches a valid value of
      // the attribute.
      // Assume that attributes' values have unique names.
      var menuSelection = d3.select(menu);
      var attribute = menuSelection.data()[0].attribute;
      var values = menuSelection.data()[0].values;
      var match = values.filter(function (element) {
        var valueName = SetView.determineAttributeValueName({
          attribute: attribute,
          valueIdentifier: element.value,
          model: self.model
        });
        return name === valueName;
      });
      if (match.length > 0) {
        var identifier = match[0].value;
        // Submit selection of attribute's value.
        Action.selectSetsAttributeValue({
          value: identifier,
          attribute: attribute,
          model: self.model
        });
      }
    });
  }
  /**
  * Creates and activates cells for data's values in body of summary table.
  * @param {Object} view Instance of interface's current view.
  */
  createActivateSummaryBodyCellsValues(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    // Select cells for data's values.
    self.tableBodyCellsValues = self
    .tableBodyCells.filter(function (data, index) {
      return data.type === "value";
    });
    // Assign attributes to cells in value column.
    self.tableBodyCellsValues.classed("value", true);
    // Create graphs to represent sets' cardinalities.
    // It is possible to contain a graph's visual representations and textual
    // annotations within separate groups in order to segregate these within
    // separate layers.
    // This strategy avoids occlusion of textual annotations by visual
    // representations.
    // In these graphs, this occlusion is impossible, so a simpler structure is
    // preferrable.
    // Graph structure.
    // - graph (scalable vector graphical container)
    // -- barsGroup (group)
    // --- barGroups (groups)
    // ---- barTitles (titles)
    // ---- barMarks (rectangles)
    // ---- barLabels (text)
    // Graphs need access to the same data as their parent cells without any
    // transformation.
    // Append graphs to the enter selections to avoid replication upon
    // restorations.
    var dataGraphs = self
    .tableBodyCellsValues.selectAll("svg").data(function (element, index) {
      return [element];
    });
    dataGraphs.exit().remove();
    var novelGraphs = dataGraphs.enter().append("svg");
    var graphs = novelGraphs.merge(dataGraphs);
    graphs.classed("graph", true);
    // Determine graphs' dimensions of graphs.
    // Set references graphs' dimensions.
    var graph = self.tableBody.getElementsByClassName("graph").item(0);
    self.graphWidth = General.determineElementDimension(graph, "width");
    self.graphHeight = General.determineElementDimension(graph, "height");
    // Create bars within graphs to represent sets' cardinalities.
    // Create groups to contain all bars' visual representations and textual
    // annotations.
    var dataBarsGroup = graphs.selectAll("g").data(function (element, index) {
      return [element];
    });
    dataBarsGroup.exit().remove();
    var novelBarsGroup = dataBarsGroup.enter().append("g");
    var barsGroup = novelBarsGroup.merge(dataBarsGroup);
    // Create groups to contain individual bars' visual representations and
    // textual annotations.
    var dataBarGroups = barsGroup
    .selectAll("g").data(function (element, index) {
      return element.values;
    });
    dataBarGroups.exit().remove();
    var novelBarGroups = dataBarGroups.enter().append("g");
    self.tableBodyCellsValuesGraphBarGroups = novelBarGroups
    .merge(dataBarGroups);
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
    // Create titles for individual bars.
    var dataBarTitles = self.tableBodyCellsValuesGraphBarGroups
    .selectAll("title").data(function (element, index) {
      return [element];
    });
    dataBarTitles.exit().remove();
    var novelBarTitles = dataBarTitles.enter().append("title");
    var barTitles = novelBarTitles.merge(dataBarTitles);
    // Assign attributes.
    barTitles.text(function (element, index, nodes) {
      var name = SetView.determineAttributeValueName({
        attribute: element.attribute,
        valueIdentifier: element.value,
        model: self.model
      });
      var message = (name + " (" + element.count + ")");
      return message;
    });
    // Create marks for individual bars.
    var dataBarMarks = self.tableBodyCellsValuesGraphBarGroups
    .selectAll("rect").data(function (element, index) {
      return [element];
    });
    dataBarMarks.exit().remove();
    var novelBarMarks = dataBarMarks.enter().append("rect");
    var barMarks = novelBarMarks.merge(dataBarMarks);
    // Assign attributes.
    barMarks
    .classed("mark", true)
    .classed("normal", function (element, index, nodes) {
      return !SetView.determineAttributeValueSelection({
        value: element.value,
        attribute: element.attribute,
        model: self.model
      });
    })
    .classed("emphasis", function (element, index, nodes) {
      return SetView.determineAttributeValueSelection({
        value: element.value,
        attribute: element.attribute,
        model: self.model
      });
    })
    .attr("width", function (element, index) {
      // Determine scale between value and graph's dimension.
      var scale = d3
      .scaleLinear()
      .domain([0, element.total])
      .range([0, self.graphWidth]);
      return scale(element.count);
    })
    .attr("height", self.graphHeight);
    // Create labels for individual bars.
    var dataBarLabels = self.tableBodyCellsValuesGraphBarGroups
    .selectAll("text").data(function (element, index) {
      return [element];
    });
    dataBarLabels.exit().remove();
    var novelBarLabels = dataBarLabels.enter().append("text");
    var barLabels = novelBarLabels.merge(dataBarLabels);
    // Assign attributes.
    barLabels
    .classed("label", true)
    .text(function (element, index, nodes) {
      // Determine width of bar's rectangle.
      var scale = d3
      .scaleLinear().domain([0, element.total]).range([0, self.graphWidth]);
      var width = scale(element.count);
      // Determine dimension of label's characters.
      var documentElement = nodes[index];
      var character = General
      .determineElementDimension(documentElement, "fontSize");
      // Determine count of characters that will fit on bar's rectangle.
      var count = (width / character) * 1.5;
      // Prepare name.
      var name = SetView.determineAttributeValueName({
        attribute: element.attribute,
        valueIdentifier: element.value,
        model: self.model
      });
      return name.slice(0, count);
    })
    .attr("transform", function (element, index) {
      var x = 3;
      var y = self.graphHeight / 2;
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
  * Determines whether or not a specific type of entities matches the selection
  * in the application's state.
  * @param {string} match Type of entities, metabolites or reactions, to compare
  * to the selection in application's state.
  * @param {Object} view Instance of interface's current view.
  */
  determineEntityMatch(match, view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    var selection = self.model.setsEntities;
    return selection === match;
  }
  /**
  * Determines the current selection in the application's state of whether to
  * filter the menu to summarize sets' cardinalities.
  * @param {Object} view Instance of interface's current view.
  */
  determineFilter(view) {
    // Set reference to class' current instance to transfer across changes
    // in scope.
    var self = view;
    return self.model.setsFilter;
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
  /**
  * Determines the name of an attribute's value from references in the model of
  * the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.attribute Name of an attribute.
  * @param {string} parameters.valueIdentifier Identifier of a value of the
  * attribute.
  * @param {Object} parameters.model Model of the application's comprehensive
  * state.
  * @returns {string} Name of the value of the attribute.
  */
  static determineAttributeValueName({
    attribute, valueIdentifier, model
  } = {}) {
    return model[attribute][valueIdentifier].name;
  }
  /**
  * Determines whether an attribute's value has a selection from references in
  * the model of the application's state.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.value Identifier of a value of the attribute.
  * @param {string} parameters.attribute Name of an attribute.
  * @param {Object} parameters.model Model of the application's comprehensive
  * state.
  * @returns {boolean} Whether a selection exists for the value of the
  * attribute.
  */
  static determineAttributeValueSelection({
    value, attribute, model
  } = {}) {
    return Attribution.determineSelectionMatch({
      value: value,
      attribute: attribute,
      selections: model.setsSelections
    });
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
  * Restores the interface's view.
  * Controls aspects of view's composition and behavior that vary with changes
  * to the application's state.
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
      return General.createHorizontalIsoscelesTrianglePoints({
        base: height,
        altitude: width,
        direction: "left"
      });
    });
    rightDirectionalMarks
    .filter("polygon")
    .attr("points", function (data) {
      return General.createHorizontalIsoscelesTrianglePoints({
        base: height,
        altitude: width,
        direction: "right"
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
