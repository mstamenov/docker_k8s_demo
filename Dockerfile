FROM node

WORKDIR /usr/src/app

COPY ./internal/package*.json ./
COPY ./internal/views ./views
COPY ./internal/index.js ./

RUN npm install

EXPOSE 8081

CMD [ "node", "index.js" ]