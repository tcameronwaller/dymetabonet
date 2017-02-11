
/**
 * Tests function collectUniqueElements().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCollectUniqueElements() {
    return compareArraysByValuesIndices(
        collectUniqueElements(
            ["a", "b", "c", "a", "a", "b"]),
            ["a", "b", "c"]
        ) && compareArraysByValuesIndices(
            ["a", "b", "c"],
            collectUniqueElements(["a", "b", "c", "a", "a", "b"])
        );
}

/**
 * Tests function countReactantProductCompartments().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCountReactantProductCompartments() {
    var reaction = {
        metabolites: {
            a_c: 1,
            b_e: 1,
            c_c: 1,
            d_m: -1,
            e_m: -1,
            f_m: -1
        },
        id: "test_reaction"
    };
    return countReactantProductCompartments(reaction, "product") === 2;
}

/**
 * Tests function countReactantProductCompartments().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCountReactionCompartments() {
    var reaction = {
        metabolites: {
            a_c: 1,
            b_e: 1,
            c_c: 1,
            d_m: -1,
            e_m: -1,
            f_m: -1
        },
        id: "test_reaction"
    };
    return countReactionCompartments(reaction) === 3;
}

/**
 * Tests function determineChangeCompartments().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testDetermineChangeCompartments() {
    var reaction = {
        metabolites: {
            a_c: 1,
            b_e: 1,
            c_c: 1,
            d_m: -1,
            e_m: -1,
            f_m: -1
        },
        id: "test_reaction"
    };
    return determineChangeCompartments(reaction) === true;
}

/**
 * Tests function determineChangeChemicals().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testDetermineChangeChemicals() {
    var reaction = {
        metabolites: {
            a_c: 1,
            b_e: 1,
            c_c: 1,
            d_m: -1,
            c_m: -1,
            b_m: -1,
            a_m: -1
        },
        id: "test_reaction"
    };
    return determineChangeChemicals(reaction) === true;
}

/**
 * Tests function checkReactionBoundsValues().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckReactionBoundsValues() {
    var reaction = {
        id: "test_reaction",
        lower_bound: -1000,
        upper_bound: 0
    };
    return checkReactionBoundsValues(reaction) === true;
}

/**
 * Tests function checkReactionBoundsRanges().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckReactionBoundsRanges() {
    var reaction = {
        id: "test_reaction",
        lower_bound: -500,
        upper_bound: 500
    };
    return checkReactionBoundsRanges(reaction) === true;
}

/**
 * Tests function checkReactionBoundsDirection().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckReactionBoundsDirection() {
    var reaction = {
        id: "test_reaction",
        lower_bound: 0,
        upper_bound: 500
    };
    return checkReactionBoundsDirection(reaction) === true;
}


/**
 * Tests function checkMetaboliteReaction().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckMetaboliteReaction() {
    var reactions = [
        {metabolites: {a_c: 1}, id: "reaction_1"},
        {metabolites: {a_c: 1}, id: "reaction_2"},
        {metabolites: {a_c: 1}, id: "reaction_3"}
        ];
    var metabolite = {id: "a_c"};
    return checkMetaboliteReaction(reactions, metabolite) === true;
}

/**
 * Tests function determineMetaboliteSetCharge().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testDetermineMetaboliteSetCharge() {
    var setMetabolites = [
        {charge: -3},
        {charge: -3},
        {charge: -3}
    ];
    return determineMetaboliteSetCharge(setMetabolites) === -3;
}


/**
 * Tests function determineMetaboliteSetFormula().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testDetermineMetaboliteSetFormula1() {
    var setMetabolites = [
        {formula: "H2O"},
        {formula: "C6H12O6"},
        {formula: "C3H7O9"}
    ];
    return determineMetaboliteSetFormula(setMetabolites) === "H2O";
}

/**
 * Tests function determineMetaboliteSetFormula().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testDetermineMetaboliteSetFormula2() {
    var setMetabolites = [
        {formula: "H2O"},
        {formula: "H1OR"},
        {formula: "H2O"}
    ];
    return determineMetaboliteSetFormula(setMetabolites) === "H2O";
}

/**
 * Tests function determineMetaboliteSetName().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testDetermineMetaboliteSetName1() {
    var setMetabolites = [
        {compartment: "e", name: "pyruvate_e"},
        {compartment: "c", name: "pyruvate_c"},
        {compartment: "m", name: "pyruvate_m"}
    ];
    return determineMetaboliteSetName(setMetabolites) === "pyruvate";
}

/**
 * Tests function determineMetaboliteSetName().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testDetermineMetaboliteSetName2() {
    var setMetabolites = [
        {compartment: "e", name: "pyruvate(R)"},
        {compartment: "c", name: "pyruvate(S)"},
        {compartment: "m", name: "pyruvate(R)"}
    ];
    return determineMetaboliteSetName(setMetabolites) === "pyruvate(R/S)";
}