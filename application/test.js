
/**
 * Tests function collectUniqueElements().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCollectUniqueElements() {
    return compareArraysByValuesIndices(
        collectUniqueElements(["a", "b", "c", "a", "a", "b"]),
        ["a", "b", "c"]
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
