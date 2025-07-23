@echo off
echo Building React app with --force flag...

cd lib\user-interface\react-app

REM Create a .env file with necessary environment variables
echo Creating .env file...
copy .env.template .env

REM Install dependencies
echo Installing dependencies...
call npm install

REM Build with TypeScript check disabled
echo Building React app...
set VITE_TSCONFIG=tsconfig.build.json
call npm run build

REM Check if build was successful
if exist dist (
  echo Build successful!
  
  REM Create build-output directory in root
  cd ..\..\..
  if not exist build-output mkdir build-output
  
  REM Copy build files to output directory
  echo Copying build files...
  xcopy /E /Y lib\user-interface\react-app\dist\* build-output\
  
  REM Patch CDK code
  echo Patching CDK code...
  node patch-cdk.js
  
  echo Done! Now run: npm run cdk deploy
) else (
  echo Build failed!
)