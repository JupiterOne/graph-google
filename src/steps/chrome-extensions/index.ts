import {
  Entity,
  IntegrationErrorEventName,
  IntegrationProviderAuthorizationError,
  IntegrationStep,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, relationships, SetDataKeys, Steps } from '../../constants';
import {
  createChromeExtensionEntity,
  createChromeOsDeviceInstalledChromeExtensionRelationship,
} from './converters';
import { GSuiteInstalledAppsClient } from '../../gsuite/clients/GSuiteInstalledAppsClient';
import { chromemanagement_v1 } from 'googleapis';
import { RawInstalledAppEntity } from './types';

const APP_EXTENSION_TYPE = 'EXTENSION';

type ChromeExtensionEntityKey = string;
type DeviceId = string;

export async function fetchChromeExtensions(
  context: IntegrationStepContext,
): Promise<void> {
  const client = new GSuiteInstalledAppsClient({
    config: context.instance.config,
    logger: context.logger,
  });

  const deviceExtensionsMap = new Map<DeviceId, ChromeExtensionEntityKey[]>();

  try {
    await client.iterateInstalledApps(async (app) => {
      if (!isValidInstalledAppEntity(app)) {
        return;
      }
      if (app.appType === APP_EXTENSION_TYPE) {
        const chromeExtensionEntity = await context.jobState.addEntity(
          createChromeExtensionEntity(app),
        );
        await client.iterateInstalledAppDevices(app.appId, (device) => {
          const deviceId = device.deviceId;
          if (!deviceId) {
            return;
          }
          deviceExtensionsMap.set(deviceId, [
            ...(deviceExtensionsMap.get(deviceId) || []),
            chromeExtensionEntity._key,
          ]);
        });
      }
    });
  } catch (err) {
    if (err instanceof IntegrationProviderAuthorizationError) {
      context.logger.info(
        { err },
        'Could not ingest chrome browser extensions information.',
      );
      context.logger.publishErrorEvent({
        name: IntegrationErrorEventName.MissingPermission,
        description: `Could not ingest chrome browser extension data. Missing required scope(s) (scopes=${client.requiredScopes.join(
          ', ',
        )}).  Additionally, the admin email provided in configuration must have the Admin API privilege "Chrome Management" enabled.`,
      });
      return;
    }

    throw err;
  }

  await context.jobState.setData(
    SetDataKeys.DEVICE_EXTENSIONS_MAP,
    deviceExtensionsMap,
  );
}

export async function buildDeviceExtensionRelationships(
  context: IntegrationStepContext,
): Promise<void> {
  const deviceExtensionsMap = (await context.jobState.getData(
    SetDataKeys.DEVICE_EXTENSIONS_MAP,
  )) as Map<DeviceId, ChromeExtensionEntityKey[]>;

  await context.jobState.iterateEntities(
    {
      _type: entities.CHROME_OS_DEVICE._type,
    },
    async (deviceEntity) => {
      const deviceId = deviceEntity.deviceId as string;
      if (!deviceId) {
        return;
      }

      const extensionKeys = deviceExtensionsMap.get(deviceId) || [];

      const chromeExtensionEntities = (
        await Promise.all(
          extensionKeys.map(async (key) => {
            return await context.jobState.findEntity(key);
          }),
        )
      ).filter(Boolean) as Entity[];

      await context.jobState.addRelationships(
        chromeExtensionEntities.map((extensionEntity) =>
          createChromeOsDeviceInstalledChromeExtensionRelationship({
            deviceEntity,
            extensionEntity,
          }),
        ),
      );
    },
  );
}

function isValidInstalledAppEntity(
  app: chromemanagement_v1.Schema$GoogleChromeManagementV1InstalledApp,
): app is RawInstalledAppEntity {
  return 'appId' in app && typeof app.appId === 'string';
}

export const extensionSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CHROME_EXTENSIONS,
    name: 'Chrome Extensions',
    entities: [entities.CHROME_EXTENSION],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchChromeExtensions,
  },
  {
    id: Steps.BUILD_DEVICE_EXTENSION_RELATIONSHIPS,
    name: 'Build Device and Extension Relationship',
    entities: [],
    relationships: [relationships.CHROME_OS_DEVICE_INSTALLED_CHROME_EXTENSION],
    dependsOn: [Steps.CHROME_OS_DEVICE, Steps.CHROME_EXTENSIONS],
    executionHandler: buildDeviceExtensionRelationships,
  },
];
