# Estágio de Build
FROM node:20-slim AS build

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código e gerar build
COPY . .
RUN npm run build

# Estágio de Produção
FROM nginx:stable-alpine

# Copiar arquivos do build para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]