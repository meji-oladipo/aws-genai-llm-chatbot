const fs = require('fs');
const path = require('path');

// Path to the test file
const testFilePath = path.resolve(__dirname, 'tests/cli/magic-config.test.ts');

// Read the current content
console.log(`Reading test file: ${testFilePath}`);
const content = fs.readFileSync(testFilePath, 'utf8');

// Make the necessary replacements
const updatedContent = content
  // Replace path.join with path.resolve for better path handling
  .replace(/path\.join\(__dirname, "\.\.\/\.\.\/dist\/cli\/magic-config\.js"\)/g, 
           'path.resolve(__dirname, "../../dist/cli/magic-config.js")')
  .replace(/path\.join\(__dirname, "\.\.\/\.\.\/bin\/config\.json"\)/g, 
           'path.resolve(__dirname, "../../bin/config.json")')
  // Add quotes around CLI_PATH in all execAsync calls
  .replace(/await execAsync\(`node \${CLI_PATH} --non-interactive`/g, 
           'await execAsync(`node "${CLI_PATH}" --non-interactive`')
  .replace(/await execAsync\(`node \${CLI_PATH} --non-interactive --env-prefix CUSTOM_`/g, 
           'await execAsync(`node "${CLI_PATH}" --non-interactive --env-prefix CUSTOM_`');

// Write the updated content back to the file
fs.writeFileSync(testFilePath, updatedContent);
console.log('Test file updated successfully');