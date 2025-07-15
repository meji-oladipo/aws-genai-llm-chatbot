import { Button, SpaceBetween } from "@cloudscape-design/components";

export function PromptButton() {
  const handleClick = async () => {
    try {
      // Dispatch an event that the chat component listens for
      document.dispatchEvent(new CustomEvent('promptSelected', { 
        detail: { 
          promptName: "CMH-Prompt-Test"
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
      CMH-Prompt
    </Button>
  );
}

export function PromptButtonContainer() {
  return (
    <SpaceBetween direction="horizontal" size="xs">
      <PromptButton />
    </SpaceBetween>
  );
}