FROM node:20

COPY package* /tmp/
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app
COPY . /app/

EXPOSE 3000

CMD ["npm", "start"]