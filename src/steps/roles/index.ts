import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, relationships, Steps } from '../../constants';
import { createRoleEntity } from './converters';
import { GSuiteRoleClient } from '../../gsuite/clients/GSuiteRoleClient';

export async function fetchRoles(
  context: IntegrationStepContext,
): Promise<void> {
  const client = new GSuiteRoleClient({
    config: context.instance.config,
    logger: context.logger,
  });

  await client.iterateRoles(async (data) => {
    await context.jobState.addEntity(createRoleEntity(data));
  });
}

export const roleSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ROLES,
    name: 'Role',
    entities: [entities.ROLE, entities.USER, entities.GROUP, entities.DOMAIN],
    relationships: [
      relationships.ACCOUNT_HAS_ROLE,
      relationships.GROUP_HAS_ROLE,
      relationships.USER_HAS_ROLE,
      relationships.DOMAIN_HAS_ROLE,
    ],
    executionHandler: fetchRoles,
  },
];
