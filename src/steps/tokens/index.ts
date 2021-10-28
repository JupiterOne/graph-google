import {
  IntegrationStep,
  IntegrationProviderAuthorizationError,
  createMappedRelationship,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, relationships, Steps } from '../../constants';
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
          const vendorName = token.displayText || 'Unknown Vendor';
          await jobState.addRelationship(
            createMappedRelationship({
              _class: RelationshipClass.ALLOWS,
              _type: relationships.TOKEN_ALLOWS_VENDOR._type,
              _mapping: {
                sourceEntityKey: tokenEntity._key,
                relationshipDirection: RelationshipDirection.FORWARD,
                targetFilterKeys: [['_class', 'name']],
                targetEntity: {
                  _class: 'Vendor',
                  _type: vendorName.toLowerCase().replace(' ', '_'),
                  displayName: vendorName,
                  name: vendorName,
                  validated: false,
                  active: true,
                },
              },
            }),
          );
        });
      },
    );
  } catch (err) {
    if (err instanceof IntegrationProviderAuthorizationError) {
      context.logger.warn({ err }, 'Could not ingest token entities');
      context.logger.publishEvent({
        name: 'missing_scope',
        description: `Could not ingest token entities. Missing required scope(s) (scopes=${client.requiredScopes.join(
          ', ',
        )})`,
      });
      return;
    }

    throw err;
  }
}

export const tokenSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.TOKENS,
    name: 'Tokens',
    entities: [entities.TOKEN],
    relationships: [
      relationships.USER_ASSIGNED_TOKEN,
      relationships.TOKEN_ALLOWS_VENDOR,
    ],
    dependsOn: [Steps.USERS],
    executionHandler: fetchTokens,
  },
];
