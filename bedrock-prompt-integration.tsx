// Function to get a prompt by identifier
export async function getPromptById(promptIdentifier: string): Promise<any> {
  try {
    const command = new GetPromptCommand({ promptIdentifier });
    const response = await agentClient.send(command);
    return response;
  } catch (error) {
    console.error("Error retrieving prompt by id:", error);
    throw error;
  }
}

// Function to use any prompt with the chatbot
export async function useChatbotWithPromptId(promptIdentifier: string, userInput: string): Promise<string> {
  try {
    // Get the prompt details by id
    const promptDetails = await getPromptById(promptIdentifier);
    const modelId = "anthropic.claude-v2";
    const requestBody = {
      prompt: `${promptDetails.promptText}\n\nUser: ${userInput}\n\nAssistant:`,
      max_tokens: 1000,
      temperature: 0.7
    };
    const command = new InvokeModelCommand({
      modelId: modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(requestBody)
    });
    const response = await runtimeClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    if (responseBody.completion) {
      return responseBody.completion;
    }
    return JSON.stringify(responseBody);
  } catch (error) {
    console.error("Error using chatbot with prompt id:", error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
import { BedrockAgentClient, GetPromptCommand, ListPromptsCommand } from "@aws-sdk/client-bedrock-agent";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Configure the Bedrock clients
const agentClient = new BedrockAgentClient({
  region: "us-east-2", // Region from your stack output
  // AWS SDK will use credentials from environment or credential provider chain
});

const runtimeClient = new BedrockRuntimeClient({
  region: "us-east-2", // Region from your stack output
});

// Function to list all prompts
export async function listPrompts(): Promise<any> {
  try {
    const command = new ListPromptsCommand({});
    const response = await agentClient.send(command);
    return response;
  } catch (error) {
    console.error("Error listing prompts:", error);
    throw error;
  }
}
// Function to get the CMH-Prompt-Test prompt
export async function getPrompt(): Promise<any> {
  const input = {
    promptIdentifier: "CMH-Prompt-Test", // Your prompt name
  };
  
  try {
    const command = new GetPromptCommand(input);
    const response = await agentClient.send(command);
    return response;
  } catch (error) {
    console.error("Error retrieving prompt:", error);
    throw error;
  }
}

// Function to use the prompt with the chatbot
export async function useChatbotWithPrompt(userInput: string): Promise<string> {
  try {
    // First get the prompt details
    const promptDetails = await getPrompt();
    
    // Use the prompt with Bedrock model directly
    const modelId = "anthropic.claude-v2"; // Replace with your preferred model
    
    const requestBody = {
      prompt: `${promptDetails.promptText}\n\nUser: ${userInput}\n\nAssistant:`,
      max_tokens: 1000,
      temperature: 0.7
    };
    
    const command = new InvokeModelCommand({
      modelId: modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(requestBody)
    });
    
    const response = await runtimeClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    if (responseBody.completion) {
      return responseBody.completion;
    }
    
    return JSON.stringify(responseBody);
  } catch (error) {
    console.error("Error using chatbot with prompt:", error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// Alternative function with different model or parameters
export async function usePromptWithModel(userInput: string): Promise<string> {
  try {
    // Get the prompt details
    const promptDetails = await getPrompt();
    
    // Use a different model or parameters
    const modelId = "anthropic.claude-instant-v1"; // Different model
    
    const requestBody = {
      prompt: `${promptDetails.promptText}\n\nUser: ${userInput}\n\nAssistant:`,
      max_tokens: 500,
      temperature: 0.5
    };
    
    const command = new InvokeModelCommand({
      modelId: modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(requestBody)
    });
    
    const response = await runtimeClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.completion;
  } catch (error) {
    console.error("Error using prompt with model:", error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}