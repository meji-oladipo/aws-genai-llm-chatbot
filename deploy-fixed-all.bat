@echo off
echo Deploying with fixed React app...

echo Running CDK deploy...
call npm run cdk deploy

echo Done!