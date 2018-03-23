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
* Interface to communicate transient, concise, supplemental information about
* other elements in interface's views.
* This interface is independent of application's persistent state.
*/
class ViewTip {
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
    self.clearView(self);
  }
  /**
  * Initializes, creates and activates, view's content and behavior that does
  * not vary with changes to the application's state.
  * @param {Object} self Instance of a class.
  */
  initializeView(self) {
    // Create or set reference to container.
    self.container = View.createReferenceContainer({
      identifier: "tip",
      target: self.interfaceView.container,
      position: "beforeend",
      documentReference: self.document
    });
  }
  /**
  * Restores view's content and behavior that varies with changes to the
  * application's state.
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
  * @param {Object} parameters.content Reference to element for content.
  * @param {Object} parameters.self Instance of a class.
  */
  restoreView({visibility, horizontalPosition, verticalPosition, horizontalShift, verticalShift, content, self} = {}) {
    // Remove any children.
    if (!(self.container.children.length === 0)) {
      General.removeDocumentChildren(self.container);
    }
    // Create tip's contents.
    self.container.appendChild(content);
    // Determine whether tip is visible.
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
  /**
  * Clears view.
  * @param {Object} self Instance of a class.
  */
  clearView(self) {
    self.restoreView({
      visibility: false,
      horizontalPosition: 0,
      verticalPosition: 0,
      horizontalShift: 0,
      verticalShift: 0,
      content: View.createSpanText({text: "",documentReference: self.document}),
      self: self
    });
  }
}
