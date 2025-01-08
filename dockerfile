# Step 1: Use the official Node.js image as the base image
FROM node:14 AS build

# Step 2: Set the working directory
WORKDIR /build

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the Angular source files
COPY . .

# Step 6: Build the Angular app in production mode
RUN npm run build --prod

# Step 7: Use Nginx image to serve the built app
FROM nginx:alpine

# Step 8: Copy the build output from the previous stage to Nginx’s HTML directory
COPY --from=build /build/dist/review-frontend /usr/share/nginx/html/

# Step 10: Expose port 80
EXPOSE 80

# Step 11: Start Nginx
CMD ["nginx", "-g", "daemon off;"]
