import json
import boto3
from aws_lambda_powertools import Logger
from aws_lambda_powertools.event_handler.api_gateway import Router

logger = Logger()
router = Router()
bedrock_client = boto3.client("bedrock-agent")

@router.get("/bedrock-prompts")
def list_bedrock_prompts():
    try:
        response = bedrock_client.list_prompts()
        return {"ok": True, "prompts": response.get("promptSummaries", [])}
    except Exception as e:
        logger.error(f"Error listing Bedrock prompts: {str(e)}")
        return {"ok": False, "error": str(e)}

@router.get("/bedrock-prompts/<prompt_identifier>")
def get_bedrock_prompt(prompt_identifier: str):
    try:
        response = bedrock_client.get_prompt(promptIdentifier=prompt_identifier)
        return {"ok": True, "prompt": response}
    except Exception as e:
        logger.error(f"Error getting Bedrock prompt: {str(e)}")
        return {"ok": False, "error": str(e)}

@router.post("/bedrock-prompts")
def create_bedrock_prompt():
    try:
        data = router.current_event.json_body
        response = bedrock_client.create_prompt(
            name=data["name"],
            description=data.get("description", ""),
            defaultVariant={
                "name": "default",
                "templateType": "TEXT",
                "templateConfiguration": {
                    "text": {
                        "text": data["content"]
                    }
                }
            }
        )
        return {"ok": True, "prompt": response}
    except Exception as e:
        logger.error(f"Error creating Bedrock prompt: {str(e)}")
        return {"ok": False, "error": str(e)}

@router.put("/bedrock-prompts/<prompt_identifier>")
def update_bedrock_prompt(prompt_identifier: str):
    try:
        data = router.current_event.json_body
        response = bedrock_client.update_prompt(
            promptIdentifier=prompt_identifier,
            name=data["name"],
            description=data.get("description", ""),
            defaultVariant={
                "name": "default",
                "templateType": "TEXT",
                "templateConfiguration": {
                    "text": {
                        "text": data["content"]
                    }
                }
            }
        )
        return {"ok": True, "prompt": response}
    except Exception as e:
        logger.error(f"Error updating Bedrock prompt: {str(e)}")
        return {"ok": False, "error": str(e)}

@router.delete("/bedrock-prompts/<prompt_identifier>")
def delete_bedrock_prompt(prompt_identifier: str):
    try:
        bedrock_client.delete_prompt(promptIdentifier=prompt_identifier)
        return {"ok": True}
    except Exception as e:
        logger.error(f"Error deleting Bedrock prompt: {str(e)}")
        return {"ok": False, "error": str(e)}