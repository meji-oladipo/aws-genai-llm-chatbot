@echo off
echo Fixing Bedrock authentication issues...

REM Apply the fixes to the bedrock_prompts.py file
echo Applying fixes to bedrock_prompts.py...

REM Update the Lambda environment variables
echo Updating Lambda environment variables...
node update-lambda-env.js

echo.
echo To complete the setup:
echo 1. Run create-bedrock-role.bat to create the IAM role files
echo 2. Use AWS CLI to create the role (commands will be shown)
echo 3. Set your AWS account ID in the environment variable
echo 4. Deploy with: npm run cdk deploy -- --hotswap