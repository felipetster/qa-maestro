FROM node:20-alpine

WORKDIR /app

# Copia package.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia código
COPY . .

# Expõe porta
EXPOSE 5173

# Roda app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]