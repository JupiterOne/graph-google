import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, Steps } from '../../constants';
import { createRoleEntity } from './converters';
import { GSuiteRoleClient } from '../../gsuite/clients/GSuiteRoleClient';
import { getAccountKey } from '../account/converters';

export async function fetchRoles(
  context: IntegrationStepContext,
): Promise<void> {
  const client = new GSuiteRoleClient({
    config: context.instance.config,
    logger: context.logger,
  });

  const accountEntity = await context.jobState.findEntity(
    getAccountKey(context.instance.config.googleAccountId),
  );
  if (!accountEntity) throw new Error("Couldn't find the accountEntity");

  await client.iterateRoles(async (role) => {
    const roleEntity = createRoleEntity(role);
    await context.jobState.addEntity(roleEntity);
    const relationship = createDirectRelationship({
      from: accountEntity,
      _class: RelationshipClass.HAS,
      to: roleEntity,
    });

    await context.jobState.addRelationship(relationship);
  });
}

export const roleSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ROLES,
    name: 'Role',
    entities: [entities.ROLE],
    relationships: [],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchRoles,
  },
];
