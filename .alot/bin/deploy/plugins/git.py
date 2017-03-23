#
# LIBRARIES
#


from fabric.api import *


#
# CONFIGURATION
#


# Configure what fabric sees.
__all__= []


#
# GIT
#


@task
def git(cmd=None, repo=None, deploy_dir=None, user=None, password=None, branch=None):
    """
    Git remote commands.
    'clone'  --- clone from remote repository (repo) to current directory (deploy_dir).
    'reset'  --- throw away all changes and do a hard reset.
    'pull'   --- pull new changes from repository.
    'checkout' --- checkout specific branch.

    Variables:
    repo --- https URL to the GIT repository.
    deploy_dir  --- the name of the application directory.
    user and password --- git account credentials.
    branch -- name of branch to switch to.
    """

    cmd_list = ['clone', 'reset', 'pull', 'fetch', 'checkout']
    if cmd not in cmd_list:
        abort("Command '%s' is incorrect. Should be one of %s." % (cmd, cmd_list))

    if cmd == 'clone' and (not repo or not deploy_dir or not user or not password):
        abort("Command '%s' needs remote repository, target directory and git account." % cmd)
    elif cmd == 'clone':
        run('git clone %s %s' % (repo % (user, password), deploy_dir))

    if cmd == 'reset' and not deploy_dir:
        abort("Command '%s' needs target directory." % cmd)
    elif cmd == 'reset':
        with cd(deploy_dir):
            run('git reset --hard')

    if cmd == 'fetch' and not deploy_dir:
        abort("Command '%s' needs target directory." % cmd)
    elif cmd == 'fetch':
        with cd(deploy_dir):
            run('git fetch --all --prune')

    if cmd == 'pull' and not deploy_dir:
        abort("Command '%s' needs target directory." % cmd)
    elif cmd == 'pull':
        with cd(deploy_dir):
            run('git pull --all --prune')

    if cmd == 'checkout' and not deploy_dir:
        abort("Command '%s' needs target directory." % cmd)
    elif cmd == 'checkout' and branch:
        with cd(deploy_dir):
            run("git checkout %s" % branch)
