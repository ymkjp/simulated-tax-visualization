#!/usr/bin/env bash

_project () {
  set -u

  start () {
    yarn run start
  }

  _info () {
    MESSAGE="${1:-''}"
    echo "[$(basename "$0")] INFO: ${MESSAGE}"
  }

  _error () {
    MESSAGE="${1:-'Something went wrong.'}"
    echo "[$(basename "$0")] ERROR: ${MESSAGE}" >&2
    exit 1
  }

  _usage () {
    readonly SCRIPT_NAME=$(basename "$0")
    echo -e "${SCRIPT_NAME} -- dotfiles
    \\nUsage: ${SCRIPT_NAME} [arguments]
    \\nArguments:"
    declare -F | awk '{print "\t" $3}' | grep -v $'^\t_'
  }

  if [[ $# = 0 ]]; then
    _usage
  elif [[ "$(type -t "$1")" = "function" ]]; then
    $1
  else
    _usage && _error "Command '$1' not found."
  fi
}

_project "$@"
