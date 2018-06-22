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
class ActionInterface {

  // Direct actions.

  // Indirect actions.

  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeControls() {
    // Initialize controls.
    var views = ActionInterface.createInitialViews();
    var viewsRestoration = ActionInterface.createInitialViewsRestoration();
    // Compile information.
    var variablesValues = {
      views: views,
      viewsRestoration: viewsRestoration
    };
    // Return information.
    return variablesValues;
  }
  /**
  * Creates initial, empty references to views.
  * @returns {Object} References to views.
  */
  static createInitialViews() {
    // Compile information.
    var information = {
      interface: {},
      tip: {},
      prompt: {},
      panel: {},
      network: {},
      filter: {},
      context: {},
      subnetwork: {},
      query: {},
      measurement: {},
      summary: {},
      exploration: {}
    };
    // Return information.
    return information;
  }
  /**
  * Creates initial control of whether to restore views.
  * @returns {Object} Information about whether to restore views.
  */
  static createInitialViewsRestoration() {
    // Compile information.
    var information = {
      interface: true,
      tip: true,
      prompt: true,
      panel: true,
      network: true,
      filter: true,
      context: true,
      subnetwork: true,
      query: true,
      summary: true,
      exploration: true
    };
    // Return information.
    return information;
  }

  // TODO: I might need to re-work this...
  
  /**
  * Changes controls of whether to restore views.
  * @param {Object} parameters Destructured object of parameters.
  * @param {Array<string>} parameters.skips Identifiers of views to skip from
  * restoration.
  * @param {Object} parameters.viewsRestoration Value of the variable.
  * @returns {Object} Information about whether to restore views.
  */
  static changeViewsRestoration({skips, viewsRestoration} = {}) {
    var views = Object.keys(viewsRestoration);
    return views.reduce(function (collection, view) {
      if (!skips.includes(view)) {
        var entry = {[view]: true};
        return Object.assign(collection, entry);
      } else {
        var entry = {[view]: false};
        return Object.assign(collection, entry);
      }
    }, {});
  }
}
