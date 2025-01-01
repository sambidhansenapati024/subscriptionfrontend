# Step 1: Use Node.js to build the Angular app
FROM node:14 AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy all project files
COPY . .

# Step 5: Build the Angular app in production mode
RUN npm run build --prod

# Step 6: Use Nginx to serve the app
FROM nginx:1.21

# Step 7: Copy the Angular build output to the Nginx directory
COPY --from=build /app/dist/ /usr/share/nginx/html

# Step 8: Expose port 80
EXPOSE 80

# Step 9: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
