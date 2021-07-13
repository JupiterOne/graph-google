import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, relationships, Steps } from '../../constants';
import { GSuiteUserClient } from '../../gsuite/clients/GSuiteUserClient';
import {
  createUserEntity,
  createSiteEntity,
  createAccountHasUserRelationship,
  createSiteHostsUserRelationship,
} from './converters';
import getAccountEntity from '../../utils/getAccountEntity';

export async function fetchUsers(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, logger } = context;

  const client = new GSuiteUserClient({
    config: instance.config,
    logger,
  });

  const buildingIdSet = new Set<string>();
  const accountEntity = await getAccountEntity(context);

  await client.iterateUsers(async (user) => {
    const userEntity = await context.jobState.addEntity(createUserEntity(user));

    await context.jobState.addRelationship(
      createAccountHasUserRelationship({
        accountEntity,
        userEntity,
      }),
    );

    for (const location of user.locations || []) {
      const siteEntity = createSiteEntity(user.id as string, location);

      if (buildingIdSet.has(location.buildingId)) {
        await context.jobState.addRelationship(
          createSiteHostsUserRelationship({
            siteEntity,
            userEntity,
          }),
        );

        continue;
      } else {
        await context.jobState.addEntity(siteEntity);
        await context.jobState.addRelationship(
          createSiteHostsUserRelationship({
            siteEntity,
            userEntity,
          }),
        );
      }

      buildingIdSet.add(location.buildingId);
    }
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Users',
    entities: [entities.USER, entities.SITE],
    relationships: [
      relationships.ACCOUNT_HAS_USER,
      relationships.SITE_HOSTS_USER,
    ],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUsers,
  },
];
