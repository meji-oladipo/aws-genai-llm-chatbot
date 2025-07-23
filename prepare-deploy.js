const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create build-output directory
const buildOutputDir = path.join(__dirname, 'build-output');
console.log('Build output directory:', buildOutputDir);
if (!fs.existsSync(buildOutputDir)) {
  fs.mkdirSync(buildOutputDir);
}

// Copy the fallback index.html to build-output
fs.copyFileSync(
  path.join(__dirname, 'build-output', 'index.html'),
  path.join(buildOutputDir, 'index.html')
);

// Patch the CDK code to use the local build output
console.log('Patching CDK code...');
const publicWebsitePath = path.join(__dirname, 'lib', 'user-interface', 'public-website.ts');
let content = fs.readFileSync(publicWebsitePath, 'utf8');

// Replace the BucketDeployment section with a simpler version that uses the local build output
const oldCode = /new s3deploy\.BucketDeployment\(this, 'UserInterfaceDeployment', \{[\s\S]*?bundling: \{[\s\S]*?}\n      }\)\],/;
const newCode = `new s3deploy.BucketDeployment(this, 'UserInterfaceDeployment', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'build-output'))],`;

// Replace the code
content = content.replace(oldCode, newCode);

// Write the modified content back to the file
fs.writeFileSync(publicWebsitePath, content);

console.log('Successfully patched public-website.ts to use local build output');
console.log('Ready for deployment. Run: npm run cdk deploy');