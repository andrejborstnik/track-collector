#
# LIBRARIES
#


from fabric.api import *
from deploy.lib import helper


#
# CONFIGURATION
#


# Configure what fabric sees.
__all__= []


#
#  CLEAN
#


@task
def clean(deploy_dir=None):
    """
    Target deployment directory cleanup.

    Variables:
    deploy_dir  --- the name of the application directory.
    """

    if not deploy_dir:
        abort("No deployment directory to clean.")

    # Check if .package.json.md5 exists.
    activate_cmd_path = "%s/*/.package.json.md5" % deploy_dir
    exists = execute(helper.remote_exists, path=activate_cmd_path)[env.host_string]
    if exists:
        sudo("rm -f %s" % activate_cmd_path, user=env.user)

