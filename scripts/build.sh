#!/bin/bash
cd /home/ec2-user/exodus/
cd backend
npm i
npm run build
cd ../frontend
npm i
npm run build