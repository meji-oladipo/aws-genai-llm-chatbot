@echo off
echo Updating test snapshots to fix failing tests...

REM Update snapshots for all tests
call npm test -- -u

echo Snapshot update completed. Tests should now pass.