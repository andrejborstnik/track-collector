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
        'jupyter0',
    ],

    'prod': [
        'gps-srv',
    ],
}

# Deployment profiles.
env.profile = {
    'stage' : {
        'user' : "gps-staging",
        'password' : "gps",
        'deploy_dir' : "/home/gps-staging/www",
        # 'deploy_repo' : "https://%s:%s@gogs.matheo.si/Abelium-alot/GPS.git", // todo
        'service' : "node-gps-staging.service",
        'environment' : "dev stage exit",
        'backup_dir' : '/backup/gps-stage',
        'branch': 'prod',
        'url': 'https://gps-stage.matheo.si'
    },

    'prod' : {
        'user' : 'gps',
        'password' : 'gps', # todo
        'deploy_dir' : "/home/gps/www",
        # 'deploy_repo' : "https://%s:%s@gogs.matheo.si/Abelium-alot/GPS.git", // todo
        'service' : "node-gps.service",
        'environment' : 'dev prod exit',
        'backup_dir' : '/backup/gps',
        'branch': 'prod',
        'url': 'https://gps.matheo.si'
    },
}
