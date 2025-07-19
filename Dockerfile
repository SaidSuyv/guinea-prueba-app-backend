# Copiar imagen NodeJS v18
FROM node:18

# Establecer carpeta de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
RUN npm install

# Copiar proyecto entero
COPY . .

# Crear volumen interno
RUN mkdir -p data

# Exponer puerto para el servidor
EXPOSE 8000

# Ejecutar servidor
CMD ["node", "src/index.js"]