# Stage 1: Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies with scripts skipped
COPY package*.json ./
ENV HUSKY_SKIP_INSTALL=1
RUN npm ci --ignore-scripts

# Copy the rest of your source code and build the app
COPY . .
RUN npm run build

# Production stage - serve using Nginx
FROM nginx:alpine
# Copy the production build from the builder stage to Nginx's html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]