import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities } from '../../constants';
import {
  createMobileDeviceEntity,
  createAccountManagesMobileDeviceRelationship,
} from './converters';
import { GSuiteMobileDeviceClient } from '../../gsuite/clients/GSuiteMobileDeviceClient';
import getAccountEntity from '../../utils/getAccountEntity';

export async function fetchMobileDevices(
  context: IntegrationStepContext,
): Promise<void> {
  const client = new GSuiteMobileDeviceClient({
    config: context.instance.config,
    logger: context.logger,
  });

  await client.iterateMobileDevices(async (device) => {
    const deviceEntity = await context.jobState.addEntity(
      createMobileDeviceEntity(device),
    );
    const accountEntity = await getAccountEntity(context);
    await context.jobState.addRelationship(
      createAccountManagesMobileDeviceRelationship({
        accountEntity,
        deviceEntity,
      }),
    );
  });
}

export const mobileDeviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'step-fetch-mobile-devices',
    name: 'Mobile Device',
    entities: [entities.MOBILE_DEVICE],
    relationships: [],
    executionHandler: fetchMobileDevices,
  },
];
