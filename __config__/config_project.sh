#! /bin/bash

#
# PROJECT CONFIGURATION
#


# Project name.
PRJ_NAME=GPS

# Development.
DB_DEV=gps-dev

# Staging.
SN_STAGE=node-gps-staging.service
USER_STAGE=gps-staging
GROUP_STAGE=gps-staging
DESC_STAGE="GPS staging node server."
DB_STAGE=gps-staging

# Production.
SN_PROD=node-gps.service
USER_PROD=gps
GROUP_PROD=gps
DESC_PROD="GPS production node server."
DB_PROD=gps

# Testing.
DB_TEST=gps-testing
