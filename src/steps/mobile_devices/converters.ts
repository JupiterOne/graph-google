import generateEntityKey from '../../utils/generateEntityKey';
import { admin_directory_v1 } from 'googleapis';
import { entities } from '../../constants';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
  Entity,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

function firstOrUndefined(v: any | any[]) {
  return Array.isArray(v) ? v[0] : undefined;
}

export function createMobileDeviceEntity(
  data: admin_directory_v1.Schema$MobileDevice,
) {
  const deviceName = data.deviceId as string;
  const name = firstOrUndefined(data.name);

  return createIntegrationEntity({
    entityData: {
      // The raw data on mobile devices can be very large, so we've removed it.
      source: {},
      assign: {
        _key: generateEntityKey(entities.MOBILE_DEVICE._type, deviceName),
        _type: entities.MOBILE_DEVICE._type,
        _class: entities.MOBILE_DEVICE._class,
        id: deviceName,
        name,
        displayName: name,
        category: 'mobile',
        make: data.model,
        model: data.model,
        serial: data.serialNumber,
        adbStatus: data.adbStatus,
        brand: data.brand,
        deviceCompromisedStatus: data.deviceCompromisedStatus,
        deviceId: data.deviceId,
        email: firstOrUndefined(data.email),
        encryptionStatus: data.encryptionStatus,
        firstSyncOn: parseTimePropertyValue(data.firstSync),
        hardware: data.hardware,
        hardwareId: data.hardwareId,
        imei: data.imei,
        lastSyncOn: parseTimePropertyValue(data.lastSync),
        manufacturer: data.manufacturer,
        ownerName: name,
        os: data.os,
        status: data.status,
        type: data.type,
        wifiMacAddress: data.wifiMacAddress,
        macAddress: data.wifiMacAddress,
        userAgent: data.userAgent,
      },
    },
  });
}

export function createAccountManagesMobileDeviceRelationship(params: {
  accountEntity: Entity;
  deviceEntity: Entity;
}) {
  return createDirectRelationship({
    _class: RelationshipClass.MANAGES,
    from: params.accountEntity,
    to: params.deviceEntity,
  });
}
