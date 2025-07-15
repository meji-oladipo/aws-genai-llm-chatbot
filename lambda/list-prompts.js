const { BedrockAgentClient, ListPromptsCommand } = require("@aws-sdk/client-bedrock-agent");

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
    const command = new ListPromptsCommand({});
    const response = await agentClient.send(command);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        promptSummaries: response.promptSummaries || []
      })
    };
  } catch (error) {
    console.error("Error listing prompts:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to list prompts",
        message: error.message
      })
    };
  }
};