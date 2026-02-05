FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "until npx prisma migrate deploy; do echo 'Waiting for DB...'; sleep 3; done; npm run start:dev"]
