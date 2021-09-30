import {
  createDirectRelationship,
  IntegrationMissingKeyError,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, relationships, Steps } from '../../constants';
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

  const accountKey = getAccountKey(context.instance.config.googleAccountId);
  const accountEntity = await context.jobState.findEntity(accountKey);
  if (!accountEntity)
    throw new IntegrationMissingKeyError(
      `Could not find account entity (googleAccountId=${context.instance.config.googleAccountId})`,
    );

  await client.iterateRoles(async (role) => {
    const roleEntity = await context.jobState.addEntity(createRoleEntity(role));
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
    name: 'Roles',
    entities: [entities.ROLE],
    relationships: [relationships.ACCOUNT_HAS_ROLE],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchRoles,
  },
];
