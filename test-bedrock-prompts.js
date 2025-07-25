const { BedrockAgentClient, ListPromptsCommand, CreatePromptCommand } = require("@aws-sdk/client-bedrock-agent");

const client = new BedrockAgentClient({
  region: process.env.AWS_REGION || "us-east-1"
});

async function testBedrockPrompts() {
  try {
    console.log("Testing Bedrock Prompts API...");
    
    // First, try to list existing prompts
    console.log("1. Listing existing prompts...");
    const listCommand = new ListPromptsCommand({});
    const listResponse = await client.send(listCommand);
    
    console.log("Existing prompts:", JSON.stringify(listResponse.promptSummaries, null, 2));
    
    // If no prompts exist, create a test prompt
    if (!listResponse.promptSummaries || listResponse.promptSummaries.length === 0) {
      console.log("2. No prompts found. Creating a test prompt...");
      
      const createCommand = new CreatePromptCommand({
        name: "TestPrompt",
        description: "A test prompt for the chatbot",
        defaultVariant: {
          name: "default",
          templateType: "TEXT",
          templateConfiguration: {
            text: {
              text: "You are a helpful AI assistant. Please respond to the user's question: {{question}}"
            }
          }
        }
      });
      
      const createResponse = await client.send(createCommand);
      console.log("Created prompt:", JSON.stringify(createResponse, null, 2));
      
      // List prompts again to verify
      const listResponse2 = await client.send(listCommand);
      console.log("Prompts after creation:", JSON.stringify(listResponse2.promptSummaries, null, 2));
    }
    
    console.log("Bedrock Prompts API test completed successfully!");
    
  } catch (error) {
    console.error("Error testing Bedrock Prompts API:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId
    });
  }
}

testBedrockPrompts();