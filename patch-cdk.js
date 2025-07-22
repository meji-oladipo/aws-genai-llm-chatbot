const fs = require('fs');
const path = require('path');

// Path to the public-website.ts file
const filePath = path.join(__dirname, 'lib', 'user-interface', 'public-website.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Replace the BucketDeployment section with a simpler version that uses the local build output
const oldCode = /new s3deploy\.BucketDeployment\(this, 'UserInterfaceDeployment', \{[\s\S]*?bundling: \{[\s\S]*?}\n      }\)\],/;
const newCode = `new s3deploy.BucketDeployment(this, 'UserInterfaceDeployment', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../../build-output'))],`;

// Replace the code
content = content.replace(oldCode, newCode);

// Write the modified content back to the file
fs.writeFileSync(filePath, content);

console.log('Successfully patched public-website.ts to use local build output');