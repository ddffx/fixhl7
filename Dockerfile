FROM node:alpine;

# Install dependencies 
RUN npm set progress=false && \
    npm install -g --progress=false yarn

# Add source
ADD ./app /usr/local/app
WORKDIR /usr/local/app

RUN yarn install 
# link current project globally
RUN npm link


CMD [rotate-key]