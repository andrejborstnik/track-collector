#! /bin/bash

#
# CONSTS
#


# The root for all scripts.
__ROOT__=$(realpath $(dirname $0)/../..)


#
# CONFIG
#


# Activation library support.
source $(dirname $0)/activate_config.sh

# Read project specific configuration.
if [ ! -e $__ROOT__/$__CONFIG__/config_project.sh ]
then
    error "Project specific configuration '$__ROOT__/$__CONFIG__/config_project.sh' has not been found."
    exit 1
fi

source $__ROOT__/$__CONFIG__/config_project.sh


#
# FUNCTIONS
#


usage() {
    echo "Usage: $0 dev|stage|prod|clean|list|run <plugin>|exit|help|cd <application>"
    echo "    Usually, one should load development environment first."
    echo "    Each of the additional environments is applied on top of the previous one."
    echo
    echo "    This will load development environment:"
    echo "        $0 dev"
    echo "    This will load staging environment:"
    echo "        $0 dev stage"
    echo "    To run a production environment:"
    echo "        $0 dev prod"
    echo
    echo "Options:"
    echo "    dev"
    echo "        Activate development environment."
    echo "    stage"
    echo "        Activate staging environment."
    echo "    prod"
    echo "        Activate production environment."
    echo "    test"
    echo "        Activate testing environment."
    echo "    clean"
    echo "        Clean configuration changes before running any environment scripts."
    echo "    list"
    echo "        List of the plugins to run."
    echo "    run <plugin>"
    echo "        Run specific environment <plugin>."
    echo "    cd <application>"
    echo "        Change directory to specific <application> after environment start."
    echo "    exit"
    echo "        Use exit, when interactive shell is not required after environment is activated."
    echo "    -h | --help | help"
    echo "        This help."
    exit 0
}


#
# MAIN
#


# <parse params>
#

# Check if at least one of parameters have been selected.
if [ $# -eq 0 ]
then
    error "At least one of the commands: dev, stage, prod, test, clean, list, run, or exit has to be selected."
    echo
    usage
fi

# Defaults
IS_DEV=0
IS_STAGE=0
IS_PROD=0
IS_TEST=0
IS_CLEAN=0
IS_LIST=0
IS_RUN=0
IS_CD=0
IS_EXIT=0

while [ $# -gt 0 ]
do
    WORD=$1
    case $WORD in
        dev)
            IS_DEV=1
            __MODE__=DEV
        ;;
        stage)
            IS_STAGE=1
            __MODE__=STAGE
        ;;
        prod)
            IS_PROD=1
            __MODE__=PROD
        ;;
        test)
            IS_TEST=1
            __MODE__=TEST
        ;;
        clean)
            IS_CLEAN=1
        ;;
        list)
            IS_LIST=1
        ;;
        run)
            IS_RUN=1
            if [ $# -gt 1 ]
            then
                PLUGIN=$2
                shift
                # The rest of parameters are not handled here - they are "passed" to plugin.
                # Plugin has been found, Remove 'run' command and stop the parsing.
                shift
                break 
            else
                error "$WORD command: missing <plugin> parameter."
                exit 1
            fi
        ;;
        cd)
            IS_CD=1
            if [ $# -gt 1 ]
            then
                __APP__=$2
                shift  # Remove $2.

                if ! [ -e $__ROOT__/$__APP__/package.json ]
                then
                    error "$WORD command: cound not find application '$__APP__'."
                    exit 1
                fi
            else
                error "$WORD command: missing <application> name."
                exit 1
            fi
        ;;        
        exit)
            IS_EXIT=1
        ;;
        help|-h|--help)
            usage
        ;;
        *)
            usage
        ;;
    esac

    shift
done

#
# </parse params>

if [ "$IS_LIST" == "1" ]
then
    echo_green "The list of activated plugins in the environment:"

    for CMD in $ETC_DIR/*.d/*
    do
        echo "    "${CMD#$ETC_DIR}
    done

    exit 0
fi

if [ "$IS_RUN" == "1" ]
then
    echo_green "Running plugin: [$PLUGIN] ..."

    PLUGIN_PATH=$ETC_DIR/$PLUGIN
    if [ -e $PLUGIN_PATH ]
    then
        . $PLUGIN_PATH
    elif [ -e $ETC_DIR/command.d/$PLUGIN ]
    then
        . $ETC_DIR/command.d/$PLUGIN
    else
        error "Plugin <$PLUGIN> has not been found."
        exit 1
    fi

    exit 0
fi

if [ "$IS_CLEAN" == "1" ] || [ "$IS_DEV" == "1"  ] || \
   [ "$IS_STAGE" == "1" ] || [ "$IS_PROD" == "1" ] || \
   [ "$IS_TEST" == "1"  ] || [ "$IS_EXIT" == "1" ]
then

    # Source the new environment and activate subshell.
    echo_green "Initializing virtual environment ...\n"

    PATH="$BIN_DIR:$PATH"

    TMPFILE=$(mktemp $TMPDIR/activate.XXXXXXXX)

cat <<EOF >$TMPFILE
    function on_exit() {
        rm -f $TMPFILE
    }

    trap on_exit EXIT INT

    [ -e ~/.bashrc ] && source ~/.bashrc

    # Set project root.
    __ROOT__=$__ROOT__

    # Set chosen application.
    __APP__=$__APP__

    # Set project mode.
    export __MODE__=$__MODE__

    # Activation library support.
    source $BIN_DIR/activate_config.sh

    # Read project configuration.
    source $__ROOT__/$__CONFIG__/config_project.sh

    # Cleaning phase.
    [ "$IS_CLEAN" == "1" ] && load_script_d clean \$RED
    
    # Load all development scripts.
    [ "$IS_DEV" == "1" ] && load_script_d development

    # Load all staging scripts.
    [ "$IS_STAGE" == "1" ] && load_script_d staging
    
    # Load production scripts to override on top.
    [ "$IS_PROD" == "1" ] && load_script_d production

    # Load testing scripts to override on top.
    [ "$IS_TEST" == "1" ] && load_script_d testing

    PS1="\$(new_ps \$PRJ_NAME \$__MODE__) "
    [ "$IS_EXIT" == "1" ] && exit
EOF

    # Run a subshell with created environment.
    exec $BASH --init-file $TMPFILE

    exit 0
fi
