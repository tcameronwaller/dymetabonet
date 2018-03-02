"""
Curate metabolic model Recon 2M.2 for reconciliation to MetaNetX.

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
import re
import csv
import xml.etree.ElementTree as et
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


def copyInterpretModelContent(content=None):
    """
    Copies and interprets content in Systems Biology Markup Language (SBML)

    This function copies and interprets content describing a metabolic model in
    Systems Biology Markup Language (SBML), a form of Extensible Markup
    Language (XML).

    arguments:
        content (object): content from file in Systems Biology Markup Language
            (XML)

    returns:
        (object): references to definition of name space and sections within
            content

    raises:

    """

    # Copy content
    content_copy = copy.deepcopy(content)
    # Define name space
    space = {
        "version": "http://www.sbml.org/sbml/level2/version4",
        "syntax": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    }
    # Set references to sections within content
    sbml = content_copy.getroot()
    model = sbml[0]
    compartments = model[1]
    metabolites = model[2]
    reactions = model[3]
    # Compile information
    return {
        "space": space,
        "content": content_copy,
        "model": model,
        "compartments": compartments,
        "metabolites": metabolites,
        "reactions": reactions
    }


def removeModelIdentifierPrefix(content=None):
    """
    Removes unnecessary prefixes from identifiers for model's entities

    This function removes unnecessary prefixes from identifiers for
    metabolites.

    arguments:
        content (object): content from file in Systems Biology Markup Language
            (XML)

    returns:
        content with changes to identifiers of metabolites

    raises:

    """

    # Copy and interpret content
    reference = copyInterpretModelContent(content=content)
    # Remove prefixes from identifiers for metabolites
    for metabolite in reference["metabolites"].findall(
    "version:species", reference["space"]
    ):
        # Remove prefix from metabolite's identifier
        novel_identifier = re.sub(r"^M_", "", metabolite.attrib["id"])
        metabolite.attrib["id"] = novel_identifier
        # Search metabolite's annotation
        for description in metabolite.iter(
        "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}description"
        ):
            # Remove prefix from metabolite's identifier
            novel_identifier = re.sub(
                r"^#M_",
                "#",
                description.attrib[
                "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}about"
                ]
            )
            description.attrib[
            "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}about"
            ] = novel_identifier
    # Remove prefixes from identifiers for reactions' metabolites
    for reaction in reference["reactions"].findall(
    "version:reaction", reference["space"]
    ):
        # Search reaction's metabolites
        for metabolite in reaction.iter(
        "{http://www.sbml.org/sbml/level2/version4}speciesReference"
        ):
            # Remove prefix from metabolite's identifier
            novel_identifier = re.sub(r"^M_", "", metabolite.attrib["species"])
            metabolite.attrib["species"] = novel_identifier
    # Return content with changes
    return reference["content"]


def changeModelBoundary(content=None):
    """
    Changes annotations for a model's boundary

    This function changes annotations of a model's boundary in compartments,
    metabolites, and reactions.

    arguments:
        content (object): content from file in Systems Biology Markup Language
            (XML)

    returns:
        content with changes to attributes of compartments, metabolites, and
            reactions

    raises:

    """

    # Copy and interpret content
    reference = copyInterpretModelContent(content=content)
    # Correct compartment for model's boundary
    for compartment in reference["compartments"].findall(
    "version:compartment", reference["space"]
    ):
        # Determine whether compartment is for model's boundary
        if compartment.attrib["id"] == "b":
            compartment.attrib["name"] = "model boundary"
    # Correct metabolites for model's boundary
    for metabolite in reference["metabolites"].findall(
    "version:species", reference["space"]
    ):
        # Determine whether metabolite's compartment is model's boundary
        if "boundary" in metabolite.attrib["id"]:
            novel_identifier = re.sub(
            r"_[eciglmnrx]_boundary", "_b", metabolite.attrib["id"]
            )
            metabolite.attrib["id"] = novel_identifier
            novel_compartment = "b"
            metabolite.attrib["compartment"] = novel_compartment
    # Correct reactions for model's boundary
    for reaction in reference["reactions"].findall(
    "version:reaction", reference["space"]
    ):
        # Search reaction's metabolites
        for metabolite in reaction.iter(
        "{http://www.sbml.org/sbml/level2/version4}speciesReference"
        ):
            # Determine whether metabolite's compartment is model's boundary
            if "boundary" in metabolite.attrib["species"]:
                novel_identifier = re.sub(
                r"_[eciglmnrx]_boundary", "_b", metabolite.attrib["species"]
                )
                metabolite.attrib["species"] = novel_identifier
    # Return content with changes
    return reference["content"]


def changeModelCompartment(content=None):
    """
    Changes annotations for a model's compartments

    This function changes annotations of a model's compartments.

    arguments:
        content (object): content from file in Systems Biology Markup Language
            (XML)

    returns:
        content with changes to attributes of compartments, metabolites, and
            reactions

    raises:

    """

    # Copy and interpret content
    reference = copyInterpretModelContent(content=content)
    # Correct compartment for model's boundary
    for compartment in reference["compartments"].findall(
    "version:compartment", reference["space"]
    ):
        # Determine whether compartment is for model's boundary
        if compartment.attrib["id"] == "e":
            compartment.attrib["name"] = "extracellular region"
    # Return content with changes
    return reference["content"]


def changeModelMetabolitesIdentifiers(
        metabolites_identifiers=None, content=None
):
    """
    Changes metabolites' identifiers

    This function changes metabolites' identifiers according to information
    about translation.

    arguments:
        metabolites_identifiers (list<dict<str>>): translations of metabolites'
            identifiers
        content (object): content from file in Systems Biology Markup Language
            (XML)

    returns:
        content with changes to metabolites' identifiers

    raises:

    """

    # Copy and interpret content
    reference = copyInterpretModelContent(content=content)
    # Change content for each combination of original and novel identifiers
    for row in metabolites_identifiers:
        # Construct targets to recognize original and novel identifiers
        original_elements = [row["identifier_original"], "_"]
        original_target = "".join(original_elements)
        novel_elements = [row["identifier_novel"], "_"]
        novel_target = "".join(novel_elements)
        # Change identifiers of metabolites
        for metabolite in reference["metabolites"].findall(
        "version:species", reference["space"]
        ):
            # Determine whether to change metabolite's identifier
            if original_target in metabolite.attrib["id"]:
                metabolite.attrib["id"] = metabolite.attrib["id"].replace(
                    original_target, novel_target
                )
        # Change identifiers of reactions' metabolites
        for reaction in reference["reactions"].findall(
        "version:reaction", reference["space"]
        ):
            # Search reaction's metabolites
            for metabolite in reaction.iter(
            "{http://www.sbml.org/sbml/level2/version4}speciesReference"
            ):
                # Determine whether to change metabolite's identifier
                if original_target in metabolite.attrib["species"]:
                    metabolite.attrib["species"] = (
                        metabolite.attrib["species"].replace(
                            original_target, novel_target
                        )
                    )
    # Return content with changes
    return reference["content"]


def main():
    """
    This function defines the main activity of the module.
    """

    # Specify directories and files
    directory = os.path.join(
            os.sep, "media", "tcameronwaller", "primary", "data", "local",
            "research_lex", "project_profondeur", "profondeur",
            "metabolic_models", "homo-sapiens", "recon_2-m-2"
            )
    in_file_path_model = os.path.join(
            directory, "recon2m2_mnx_entrez_gene.xml"
            )
    in_file_path_metabolites_identifiers = os.path.join(
            directory, "curation_metabolite_identifier.csv"
            )
    out_file_path_model = os.path.join(directory, "test.xml")
    # Read information from file
    #with open(in_file_path_model, "r") as in_file:
    #    content = in_file.read()
    content = et.parse(in_file_path_model)
    with open(in_file_path_metabolites_identifiers, "r") as in_file:
        reader = csv.DictReader(in_file, delimiter="\t")
        metabolites_identifiers = list(
                map(lambda row: dict(row), list(reader))
                )
    # Correct content
    content_compartment = changeModelCompartment(content=content)
    content_boundary = changeModelBoundary(content=content_compartment)
    content_prefix = removeModelIdentifierPrefix(content=content_boundary)
    content_identifier = changeModelMetabolitesIdentifiers(
        metabolites_identifiers=metabolites_identifiers,
        content=content_prefix
    )

    # Remove unnecessary prefix from metabolites' identifiers
    #content_prefixes = re.sub(r"M_MNXM", "MNXM", content)
    # Correct identifiers of metabolites

    # TODO: content_identifier = changeModelMetabolitesIdentifiers(
    #        content=content_boundary,
    #        metabolites_identifiers=metabolites_identifiers
    #        )


    #Write information to file
    #with open(out_file_path_model, "w") as out_file:
    #    out_file.write(content_identifier)
    content_final = content_identifier
    content_final.write(out_file_path_model, xml_declaration=False)

###############################################################################
# Script functionality

if __name__ == "__main__":
    main()
