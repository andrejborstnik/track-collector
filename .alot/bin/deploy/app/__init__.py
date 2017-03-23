#
# LIBRARIES
#


from fabric.api import *
from fabric import operations
from deploy.lib import helper
from deploy.lib.slack import slack
from deploy.lib.rocket import rocket
from commands import * 
import os

# Tasks
from deploy.plugins.git import git
from deploy.plugins.activate import activate
from deploy.plugins.clean import clean
from deploy.plugins.systemctl import systemctl

# Configuration.
from config_project import LOCK_FILE, ENV_NAME


#
# CONFIG
#


# Configure what fabric sees.
__all__ = ['deploy', 'list_db', 'import_db']


# Find project root.
__root__ = os.path.abspath(os.path.split(__file__)[0] + "/../../..")


#
# Deployment
#


@task
def deploy(target=None, server=None, restart=False, branch=None):
    """
    Deploy the configured git repository to a target machine. Reset or start necessary services.
    Usage: fab app.deploy:<target>[,server=<server>][,restart=<True|False>][,branch=<branch>]

    The permitted target values are defined in the configuration file.

    To deploy to a specific server, specify the server option. The server must be listed in
    the configuration file.

    To restart the application specify restart=True.

    To deploy from a specific git branch, specify the branch option. This overrides the branch
    option in the configuration file.

    Example: to deploy the production branch on stage:
        fab app.deploy:stage,branch=prod
    """

    if not target and not server:
        abort("Command's target or host should be specified.")

    targets = env.targets.keys()
    if target and not target in targets:
        abort("Command's target can be only one of %s." % targets)

    if target and not target in env.profile:
        abort("Command's profile can be only one of %s." % targets)

    # Get the hosts from lists of targets.
    list_of_hosts = [hosts for sublist in env.targets.values() for hosts in sublist]
    if server and not server in list_of_hosts:
        uniq = lambda x: list(set(x))
        abort("The host '%s' has to be one of %s hosts." % (server, uniq(list_of_hosts)))

    # Find the hosts to deploy index to.
    hosts_list = None
    if server:
        hosts_list = [server]
    else:
        hosts_list = env.targets[target]

    # Override environment user and password.
    with settings(user=env.profile[target]['user'], password=env.profile[target]['password']):
        deploy_dir = env.profile[target]['deploy_dir']
        deploy_repo = env.profile[target]['deploy_repo']
        service = env.profile[target]['service']
        environment = env.profile[target]['environment']
        deploy_branch = branch or env.profile[target]['branch']
        url = env.profile[target]['url']
        messaging = env.profile[target]['messaging']
        channel = env.profile[target]['channel']
        token = env.profile[target]['token']

        # Lock target hosts.
        with settings(parallel=True, hosts=hosts_list):
            execute(helper.deploy_lock, path=LOCK_FILE)

        # Deploy git repository to target hosts.
        for host in hosts_list:
            try:
                # Deployment (create or pull from git, activate environment, ...)
                with settings(hosts=[host]):
                    exists = execute(helper.remote_exists, path=deploy_dir)[host]
                    if exists:
                        puts("Git repository '%s' hard reset ..." % deploy_dir)
                        execute(git, cmd='reset', deploy_dir=deploy_dir)
                    else:
                        puts("Cloning git repository from '%s'" % deploy_repo)
                        execute(git, cmd='clone', repo=deploy_repo, deploy_dir=deploy_dir, user=env.deploy_user, password=env.deploy_pass)

                    puts("Updating repository '%s' with branch data ..." % deploy_dir)
                    execute(git, cmd='fetch', deploy_dir=deploy_dir)

                    if deploy_branch:
                        puts("Switching to branch '%s' ..." % deploy_branch)
                        execute(git, cmd='checkout', deploy_dir=deploy_dir, branch=deploy_branch)

                    puts("Updating repository '%s' with new data ..." % deploy_dir)
                    execute(git, cmd='pull', deploy_dir=deploy_dir)

                    puts("Cleaning environment '%s' ..." % deploy_dir)
                    execute(clean, deploy_dir=deploy_dir)

                    puts("Activating environment '%s' ..." % deploy_dir)
                    execute(activate, env_dir="%s/%s" % (deploy_dir, ENV_NAME), environment=environment)

                    if restart:
                        puts("Restarting service '%s' ..." % service)
                        execute(systemctl, cmd='restart', service=service)
            
                    # Send deployment message.
                    if messaging == 'slack':
                        slack(token=token, channel=channel, target=target, url=url)
                    elif messaging == 'rocket':
                        rocket(token=token, channel=channel, target=target, url=url)
            finally:
                # Unlock, clean up.
                with settings(parallel=True, hosts=hosts_list):
                    execute(helper.deploy_unlock, path=LOCK_FILE)


