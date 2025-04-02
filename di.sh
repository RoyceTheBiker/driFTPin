#!/bin/bash
#
# This is not for you. The project does not use this. This how I start my dev setup
# https://stackoverflow.com/questions/8537149/how-to-start-tmux-with-several-windows-in-different-directories

[ ! -d .venv ] && {
  python3 -m venv .venv
  source .venv/bin/activate
  .venv/bin/pip install tinydb uvicorn "fastapi[standard]"
}

# vscode ./
open http://127.0.0.1:8000 &

# Create new session with a running backend
tmux new-session -s driFTPin -n Shell -d "${SHELL}"

tmux new-window -t "driFTPin:1" -n uvicorn -d './.venv/bin/python3 -m uvicorn main:app --reload'

# Add a second window with git tool
tmux new-window -t "driFTPin:2" -n NeoVim 'nvim'

# Add a third window with shell
tmux new-window -t "driFTPin:2" -n shell

# Attach to the tmux session
tmux attach -d -t driFTPin:NeoVim
