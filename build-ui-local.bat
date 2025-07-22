@echo off
echo Building React app locally without Docker...

cd lib\user-interface\react-app
call npm install
call npm run build

cd ..\..\..
echo Creating dist directory in CDK output...
mkdir cdk.out\asset.6f8f91353061756f77036c608dc89c8791b716787092c5cdf7770350a0178655-building
xcopy /E /I lib\user-interface\react-app\dist cdk.out\asset.6f8f91353061756f77036c608dc89c8791b716787092c5cdf7770350a0178655-building

echo Build completed successfully. Now run your CDK deployment command with --no-docker flag.