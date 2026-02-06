FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY next.config.js tsconfig.json next-env.d.ts ./
COPY src ./src

RUN npm run build

CMD ["npm", "start"]
