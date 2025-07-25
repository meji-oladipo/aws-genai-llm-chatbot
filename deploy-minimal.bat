@echo off
echo Deploying with minimal HTML page...

echo Running CDK deploy with hotswap...
call npm run cdk deploy -- --hotswap

echo Done!