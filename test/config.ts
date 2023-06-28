import { IntegrationConfig, SerializedIntegrationConfig } from '../src/types';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { ParsedServiceAccountKeyFile } from '../src/utils/parseServiceAccountKeyFile';
import { deserializeIntegrationConfig } from '../src/utils/integrationConfig';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import { invocationConfig } from '../src';
import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

export function buildStepTestConfig(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}

export const DEFAULT_INTEGRATION_CONFIG_PROJECT_ID = 'j1-gc-integration-dev';
export const DEFAULT_GOOGLE_ACCOUNT_ID = 'C048tgq5f';

// NOTE: This is a bogus certificate for tests. The Google auth SDK asserts
// that a certificate is valid.
export const DEFAULT_INTEGRATION_PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, '../fake-private-test-key.key'),
  {
    encoding: 'utf-8',
  },
);

export const DEFAULT_INTEGRATION_CLIENT_EMAIL =
  'j1-gc-integration-dev-sa@j1-gc-integration-dev.iam.gserviceaccount.com';

export const DEFAULT_INTEGRATION_CONFIG_SERVICE_ACCOUNT_KEY_FILE: ParsedServiceAccountKeyFile = {
  type: 'service_account',
  project_id: DEFAULT_INTEGRATION_CONFIG_PROJECT_ID,
  private_key_id: 'abcdef123456abcdef123456abcdef123456abc',
  private_key: DEFAULT_INTEGRATION_PRIVATE_KEY,
  client_email: DEFAULT_INTEGRATION_CLIENT_EMAIL,
  client_id: '12345678901234567890',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/abc',
};

export const serializedIntegrationConfig: SerializedIntegrationConfig = {
  serviceAccountKeyFile:
    process.env.SERVICE_ACCOUNT_KEY_FILE ||
    JSON.stringify(DEFAULT_INTEGRATION_CONFIG_SERVICE_ACCOUNT_KEY_FILE),
  googleAccountId: process.env.GOOGLE_ACCOUNT_ID || DEFAULT_GOOGLE_ACCOUNT_ID,
  domainAdminEmail:
    process.env.DOMAIN_ADMIN_EMAIL || 'mockdomainadminemail@jupiterone.com',
};

export const integrationConfig: IntegrationConfig = deserializeIntegrationConfig(
  serializedIntegrationConfig,
);

export function getMockSerializedIntegrationConfig(): SerializedIntegrationConfig {
  return {
    serviceAccountKeyFile: JSON.stringify(
      DEFAULT_INTEGRATION_CONFIG_SERVICE_ACCOUNT_KEY_FILE,
    ),
    googleAccountId: DEFAULT_GOOGLE_ACCOUNT_ID,
    domainAdminEmail: 'mockdomainadminemail@jupiterone.com',
  };
}

export function getMockIntegrationConfig(): IntegrationConfig {
  return deserializeIntegrationConfig(getMockSerializedIntegrationConfig());
}
