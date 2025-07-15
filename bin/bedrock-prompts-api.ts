#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BedrockPromptsApiStack } from '../lib/bedrock-prompts-api-stack';

const app = new cdk.App();
new BedrockPromptsApiStack(app, 'BedrockPromptsApiStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-2',
  },
});