# build stage
FROM node:12-alpine as build-stage
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN apk add python3
RUN apk add --update py-pip
RUN pip3 install markdown mkdocs jinja2==3.0.3

RUN npm uninstall node-sass -g && npm cache clean --force && npm install node-sass
RUN npm install

COPY . .
ARG GIT_COMMIT_SHA=""
ARG VUE_APP_THEME="daiteap"
ARG VUE_APP_SINGLE_USER_MODE="False"

RUN cp ./public/favicon-$VUE_APP_THEME.ico ./docs/docs/img/favicon.ico
RUN mkdocs build -f ./docs/mkdocs.yaml --site-dir ../public/documentation

RUN npm run build -- --modern

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /app/dist

EXPOSE 8090

CMD ["nginx", "-g", "daemon off;"]
