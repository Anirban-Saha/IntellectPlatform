FROM python:3.8.12-buster

RUN apt-get update
RUN apt-get install build-essential 
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt-get install nodejs

RUN npm install -g nodemon
RUN yes | apt-get install default-jre
RUN yes | apt-get install default-jdk

WORKDIR /backend

COPY ./backend/package*.json ./
RUN npm install

COPY ./backend ./

CMD ["npm","run","dev"]

