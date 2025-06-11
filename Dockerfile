# Usa Node 18 alpine (leve)
FROM node:18-alpine

# Define diretório de trabalho
WORKDIR /app

# Instala libc6-compat para o Prisma funcionar no alpine
RUN apk add --no-cache libc6-compat

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala dependências em modo produção (mais leve)
RUN npm install --production

# Copia todo o código da aplicação para o container
COPY . .

# Build do projeto NestJS (transpila TS para JS)
RUN npm run build

# Gera Prisma client para comunicação com banco
RUN npx prisma generate

# Expõe a porta padrão do NestJS
EXPOSE 3000

# Comando para rodar migrations e iniciar app em produção
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
