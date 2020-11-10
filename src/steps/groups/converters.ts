import generateEntityKey from '../../utils/generateEntityKey';
import {
  createIntegrationEntity,
  createDirectRelationship,
  RelationshipClass,
  Entity,
  createMappedRelationship,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { admin_directory_v1 } from 'googleapis';
import { entities, relationships } from '../../constants';

export enum MemberType {
  CUSTOMER = 'CUSTOMER',
  EXTERNAL = 'EXTERNAL',
  GROUP = 'GROUP',
  USER = 'USER',
}

export function createGroupEntity(data: admin_directory_v1.Schema$Group) {
  const groupId = data.id as string;

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: generateEntityKey(entities.GROUP._type, groupId),
        _type: entities.GROUP._type,
        _class: entities.GROUP._class,
        id: groupId,
        adminCreated: data.adminCreated,
        directMembersCount: data.directMembersCount,
        displayName: data.name as string,
        email: data.email,
        kind: data.kind,
        name: data.name,
        description: data.description,
      },
    },
  });
}

export function createGroupHasGroupMappedRelationship(
  sourceGroupEntity: Entity,
  groupMember: admin_directory_v1.Schema$Member,
) {
  const userId = groupMember.id as string;
  if (!userId) return;
  const targetGroupEntityKey = generateEntityKey('group', userId);

  return createMappedRelationship({
    _class: RelationshipClass.HAS,
    _key: `${sourceGroupEntity._key}_has_${targetGroupEntityKey}`,
    _type: relationships.GROUP_HAS_USER._type,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: sourceGroupEntity._key,
      skipTargetCreation: false,
      targetFilterKeys: [['_type', 'id']],
      targetEntity: {
        _type: entities.GROUP._type,
        id: userId,
        email: groupMember.email,
      },
    },
  });
}

export function createGroupHasGroupRelationship(params: {
  sourceGroupEntity: Entity;
  targetGroupEntity: Entity;
  groupMember: admin_directory_v1.Schema$Member;
}) {
  const { sourceGroupEntity, targetGroupEntity, groupMember } = params;

  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: sourceGroupEntity,
    to: targetGroupEntity,
    properties: {
      deliverySettings: groupMember.delivery_settings,
      email: groupMember.email,
      id: groupMember.id,
      kind: groupMember.kind,
      role: groupMember.role,
      status: groupMember.status,
      type: groupMember.type,
    },
  });
}

export function createGroupHasUserMappedRelationship(
  sourceGroupEntity: Entity,
  groupMember: admin_directory_v1.Schema$Member,
) {
  const userId = groupMember.id as string;
  if (!userId) return;
  const targetUserEntityKey = generateEntityKey('user', userId);

  // Create a mapped relationship
  return createMappedRelationship({
    _class: RelationshipClass.HAS,
    _key: `${sourceGroupEntity._key}_has_${targetUserEntityKey}`,
    _type: relationships.GROUP_HAS_USER._type,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: sourceGroupEntity._key,
      skipTargetCreation: false,
      targetFilterKeys: [['_type', 'id']],
      targetEntity: {
        _type: entities.USER._type,
        id: userId,
        email: groupMember.email,
      },
    },
  });
}

export function createGroupHasUserRelationship(params: {
  sourceGroupEntity: Entity;
  targetUserEntity: Entity;
  groupMember: admin_directory_v1.Schema$Member;
}) {
  const { sourceGroupEntity, targetUserEntity, groupMember } = params;

  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: sourceGroupEntity,
    to: targetUserEntity,
    properties: {
      deliverySettings: groupMember.delivery_settings,
      email: groupMember.email,
      id: groupMember.id,
      kind: groupMember.kind,
      role: groupMember.role,
      status: groupMember.status,
      type: groupMember.type,
    },
  });
}

export function createAccountHasGroupRelationship(params: {
  accountEntity: Entity;
  groupEntity: Entity;
}) {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: params.accountEntity,
    to: params.groupEntity,
  });
}
