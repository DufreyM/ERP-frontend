FROM node:22.14.0-alpine
WORKDIR /app

# Instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Genera el build de producción
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
