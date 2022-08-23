import { cloudidentity_v1 } from 'googleapis';
import {
  Entity,
  RelationshipClass,
  createMappedRelationship,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

import { entities, mappedRelationships } from '../../constants';

export function createAccountManagesDeviceMappedRelationship(params: {
  accountEntity: Entity;
  device: cloudidentity_v1.Schema$GoogleAppsCloudidentityDevicesV1Device;
}) {
  return createMappedRelationship({
    _class: RelationshipClass.MANAGES,
    _type: mappedRelationships.ACCOUNT_MANAGES_DEVICE._type,
    _mapping: {
      sourceEntityKey: params.accountEntity._key,
      relationshipDirection: RelationshipDirection.FORWARD,
      skipTargetCreation: false,
      targetFilterKeys: [['_type', 'deviceId']],
      targetEntity: {
        _type: entities.DEVICE._type,
        // for some reason, the deviceId property doesn't exist in the typings, but it's in responses
        deviceId: (params.device as any).deviceId,
      },
    },
  });
}
