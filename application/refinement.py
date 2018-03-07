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


def readSource():
    """
    Reads and organizes source information from file

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
    path_file_metabolism = os.path.join(
            directory, "metabolism_sets_entities_extraction.pickle"
    )
    path_file_metabolite_removal = os.path.join(
            directory, "refinement_metabolite_removal.csv"
    )

    # Read information from file
    with open(path_file_metabolism, "rb") as file_source:
        metabolism = pickle.load(file_source)
    metabolite_removal = utility.readFileTable(
        path_file=path_file_metabolite_removal,
        names=None,
        delimiter="\t"
    )
    # Compile and return information
    return {
        "compartments": metabolism["compartments"],
        "metabolites": metabolism["metabolites"],
        "reactions": metabolism["reactions"],
        "metabolite_removal": metabolite_removal,
    }


###############################################################################
# Procedure


def main():
    """
    This function defines the main activity of the module.
    """

    # Read source information from file
    source = readSource()
    # Remove irrelevant metabolites
    removal_metabolites = removeMetabolites(
        removal_metabolites=source["removal_metabolites"],
        original_metabolties=source["metabolites"],
        original_reactions=source["reactions"]
    )
    # Remove irrelevant reactions
    # TODO: I need a file with identifiers of all reactions to remove
    removal_reactions = removeReactions(
        removal_identifiers=source["removal_reactions"],
        original_reactions=removal_metabolites["reactions"]
    )
    # Remove irrelevant compartments
    # TODO: remove the boundary compartment? Probably yes...

    # Change metabolites' information
    # TODO: I need a file with identifiers of metabolites to change
    # TODO: then I need all the information to change for each metabolite

    # Change reactions' information
    # TODO: I need a file with identifiers of reactions to change and what to change
    # TODO: I especially need names for reactions

    # Enhance metabolites' identifiers
    # TODO: include PubChem identifiers from HMDB






    # TODO: remove irrelevant metabolites (MNXM01 -> MNXM1... remove metabolite entry, change in reactions)
    # TODO: remove irrelevant reactions (MNXR01, boundary reactions)
    # TODO: correct metabolites' names (MNXM1 -> "proton", etc etc etc)
    # TODO: include PubChem identifiers for metabolites
    # TODO: correct "other" process
    # TODO: collect all processes as sets
    # TODO: include transport reactions in processes
    # TODO: determine replicate reactions???

    #Write product information to file
    # TODO: I'll need to export to a JSON...
    #writeProduct(information=metabolism_sets_entities)


if __name__ == "__main__":
    main()
