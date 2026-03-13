FROM node:20-alpine

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia código
COPY . .

# Expõe porta
EXPOSE 3000

# Comando
CMD ["npm", "run", "dev"]