# Etapa 1: Build
FROM node:20-alpine AS build-step
WORKDIR /app

# Instalar Java y Curl (necesarios para la generación)
RUN apk add --no-cache curl openjdk17-jre

COPY package*.json ./
RUN npm install

COPY . .

# 1. Generamos la API usando el comando de PROD que ya tiene la URL fija
RUN npm run generate:api:prod

# 2. Compilamos la app normalmente
RUN npm run build

# Etapa 2: Serve
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /app/dist/cc.frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]