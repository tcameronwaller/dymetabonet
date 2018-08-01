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
* Interface to control import of custom data.
*/
class ViewMeasurement {
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
      identifier: "measurement",
      classNames: ["container", "panel", "control", "tierOne"],
      type: "standard",
      target: self.controlView.measurementTab,
      position: "afterend",
      documentReference: self.document
    });
    // Determine whether to create and activate behavior of content.
    if (self.container.children.length === 0) {
      // Container is empty.
      // Create and activate behavior of content.
      // Restoration
      self.createActivateRestoration(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Load
      self.createActivateLoad(self);
      // Create break.
      self.container.appendChild(self.document.createElement("br"));
      // Create container.
      self.measurementContainer = View.createInsertContainer({
        identifier: "measurement-container",
        target: self.container,
        position: "beforeend",
        documentReference: self.document
      });
    } else {
      // Container is not empty.
      // Set references to content.
      self.sourceLabel = self.container.getElementsByTagName("span").item(0);
      // Container for measurements.
      self.measurementContainer = self
      .document.getElementById("measurement-container");
    }
  }
  /**
  * Creates and activates a control for restoration of view's controls.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoration(self) {
    // Create button.
    var restore = View.createButton({
      text: "restore",
      parent: self.container,
      documentReference: self.document
    });
    // Activate behavior.
    restore.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionMeasurement.restoreControls(self.state);
    });
  }
  /**
  * Creates and activates a control for load from file.
  * @param {Object} self Instance of a class.
  */
  createActivateLoad(self) {
    // Create and activate file selector.
    var load = View.createFileLoadFacade({
      suffix: ".tsv",
      parent: self.container,
      documentReference: self.document
    });
    load.addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionMeasurement.changeSource({
        source: event.currentTarget.files[0],
        state: self.state
      });
    });
    // Create text.
    self.sourceLabel = self.document.createElement("span");
    self.container.appendChild(self.sourceLabel);
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
  * @param {Object} self Instance of a class.
  */
  restoreView(self) {
    // Create view's variant elements.
    // Activate variant behavior of view's elements.
    self.restoreSourceLabel(self);
    // Create, activate, and restore controls or representations of
    // measurements.
    self.createActivateRestoreImportMeasurements(self);
  }
  /**
  * Restores source's label.
  * @param {Object} self Instance of a class.
  */
  restoreSourceLabel(self) {
    // Determine whether the application's state includes a source file.
    if (Model.determineSourceData(self.state)) {
      // Application's state includes a source file.
      var text = self.state.sourceData.name;
    } else {
      // Application's state does not include a source file.
      var text = "... select file...";
    }
    self.sourceLabel.textContent = text;
  }
  /**
  * Creates, activates, and restores controls for import or summary of
  * measurements and their association to metabolites.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreImportMeasurements(self) {
    // Determine relevant content.
    if (Model.determineSourceData(self.state)) {
      // Create, activate, and restore controls for import of information
      // about measurements.
      self.createActivateRestoreImportControl(self);
    } else if (Model.determineMetabolitesMeasurements(self.state)) {
      // Create activate, and restore summary of measurements and their
      // association to metabolites.
      self.createActivateRestoreMeasurementSummary(self);
    } else {
      // Container should be empty.
      // TODO: empty measurementContainer...
    }
  }
  /**
  * Creates, activates, and restores controls for import of measurements.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreImportControl(self) {
    self.createActivateImportControl(self);
    self.restoreImportControl(self);
  }
  /**
  * Creates and activates controls for import of measurements.
  * @param {Object} self Instance of a class.
  */
  createActivateImportControl(self) {
    // Determine whether container's current content matches view's novel type.
    // Container's class indicates type of content.
    if (!self.measurementContainer.classList.contains("import")) {
      // Container's current content does not match view's novel type.
      // Remove container's previous contents and assign a class name to
      // indicate view's novel type.
      View.removeContainerContentSetClass({
        container: self.measurementContainer,
        className: "import"
      });
      // Create content.
      // Activate behavior.
      // Create and activate controls for type of reference.
      self.createActivateReferenceTypeControl("pubchem", self);
      self.createActivateReferenceTypeControl("hmdb", self);
      self.createActivateReferenceTypeControl("metanetx", self);
      // Create break.
      self.measurementContainer.appendChild(self.document.createElement("br"));
      // Import button.
      self.createActivateImport(self);
    } else {
      // Container's current content matches view's novel type.
      // Set references to content.
      // Control for type of reference.
      self.pubchem = self
      .document.getElementById("measurement-reference-pubchem");
      self.hmdb = self.document.getElementById("measurement-reference-hmdb");
      self.metanetx = self
      .document.getElementById("measurement-reference-metanetx");
    }
  }
  /**
  * Creates and activates a control for the type of reference.
  * @param {string} type Type of reference, pubchem, hmdb, or metanetx.
  * @param {Object} self Instance of a class.
  */
  createActivateReferenceTypeControl(type, self) {
    // Create control for type of traversal.
    var identifier = "measurement-reference-" + type;
    self[type] = View.createRadioButtonLabel({
      identifier: identifier,
      value: type,
      name: "measurement-reference",
      className: "reference",
      text: type,
      parent: self.measurementContainer,
      documentReference: self.document
    });
    // Activate behavior.
    self[type].addEventListener("change", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Determine type.
      var type = event.currentTarget.value;
      // Call action.
      ActionMeasurement.changeReferenceType(type, self.state);
    });
  }
  /**
  * Creates and activates a control to import measurements.
  * @param {Object} self Instance of a class.
  */
  createActivateImport(self) {
    // Create button.
    var importButton = View.createButton({
      text: "import",
      parent: self.measurementContainer,
      documentReference: self.document
    });
    // Activate behavior.
    importButton.addEventListener("click", function (event) {
      // Element on which the event originated is event.currentTarget.
      // Call action.
      ActionMeasurement.loadImportMeasurements(self.state);
    });
  }
  /**
  * Restores controls for import of measurements.
  * @param {Object} self Instance of a class.
  */
  restoreImportControl(self) {
    // Restore controls' settings.
    self.pubchem.checked = ViewMeasurement
    .determineReferenceTypeMatch("pubchem", self.state);
    self.hmdb.checked = ViewMeasurement
    .determineReferenceTypeMatch("hmdb", self.state);
    self.metanetx.checked = ViewMeasurement
    .determineReferenceTypeMatch("metanetx", self.state);
  }
  /**
  * Creates, activates, and restores a summary of measurements and their
  * association to metabolites.
  * @param {Object} self Instance of a class.
  */
  createActivateRestoreMeasurementSummary(self) {
    self.initializeMeasurementSummary(self);
    self.restoreMeasurementSummary(self);
  }
  /**
  * Creates and activates summary of measurements.
  * @param {Object} self Instance of a class.
  */
  initializeMeasurementSummary(self) {
    // Determine whether container's current content matches view's novel type.
    // Container's class indicates type of content.
    if (!self.measurementContainer.classList.contains("summary")) {
      // Container's current content does not match view's novel type.
      // Remove container's previous contents and assign a class name to
      // indicate view's novel type.
      View.removeContainerContentSetClass({
        container: self.measurementContainer,
        className: "summary"
      });
      // Create content.
      // Activate behavior.
      self.createActivateMeasurementSummary(self);

      // TODO: create a table that's sortable and all that jazz...
      // TODO: sorts are the main behavior to activate, I think...

    } else {
      // Container's current content matches view's novel type.
      // Set references to content.

      // column sorts
      // bar chart graph width and height (for scale)
      // column scale
      // table body

      // TODO: probably need a reference to the table's body...
    }
  }
  /**
  * Creates and activates a table to summarize measurements.
  * @param {Object} self Instance of a class.
  */
  createActivateMeasurementSummary(self) {
    // Create separate tables for head and body to support stationary head and
    // scrollable body.
    // Create head table.
    self.createActivateMeasurementSummaryTableHead(self);
    // Create body table.
    self.body = View.createScrollTableBody({
      className: "measurement",
      parent: self.measurementContainer,
      documentReference: self.document
    });
  }
  /**
  * Creates and activates the head of a table to summarize measurements.
  * @param {Object} self Instance of a class.
  */
  createActivateMeasurementSummaryTableHead(self) {
    // Create head table.
    var tableHeadRow = View.createTableHeadRow({
      className: "measurement",
      parent: self.measurementContainer,
      documentReference: self.document
    });
    // Create titles, sorts, and scale in table's header.
    // Create head for names.
    var referencesName = View.createActivateTableColumnHead({
      attribute: "name",
      text: "Name",
      type: "measurement",
      category: "measurement",
      sort: true,
      scale: false,
      parent: tableHeadRow,
      documentReference: self.document,
      state: self.state
    });
    self.sortGraphName = referencesName.sortGraph;
    // Create head for counts.
    var referencesValue = View.createActivateTableColumnHead({
      attribute: "value",
      text: "Value",
      type: "measurement",
      category: "measurement",
      sort: true,
      scale: true,
      parent: tableHeadRow,
      documentReference: self.document,
      state: self.state
    });
    self.sortGraphValue = referencesValue.sortGraph;
    self.scaleGraph = referencesValue.scaleGraph;
    self.graphWidth = referencesValue.graphWidth;
    self.graphHeight = referencesValue.graphHeight;
  }
  /**
  * Restores summary of measurements.
  * @param {Object} self Instance of a class.
  */
  restoreMeasurementSummary(self) {
    // TODO: represent sorts...
    //self.representSorts(self);

    // TODO: create rows for measurements in tbody...

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
      attribute: "value",
      sorts: self.state.setsSorts,
      parent: self.sortGraphCount,
      documentReference: self.document
    });
  }


  /**
  * Determines whether a type of reference matches the value in the
  * application's state.
  * @param {string} type Type of reference, pubchem, hmdb, or metanetx.
  * @param {Object} state Application's state.
  * @returns {boolean} Whether type of reference matches the value in the
  * application's state.
  */
  static determineReferenceTypeMatch(type, state) {
    var value = state.measurementReference;
    return value === type;
  }
}
