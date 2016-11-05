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

import numpy
#import pandas
import scipy
import cobra
# libsbml is only necessary to read or write files in SBML level 2.

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

import os
import cobra
from __future__ import print_function
import cobra.io
import cobra.test

# Model

model = cobra.test.create_test_model("textbook")
print(model)

# Explore Reactions
print(len(model.reactions))
print(model.reactions)
print(model.reactions[29])
pgi = model.reactions.get_by_id("PGI")
print(pgi)
print(pgi.name)
print(pgi.reaction)
print(pgi.reversibility)

# Explore Metabolites
print(len(model.metabolites))
print(model.metabolites)
print(model.metabolites[29])
g6p_c = model.metabolites.get_by_id("g6p_c")
print(g6p_c)
print(g6p_c.name)
print(len(g6p_c.reactions))
print(g6p_c.reactions)
atp_c = model.metabolites.get_by_id("atp_c")
print(atp_c)
print(atp_c.name)
print(atp_c.compartment)
print(atp_c.charge)
print(atp_c.formula)
print(len(atp_c.reactions))
print(atp_c.reactions)

# Explore Genes
print(len(model.genes))
print(model.genes)
print(model.genes[29])
gpr = pgi.gene_reaction_rule
gpr
print(gpr)
print(pgi.genes)
pgi_gene = model.genes.get_by_id("b4025")
print(pgi_gene)
print(pgi_gene.reactions)

# Export model to JSON

directory_root = os.path.join(
    "C:\\", "Data", "Local", "Course_Visualization", "Project_Profondeur"
)
file_path = os.path.join(
    directory_root, "model_e-coli_core.json"
)

# model = cobra.io.read_sbml_model(cobra.test.ecoli_sbml)
model = cobra.test.create_test_model("textbook")
cobra.io.save_json_model(model, file_path)



###########################################################################
# Script functionality

if __name__ == "__main__":
    main()