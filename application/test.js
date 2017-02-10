
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


//checkMetaboliteReaction
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
