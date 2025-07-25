import { useState, useEffect, useContext } from "react";
import { Button, Table, SpaceBetween, Header, Modal, Box } from "@cloudscape-design/components";
import { AppContext } from "../../common/app-context";
import { ApiClient } from "../../common/api-client/api-client";

interface BedrockPrompt {
  promptId: string;
  name: string;
  description?: string;
  creationDateTime?: string;
}

export function BedrockPromptList() {
  const appContext = useContext(AppContext);
  const [prompts, setPrompts] = useState<BedrockPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<BedrockPrompt | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    if (!appContext) return;
    
    try {
      setLoading(true);
      console.log('Loading Bedrock prompts from API');
      
      const apiClient = new ApiClient(appContext);
      const promptsList = await apiClient.prompts.listPrompts();
      
      console.log('Loaded prompts:', promptsList);
      setPrompts(promptsList);
    } catch (error) {
      console.error("Error loading Bedrock prompts:", error);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (prompt: BedrockPrompt) => {
    setSelectedPrompt(prompt);
    setShowDetails(true);
  };

  const handleDeletePrompt = async (promptId: string) => {
    console.log('Deleting prompt:', promptId);
    // Filter out the deleted prompt
    setPrompts(prompts.filter(p => p.promptId !== promptId));
  };

  return (
    <SpaceBetween direction="vertical" size="l">
      <Header
        variant="h1"
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={() => console.log('Create prompt')}>
              Create
            </Button>
            <Button onClick={() => console.log('Manage prompts')}>
              Manage
            </Button>
            <Button onClick={() => console.log('Delete selected')}>
              Delete
            </Button>
            <Button 
              iconName="refresh" 
              variant="icon" 
              onClick={() => window.location.reload()}
              ariaLabel="Refresh page"
            />
          </SpaceBetween>
        }
      >
        Prompts Library
      </Header>

      <Table
        columnDefinitions={[
          {
            id: "name",
            header: "Name",
            cell: (item: BedrockPrompt) => item.name,
          },
          {
            id: "description",
            header: "Description",
            cell: (item: BedrockPrompt) => item.description || "-",
          },
          {
            id: "creationDateTime",
            header: "Created",
            cell: (item: BedrockPrompt) => item.creationDateTime ? new Date(item.creationDateTime).toLocaleDateString() : "-",
          },
          {
            id: "actions",
            header: "Actions",
            cell: (item: BedrockPrompt) => (
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => handleViewDetails(item)}>
                  View
                </Button>
                <Button 
                  variant="normal"
                  onClick={() => handleDeletePrompt(item.promptId)}
                >
                  Delete
                </Button>
              </SpaceBetween>
            ),
          },
        ]}
        items={prompts}
        loading={loading}
        empty={
          <Box textAlign="center" color="inherit">
            <b>No prompts found</b>
            <Box padding={{ bottom: "s" }} variant="p" color="inherit">
              No Bedrock prompts available in your library.
            </Box>
          </Box>
        }
      />

      <Modal
        visible={showDetails}
        onDismiss={() => setShowDetails(false)}
        header="Prompt Details"
        size="large"
      >
        {selectedPrompt && (
          <SpaceBetween direction="vertical" size="m">
            <div>
              <strong>Name:</strong> {selectedPrompt.name}
            </div>
            <div>
              <strong>Description:</strong> {selectedPrompt.description || "No description"}
            </div>
            <div>
              <strong>ID:</strong> {selectedPrompt.promptId}
            </div>
            <div>
              <strong>Created:</strong> {selectedPrompt.creationDateTime ? new Date(selectedPrompt.creationDateTime).toLocaleString() : "Unknown"}
            </div>
          </SpaceBetween>
        )}
      </Modal>
    </SpaceBetween>
  );
}