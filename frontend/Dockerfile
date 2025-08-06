FROM node:18

WORKDIR /app
COPY . .

RUN npm install -g serve surge
CMD ["serve", ".", "-l", "80"]

