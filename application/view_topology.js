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
* Interface to represent visually the network's topology.
*/
class ViewTopology {
  /**
  * Initializes an instance of a class.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.windowReference Reference to browser's window.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  constructor ({documentReference, windowReference, state} = {}) {
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
    self.interfaceView = self.state.views.interface;
    self.tipView = self.state.views.tip;
    self.promptView = self.state.views.prompt;
    self.explorationView = self.state.views.exploration;
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
      classNames: ["container"],
      type: "graph",
      target: self.explorationView.graph,
      position: "beforeend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
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
      self.base = self.container.querySelector("rect.base")
      self.linksGroup = self.container.querySelector("g.links");
      self.nodesGroup = self.container.querySelector("g.nodes");
    }
  }
  /**
  * Defines link's directional marker.
  * @param {Object} self Instance of a class.
  */
  defineLinkDirectionalMarker(self) {
    // Define links' directional marker.
    var definition = self
    .document.createElementNS("http://www.w3.org/2000/svg", "defs");
    self.container.appendChild(definition);
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
    self.base = self
    .document.createElementNS("http://www.w3.org/2000/svg", "rect");
    self.container.appendChild(self.base);
    self.base.classList.add("base");
    self.base.setAttribute("x", "0px");
    self.base.setAttribute("y", "0px");
    // Activate behavior.
    self.base.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine event's positions.
      var horizontalPosition = event.clientX;
      var verticalPosition = event.clientY;
      // Call action.

      console.log("well hi there. you clicked the base!");

      // TODO: Temporary...
      if (false) {
        ActionExploration.selectNetworkDiagram({
          horizontalPosition: horizontalPosition,
          verticalPosition: verticalPosition,
          state: self.state
        });
      }
    });
    // Zoom and pan behavior.
    var baseSelection = d3.select(self.base);
    baseSelection.call(
      d3.zoom()
      .scaleExtent([0, 25])
      .on("zoom", zoomPan)
    );
    function zoomPan(element, index, nodes) {
      self.nodesGroupSelection.attr("transform", d3.event.transform);
      self.linksGroupSelection.attr("transform", d3.event.transform);
    }
  }
  /**
  * Creates a single group to contain all links.
  * @param {Object} self Instance of a class.
  */
  createLinksGroup(self) {
    // Create group.
    self.linksGroup = self
    .document.createElementNS("http://www.w3.org/2000/svg", "g");
    self.container.appendChild(self.linksGroup);
    self.linksGroup.classList.add("links");
    self.linksGroupSelection = d3.select(self.linksGroup);
  }
  /**
  * Creates a single group to contain all nodes.
  * @param {Object} self Instance of a class.
  */
  createNodesGroup(self) {
    // Create group.
    self.nodesGroup = self
    .document.createElementNS("http://www.w3.org/2000/svg", "g");
    self.container.appendChild(self.nodesGroup);
    self.nodesGroup.classList.add("nodes");
    self.nodesGroupSelection = d3.select(self.nodesGroup);
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Restore positions.
    self.restoreBaseDimensions(self);
    // Prepare information about network's elements.
    self.prepareNetworkElementsRecords(self);
    // Determine dimensions.
    self.determineDimensions(self);
    // Create and activate network's representation.
    self.createActivateNetworkRepresentation(self);
  }
  /**
  * Restores dimensions of diagram's base.
  * @param {Object} self Instance of a class.
  */
  restoreBaseDimensions(self) {
    self.base.setAttribute("width", self.explorationView.graphWidth);
    self.base.setAttribute("height", self.explorationView.graphHeight);
  }
  /**
  * Prepares local records of information about network's elements.
  * @param {Object} self Instance of a class.
  */
  prepareNetworkElementsRecords(self) {
    // Simulation's records for nodes include information about positions.
    // Set references to these records rather than copying them for the sake of
    // convenience, especially to preserve references between links and records
    // for their source and target nodes.
    self.nodesRecords = self.state.simulationNodesRecords;
    // Simulation's records for links include references to nodes.
    self.linksRecords = self.state.simulationLinksRecords;
  }
  /**
  * Determines dimensions for network's visual representations.
  * @param {Object} self Instance of a class.
  */
  determineDimensions(self) {
    // Compute dimensions from scale.
    // Node dimensions.
    self.metaboliteNodeWidth = self.explorationView.scaleLength * 1;
    self.metaboliteNodeHeight = self.explorationView.scaleLength * 0.5;
    self.reactionNodeWidth = self.explorationView.scaleLength * 2.5;
    self.reactionNodeHeight = self.explorationView.scaleLength * 0.75;
    // Link dimensions.
    self.linkThickness = self.explorationView.scaleThickness;
    // Compute font size from scale.
    self.fontSize = self.explorationView.scaleFont;
  }
  /**
  * Creates and activates a visual representation of a network.
  * @param {Object} self Instance of a class.
  */
  createActivateNetworkRepresentation(self) {
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
    // Determine whether to create a temporary or complete representation.
    // Complete representation includes reactions' directionalities.
    if (Model.determineSimulationCompletion(self.state)) {
      // Create and activate complete representation for network.
      self.createActivateCompleteNetworkRepresentation(self);
    } else {
      // Create and activate temporary representation for network.
      self.createActivateTemporaryNetworkRepresentation(self);
    }
  }
  /**
  * Creates and activates a complete visual representation of a network.
  * @param {Object} self Instance of a class.
  */
  createActivateCompleteNetworkRepresentation(self) {
    // Determine information for directional representations of reactions.
    // Determine orientations of reaction's nodes.
    self.determineReactionsNodesOrientations(self);
    // Determine whether the network has any links.
    if (self.linksRecords.length > 0) {
      // Create links.
      // Create links before nodes so that nodes will appear over the links.
      self.createLinks(self);
      // Restore links' positions.
      self.restoreLinksPositions(self);
    }
    // Create nodes.
    self.createActivateNodes(self);
    // Represent reactions' directionalities on their nodes.
    self.createReactionsNodesDirectionalMarks(self);
    // Restore nodes' positions.
    self.restoreNodesPositions(self);
  }
  /**
  * Creates and activates a temporary visual representation of a network.
  * @param {Object} self Instance of a class.
  */
  createActivateTemporaryNetworkRepresentation(self) {
    // Determine whether the network has any links.
    if (self.linksRecords.length > 0) {
      // Create links.
      // Create links before nodes so that nodes will appear over the links.
      self.createLinks(self);
      // Restore links' positions.
      self.restoreLinksPositions(self);
    }
    // Create nodes.
    self.createActivateNodes(self);
    // Remove any previous directions of reactions' nodes.
    self.removeReactionsNodesDirections(self);
    // Restore nodes' positions.
    self.restoreNodesPositions(self);
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
      var link = ViewTopology.accessLink({
        identifier: element.identifier,
        state: self.state
      });
      return link.role === "reactant";
    });
    self.linksMarks.classed("product", function (element, index, nodes) {
      var link = ViewTopology.accessLink({
        identifier: element.identifier,
        state: self.state
      });
      return link.role === "product";
    });
    self.linksMarks.attr("marker-mid", "url(#link-marker)");
    // Determine dimensions for representations of network's elements.
    // Set dimensions of links.
    self.linksMarks.attr("stroke-width", (self.linkThickness));
  }
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
    // Create labels for individual nodes.
    self.createNodesLabels(self);
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
      return !Model.determineNodeEntitySelection({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
    })
    .classed("emphasis", function (element, index, nodes) {
      return Model.determineNodeEntitySelection({
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
    // Activate behavior on click.
    self.activateNodesGroupsClick(self);
    // Activate behavior on hover.
    self.activateNodesGroupsHover(self);
    // Activate behavior on drag.
    self.activateNodesGroupsDrag(self);
  }
  /**
  * Activates nodes's groups on click.
  * @param {Object} self Instance of a class.
  */
  activateNodesGroupsClick(self) {
    // Activate behavior.
    self.nodesGroups.on("click", function (element, index, nodes) {
      // Select element.
      var node = nodes[index];
      var nodeSelection = d3.select(node);
      // Determine whether node's entity has a selection.
      var selection = Model.determineNodeEntitySelection({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
      if (selection) {
        // Do not anchor node's position.
        element.fx = null;
        element.fy = null;
        // Set class.
        nodeSelection.classed("anchor", false);
      } else {
        // Anchor node's position.
        element.fx = element.x;
        element.fy = element.y;
        // Set class.
        nodeSelection.classed("anchor", true);
      }
      // Create prompt view for node.
      // Determine dimensions and positions.
      // Prompt view for node has its center on node's center and shifts
      // proportionally to the node's dimensions.
      var positionDimensions = View.determineElementPositionDimensions(node);
      // Call action.
      ActionExploration.selectNetworkNode({
        identifier: element.identifier,
        type: element.type,
        horizontalPosition: positionDimensions.horizontalPosition,
        verticalPosition: positionDimensions.verticalPosition,
        horizontalShift: (0.75 * (positionDimensions.width / 2)),
        verticalShift: (0.75 * (positionDimensions.height / 2)),
        state: self.state
      });
    });
  }
  /**
  * Activates nodes's groups on hover.
  * @param {Object} self Instance of a class.
  */
  activateNodesGroupsHover(self) {
    // Activate behavior.
    self.nodesGroups.on("mouseenter", function (element, index, nodes) {
      // Determine whether node's entity has a selection.
      var selection = Model.determineNodeEntitySelection({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
      if (selection) {
        // Select element.
        var node = nodes[index];
        var nodeSelection = d3.select(node);
        // Determine event's positions.
        // Determine positions relative to the browser's window.
        var horizontalPosition = d3.event.clientX;
        var verticalPosition = d3.event.clientY;
        // Create prompt view for node.
        // Determine dimensions and positions.
        // Prompt view for node has its center on node's center and shifts
        // proportionally to the node's dimensions.
        var positionDimensions = View.determineElementPositionDimensions(node);
        // Call action.
        ActionExploration.hoverSelectNetworkNode({
          identifier: element.identifier,
          type: element.type,
          horizontalPosition: positionDimensions.horizontalPosition,
          verticalPosition: positionDimensions.verticalPosition,
          horizontalShift: (0.75 * (positionDimensions.width / 2)),
          verticalShift: (0.75 * (positionDimensions.height / 2)),
          state: self.state
        });
      } else {
        // Create tip view for node.
        // Determine event's positions.
        // Determine positions relative to the browser's window.
        var horizontalPosition = d3.event.clientX;
        var verticalPosition = d3.event.clientY;
        // Create tip.
        ViewTopology.createTip({
          identifier: element.identifier,
          type: element.type,
          horizontalPosition: horizontalPosition,
          verticalPosition: verticalPosition,
          tipView: self.tipView,
          documentReference: self.document,
          state: self.state
        });
      }
    });
    self.nodesGroups.on("mousemove", function (element, index, nodes) {
      // Determine whether node's entity has a selection.
      var selection = Model.determineNodeEntitySelection({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
      if (!selection) {
        // Create tip view for node.
        // Determine event's positions.
        var horizontalPosition = d3.event.clientX;
        var verticalPosition = d3.event.clientY;
        // Create tip.
        ViewTopology.createTip({
          identifier: element.identifier,
          type: element.type,
          horizontalPosition: horizontalPosition,
          verticalPosition: verticalPosition,
          tipView: self.tipView,
          documentReference: self.document,
          state: self.state
        });
      }
    });
    self.nodesGroups.on("mouseleave", function (element, index, nodes) {
      // Determine whether node's entity has a selection.
      var selection = Model.determineNodeEntitySelection({
        identifier: element.identifier,
        type: element.type,
        state: self.state
      });
      if (selection) {
        // Remove prompt view.
        self.window.setTimeout(function () {
          ActionPrompt.removeView({permanence: true, state: self.state});
        }, 1000);
      } else {
        // Remove tip view.
        self.tipView.clearView(self.tipView);
      }
    });
  }
  /**
  * Activates nodes's groups on drag.
  * @param {Object} self Instance of a class.
  */
  activateNodesGroupsDrag(self) {
    // Activate behavior.
    self.nodesGroups.call(
      d3.drag()
      .on("start", startDrag)
      .on("drag", continueDrag)
      .on("end", endDrag)
    );
    function startDrag(element, index, nodes) {
      // Select element.
      var node = nodes[index];
      var nodeSelection = d3.select(node);
      // Force simulation to continue while drag event is active.
      if (d3.event.active === 0) {
        // Remove any previous directions of reactions' nodes.
        self.removeReactionsNodesDirections(self);
        // Initiate simulation.
        self.simulation
        .alpha(0.1)
        .alphaDecay(0.03)
        .velocityDecay(0.5)
        .alphaTarget(0.5)
        .alphaMin(0.001)
        .restart();
      }
      // Keep track of initial position.
      element.dragInitialX = element.x;
      element.dragInitialY = element.y;
      // Restore node's position.
      element.fx = element.x;
      element.fy = element.y;
      // Set class.
      nodeSelection.classed("anchor", true);
    }
    function continueDrag(element, index, nodes) {
      // Determine event's positions.
      // Determine positions relative to the container.
      var horizontalPosition = d3.event.x;
      var verticalPosition = d3.event.y;
      // Restore node's position.
      element.fx = horizontalPosition;
      element.fy = verticalPosition;
    }
    function endDrag(element, index, nodes) {
      // Select element.
      var node = nodes[index];
      var nodeSelection = d3.select(node);
      // Allow simulation to terminate when drag event is inactive.
      if (d3.event.active === 0) {
        self.simulation.alphaTarget(0);
      }
      // Determine whether a drag actually happened.
      if (
        (element.x === element.dragInitialX) &&
        (element.y === element.dragInitialY)
      ) {
        // A drag event did not happen.
        // Do not anchor node's position.
        element.fx = null;
        element.fy = null;
        delete element.dragInitialX;
        delete element.dragInitialY;
        // Set class.
        nodeSelection.classed("anchor", false);
      }
      // Leave node as anchor in its current position.
    }
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
    var nodesMarksMetabolites = nodesMarks
    .filter(function (element, index, nodes) {
      return element.type === "metabolite";
    });
    nodesMarksMetabolites.attr("rx", function (element, index, nodes) {
      var node = ViewTopology.accessNode({
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
      var node = ViewTopology.accessNode({
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
  /**
  * Creates labels for nodes in a node-link diagram.
  * @param {Object} self Instance of a class.
  */
  createNodesLabels(self) {
    // Determine whether it is practical to create labels for nodes.
    if (self.nodesRecords.length < 3000) {
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
      nodesLabels.attr("font-size", self.fontSize + "px");
    }
  }
  /**
  * Restores positions of nodes' visual representations according to results of
  * force simulation.
  * @param {Object} self Instance of a class.
  */
  restoreNodesPositions(self) {
    // Restore positions of nodes' marks according to results of simulation.
    // Impose constraints on node positions according to dimensions of graphical
    // container.
    self.nodesGroups.attr("transform", function (element, index, nodes) {
      // Determine coordinates for nodes' marks from results of simulation in
      // nodes' records.
      return "translate(" + element.x + "," + element.y + ")";
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
    if (self.linksMarks.size() > 0) {
      self.linksMarks.attr("points", function (element, index, nodes) {
        // Determine positions of link's termini.
        var link = ViewTopology.accessLink({
          identifier: element.identifier,
          state: self.state
        });
        var termini = ViewTopology.determineLinkTermini({
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
  }
  /**
  * Removes directionality of reaction's nodes.
  * @param {Object} self Instance of a class.
  */
  removeReactionsNodesDirections(self) {
    // Simulation's records for links have renewal with each initiation of a
    // novel simulation.
    // Hence simulation's records for links only have directional information
    // after the simulation completes.
    // Remove any previous directional marks on reactions' nodes.
    self.removeReactionsNodesDirectionalMarks(self);
  }
  /**
  * Removes directional marks from nodes for reactions.
  * @param {Object} self Instance of a class.
  */
  removeReactionsNodesDirectionalMarks(self) {
    var reactionsDirectionalMarks = self
    .nodesGroup.querySelectorAll("polygon.direction, rect.direction");
    View.removeElements(reactionsDirectionalMarks);
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
      // Traversal function needs identifiers of nodes that are source and
      // target of each link.
      // Use original records for subnetwork's links.
      var neighbors = Query.collectNodeNeighbors({
        focus: reactionNode.identifier,
        direction: "neighbors",
        omissionNodes: [],
        omissionLinks: [],
        links: self.state.subnetworkLinksRecords
      });
      // Determine the roles in which metabolites participate in the reaction.
      // Reaction's store information about metabolites' participation.
      // Metabolites can participate in multiple reactions.
      var neighborsRoles = ViewTopology.sortMetabolitesNodesReactionRoles({
        identifiers: neighbors,
        participants: reaction.participants,
        networkNodesMetabolites: self.state.networkNodesMetabolites,
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
      var orientation = ViewTopology.determineReactionNodeOrientation({
        reactionNode: reactionNode,
        reactantsNodes: reactantsNodes,
        productsNodes: productsNodes,
        graphHeight: self.graphHeight
      });
      // Include information about orientation in record for reaction's node.
      // Modify current record to preserve references from existing elements.
      reactionNode.left = orientation.left;
      reactionNode.right = orientation.right;
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
      var type = ViewTopology.determineDirectionalMarkType({
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
      var type = ViewTopology.determineDirectionalMarkType({
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

  // TODO: Consider creating a new class, ViewTopologyUtility to store the static
  // TODO: methods with utility to ViewTopology...


  // TODO: I think that determineNovelNetworkDiagramPositions is no longer necessary...

  /**
  * Determines whether the network's diagram requires mostly novel positions.
  * @param {Array<Object>} nodesRecords Information about network's nodes.
  * @returns {boolean} Whether the network's diagram requires mostly novel
  * positions.
  */
  static determineNovelNetworkDiagramPositions(nodesRecords) {
    // Iterate on records.
    // Count records with positions at origin.
    var originCount = nodesRecords.reduce(function (count, record) {
      // Determine whether record's positions are at origin.
      var origin = ((record.x === 0) && (record.y === 0));
      if (origin) {
        return count + 1;
      } else {
        return count;
      }
    }, 0);
    // Determine whether more than half of records have positions at origin.
    return (originCount > (nodesRecords.length / 3));
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
  * @param {string} parameters.type Type of a node, metabolite or reaction.
  * @param {number} parameters.horizontalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.verticalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {Object} parameters.tipView Instance of ViewTip's class.
  * @param {Object} parameters.documentReference Reference to document object
  * model.
  * @param {Object} parameters.state Application's state.
  */
  static createTip({identifier, type, horizontalPosition, verticalPosition, tipView, documentReference, state} = {}) {
    // Create summary for tip.
    // Access information.
    if (type === "metabolite") {
      var node = state.networkNodesMetabolites[identifier];
      var candidate = state.candidatesMetabolites[node.candidate];
      var entity = state.metabolites[candidate.metabolite];
    } else if (type === "reaction") {
      var node = state.networkNodesReactions[identifier];
      var candidate = state.candidatesReactions[node.candidate];
      var entity = state.reactions[candidate.reaction];
    }
    var name = candidate.name;
    var summary = View.createSpanText({
      text: name,
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
    var direction = ViewTopology.determineReactionDirection({
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
    var sourceShift = ViewTopology.determineLinkTerminusHorizontalShift({
      role: role,
      terminus: source,
      shift: shift
    });
    var targetShift = ViewTopology.determineLinkTerminusHorizontalShift({
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
      if (terminus.hasOwnProperty("left") && terminus.hasOwnProperty("right")) {
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

  // TODO: Maybe use some of these procedures for the detail/summary view for nodes?

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
}
