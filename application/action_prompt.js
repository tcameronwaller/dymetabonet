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
class ActionPrompt {

  /**
  * Initializes values of application's variables for controls relevant to view.
  * @returns {Object} Values of application's variables for view's controls.
  */
  static initializeControls() {
    // Initialize controls.
    var prompt = ActionPrompt.createInitialPrompt();
    // Compile information.
    var variablesValues = {
      prompt: prompt
    };
    // Return information.
    return variablesValues;
  }
  /**
  * Creates initial prompt.
  * @returns {Object} Information about prompt.
  */
  static createInitialPrompt() {
    var type = "none";
    var reference = {};
    var horizontalPosition = 0;
    var verticalPosition = 0;
    var horizontalShift = 0;
    var verticalShift = 0;
    var permanence = false;
    // Compile information.
    var information = {
      type: type,
      reference: reference,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      horizontalShift: horizontalShift,
      verticalShift: verticalShift,
      permanence: permanence
    };
    // Return information.
    return information;
  }
  /**
  * Changes the type and position of the prompt view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.type Type of prompt view.
  * @param {Object} parameters.reference Reference information for the specific
  * type of prompt.
  * @param {number} parameters.horizontalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.verticalPosition Horizontal position in pixels
  * relative to the browser's view window of reference point.
  * @param {number} parameters.horizontalShift Horizontal shift in pixels
  * relative to reference point.
  * @param {number} parameters.verticalShift Horizontal shift in pixels relative
  * to reference point.
  * @param {boolean} parameters.permanence Whether prompt is permanent.
  * @param {Object} parameters.state Application's state.
  * @returns {Object} Information about prompt view.
  */
  static changeInformation({type, reference, horizontalPosition, verticalPosition, horizontalShift, verticalShift, permanence, state} = {}) {
    // Determine prompt's type and positions.
    if (state.prompt.type === type) {
      // Remove any prompt view.
      var prompt = ActionPrompt.createInitialPrompt();
    } else {
      // Compile information.
      var prompt = {
        type: type,
        reference: reference,
        horizontalPosition: horizontalPosition,
        verticalPosition: verticalPosition,
        horizontalShift: horizontalShift,
        verticalShift: verticalShift,
        permanence: permanence
      };
    }
    // Return information.
    return prompt;
  }
  /**
  * Changes the type of the prompt view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {string} parameters.type Type of prompt view.
  * @param {Object} parameters.state Application's state.
  */
  static changeType({type, state} = {}) {
    // Compile information.
    var prompt = {
      type: type,
      reference: state.prompt.reference,
      horizontalPosition: state.prompt.horizontalPosition,
      verticalPosition: state.prompt.verticalPosition,
      horizontalShift: state.prompt.horizontalShift,
      verticalShift: state.prompt.verticalShift,
      permanence: true
    };
    // Compile variables' values.
    var novelVariablesValues = {
      prompt: prompt
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
  * Removes the prompt view.
  * @param {Object} parameters Destructured object of parameters.
  * @param {boolean} parameters.permanence Whether to remove only transient
  * prompt view.
  * @param {Object} parameters.state Application's state.
  */
  static removeView({permanence, state} = {}) {
    if (permanence) {
      if (!state.prompt.permanence) {
        // Remove any prompt view.
        var prompt = ActionPrompt.createInitialPrompt();
      } else {
        var prompt = state.prompt;
      }
    } else {
      // Remove any prompt view.
      var prompt = ActionPrompt.createInitialPrompt();
    }
    // Compile variables' values.
    var novelVariablesValues = {
      prompt: prompt
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

}
