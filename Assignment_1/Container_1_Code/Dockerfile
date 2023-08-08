FROM node:14

WORKDIR /app

COPY app.js package.json package-lock.json testfiles/ ./

RUN npm install

EXPOSE 6000

CMD [ "node", "app.js" ]
