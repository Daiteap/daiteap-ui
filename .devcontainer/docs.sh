#!/bin/bash

# Error Interrupt
set -e

echo --- Install MkDocs ---

sudo apt install mkdocs -y

echo --- Build Documentation ---

cp app/public/favicon-daiteap.ico app/docs/docs/img/favicon.ico
mkdocs build -f app/docs/mkdocs.yaml --site-dir public/documentation

echo --- Run Docs ---

mkdocs serve --config-file app/docs/mkdocs.yaml -a localhost:8085
