# Daiteap Cloud Console

URL [daiteap.com](https://www.daiteap.com/)

[License Apache 2.0](./LICENSE)

This repo contains the Daiteap Cloud Console, which is a browser application used to interact with the daiteap platform.

![Daiteap Console](./img/Console_Start_Screen_GitHub_small.png)

# Start UI

- Clone the repo:
```
git clone https://github.com/Daiteap/daiteap-ui.git
```

- Enter `app` directory:
```
cd ./daiteap-ui/app
```

- Install requirements:
```
sudo rm -r -f node_modules/
sudo rm package-lock.json
sudo apt install npm nginx -y
sudo npm install -g @vue/cli
sudo npm uninstall node-sass -g && npm cache clean --force && npm install node-sass
npm install
```

- Build UI:
```
export VUE_APP_THEME=daiteap
export VUE_APP_SINGLE_USER_MODE=False
npm run build -- --modern
```

- Change the adresses in `app/nginx/dev.conf`

- Setup Nginx config and restart Nginx service:
```
sudo cp ./nginx/dev.conf etc/nginx/sites-enabled/cloudcluster.conf
sudo service nginx restart
```

- Edit `auth-server-url` in `daiteap-ui/app/public/keycloak.json`

- Run UI:
```
export VUE_APP_THEME=daiteap
export VUE_APP_SINGLE_USER_MODE=False
npm run serve -- --port 8084
```

# Build Documentation Pages
```
cp ./public/favicon-daiteap.ico ./docs/docs/img/favicon.ico
mkdocs build -f ./docs/mkdocs.yaml --site-dir ../public/documentation
mkdocs serve --config-file ./docs/mkdocs.yaml -a localhost:8085
```