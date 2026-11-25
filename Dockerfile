FROM node:22-bookworm-slim
WORKDIR /app
COPY server.mjs ./
COPY public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","server.mjs"]
