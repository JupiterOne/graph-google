import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, relationships } from '../../constants';
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
  const { instance } = context;
  const client = new GSuiteUserClient(instance.config);
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
    id: 'step-fetch-users',
    name: 'Users',
    entities: [entities.USER, entities.SITE],
    relationships: [
      relationships.ACCOUNT_HAS_USER,
      relationships.SITE_HOSTS_USER,
    ],
    dependsOn: ['step-create-account'],
    executionHandler: fetchUsers,
  },
];
