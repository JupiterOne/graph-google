import {
  IntegrationStep,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, relationships, Steps } from '../../constants';
import {
  createMobileDeviceEntity,
  createAccountManagesMobileDeviceRelationship,
} from './converters';
import { GSuiteMobileDeviceClient } from '../../gsuite/clients/GSuiteMobileDeviceClient';
import getAccountEntity from '../../utils/getAccountEntity';

export async function fetchMobileDevices(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState, logger } = context;

  const client = new GSuiteMobileDeviceClient({
    config: instance.config,
    logger,
  });

  const accountEntity = await getAccountEntity(context);

  try {
    await client.iterateMobileDevices(async (device) => {
      const deviceEntity = createMobileDeviceEntity(device);

      if (await jobState.hasKey(deviceEntity._key)) {
        logger.info(
          { _key: deviceEntity._key },
          'Duplicate device entity _key found',
        );
        return;
      }

      await context.jobState.addEntity(deviceEntity);
      await context.jobState.addRelationship(
        createAccountManagesMobileDeviceRelationship({
          accountEntity,
          deviceEntity,
        }),
      );
    });
  } catch (err) {
    if (err instanceof IntegrationProviderAuthorizationError) {
      context.logger.info(
        { err },
        'Could not ingest mobile device information.',
      );
      context.logger.publishEvent({
        name: 'missing_scope',
        description: `Could not ingest mobile device data. Missing required scope(s) (scopes=${client.requiredScopes.join(
          ', ',
        )}).  Additionally, the admin email provided in configuration must have the Admin API privilege "Manage Devices and Settings" enabled.`,
      });
      return;
    }

    throw err;
  }
}

export const mobileDeviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'step-fetch-mobile-devices',
    name: 'Mobile Device',
    entities: [entities.MOBILE_DEVICE],
    relationships: [relationships.ACCOUNT_MANAGES_MOBILE_DEVICE],
    executionHandler: fetchMobileDevices,
    dependsOn: [Steps.ACCOUNT],
  },
];
