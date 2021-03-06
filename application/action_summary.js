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
class ActionSummary {

  // Direct actions.

  // Indirect actions.

  // TODO: export information about all entities in subnetwork or current selection
  // TODO: Consolidate export behavior... I don't think I need to handle differently...

  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeControls() {
    // Initialize controls.
    // Compile information.
    var variablesValues = {};
    // Return information.
    return variablesValues;
  }
  /**
  * Prepares and exports information about entities, reactions and metabolites,
  * that pass current filters by sets.
  * @param {Object} state Application's state.
  */
  static exportFilterEntitiesSummary(state) {
  }
  /**
  * Prepares and exports information about entities, reactions and metabolites,
  * that merit representation in the subnetwork.
  * @param {Object} state Application's state.
  */
  static exportNetworkEntitiesSummary(state) {
  }

}
