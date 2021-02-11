#!/bin/bash
branch=$(git branch --show-current)

cd /home/ec2-user/exodus
if [[ "$branch" == "deploy" ]];
then
    cd backend
    npm i
    npm run build
    cd ../frontend
    npm i
    npm run build
else
    cd backend
    npm i
    npm run build
    cd ../frontend
    npm i
    npm run build:staging
fi
