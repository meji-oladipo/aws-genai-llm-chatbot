@echo off
echo Building React app locally...
cd lib\user-interface\react-app
call npm install
call npm run build
cd ..\..\..
echo Build completed successfully. Now run your CDK deployment command.