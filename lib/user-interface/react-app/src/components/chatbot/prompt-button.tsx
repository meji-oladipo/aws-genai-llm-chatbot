import { Button, SpaceBetween } from "@cloudscape-design/components";

interface PromptButtonProps {
  promptId: string;
  name: string;
}

export function PromptButton({ promptId, name }: PromptButtonProps) {
  const handleClick = async () => {
    try {
      // Dispatch an event that the chat component listens for
      document.dispatchEvent(new CustomEvent('promptSelected', { 
        detail: { 
          promptName: promptId
        } 
      }));
    } catch (error) {
      console.error("Error using prompt:", error);
    }
  };

  return (
    <Button 
      onClick={handleClick}
      variant="primary"
    >
      {name}
    </Button>
  );
}

export function PromptButtonContainer() {
  // Note: These are placeholder prompts. In a real implementation,
  // these should be loaded from the actual Bedrock prompts API
  return (
    <SpaceBetween direction="horizontal" size="xs">
      <PromptButton promptId="sample-prompt-1" name="Sample Prompt 1" />
      <PromptButton promptId="sample-prompt-2" name="Sample Prompt 2" />
    </SpaceBetween>
  );
}