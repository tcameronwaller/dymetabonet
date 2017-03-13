
////////////////////////////////////////////////////////////////////////////////
// Query portion
////////////////////////////////////////////////////////////////////////////////



/**
 * Use D3 to create elements in DOM with associative data.
 * @param {d3 selection} selection D3 selection of HTML element within which to create elements with associative data.
 * @param {string} element Type of HTML element to create with associative data.
 * @param {array or accessor function} accessData Accessible data in array or accessor function for these values in
 * the selection.
 * @return {d3 selection} D3 selection of elements that the function created with associative data.
 */
function createDataElements(selection, element, accessData) {
    var elements = selection.selectAll(element)
        .data(accessData);
    elements
        .exit()
        .remove();
    var elementsEnter = elements
        .enter()
        .append(element);
    elements = elementsEnter
        .merge(elements);
    return elements;
}

/**
 * Script for query portion.
 * Use an immediately-invoked function expression (IIFE) to establish scope in a convenient container.
 * An alternative style would be to declare the function and subsequently call it.
 */
function initializeQueryInterface() {
    // Create single instance objects of each view's class.
    // Pass instance objects as arguments to classes that need to interact with them.
    // This strategy avoids creation of replicate instances of each class and enables instances to communicate together.
    //var explorationView = new ExplorationView();
    //var navigationView = new NavigationView(explorationView);
    //var queryView = new QueryView(navigationView);

    // TODO: Allow the user to select the directory path and file of the metabolic model.
    // TODO: readdirSync from Node.js might work.
    createDataElements(
        d3.select("#selector"),
        "option",
        ["model_h-sapiens_recon-2.json"]
    )
        .text(function (d) {
            return d
        });

    d3.select("#assemble")
        .on("click", function () {
            //console.log(d3.event);
            //console.log(d3.event.srcElement.value);
            //console.log(d3.event.target.value);
            //self.dataFile = d3.event.target.value;
            //console.log(this.node().value);
            var dataFile = d3.select("#selector").node().value;

            // Load data from file in JSON format.
            // Create objects that associate with these data.
            d3.json(("../model/homo-sapiens/" + dataFile),
                function (error, modelInitial) {
                    if (error) throw error;
                    // Call function to assemble model.
                    assembleModel(modelInitial);
                });
        })

    d3.select("#load")
        .on("click", function () {
            // Load data from file in JSON format.
            // Create objects that associate with these data.
            d3.json(("../model/homo-sapiens/" + "model_sets_network.json"),
                function (error, model) {
                    if (error) throw error;
                    // Call function to explore model.
                    exploreModel(model);
                });
        })
}

function manageInterface() {
    document
        .getElementById("query_queue_add")
        .addEventListener("click", addQueryStep);
}

/**
 * Determines the value of the only active radio button in a group.
 * @param {Array<Object>} radios Group of radio buttons.
 * @returns {string} Value of the only active radio button from the group.
 */
function determineRadioGroupValue(radios) {
    return radios.filter(function (radio) {
        return radio.checked;
    })[0].value;
}

/**
 * Appends one additional query step to the query queue.
 * @param {Object} event Record of event from Document Object Model.
 */
function addQueryStep2(event) {
    //console.log(event.currentTarget);
    //event.currentTarget // element on which the event originated.

    var textHead = document.createTextNode("Type of Query Step");
    var headHead = document
        .createElement("h3")
        .appendChild(textHead);

    var textAttribute = document
        .createTextNode("Attribute:");
    var textIdentity = document
        .createTextNode("Identity:");
    var textTopology = document
        .createTextNode("Topology:");
    var inputAttribute = document
        .createElement("input")
        .setAttribute("name", "typer")
        .setAttribute("type", "radio")
        .setAttribute("value", "attribute");
    var inputIdentity = document
        .createElement("input")
        .setAttribute("name", "typer")
        .setAttribute("type", "radio")
        .setAttribute("value", "identity");
    var inputTopology = document
        .createElement("input")
        .setAttribute("name", "typer")
        .setAttribute("type", "radio")
        .setAttribute("value", "topology");
    var labelAttribute = document
        .createElement("label")
        .appendChild(textAttribute)
        .appendChild(inputAttribute);
    var labelIdentity = document
        .createElement("label")
        .appendChild(textIdentity)
        .appendChild(inputIdentity);
    var labelTopology = document
        .createElement("label")
        .appendChild(textTopology)
        .appendChild(inputTopology);

    var breaker = document
        .createElement("br");
    var textDelete = document
        .createTextNode("Delete");
    var button = document
        .createElement("button")
        .setAttribute("type", "button")
        .appendChild(textDelete);

    var step = document
        .createElement("div")
        .setAttribute("class", "query_step")
        .appendChild(headHead)
        .appendChild(labelAttribute)
        .appendChild(labelIdentity)
        .appendChild(labelTopology)
        .appendChild(breaker)
        .appendChild(button);
    document.getElementById("query_queue").appendChild(step);
}

// TODO: Trouble-shoot this test function.
// TODO: I'm trying to chain together creation, setting attribute, and appending child.
// TODO: It is possible that the setAttribute method does not return the new element.
// TODO: That's ridiculous.

function addQueryStep(event) {
    //console.log(event.currentTarget);
    //event.currentTarget // element on which the event originated.

    var text = document
        .createTextNode("Test");

    var step = document
        .createElement("div")
        .setAttribute("class", "query_step")
        .appendChild(text);
    document.getElementById("query_queue").appendChild(step);
}
