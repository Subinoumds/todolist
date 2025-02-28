FROM node:14
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
COPY init.sql /docker-entrypoint-initdb.d/init.sql
EXPOSE 3000
CMD ["node", "src/index.js"]