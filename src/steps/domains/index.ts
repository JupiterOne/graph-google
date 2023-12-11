import {
  IntegrationProviderAuthorizationError,
  IntegrationStep,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, IngestionSources, Steps } from '../../constants';
import { createDomainEntity } from './converters';
import { GSuiteDomainClient } from '../../gsuite/clients/GSuiteDomainClient';
import { authorizationErrorResponses } from '../../gsuite/clients/GSuiteClient';

export async function fetchDomains(
  context: IntegrationStepContext,
): Promise<void> {
  const client = new GSuiteDomainClient({
    config: context.instance.config,
    logger: context.logger,
  });

  try {
    await client.iterateDomains(async (domain) => {
      await context.jobState.addEntity(createDomainEntity(domain));
    });
  } catch (err) {
    if (
      err instanceof IntegrationProviderAuthorizationError &&
      authorizationErrorResponses.filter((errorText) =>
        err.statusText.match(errorText),
      ).length > 0
    ) {
      context.logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
        description: `Could not ingest domains. Missing required scope(s) (scopes=${client.requiredScopes.join(
          ', ',
        )}). Additionally, Domain Management Admin API Privilege needs to be enabled.`,
      });
      return;
    }

    throw err;
  }
}

export const domainSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DOMAINS,
    ingestionSourceId: IngestionSources.DOMAINS,
    name: 'Domains',
    entities: [entities.DOMAIN],
    relationships: [],
    executionHandler: fetchDomains,
  },
];
