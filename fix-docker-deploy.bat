@echo off
echo Fixing Docker path issues for CDK deployment...

REM Run the patch script to modify the CDK code
node patch-cdk.js

echo.
echo Patch applied. Now you can run your CDK deploy command.
echo.