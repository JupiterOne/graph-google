import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities } from '../../constants';
import { createChromeOSDeviceEntity } from './converters';
import { GSuiteChromeOSDeviceClient } from '../../gsuite/clients/GSuiteChromeOSDeviceClient';

export async function fetchChromeOSDevices(
  context: IntegrationStepContext,
): Promise<void> {
  const client = new GSuiteChromeOSDeviceClient({
    config: context.instance.config,
    logger: context.logger,
  });

  await client.iterateChromeOSDevices(async (device) => {
    await context.jobState.addEntity(createChromeOSDeviceEntity(device));
  });
}

export const chromeOSDeviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'step-fetch-chrome-os-devices',
    name: 'Chrome OS Device',
    entities: [entities.CHROME_OS_DEVICE],
    relationships: [],
    executionHandler: fetchChromeOSDevices,
  },
];
