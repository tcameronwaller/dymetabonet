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

// TODO: Network View should always have tabs for it's subordinate views (create and activate these in a general method of ViewGeneral)
// TODO: IF network view creates new instances of filter or context views, then it should assign these to the state variable state.views.filter and state.views.context
// TODO: follow pattern from model for if (self.state.viewsRestoration.subnetwork) ... and ... self.state.views.subnetwork = new ViewSubnetwork({

/**
* Interface to represent and control network's definition.
*/
class ViewNetwork {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.interfaceView Instance of ViewInterface's class.
  * @param {Object} parameters.tipView Instance of ViewTip's class.
  * @param {Object} parameters.promptView Instance of ViewPrompt's class.
  * @param {Object} parameters.panelView Instance of ViewPanel's class.
  * @param {Object} parameters.state Application's state.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  */
  constructor ({interfaceView, tipView, promptView, panelView, state, documentReference} = {}) {
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
    self.panelView = panelView;
    // Control view's composition and behavior.
    // Initialize view.
    self.initializeView(self);
    // Restore view.
    //self.restoreView(self);
  }
  /**
  * Initializes, creates and activates, view's content and behavior that does
  * not vary with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "network",
      type: "standard",
      target: self.panelView.container,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.

      // TODO: create representations of nodes and links in network...
      // TODO: create temporary place-holder text
      var spanNodes = self.document.createElement("span");
      self.container.appendChild(span);
      span.textContent = "coming soon! summary of nodes...";
      var spanLinks = self.document.createElement("span");
      self.container.appendChild(span);
      span.textContent = "coming soon! summary of links...";

      // Create and activate tabs.
      self.createActivateTabs(self);

    } else {
      // Container is not empty.
      // Set references to content.

      // Summary.
      //self.nodesSummary = self.document.getElementById("");


      // Tabs.
      self.filterTab = self.document.getElementById("filter-tab");
      self.contextTab = self.document.getElementById("context-tab");
    }
  }

  // TODO: In restoreView... create filterView and contextView if they're active AND if they need to be restored
  // TODO: If you create them, assign them to the matching state.views variables

}
