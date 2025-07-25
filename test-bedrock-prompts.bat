@echo off
echo Testing Bedrock Prompts Integration...

echo.
echo 1. Building React app...
cd lib\user-interface\react-app
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo 2. Deploying backend changes...
cd ..\..\..
call cdk deploy --require-approval never
if %errorlevel% neq 0 (
    echo Deployment failed!
    pause
    exit /b 1
)

echo.
echo 3. Testing complete!
echo You can now test the Bedrock prompts integration in the web interface.
echo Look for the prompt dropdown in the chat input area.
pause