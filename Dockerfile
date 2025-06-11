# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copia os arquivos de dependência e instala tudo
COPY package*.json ./
RUN npm install

# Copia o restante do código fonte
COPY . .

# ⚠️ Gera Prisma Client antes de buildar o NestJS
RUN npx prisma generate

# Agora sim faz o build do projeto
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copia arquivos necessários da imagem builder
COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
