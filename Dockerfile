FROM node:10.15.3

WORKDIR /tmp/web_app

# preinstall
COPY package.json /tmp/web_app
RUN npm install

COPY . /tmp/web_app

RUN npm run build

EXPOSE 7001

CMD ["npm", "run", "start"]
