FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npx playwright install --with-deps chromium

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "run", "start:prod"]