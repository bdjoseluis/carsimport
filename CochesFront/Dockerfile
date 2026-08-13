# ─── Etapa 1: compilar Angular ───────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Se copia primero el manifiesto para aprovechar la cache de capas de Docker:
# si no cambian las dependencias, no se reinstalan.
COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build -- --configuration production

# ─── Etapa 2: servir con Nginx ───────────────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/dist/carsimport/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
