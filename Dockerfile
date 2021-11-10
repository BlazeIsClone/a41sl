FROM node:16.6.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]