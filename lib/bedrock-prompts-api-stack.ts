import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class BedrockPromptsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // IAM role for Lambda functions to access Bedrock
    const bedrockRole = new iam.Role(this, 'BedrockLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        BedrockAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'bedrock:ListPrompts',
                'bedrock:GetPrompt',
                'bedrock:DeletePrompt'
              ],
              resources: ['*']
            })
          ]
        })
      }
    });

    // Lambda function to list prompts
    const listPromptsFunction = new lambda.Function(this, 'ListPromptsFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'list-prompts.handler',
      code: lambda.Code.fromAsset('lambda'),
      role: bedrockRole
    });

    // Lambda function to get prompt details
    const getPromptFunction = new lambda.Function(this, 'GetPromptFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'get-prompt.handler',
      code: lambda.Code.fromAsset('lambda'),
      role: bedrockRole
    });

    // Lambda function to delete prompt
    const deletePromptFunction = new lambda.Function(this, 'DeletePromptFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'delete-prompt.handler',
      code: lambda.Code.fromAsset('lambda'),
      role: bedrockRole
    });

    // API Gateway REST API
    const api = new apigateway.RestApi(this, 'BedrockPromptsApi', {
      restApiName: 'Bedrock Prompts API',
      description: 'API for managing Bedrock prompts',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization']
      }
    });

    // Create /api resource
    const apiResource = api.root.addResource('api');
    
    // Create /api/bedrock-prompts resource
    const bedrockPromptsResource = apiResource.addResource('bedrock-prompts');

    // GET /api/bedrock-prompts - List all prompts
    bedrockPromptsResource.addMethod('GET', new apigateway.LambdaIntegration(listPromptsFunction));

    // Create {id} resource under bedrock-prompts
    const promptIdResource = bedrockPromptsResource.addResource('{id}');

    // GET /api/bedrock-prompts/{id} - Get prompt details
    promptIdResource.addMethod('GET', new apigateway.LambdaIntegration(getPromptFunction));

    // DELETE /api/bedrock-prompts/{id} - Delete prompt
    promptIdResource.addMethod('DELETE', new apigateway.LambdaIntegration(deletePromptFunction));

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway URL for Bedrock Prompts API'
    });
  }
}