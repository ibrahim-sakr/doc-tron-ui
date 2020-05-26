# step 1 build for production
FROM node:14-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# step 2 copy dist files into nginx image
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/ui /usr/share/nginx/html
