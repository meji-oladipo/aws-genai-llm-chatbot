@echo off
echo Pre-building React app locally to avoid Docker path issues...

cd lib\user-interface\react-app
echo Installing dependencies...
call npm install
echo Building React app...
call npm run build
cd ..\..\..

echo React app built successfully. Now try running your CDK deploy command.