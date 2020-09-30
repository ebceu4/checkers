FROM node:14.11.0-alpine3.11 AS development

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM development as production
ADD . .
RUN npm run build