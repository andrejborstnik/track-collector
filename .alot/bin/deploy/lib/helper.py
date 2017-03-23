#
# LIBRARIES
#


from fabric.api import *
from slacker import Slacker


#
# CONFIGURATION
#


# Configure what fabric sees.
__all__= []


#
# HELPER TASKS
#


def deploy_lock(path=None):
    """
    Create lock file, if it does not exist yet, abort otherwise.
    """

    if not path:
        return

    with hide('warnings', 'running'):
        if run("test -e %s" % path, quiet=True).succeeded:
            abort("Deployment is already in progress.")

        run("touch %s" % path)


def deploy_unlock(path=None):
    """
    Remove locked file.
    """

    if not path:
        return

    with hide('warnings', 'running'):
        if run("test -e %s" % path, quiet=True).succeeded:
            run("rm %s" % path)


def remote_scp(source_host, source_path, target_path):
    """
    Remote SCP. For the current host copy data from the source_path.
    """

    scp_cmd = "scp %s:%s %s" % (source_host, source_path, target_path)
    run(scp_cmd)


def remote_cmd(cmd):
    """
    Execute remote command.
    """

    return run(cmd)


def remote_exists(path=None):
    """
    Check if file exists.
    """

    if run("test -e %s" % path, quiet=True).succeeded:
        return True
    return False
