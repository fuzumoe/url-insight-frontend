#!/bin/bash
# filepath: /opt/adam/urlinsight-frontend/scripts/initialize_backend.sh

set -e

# Define the backend directory as a subdirectory in the current directory
BACKEND_DIR="urlinsight-backend"
REPO_URL="git@github.com:fuzumoe/urlinsight-backend.git"

if [ ! -d "$BACKEND_DIR" ]; then
  echo "Adding backend as a Git submodule..."
  git submodule add "$REPO_URL" "$BACKEND_DIR"
  git submodule update --init --recursive
else
  echo "Backend submodule already exists. Updating submodule..."
  git submodule update --remote --merge
fi

echo "Backend submodule initialization complete."