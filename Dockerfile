# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install --include=dev

# Copy all files
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_SOCKET_URL=${REACT_APP_SOCKET_URL}

# Build the application with verbose output
RUN npm run build --verbose

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 