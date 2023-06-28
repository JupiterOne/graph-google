import generateEntityKey from '../../utils/generateEntityKey';
import { entities } from '../../constants';
import {
  Entity,
  RelationshipClass,
  createDirectRelationship,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { RawInstalledAppEntity } from './types';

export function createChromeExtensionEntity(data: RawInstalledAppEntity) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: generateEntityKey(entities.CHROME_EXTENSION._type, data.appId),
        _type: entities.CHROME_EXTENSION._type,
        _class: entities.CHROME_EXTENSION._class,
        id: data.appId,
        displayName: data.displayName || data.appId,
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
