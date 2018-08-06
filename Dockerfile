FROM node:8.11.3-alpine
Author Nguyen Nguyen <nguyenbk92@gmail.com>
# Set the working directory to /app
WORKDIR /app
RUN  apk add --update \
    git \
    bash

# Copy the current directory contents into the container at /app
COPY * /app/

