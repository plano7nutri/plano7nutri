# Estágio de Build
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependências (usando cache)
COPY package.json package-lock.json* ./
RUN npm install

# Copiar o restante e gerar o build
COPY . .
RUN npm run build

# Estágio de Servidor (Nginx)
FROM nginx:stable-alpine

# Copiar arquivos do build (Vite gera na pasta /dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar nossa configuração customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]