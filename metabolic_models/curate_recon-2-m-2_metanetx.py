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


def correctModelBoundary(content=None):
    """
    Corrects annotations in for a model's boundary.
    
    This function corrects annotations of the model's boundary in compartments,
    metabolites, and reactions.
    
    arguments:
        content (object): content from file in Extensible Markup Language (XML)
        
    returns:
        content with changes to attributes of compartments, metabolites, and
        reactions
        
    raises:
        
    """
    
    # Set references in content
    sbml = content.getroot()
    model = sbml[0]
    compartments = model[1]
    metabolites = model[2]
    reactions = model[3]
    print("children in compartments")
    for child in compartments:
        print(child.tag, child.attrib)
    #https://docs.python.org/3/library/xml.etree.elementtree.html#module-xml.etree.ElementTree
    # use for child in model.findall(species) or for child in model.iter(species)
    print("now do it the more intelligent way")
    for compartment in model.findall("compartment"):
        print(compartment.tag, compartment.attrib)
        
    # TODO: That doesn't work, and it might be a proble with my references to sub parts of the model?

    
    # Correct name of boundary compartment
    #content_boundary = content.replace("Extra organism", "model boundary")
    # Correct identifiers of metabolites in boundary compartment
    #content_boundaries = re.sub(
    #        r"_[eciglmnrx]_boundary", "_b", content_boundary
    #        )
    #return content_boundaries


def changeModelMetabolitesIdentifiers(
        metabolites_identifiers=None, content=None
        ):
    """
    Changes metabolites' identifiers in a model.
    
    This function changes metabolites' identifiers according to information
    about translation.
    
    arguments:
        metabolites_identifiers (list<dict<str>>): translations of metabolites'
            identifiers
        content (str): content of a model in Extensible Markup Language (XML)
        
    returns:
        content of a model in XML with changes to metabolites' identifiers
        
    raises:
        
    """
    
    # Change content for each combination of original and novel identifiers
    for row in metabolites_identifiers:
        # Construct targets to recognize original and novel identifiers
        original_elements = ["_", row["identifier_original"], "_"]
        original_target = "".join(original_elements)
        novel_elements = ["_", row["identifier_novel"], "_"]
        novel_target = "".join(novel_elements)
        content = content.replace(original_target, novel_target)
    return content


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
            directory, "translation_metabolite_identifier.csv"
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
    content_boundary = correctModelBoundary(content=content)
    
    
    # Remove unnecessary prefix from metabolites' identifiers
    #content_prefixes = re.sub(r"M_MNXM", "MNXM", content)
    # Correct annotations for model's boundary
    # TODO: content_boundary = correctModelBoundary(content=model_content)
    # Correct identifiers of metabolites
    
    # TODO: content_identifier = changeModelMetabolitesIdentifiers(
    #        content=content_boundary,
    #        metabolites_identifiers=metabolites_identifiers
    #        )

    
    #Write information to file
    #with open(out_file_path_model, "w") as out_file:
    #    out_file.write(content_identifier)
    content_final = content
    content_final.write(out_file_path_model)
    
###############################################################################
# Script functionality

if __name__ == "__main__":
    main()