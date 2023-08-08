FROM node:14

WORKDIR /app

COPY app.js package.json package-lock.json ./

RUN mkdir /Fenil_PV_dir

RUN npm install

EXPOSE 6002

CMD [ "node", "app.js" ]
