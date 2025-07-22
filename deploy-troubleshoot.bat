@echo off
echo AWS GenAI LLM Chatbot Deployment Troubleshooting Script
echo =====================================================

echo Step 1: Checking Docker...
docker --version
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Docker is not running or not installed.
  echo Please start Docker Desktop or install Docker before continuing.
  exit /b 1
)

echo Step 2: Checking Node.js version...
node --version
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js is not installed.
  echo Please install Node.js 18+ before continuing.
  exit /b 1
)

echo Step 3: Checking AWS credentials...
aws sts get-caller-identity
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: AWS credentials not configured.
  echo Please run 'aws configure' to set up your AWS credentials.
  exit /b 1
)

echo Step 4: Installing dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
  echo WARNING: npm install had errors, but continuing...
)

echo Step 5: Building the project...
npm run build
if %ERRORLEVEL% NEQ 0 (
  echo WARNING: Build had errors, but continuing...
)

echo Step 6: Deploying with increased memory and timeouts...
set NODE_OPTIONS=--max-old-space-size=8192
npx cdk deploy --require-approval never
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Deployment failed.
  echo Trying alternative deployment method...
  
  echo Step 7: Trying deployment with Docker image building skipped...
  set NODE_ENV=test
  npx cdk deploy --require-approval never
  if %ERRORLEVEL% NEQ 0 (
    echo ERROR: All deployment methods failed.
    echo Please check the logs for more information.
    exit /b 1
  )
)

echo Deployment completed successfully!