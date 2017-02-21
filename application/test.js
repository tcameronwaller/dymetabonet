
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
 * Tests function replaceAllString().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testReplaceAllString() {
    return replaceAllString("a b c d e f g", " ", "") === "abcdefg";
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
 * Tests function extractGeneIdentifiers().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testExtractGeneIdentifiers() {
    return compareArraysByValuesIndices(
        extractGeneIdentifiers(
            "HGNC:100 or (HGNC:200 and HGNC:300) or (HGNC:300 and HGNC:400)"
        ),
            ["HGNC:100", "HGNC:200", "HGNC:300", "HGNC:400"]
    ) && compareArraysByValuesIndices(
            ["HGNC:100", "HGNC:200", "HGNC:300", "HGNC:400"],
            extractGeneIdentifiers(
                "HGNC:100 or (HGNC:200 and HGNC:300) or (HGNC:300 and HGNC:400)"
            )
        );
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
 * Tests function checkReactionMetabolites().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckReactionMetabolites1() {
    var reaction = {id: "reaction_1", metabolites: {}};
    var metabolites = [
        {id: "a_c"},
        {id: "b_c"},
        {id: "c_c"}
    ];
    return checkReactionMetabolites(reaction, metabolites) === false;
}

/**
 * Tests function checkReactionMetabolites().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckReactionMetabolites2() {
    var reaction = {id: "reaction_1", metabolites: {a_c: 1, b_c: 1, c_c: -1}};
    var metabolites = [
        {id: "a_c"},
        {id: "b_c"},
        {id: "c_c"}
    ];
    return checkReactionMetabolites(reaction, metabolites) === true;
}

/**
 * Tests function checkReactionGenes().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckReactionGenes() {
    var reaction = {
        gene_reaction_rule: "(HGNC:549) or (HGNC:550 and HGNC:125) or HGNC:80",
        id: "reaction_1"
    };
    var genes = [
        {id: "HGNC:549"},
        {id: "HGNC:550"},
        {id: "HGNC:125"},
        {id: "HGNC:80"}
    ];
    return checkReactionGenes(reaction, genes) === true;
}

/**
 * Tests function checkReactionProcess().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckReactionProcess1() {
    var reaction = {
        id: "reaction_1",
        subsystem: "World Peace"
    };
    return checkReactionProcess(reaction) === true;
}

/**
 * Tests function checkReactionProcess().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckReactionProcess2() {
    var reaction = {
        id: "reaction_1"
    };
    return checkReactionProcess(reaction) === false;
}

/**
 * Tests function checkReactionProcess().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckReactionProcess3() {
    var reaction = {
        id: "reaction_1",
        subsystem: undefined
    };
    return checkReactionProcess(reaction) === false;
}

/**
 * Tests function checkMetaboliteReactions().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckMetaboliteReactions() {
    var reactions = [
        {metabolites: {a_c: 1}, id: "reaction_1"},
        {metabolites: {a_c: 1}, id: "reaction_2"},
        {metabolites: {a_c: 1}, id: "reaction_3"}
        ];
    var metaboliteIdentifier = "a_c";
    return checkMetaboliteReactions(metaboliteIdentifier, reactions) === true;
}

/**
 * Tests function checkGeneReactions().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCheckGeneReactions() {
    var reactions = [
        {gene_reaction_rule: "HGNC:100 or HGNC:200", id: "reaction_1"},
        {gene_reaction_rule: "HGNC:100 or HGNC:300", id: "reaction_2"},
        {gene_reaction_rule: "HGNC:100 or HGNC:400", id: "reaction_3"}
    ];
    var geneIdentifier = "HGNC:100";
    return checkGeneReactions(geneIdentifier, reactions) === true;
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
        {formula: "H1OR"},
        {formula: "H2O"},
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



/**
 * Tests function collectEgoNetwork().
 * @returns {boolean} Whether or not the function meets expectation.
 */
function testCollectEgoNetwork() {
    var network = cytoscape({
        container: document.getElementById("exploration"),
        elements: {
            edges: [
                {group: "edges", data: {id: "a_b", source: "a", target: "b"}},
                {group: "edges", data: {id: "a_c", source: "a", target: "c"}},
                {group: "edges", data: {id: "a_d", source: "a", target: "d"}},
                {group: "edges", data: {id: "e_a", source: "e", target: "a"}},
                {group: "edges", data: {id: "f_a", source: "f", target: "a"}},
                {group: "edges", data: {id: "b_g", source: "b", target: "g"}},
                {group: "edges", data: {id: "b_h", source: "b", target: "h"}},
                {group: "edges", data: {id: "c_d", source: "c", target: "d"}},
                {group: "edges", data: {id: "d_c", source: "d", target: "c"}},
                {group: "edges", data: {id: "d_i", source: "d", target: "i"}},
                {group: "edges", data: {id: "j_d", source: "j", target: "d"}},
                {group: "edges", data: {id: "k_e", source: "k", target: "e"}},
                {group: "edges", data: {id: "l_f", source: "l", target: "f"}},
                {group: "edges", data: {id: "m_f", source: "m", target: "f"}},
                {group: "edges", data: {id: "h_n", source: "h", target: "n"}},
                {group: "edges", data: {id: "o_k", source: "o", target: "k"}},
                {group: "edges", data: {id: "p_k", source: "p", target: "k"}},
                {group: "edges", data: {id: "q_l", source: "q", target: "l"}},
                {group: "edges", data: {id: "r_m", source: "r", target: "m"}},
                {group: "edges", data: {id: "n_s", source: "n", target: "s"}},
                {group: "edges", data: {id: "n_t", source: "n", target: "t"}}
            ],
            nodes: [
                {group: "nodes", data: {id: "a"}},
                {group: "nodes", data: {id: "b"}},
                {group: "nodes", data: {id: "c"}},
                {group: "nodes", data: {id: "d"}},
                {group: "nodes", data: {id: "e"}},
                {group: "nodes", data: {id: "f"}},
                {group: "nodes", data: {id: "g"}},
                {group: "nodes", data: {id: "h"}},
                {group: "nodes", data: {id: "i"}},
                {group: "nodes", data: {id: "j"}},
                {group: "nodes", data: {id: "k"}},
                {group: "nodes", data: {id: "l"}},
                {group: "nodes", data: {id: "m"}},
                {group: "nodes", data: {id: "n"}},
                {group: "nodes", data: {id: "o"}},
                {group: "nodes", data: {id: "p"}},
                {group: "nodes", data: {id: "q"}},
                {group: "nodes", data: {id: "r"}},
                {group: "nodes", data: {id: "s"}},
                {group: "nodes", data: {id: "t"}}
            ]
        },
        layout: {
            animate: true,
            name: "cose",
            fit: true,
            idealEdgeLength: 10,
            nodeOverlap: 5,
            nodeRepulsion: 500000,
            padding: 10,
            randomize: true
        },
        style: [
            {
                selector: "node",
                style: {
                    "background-color": "red",
                    "font-size": "25px",
                    "label": "data(id)",
                    "text-halign": "center",
                    "text-valign": "center"
                }
            },
            {
                selector: "edge",
                style: {
                    "line-color": "grey",
                    "line-style": "solid",
                    "mid-target-arrow-color": "black",
                    "mid-target-arrow-shape": "triangle",
                    "width": 7
                }
            }

        ]
    });
    console.log(network);
}