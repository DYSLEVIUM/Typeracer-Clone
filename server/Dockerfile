FROM node:alpine

RUN apk update && apk add --no-cache make git

WORKDIR '/usr/app'
COPY ./package.json ./
RUN yarn install
COPY . .

# express server port
EXPOSE 3000

CMD ["node", "./src/app.js"]
