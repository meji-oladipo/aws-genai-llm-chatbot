from typing import Any
import boto3
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.event_handler.appsync import Router
from genai_core.auth import UserPermissions

tracer = Tracer()
router = Router()
logger = Logger()
permissions = UserPermissions(router)
bedrock_client = boto3.client("bedrock-agent")

@router.resolver(field_name="listBedrockPrompts")
@tracer.capture_method
@permissions.approved_roles([
    permissions.ADMIN_ROLE,
    permissions.WORKSPACES_MANAGER_ROLE
])
def list_bedrock_prompts() -> dict[str, Any]:
    try:
        response = bedrock_client.list_prompts()
        return {"ok": True, "prompts": response.get("promptSummaries", [])}
    except Exception as e:
        logger.error(f"Error listing Bedrock prompts: {str(e)}")
        return {"ok": False, "error": str(e)}