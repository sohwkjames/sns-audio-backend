# Use Node.js LTS base image
FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose API port
EXPOSE 5000

# Start server
CMD ["node", "src/index.js"]
