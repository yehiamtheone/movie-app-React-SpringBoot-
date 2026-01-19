FROM node:22-alpine AS build
WORKDIR /app
ARG VITE_SPRING_BOOT
ENV VITE_SPRING_BOOT=$VITE_SPRING_BOOT
COPY ./package*.json ./
RUN npm install
COPY src ./src
COPY eslint.config.js ./
COPY vite.config.js ./
COPY index.html ./

RUN npm run build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

