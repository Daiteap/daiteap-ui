#!/bin/bash

# Error Interrupt
set -e

echo --- Set Environment Variables ---

export VUE_APP_THEME=daiteap
export VUE_APP_SINGLE_USER_MODE=False

echo --- Change Directory ---

cd ./app

echo --- Install Nginx ---

sudo apt update
sudo apt install nginx -y
sudo rm /etc/nginx/sites-enabled/default
sudo cp nginx/dev.conf /etc/nginx/sites-enabled/cloudcluster.conf
sudo service nginx restart

echo --- Remove Files From Previous Installations ---

sudo rm -r -f node_modules/
sudo rm -f package-lock.json
sudo rm -r -f dist/

echo --- Install Dependencies ---

sleep 10

sudo npm install -g @vue/cli
sudo npm uninstall node-sass -g && npm cache clean --force && npm install node-sass
npm install

echo --- Build UI ---

npm run build -- --modern
