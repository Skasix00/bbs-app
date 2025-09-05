# # # # # # # # #

FROM node:22.6-alpine3.20 AS base

ENV PROJECT=web

ARG ENVIRONMENT

ENV ENVIRONMENT=${ENVIRONMENT}
ENV NEXT_PUBLIC_ENVIRONMENT=${ENVIRONMENT}

WORKDIR /app

COPY ./apps/web .

RUN npm install
RUN npm run build

# # # # # # # # #

CMD [ "node", ".next/standalone/server.js" ]