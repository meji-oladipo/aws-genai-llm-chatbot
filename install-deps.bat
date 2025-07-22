@echo off
echo Installing vite-plugin-checker...

cd lib\user-interface\react-app
call npm install --save-dev vite-plugin-checker
cd ..\..\..

echo Done! Now run: build-and-deploy.bat