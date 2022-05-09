FROM node:16

# directory de bash/shell in bevind.
WORKDIR /usr/local/app

# Kopieer package naar de docker image.
COPY package*.json ./

# NPM run install
RUN npm install

# Production moet ik nog bekijke nog niet gebruikt maar wordt wel aangerade 
# RUN npm ci --only=production

# Structuur doorgeven
ADD ./dist ./dist/api /usr/local/app/www/
ADD ./views  /usr/local/app/views/
ADD ./public  /usr/local/app/public/

# Poort openen "exposen"
EXPOSE 8080

# Launch command
CMD [ "node", "/usr/local/app/www/App.js" ]
