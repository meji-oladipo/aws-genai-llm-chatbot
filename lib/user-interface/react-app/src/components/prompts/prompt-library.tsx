import { useState, useEffect } from "react";
import {
  Table,
  Box,
  Button,
  SpaceBetween,
  Header,
  Pagination,
  TextFilter,
  Container,
  Alert,
  Modal,
  FormField,
  Input,
  Textarea,
} from "@cloudscape-design/components";
import { API } from "aws-amplify";
import { listBedrockPrompts } from "../../graphql/queries";
import { createBedrockPrompt, updateBedrockPrompt, deleteBedrockPrompt } from "../../graphql/mutations";

interface BedrockPrompt {
  id: string;
  name: string;
  description?: string;
  defaultVariant?: {
    templateConfiguration?: {
      text?: {
        text?: string;
      };
    };
  };
}

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<BedrockPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<BedrockPrompt | null>(null);
  const [filterText, setFilterText] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promptForm, setPromptForm] = useState({
    name: "",
    description: "",
    text: "",
  });

  // Load prompts from AWS Bedrock
  const loadPrompts = async () => {
    setLoading(true);
    setError("");
    try {
      const promptsResult = await API.graphql({
        query: listBedrockPrompts,
        authMode: "AMAZON_COGNITO_USER_POOLS",
      }) as any;
      
      const promptsData = JSON.parse(promptsResult.data?.listBedrockPrompts || '{}');
      if (promptsData.ok && promptsData.prompts) {
        setPrompts(promptsData.prompts);
      } else {
        setPrompts([]);
        setError("No prompts found or error loading prompts");
      }
    } catch (err: any) {
      console.error("Error loading prompts:", err);
      setError("Failed to load prompts: " + err.message);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  // Filter prompts based on search text
  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(filterText.toLowerCase())
  );

  // Handle create prompt
  const handleCreatePrompt = async () => {
    try {
      setLoading(true);
      const newPrompt = {
        name: promptForm.name,
        description: promptForm.description,
        defaultVariant: {
          templateConfiguration: {
            text: {
              text: promptForm.text
            }
          }
        }
      };
      
      await API.graphql({
        query: createBedrockPrompt,
        variables: { input: JSON.stringify(newPrompt) },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      
      setShowCreateModal(false);
      setPromptForm({ name: "", description: "", text: "" });
      loadPrompts();
    } catch (err: any) {
      console.error("Error creating prompt:", err);
      setError("Failed to create prompt: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle update prompt
  const handleUpdatePrompt = async () => {
    try {
      setLoading(true);
      if (!selectedPrompt) {
        setError("No prompt selected for update");
        setLoading(false);
        return;
      }
      
      const updatedPrompt = {
        id: selectedPrompt.id,
        name: promptForm.name,
        description: promptForm.description,
        defaultVariant: {
          templateConfiguration: {
            text: {
              text: promptForm.text
            }
          }
        }
      };
      
      await API.graphql({
        query: updateBedrockPrompt,
        variables: { input: JSON.stringify(updatedPrompt) },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      
      setShowEditModal(false);
      setPromptForm({ name: "", description: "", text: "" });
      loadPrompts();
    } catch (err: any) {
      console.error("Error updating prompt:", err);
      setError("Failed to update prompt: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete prompt
  const handleDeletePrompt = async () => {
    try {
      setLoading(true);
      
      if (!selectedPrompt) {
        setError("No prompt selected for deletion");
        setLoading(false);
        return;
      }
      
      await API.graphql({
        query: deleteBedrockPrompt,
        variables: { id: selectedPrompt.id },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      
      setShowDeleteModal(false);
      setSelectedPrompt(null);
      loadPrompts();
    } catch (err: any) {
      console.error("Error deleting prompt:", err);
      setError("Failed to delete prompt: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal with selected prompt data
  const openEditModal = (prompt: BedrockPrompt) => {
    setPromptForm({
      name: prompt.name || "",
      description: prompt.description || "",
      text: prompt.defaultVariant?.templateConfiguration?.text?.text || "",
    });
    setSelectedPrompt(prompt);
    setShowEditModal(true);
  };

  return (
    <Container>
      <SpaceBetween size="l">
        <Header
          variant="h1"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="primary"
              >
                Create prompt
              </Button>
              <Button
                onClick={() => selectedPrompt && openEditModal(selectedPrompt)}
                disabled={!selectedPrompt}
              >
                Manage
              </Button>
              <Button
                onClick={() => selectedPrompt && setShowDeleteModal(true)}
                disabled={!selectedPrompt}
              >
                Delete
              </Button>
            </SpaceBetween>
          }
        >
          Prompt Library
        </Header>

        {error && <Alert type="error">{error}</Alert>}

        <Table
          loading={loading}
          selectedItems={selectedPrompt ? [selectedPrompt] : []}
          onSelectionChange={({ detail }) =>
            setSelectedPrompt(detail.selectedItems[0] || null)
          }
          selectionType="single"
          header={
            <Header
              counter={`(${filteredPrompts.length})`}
              actions={
                <TextFilter
                  filteringText={filterText}
                  filteringPlaceholder="Find prompts"
                  filteringAriaLabel="Filter prompts"
                  onChange={({ detail }) => setFilterText(detail.filteringText)}
                />
              }
            >
              Prompts
            </Header>
          }
          columnDefinitions={[
            {
              id: "name",
              header: "Name",
              cell: (item: BedrockPrompt) => item.name || "-",
              sortingField: "name",
            },
            {
              id: "description",
              header: "Description",
              cell: (item: BedrockPrompt) => item.description || "-",
            },
            {
              id: "text",
              header: "Prompt Text",
              cell: (item: BedrockPrompt) => {
                const text = item.defaultVariant?.templateConfiguration?.text?.text || "-";
                return text.length > 100 ? text.substring(0, 100) + "..." : text;
              },
            },
          ]}
          pagination={
            <Pagination
              currentPageIndex={currentPageIndex}
              onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
              pagesCount={Math.max(1, Math.ceil(filteredPrompts.length / 10))}
            />
          }
          items={filteredPrompts.slice((currentPageIndex - 1) * 10, currentPageIndex * 10)}
          empty={
            <Box textAlign="center" color="inherit">
              <b>No prompts</b>
              <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                No prompts found in AWS Bedrock.
              </Box>
              <Button onClick={() => setShowCreateModal(true)}>Create prompt</Button>
            </Box>
          }
        />
      </SpaceBetween>

      {/* Create Prompt Modal */}
      <Modal
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
        header="Create new prompt"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreatePrompt}
                disabled={!promptForm.name || !promptForm.text}
              >
                Create
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="l">
          <FormField label="Name">
            <Input
              value={promptForm.name}
              onChange={({ detail }) =>
                setPromptForm({ ...promptForm, name: detail.value })
              }
            />
          </FormField>
          <FormField label="Description">
            <Input
              value={promptForm.description}
              onChange={({ detail }) =>
                setPromptForm({ ...promptForm, description: detail.value })
              }
            />
          </FormField>
          <FormField label="Prompt Text">
            <Textarea
              value={promptForm.text}
              onChange={({ detail }) =>
                setPromptForm({ ...promptForm, text: detail.value })
              }
              rows={10}
            />
          </FormField>
        </SpaceBetween>
      </Modal>

      {/* Edit Prompt Modal */}
      <Modal
        visible={showEditModal}
        onDismiss={() => setShowEditModal(false)}
        header="Edit prompt"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdatePrompt}
                disabled={!promptForm.name || !promptForm.text}
              >
                Save changes
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="l">
          <FormField label="Name">
            <Input
              value={promptForm.name}
              onChange={({ detail }) =>
                setPromptForm({ ...promptForm, name: detail.value })
              }
            />
          </FormField>
          <FormField label="Description">
            <Input
              value={promptForm.description}
              onChange={({ detail }) =>
                setPromptForm({ ...promptForm, description: detail.value })
              }
            />
          </FormField>
          <FormField label="Prompt Text">
            <Textarea
              value={promptForm.text}
              onChange={({ detail }) =>
                setPromptForm({ ...promptForm, text: detail.value })
              }
              rows={10}
            />
          </FormField>
        </SpaceBetween>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        header="Delete prompt"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleDeletePrompt}>
                Delete
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <Box variant="span">
          Are you sure you want to delete the prompt "{selectedPrompt?.name}"? This action cannot be undone.
        </Box>
      </Modal>
    </Container>
  );
}