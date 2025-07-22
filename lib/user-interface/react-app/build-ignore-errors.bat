@echo off
echo Building React app with TypeScript errors ignored...
set TSC_COMPILE_ON_ERROR=true
npx vite build
echo Build completed with errors ignored.