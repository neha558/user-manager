# Use an official Node.js runtime as a parent image
##FROM node:12.22.1-slim
FROM node:18.14.1-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Expose port 3000 for the application
EXPOSE 3005

USER root
# Start the application
#CMD ["npm", "start"]
CMD ["npm", "run", "start:prod"]            
