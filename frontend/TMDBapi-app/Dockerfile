FROM node:20-alpine AS build
WORKDIR /app
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]