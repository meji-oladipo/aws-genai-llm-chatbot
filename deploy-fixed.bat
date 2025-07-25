@echo off
echo Deploying with fixed GraphQL queries and mutations...

echo Running CDK deploy...
call npm run cdk deploy

echo Done!