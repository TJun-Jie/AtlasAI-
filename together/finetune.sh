#!/bin/bash

if [[ "$PWD" != */together ]]; then
    echo "Please run this script from the together directory."
    exit 1
fi

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

. venv/bin/activate
pip install -r requirements.txt
python data.py
python finetune.py
