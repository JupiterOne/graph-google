import {
  IntegrationExecutionContext,
  IntegrationConfigLoadError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './types';
import { deserializeIntegrationConfig } from './utils/integrationConfig';
import GSuiteClient from './gsuite/clients/GSuiteClient';

export default async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const {
    instance: { config: serializedIntegrationConfig },
    logger,
  } = context;

  if (
    !serializedIntegrationConfig.serviceAccountKeyFile ||
    !serializedIntegrationConfig.domainAdminEmail ||
    !serializedIntegrationConfig.googleAccountId
  ) {
    throw new IntegrationConfigLoadError(
      'config.seriveAccountKeyFile, config.googleAccountId, config.domainAdminEmail must be provided by the user',
    );
  }

  // Override the incoming config with the new config that has parsed service
  // account data
  const config = (context.instance.config = deserializeIntegrationConfig(
    serializedIntegrationConfig,
  ));

  const client = new GSuiteClient({ config, logger });

  try {
    await client.getAuthenticatedServiceClient();
  } catch (err) {
    throw new IntegrationProviderAuthenticationError(err);
  }
}
