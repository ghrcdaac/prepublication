# Use minimal, secure Node.js 22 LTS Alpine image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install project dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the entire project directory to the container
COPY . .

# Build the React app
RUN yarn build

# Set the command to run when the container starts
CMD ["yarn", "start"]