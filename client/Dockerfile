FROM node:alpine as builder

RUN apk update && apk add --no-cache make git

WORKDIR '/usr/app'
COPY ./package.json ./
RUN yarn install
COPY . .
RUN yarn build --prod

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY config/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/app/dist/typeracer-clone /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
