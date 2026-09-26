# Alternative to render.yaml — works on Railway, Fly.io, Cloud Run or anywhere
# that takes a container.
FROM node:22-slim
WORKDIR /app

# better-sqlite3 needs a toolchain to build its native binding
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV PORT=4000
ENV TALENTHUB_DB=/data/talenthub.db
VOLUME /data
EXPOSE 4000

CMD ["npm", "run", "start"]
