#!/usr/bin/env bash
# ============================================================
# NASA Mission Flight Simulator — Desktop Game Launcher
# Developed for NASA Space Apps Challenge 2026 by Team Mysterio
# ============================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "============================================================"
echo "🚀 NASA MISSION FLIGHT SIMULATOR · TEAM MYSTERIO"
echo "76 Historical Playable Missions · Earth to Deep Space"
echo "============================================================"

# Detect Python & Virtual Environment
if [ -d ".venv" ]; then
    PYTHON_EXEC=".venv/bin/python"
elif command -v uv &>/dev/null; then
    echo "Initializing virtual environment with uv..."
    uv venv .venv
    uv pip install pygame-ce numpy
    PYTHON_EXEC=".venv/bin/python"
elif command -v python3 &>/dev/null; then
    echo "Creating virtual environment with python3 -m venv..."
    python3 -m venv .venv
    .venv/bin/pip install pygame-ce numpy
    PYTHON_EXEC=".venv/bin/python"
else
    echo "Error: Python 3 is required but not found in PATH."
    exit 1
fi

echo "Launching NASA Mission Flight Simulator..."
"$PYTHON_EXEC" main.py
