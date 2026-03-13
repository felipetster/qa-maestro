FROM node:20-alpine

WORKDIR /app

# Copia package.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo código
COPY . .

# Lista arquivos (debug)
RUN ls -la /app
RUN ls -la /app/src || echo "Pasta src não existe!"

EXPOSE 3001

CMD ["npm", "run", "dev"]