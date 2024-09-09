FROM node:20.10.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN npx nuxi@latest module add shadcn-nuxt
RUN yarn add pinia
RUN yarn build

FROM node:20.10.0-alpine AS run
WORKDIR /app
COPY --from=build ./app/.output .
COPY .env .
EXPOSE 3000
CMD ["node", "./server/index.mjs"]
