
ARG SERVICE=backend

FROM node:14.11.0-alpine3.11 as development
ARG SERVICE
ARG NODE_ENV
ENV PACKAGE=./${SERVICE}/*.json
ENV WEBPACK=./${SERVICE}/webpack.config.js

WORKDIR /usr/local/${SERVICE}
COPY $PACKAGE ./
RUN npm install
COPY $WEBPACK ./

FROM development as production
ARG SERVICE
ENV SRC=./${SERVICE}/src

COPY $SRC ./src
COPY ./generic ./node_modules/@checkers/generic
RUN npm run build
CMD [ "npm", "run", "start" ]
