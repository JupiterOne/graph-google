import {
  IntegrationErrorEventName,
  IntegrationProviderAuthorizationError,
  IntegrationStep,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, relationships, Steps } from '../../constants';
import {
  createAccountManagesChromeOSDeviceRelationship,
  createChromeOSDeviceEntity,
} from './converters';
import { GSuiteChromeOSDeviceClient } from '../../gsuite/clients/GSuiteChromeOSDeviceClient';
import getAccountEntity from '../../utils/getAccountEntity';

export async function fetchChromeOSDevices(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState, logger } = context;

  const client = new GSuiteChromeOSDeviceClient({
    config: instance.config,
    logger: logger,
  });

  const accountEntity = await getAccountEntity(context);

  try {
    await client.iterateChromeOSDevices(async (device) => {
      const deviceEntity = createChromeOSDeviceEntity(device);

      if (await jobState.hasKey(deviceEntity._key)) {
        logger.info(
          { _key: deviceEntity._key },
          'Duplicate device entity _key found',
        );
        return;
      }

      await context.jobState.addEntity(deviceEntity);
      await context.jobState.addRelationship(
        createAccountManagesChromeOSDeviceRelationship({
          accountEntity,
          deviceEntity,
        }),
      );
    });
  } catch (err) {
    if (err instanceof IntegrationProviderAuthorizationError) {
      context.logger.info(
        { err },
        'Could not ingest chrome os device information.',
      );
      context.logger.publishErrorEvent({
        name: IntegrationErrorEventName.MissingPermission,
        description: `Could not ingest chrome device data. Missing required scope(s) (scopes=${client.requiredScopes.join(
          ', ',
        )}).  Additionally, the admin email provided in configuration must have the Admin API privilege "Manage Devices and Settings" enabled.`,
      });
      return;
    }

    throw err;
  }
}

export const chromeOSDeviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CHROME_OS_DEVICE,
    name: 'Chrome OS Device',
    entities: [entities.CHROME_OS_DEVICE],
    relationships: [relationships.ACCOUNT_MANAGES_CHROME_OS_DEVICE],
    executionHandler: fetchChromeOSDevices,
    dependsOn: [Steps.ACCOUNT],
  },
];
