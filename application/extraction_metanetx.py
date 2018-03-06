"""
Extract information about metabolic sets and entities from MetaNetX.

Title:
    experiment_group.py

Imports:
    os: This module from The Python Standard Library contains definitions of
        tools to interact with the operating system.
    sys: This module is from The Python Standard Library. It contains
        definitions of tools to interact with the interpreter.
    shutil: This module is from The Python Standard Library. It contains
        definitions of tools for file operations.
    importlib: This module is from The Python Standard library. It contains
        definitions of tools to import packages and modules.

Classes:
    This module does not contain any classes.

Exceptions:
    This module does not contain any exceptions.

Functions:
    ...

Author:
    Thomas Cameron Waller
    tcameronwaller@gmail.com
    Department of Biochemistry
    Scientific Computing and Imaging Institute
    University Of Utah
    Room 4720 Warnock Engineering Building
    72 South Central Campus Drive
    Salt Lake City, Utah 84112
    United States of America

License:

    This file is part of project Profondeur
    (https://github.com/tcameronwaller/profondeur/).

    Profondeur supports custom definition and visual exploration of metabolic
    networks.
    Copyright (C) 2018 Thomas Cameron Waller

    This program is free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    This program is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.
    See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program.
    If not, see <http://www.gnu.org/licenses/>.
"""


###############################################################################
# Notes


###############################################################################
# Installation and importation of packages and modules


# Packages and modules from the python standard library

import os
#import sys
import shutil
#import importlib
import csv
import copy
import pickle

# Packages and modules from third parties

#import numpy
#import pandas
#import scipy

# Packages and modules from local source

#directory = os.path.join("C:\\", "Data")
#print(directory)
#os.chdir(directory)
#print(os.getcwd())
#print(os.listdir())

#print(sys.path)
#sys.path.append(directory)

#import classes

#importlib.reload(package_module)

###############################################################################
# Functionality


def find(match=None, sequence=None):
    """
    Finds the first element in a sequence to match a condition, otherwise none

    arguments:
        match (function): condition for elements to match
        sequence (list): sequence of elements

    returns:
        (object | NoneType): first element from sequence to match condition or
            none

    raises:

    """

    for element in sequence:
        if match(element):
            return element
    return None


def readFileTable(path_file=None, names=None, delimiter=None):
    """
    Reads and organizes source information from file

    This function reads and organizes relevant information from file.

    arguments:
        path_file (str): path to directory and file
        names (list<str>): names for values in each row of table
        delimiter (str): delimiter between values in the table

    returns:
        (list<dict>): tabular information from file

    raises:

    """

    # Read information from file
    #with open(path_file_source, "r") as file_source:
    #    content = file_source.read()
    with open(path_file, "r") as file_source:
        reader = csv.DictReader(
            file_source, fieldnames=names, delimiter=delimiter
        )
        information = list(map(lambda row: dict(row), list(reader)))
    # Return information
    return information


def readSource():
    """
    Reads and organizes source information from file

    This function reads and organizes relevant information from file.

    arguments:

    returns:
        (object): source information

    raises:

    """

    # Specify directories and files
    directory = os.path.join(
            os.sep, "media", "tcameronwaller", "primary", "data", "local",
            "research_lex", "project_profondeur", "profondeur",
            "metabolic_models", "homo-sapiens", "recon_2-m-2"
            )
    path_file_genes = os.path.join(
            directory, "recon2m2_metanetx_genes.tsv"
            )
    path_file_compartments = os.path.join(
            directory, "recon2m2_metanetx_compartments.tsv"
            )
    path_file_metabolites = os.path.join(
            directory, "recon2m2_metanetx_metabolites.tsv"
            )
    path_file_reactions = os.path.join(
            directory, "recon2m2_metanetx_reactions.tsv"
            )
    # Read information from file
    genes = readFileTable(
        path_file=path_file_genes,
        names=["reaction", "genes", "low_bound", "up_bound", "direction"],
        delimiter="\t"
    )
    compartments = readFileTable(
        path_file=path_file_compartments,
        names=["identifier", "name", "source"],
        delimiter="\t"
    )
    metabolites = readFileTable(
        path_file=path_file_metabolites,
        names=[
            "identifier", "name", "source", "formula", "mass", "charge",
            "reference"
        ],
        delimiter="\t"
    )
    reactions = readFileTable(
        path_file=path_file_reactions,
        names=[
            "identifier", "equation", "recon2m2", "metanetx",
            "enzyme_commission", "process", "reference"
        ],
        delimiter="\t"
    )
    # Compile information
    return {
        "genes": genes,
        "compartments": compartments,
        "metabolites": metabolites,
        "reactions": reactions
    }


