###########################################################################
# Documentation string


"""
This module contains definitions of several functions for defining groups.

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
    TCameronWaller@GMail.Com
    Jared Rutter Lab
    Department Of Biochemistry
    University Of Utah
    15 North Medical Drive East, Room 5520
    Salt Lake City, Utah 84112-5650

License:
    The module "group" provides tools for naming data files according to
    their experimental group.
    
    The complete license for the module "group" is in file LICENSE.txt
    within the same directory as this module.
    
    Copyright (C) 2016 Thomas Cameron Waller

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
"""


###########################################################################
# Notes


###########################################################################
# Installation and importation of packages and modules


# Packages and modules from the python standard library

import os
#import sys
import shutil
#import importlib

# Packages and modules from third parties

#import numpy
#import pandas
#import scipy
import cobra
import libsbml

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

###########################################################################
# Test script

#from __future__ import print_function
import cobra.io
import cobra.test


# Load models and export to JSON.

# Escherichia coli model example.

directory_root = os.path.join(
    "C:\\", "Data", "Local", "Research_Lex", "Project_Profondeur",
    "profondeur", "data"
)
file_path = os.path.join(
    directory_root, "model_e-coli_core.json"
)

# model = cobra.io.read_sbml_model(cobra.test.ecoli_sbml)
model = cobra.test.create_test_model("textbook")
cobra.io.save_json_model(model, file_path)

# Homo sapiens model Recon 2.2.

directory_root = os.path.join(
    "C:\\", "Data", "Local", "Research_Lex", "Project_Profondeur",
    "profondeur", "data"
)
file_path_in = os.path.join(
    directory_root, "model_h-sapiens_recon-2.xml"
)

file_path_out = os.path.join(
    directory_root, "model_h-sapiens_recon-2.json"
)

model = cobra.io.read_sbml_model(file_path_in)
cobra.io.save_json_model(model, file_path_out)

# Explore model.
print(model)

# Explore Reactions
print(len(model.reactions))
print(model.reactions)
# L_LACDcm, CITL
print(model.reactions[100])
reaction = model.reactions.get_by_id("L_LACDcm")
print(reaction)
print(reaction.name)
print(reaction.reaction)
print(reaction.reversibility)
print(reaction.gene_reaction_rule)

# Explore Metabolites
print(len(model.metabolites))
print(model.metabolites)
# h2o_c, atp_c, g6p_c, pyr_c, cit_c
print(model.metabolites[29])
metabolite = model.metabolites.get_by_id("cit_c")
print(metabolite)
print(metabolite.name)
print(len(metabolite.reactions))
print(metabolite.reactions)
print(metabolite.compartment)
print(metabolite.charge)
print(metabolite.formula)

# Explore Genes
print(len(model.genes))
print(model.genes)
print(model.genes[29])
grr = reaction.gene_reaction_rule
print(grr)
print(reaction.genes)
test_gene = model.genes.get_by_id("HGNC:26516")
print(test_gene)
print(test_gene.reactions)

###########################################################################
# Script functionality

if __name__ == "__main__":
    main()