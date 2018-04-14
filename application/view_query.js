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
  * @param {Object} parameters.interfaceView Instance of ViewInterface's class.
  * @param {Object} parameters.tipView Instance of ViewTip's class.
  * @param {Object} parameters.promptView Instance of ViewPrompt's class.
  * @param {Object} parameters.controlView Instance of ViewControl's class.
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
      type: "standard",
      target: self.controlView.traversalTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Create and activate button to restore view.
      self.createActivateRestorationButton(self);
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
      self.createActivateTraversalTypeControl("connection", self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create container.
      self.controlContainer = View.createInsertContainer({
        identifier: "traversal-control-container",
        type: "standard",
        target: self.container,
        position: "beforeend",
        documentReference: self.document
      });
      self.controlContainer.classList.add("menu");
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
      self.connection = self.document.getElementById("traversal-connection");
      // Container for traversal's controls.
      self.controlContainer = self
      .document.getElementById("traversal-control-container");
    }
  }
  /**
  * Creates and activates button to restore view's controls.
  * @param {Object} self Instance of a class.
  */
  createActivateRestorationButton(self) {
    var restore = View.createButton({
      text: "restore",
      parent: self.container,
      documentReference: self.document
    });
    restore.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.restoreControls(self.state);
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
      ActionQuery.changeCombination(combination, self.state);
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
      ActionQuery.changeType(type, self.state);
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
    self.union.checked = ViewQuery
    .determineTraversalCombinationMatch("union", self.state);
    self.difference.checked = ViewQuery
    .determineTraversalCombinationMatch("difference", self.state);
    self.rogue.checked = ViewQuery
    .determineTraversalTypeMatch("rogue", self.state);
    self.proximity.checked = ViewQuery
    .determineTraversalTypeMatch("proximity", self.state);
    self.path.checked = ViewQuery
    .determineTraversalTypeMatch("path", self.state);
    self.connection.checked = ViewQuery
    .determineTraversalTypeMatch("connection", self.state);
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
    } else if (self.state.traversalType === "connection") {
      self.createActivateRestoreConnectionTraversalControl(self);
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
    if (self.state.traversalCombination === "union") {
      var recordSource = "network";
    } else if (self.state.traversalCombination === "difference") {
      var recordSource = "subnetwork";
    }
    ViewQuery.activateTraversalSearch({
      search: self.traversalRogueFocusSearch,
      variableName: "traversalRogueFocus",
      recordSource: recordSource,
      state: self.state
    });
    // Activate execute.
    self.execute.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.executeRogueCombination(self.state);
    });
  }
  /**
  * Restores controls for rogue traversal.
  * @param {Object} self Instance of a class.
  */
  restoreRogueTraversalControl(self) {
    // Restore controls' settings.
    // Restore search.
    if (self.state.traversalCombination === "union") {
      var recordSource = "network";
    } else if (self.state.traversalCombination === "difference") {
      var recordSource = "subnetwork";
    }
    ViewQuery.restoreTraversalSearch({
      search: self.traversalRogueFocusSearch,
      variableName: "traversalRogueFocus",
      recordSource: recordSource,
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
    if (self.state.traversalCombination === "union") {
      var recordSource = "network";
    } else if (self.state.traversalCombination === "difference") {
      var recordSource = "subnetwork";
    }
    ViewQuery.activateTraversalSearch({
      search: self.traversalProximityFocusSearch,
      variableName: "traversalProximityFocus",
      recordSource: recordSource,
      state: self.state
    });
    // Activate direction.
    self
    .traversalProximityDirection.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.changeProximityDirection(self.state);
    });
    // Activate depth.
    self
    .traversalProximityDepth.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine value.
      var value = Number(event.currentTarget.value);
      // Call action.
      ActionQuery.changeProximityDepth(value, self.state);
    });
    // Activate execute.
    self.execute.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.executeProximityCombination(self.state);
    });
  }
  /**
  * Restores controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  restoreProximityTraversalControl(self) {
    // Restore controls' settings.
    // Restore search.
    if (self.state.traversalCombination === "union") {
      var recordSource = "network";
    } else if (self.state.traversalCombination === "difference") {
      var recordSource = "subnetwork";
    }
    ViewQuery.restoreTraversalSearch({
      search: self.traversalProximityFocusSearch,
      variableName: "traversalProximityFocus",
      recordSource: recordSource,
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
    if (self.state.traversalCombination === "union") {
      var recordSource = "network";
    } else if (self.state.traversalCombination === "difference") {
      var recordSource = "subnetwork";
    }
    ViewQuery.activateTraversalSearch({
      search: self.traversalPathSourceSearch,
      variableName: "traversalPathSource",
      recordSource: recordSource,
      state: self.state
    });
    // Activate direction.
    self
    .traversalPathDirection.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.changePathDirection(self.state);
    });
    // Activate count.
    self
    .traversalPathCount.addEventListener("change", function (event) {
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
    ViewQuery.activateTraversalSearch({
      search: self.traversalPathTargetSearch,
      variableName: "traversalPathTarget",
      recordSource: recordSource,
      state: self.state
    });
    // Activate execute.
    self.execute.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.executePathCombination(self.state);
    });
  }
  /**
  * Restores controls for path traversal.
  * @param {Object} self Instance of a class.
  */
  restorePathTraversalControl(self) {
    // Restore controls' settings.
    // Restore search.
    if (self.state.traversalCombination === "union") {
      var recordSource = "network";
    } else if (self.state.traversalCombination === "difference") {
      var recordSource = "subnetwork";
    }
    ViewQuery.restoreTraversalSearch({
      search: self.traversalPathSourceSearch,
      variableName: "traversalPathSource",
      recordSource: recordSource,
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
    ViewQuery.restoreTraversalSearch({
      search: self.traversalPathTargetSearch,
      variableName: "traversalPathTarget",
      recordSource: recordSource,
      state: self.state
    });
  }
  /**
  * Creates, activates, and restores controls for connection traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreConnectionTraversalControl(self) {
    self.createActivateConnectionTraversalControl(self);
    self.restoreActivateConnectionTraversalControl(self);
  }
  /**
  * Creates and activates controls for connection traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateConnectionTraversalControl(self) {
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
      self.createConnectionTraversalControl(self);
      // Activate behavior.
      self.activateConnectionTraversalControl(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      self.traversalConnectionTargetSearch = self
      .document.getElementById("traversal-connection-target-search");
      self.traversalConnectionTargetSummary = self
      .document.getElementById("traversal-connection-target-summary");
      self.traversalConnectionCount = self
      .document.getElementById("traversal-connection-count");
    }
  }
  /**
  * Creates controls for connection traversal.
  * @param {Object} self Instance of a class.
  */
  createConnectionTraversalControl(self) {
    // Create summary of targets.
    self.createConnectionTraversalTargetSummary(self);
    // Create button for inclusion.
    self.includeTarget = View.createButton({
      text: "+",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create search menu.
    self.traversalConnectionTargetSearch = View.createSearchOptionsList({
      identifier: "traversal-connection-target-search",
      prompt: "select node...",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create break.
    self.controlContainer.appendChild(self.document.createElement("br"));
    // Create control for count.
    self.traversalConnectionCount = View.createSelector({
      identifier: "traversal-connection-count",
      parent: self.controlContainer,
      documentReference: self.document
    });
    // Create button for execution.
    self.execute = View.createButton({
      text: "execute",
      parent: self.controlContainer,
      documentReference: self.document
    });
  }
  /**
  * Creates and activates summary of targets for connection traversal.
  * @param {Object} self Instance of a class.
  */
  createConnectionTraversalTargetSummary(self) {
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
    self.traversalConnectionTargetSummary = View.createScrollTableBody({
      className: "connection",
      parent: self.controlContainer,
      documentReference: self.document
    });
  }
  /**
  * Activates controls for connection traversal.
  * @param {Object} self Instance of a class.
  */
  activateConnectionTraversalControl(self) {
    // Activate inclusion.
    self.includeTarget.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.includeConnectionTarget(self.state);
    });
    // Activate search.
    if (self.state.traversalCombination === "union") {
      var recordSource = "network";
    } else if (self.state.traversalCombination === "difference") {
      var recordSource = "subnetwork";
    }
    ViewQuery.activateTraversalSearch({
      search: self.traversalConnectionTargetSearch,
      variableName: "traversalConnectionTarget",
      recordSource: recordSource,
      state: self.state
    });
    // Activate count.
    self
    .traversalConnectionCount.addEventListener("change", function (event) {
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
    // Activate execute.
    self.execute.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.executeConnectionCombination(self.state);
    });
  }
  /**
  * Restores and activates controls for connection traversal.
  * @param {Object} self Instance of a class.
  */
  restoreActivateConnectionTraversalControl(self) {
    // Restore controls' settings.
    // Create and activate summary of targets.
    self.createActivateConnectionTraversalTargetSummary(self);
    // Restore search.
    if (self.state.traversalCombination === "union") {
      var recordSource = "network";
    } else if (self.state.traversalCombination === "difference") {
      var recordSource = "subnetwork";
    }
    ViewQuery.restoreTraversalSearch({
      search: self.traversalConnectionTargetSearch,
      variableName: "traversalConnectionTarget",
      recordSource: recordSource,
      state: self.state
    });
    // Restore count.
    // Create options.
    var options = [1, 2, 3, 4, 5].map(function (count) {
      // Determine whether depth matches state variable.
      var match = (count === self.state.traversalConnectionCount);
      return {
        label: String(count) + " paths",
        value: count,
        selection: match
      };
    });
    View.createSelectorOptions({
      options: options,
      selector: self.traversalConnectionCount,
      documentReference: self.document
    });
  }
  /**
  * Restores and activates summary of targets for connection traversal.
  * @param {Object} self Instance of a class.
  */
  createActivateConnectionTraversalTargetSummary(self) {
    self.createActivateConnectionTraversalTargetSummaryRows(self);
    self.createActivateConnectionTraversalTargetSummaryCells(self);
  }
  /**
  * Creates and activates rows.
  * @param {Object} self Instance of a class.
  */
  createActivateConnectionTraversalTargetSummaryRows(self) {
    // Create and activate rows.
    // Select parent.
    var body = d3.select(self.traversalConnectionTargetSummary);
    // Define function to access data.
    function access() {
      return self.state.traversalConnectionTargets;
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
  createActivateConnectionTraversalTargetSummaryCells(self) {
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
    self.createConnectionTraversalTargetSummaryNames(self);
    // Create and activate cells for removals.
    self.createActivateConnectionTraversalTargetSummaryRemovals(self);
  }
  /**
  * Creates summary names.
  * @param {Object} self Instance of a class.
  */
  createConnectionTraversalTargetSummaryNames(self) {
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
  createActivateConnectionTraversalTargetSummaryRemovals(self) {
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
          ActionQuery.changeRogueFocus({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "traversalProximityFocus") {
          ActionQuery.changeProximityFocus({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "traversalPathSource") {
          ActionQuery.changePathSource({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "traversalPathTarget") {
          ActionQuery.changePathTarget({
            identifier: identifier,
            type: node.type,
            state: state
          });
        } else if (variableName === "traversalConnectionTarget") {
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
  static restoreTraversalSearch({search, variableName, recordSource, state} = {}) {
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
