import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities } from '../../constants';
import { createDomainEntity } from './converters';
import { GSuiteDomainClient } from '../../gsuite/clients/GSuiteDomainClient';

export async function fetchDomains(
  context: IntegrationStepContext,
): Promise<void> {
  const client = new GSuiteDomainClient({
    config: context.instance.config,
    logger: context.logger,
  });

  await client.iterateDomains(async (domain) => {
    await context.jobState.addEntity(createDomainEntity(domain));
  });
}

export const domainSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'step-fetch-domains',
    name: 'Domains',
    entities: [entities.DOMAIN],
    relationships: [],
    executionHandler: fetchDomains,
  },
];
