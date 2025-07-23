@echo off
echo Preparing for deployment without building React app...

REM Run the prepare-deploy script
node prepare-deploy.js

echo Done! Now run: npm run cdk deploy