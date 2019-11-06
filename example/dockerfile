FROM node:latest

WORKDIR /src/app

COPY . . 

RUN ["npm", "install"]

EXPOSE 8080

WORKDIR /scr/app/backend

CMD ["node", "server.js"]

# docker build -t unmaps ./
#docker run -p 8080:8080 -d unmaps 