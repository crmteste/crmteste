# Stage 1 - Build
FROM node:18-alpine AS builder

WORKDIR /app

# Prisma exige isso para funcionar corretamente no Alpine
RUN apk add --no-cache libc6-compat

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Gera os tipos Prisma ANTES do build
RUN npx prisma generate

# Compila a aplicação
RUN npm run build

# Stage 2 - Runtime
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copia apenas arquivos essenciais da build
COPY package*.json ./
RUN npm install --production

# Copia artefatos da build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Executa as migrações e inicia a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
