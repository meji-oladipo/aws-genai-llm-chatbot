import { useState, useEffect, useContext } from "react";
import { Button, Table, SpaceBetween, Header, Modal, Box } from "@cloudscape-design/components";
import { AppContext } from "../../common/app-context";
import { API_CONFIG } from "../../config/api-config";

interface BedrockPrompt {
  id: string;
  name: string;
  description?: string;
  arn: string;
  creationTime: string;
  lastModifiedTime: string;
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
      // Temporarily disabled API calls to isolate router issue
      console.log('Loading prompts from:', API_CONFIG.BEDROCK_PROMPTS_API_URL);
      setPrompts([]);
    } catch (error) {
      console.error("Error loading Bedrock prompts:", error);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (prompt: BedrockPrompt) => {
    if (!appContext) return;
    
    try {
      const response = await fetch(`${API_CONFIG.BEDROCK_PROMPTS_API_URL}/api/bedrock-prompts/${prompt.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedPrompt(data);
      } else {
        setSelectedPrompt(prompt);
      }
      setShowDetails(true);
    } catch (error) {
      console.error("Error loading prompt details:", error);
      setSelectedPrompt(prompt);
      setShowDetails(true);
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!appContext) return;
    
    try {
      const response = await fetch(`${API_CONFIG.BEDROCK_PROMPTS_API_URL}/api/bedrock-prompts/${promptId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('Prompt deleted successfully');
        loadPrompts();
      } else {
        console.error('Failed to delete prompt:', response.statusText);
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
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
            id: "lastModified",
            header: "Last Modified",
            cell: (item: BedrockPrompt) => new Date(item.lastModifiedTime).toLocaleDateString(),
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
                  onClick={() => handleDeletePrompt(item.id)}
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
              <strong>ARN:</strong> {selectedPrompt.arn}
            </div>
            <div>
              <strong>Created:</strong> {new Date(selectedPrompt.creationTime).toLocaleString()}
            </div>
            <div>
              <strong>Last Modified:</strong> {new Date(selectedPrompt.lastModifiedTime).toLocaleString()}
            </div>
          </SpaceBetween>
        )}
      </Modal>
    </SpaceBetween>
  );
}