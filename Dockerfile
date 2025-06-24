FROM node:20.2.0-alpine

ARG USER_ID
ARG GROUP_ID

ARG CHOKIDAR_USEPOLLING=true

RUN apk update && apk add --no-cache bash git yarn

RUN mkdir /app
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

ENV PATH /app/node_modules/.bin:$PATH

COPY . .

RUN yarn

EXPOSE 3002

CMD yarn start