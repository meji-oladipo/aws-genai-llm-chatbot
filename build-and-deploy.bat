@echo off
echo Building and deploying React app without Docker...

REM Create a directory for the built app
mkdir build-output

REM Navigate to the React app directory
cd lib\user-interface\react-app

REM Install dependencies and build the app
echo Installing dependencies...
call npm install
echo Building React app...
call npm run build -- --skipLibCheck

REM Copy the built app to the output directory
echo Copying build files...
xcopy /E /Y dist\* ..\..\..\..\build-output\

REM Return to the root directory
cd ..\..\..

REM Modify the CDK code to use the local build output
echo Patching CDK code...
node patch-cdk.js

echo Done! Now run: npm run cdk deploy