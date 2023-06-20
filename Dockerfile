# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app's source code
COPY . .

# Build the React app
RUN npm run build

# Expose the port on which the app will run (default: 3000)
EXPOSE 3000

# Set the command to start the app
CMD ["npm", "start"]
