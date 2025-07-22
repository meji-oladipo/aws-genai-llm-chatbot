@echo off
echo Deploying with increased Node.js memory...
set NODE_OPTIONS=--max-old-space-size=8192
npx cdk deploy
echo Deployment completed.