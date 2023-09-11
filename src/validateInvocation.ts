import {
  IntegrationConfigLoadError,
  IntegrationExecutionContext,
} from '@jupiterone/integration-sdk-core';

import GSuiteAdminClient from './gsuite/clients/GSuiteAdminClient';
import { IntegrationConfig } from './types';
import { deserializeIntegrationConfig } from './utils/integrationConfig';

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
      'config.serviceAccountKeyFile, config.googleAccountId, config.domainAdminEmail must be provided by the user',
    );
  }

  // TODO: remove this after INT-9249 is done
  if (
    !serializedIntegrationConfig.domainAdminEmail.includes('jupiterone-admin')
  ) {
    logger.warn('Domain email does not includes jupiterone-admin.');
  }

  // Override the incoming config with the new config that has parsed service
  // account data
  const config = (context.instance.config = deserializeIntegrationConfig(
    serializedIntegrationConfig,
  ));

  const client = new GSuiteAdminClient({ config, logger });
  await client.getAuthenticatedServiceClient();
}
