# Base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

RUN mkdir -p ~/.local/bin/kubectl
# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port on which the application will run
EXPOSE 2000

# Set the command to start the application
CMD ["npm" , "run" , "serve"]