def extractCompartments(source_compartments=None):
    """
    Extracts information from source about compartments

    arguments:
        source_compartments (list<dict>): source information about compartments

    returns:
        (dict<dict>): information about compartments

    raises:

    """

    compartments = {}
    for source_compartment in source_compartments:
        record = {
            "identifier": source_compartment["identifier"],
            "name": source_compartment["name"]
        }
        compartments[source_compartment["identifier"]] = record
    return compartments


def extractMetabolites(source_metabolites=None):
    """
    Extracts information from source about metabolites

    arguments:
        source_metabolites (list<dict>): source information about metabolites

    returns:
        (dict<dict>): information about metabolites

    raises:

    """

    metabolites = {}
    for source_metabolite in source_metabolites:
        record = extractMetabolite(source_metabolite=source_metabolite)
        metabolites[record["identifier"]] = record
    return metabolites


def extractMetabolite(source_metabolite=None):
    """
    Extracts information from source about a metabolite

    arguments:
        source_metabolite (dict): source information about a metabolite

    returns:
        (dict): information about a metabolite

    raises:

    """

    # Determine information
    identifier = source_metabolite["identifier"]
    name = source_metabolite["name"]
    formula = source_metabolite["formula"]
    mass = source_metabolite["mass"]
    charge = source_metabolite["charge"]
    reference = extractMetaboliteReference(
        identifier=identifier, source_reference=source_metabolite["reference"]
    )
    # Compile and return information
    return {
        "identifier": identifier,
        "name": name,
        "formula": formula,
        "mass": mass,
        "charge": charge,
        "reference": reference
    }


def extractMetaboliteReference(identifier=None, source_reference=None):
    """
    Extracts references from source about a metabolite

    arguments:
        identifier (str): identifier of metabolite in MetaNetX
        source_reference (str): source information about a metabolite's
            references

    returns:
        (dict<str>): references about a metabolite

    raises:

    """

    # Collect identifiers for each reference
    chebi = extractReferenceInformation(
        source_reference=source_reference, key="chebi:"
    )
    bigg = extractReferenceInformation(
        source_reference=source_reference, key="bigg:"
    )
    metanetx_prior = extractReferenceInformation(
        source_reference=source_reference, key="deprecated:"
    )
    metanetx = [identifier] + metanetx_prior
    envipath = extractReferenceInformation(
        source_reference=source_reference, key="envipath:"
    )
    hmdb = extractReferenceInformation(
        source_reference=source_reference, key="hmdb:"
    )
    kegg = extractReferenceInformation(
        source_reference=source_reference, key="kegg:"
    )
    lipidmaps = extractReferenceInformation(
        source_reference=source_reference, key="lipidmaps:"
    )
    metacyc = extractReferenceInformation(
        source_reference=source_reference, key="metacyc:"
    )
    reactome = extractReferenceInformation(
        source_reference=source_reference, key="reactome:"
    )
    sabiork = extractReferenceInformation(
        source_reference=source_reference, key="sabiork:"
    )
    seed = extractReferenceInformation(
        source_reference=source_reference, key="seed:"
    )
    slm = extractReferenceInformation(
        source_reference=source_reference, key="slm:"
    )
    # Compile and return information
    return {
        "chebi": chebi,
        "bigg": bigg,
        "metanetx": metanetx,
        "envipath": envipath,
        "hmdb": hmdb,
        "kegg": kegg,
        "lipidmaps": lipidmaps,
        "metacyc": metacyc,
        "reactome": reactome,
        "sabiork": sabiork,
        "seed": seed,
        "slm": slm
    }


def extractReferenceInformation(key=None, source_reference=None):
    """
    Extracts reference information

    arguments:
        key (str): identifier of reference information for a specific type
        source_reference (str): source information about references

    returns:
        (list<str>): reference information for a specific type

    raises:

    """

    # Separate information for references
    references = source_reference.split(";")
    # Filter identifiers for the reference
    pairs = list(filter(lambda pair: key in pair, references))
    # Remove key from identifiers
    identifiers = list(map(lambda pair: pair.replace(key, ""), pairs))
    # Return identifiers
    return identifiers


