
ARG SERVICE=client

FROM node:14.11.0-alpine3.11 as development
ARG SERVICE
ENV PACKAGE=./${SERVICE}/*.json
ENV WEBPACK=./${SERVICE}/webpack.config.js

WORKDIR /usr/local/${SERVICE}
COPY $PACKAGE ./
RUN npm install
COPY $WEBPACK ./

FROM development as build
ARG SERVICE
ARG SERVER_URL
ENV SRC=./${SERVICE}/src
ENV PUBLIC=./${SERVICE}/public

COPY $SRC ./src
COPY $PUBLIC ./public
COPY ./generic ./node_modules/@checkers/generic
RUN npm run build


FROM nginx:1.19.2-alpine as production
ARG INTERNAL_BACKEND_WS_PORT
WORKDIR /etc/nginx/conf.d/
COPY ./nginx/raw.conf ./raw.conf
RUN envsubst '${INTERNAL_BACKEND_WS_PORT}' < raw.conf > default.conf
RUN rm raw.conf
COPY --from=build /usr/local/client/dist /usr/share/nginx/html

