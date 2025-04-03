FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app

RUN ls -la /app

EXPOSE 8081

CMD [ "npm", "run", "start:dev" ]