FROM node:16.14.1

ADD build /home/node/app/build
ADD package.json /home/node/app/package.json

RUN chown -R node:node /home/node/app 

USER node
WORKDIR /home/node/app
RUN npm i --save

EXPOSE 3000

CMD npm run watch
