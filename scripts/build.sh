#!/bin/bash
cd /home/ec2-user/exodus/backend
npm i
npm run build
cd ../frontend
npm i
npm run build