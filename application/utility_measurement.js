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
* Functionality of utility for associating measurements to metabolites.
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
*/
class Measurement {

  /**
  * Creates initial specifications to sort measurements' summaries.
  * @returns {Object<string>} Specifications to sort measurements' summaries.
  */
  static createInitialMeasurementsSort() {
    return {
      criterion: "value", // or "name"
      order: "descend" // or "ascend"
    };
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
  static createMetabolitesMeasurements({measurements, reference, metabolites} = {}) {
    return measurements.reduce(function (collectionMeasurements, record) {
      // Access information.
      var identifier = record[reference];
      var value = record.value;
      // Match measurement to metabolites.
      var metabolitesIdentifiers = Measurement.filterMetabolitesReference({
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
  /**
  * Prepares summaries of measurements and their associations to metabolites.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<Object>} parameters.metabolitesMeasurements Information about
  * measurements of metabolites.
  * @param {Object<string>} parameters.measurementsSort Specifications to sort
  * measurements' summaries.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @returns {Array<Object>} Summary about measurements of metabolites.
  */
  static prepareMeasurementsSummaries({metabolitesMeasurements, measurementsSort, metabolites} = {}) {
    // Create measurements' summaries.
    var measurementsSummaries = Measurement.createMeasurementsSummaries(
      metabolitesMeasurements
    );

    // TODO: Something isn't right with the sort procedure.
    // TODO: Simplify the sort procedure in utility_general...
    // TODO: avoid having to change the sorts for the other menus...


    // Sort measurements' summaries.
    var sortMeasurementsSummaries = Measurement.sortMeasurementsSummaries({
      measurementsSort: measurementsSort,
      measurementsSummaries: measurementsSummaries,
      metabolites: metabolites
    });
    return sortMeasurementsSummaries;
  }

  /**
  * Creates summaries of measurements and their associations to metabolites.
  * @param {Object<Object>} metabolitesMeasurements Information about
  * measurements of metabolites.
  * @returns {Array<Object>} Summary about measurements of metabolites.
  */
  static createMeasurementsSummaries(metabolitesMeasurements) {
    // Determine minimal and maximal values of measurements.
    var extremes = Measurement
    .determineMeasurementsExtremes(metabolitesMeasurements);
    // Create records for summaries.
    var identifiers = Object.keys(metabolitesMeasurements);
    return identifiers.map(function (identifier) {
      // Access information.
      var value = metabolitesMeasurements[identifier].value;
      // Create record.
      // Return record.
      return {
        metabolite: identifier,
        value: value,
        minimum: extremes.minimum,
        maximum: extremes.maximum
      };
    });
  }
  /**
  * Determines minimal and maximal values of measurements.
  * @param {Object<Object>} metabolitesMeasurements Information about
  * measurements of metabolites.
  * @returns {Object<number>} Minimal and maximal values of measurements.
  */
  static determineMeasurementsExtremes(metabolitesMeasurements) {
    var initialCollection = {
      minimum: 1,
      maximum: 1
    };
    var identifiers = Object.keys(metabolitesMeasurements);
    return identifiers.reduce(function (collection, identifier) {
      // Access information.
      var value = metabolitesMeasurements[identifier].value;
      // Restore minimal and maximal values.
      var minimum = Math.min(collection.minimum, value);
      var maximum = Math.max(collection.maximum, value);
      return {
        minimum: minimum,
        maximum: maximum
      };
    }, initialCollection);
  }
  /**
  * Sorts measurements' summary.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<string>} parameters.measurementsSort Specifications to sort
  * measurements' summaries.
  * @param {Array<Object>} parameters.measurementsSummaries Summary about
  * measurements of metabolites.
  * @param {Object<Object>} parameters.metabolites Information about
  * metabolites.
  * @returns {Array<Object>} Summary about measurements of metabolites.
  */
  static sortMeasurementsSummaries({measurementsSort, measurementsSummaries, metabolites} = {}) {
    // Determine appropriate value by which to sort records.
    if (measurementsSort.criterion === "value") {
      var key = measurementsSort.criterion;
    } else if (measurementsSort.criterion === "name") {
      var key = "metabolite";
    }
    // Determine whether records exist.
    if (measurementsSummaries.length > 0) {
      // Records exist.
      // Sort records.
      var sortMeasurementsSummaries = General.sortArrayRecords({
        array: measurementsSummaries,
        key: key,
        order: measurementsSort.order,
        reference: metabolites,
      });
    } else {
      // Records do not exist.
      var sortMeasurementsSummaries = measurementsSummaries;
    }
    return sortMeasurementsSummaries;
  }

}
