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
* Interface to control selections by traversal of network.
*/
class ViewQuery {
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
    self.subnetworkView = self.state.views.subnetwork;
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
      identifier: "query",
      classNames: ["container", "panel", "control", "tierThree"],
      type: "standard",
      target: self.subnetworkView.queryTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create instructional note.
      self.createInstructionalNote(self);
      // Create and activate controls for combination.
      self.createActivateCombinationControl("inclusion", self);
      self.createActivateCombinationControl("exclusion", self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create and activate controls for type of traversal.
      self.createActivateTypeControl("rogue", self);
      self.createActivateTypeControl("proximity", self);
      self.createActivateTypeControl("path", self);
      self.createActivateTypeControl("connection", self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create container.
      self.controlContainer = View.createInsertContainer({
        classNames: ["container"],
        type: "standard",
        target: self.container,
        position: "beforeend",
        documentReference: self.document
      });
      self.controlContainer.setAttribute("id", "query-control-container");
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create button for execution of all queries.
      self.createActivateExecuteButton(self);
    } else {
      // Container is not empty.
      // Set references to content.
      // Control for combination.
      self.inclusion = self.document.getElementById("combination-inclusion");
      self.exclusion = self.document.getElementById("combination-exclusion");
      // Control for type of traversal.
      self.rogue = self.document.getElementById("type-rogue");
      self.proximity = self.document.getElementById("type-proximity");
      self.path = self.document.getElementById("type-path");
      self.connection = self.document.getElementById("type-connection");
      // Container for query's controls.
      self.controlContainer = self
      .document.getElementById("query-control-container");
    }
  }
  /**
  * Creates an instructional note about view's controls.
  * @param {Object} self Instance of a class.
  */
  createInstructionalNote(self) {
    // Create container.
    var container = View.createInsertContainer({
      classNames: ["container", "note"],
      type: "standard",
      target: self.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Create text.
    var text = (
      "- Query network to select subnetwork."
    );
    container.textContent = text;
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
      ActionQuery.changeCombination({
        queryCombination: combination,
        state: self.state
      });
    });
  }
  /**
  * Creates and activates a control for the type of traversal.
  * @param {string} type Type of traversal, rogue, proximity, or path.
  * @param {Object} self Instance of a class.
  */
  createActivateTypeControl(type, self) {
    // Create control for type of traversal.
    var identifier = "type-" + type;
    self[type] = View.createRadioButtonLabel({
      identifier: identifier,
      value: type,
      name: "type",
      className: "type",
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
      ActionQuery.changeType({
        queryType: type,
        state: self.state
      });
    });
  }
  /**
  * Creates and activates button to execute queries.
  * @param {Object} self Instance of a class.
  */
  createActivateExecuteButton(self) {
    var button = View.createButton({
      text: "execute",
      parent: self.container,
      documentReference: self.document
    });
    button.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.executeQuery(self.state);
    });
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // The accessibility of nodes to each traversal procedure depends on the
    // method of combination.
    // For combination by union, all traversal procedures have access to nodes
    // in the network.
    // For combination by difference, all traversal procedures have access to
    // nodes in the subnetwork.
    // Create view's variant elements.
    // Activate variant behavior of view's elements.
    self.inclusion.checked = ViewQuery
    .determineCombinationMatch("inclusion", self.state);
    self.exclusion.checked = ViewQuery
    .determineCombinationMatch("exclusion", self.state);
    self.rogue.checked = ViewQuery.determineTypeMatch("rogue", self.state);
    self.proximity.checked = ViewQuery
    .determineTypeMatch("proximity", self.state);
    self.path.checked = ViewQuery.determineTypeMatch("path", self.state);
    self.connection.checked = ViewQuery
    .determineTypeMatch("connection", self.state);
    // Create, activate, and restore controls for traversal.
    self.createActivateRestoreQueryControl(self);
  }

  /**
  * Creates, activates, and restores controls for traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreQueryControl(self) {
    // Determine which type of traversal for which to create controls.
    if (self.state.queryType === "rogue") {
      self.createActivateRestoreRogueQueryControl(self);
    } else if (self.state.queryType === "proximity") {
      self.createActivateRestoreProximityQueryControl(self);
    } else if (self.state.queryType === "path") {
      self.createActivateRestorePathQueryControl(self);
    } else if (self.state.queryType === "connection") {
      self.createActivateRestoreConnectionQueryControl(self);
    }
  }
  /**
  * Creates, activates, and restores controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreRogueQueryControl(self) {
    self.createActivateRogueQueryControl(self);
    self.restoreRogueQueryControl(self);
  }
  /**
  * Creates and activates controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRogueQueryControl(self) {
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
      self.createRogueQueryControl(self);
      // Activate behavior.
      self.activateRogueQueryControl(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      self.rogueFocusSearch = self
      .document.getElementById("query-rogue-focus-search");
    }
  }
  /**
  * Creates controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  createRogueQueryControl(self) {
    // Create and activate elements.
    // Create search menu.
    self.rogueFocusSearch = View.createSearchOptionsList({
      identifier: "query-rogue-focus-search",
      prompt: "select node...",
      parent: self.controlContainer,
      documentReference: self.document
    });
  }
  /**
  * Activates controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  activateRogueQueryControl(self) {
    // Activate search.
    if (self.state.queryCombination === "inclusion") {
      var recordSource = "network";
    } else if (self.state.queryCombination === "exclusion") {
      var recordSource = "subnetwork";
    }
    ViewQuery.activateQuerySearch({
      search: self.rogueFocusSearch,
      variableName: "queryRogueFocus",
      recordSource: recordSource,
      state: self.state
    });
  }
  /**
  * Restores controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  restoreRogueQueryControl(self) {
    // Restore controls' settings.
    // Restore search.
    if (self.state.queryCombination === "inclusion") {
      var recordSource = "network";
    } else if (self.state.queryCombination === "exclusion") {
      var recordSource = "subnetwork";
    }
    ViewQuery.restoreQuerySearch({
      search: self.rogueFocusSearch,
      variableName: "queryRogueFocus",
      recordSource: recordSource,
      state: self.state
    });
  }

  /**
  * Creates, activates, and restores controls for proximity traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreProximityQueryControl(self) {
    self.createActivateProximityQueryControl(self);
    self.restoreProximityQueryControl(self);
  }
  /**
  * Creates and activates controls for proximity traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateProximityQueryControl(self) {
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
      self.createProximityQueryControl(self);
      // Activate behavior.
      self.activateProximityQueryControl(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      self.proximityFocusSearch = self
      .document.getElementById("query-proximity-focus-search");
      self.proximityDirection = self
      .document.getElementById("query-proximity-direction");
      self.proximityDepth = self
      .document.getElementById("query-proximity-depth");
    }
  }
  /**
  * Creates controls for proximity traversal.
  * @param {Object} self Instance of a class.
  */
  createProximityQueryControl(self) {
    // Create and activate elements.
    // Create search menu.
    self.proximityFocusSearch = View.createSearchOptionsList({
      identifier: "query-proximity-focus-search",
      prompt: "select node...",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create direction.
    // Create control for direction.
    self.proximityDirection = View.createButtonIdentifier({
      identifier: "query-proximity-direction",
      text: "",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create control for depth.
    self.proximityDepth = View.createSelector({
      identifier: "query-proximity-depth",
      parent: self.controlContainer,
      documentReference: self.document
    });
  }
  /**
  * Activates controls for proximity traversal.
  * @param {Object} self Instance of a class.
  */
  activateProximityQueryControl(self) {
    // Activate search.
    if (self.state.queryCombination === "inclusion") {
      var recordSource = "network";
    } else if (self.state.queryCombination === "exclusion") {
      var recordSource = "subnetwork";
    }
    ViewQuery.activateQuerySearch({
      search: self.proximityFocusSearch,
      variableName: "queryProximityFocus",
      recordSource: recordSource,
      state: self.state
    });
    // Activate direction.
    self.proximityDirection.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.changeProximityDirection(self.state);
    });
    // Activate depth.
    self.proximityDepth.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine value.
      var value = Number(event.currentTarget.value);
      // Call action.
      ActionQuery.changeProximityDepth(value, self.state);
    });
  }
  /**
  * Restores controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  restoreProximityQueryControl(self) {
    // Restore controls' settings.
    // Restore search.
    if (self.state.queryCombination === "inclusion") {
      var recordSource = "network";
    } else if (self.state.queryCombination === "exclusion") {
      var recordSource = "subnetwork";
    }
    ViewQuery.restoreQuerySearch({
      search: self.proximityFocusSearch,
      variableName: "queryProximityFocus",
      recordSource: recordSource,
      state: self.state
    });
    // Restore direction.
    // Represent direction.
    if (self.state.queryProximityDirection === "successors") {
      self.proximityDirection.textContent = "->";
    } else if (self.state.queryProximityDirection === "neighbors") {
      self.proximityDirection.textContent = "<->";
    } else if (self.state.queryProximityDirection === "predecessors") {
      self.proximityDirection.textContent = "<-";
    }
    // Restore depth.
    // Create options.
    var options = [1, 2, 3, 4, 5].map(function (depth) {
      // Determine whether depth matches state variable.
      var match = (depth === self.state.queryProximityDepth);
      return {
        label: String(depth) + " links",
        value: depth,
        selection: match
      };
    });
    View.createSelectorOptions({
      options: options,
      selector: self.proximityDepth,
      documentReference: self.document
    });
  }

  /**
  * Creates, activates, and restores controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRestorePathQueryControl(self) {
    self.createActivatePathQueryControl(self);
    self.restorePathQueryControl(self);
  }
  /**
  * Creates and activates controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  createActivatePathQueryControl(self) {
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
      self.createPathQueryControl(self);
      // Activate behavior.
      self.activatePathQueryControl(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      self.pathSourceSearch = self
      .document.getElementById("query-path-source-search");
      self.pathTargetSearch = self
      .document.getElementById("query-path-target-search");
      self.pathDirection = self.document.getElementById("query-path-direction");
      self.pathCount = self.document.getElementById("query-path-count");
    }
  }
  /**
  * Creates controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  createPathQueryControl(self) {
    // Create and activate elements.
    // Create search menu.
    self.pathSourceSearch = View.createSearchOptionsList({
      identifier: "query-path-source-search",
      prompt: "select node...",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create direction.
    // Create control for direction.
    self.pathDirection = View.createButtonIdentifier({
      identifier: "query-path-direction",
      text: "",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create control for count.
    self.pathCount = View.createSelector({
      identifier: "query-path-count",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create search menu.
    self.pathTargetSearch = View.createSearchOptionsList({
      identifier: "query-path-target-search",
      prompt: "select node...",
      parent: self.controlContainer,
      documentReference: self.document
    });
  }
  /**
  * Activates controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  activatePathQueryControl(self) {
    // Activate search.
    if (self.state.queryCombination === "inclusion") {
      var recordSource = "network";
    } else if (self.state.queryCombination === "exclusion") {
      var recordSource = "subnetwork";
    }
    ViewQuery.activateQuerySearch({
      search: self.pathSourceSearch,
      variableName: "queryPathSource",
      recordSource: recordSource,
      state: self.state
    });
    // Activate direction.
    self.pathDirection.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.changePathDirection(self.state);
    });
    // Activate count.
    self.pathCount.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine value.
      var value = Number(event.currentTarget.value);
      // Call action.
      ActionQuery.changeTypeCount({
        count: value,
        type: "path",
        state: self.state
      });
    });
    // Activate search.
    ViewQuery.activateQuerySearch({
      search: self.pathTargetSearch,
      variableName: "queryPathTarget",
      recordSource: recordSource,
      state: self.state
    });
  }
  /**
  * Restores controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  restorePathQueryControl(self) {
    // Restore controls' settings.
    // Restore search.
    if (self.state.queryCombination === "inclusion") {
      var recordSource = "network";
    } else if (self.state.queryCombination === "exclusion") {
      var recordSource = "subnetwork";
    }
    ViewQuery.restoreQuerySearch({
      search: self.pathSourceSearch,
      variableName: "queryPathSource",
      recordSource: recordSource,
      state: self.state
    });
    // Restore direction.
    // Represent direction.
    if (self.state.queryPathDirection === "forward") {
      self.pathDirection.textContent = "->";
    } else if (self.state.queryPathDirection === "both") {
      self.pathDirection.textContent = "<->";
    } else if (self.state.queryPathDirection === "reverse") {
      self.pathDirection.textContent = "<-";
    }
    // Restore count.
    // Create options.
    var options = [1, 2, 3, 4, 5].map(function (count) {
      // Determine whether depth matches state variable.
      var match = (count === self.state.queryPathCount);
      return {
        label: String(count) + " paths",
        value: count,
        selection: match
      };
    });
    View.createSelectorOptions({
      options: options,
      selector: self.pathCount,
      documentReference: self.document
    });
    // Restore search.
    ViewQuery.restoreQuerySearch({
      search: self.pathTargetSearch,
      variableName: "queryPathTarget",
      recordSource: recordSource,
      state: self.state
    });
  }

  /**
  * Creates, activates, and restores controls for connection traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreConnectionQueryControl(self) {
    self.createActivateConnectionQueryControl(self);
    self.restoreActivateConnectionQueryControl(self);
  }
  /**
  * Creates and activates controls for connection traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateConnectionQueryControl(self) {
    // Determine whether container's current content matches view's novel type.
    // Container's class indicates type of content.
    if (!self.container.classList.contains("connection")) {
      // Container's current content does not match view's novel type.
      // Remove container's previous contents and assign a class name to
      // indicate view's novel type.
      View.removeContainerContentSetClass({
        container: self.controlContainer,
        className: "connection"
      });
      // Create content.
      self.createConnectionQueryControl(self);
      // Activate behavior.
      self.activateConnectionQueryControl(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      self.connectionTargetSearch = self
      .document.getElementById("query-connection-target-search");
      self.connectionTargetSummary = self
      .document.getElementById("query-connection-target-summary");
      self.connectionCount = self
      .document.getElementById("query-connection-count");
    }
  }
  /**
  * Creates controls for connection traversal.
  * @param {Object} self Instance of a class.
  */
  createConnectionQueryControl(self) {
    // Create summary of targets.
    self.createConnectionQueryTargetSummary(self);
    // Create button for inclusion.
    self.includeTarget = View.createButton({
      text: "+",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create search menu.
    self.connectionTargetSearch = View.createSearchOptionsList({
      identifier: "query-connection-target-search",
      prompt: "select node...",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create control for count.
    self.connectionCount = View.createSelector({
      identifier: "query-connection-count",
      parent: self.controlContainer,
      documentReference: self.document
    });
  }
  /**
  * Creates and activates summary of targets for connection traversal.
  * @param {Object} self Instance of a class.
  */
  createConnectionQueryTargetSummary(self) {
    // Create separate tables for head and body to support stationary head and
    // scrollable body.
    // Create head table.
    var tableHeadRow = View.createTableHeadRow({
      className: "connection-target",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create titles, sorts, and scale in table's header.
    // Create head for name.
    var nameCell = View.createTableHeadCellLabel({
      text: "targets",
      className: "name",
      parent: tableHeadRow,
      documentReference: self.document
    });
    // Create head for name.
    var nameCell = View.createTableHeadCellLabel({
      text: "",
      className: "removal",
      parent: tableHeadRow,
      documentReference: self.document
    });
    // Create body table.
    self.connectionTargetSummary = View.createScrollTableBody({
      className: "connection",
      parent: self.controlContainer,
      documentReference: self.document
    });
  }
  /**
  * Activates controls for connection traversal.
  * @param {Object} self Instance of a class.
  */
  activateConnectionQueryControl(self) {
    // Activate inclusion.
    self.includeTarget.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.includeConnectionTarget(self.state);
    });
    // Activate search.
    if (self.state.queryCombination === "inclusion") {
      var recordSource = "network";
    } else if (self.state.queryCombination === "exclusion") {
      var recordSource = "subnetwork";
    }
    ViewQuery.activateQuerySearch({
      search: self.connectionTargetSearch,
      variableName: "queryConnectionTarget",
      recordSource: recordSource,
      state: self.state
    });
    // Activate count.
    self.connectionCount.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine value.
      var value = Number(event.currentTarget.value);
      // Call action.
      ActionQuery.changeTypeCount({
        count: value,
        type: "connection",
        state: self.state
      });
    });
  }
  /**
  * Restores and activates controls for connection traversal.
  * @param {Object} self Instance of a class.
  */
  restoreActivateConnectionQueryControl(self) {
    // Restore controls' settings.
    // Create and activate summary of targets.
    self.createActivateConnectionQueryTargetSummary(self);
    // Restore search.
    if (self.state.queryCombination === "inclusion") {
      var recordSource = "network";
    } else if (self.state.queryCombination === "exclusion") {
      var recordSource = "subnetwork";
    }
    ViewQuery.restoreQuerySearch({
      search: self.connectionTargetSearch,
      variableName: "queryConnectionTarget",
      recordSource: recordSource,
      state: self.state
    });
    // Restore count.
    // Create options.
    var options = [1, 2, 3, 4, 5].map(function (count) {
      // Determine whether depth matches state variable.
      var match = (count === self.state.queryConnectionCount);
      return {
        label: String(count) + " paths",
        value: count,
        selection: match
      };
    });
    View.createSelectorOptions({
      options: options,
      selector: self.connectionCount,
      documentReference: self.document
    });
  }
  /**
  * Restores and activates summary of targets for connection traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateConnectionQueryTargetSummary(self) {
    self.createActivateConnectionQueryTargetSummaryRows(self);
    self.createActivateConnectionQueryTargetSummaryCells(self);
  }
  /**
  * Creates and activates rows.
  * @param {Object} self Instance of a class.
  */
  createActivateConnectionQueryTargetSummaryRows(self) {
    // Create and activate rows.
    // Select parent.
    var body = d3.select(self.connectionTargetSummary);
    // Define function to access data.
    function access() {
      return self.state.queryConnectionTargets;
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
  createActivateConnectionQueryTargetSummaryCells(self) {
    // Create cells for names, counts, omissions, and replications.
    // Define function to access data.
    function access(element, index, nodes) {
      // Access node's name.
      var name = ViewQuery.accessNodeName({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
      // Organize data.
      var name = {
        type: "name",
        entity: element.type,
        identifier: element.identifier
      };
      var removal = {
        type: "removal",
        entity: element.type,
        identifier: element.identifier
      };
      return [].concat(name, removal);
    };
    // Create children elements by association to data.
    self.cells = View.createElementsData({
      parent: self.rows,
      type: "td",
      accessor: access
    });
    // Create cells for names.
    self.createConnectionQueryTargetSummaryNames(self);
    // Create and activate cells for removals.
    self.createActivateConnectionQueryTargetSummaryRemovals(self);
  }
  /**
  * Creates summary names.
  * @param {Object} self Instance of a class.
  */
  createConnectionQueryTargetSummaryNames(self) {
    // Assign attributes to cells.
    // Assign attributes to elements.
    // Select cells for names.
    self.names = self.cells.filter(function (element, index, nodes) {
      return element.type === "name";
    });
    self.names
    .classed("name", true)
    .text(function (element, index, nodes) {
      return ViewQuery.accessNodeName({
        identifier: element.identifier,
        type: element.entity,
        state: self.state
      });
    });
  }
  /**
  * Creates summary removals.
  * @param {Object} self Instance of a class.
  */
  createActivateConnectionQueryTargetSummaryRemovals(self) {
    // Assign attributes to cells.
    // Assign attributes to elements.
    // Select cells.
    self.removals = self.cells.filter(function (element, index, nodes) {
      return element.type === "removal";
    });
    self.removals.classed("removal", true);
    // Create check boxes.
    // Define function to access data.
    function access(element, index, nodes) {
      return [element];
    };
    // Create children elements by association to data.
    var buttons = View.createElementsData({
      parent: self.removals,
      type: "button",
      accessor: access
    });
    // Assign attributes to elements.
    buttons.text("x");
    // Activate behavior.
    buttons.on("click", function (element, index, nodes) {
      // Call action.
      ActionQuery.excludeConnectionTarget({
        identifier: element.identifier,
        type: element.entity,
        state: self.state
      });
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
  static determineCombinationMatch(type, state) {
    return type === state.queryCombination;
  }
  /**
  * Determines whether a type of traversal matches the value in the
  * application's state.
  * @param {string} type Type of traversal, rogue, proximity, or path.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether type of traversal matches the value in the
  * application's state.
  */
  static determineTypeMatch(type, state) {
    var value = state.queryType;
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
  static activateQuerySearch({search, variableName, recordSource, state} = {}) {
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
        if (variableName === "queryRogueFocus") {
          ActionQuery.changeRogueFocus({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "queryProximityFocus") {
          ActionQuery.changeProximityFocus({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "queryPathSource") {
          ActionQuery.changePathSource({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "queryPathTarget") {
          ActionQuery.changePathTarget({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "queryConnectionTarget") {
          ActionQuery.changeConnectionTarget({
            identifier: identifier,
            type: node.type,
            state: state
          });
        }
      } else {
        // Restore search.
        ViewQuery.restoreTraversalSearch({
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
  static restoreQuerySearch({search, variableName, recordSource, state} = {}) {
    // Determine source of nodes' records.
    if (recordSource === "subnetwork") {
      var nodesRecords = state.subnetworkNodesRecords;
    } else if (recordSource === "network") {
      var nodesRecords = state.networkNodesRecords;
    }
    // Prepare records for search menu's options.
    var optionsRecords = nodesRecords.map(function (record) {
      // Access node's name.
      var name = ViewQuery.accessNodeName({
        identifier: record.identifier,
        type: record.type,
        state: state
      });
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
      // Access node's name.
      var name = ViewQuery.accessNodeName({
        identifier: state[variableName].identifier,
        type: state[variableName].type,
        state: state
      });
      search.value = name;
    } else {
      search.value = "";
    }
  }
  /**
  * Accesses a node's name.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a node.
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {Object} parameters.state Application's state.
  * @returns {string} Node's name.
  */
  static accessNodeName({identifier, type, state} = {}) {
    if (type === "metabolite") {
      // Access information.
      var node = state.networkNodesMetabolites[identifier];
      var candidate = state.candidatesMetabolites[node.candidate];
      var name = candidate.name;
    } else if (type === "reaction") {
      // Access information.
      var node = state.networkNodesReactions[identifier];
      var candidate = state.candidatesReactions[node.candidate];
      var name = candidate.name;
    }
    return name;
  }
}
