import {
  IntegrationStep,
  IntegrationProviderAuthorizationError,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import {
  entities,
  IngestionSources,
  relationships,
  Steps,
} from '../../constants';
import {
  createAccountManagesDeviceRelationship,
  createDeviceEntity,
} from './converters';
import {
  GSuiteDeviceClient,
  VIEW,
} from '../../gsuite/clients/GSuiteDeviceClient';
import getAccountEntity from '../../utils/getAccountEntity';
import { authorizationErrorResponses } from '../../gsuite/clients/GSuiteClient';

export async function fetchUserDevices(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState, instance, logger } = context;

  const client = new GSuiteDeviceClient({
    config: instance.config,
    logger,
  });

  const accountEntity = await getAccountEntity(context);

  try {
    await client.iterateDevices(async (device) => {
      const deviceEntity = createDeviceEntity(device);

      if (await jobState.findEntity(deviceEntity._key)) {
        logger.warn(
          {
            entityKey: deviceEntity._key,
          },
          'Skipping duplicate device entity key',
        );

        return;
      }

      await jobState.addEntity(deviceEntity);

      await context.jobState.addRelationship(
        createAccountManagesDeviceRelationship({
          accountEntity,
          deviceEntity,
        }),
      );
    }, VIEW.user);
  } catch (err) {
    if (
      err instanceof IntegrationProviderAuthorizationError &&
      authorizationErrorResponses.includes(err.statusText)
    ) {
      context.logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
        description: `Could not ingest device data. Missing required scope(s) (scopes=${client.requiredScopes.join(
          ', ',
        )}). Additionally, the admin email provided in configuration must have the Admin API privilege "Manage Devices and Settings" enabled.`,
      });
      return;
    }

    throw err;
  }
}

export const endpointDeviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USER_DEVICES,
    ingestionSourceId: IngestionSources.USER_DEVICES,
    name: 'Fetch User Devices',
    entities: [entities.DEVICE],
    relationships: [relationships.ACCOUNT_MANAGES_DEVICE],
    mappedRelationships: [],
    executionHandler: fetchUserDevices,
    dependsOn: [Steps.ACCOUNT],
  },
];
