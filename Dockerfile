FROM node:18-alpine

# Set production mode
ENV NODE_ENV=production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy app files and build
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Run server
CMD ["node", "server.js"]
