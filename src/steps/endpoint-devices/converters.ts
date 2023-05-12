import generateEntityKey from '../../utils/generateEntityKey';
import { cloudidentity_v1 } from 'googleapis';
import { entities, relationships } from '../../constants';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
  Entity,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

export function createDeviceEntity(
  data: cloudidentity_v1.Schema$GoogleAppsCloudidentityDevicesV1Device,
) {
  const serialNumber = data.serialNumber || '';
  const lastSeenOn = parseTimePropertyValue(data.lastSyncTime);

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: generateEntityKey(entities.DEVICE._type, data.name),
        _type: entities.DEVICE._type,
        _class: entities.DEVICE._class,
        id: data.name!,
        name: data.name,
        displayName: data.name!,
        createdOn: parseTimePropertyValue(data.createTime),
        lastSyncedOn: lastSeenOn,
        ownerType: data.ownerType,
        model: data.model || '',
        osVersion: data.osVersion,
        deviceType: data.deviceType,
        securityPatchedOn: parseTimePropertyValue(data.securityPatchTime),
        encryptionState: data.encryptionState,
        encrypted: data.encryptionState === 'ENCRYPTED',
        category: 'endpoint',
        make: data.manufacturer || '',
        serial: serialNumber,
        serialNumber,
        // Monkeypatch: deviceId field is not included in type but is included in response.
        // ** deviceId is a required field in J1 Device schema.
        deviceId: (data as any).deviceId || '',
        byod: data.ownerType === 'BYOD',
        assetTag: data.assetTag,
        imei: data.imei,
        meid: data.meid,
        wifiMacAddresses: data.wifiMacAddresses,
        macAddress: data.wifiMacAddresses,
        networkOperator: data.networkOperator,
        releaseVersion: data.releaseVersion,
        brand: data.brand,
        buildNumber: data.buildNumber,
        kernelVersion: data.kernelVersion,
        basebandVersion: data.basebandVersion,
        enabledDeveloperOptions: data.enabledDeveloperOptions,
        otherAccounts: data.otherAccounts,
        enabledUsbDebugging: data.enabledUsbDebugging,
        bootloaderVersion: data.bootloaderVersion,
        managementState: data.managementState,
        compromisedState: data.compromisedState,
        androidEnabledUnknownSources:
          data.androidSpecificAttributes?.enabledUnknownSources,
        androidSupportsWorkProfile:
          data.androidSpecificAttributes?.supportsWorkProfile,
        androidOwnerProfileAccount:
          data.androidSpecificAttributes?.ownerProfileAccount,
        androidOwnershipPrivilege:
          data.androidSpecificAttributes?.ownershipPrivilege,
      },
    },
  });
}

export function createAccountManagesDeviceRelationship(params: {
  accountEntity: Entity;
  deviceEntity: Entity;
}) {
  return createDirectRelationship({
    _class: relationships.ACCOUNT_MANAGES_DEVICE._class,
    from: params.accountEntity,
    to: params.deviceEntity,
  });
}
