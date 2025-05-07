FROM node:22.14.0-alpine
WORKDIR /app
#Se eligió node 22. Se le dice a docker que trabaje en el directorio /app

# Instala las dependencias, que están indicadas en el archivo package.json
COPY package*.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Genera el build de producción
RUN npm run build

#Se expone el puerto 3000, del contenedor, y se corren los comandos designados
EXPOSE 3000
CMD ["npm", "run", "preview"]
