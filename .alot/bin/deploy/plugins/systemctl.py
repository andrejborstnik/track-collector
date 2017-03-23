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
# GIT
#


@task
def systemctl(cmd=None, service=None):
    """
    Systemctl remote commands.
    'start'    --- start the specified service.
    'stop'     --- stop the specified service.
    'restart'  --- restart the specified service.

    Variables:
    service    --- service to be managed.
    """

    cmd_list = ['start', 'stop', 'restart']
    if cmd not in cmd_list:
        abort("Command '%s' is incorrect. Should be one of %s." % (cmd, cmd_list))

    sudo('systemctl daemon-reload')
    sudo('systemctl %s %s' % (cmd, service))
