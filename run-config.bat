@echo off
echo Running config command with TypeScript loader...

REM Use ts-node to run the config command directly
npx ts-node cli/magic-config.ts %*

echo Config command completed.