def extractReactions(source_reactions=None, source_genes=None):
    """
    Extracts information from source about reactions

    arguments:
        source_reactions (list<dict>): source information about reactions
        source_genes (list<dict>): source information about genes

    returns:
        (dict<dict>): information about reactions

    raises:

    """

    reactions = {}
    for source_reaction in source_reactions:
        def matchReactionGene(gene_record):
            return gene_record["reaction"] == source_reaction["identifier"]
        source_gene = find(matchReactionGene, source_genes)
        record = extractReaction(
            source_reaction=source_reaction, source_gene=source_gene
        )
        reactions[record["identifier"]] = record
    return reactions


def extractReaction(source_reaction=None, source_gene=None):
    """
    Extracts information from source about a reaction

    arguments:
        source_reaction (dict): source information about a reaction
        source_gene (dict): source information about a reaction's genes

    returns:
        (dict): information about a reaction

    raises:

    """

    # Determine information
    identifier = source_reaction["identifier"]
    equation = source_reaction["equation"]
    reversibility = extractReactionReversibility(equation=equation)
    participants = extractReactionParticipants(equation=equation)
    processes = extractReactionProcess(
        source_process=source_reaction["process"]
    )
    reference = extractReactionReference(
        recon2m2=source_reaction["recon2m2"],
        metanetx=source_reaction["metanetx"],
        enzyme_commission=source_reaction["enzyme_commission"],
        source_reference=source_reaction["reference"]
    )
    genes = extractReactionGenes(source_gene=source_gene)
    # Compile and return information
    return {
        "identifier": identifier,
        "equation": equation,
        "reversibility": reversibility,
        "participants": participants,
        "processes": processes,
        "genes": genes,
        "reference": reference
    }


def extractReactionReversibility(equation=None):
    """
    Extracts information about a reaction's reversibility

    arguments:
        equation (str): a reaction's equation from MetaNetX

    returns:
        (bool): whether reaction is reversible

    raises:

    """

    if "<==>" in equation:
        return True
    else:
        return False


def extractReactionParticipants(equation=None):
    """
    Extracts information about a reaction's participants

    arguments:
        equation (str): a reaction's equation from MetaNetX

    returns:
        (list<dict>): information about a reaction's participants

    raises:

    """

    # Extract raw information about reaction's participants
    participants_raw = extractReactionEquationRawParticipantsByRole(
        equation=equation
    )
    # Extract information about participants' role, coefficient, metabolite,
    # and compartment
    reactants = extractReactionParticipantsByRole(
        participants_raw=participants_raw["reactants"],
        role="reactant"
    )
    products = extractReactionParticipantsByRole(
        participants_raw=participants_raw["products"],
        role="product"
    )
    # Compile and return information
    return reactants + products


def extractReactionEquationRawParticipantsByRole(equation=None):
    """
    Extracts raw information about a reaction's participants from its equation

    arguments:
        equation (str): a reaction's equation from MetaNetX

    returns:
        (dict<list<str>>): raw information about a reaction's participants by
            role

    raises:

    """

    # Separate information about participants' reactants from products
    # Determine reaction's directionality
    if "<==>" in equation:
        equation_sides = equation.split(" <==> ")
        reactants_side = equation_sides[0]
        products_side = equation_sides[1]
    elif "-->" in equation:
        equation_sides = equation.split(" --> ")
        reactants_side = equation_sides[0]
        products_side = equation_sides[1]
    elif "<--" in equation:
        equation_sides = equation.split(" <-- ")
        reactants_side = equation_sides[1]
        products_side = equation_sides[0]
    # Separate information about individual participants
    reactants = reactants_side.split(" + ")
    products = products_side.split(" + ")
    # Compile and return information
    return {
        "reactants": reactants,
        "products": products
    }


def extractReactionParticipantsByRole(participants_raw=None, role=None):
    """
    Extracts information about a reaction's participants by role

    arguments:
        participants_raw (list<str>): raw information about a reaction's
            participants
        role (str): participants' role in reaction

    returns:
        (list<dict>): information about a reaction's participants

    raises:

    """

    # Extract information about participants
    participants = []
    for participant_raw in participants_raw:
        record = extractReactionParticipantByRole(
            participant_raw=participant_raw, role=role
        )
        participants.append(record)
    return participants


