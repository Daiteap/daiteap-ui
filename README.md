# Daiteap Cloud Console

URL [daiteap.com](https://www.daiteap.com/)

[License Apache 2.0](./LICENSE)

This repo contains the Daiteap Cloud Console, which is a browser application
used to interact with the daiteap platform.

![Daiteap Console](./img/Console_Start_Screen_GitHub_small.png)

## Development Environment

### Start Devcontainer

There are 2 ways to start the devcontainer

From VS Code:

- Install Dev Containers extension in VS Code
- From Remote Explorer tab -> Dev Containers -> + New Dev Container
  -> Open Current Folder in Container

From Terminal:

- Install `devcontainers`
- Execute

```bash
# start devcontainer
devcontainer up --workspace-folder .
# start vscode
code .
```

- Attach VSCode to the running devcontainer

Once the devcontainer is created this script `.devcontainer/buils-ui.sh` is executed
automatically, wait for it to complete - you can see the progress
in the terminal, inside the devcontainer

### Configuration (execute the commands inside the devcontainer)

- Change the adresses in `app/nginx/dev.conf`,
  then execute these commands to setup Nginx config and restart Nginx service:

```bash
sudo cp app/nginx/dev.conf /etc/nginx/sites-enabled/cloudcluster.conf
sudo service nginx restart
```

- Edit `auth-server-url` in `daiteap-ui/app/public/keycloak.json`

### Run UI (execute the commands inside the devcontainer)

```bash
cd app
export VUE_APP_THEME=daiteap
export VUE_APP_SINGLE_USER_MODE=False
npm run serve -- --port 8084
```

The UI should run on port 8090 but if that port is already in use on your machine,
check where the app is actually forwarded, in VSCode,
at the bottom of the window, next to "Dev Container: Daiteap UI",
click on the "Forwarded Ports" symbol and see the `Local Address` for port 8090

Use this address in Keycloak,
by changing the URL settings of `app-vue` and `django-backend` clients

If you're using Telepresence to connect this UI to a cluster
use the port in `Local Address` for local port in the Telepresence command

### Build & Run Docs (execute the commands inside the devcontainer)

```bash
./.devcontainer/build-run-docs.sh
```
