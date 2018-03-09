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
import xml.etree.ElementTree as et

# Packages and modules from third parties

#import numpy
#import pandas
#import scipy

# Packages and modules from local source

import utility

###############################################################################
# Functionality


def read_source():
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
    path_file_model = os.path.join(
            directory, "recon2m2_mnx_entrez_gene.xml"
    )
    # Read information from file
    content = et.parse(path_file_model)
    # Compile and return information
    return content


def extract_reactions_names(content=None):
    """
    Extracts reactions' names

    arguments:
        content (object): content from file in Systems Biology Markup Language
            (XML)

    returns:
        (dict<str>): names of reactions

    raises:

    """

    # Copy and interpret content
    reference = utility.copy_interpret_model_content(content=content)
    rows = []
    # Change identifiers of reactions' metabolites
    for reaction in reference["reactions"].findall(
        "version:reaction", reference["space"]
    ):
        identifier = reaction.attrib["id"]
        name = reaction.attrib["name"]
        record = {
            "identifier": identifier,
            "name": name
        }
        rows.append(record)
    # Return content with changes
    return rows


def write_product(information=None):
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
            directory, "refinement_change_reactions.csv"
    )
    # Write information to file
    utility.write_file_table(
        information=information,
        path_file=path_file,
        names=["identifier", "name"],
        delimiter="\t"
    )




###############################################################################
# Procedure


def main():
    """
    This function defines the main activity of the module.
    """

    # Read source information from file
    content = read_source()
    # Extract reactions' names from Recon 2M.2
    reactions_names = extract_reactions_names(content=content)
    print(reactions_names)


    # TODO: I think I should go ahead and match MetaNetX's identifiers for the reactions...
    




    #Write product information to file
    write_product(information=reactions_names)


if __name__ == "__main__":
    main()
