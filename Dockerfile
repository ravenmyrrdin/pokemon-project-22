FROM node:16
# Create app directory
WORKDIR /usr/local/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
ADD ./bin ./bin/misc ./bin/net ./bin/net/interfaces ./bin/net/views /usr/local/app/www/
ADD ./views  /usr/local/app/views/
ADD ./public  /usr/local/app/public/

EXPOSE 8080
CMD [ "node", "/usr/local/app/www/App.js" ]
