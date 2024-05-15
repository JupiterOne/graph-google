import { admin_directory_v1, groupssettings_v1 } from 'googleapis';

import {
  createDirectRelationship,
  createIntegrationEntity,
  createMappedRelationship,
  Entity,
  parseStringPropertyValue,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

import { entities, relationships } from '../../constants';
import generateEntityKey from '../../utils/generateEntityKey';

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
        aliases: data.aliases,
        nonEditableAliases: data.nonEditableAliases,
      },
    },
  });
}

/**
 * Creates an entity with the properties of a group's settings. Note that
 * properties marked as deprecated in the documentation are not included and
 * users should reference the replacement properties.
 *
 * @param group the group data
 * @param data the group settings data
 */
export function createGroupSettingsEntity(
  group: admin_directory_v1.Schema$Group,
  data: groupssettings_v1.Schema$Groups,
) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: generateEntityKey(entities.GROUP_SETTINGS._type, group.id!),
        _type: entities.GROUP_SETTINGS._type,
        _class: entities.GROUP_SETTINGS._class,
        id: group.id!,
        name: group.email!,
        displayName: group.email!,
        email: data.email!,
        description: data.description,
        webLink: `https://admin.google.com/ac/groups/${group.id}/settings`,

        // Deprecated properties should not be included below
        // See https://developers.google.com/admin-sdk/groups-settings/v1/reference/groups#json

        // TODO: https://github.com/JupiterOne/sdk/pull/450 will avoid
        // `parseStringPropertyValue(data.prop!)` (use of !)
        whoCanJoin: data.whoCanJoin,
        whoCanViewMembership: data.whoCanViewMembership,
        whoCanViewGroup: data.whoCanViewGroup,
        allowExternalMembers: parseStringPropertyValue(
          data.allowExternalMembers!,
        ),
        whoCanPostMessage: data.whoCanPostMessage,
        allowWebPosting: parseStringPropertyValue(data.allowWebPosting!),
        primaryLanguage: data.primaryLanguage,
        isArchived: parseStringPropertyValue(data.isArchived!),
        archiveOnly: parseStringPropertyValue(data.archiveOnly!),
        messageModerationLevel: data.messageModerationLevel,
        spamModerationLevel: data.spamModerationLevel,
        replyTo: data.replyTo,
        customReplyTo: data.customReplyTo,
        includeCustomFooter: parseStringPropertyValue(
          data.includeCustomFooter!,
        ),
        customFooterText: data.customFooterText,
        sendMessageDenyNotification: parseStringPropertyValue(
          data.sendMessageDenyNotification!,
        ),
        defaultMessageDenyNotificationText:
          data.defaultMessageDenyNotificationText,
        membersCanPostAsTheGroup: parseStringPropertyValue(
          data.membersCanPostAsTheGroup!,
        ),
        includeInGlobalAddressList: parseStringPropertyValue(
          data.includeInGlobalAddressList!,
        ),
        whoCanLeaveGroup: data.whoCanLeaveGroup,
        whoCanContactOwner: data.whoCanContactOwner,
        favoriteRepliesOnTop: parseStringPropertyValue(
          data.favoriteRepliesOnTop!,
        ),
        whoCanApproveMembers: data.whoCanApproveMembers,
        whoCanBanUsers: data.whoCanBanUsers,
        whoCanModerateMembers: data.whoCanModerateMembers,
        whoCanModerateContent: data.whoCanModerateContent,
        whoCanAssistContent: data.whoCanAssistContent,
        customRolesEnabledForSettingsToBeMerged: parseStringPropertyValue(
          data.customRolesEnabledForSettingsToBeMerged!,
        ),
        enableCollaborativeInbox: parseStringPropertyValue(
          data.enableCollaborativeInbox!,
        ),
        whoCanDiscoverGroup: data.whoCanDiscoverGroup,
      },
    },
  });
}

export function createGroupHasGroupMappedRelationship(
  sourceGroupEntity: Entity,
  groupMember: admin_directory_v1.Schema$Member,
) {
  const targetGroupEntityKey = generateEntityKey(
    'group',
    groupMember.email as string,
  );

  return createMappedRelationship({
    _class: RelationshipClass.HAS,
    _key: `${sourceGroupEntity._key}_has_${targetGroupEntityKey}`,
    _type: relationships.GROUP_HAS_USER._type,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: sourceGroupEntity._key,
      skipTargetCreation: false,
      targetFilterKeys: [['_type', 'email']],
      targetEntity: {
        _type: entities.GROUP._type,
        name: groupMember.email,
        displayName: groupMember.email as string,
        email: groupMember.email,
      },
    },
    properties: {
      email: groupMember.email,
      id: groupMember.id,
      kind: groupMember.kind,
      role: groupMember.role,
      status: groupMember.status,
      type: groupMember.type,
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
  const targetUserEntityKey = generateEntityKey(
    'user',
    groupMember.email as string,
  );

  // Create a mapped relationship
  return createMappedRelationship({
    _class: RelationshipClass.HAS,
    _key: `${sourceGroupEntity._key}_has_${targetUserEntityKey}`,
    _type: relationships.GROUP_HAS_USER._type,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: sourceGroupEntity._key,
      skipTargetCreation: false,
      targetFilterKeys: [['_type', 'email']],
      targetEntity: {
        _type: entities.USER._type,
        name: groupMember.email,
        displayName: groupMember.email as string,
        email: groupMember.email,
      },
    },
    properties: {
      email: groupMember.email,
      id: groupMember.id,
      kind: groupMember.kind,
      role: groupMember.role,
      status: groupMember.status,
      type: groupMember.type,
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
