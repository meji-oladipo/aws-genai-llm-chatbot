import { API } from "aws-amplify";
import { GraphQLQuery, GraphQLResult } from "@aws-amplify/api";
import { listBedrockPrompts, getBedrockPrompt } from "../../graphql/queries";
import {
  ListBedrockPromptsQuery,
  GetBedrockPromptQuery,
  BedrockPrompt,
} from "../../API";

export interface BedrockPromptDetails {
  promptId: string;
  name: string;
  description?: string;
  creationDateTime?: string;
  variants?: Array<{
    templateConfiguration: {
      chat?: {
        messages: Array<{
          content: Array<{ text: string }>;
        }>;
      };
      text?: {
        text: string;
      };
    };
  }>;
}

export class PromptsClient {
  async listPrompts(): Promise<BedrockPrompt[]> {
    try {
      const result = await API.graphql<GraphQLQuery<ListBedrockPromptsQuery>>({
        query: listBedrockPrompts,
      });
      return result.data?.listBedrockPrompts || [];
    } catch (error) {
      console.error("Error listing prompts:", error);
      return [];
    }
  }

  async getPrompt(promptId: string): Promise<BedrockPromptDetails> {
    try {
      const result = await API.graphql<GraphQLQuery<GetBedrockPromptQuery>>({
        query: getBedrockPrompt,
        variables: {
          promptIdentifier: promptId,
        },
      });
      
      const prompt = result.data?.getBedrockPrompt;
      if (!prompt) {
        throw new Error("Prompt not found");
      }
      
      return {
        promptId: prompt.promptId,
        name: prompt.name,
        description: prompt.description || undefined,
        creationDateTime: prompt.creationDateTime || undefined,
        variants: prompt.variants ? JSON.parse(prompt.variants) : undefined,
      };
    } catch (error) {
      console.error("Error getting prompt:", error);
      throw error;
    }
  }
}