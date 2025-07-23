@echo off
echo Creating Bedrock service role configuration...

REM Create a directory for the service role configuration
if not exist "C:\Users\MejiOladipo\OneDrive - Nordic\Desktop\chatbox\aws-genai-llm-chatbot\bedrock-role" mkdir "C:\Users\MejiOladipo\OneDrive - Nordic\Desktop\chatbox\aws-genai-llm-chatbot\bedrock-role"

REM Create the trust policy
echo {
echo   "Version": "2012-10-17",
echo   "Statement": [
echo     {
echo       "Effect": "Allow",
echo       "Principal": {
echo         "Service": "lambda.amazonaws.com"
echo       },
echo       "Action": "sts:AssumeRole"
echo     }
echo   ]
echo } > "C:\Users\MejiOladipo\OneDrive - Nordic\Desktop\chatbox\aws-genai-llm-chatbot\bedrock-role\trust-policy.json"

REM Create the permissions policy
echo {
echo   "Version": "2012-10-17",
echo   "Statement": [
echo     {
echo       "Effect": "Allow",
echo       "Action": [
echo         "bedrock:*",
echo         "bedrock-agent:*"
echo       ],
echo       "Resource": "*"
echo     }
echo   ]
echo } > "C:\Users\MejiOladipo\OneDrive - Nordic\Desktop\chatbox\aws-genai-llm-chatbot\bedrock-role\permissions-policy.json"

echo Files created. To create the role, run the following AWS CLI commands:
echo.
echo aws iam create-role --role-name BedrockServiceRole --assume-role-policy-document file://bedrock-role/trust-policy.json
echo aws iam put-role-policy --role-name BedrockServiceRole --policy-name BedrockAccess --policy-document file://bedrock-role/permissions-policy.json
echo.
echo Then set the environment variable in your Lambda function:
echo BEDROCK_SERVICE_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT_ID:role/BedrockServiceRole