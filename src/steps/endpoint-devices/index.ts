import {
  IntegrationStep,
  IntegrationProviderAuthorizationError,
  IntegrationErrorEventName,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { mappedRelationships, Steps } from '../../constants';
import { createAccountManagesDeviceMappedRelationship } from './converters';
import {
  GSuiteDeviceClient,
  VIEW,
} from '../../gsuite/clients/GSuiteDeviceClient';
import getAccountEntity from '../../utils/getAccountEntity';

export async function fetchUserDevices(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, logger } = context;

  const client = new GSuiteDeviceClient({
    config: instance.config,
    logger,
  });

  const accountEntity = await getAccountEntity(context);

  try {
    await client.iterateDevices(async (device) => {
      await context.jobState.addRelationship(
        createAccountManagesDeviceMappedRelationship({
          accountEntity,
          device,
        }),
      );
    }, VIEW.user);
  } catch (err) {
    if (err instanceof IntegrationProviderAuthorizationError) {
      context.logger.info({ err }, 'Could not ingest device information.');
      context.logger.publishErrorEvent({
        name: IntegrationErrorEventName.MissingPermission,
        description: `Could not ingest device data. Missing required scope(s) (scopes=${client.requiredScopes.join(
          ', ',
        )}).  Additionally, the admin email provided in configuration must have the Admin API privilege "Manage Devices and Settings" enabled.`,
      });
      return;
    }

    throw err;
  }
}

export const endpointDeviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USER_DEVICES,
    name: 'Fetch User Devices',
    entities: [],
    relationships: [],
    mappedRelationships: [mappedRelationships.ACCOUNT_MANAGES_DEVICE],
    executionHandler: fetchUserDevices,
    dependsOn: [Steps.ACCOUNT],
  },
];
