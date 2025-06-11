# Stage 1: Build
FROM node:18-alpine AS builder

# Diretório de trabalho
WORKDIR /app

# Dependência para compatibilidade libc6 no Alpine
RUN apk add --no-cache libc6-compat

# Copia arquivos de dependências
COPY package*.json ./

# Instala todas as dependências (dev + prod) para build
RUN npm install

# Copia todo o código fonte
COPY . .

# Build do projeto (TS -> JS)
RUN npm run build

# Gera Prisma Client (baseado no schema.prisma)
RUN npx prisma generate

# Stage 2: Imagem final menor só com runtime
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copia package.json para instalar só dependências de produção
COPY package*.json ./

RUN npm install --production

# Copia a pasta build e a pasta prisma do estágio builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Expõe a porta padrão do NestJS (3000)
EXPOSE 3000

# Comando para rodar migrations e iniciar a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
