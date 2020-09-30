FROM node:10.16.0-alpine AS development
ARG FRONTEND_PORT
ARG FRONTEND_HOST

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM development as production
ADD . .
RUN npm run build