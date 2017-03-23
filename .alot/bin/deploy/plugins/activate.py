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
#  ACTIVATE
#


@task
def activate(env_dir=None, environment="dev prod exit"):
    """
    Activate the virtualenv environment.

    Variables:
    env_dir --- the name of the application directory.
    environment --- the proper env. activation string.
    """

    if not env_dir:
        abort("Cannot activate virtualenv environment without target directory.")

    # Check if activate.sh exists.
    activate_cmd_path = "%s/bin/activate.sh" % env_dir
    exists = execute(helper.remote_exists, path=activate_cmd_path)[env.host_string]
    if exists:
        sudo("%s %s" % (activate_cmd_path, environment), user=env.user)

