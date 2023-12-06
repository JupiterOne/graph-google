import generateEntityKey from '../../utils/generateEntityKey';
import { entities } from '../../constants';
import {
  Entity,
  RelationshipClass,
  createDirectRelationship,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { chromemanagement_v1 } from 'googleapis';

export function createChromeExtensionEntity(
  data: chromemanagement_v1.Schema$GoogleChromeManagementV1InstalledApp,
) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: createChromeExtensionEntityKey(data),
        _type: entities.CHROME_EXTENSION._type,
        _class: entities.CHROME_EXTENSION._class,
        id: data.appId || 'UNKNOWN',
        displayName: data.displayName || data.appId || 'UNKNOWN',
        name: data.displayName,
        description: data.description,
        installType: data.appInstallType,
        source: data.appSource,
        type: data.appType,
        deviceCount: data.browserDeviceCount ?? null,
        disabled: data.disabled,
        uri: data.homepageUri,
        permissions: data.permissions?.join(',') || '',
      },
    },
  });
}

export const createChromeExtensionEntityKey = (
  data: chromemanagement_v1.Schema$GoogleChromeManagementV1InstalledApp,
): string => {
  return generateEntityKey(
    entities.CHROME_EXTENSION._type,
    `${data.appId}_${data.appInstallType}_${data.appSource}`,
  );
};

export function createChromeOsDeviceInstalledChromeExtensionRelationship(params: {
  deviceEntity: Entity;
  extensionEntity: Entity;
}) {
  return createDirectRelationship({
    _class: RelationshipClass.INSTALLED,
    from: params.deviceEntity,
    to: params.extensionEntity,
  });
}
