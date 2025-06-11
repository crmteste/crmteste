# Stage 1 - Build
FROM node:18-alpine AS builder

WORKDIR /app

# Prisma exige libc6-compat no Alpine
RUN apk add --no-cache libc6-compat

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código fonte
COPY . .

# Gera o Prisma Client antes do build
RUN npx prisma generate

# Compila o código TypeScript com NestJS
RUN npm run build

# Stage 2 - Runtime
FROM node:18-alpine

WORKDIR /app

# Lib necessária no runtime
RUN apk add --no-cache libc6-compat

# Copia package.json para instalar dependências de produção
COPY package*.json ./
RUN npm install --production

# Copia os arquivos gerados na build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Exponha a porta padrão do NestJS
EXPOSE 3000

# Roda as migrações e inicia a aplicação no caminho correto
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
