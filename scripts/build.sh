#!/bin/bash
cd /home/ec2-user/exodus
if [[ "$APPLICATION_NAME" == "staging-update" ]];
then
    cd backend
    npm i
    npm run build
    cd ../frontend
    npm i
    npm run build:staging
else
    cd backend
    npm i
    npm run build
    cd ../frontend
    npm i
    npm run build
fi
