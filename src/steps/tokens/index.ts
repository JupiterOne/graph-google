import {
  IntegrationStep,
  IntegrationProviderAuthorizationError,
  createMappedRelationship,
  RelationshipClass,
  RelationshipDirection,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import {
  entities,
  IngestionSources,
  relationships,
  Steps,
} from '../../constants';
import { GSuiteTokenClient } from '../../gsuite/clients/GSuiteTokenClient';
import {
  createTokenEntity,
  createUserAssignedTokenRelationship,
} from './converters';
import { createVendorTypeFromName } from '@jupiterone/vendor-stack';
import { authorizationErrorResponses } from '../../gsuite/clients/GSuiteClient';

export async function fetchTokens(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState, logger } = context;
  const client = new GSuiteTokenClient({
    config: instance.config,
    logger,
  });

  try {
    let tokenFailCounter = 0;
    await jobState.iterateEntities(
      {
        _type: entities.USER._type,
      },
      async (userEntity) => {
        const email = userEntity.email as string;

        tokenFailCounter += await client.iterateTokens(email, async (token) => {
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
                  _type: createVendorTypeFromName(vendorName),
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
    if (tokenFailCounter > 0) {
      const tokenFailString = `Permission denied reading tokens for ${tokenFailCounter} users. This happens when the credentials provided to JupiterOne are insufficient for reading tokens of users with greater permissions, such as those with the Super Admin role assignment.`;
      logger.info(tokenFailString);
      logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
        description: tokenFailString,
      });
    }
  } catch (err) {
    if (
      err instanceof IntegrationProviderAuthorizationError &&
      authorizationErrorResponses.includes(err.statusText)
    ) {
      context.logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
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
    ingestionSourceId: IngestionSources.TOKENS,
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
