#!/bin/bash
#
# This is not for you. The project does not use this. This how I start my dev setup
# https://stackoverflow.com/questions/8537149/how-to-start-tmux-with-several-windows-in-different-directories

git diff-index --quiet HEAD -- && {
  # Make sure we are working with the latest copy.
  git pull
} || {
  echo "This project has un-commited changes."
  echo "Don't forget to post and commit your changes."
  sleep 10
}

[ ! -d .venv ] && {
  python3 -m venv .venv
  source .venv/bin/activate
  .venv/bin/pip install tinydb uvicorn "fastapi[standard]"
}

# vscode ./
open http://127.0.0.1:8000 &

# Create new session with a running backend
tmux new-session -s driFTPin -n Shell -d "btop"

tmux new-window -t "driFTPin:1" -n uvicorn -d './.venv/bin/python3 -m uvicorn main:app --reload'

tmux new-window -t "driFTPin:2" -n NeoVim 'nvim'

# Add a third window with shell
tmux new-window -t "driFTPin:3" -n shell

# Attach to the tmux session
tmux attach -d -t driFTPin:NeoVim
