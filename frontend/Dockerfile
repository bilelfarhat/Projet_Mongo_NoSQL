# Use Node.js as the base image to build the React app
FROM node:16-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app for production
RUN npm run build

# Use NGINX as the base image to serve the React app
FROM nginx:alpine

# Copy the built React app from the previous stage to the NGINX container
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to access the app through NGINX
EXPOSE 80

# Start NGINX when the container runs
CMD ["nginx", "-g", "daemon off;"]
