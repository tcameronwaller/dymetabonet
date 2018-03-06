"""
Extract information about metabolic sets and entities from MetaNetX.

Title:
    experiment_group.py

Imports:
    os: This module is from The Python Standard Library. It contains
        difinitions of tools to interact with the operating system.
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
# Test script


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
            "identifier", "equation", "source", "reaction",
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
        metabolites[source_metabolite["identifier"]] = record
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
    reference = extractMetaboliteReference(source_metabolite["reference"])
    # Compile and return information
    return {
        "identifier": identifier,
        "name": name,
        "formula": formula,
        "mass": mass,
        "charge": charge,
        "reference": reference
    }


def extractMetaboliteReference(identifier, source_reference=None):
    """
    Extracts references from source about a metabolite

    arguments:
        identifier (str): identifier of metabolite in MetaNetX
        source_reference (str): source references for a metabolite

    returns:
        (dict<str>): references about a metabolite

    raises:

    """

    # Split references by delimiter
    references = source_reference.split(";")
    # Collect identifiers for each reference
    chebi = collectReferenceIdentifiers(references=references, key="chebi:")
    bigg = collectReferenceIdentifiers(references=references, key="bigg:")
    metanetx_prior = collectReferenceIdentifiers(
        references=references, key="deprecated:"
    )
    metanetx = [identifier] + metanetx_prior
    envipath = collectReferenceIdentifiers(
        references=references, key="envipath:"
    )
    hmdb = collectReferenceIdentifiers(references=references, key="hmdb:")
    kegg = collectReferenceIdentifiers(references=references, key="kegg:")
    lipidmaps = collectReferenceIdentifiers(
        references=references, key="lipidmaps:"
    )
    metacyc = collectReferenceIdentifiers(
        references=references, key="metacyc:"
    )
    reactome = collectReferenceIdentifiers(
        references=references, key="reactome:"
    )
    sabiork = collectReferenceIdentifiers(
        references=references, key="sabiork:"
    )
    seed = collectReferenceIdentifiers(
        references=references, key="seed:"
    )
    slm = collectReferenceIdentifiers(references=references, key="slm:")
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


def collectReferenceIdentifiers(key=None, references=None):
    """
    Extracts references from source about a metabolite

    arguments:
        key (str): identifier of a reference
        references (list<str>): references' identifiers for metabolite

    returns:
        (list<str>): a reference's identifiers for metabolite

    raises:

    """

    # Filter identifiers for the reference
    pairs = list(filter(lambda pair: key in pair, references))
    # Remove key from identifiers

    # Return identifiers

    # TODO: filter references for those that include the key string
    # TODO: remove (replace with "") the key string from each reference-identifier string
    # TODO: return that result...


def extractReactions():
    pass


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

    #reactions = extractReactions(
    #    source_reactions=source["reactions"],
    #    source_genes=source["genes"]
    #)
    # Compile information
    #metabolic_sets_entities = {
    #    "compartments": compartments,
    #    "metabolites": metabolites,
    #    "reactions": reactions
    #}


    #Write information to file

###############################################################################
# Script functionality

if __name__ == "__main__":
    main()
