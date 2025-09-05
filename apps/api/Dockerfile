# # # # # # # # #

FROM node:alpine AS base

ENV PROJECT=api

RUN npm install -g turbo@^2

# # # # # # # # #


# # #
# BUILDER STAGE

FROM base AS pruner

WORKDIR /app

COPY . .

RUN turbo prune --scope=@skasix00/bbs-${PROJECT} --docker


# # #
# INSTALLER STAGE

FROM base AS builder

WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=pruner /app/out/json/ .
RUN npm install

# Build the project
COPY --from=pruner /app/out/full/ .
RUN turbo run build --filter=@skasix00/bbs-${PROJECT}


# # #
# RUNNER STAGE

FROM base AS runner

WORKDIR /app

COPY --from=builder /app .

CMD node apps/${PROJECT}/src/index.js