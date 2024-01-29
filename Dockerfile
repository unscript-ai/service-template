# Getting base image from DockerHub
FROM node:14.17.0-alpine

#Defineing Working Directory
WORKDIR /home/ubuntu/github_repos/<project_service_name>

# Copying source code to Image in /user/app directory
COPY . /home/ubuntu/github_repos/<project_service_name>

# Install Git before next command as it need git
RUN npm install pm2 -g

# Install git
RUN apk add git

# Exposing TCP Protocol
EXPOSE 3015

#Running NPM Start command to run node application
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]