const fs = require('fs');
const path = require('path');

// Path to the CDK stack file
const stackFilePath = path.join(__dirname, 'lib', 'chatbot-api', 'rest-api.ts');

// Read the file
let content = fs.readFileSync(stackFilePath, 'utf8');

// Check if the environment variable is already added
if (!content.includes('BEDROCK_SERVICE_ROLE_ARN')) {
  // Find the Lambda function definition
  const lambdaFunctionPattern = /new lambda\.Function\(this, .*?{[\s\S]*?environment: {/;
  
  // Add the environment variable
  const updatedContent = content.replace(
    lambdaFunctionPattern,
    (match) => `${match}\n        BEDROCK_SERVICE_ROLE_ARN: process.env.BEDROCK_SERVICE_ROLE_ARN || '',`
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(stackFilePath, updatedContent);
  
  console.log('Added BEDROCK_SERVICE_ROLE_ARN environment variable to Lambda function');
} else {
  console.log('BEDROCK_SERVICE_ROLE_ARN environment variable already exists');
}

console.log('Done! Now set your AWS account ID and deploy:');
console.log('set BEDROCK_SERVICE_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT_ID:role/BedrockServiceRole');
console.log('npm run cdk deploy -- --hotswap');