FROM node:18.12.1

RUN apt-get update && apt-get install -qq -y --no-install-recommends

ENV INSTALL_PATH /onebitflix

RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY . .

RUN npm i ts-node-dev@~2.0.0 sequelize-cli@~6.5.2 -g

RUN npm i