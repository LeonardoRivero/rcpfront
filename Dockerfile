# FROM node
# WORKDIR /srv/app
# RUN npm i -g @quasar/cli
# RUN npm i create-quasar
# EXPOSE 8080 9000

# # base image
# FROM node:12.2.0-alpine
# # set working directory
# WORKDIR /app
# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH
# # install and cache app dependencies
# COPY package.json /app/package.json
# RUN npm install
# RUN npm install @vue/cli@3.7.0 -g
# # start app
# CMD ["npx", "quasar", "dev"]


# FROM node:lts-alpine
# RUN npm install -g http-server
# WORKDIR /app
# COPY ./ ./
# RUN npm install
# RUN npm install -g @vue/cli
# RUN npm install -g @quasar/cli
# RUN quasar build
# EXPOSE 8080
# CMD [ "http-server", "dist" ]


# develop stage
#este docker file funciona pero es muy lento
# FROM node:lts-alpine as global-deps-stage
# RUN npm i --location=global @quasar/cli@latest
# FROM global-deps-stage as develop-stage
# WORKDIR /src
# COPY package*.json ./
# COPY yarn.lock ./
# COPY . .
# FROM develop-stage as local-deps-stage
# RUN yarn
# FROM local-deps-stage as build-stage
# RUN quasar build -m spa
# FROM nginx:stable-alpine as production-stage
# WORKDIR /app
# COPY --from=build-stage /src/dist/spa /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
#este docker file funciona pero es muy lento


FROM node:lts-alpine As development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node
