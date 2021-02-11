#!/bin/bash
source /home/ec2-user/.bash_profile
cd /home/ec2-user
cd backend
npm run deploy
cd ../frontend
npm run deploy