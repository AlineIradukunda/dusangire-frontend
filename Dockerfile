# Build stage
FROM node:18 AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV VITE_NODE_ENV=production
SHELL ["cmd", "/S", "/C"]

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
