# Bedrock Prompts Integration

This document describes the integration of Amazon Bedrock prompts into the AWS GenAI LLM Chatbot.

## Overview

The integration allows users to:
1. View a dropdown list of available Bedrock prompts
2. Select a prompt to automatically populate the chat input field
3. Use the prompt content as a starting point for their conversations

## Architecture

### Frontend Components

1. **PromptsClient** (`src/common/api-client/prompts-client.ts`)
   - Handles GraphQL queries to fetch prompts from the backend
   - Methods: `listPrompts()`, `getPrompt(promptId)`

2. **Chat Input Panel** (`src/components/chatbot/chat-input-panel.tsx`)
   - Added prompt dropdown UI component
   - Handles prompt selection and content population
   - Loads prompts on component initialization

3. **Types and Queries**
   - Added BedrockPrompt types to `API.ts`
   - Added GraphQL queries to `queries.ts`

### Backend Components

1. **GraphQL Schema** (`lib/chatbot-api/schema/schema.graphql`)
   - Defines BedrockPrompt type and queries
   - `listBedrockPrompts: [BedrockPrompt!]!`
   - `getBedrockPrompt(promptIdentifier: String!): BedrockPrompt`

2. **API Routes** (`lib/chatbot-api/functions/api-handler/routes/bedrock_prompts.py`)
   - Implements prompt listing and retrieval
   - Uses boto3 bedrock-agent client
   - Includes error handling and mock data fallbacks

3. **Permissions** (`lib/chatbot-api/rest-api.ts`)
   - Added `bedrock:ListPrompts` and `bedrock:GetPrompt` permissions
   - Integrated with existing IAM role

## Usage

1. **Accessing Prompts**
   - Open the chatbot interface
   - Look for the "Select prompt template" dropdown
   - Choose from available Bedrock prompts

2. **Using Prompts**
   - Select a prompt from the dropdown
   - The prompt content will populate the chat input field
   - Modify the content as needed
   - Send the message to start the conversation

## Configuration

### Required Permissions

The Lambda execution role needs these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:ListPrompts",
        "bedrock:GetPrompt"
      ],
      "Resource": "*"
    }
  ]
}
```

### Environment Variables

No additional environment variables are required. The integration uses the existing AWS SDK configuration.

## Error Handling

1. **Network Errors**: Gracefully handled with console logging
2. **Permission Errors**: Falls back to mock data to prevent UI breakage
3. **Missing Prompts**: Shows appropriate error messages

## Testing

Run the test script:
```bash
test-bedrock-prompts.bat
```

This will:
1. Build the React application
2. Deploy the backend changes
3. Make the integration available for testing

## Troubleshooting

### Common Issues

1. **Prompts not loading**
   - Check IAM permissions for bedrock:ListPrompts
   - Verify AWS region configuration
   - Check browser console for errors

2. **Prompt content not populating**
   - Ensure bedrock:GetPrompt permission is granted
   - Check that prompts have valid content structure
   - Verify prompt variants are properly formatted

3. **UI not showing dropdown**
   - Ensure React app was rebuilt after changes
   - Check that promptsStatus is not "error"
   - Verify promptOptions array is populated

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify GraphQL queries in Network tab
3. Check Lambda logs for backend errors
4. Test Bedrock API access directly using AWS CLI

## Future Enhancements

1. **Prompt Categories**: Group prompts by category or use case
2. **Prompt Search**: Add search functionality for large prompt libraries
3. **Prompt Favorites**: Allow users to mark frequently used prompts
4. **Custom Prompts**: Enable users to create and save custom prompts
5. **Prompt Versioning**: Support for different versions of prompts

## Security Considerations

1. **Access Control**: Prompts are only accessible to admin and workspace_manager roles
2. **Content Filtering**: Consider implementing content validation for prompt text
3. **Audit Logging**: Track prompt usage for compliance and monitoring