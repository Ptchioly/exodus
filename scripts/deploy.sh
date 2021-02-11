#!/bin/bash
branch=$(git branch --show-current)

cd /home/ec2-user/exodus
if [[ "$branch" == "deploy" ]];
then
    cd backend
    npm run deploy
    cd ../frontend
    npm run deploy
else
    cd backend
    npm run deploy:staging
    cd ../frontend
    npm run deploy:staging
fi