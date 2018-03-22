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
* Actions that modify the application's state.
* This class does not store any attributes and does not require instantiation.
* This class stores methods that control actions that modify the application's
* state.
* The methods require a reference to the instance of the state.
* These methods also call external methods as necessary.
*/
class ActionMeasurement {

  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeControls() {
    // Initialize controls.
    var sourceData = {};
    var measurementReference = "pubchem";
    // Compile information.
    var variablesValues = {
      sourceData: sourceData,
      measurementReference: measurementReference
    };
    // Return information.
    return variablesValues;
  }
  /**
  * Restores values of application's variables for controls relevant to view.
  * @param {Object} state Application's state.
  */
  static restoreControls(state) {
    // Initialize controls.
    var controls = ActionMeasurement.initializeControls();
    // Restore information.
    var metabolitesMeasurements = {};
    // Compile variables' values.
    var novelVariablesValues = {
      metabolitesMeasurements: metabolitesMeasurements
    };
    var variablesValues = Object.assign(
      novelVariablesValues,
      controls
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Changes the source of information from file.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.source Reference to file object.
  * @param {Object} parameters.state Application's state.
  */
  static changeSource({source, state} = {}) {
    ActionGeneral.submitStateVariableValue({
      value: source,
      variable: "sourceData",
      state: state
    });
  }
  /**
  * Changes the selection of type of reference to associate measurements to
  * metabolites.
  * @param {string} type Type of reference, pubchem, hmdb, or metanetx.
  * @param {Object} state Application's state.
  */
  static changeReferenceType(type, state) {
    // Compile variables' values.
    var novelVariablesValues = {
      measurementReference: type
    };
    var variablesValues = Object.assign(novelVariablesValues);
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Loads from file a source of information about measurements of metabolites,
  * passing this information to another procedure to import this data.
  * @param {Object} state Application's state.
  */
  static loadImportMeasurements(state) {
    // Determine whether the application's state includes a source file.
    if (Model.determineSourceData(state)) {
      // Application's state includes a source file.
      General.loadParseTextPassObject({
        file: state.sourceData,
        format: "tsv",
        call: ActionMeasurement.importMeasurements,
        parameters: {state: state}
      });
    }
  }
  /**
  * Imports data.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.data Information about measurements of
  * metabolites.
  * @param {Object} parameters.state Application's state.
  */
  static importMeasurements({data, state} = {}) {
    // Remove any information about source from the application's state.
    var sourceData = {};
    // Import information from data.
    // Map measurements to metabolites.
    var metabolitesMeasurements = ActionMeasurement
    .determineMetabolitesMeasurements({
      measurements: data,
      reference: state.measurementReference,
      metabolites: state.metabolites
    });
    // Compile variables' values.
    var novelVariablesValues = {
      sourceData: sourceData,
      metabolitesMeasurements: metabolitesMeasurements
    };
    var variablesValues = Object.assign(
      novelVariablesValues
    );
    // Submit variables' values to the application's state.
    ActionGeneral.submitStateVariablesValues({
      variablesValues: variablesValues,
      state: state
    });
  }
  /**
  * Determines measurements that match metabolites.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.measurements Information about
  * measurements of metabolites.
  * @param {string} parameters.reference Name of a specific reference.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @returns {Object<Object>} Information about measurements of metabolites.
  */
  static determineMetabolitesMeasurements({measurements, reference, metabolites} = {}) {
    return measurements.reduce(function (collectionMeasurements, record) {
      // Access information.
      var identifier = record[reference];
      var value = record.value;
      // Match measurement to metabolites.
      var metabolitesIdentifiers = ActionMeasurement
      .filterMetabolitesReference({
        identifier: identifier,
        reference: reference,
        metabolites: metabolites
      });
      // Create records that match measurement to metabolites.
      return metabolitesIdentifiers
      .reduce(function (collectionMetabolites, metaboliteIdentifier) {
        var record = {
          metabolite: metaboliteIdentifier,
          value: value
        };
        var entry = {
          [metaboliteIdentifier]: record
        }
        return Object.assign(collectionMetabolites, entry);
      }, collectionMeasurements);
    }, {});
  }
  /**
  * Filters metabolites by an identifier for a specific reference.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier for a specific reference.
  * @param {string} parameters.reference Name of a specific reference.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @returns {Array<string>} Identifiers of metabolites.
  */
  static filterMetabolitesReference({identifier, reference, metabolites} = {}) {
    var metabolitesIdentifiers = Object.keys(metabolites);
    return metabolitesIdentifiers.filter(function (metaboliteIdentifier) {
      return metabolites
      [metaboliteIdentifier].references[reference].includes(identifier);
    });
  }

}
