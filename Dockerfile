# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

# Gera Prisma Client antes do build para ter os tipos disponíveis
RUN npx prisma generate

# Build do projeto (TS -> JS)
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm install --production

# Copia build, prisma e node_modules do builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
