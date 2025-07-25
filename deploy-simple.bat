@echo off
echo Bypassing React build...

node bypass-build.js

echo Now running CDK deploy...
call npm run cdk deploy

echo Done!