FROM node:18-alpine

# Set work dir
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Build Next.js
RUN npm run build

# Expose HTTPS port
EXPOSE 3000

# Start custom server
CMD ["node", "server.js"]