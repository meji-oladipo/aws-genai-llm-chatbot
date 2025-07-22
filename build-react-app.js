const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the output directory from command line arguments
const outputDir = process.argv[2];

if (!outputDir) {
  console.error('Output directory not specified');
  process.exit(1);
}

// Path to the React app
const reactAppPath = path.join(__dirname, 'lib', 'user-interface', 'react-app');

try {
  console.log(`Building React app from ${reactAppPath} to ${outputDir}`);
  
  // Check if React app directory exists
  if (!fs.existsSync(reactAppPath)) {
    throw new Error(`React app directory not found at ${reactAppPath}`);
  }
  
  // Navigate to the React app directory
  process.chdir(reactAppPath);
  
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the app
  console.log('Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Copy build files to output directory
  console.log('Copying build files to output directory...');
  const buildDir = path.join(reactAppPath, 'dist');
  
  if (!fs.existsSync(buildDir)) {
    throw new Error(`Build directory not found at ${buildDir}`);
  }
  
  // List files in build directory
  const files = fs.readdirSync(buildDir);
  console.log(`Files in build directory: ${files.join(', ')}`);
  
  // Create a test file in the output directory to verify it's writable
  fs.writeFileSync(path.join(outputDir, 'index.html'), '<html><body>Test</body></html>');
  
  // Copy all files from build directory to output directory
  files.forEach(file => {
    const srcPath = path.join(buildDir, file);
    const destPath = path.join(outputDir, file);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  console.log('React app built and copied successfully');
} catch (error) {
  console.error('Error building React app:', error);
  process.exit(1);
}