@echo off
echo Running build and deployment without Docker...

call build-ui-local.bat
call npx cdk deploy --no-docker --require-approval never

echo Deployment completed.