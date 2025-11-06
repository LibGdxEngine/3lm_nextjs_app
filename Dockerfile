FROM node:18-alpine

WORKDIR /app

# Install all dependencies (including devDependencies needed for build)
COPY package*.json ./
RUN npm install

# Copy app files and build
COPY . .
RUN npm run build

# Set production mode after build
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Run server
CMD ["node", "server.js"]
