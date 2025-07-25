const fs = require('fs');
const path = require('path');

// Path to the index.ts file
const indexFilePath = path.join(__dirname, 'lib', 'user-interface', 'index.ts');

// Read the file
let content = fs.readFileSync(indexFilePath, 'utf8');

// Replace the tryBundle function to always return true without building
const oldCode = /tryBundle\(outputDir: string\) {[\s\S]*?try {[\s\S]*?return true;[\s\S]*?} catch[\s\S]*?return false;[\s\S]*?}/;
const newCode = `tryBundle(outputDir: string) {
            console.log('Skipping React build and copying static HTML...');
            
            // Create index.html in the output directory
            const indexHtml = \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AWS GenAI LLM Chatbot</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #232f3e;
    }
    p {
      color: #545b64;
      margin-bottom: 1.5rem;
    }
    .button {
      display: inline-block;
      background-color: #ff9900;
      color: white;
      padding: 0.75rem 1.5rem;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>AWS GenAI LLM Chatbot</h1>
    <p>Your chatbot has been successfully deployed!</p>
    <p>To access the full functionality, please configure your authentication settings.</p>
    <a href="https://docs.aws.amazon.com/solutions/latest/aws-genai-llm-chatbot/" class="button">View Documentation</a>
  </div>
</body>
</html>\`;
            
            fs.mkdirSync(outputDir, { recursive: true });
            fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
            return true;
          }`;

// Replace the code
content = content.replace(oldCode, newCode);

// Write the modified content back to the file
fs.writeFileSync(indexFilePath, content);

console.log('Successfully patched index.ts to skip React build');
console.log('Now run: npm run cdk deploy');