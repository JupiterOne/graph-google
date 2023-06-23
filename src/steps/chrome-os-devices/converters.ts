import generateEntityKey from '../../utils/generateEntityKey';
import { admin_directory_v1 } from 'googleapis';
import { entities } from '../../constants';
import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

export function createChromeOSDeviceEntity(
  data: admin_directory_v1.Schema$ChromeOsDevice,
) {
  const deviceName = data.deviceId as string;

  const serialNumber = data.serialNumber;
  const lastSeenOn = parseTimePropertyValue(data.lastSync);

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: generateEntityKey(entities.CHROME_OS_DEVICE._type, deviceName),
        _type: entities.CHROME_OS_DEVICE._type,
        _class: entities.CHROME_OS_DEVICE._class,
        id: deviceName,
        category: 'chrome-os-device',
        make: data.model,
        name: deviceName,
        status: data.status,
        model: data.model,
        serial: data.serialNumber,
        serialNumber,
        version: data.osVersion,
        supportEndDate: data.supportEndDate,
        platformVersion: data.platformVersion,
        firmwareVersion: data.firmwareVersion,
        macAddress: data.macAddress,
        lastSync: lastSeenOn,
        lastSeenOn,
        lastEnrollementTime: parseTimePropertyValue(data.lastEnrollmentTime),
        bootMode: data.bootMode,
        tpmFamily: data.tpmVersionInfo?.family,
        tpmFirmwareVersion: data.tpmVersionInfo?.firmwareVersion,
        tpmManufacturer: data.tpmVersionInfo?.manufacturer,
        tpmSpecLevel: data.tpmVersionInfo?.specLevel,
        tpmModel: data.tpmVersionInfo?.tpmModel,
        tpmVendorId: data.tpmVersionInfo?.vendorSpecific,
      },
    },
  });
}

export function createAccountManagesChromeOSDeviceRelationship(params: {
  accountEntity: Entity;
  deviceEntity: Entity;
}) {
  return createDirectRelationship({
    _class: RelationshipClass.MANAGES,
    from: params.accountEntity,
    to: params.deviceEntity,
  });
}
