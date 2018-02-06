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
* Functionality of general utility.
* This class stores methods for external utility.
* This class does not store any attributes and does not require instantiation.
*/
class General {

  // Methods for file system.

  /**
  * Accesses a file at a specific path within application's directory.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.path Directory path and file name.
  * @param {Object} parameters.call Function to call upon completion of file
  * read.
  * @param {Object} parameters.parameters Parameters for the function to call
  * upon completion of file read.
  */
  static loadPassObjectByFilePath({path, call, parameters} = {}) {
    d3.json("state_default.json", function (data) {
      // Include the data in the parameters to pass to the call function.
      var dataParameter = {data: data};
      var newParameters = Object.assign({}, parameters, dataParameter);
      // Call function with new parameters.
      call(newParameters);
    });
    if (false) {
      var request = new XMLHttpRequest();
      request.overrideMimeType("application/json");
      request.open("GET", path, true);
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.state === "200") {
          // Include the data in the parameters to pass to the call function.
          var dataParameter = {data: request.responseText};
          var newParameters = Object.assign({}, parameters, dataParameter);
          // Call function with new parameters.
          call(newParameters);
        }
      };
      request.send(null);
    }
  }
  /**
  * Loads from file a version of an object in JavaScript Object Notation
  * (JSON) and passes this object to another function along with appropriate
  * parameters.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.file File with object to load.
  * @param {Object} parameters.call Function to call upon completion of file
  * read.
  * @param {Object} parameters.parameters Parameters for the function to call
  * upon completion of file read.
  */
  static loadPassObject({file, call, parameters} = {}) {
    // Create a file reader object.
    var reader = new FileReader();
    // Specify operation to perform after file loads.
    reader.onload = function (event) {
      // Element on which the event originated is event.currentTarget.
      // After load, the file reader's result attribute contains the
      // file's contents, according to the read method.
      var data = JSON.parse(event.currentTarget.result);
      // Include the data in the parameters to pass to the call function.
      var dataParameter = {data: data};
      var newParameters = Object.assign({}, parameters, dataParameter);
      // Call function with new parameters.
      call(newParameters);
    };
    // Read file as text.
    reader.readAsText(file);
  }
  /**
  * Saves to file on client's system a version of an object in JavaScript
  * Object Notation (JSON).
  * @param {string} name Name of file.
  * @param {Object} object Object in memory to save.
  */
  static saveObject(name, object) {
    var objectJSON = JSON.stringify(object);
    var blob = new Blob([objectJSON], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var reference = document.createElement("a");
    reference.setAttribute("href", url);
    reference.setAttribute("download", name);
    document.body.appendChild(reference);
    reference.click();
    document.body.removeChild(reference);
  }
  /**
  * Saves to file on client's system a string in plain text format.
  * @param {string} name Name of file.
  * @param {string} string String in memory to save.
  */
  static saveString(name, string) {
    var blob = new Blob([string], {type: "text/plain"});
    var url = URL.createObjectURL(blob);
    var reference = document.createElement("a");
    reference.setAttribute("href", url);
    reference.setAttribute("download", name);
    document.body.appendChild(reference);
    reference.click();
    document.body.removeChild(reference);
  }
  /**
  * Converts information from records to a string table with tab separation.
  * @param {Array<Object>} records Records of information.
  * @returns String table with tab separation.
  */
  static convertRecordsStringTabSeparateTable(records) {
    // Specify delimiter or separator and line ending.
    var separator = "\t";
    var end = "\r\n";
    // Prepare head row.
    // Assume that all records have same keys.
    // Assume that these keys are strings.
    var keys = Object.keys(records[0]);
    var headRow = keys.reduce(function (string, key) {
      // Combine to collection.
      if (string.length === 0) {
        return String(string + "\"" + key + "\"");
      } else {
        return String(string + separator + "\"" + key + "\"");
      }
    }, "");
    // Prepare body rows.
    var bodyRows = records.map(function (record) {
      return keys.reduce(function (string, key) {
        // Access key's value in record.
        var value = record[key];
        // Determine value's representation according to its type.
        // Procedure supports types null, undefined, boolean, number, string,
        // symbol, and array.
        // Procedure does not support more complex types of object.
        var type = General.determineValueType(value);
        if (type === "null" || type === "undefined") {
          var representation = String("\"" + "null" + "\"");
        } else if (type === "boolean" || type === "number") {
          var representation = String(value);
        } else if (type === "string" || type === "symbol") {
          var representation = String("\"" + value + "\"");
        } else if (type === "array") {
          var representation = value.join(",");
        }
        // Combine to collection.
        if (string.length === 0) {
          return String(string + representation);
        } else {
          return String(string + separator + representation);
        }
      }, "");
    });
    // Combine rows.
    var rows = [].concat([headRow], bodyRows);
    var string = rows.join(end);
    return string;
  };

  // Methods for document object model (DOM).
  // TODO: Consider placing all of these methods within a separate utility class...

  /**
  * Removes from the Document Object Model (DOM) elements that do not have
  * specific values of a specific attribute.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.values Values of the attribute.
  * @param {string} parameters.attribute Attribute of interest.
  * @param {Object} parameters.elements Elements in the Document Object
  * Model (DOM).
  */
  static filterRemoveDocumentElements({values, attribute, elements} = {}) {
    Array.from(elements).forEach(function (element) {
      if (
        (!element.hasAttribute(attribute)) ||
        (!values.includes(element.getAttribute(attribute)))
      ) {
        element.parentElement.removeChild(element);
      }
    });
  }
  /**
  * Removes from the Document Object Model (DOM) all elements that are
  * children of a specific element.
  * @param {Object} element Element in the Document Object Model.
  */
  static removeDocumentChildren(element) {
    Array.from(element.children).forEach(function (child) {
      element.removeChild(child);
    });
  }
  /**
  * Extracts the values from elements in the Document Object Model (DOM).
  * @param {Object} elements Elements in the Document Object Model (DOM).
  * @returns {Array<string>} Values from elements.
  */
  static extractValuesDocumentElements(elements) {
    var values = [];
    Array.from(elements).forEach(function (element) {
      values.push(element.value);
    });
    return values;
  }
  /**
  * Determines the value of the only active radio button in a group.
  * @param {Object} radios Live collection of radio button elements in the
  * Document Object Model (DOM).
  * @returns {string} Value of the only active radio button from the group.
  */
  static determineRadioGroupValue(radios) {
    // Assume that only a single radio button in the group is active.
    return Array.from(radios).filter(function (radio) {
      return radio.checked;
    })[0].value;
  }
  /**
  * Determines the final dimensions in pixels of an element's attribute within
  * the document object model (DOM).
  * @param {Object} element Reference to an element within the DOM.
  * @param {string} attribute Attribute---width, height or fontSize---to
  * determine.
  * @returns {number} Dimension of the element's attribute in pixels.
  */
  static determineElementDimension(element, attribute) {
    // Alternative is to use element.getBoundingClientRect().
    // Alternative may also be to use d3.style(node, name).
    return parseFloat(
      window.getComputedStyle(element)[attribute].replace("px", "")
    );
  }

  // Methods for graphs.

  /**
  * Extracts from nodes' records coordinates for positions from force
  * simulation.
  * @param {Array<Object>} nodes Records for nodes with positions from force
  * simulation.
  * @returns {Array<Object<number>>} Coordinates for nodes' positions.
  */
  static extractNodesCoordinates(nodes) {
    return nodes.map(function (node) {
      return General.extractNodeCoordinates(node);
    });
  }
  /**
  * Extracts from a node's record coordinates for position from force
  * simulation.
  * @param {Object} node Record for a node with position from force simulation.
  * @returns {Object<number>} Coordinates for node's position.
  */
  static extractNodeCoordinates(node) {
    return {
      x: node.x,
      y: node.y
    };
  }
  /**
  * Converts and normalizes coordinates of radial points relative to a central
  * origin.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object<number>>} parameters.pointsCoordinates Records of
  * coordinates for points around a central origin.
  * @param {Object<number>} parameters.originCoordinates Record of coordinates
  * for a central origin.
  * @param {number} parameters.graphHeight Vertical dimension of graphical
  * container.
  * @returns {Array<Object>} Records of coordinates for points around a central
  * origin.
  */
  static convertNormalizeRadialCoordinates({pointsCoordinates, originCoordinates, graphHeight} = {}) {
    // Convert and normalize points' coordinates.
    return pointsCoordinates.map(function (pointCoordinates) {
      // Convert coordinates relative to origin on standard coordinate plane.
      var standardCoordinates = General.convertGraphCoordinates({
        pointX: pointCoordinates.x,
        pointY: pointCoordinates.y,
        originX: originCoordinates.x,
        originY: originCoordinates.y,
        height: graphHeight
      });
      // Compute measurement in radians of the positive angle in standard
      // position for the ray to the point.
      var angle = General.computeCoordinatesPositiveAngleRadians({
        x: standardCoordinates.x,
        y: standardCoordinates.y
      });
      // Compute coordinates of point at which a ray for the angle intersects
      // the unit circle at a radius of 1 unit from the origin.
      var normalCoordinates = General.computeAngleUnitIntersection(angle);
      // Return coordinates.
      return {
        x: normalCoordinates.x,
        y: normalCoordinates.y
      };
    });
  }
  /**
  * Converts the coordinates of a point within a scalable vector graph.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.pointX Point's coordinate on x-axis or abscissa.
  * @param {number} parameters.pointY Point's coordinate on y-axis or ordinate.
  * @param {number} parameters.originX Origin's coordinate on x-axis or
  * abscissa.
  * @param {number} parameters.originY Origin's coordinate on y-axis or
  * ordinate.
  * @param {number} parameters.height Height in pixels of scalable vector graph.
  * @returns {Object<number>} Coordinates of point.
  */
  static convertGraphCoordinates({pointX, pointY, originX, originY, height} = {}) {
    // The coordinates of scalable vector graphs originate at the top left
    // corner.
    // Coordinates of the x-axis or abscissa increase towards the right.
    // Coordinates of the y-axis or ordinate increase towards the bottom.
    // Invert the coordinates of the y-axis or ordinate.
    var pointYFlip = height - pointY;
    var originYFlip = height - originY;
    // Shift the point's coordinates relative to the new origin.
    var pointXShift = pointX - originX;
    var pointYShift = pointYFlip - originYFlip;
    // Return coordinates.
    return {
      x: pointXShift,
      y: pointYShift
    };
  }
  /**
  * Computes measurement in radians of the positive angle in standard position
  * with vertex at origin of coordinate plane, initial side on positive x-axis,
  * and terminal side to some point with specific coordinates.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.x Point's coordinate on x-axis or abscissa.
  * @param {number} parameters.y Point's coordinate on y-axis or ordinate.
  * @returns {number} Measurement of positive angle in radians.
  */
  static computeCoordinatesPositiveAngleRadians({x, y} = {}) {
    // Compute measurement in radians of the angle.
    // By default, angle with terminal side in quadrants 1 or 2 of coordinate
    // plane is positive.
    // By default, angle with terminal side in quadrants 3 or 4 of coordinate
    // plane is negative.
    var result = Math.atan2(y, x);
    // Determine if angle is positive or negative.
    if (result > 0) {
      // Angle is positive.
      var positiveResult = result;
    } else {
      // Angle is negative.
      // Convert negative angle to positive angle.
      var positiveResult = (2 * Math.PI) - result;
    }
    // Return measurement in radians of positive angle.
    return positiveResult;
  }
  /**
  * Converts an angle's measurement in radians to degrees.
  * @param {number} radians An angle's measurement in radians.
  * @returns {number} Angle's measurement in degrees.
  */
  static convertAngleRadiansDegrees(radians) {
    return radians * (180 / Math.PI);
  }
  /**
  * Computes coordinates of point at which an angle's terminal side intersects
  * the unit circle at a radius of 1 unit from the origin.
  * @param {number} angle Measurement of positive angle in radians.
  * @returns {Object<number>} Coordinates of point.
  */
  static computeAngleUnitIntersection(angle) {
    // Unit circle has a radius of 1 unit.
    // Hypotenuse of right triangle relevant to coordinates of any point on unit
    // circle has length of 1 unit.
    // Cosine of angle (adjacent/hypotenuse) is equal to the coordinate on
    // x-axis or abscissa of the point at which angle's terminal side intersects
    // unit circle.
    // Sine of angle (opposite/hypotenuse) is equal to the coordinate on y-axis
    // or ordinate of the point at which angle's terminal side intersects unit
    // circle.
    // Compute coordinates of the point at which angle's terminal side
    // intersects unit circle.
    var pointX = Math.cos(angle);
    var pointY = Math.sin(angle);
    // Return coordinates.
    return {
      x: pointX,
      y: pointY
    };
  }
  /**
  * Creates points for the source, center, and target vertices of a straight
  * polyline.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object<number>} parameters.source Records of coordinates for point
  * at source.
  * @param {Object<number>} parameters.target Record of coordinates for point at
  * target.
  * @returns {string} Definitions of points for a straight polyline.
  */
  static createStraightPolylinePoints({source, target} = {}) {
    var center = {
      x: General.computeElementsMean([source.x, target.x]),
      y: General.computeElementsMean([source.y, target.y])
    };
    return General.createPointsString([source, center, target]);
  }
  /**
  * Creates points for vertices of a horizontal, isosceles triangle.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.base Dimension of triangle's base.
  * @param {number} parameters.altitude Dimension of triangle's altitude.
  * @param {string} parameters.orientation Orientation, up, right, down, or left
  * in which the triangle's apex faces.
  * @returns {string} Definitions of points for an horizontal, isosceles
  * triangle.
  */
  static createIsoscelesTrianglePoints({base, altitude, orientation} = {}) {
    // The coordinates of scalable vector graphs originate at the top left
    // corner.
    // Coordinates of the x-axis or abscissa increase towards the right.
    // Coordinates of the y-axis or ordinate increase towards the bottom.
    // Determine direction in which triangle's apex faces.
    if (orientation === "up") {
      // Triangle's apex faces up.
      // Determine coordinates of triangle's vertices.
      var vertex1 = {
        x: (base / 2),
        y: 0
      };
      var vertex2 = {
        x: base,
        y: altitude
      };
      var vertex3 = {
        x: 0,
        y: altitude
      };
    } else if (orientation === "right") {
      // Triangle's apex faces right.
      // Determine coordinates of triangle's vertices.
      var vertex1 = {
        x: 0,
        y: 0
      };
      var vertex2 = {
        x: altitude,
        y: (base / 2)
      };
      var vertex3 = {
        x: 0,
        y: base
      };
    } else if (orientation === "down") {
      // Triangle's apex faces down.
      // Determine coordinates of triangle's vertices.
      var vertex1 = {
        x: 0,
        y: 0
      };
      var vertex2 = {
        x: base,
        y: 0
      };
      var vertex3 = {
        x: (base / 2),
        y: altitude
      };
    } else if (orientation === "left") {
      // Triangle's apex faces left.
      // Determine coordinates of triangle's vertices.
      var vertex1 = {
        x: altitude,
        y: 0
      };
      var vertex2 = {
        x: altitude,
        y: base
      };
      var vertex3 = {
        x: 0,
        y: (base / 2)
      };
    }
    return General.createPointsString([vertex1, vertex2, vertex3]);
  }
  /**
  * Creates string for graphical points from coordinates of vertices.
  * @param {Array<Object<number>>} points Records of coordinates for points of
  * vertices.
  * @returns {string} Definition of point.
  */
  static createPointsString(points) {
    return points.reduce(function (string, point) {
      if (string.length > 0) {
        // String is not empty.
        // String contains previous points.
        // Include delimiter between previous points and current point.
        var delimiter = " ";
      } else {
        // String is empty.
        // String does not contain previous points.
        // Do not include delimiter.
        var delimiter = "";
      }
      // Compose previous and current points.
      return (string + delimiter + point.x + "," + point.y);
    }, "");
  }

  // Methods for calculations.

  /**
  * Computes the sum of elements in an array.
  * @param {Array<number>} elements Array of elements.
  * @returns {number} Sum of elements.
  */
  static computeElementsSum(elements) {
    return elements.reduce(function (sum, value) {
      return sum + value;
    }, 0);
  }
  /**
  * Computes the mean of elements in an array.
  * @param {Array<number>} elements Array of elements.
  * @returns {number} Arithmetic mean of elements.
  */
  static computeElementsMean(elements) {
    var sum = General.computeElementsSum(elements);
    return sum / elements.length;
  }
  /**
  * Determines the maximal value.
  * @param {Array<number>} numbers Numbers to compare.
  * @returns {number} Number of maximal value.
  */
  static determineMaximum(numbers) {
    return numbers.reduce(function (maximum, number) {
      return Math.max(maximum, number);
    });
  }
  /**
  * Determines the minimal value.
  * @param {Array<number>} numbers Numbers to compare.
  * @returns {number} Number of minimal value.
  */
  static determineMinimum(numbers) {
    return numbers.reduce(function (minimum, number) {
      return Math.min(minimum, number);
    });
  }
  /**
  * Calculates the frequencies of each value in a collection of data.
  * Sequential identifiers of bins represent all intervals across the
  * distribution, including those that are empty.
  * Omits records and frequencies for these empty intervals.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.records Information about records and
  * their values.
  * @param {string} parameters.key Key for values in records.
  * @param {number} parameters.count Count of bins for values.
  * @returns {Array<Object>} Shallow copies of original records with information
  * about bins and frequencies of records in each bin.
  */
  static calculateRecordsValuesFrequencies({records, key, count} = {}) {
    // Calculate frequencies of values in intervals across the distribution.
    var values = records.map(function (record) {
      return record[key];
    });
    var distributionBins = General.calculateDistributionIntervalFrequencies({
      values: values,
      count: count
    });
    // Include information about bins and frequencies in records.
    var recordsFrequencies = records.map(function (record) {
      // Determine record's value.
      var value = record[key];
      // Identify bin to which record's value belongs.
      var recordBin = distributionBins.find(function (bin) {
        return (bin.minimum <= value && value < bin.maximum);
      });
      // Create new record with information about bin and frequency.
      var novelAttributes = {
        bin: recordBin.identifier,
        frequency: recordBin.frequency
      };
      var novelRecord = Object.assign(record, novelAttributes);
      // Replace previous record in the collection.
      return novelRecord;
    });
    return recordsFrequencies;
  }
  /**
  * Calculates the frequencies of values within each interval across a
  * distribution.
  * These frequencies represent the distribution and are useful to create an
  * histogram.
  * This distribution includes empty intervals.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<number>} parameters.values Values in a distribution.
  * @param {number} parameters.count Count of bins for values.
  * @returns {Array<Object<number>>} Records with information about bins at
  * regular, equal intervals and frequencies of values within each bin.
  */
  static calculateDistributionIntervalFrequencies({values, count} = {}) {
    // Create bins for values at regular, equal intervals.
    var bins = General.createValuesBins({
      values: values,
      count: count
    });
    // Count records that belong to each bin.
    var binsFrequencies = values.reduce(function (binsCollection, value) {
      // Identify bin to which value belongs.
      var index = binsCollection.findIndex(function (bin) {
        return (bin.minimum <= value && value < bin.maximum);
      });
      // Create new record for bin with incremental frequency.
      var novelAttribute = {
        frequency: binsCollection[index].frequency + 1
      };
      var novelBin = Object.assign(binsCollection[index], novelAttribute);
      // Replace bin's previous record in the collection.
      var previousBins = General.copyArrayOmitElements({
        array: binsCollection,
        index: index,
        count: 1
      });
      var currentBins = [].concat(previousBins, novelBin);
      return currentBins;
    }, bins);
    // Sort bins by sequential identifiers.
    var sortBins = binsFrequencies.slice().sort(function (firstBin, secondBin) {
      return (
        firstBin.identifier - secondBin.identifier
      );
    });
    // Return bins.
    return sortBins;
  }
  /**
  * Creates bins for values with regular, equal intervals.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<number>} parameters.values Values to assign to bins.
  * @param {number} parameters.count Count of bins to create.
  * @returns {Array<Object<number>>} Bins for values with regular, equal
  * intervals.
  */
  static createValuesBins({values, count} = {}) {
    // Determine regular equal interval of bins.
    // Determine interval from one unit less than count to compensate for
    // inclusivity in definition of bin's intervals.
    var minimum = General.determineMinimum(values);
    var maximum = General.determineMaximum(values);
    var interval = (maximum - minimum) / (count - 1);
    // Create bins.
    var bins = General.createNovelBin({
      minimum: minimum,
      interval: interval,
      maximum: maximum,
      bins: []
    });
    return bins;
  }
  /**
  * Creates a novel bin and includes it in a collection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {number} parameters.minimum Minimal value.
  * @param {number} parameters.interval Regular, equal interval of bins.
  * @param {number} parameters.maximum Maximal value.
  * @param {Array<Object<number>>} bins Bins for values with regular, equal
  * intervals.
  * @returns {Array<Object<number>>} Bins for values with regular, equal
  * intervals.
  */
  static createNovelBin({minimum, interval, maximum, bins} = {}) {
    // Determine values for novel bin.
    var currentIdentifier = bins.length + 1;
    var currentMinimum = minimum;
    var currentMaximum = minimum + interval;
    // Create novel bin.
    var novelBin = {
      identifier: currentIdentifier,
      minimum: currentMinimum,
      maximum: currentMaximum,
      frequency: 0
    };
    // Include novel bin in collection.
    var currentBins = [].concat(bins, novelBin);
    // Determine whether there are more bins to create.
    if (currentMaximum < (maximum + interval)) {
      // Create another bin.
      return General.createNovelBin({
        minimum: currentMaximum,
        interval: interval,
        maximum: maximum,
        bins: currentBins
      });
    } else {
      // Return bins.
      return currentBins;
    }
  }
  /**
  * Calculates the count of bins across a distribution from a target interval.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<number>} parameters.values Values to assign to bins.
  * @param {number} parameters.interval Regular, equal interval of bins.
  * @returns {number} Count of bins for the target interval.
  */
  static calculateDistributionIntervalCount({values, interval} = {}) {
    var minimum = General.determineMinimum(values);
    var maximum = General.determineMaximum(values);
    var count = (maximum - minimum) / interval;
    return count;
  }

  // Methods for management of values.

  /**
  * Includes novel entries in a collection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.values Records of information.
  * @param {Object} parameters.entries Collection of entries.
  * @returns {Object} Collection of entries.
  */
  static includeNovelEntries({values, entries} = {}) {
    return values.reduce(function (collection, value) {
      return General.includeNovelEntry({
        value: value,
        entries: collection
      });
    }, entries);
  }
  /**
  * Includes novel entry in a collection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.value Record of information.
  * @param {Object} parameters.entries Collection of entries.
  * @returns {Object} Collection of entries.
  */
  static includeNovelEntry({value, entries} = {}) {
    // For efficiency, this procedure does not copy values thoroughly.
    // Determine whether entries include an entry for the value.
    if (entries.hasOwnProperty(value.identifier)) {
      // Entries include an entry for the value.
      // Preserve entries.
      return entries;
    } else {
      // Entries do not include an entry for the value.
      // Include entry for the value.
      // Create entry.
      var entry = {
        [value.identifier]: value
      };
      // Include entry.
      return Object.assign(entries, entry);
    }
  }
  /**
  * Includes novel records in a collection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.records Records of information.
  * @param {Array<Object>} parameters.collection Collection of records.
  * @returns {Array<Object>} Collection of records.
  */
  static includeNovelRecords({records, collection} = {}) {
    return records.reduce(function (novelCollection, record) {
      return General.includeNovelRecord({
        record: record,
        collection: novelCollection
      });
    }, collection);
  }
  /**
  * Includes a novel record in a collection.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.record Record of information.
  * @param {Array<Object>} parameters.collection Collection of records.
  * @returns {Array<Object>} Collection of records.
  */
  static includeNovelRecord({record, collection} = {}) {
    // Determine whether the record is novel in the collection.
    var match = collection.some(function (collectionRecord) {
      return collectionRecord.identifier === record.identifier;
    });
    if (match) {
      return collection;
    } else {
      return [].concat(collection, record);
    }
  }
  /**
  * Copies an object's entries and includes or excludes a single entry.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.value Entry's value with identifier.
  * @param {Object<Object>} parameters.entries Entries.
  * @returns {Object<Object>} Copy of entries with or without the single entry.
  */
  static includeExcludeObjectEntry({value, entries} = {}) {
    // Determine whether entries include an entry for the value.
    if (entries.hasOwnProperty(value.identifier)) {
      // Entries include an entry for the value.
      // Copy other entries and exclude the value's entry.
      return General.excludeObjectEntry({
        key: value.identifier,
        entries: entries
      });
    } else {
      // Entries do not include an entry for the value.
      // Copy other entries and include an entry for the value.
      return General.includeObjectEntry({
        value: value,
        entries: entries
      });
    }
  }
  /**
  * Copies an object's entries and excludes a single entry.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.key Entry's key.
  * @param {Object<Object>} parameters.entries Entries.
  * @returns {Object<Object>} Copy of entries without the single entry.
  */
  static excludeObjectEntry({key, entries} = {}) {
    // This function is an immutable alternative to delete entries[key].
    // Copy and include all entries except the entry with the key.
    var entriesKeys = Object.keys(entries);
    return entriesKeys.reduce(function (collection, entryKey) {
      // Determine whether to include key's entry.
      if (entryKey === key) {
        // Exclude entry.
        return collection;
      } else {
        // Copy and include entry.
        var valueCopy = General.copyValue(entries[entryKey]);
        // Create entry.
        var entry = {
          [entryKey]: valueCopy
        };
        // Include entry.
        return Object.assign(collection, entry);
      }
    }, {});
  }
  /**
  * Filters an object's entries by whether their values pass a filter.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.filter Function to determine whether to keep each
  * entry.
  * @param {Object<Object>} parameters.entries Entries.
  * @returns {Object<Object>} Copy of entries that pass the filter.
  */
  static filterObjectEntries({filter, entries} = {}) {
    // Copy and include all entries whose values pass filter.
    // Exclude entries whose values do not pass filter.
    var keys = Object.keys(entries);
    return keys.reduce(function (collection, key) {
      // Determine whether entry's value passes filter.
      if (filter(entries[key])) {
        // Copy and include entry.
        var valueCopy = General.copyValue(entries[key]);
        // Create entry.
        var entry = {
          [key]: valueCopy
        };
        // Include entry.
        return Object.assign(collection, entry);
      } else {
        // Exclude entry.
        return collection;
      }
    }, {});
  }
  /**
  * Copies an object's entries and includes a single entry.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Object} parameters.value Entry's value with identifier.
  * @param {Object<Object>} parameters.entries Entries.
  * @returns {Object<Object>} Copy of entries with the single entry.
  */
  static includeObjectEntry({value, entries} = {}) {
    // Copy entries.
    var entriesCopy = General.copyDeepObjectEntries(entries, true);
    // Copy value.
    var valueCopy = General.copyValue(value);
    // Create entry.
    var entry = {
      [valueCopy.identifier]: valueCopy
    };
    // Include entry.
    return Object.assign(entriesCopy, entry);
  }
  /**
  * Copies information in records from an object to an array.
  * @param {Object<Object>} records Records in an object.
  * @returns {Array<Object>} Copy of records in an array.
  */
  static copyRecordsObjectArray(records) {
    var keys = Object.keys(records);
    return keys.map(function (key) {
      var record = records[key];
      return General.copyValueJSON(record);
    });
  }
  /**
  * Copies a deep value by conversion to JavaScript Object Notation (JSON).
  * @param value Value to copy with an explicity representation in JSON.
  * @returns Copy of value from representation in JSON.
  */
  static copyValueJSON(value) {
    return JSON.parse(JSON.stringify(value));
  }
  /**
  * Copies deep entries from an object.
  * @param {Object} object An object with entries of keys and values.
  * @param {boolean} pattern Whether to assume that all elements within arrays
  * or all values within objects have identical types.
  * @returns {Object} Copy of object's entries.
  */
  static copyDeepObjectEntries(object, pattern) {
    // Iterate on object's entries.
    var keys = Object.keys(object);
    return keys.reduce(function (collection, key) {
      // Set reference to object's value.
      var value = object[key];
      // Copy value.
      var valueCopy = General.copyValue(value, pattern);
      // Include value in the collection.
      var novelEntry = {
        [key]: valueCopy
      };
      return Object.assign(collection, novelEntry);
    }, {});
  }
  /**
  * Copies deep elements from an array.
  * @param {Array} array An array with elements.
  * @param {boolean} pattern Whether to assume that all elements within arrays
  * or all values within objects have identical types.
  * @returns {Array} Copy of array's elements.
  */
  static copyDeepArrayElements(array, pattern) {
    // Iterate on array's elements.
    return array.map(function (element) {
      // Copy element.
      var elementCopy = General.copyValue(element, pattern);
      return elementCopy;
    });
  }
  /**
  * Copies a value according to its type.
  * @param value Value to copy, of type null, undefined, boolean, string,
  * number, symbol, array, or object.
  * @param {boolean} pattern Whether to assume that all elements within arrays
  * or all values within objects have identical types.
  * @returns Copy of value.
  */
  static copyValue(value, pattern) {
    // Determine whether the value is mutable.
    var mutable = General.determineValueMutability(value);
    if (!mutable) {
      // Value is immutable.
      // Copy value by assignment.
      var valueCopy = value;
    } else {
      // Value is mutable.
      // Determine whether the value is an array or another object.
      var type = General.determineValueType(value);
      if (type === "array") {
        // Value is an array.
        // Determine whether any elements of the array are mutable.
        if (pattern) {
          // Assume that all array's elements have identical type.
          var someMutable = General.determineValueMutability(value[0]);
        } else {
          // Consider types of all array's elements.
          var someMutable = value.some(function (element) {
            return General.determineValueMutability(element);
          });
        }
        if (!someMutable) {
          // None of array's elements are mutable.
          var valueCopy = value.slice();
        } else {
          // Some of array's elements are mutable.
          var valueCopy = value.map(function (element) {
            return General.copyValue(element);
          });
        }
      } else if (type === "object") {
        // Value is an object.
        // Determine whether any of object's values are mutable.
        var keys = Object.keys(value);
        if (pattern) {
          // Assume that all object's values have identical type.
          var someMutable = General.determineValueMutability(value[keys[0]]);
        } else {
          // Consider types of all object's values.
          var someMutable = keys.some(function (key) {
            return General.determineValueMutability(value[key]);
          });
        }
        if (!someMutable) {
          // None of object's values are mutable.
          var valueCopy = Object.assign({}, value);
        } else {
          // Some of object's values are mutable.
          var valueCopy = keys.reduce(function (collection, key) {
            var objectValueCopy = General.copyValue(value[key]);
            var novelRecord = {
              [key]: objectValueCopy
            };
            return Object.assign(collection, novelRecord);
          }, {});
        }
      }
    }
    return valueCopy;
  }
  /**
  * Determines a value's type.
  * @param value Value to consider.
  * @returns {string} The value's type.
  */
  static determineValueType(value) {
    // Determine whether value's type is array, object, null, undefined,
    // boolean, number, string, or symbol.
    // An historical anomaly in JavaScript is that the type of null is object.
    if (value === null) {
      return "null";
    } else if ((typeof value === "object") && (!Array.isArray(value))) {
      return "object";
    } else if ((typeof value === "object") && (Array.isArray(value))) {
      return "array";
    } else {
      return typeof value;
    }
  }
  /**
  * Determines whether a value's type is mutable.
  * @param value Value to consider.
  * @returns {boolean} Whether value's type is mutable.
  */
  static determineValueMutability(value) {
    var type = General.determineValueType(value);
    var isImmutable = (
      (
        type === "null" || type === "undefined" || type === "boolean" ||
        type === "number" || type === "string" || type === "symbol"
      ) && !(type === "object" || type === "array")
    );
    return !isImmutable;
  }
  /**
  * Collects unique elements.
  * @param {Array} elements Array of elements.
  * @returns {Array} Unique elements.
  */
  static collectUniqueElements(elements) {
    // Collect and return unique elements.
    return elements.reduce(function (accumulator, element) {
      if (!accumulator.includes(element)) {
        // Method concat does not modify the original array.
        // Method concat returns a new array.
        // It is necessary to store this new array or return it
        // directly.
        return accumulator.concat(element);
      } else {
        return accumulator;
      }
    }, []);
  }
  /**
  * Collects unique arrays by inclusion of their elements.
  * @param {Array<Array>} arrays Array of arrays.
  * @returns {Array<Array>} Unique arrays.
  */
  static collectUniqueArraysByInclusion(arrays) {
    // Collect and return unique arrays.
    return arrays.reduce(function (collectionArrays, array) {
      // Determine whether the collection includes an array with the same
      // elements as the current array.
      var match = collectionArrays.some(function (collectionArray) {
        return General.compareArraysByMutualInclusion(array, collectionArray);
      });
      if (match) {
        // The collection includes an array with the same elements as the
        // current array.
        // Preserve the collection.
        return collectionArrays;
      } else {
        // The collection does not include an array with the same elements as
        // the current array.
        // Include the current array in the collection.
        // TODO: Using Array.concat() flattens the arrays into a single array...
        return collectionArrays.concat([array]);
      }
    }, []);
  }
  /**
  * Replaces all instances of a substring in a string.
  * @param {string} currentString The string that contains the substring for
  * replacement.
  * @param {string} target The substring for replacement.
  * @param {string} replacement The substring to substitute in place of the
  * substring for replacement.
  * @returns {string} New string after replacement of all instances.
  */
  static replaceAllString(currentString, target, replacement) {
    if (currentString.includes(target)) {
      var newString = currentString.replace(target, replacement);
      return General.replaceAllString(newString, target, replacement);
    } else {
      return currentString;
    }
  }
  /**
  * Converts first character of string to capital character.
  * @param {string} string String to capitalize.
  * @returns {string} String with capitalization.
  */
  static capitalizeString(string) {
    var firstCharacter = string.slice(0, 1);
    var lastCharacters = string.slice(1);
    return (firstCharacter.toUpperCase() + lastCharacters);
  }
  /**
  * Collects a key's value from specific entries within an object.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.identifiers Identifiers of entries.
  * @param {string} key Key for value within entries.
  * @param {Object} object Object of entries.
  * @returns {Array} Values of the key from entries.
  */
  static collectKeyValueFromEntries({identifiers, key, object} = {}) {
    return identifiers.map(function (identifier) {
      return object[identifier][key];
    });
  }
  /**
  * Collects a single value for an identical key from multiple objects.
  * @param {string} key Common key for all objects.
  * @param {Array<Object>} objects Array of objects.
  * @returns {Array} Values for the key from all objects.
  */
  static collectValueFromObjects(key, objects) {
    return objects.map(function (object) {
      return object[key];
    });
  }
  /**
  * Collects multiple values from arrays for identical keys from multiple
  * objects.
  * @param {string} key Common key for all objects.
  * @param {Array<Object>} objects Array of objects.
  * @returns {Array} Values for the key from all objects.
  */
  static collectValuesFromObjects(key, objects) {
    return objects.reduce(function (collection, object) {
      return [].concat(collection, object[key]);
    }, []);
  }
  /**
  * Compares two arrays by inclusion of elements.
  * @param {Array} firstArray Array of elements.
  * @param {Array} secondArray Array of elements.
  * @returns {boolean} Whether or not the first array includes all values of
  * the second array.
  */
  static compareArraysByInclusion(firstArray, secondArray) {
    return secondArray.every(function (element) {
      return firstArray.includes(element);
    });
  }
  /**
  * Compares two arrays by mutual inclusion of elements, such that each array
  * includes every element of the other array.
  * @param {Array} firstArray Array of elements.
  * @param {Array} secondArray Array of elements.
  * @returns {boolean} Whether the first and second arrays include each
  * other's elements mutually.
  */
  static compareArraysByMutualInclusion(firstArray, secondArray) {
    return (
      General.compareArraysByInclusion(firstArray, secondArray) &&
      General.compareArraysByInclusion(secondArray, firstArray)
    );
  }
  /**
  * Compares two arrays by values of elements at specific indices.
  * @param {Array} firstArray Array of elements.
  * @param {Array} secondArray Array of elements.
  * @returns {boolean} Whether or not the second array has identical values at
  * each index of the first array.
  */
  static compareArraysByValuesIndices(firstArray, secondArray) {
    return firstArray.every(function (element, index) {
      return element === secondArray[index];
    });
  }
  /**
  * Compares two arrays by mutual values of elements at specific indices.
  * @param {Array} firstArray Array of elements.
  * @param {Array} secondArray Array of elements.
  * @returns {boolean} Whether or not the arrays have identical values at every
  * index.
  */
  static compareArraysByMutualValuesIndices(firstArray, secondArray) {
    return (
      (firstArray.length === secondArray.length) &&
      General.compareArraysByValuesIndices(firstArray, secondArray)
    );
  }
  /**
  * Checks objects elements for replicates by identifier.
  * @param {Array<Object<string>>} elements Objects elements with identifiers.
  * @returns {Array<Object<string>>} Object elements that have replicates.
  */
  static checkReplicateElements(elements) {
    // A more efficient algorithm would increment counts for each element
    // and then only return elements with counts greater than one.
    return elements.reduce(function (collection, element) {
      var matches = elements.filter(function (referenceElement) {
        return referenceElement.identifier === element.identifier;
      });
      if (
        (matches.length > 1) &&
        (!collection.includes(element.identifier))
      ) {
        return collection.concat(element.identifier);
      } else {
        return collection
      }
    }, []);
  }
  /**
  * Copies an array, shallowly, with omission of a specific count of elements
  * from a specific index.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array} parameters.array Array to copy.
  * @param {number} parameters.index Index at which to begin omission.
  * @param {number} parameters.count Count of elements to omit.
  * @returns {Array} Shallow copy of array with omissions.
  */
  static copyArrayOmitElements({array, index, count} = {}) {
    var before = array.slice(0, index);
    var after = array.slice(index + count);
    return [].concat(before, after);
  }
  /**
  * Sorts elements in arrray by order of characters' codes.
  * @param {Array<string>} array Array of elements to sort.
  * @returns {Array<string>} Shallow copy of array in sort order.
  */
  static sortArrayElementsByCharacter(array) {
    return array.slice().sort(function (firstElement, secondElement) {
      // Convert values to lower case for comparison.
      var firstValue = firstElement.toLowerCase();
      var secondValue = secondElement.toLowerCase();
      // Compare values by alphabetical order.
      if (firstValue < secondValue) {
        // Place first element before second element.
        return -1;
      } else if (firstValue > secondValue) {
        // Place first element after second element.
        return 1;
      } else {
        // Preserve current relative placements of elements.
        return 0;
      }
    });
  }
  /**
  * Sorts records in arrray.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<Object>} parameters.array Array of records.
  * @param {string} parameters.key Key of value in records by which to sort.
  * @param {string} parameters.order Direction, ascend or descend, in which to
  * sort records.
  * @param {Object} parameters.reference Information about values' names.
  * @returns {Array<string>} Shallow copy of array with records in sort order.
  */
  static sortArrayRecords({array, key, order, reference} = {}) {
    // Determine type of value by which to sort records.
    // Assume that all records have values of the same type.
    var type = General.determineValueType(array[0][key]);
    // Sort records.
    return array.slice().sort(function (firstRecord, secondRecord) {
      if (type === "string") {
        if (reference) {
          // Convert values to lower case for comparison.
          var firstValue = reference[firstRecord[key]].name.toLowerCase();
          var secondValue = reference[secondRecord[key]].name.toLowerCase();
        } else {
          // Convert values to lower case for comparison.
          var firstValue = firstRecord[key].toLowerCase();
          var secondValue = secondRecord[key].toLowerCase();
        }
      } else if (type === "number") {
        // Access values.
        var firstValue = firstRecord[key];
        var secondValue = secondRecord[key];
      }
      // Compare values.
      if (firstValue < secondValue) {
        if (order === "ascend") {
          // Place first element before second element.
          return -1;
        } else if (order === "descend") {
          // Place first element after second element.
          return 1;
        }
      } else if (firstValue > secondValue) {
        if (order === "ascend") {
          // Place first element after second element.
          return 1;
        } else if (order === "descend") {
          // Place first element before second element.
          return -1;
        }
      } else {
        // Preserve current relative placements of elements.
        return 0;
      }
    });
  }
  /**
  * Collects values of a target attribute that occur together in records with
  * each value of another category attribute.
  * Each record has a single value of the target attribute.
  * Each record can have either a single or multiple values of the category
  * attribute.
  * These collections do not necessarily include only unique values of the
  * target attribute.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.target Name of attribute in records to collect
  * for each category.
  * @param {string} parameters.category Name of attribute in records to create
  * categories.
  * @param {Object<Object>} parameters.records Records with target and category
  * attributes.
  * @returns {Object<Array<string>>} Values of the target attribute that occur
  * together in records with each value of the category attribute.
  */
  static collectRecordsTargetsByCategories({target, category, records} = {}) {
    // Collect values of the target attribute that occur together in records
    // with each value of the category attribute.
    // Iterate on records.
    var recordsIdentifiers = Object.keys(records);
    return recordsIdentifiers
    .reduce(function (recordsCollection, recordIdentifier) {
      // Access information about record.
      var record = records[recordIdentifier];
      // Determine record's values of the category attribute.
      var values = record[category];
      // Include record's value of the target attribute in collections for each
      // of record's values of the category attribute.
      // Collect attributes according to the count of category attributes in the
      // record.
      if (Array.isArray(values)) {
        var categoriesValues = values;
        return General.collectRecordTargetByCategories({
          target: record[target],
          categories: categoriesValues,
          recordsCollection: recordsCollection
        });
      } else {
        var categoryValue = [values];
        return General.collectRecordTargetByCategory({
          target: record[target],
          category: categoryValue,
          collection: recordsCollection
        });
      }
    }, {});
  }
  /**
  * Collects the value of a target attribute within collections for each value
  * of a category attribute.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.target Value of a target attribute for a single
  * record.
  * @param {Array<string>} parameters.categories Values of a category attribute
  * for a single record.
  * @param {Object<Array<string>>} parameters.recordsCollection Values of the
  * target attribute that occur together in records with each value of the
  * category attribute.
  * @returns {Object<Array<string>>} Values of the target attribute that occur
  * together in records with each value of the category attribute.
  */
  static collectRecordTargetByCategories({target, categories, recordsCollection} = {}) {
    // Iterate on values of the category attribute.
    return categories.reduce(function (categoriesCollection, category) {
      return General.collectRecordTargetByCategory({
        target: target,
        category: category,
        collection: categoriesCollection
      });
    }, recordsCollection);
  }
  /**
  * Collects the value of a target attribute within the collection for a value
  * of a category attribute.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.target Value of a target attribute for a single
  * record.
  * @param {string} parameters.category Value of a category attribute for a
  * single record.
  * @param {Object<Array<string>>} parameters.collection Values of the target
  * attribute that occur together in records with each value of the category
  * attribute.
  * @returns {Object<Array<string>>} Values of the target attribute that occur
  * together in records with each value of the category attribute.
  */
  static collectRecordTargetByCategory({target, category, collection} = {}) {
    // Determine whether the collection includes a record for the value of the
    // category attribute.
    if (collection.hasOwnProperty(category)) {
      // The collection includes a record for the value of the category
      // attribute.
      // Include the value of the target attribute in the record.
      var previousTargets = collection[category];
      var currentTargets = [].concat(previousTargets, target);
      // Create entry.
      var entry = {
        [category]: currentTargets
      };
      return Object.assign(collection, entry);
    } else {
      // The collection does not include a record for the value of the
      // category attribute.
      // Create a novel record for the value of the category attribute.
      // Include the value of the target attribute in this record.
      // Create entry.
      var entry = {
        [category]: [target]
      };
      // Include entry.
      return Object.assign(collection, entry);
    }
  }
  /**
  * Accesses a record within an object by the record's identifier, creating a
  * reference to the record.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a record.
  * @param {Object<Object>} parameters.records Object of records.
  * @returns {Object} Record.
  */
  static accessObjectRecordByIdentifier(identifier, records) {
    return records[identifier];
  }
  /**
  * Determines whether a record exists within an array by the record's
  * identifier.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a record.
  * @param {Array<Object>} parameters.records Array of records.
  * @returns {boolean} Whether the record exists within the array.
  */
  static determineArrayRecordByIdentifier(identifier, records) {
    return records.some(function (record) {
      return record.identifier === identifier;
    });
  }
  /**
  * Accesses a record within an array by the record's identifier, creating a
  * reference to the record.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.identifier Identifier of a record.
  * @param {Array<Object>} parameters.records Array of records.
  * @returns {Object} Record.
  */
  static accessArrayRecordByIdentifier(identifier, records) {
    return records.find(function (record) {
      return record.identifier === identifier;
    });
  }
  /**
  * Filters records within an array by the records' identifiers.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.identifiers Identifiers of records.
  * @param {Array<Object>} parameters.records Array of records.
  * @returns {Array<Object>} Records.
  */
  static filterArrayRecordsByIdentifiers(identifiers, records) {
    return records.filter(function (record) {
      return identifiers.includes(record.identifier);
    });
  }
}
