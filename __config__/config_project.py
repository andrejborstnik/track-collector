#
# LIBRARIES
#


from fabric.api import *


#
# CONFIGURATION
#


# Environment name
ENV_NAME=".alot"

# All stdout and stderror will be logged to the following file.
LOG_FILE = "/tmp/deploy-gps.log"

# Lock file.
LOCK_FILE = "/tmp/lock_gps_deployment"

# Project name.
PRJ_NAME = "GPS"

# Define fabric environment.
env.colorize_errors = True

# Deployment account.
env.deploy_user = "deploy"
env.deploy_pass = "depl0ydepl0y"

# Deployment targets.
env.targets = {
    'stage': [
        'gps.int.goopti.com',
    ],

    'prod': [
        '',
    ],
}

# Deployment profiles.
env.profile = {
    'stage' : {
        'user' : "trackcollector",
        'password' : "gps",
        'key_filename': '~/.ssh/id_rsa',
        'deploy_dir' : "/home/trackcollector/www",
        'deploy_repo': "https://%s:%s@github.com/andrejborstnik/track-collector.git",
        'service' : "node-gps-staging.service",
        'environment' : "dev prod exit",
        'backup_dir' : '/backup/trackcollector-stage',
        'branch': 'master',
        'url': 'https://test.goopti.com//trackcollector/browse'
    },

    'prod' : {
        'user' : 'trackcollector',
        'password' : 'gps', # todo
        'key_filename': '~/.ssh/id_rsa',
        'deploy_dir' : "/home/trackcollector/www",
        'deploy_repo' : "https://%s:%s@github.com/andrejborstnik/track-collector.git",
        'service' : "node-gps.service",
        'environment' : 'dev prod exit',
        'backup_dir' : '/backup/trackcollector',
        'branch': 'prod',
        'url': 'https://test.goopti.com//trackcollector/browse'
    },
}
