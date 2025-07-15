const { BedrockAgentClient, DeletePromptCommand } = require("@aws-sdk/client-bedrock-agent");

const agentClient = new BedrockAgentClient({
  region: process.env.AWS_REGION || "us-east-2"
});

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const promptId = event.pathParameters?.id;
    
    if (!promptId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Prompt ID is required"
        })
      };
    }

    const command = new DeletePromptCommand({ 
      promptIdentifier: promptId 
    });
    const response = await agentClient.send(command);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Prompt deleted successfully",
        promptId: promptId
      })
    };
  } catch (error) {
    console.error("Error deleting prompt:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to delete prompt",
        message: error.message
      })
    };
  }
};