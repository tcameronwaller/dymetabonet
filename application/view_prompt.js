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
* Interface to provide transient, specific controls.
* This interface is independent of application's persistent state.
*/
class ViewPrompt {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of ViewInterface's class.
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
      type: "standard",
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
    } else if (self.state.prompt.type === "network-node-abbreviation") {
      self.createActivateRepresentNetworkNodeAbbreviationPrompt(self);
    } else if (self.state.prompt.type === "network-node") {
      self.createActivateRepresentNetworkNodePrompt(self);
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
  * Creates, activates, restores, and represents controls for prompt for
  * network's diagram.
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
      ActionQuery.clearSubnetworkInitializeControls(self.state);
    });
    self.lock.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      // TODO: Call appropriate action... lock all nodes in subnetwork
    });
    self.unlock.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      // TODO: Call appropriate action... unlock all nodes in subnetwork
    });
    self.add.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.executeRogueUnion(self.state);
    });
    // Search.
    ViewQuery.activateTraversalSearch({
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
    ViewQuery.restoreTraversalSearch({
      search: self.search,
      variableName: "traversalRogueFocus",
      recordSource: "network",
      state: self.state
    });
  }
  /**
  * Creates, activates, and represents controls for prompt abbreviation for
  * network's node.
  * @param {Object} self Instance of a class.
  */
  createActivateRepresentNetworkNodeAbbreviationPrompt(self) {
    self.createActivateNetworkNodeAbbreviationPrompt(self);
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
  * Creates and activates controls for prompt abbreviation for network's node.
  * @param {Object} self Instance of a class.
  */
  createActivateNetworkNodeAbbreviationPrompt(self) {
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
      var span = View.createAppendSpanText({
        text: "...",
        parent: self.container,
        documentReference: self.document
      });
      // Activate behavior.
      span.addEventListener("click", function (event) {
        // Element on which the event originated is event.currentTarget.
        // Call action.
        ActionPrompt.changeType({type: "network-node", state: self.state});
      });
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
    }
  }
  /**
  * Creates, activates, and represents controls for prompt for network's node.
  * @param {Object} self Instance of a class.
  */
  createActivateRepresentNetworkNodePrompt(self) {
    self.createActivateNetworkNodePrompt(self);
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
  * Creates and activates controls for prompt for network's node.
  * @param {Object} self Instance of a class.
  */
  createActivateNetworkNodePrompt(self) {
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
      self.createNetworkNodePrompt(self);
      // Activate behavior.
      self.activateNetworkNodePrompt(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
    }
  }
  /**
  * Creates controls for prompt for network's node.
  * @param {Object} self Instance of a class.
  */
  createNetworkNodePrompt(self) {
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
    self.expand = View.createButton({
      text: "expand",
      parent: self.container,
      documentReference: self.document
    });
  }
  /**
  * Activates controls for prompt for network's node.
  * @param {Object} self Instance of a class.
  */
  activateNetworkNodePrompt(self) {
    // Activate behavior.
    // Buttons.
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
    self.expand.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionQuery.executeProximityExpansion(self.state)
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
