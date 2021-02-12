#!/bin/bash
cd /home/ec2-user/exodus
if [[ "$APPLICATION_NAME" == "staging-update" ]];
then
    cd backend
    npm run deploy
    cd ../frontend
    npm run deploy:staging
else
    cd backend
    npm run deploy
    cd ../frontend
    npm run deploy
fi