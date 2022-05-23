import {
  Entity,
  createIntegrationEntity,
  Relationship,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { admin_directory_v1 } from 'googleapis';
import { entities } from '../../constants';

export function getTokenKey(data: admin_directory_v1.Schema$Token) {
  return `user:${data.userKey}:client:${data.clientId}`;
}

export function createTokenEntity(data: admin_directory_v1.Schema$Token) {
  const displayName = data.displayText as string;

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getTokenKey(data),
        _type: entities.TOKEN._type,
        _class: [entities.TOKEN._class],
        clientId: data.clientId,
        name: displayName,
        displayName,
        scopes: data.scopes,
        anonymous: data.anonymous,
        nativeApp: data.nativeApp,
        userKey: data.userKey,
      },
    },
  });
}

export function createUserAssignedTokenRelationship(params: {
  userEntity: Entity;
  tokenEntity: Entity;
}): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.ASSIGNED,
    from: params.userEntity,
    to: params.tokenEntity,
  });
}
