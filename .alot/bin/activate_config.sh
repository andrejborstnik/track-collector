#! /bin/bash

#
# COMMON CONFIGURATION
#


# The name of the global environment.
ENV_NAME=.alot

# Config folder name.
__CONFIG__=__config__


#
# CONSTS
#


# Linux or Darwin
SYSTEM=$(uname -s)

# Check if realpath exists.
if ! which realpath > /dev/null
then
    [ $SYSTEM == "Darwin" ] && echo "ERROR: realpath not found. Maybe you want to use 'brew install coreutils' and to upgrade 'sudo pip install -U pip'."
    exit 1
fi

# Setup md5
[ $SYSTEM == "Darwin" ] && which gmd5sum >/dev/null && MD5=$(which gmd5sum) || MD5=$(which md5)
[ $SYSTEM == "Linux" ] && MD5=$(which md5sum)

# Date
which gdate >/dev/null && DATE=$(which gdate) || DATE=$(which date) 

BASH=$(which bash)
ECHO=$(which echo)
[ $SYSTEM == "Darwin" ] && which gecho >/dev/null && ECHO=$(which gecho)
PIP=$(which pip)
BREW=$(which brew)
NODE=$(which node)
TMPDIR=${TMPDIR:-/tmp}

BIN_DIR=$__ROOT__/$ENV_NAME/bin
ETC_DIR=$__ROOT__/$ENV_NAME/etc

# Colors.
GREEN='\e[32m'
RED='\e[31m'
BLACK='\e[0m'


#
# FUNCTIONS
#


# Green output.
echo_green() {
    $ECHO -e ${GREEN}"$*"${BLACK}
}

# Green output.
echo_red() {
    $ECHO -e ${RED}"$*"${BLACK}
}

# Warnings.
warning() {
    $ECHO -e ${GREEN}"WARNING: $*"${BLACK}
}

# Errors.
error() {
    $ECHO -e ${RED}"ERROR: $*"${BLACK}
}

# Ms timestamp.
time_it() {
    echo -n $(($($DATE +%s%N)/1000000))
}

# Crate new prompt.
new_ps() {
    local PROJECT MODE NEW_PS
    
    PROJECT=${1:-""}
    MODE=${2:-""}
    NEW_PS="\\[\\033[0;32m\\][$PROJECT/$MODE] (\\h:\\W)\\$\\[\\033[0m\\]"
    echo $NEW_PS
}

# Replace key values in a file.
replace_in_file() {
    local FILE KEY VALUE

    [ -z "$1" ] && exit 1
    [ -z "$2" ] && exit 1
    [ -z "$3" ] && exit 1

    FILE=$1
    KEY=$2
    VALUE=$3

    sed "s#$KEY#$VALUE#g" $FILE | sudo tee $FILE.old >/dev/null
    sudo mv -f $FILE.old $FILE
}

# Source all scripts from ${1}.d directory.
# Color: ${2}
load_script_d() {
    local FILE ST COLOR

    [ -n "$1" ] && local TARGET=$1 || { error "Target not set for load_script_d!"; exit 1; }
    COLOR=${2:-$GREEN}

    if [ -d $ETC_DIR/$TARGET.d ] && ls $ETC_DIR/$TARGET.d/* >/dev/null 2>&1
    then
        for FILE in $ETC_DIR/$TARGET.d/*
        do
            $ECHO -ne [$TARGET] loading scripts ... $COLOR ${FILE##*/} $BLACK
            
            ST=$(time_it)
            source $FILE
            echo ... $(($(time_it)-ST))ms
        done
    fi
}

