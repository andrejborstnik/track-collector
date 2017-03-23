#
# LIBRARIES
#


# Configure coloured output.
import fabric.api
from fabric.colors import green
old_puts = fabric.api.puts
fabric.api.puts = lambda x:old_puts(green(x))

# Fabric default settings
from config_project import *

# Import logging redirection
import deploy.lib.fablog

# Deployment
from deploy import app
