const { BedrockAgentClient, GetPromptCommand } = require("@aws-sdk/client-bedrock-agent");

const client = new BedrockAgentClient({
  region: process.env.AWS_REGION || "us-east-1"
});

async function testGetPrompt() {
  try {
    console.log("Testing GetPrompt API...");
    
    const promptId = "QBNNIJUTIM"; // The problematic prompt ID
    console.log(`Getting prompt: ${promptId}`);
    
    const command = new GetPromptCommand({
      promptIdentifier: promptId
    });
    
    const response = await client.send(command);
    console.log("Prompt details:", JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error("Error getting prompt:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId,
      errorCode: error.$response?.error?.code
    });
  }
}

testGetPrompt();