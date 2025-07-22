@echo off
echo Deploying with Docker image building skipped...
set NODE_ENV=test
set NODE_OPTIONS=--max-old-space-size=8192
npx cdk deploy
echo Deployment completed.