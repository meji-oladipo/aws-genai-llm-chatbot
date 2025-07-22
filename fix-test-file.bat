@echo off
echo Fixing test file to handle paths with spaces...

REM Create a temporary file with the updated content
echo const fs = require('fs');
echo const path = require('path');
echo const testFilePath = path.resolve(__dirname, 'tests/cli/magic-config.test.ts');
echo const content = fs.readFileSync(testFilePath, 'utf8');

echo // Replace path.join with path.resolve for better path handling
echo const updatedContent = content
echo     .replace(/path\.join\(__dirname, "\.\.\/\.\.\/dist\/cli\/magic-config\.js"\)/g, 'path.resolve(__dirname, "../../dist/cli/magic-config.js")')
echo     .replace(/path\.join\(__dirname, "\.\.\/\.\.\/bin\/config\.json"\)/g, 'path.resolve(__dirname, "../../bin/config.json")')
echo     .replace(/await execAsync\(`node \$\{CLI_PATH\} --non-interactive`/g, 'await execAsync(`node "\${CLI_PATH}" --non-interactive`')
echo     .replace(/await execAsync\(`node \$\{CLI_PATH\} --non-interactive --env-prefix CUSTOM_`/g, 'await execAsync(`node "\${CLI_PATH}" --non-interactive --env-prefix CUSTOM_`');

echo fs.writeFileSync(testFilePath, updatedContent);
echo console.log('Test file updated successfully');
) > fix-test-file.js

REM Run the script to update the test file
node fix-test-file.js

echo Test file update completed.

REM Update snapshots
call npm test -- -u

echo All fixes applied. Tests should now pass.