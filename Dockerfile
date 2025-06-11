# Stage 1 - Build
FROM node:18-alpine AS builder

WORKDIR /app

# Instala dependência necessária para o Prisma Client
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate

# Stage 2 - Runtime
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm install --production

# Copia apenas o necessário da stage de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Executa migrações e inicia o app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
