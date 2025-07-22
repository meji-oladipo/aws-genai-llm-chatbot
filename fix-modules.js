// Fix for module resolution in magic-config.js
const path = require('path');
const fs = require('fs');

// Create a simple package.json in the cli directory to help with module resolution
const cliDir = path.resolve(__dirname, 'cli');
const packageJson = {
  "type": "module",
  "imports": {
    "#lib/*": "./lib/*"
  }
};

fs.writeFileSync(path.join(cliDir, 'package.json'), JSON.stringify(packageJson, null, 2));
console.log('Created package.json in cli directory to help with module resolution');