#
# LIBRARIES
#


from fabric.api import *
from slacker import Slacker

# Configuration.
from config_project import PRJ_NAME


#
# CONFIGURATION
#


# Configure what fabric sees.
__all__= []


#
#  FUNCTIONS
#


def send_to_slack(token, channel, data):
    """
    Send the message to specific slack channel.
    """

    slack = Slacker(token)
    slack.chat.post_message(channel, msg)


def slack(token, channel="#slack_test", sender="*[Dark-Matter-Monster]*", target="prod", url="#"):
    """
    Send a message to slack channel.
    """
    import urllib2
    import urllib
    import commands
    import random
    import json

    joke = None
    status, output = commands.getstatusoutput('git shortlog -sn | cut -c8- | grep -vE "Abelium|Staging"')
    if status == 0:
        random_person = random.choice(output.splitlines())
        params = urllib.urlencode({"firstName" : "*%s*" % random_person, "lastName": ""})
        f = urllib.urlopen('http://api.icndb.com/jokes/random?%s' % params)
        # f = urllib.urlopen('http://api.icndb.com/jokes/random')
        joke = json.loads(f.read())

    msg = "%s _%s_\n\n" % (sender, random.choice([
        "While deploying ...", "Ah, this occured to me ...", "Wow, can you believe that ...",
        "I have to say ...", "Being a Dark Matter Monster feels special ...", "Just for you ...",
        "Meanwhile in land far far away ...", "Only words could do the justice ...", "Have you noticed ...",
        "Not everybody thinks that ...", "Khm, khm ...", "A ha ha ha ..."]))

    if joke:
        msg += "%s _%s_\n\n" % (sender, joke['value']['joke'])

    status, git_user = commands.getstatusoutput('git config user.name')
    msg += "%s :arrow_forward: %s\n" % (sender, "A new %s build has been deployed to [*%s*](%s) by *%s*." % (PRJ_NAME, target, url, git_user))

    send_to_slack(token, channel, msg)
