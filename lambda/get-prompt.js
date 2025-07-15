const { BedrockAgentClient, GetPromptCommand } = require("@aws-sdk/client-bedrock-agent");

const agentClient = new BedrockAgentClient({
  region: process.env.AWS_REGION || "us-east-2"
});

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    const command = new GetPromptCommand({ 
      promptIdentifier: promptId 
    });
    const response = await agentClient.send(command);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error("Error retrieving prompt:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to retrieve prompt",
        message: error.message
      })
    };
  }
};