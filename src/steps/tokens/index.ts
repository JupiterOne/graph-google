import {
  IntegrationStep,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, relationships } from '../../constants';
import { GSuiteTokenClient } from '../../gsuite/clients/GSuiteTokenClient';
import {
  createTokenEntity,
  createUserAssignedTokenRelationship,
} from './converters';

export async function fetchTokens(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState, logger } = context;
  const client = new GSuiteTokenClient({
    config: instance.config,
    logger,
  });

  try {
    await jobState.iterateEntities(
      {
        _type: entities.USER._type,
      },
      async (userEntity) => {
        const email = userEntity.email as string;

        await client.iterateTokens(email, async (token) => {
          const tokenEntity = await jobState.addEntity(
            createTokenEntity(token),
          );
          await jobState.addRelationship(
            createUserAssignedTokenRelationship({
              userEntity,
              tokenEntity,
            }),
          );
        });
      },
    );
  } catch (err) {
    if (err instanceof IntegrationProviderAuthorizationError) {
      context.logger.warn(
        `Could not ingest token entities. Missing required scope(s) (scopes=${client.requiredScopes.join(
          ', ',
        )})`,
      );
      return;
    }

    throw err;
  }
}

export const tokenSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'step-fetch-tokens',
    name: 'Tokens',
    entities: [entities.TOKEN],
    relationships: [relationships.USER_ASSIGNED_TOKEN],
    dependsOn: ['step-fetch-users'],
    executionHandler: fetchTokens,
  },
];