def extractReactionParticipantByRole(participant_raw=None, role=None):
    """
    Extracts information about a reaction's participant by role

    arguments:
        participant_raw (str): raw information about a reaction's participant
        role (str): participant's role in reaction

    returns:
        (dict): information about a reaction's participant

    raises:

    """

    # Separate information
    participant_split = participant_raw.split(" ")
    coefficient = float(participant_split[0])
    metabolite_compartment = participant_split[1].split("@")
    metabolite = metabolite_compartment[0]
    compartment = metabolite_compartment[1]
    # Compile and return information
    return {
        "metabolite": metabolite,
        "compartment": compartment,
        "coefficient": coefficient,
        "role": role
    }


def extractReactionProcess(source_process=None):
    """
    Extracts information about a reaction's metabolic process

    arguments:
        source_process (str): source information about a reaction's process

    returns:
        (str): information about a reaction's process

    raises:

    """

    # Separate references
    processes = extractReferenceInformation(
        source_reference=source_process, key="model:"
    )
    return processes


def extractReactionGenes(source_gene=None):
    """
    Extracts information about a reaction's genes

    arguments:
        source_gene (dict): source information about a reaction's genes

    returns:
        (list<str>): identifiers of a reaction's genes

    raises:

    """

    genes_references = source_gene["genes"]
    genes = genes_references.split(";")
    return genes


def extractReactionReference(
    recon2m2=None, metanetx=None, enzyme_commission=None, source_reference=None
):
    """
    Extracts references from source about a reaction

    arguments:
        recon2m2 (str): identifier of reaction in original version of model,
            Recon 2M.2
        metanetx (str): identifier of reaction in MetaNetX
        enzyme_commission (str): identifier of reaction in Enzyme Commission
        source_reference (str): source information about a reaction's
            references

    returns:
        (dict<str>): references about a reaction

    raises:

    """

    # Collect identifiers for each reference
    rhea = extractReferenceInformation(
        source_reference=source_reference, key="rhea:"
    )
    bigg = extractReferenceInformation(
        source_reference=source_reference, key="bigg:"
    )
    metanetx_prior = extractReferenceInformation(
        source_reference=source_reference, key="deprecated:"
    )
    metanetx_current = [metanetx] + metanetx_prior
    kegg = extractReferenceInformation(
        source_reference=source_reference, key="kegg:"
    )
    metacyc = extractReferenceInformation(
        source_reference=source_reference, key="metacyc:"
    )
    reactome = extractReferenceInformation(
        source_reference=source_reference, key="reactome:"
    )
    sabiork = extractReferenceInformation(
        source_reference=source_reference, key="sabiork:"
    )
    seed = extractReferenceInformation(
        source_reference=source_reference, key="seed:"
    )
    # Compile and return information
    return {
        "recon2m2": recon2m2,
        "rhea": rhea,
        "bigg": bigg,
        "metanetx": metanetx_current,
        "enzyme_commission": enzyme_commission.split(";"),
        "kegg": kegg,
        "metacyc": metacyc,
        "reactome": reactome,
        "sabiork": sabiork,
        "seed": seed
    }


def writeProduct(information=None):
    """
    Writes product information to file

    arguments:
        information (dict): product information

    returns:

    raises:

    """

    # Specify directories and files
    directory = os.path.join(
            os.sep, "media", "tcameronwaller", "primary", "data", "local",
            "research_lex", "project_profondeur", "profondeur",
            "metabolic_models", "homo-sapiens", "recon_2-m-2"
            )
    path_file = os.path.join(
            directory, "metabolism_sets_entities_extraction.pickle"
            )
    # Write information to file
    with open(path_file, "wb") as file_product:
        pickle.dump(information, file_product)


###############################################################################
# Procedure


def main():
    """
    This function defines the main activity of the module.
    """

    # Read source information from file
    source = readSource()
    # Extract information about compartments
    compartments = extractCompartments(
        source_compartments=source["compartments"]
    )
    # Extract information about metabolites
    metabolites = extractMetabolites(source_metabolites=source["metabolites"])
    # Extract information about reactions
    reactions = extractReactions(
        source_reactions=source["reactions"], source_genes=source["genes"]
    )
    # Compile information
    metabolism_sets_entities = {
        "compartments": compartments,
        "metabolites": metabolites,
        "reactions": reactions
    }
    #Write product information to file
    writeProduct(information=metabolism_sets_entities)


if __name__ == "__main__":
    main()
