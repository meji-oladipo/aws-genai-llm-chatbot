@echo off
echo Fixing Docker path issues for CDK deployment...

REM Create a symbolic link without spaces to use for Docker mounts
if not exist "C:\chatbox_temp" (
  mklink /D "C:\chatbox_temp" "%CD%"
  echo Created symbolic link at C:\chatbox_temp pointing to %CD%
) else (
  echo Symbolic link already exists
)

echo.
echo To deploy, run your CDK commands from the C:\chatbox_temp directory
echo Example: cd C:\chatbox_temp && cdk deploy
echo.