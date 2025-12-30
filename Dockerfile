# Etapa 1: Build
FROM node:20-alpine AS build-step
WORKDIR /app

# Copiar archivos de dependencias para aprovechar el cache de Docker
COPY package*.json ./
RUN npm install

# Copiar el resto del código y generar el dist
COPY . .
RUN npm run build --configuration=development

# Etapa 2: Serve (Producción)
FROM nginx:stable-alpine

# Copiar el archivo de configuración de Nginx (explicado abajo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados desde la etapa de build
# NOTA: Asegúrate de que la ruta 'dist/nombre-de-tu-app/browser' sea la correcta
COPY --from=build-step /app/dist/cc.frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]