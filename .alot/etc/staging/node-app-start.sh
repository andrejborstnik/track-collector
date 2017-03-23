#!/bin/bash

#
# CONSTS
#


# Node package manager.
NPM=$(which npm)

# The root for all scripts.
__ROOT__=$(realpath $(dirname $0)/../../..)

# The name of the global environment.
ENV_NAME=.alot

# Config folder name.
__CONFIG__=__config__

# Set mode.
export __MODE__=STAGE


#
# CONFIG
#


# Activation library support.
source $__ROOT__/$ENV_NAME/bin/activate_config.sh

# Read project configuration.
source $__ROOT__/$__CONFIG__/config_project.sh


#
# MAIN
#


# Load development.d scripts.
load_script_d development

# Load staging.d scripts.
load_script_d staging

# Start applications.
op-start