@task
def list_db(target=None, server=None, limit=10):
    """
    List last N (default 10) database backups at a target (sorted by time reversed).
    To use limit call it like this: fab app.list:stage,limit=3
    """

    if not target and not server:
        abort("Command's target or host should be specified.")

    targets = env.targets.keys()
    if target and not target in targets:
        abort("Command's target can be only one of %s." % targets)

    if target and not target in env.profile:
        abort("Command's profile can be only one of %s." % targets)

    # Get the hosts from lists of targets.
    list_of_hosts = [hosts for sublist in env.targets.values() for hosts in sublist]
    if server and not server in list_of_hosts:
        uniq = lambda x: list(set(x))
        abort("The host '%s' has to be one of %s hosts." % (server, uniq(list_of_hosts)))

    # Find the hosts to deploy index to.
    hosts_list = None
    if server:
        hosts_list = [server]
    else:
        hosts_list = env.targets[target]    

    # Convert it to int (when passed from CLI).
    limit=int(limit)

    # Override environment user and password.
    with settings(user=env.profile[target]['user'], password=env.profile[target]['password']):
        backup_dir = env.profile[target]['backup_dir']

        # List databases from a backup that we can import (reverse time sort).
        for host in hosts_list:
            with settings(hosts=[host]), quiet():
                exists = execute(helper.remote_exists, path=backup_dir)[host]
                if not exists:
                    abort("Remote directory '%s' at host '%s' does not exist!" % (backup_dir, host))

                puts("Getting the list of backups at %s%s ..." % (host, backup_dir))
                files_str = execute(helper.remote_cmd, cmd='ls %s' % backup_dir)[host]
                file_list = files_str.split()
                file_list.sort(reverse=True)
                file_list = file_list[:limit]

                for fn in file_list:
                    print fn


@task
def import_db(target=None, server=None, file=None, db=None, drop=None):
    """
    Import into local database named <db> a file <file> from the remote database. By default the db name can be guessed from <file>.
    
    To drop database use option drop=1 as in the following example:
        fab app.import_db:stage,file=example.tgz,drop=1

    To install under different db name:
        fab app.import_db:stage,file=example.tgz,drop=1,db=example-db
    """

    if not target and not server:
        abort("Command's target or host should be specified.")

    targets = env.targets.keys()
    if target and not target in targets:
        abort("Command's target can be only one of %s." % targets)

    if target and not target in env.profile:
        abort("Command's profile can be only one of %s." % targets)

    # Get the hosts from lists of targets.
    list_of_hosts = [hosts for sublist in env.targets.values() for hosts in sublist]
    if server and not server in list_of_hosts:
        uniq = lambda x: list(set(x))
        abort("The host '%s' has to be one of %s hosts." % (server, uniq(list_of_hosts)))

    # Find the hosts to deploy index to.
    hosts_list = None
    if server:
        hosts_list = [server]
    else:
        hosts_list = env.targets[target]    

    if not file:
        abort("The name of the backup file to import database is needed.")

    if not db:
        if not "_" in file or not file.endswith(".tgz"):
            abort("Wrong backup file name '%s'!" % file)
        db = file.split("_")[0]
    db_from_file = file.split("_")[0]

    # Override environment user and password.
    with settings(user=env.profile[target]['user'], password=env.profile[target]['password']):
        backup_dir = env.profile[target]['backup_dir']

        # Import database from a backup.
        for host in hosts_list:
            with settings(hosts=[host]):
                exists = execute(helper.remote_exists, path="%s/%s" % (backup_dir, file))[host]
                if not exists:
                    abort("Remote file '%s/%s' at host '%s' does not exist!" % (backup_dir, file, host))

                # Create temporary directory for temporary files.
                tmp_dir = getstatusoutput("mktemp -d mongo_dump.XXXXXXXX")[1]

                puts("Copying remote file '%s/%s' to temporary directory." % (backup_dir, file))
                execute(operations.get, remote_path="%s/%s" % (backup_dir, file), local_path="%s/%s" % (tmp_dir, file))

                puts("Starting to import database %s into %s ..." % (db_from_file, db))
                cmd = "%s/bin/activate.sh run mongo restore %s %s %s/%s" % (__root__, "-d" if drop else "",
                    "-n %s" % db, tmp_dir, file)

                status, output = getstatusoutput(cmd)
                puts(output)

                if status == 0:
                    puts("Database import completed succesfully.")

                if getstatusoutput("test -d %s" % tmp_dir)[0] == 0:
                    getstatusoutput("rm -rf %s" % tmp_dir)[1]
