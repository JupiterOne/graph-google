import { admin_directory_v1, groupssettings_v1 } from 'googleapis';

import { getMockUser } from '../../../test/mocks';
import { createUserEntity } from '../users/converters';
import {
  createGroupEntity,
  createGroupHasGroupMappedRelationship,
  createGroupHasGroupRelationship,
  createGroupHasUserMappedRelationship,
  createGroupHasUserRelationship,
  createGroupSettingsEntity,
} from './converters';

function getMockGroup(
  partial?: admin_directory_v1.Schema$Group,
): admin_directory_v1.Schema$Group {
  return {
    kind: 'admin#directory#group',
    id: '0184mhaj0imamcg',
    etag: 'abc123',
    email: 'randomdistro@jupiterone.io',
    name: 'Random',
    directMembersCount: '5',
    description: 'randomdistro@jupiterone.io distribution list',
    adminCreated: true,
    aliases: ['randomdistro@jupiterone.com', 'randomdistro@jptr.one'],
    nonEditableAliases: ['randomdistro@jupiterone.io.test-google-a.com'],
    ...partial,
  };
}

function getMockGroupSettings(
  partial?: groupssettings_v1.Schema$Groups,
): groupssettings_v1.Schema$Groups {
  return {
    kind: 'groupsSettings#groups',
    email: 'homeschool@thewilliams.ws',
    name: 'homeschool',
    description: '',
    whoCanJoin: 'CAN_REQUEST_TO_JOIN',
    whoCanViewMembership: 'ALL_MANAGERS_CAN_VIEW',
    whoCanViewGroup: 'ALL_MEMBERS_CAN_VIEW',
    whoCanInvite: 'ALL_MANAGERS_CAN_INVITE',
    whoCanAdd: 'ALL_MANAGERS_CAN_ADD',
    allowExternalMembers: 'false',
    whoCanPostMessage: 'ANYONE_CAN_POST',
    allowWebPosting: 'true',
    maxMessageBytes: 26214400,
    isArchived: 'false',
    archiveOnly: 'false',
    messageModerationLevel: 'MODERATE_NONE',
    spamModerationLevel: 'MODERATE',
    replyTo: 'REPLY_TO_IGNORE',
    customReplyTo: '',
    includeCustomFooter: 'false',
    customFooterText: '',
    sendMessageDenyNotification: 'false',
    defaultMessageDenyNotificationText: '',
    showInGroupDirectory: 'false',
    allowGoogleCommunication: 'false',
    membersCanPostAsTheGroup: 'false',
    messageDisplayFont: 'DEFAULT_FONT',
    includeInGlobalAddressList: 'true',
    whoCanLeaveGroup: 'ALL_MEMBERS_CAN_LEAVE',
    whoCanContactOwner: 'ANYONE_CAN_CONTACT',
    whoCanAddReferences: 'NONE',
    whoCanAssignTopics: 'NONE',
    whoCanUnassignTopic: 'NONE',
    whoCanTakeTopics: 'NONE',
    whoCanMarkDuplicate: 'NONE',
    whoCanMarkNoResponseNeeded: 'NONE',
    whoCanMarkFavoriteReplyOnAnyTopic: 'NONE',
    whoCanMarkFavoriteReplyOnOwnTopic: 'NONE',
    whoCanUnmarkFavoriteReplyOnAnyTopic: 'NONE',
    whoCanEnterFreeFormTags: 'NONE',
    whoCanModifyTagsAndCategories: 'NONE',
    favoriteRepliesOnTop: 'true',
    whoCanApproveMembers: 'ALL_MANAGERS_CAN_APPROVE',
    whoCanBanUsers: 'OWNERS_AND_MANAGERS',
    whoCanModifyMembers: 'OWNERS_AND_MANAGERS',
    whoCanApproveMessages: 'OWNERS_AND_MANAGERS',
    whoCanDeleteAnyPost: 'OWNERS_AND_MANAGERS',
    whoCanDeleteTopics: 'OWNERS_AND_MANAGERS',
    whoCanLockTopics: 'OWNERS_AND_MANAGERS',
    whoCanMoveTopicsIn: 'OWNERS_AND_MANAGERS',
    whoCanMoveTopicsOut: 'OWNERS_AND_MANAGERS',
    whoCanPostAnnouncements: 'OWNERS_AND_MANAGERS',
    whoCanHideAbuse: 'NONE',
    whoCanMakeTopicsSticky: 'NONE',
    whoCanModerateMembers: 'OWNERS_AND_MANAGERS',
    whoCanModerateContent: 'OWNERS_AND_MANAGERS',
    whoCanAssistContent: 'NONE',
    customRolesEnabledForSettingsToBeMerged: 'false',
    enableCollaborativeInbox: 'false',
    whoCanDiscoverGroup: 'ALL_MEMBERS_CAN_DISCOVER',
    ...partial,
  };
}

function getMockGroupMemberTypeGroup(
  partial?: admin_directory_v1.Schema$Member,
): admin_directory_v1.Schema$Member {
  return {
    kind: 'admin#directory#member',
    etag: 'abc123',
    id: 'abc123',
    email: 'abc123email@jupiterone.com',
    role: 'MEMBER',
    type: 'GROUP',
    status: 'ACTIVE',
    ...partial,
  };
}

function getMockGroupMemberTypeUser(
  partial?: admin_directory_v1.Schema$Member,
): admin_directory_v1.Schema$Member {
  return {
    kind: 'admin#directory#member',
    etag: 'abc123',
    id: '1234567890',
    email: 'abc123email@jupiterone.com',
    role: 'MEMBER',
    type: 'USER',
    status: 'ACTIVE',
    ...partial,
  };
}

describe('#createGroupEntity', () => {
  test('should convert to entity', () => {
    expect(createGroupEntity(getMockGroup())).toMatchSnapshot();
  });
});

describe('#createGroupHasGroupMappedRelationship', () => {
  test('should convert to mapped relationship', () => {
    expect(
      createGroupHasGroupMappedRelationship(
        createGroupEntity(getMockGroup()),
        getMockGroupMemberTypeGroup(),
      ),
    ).toMatchSnapshot();
  });
});

describe('#createGroupHasUserMappedRelationship', () => {
  test('should convert to mapped relationship', () => {
    expect(
      createGroupHasUserMappedRelationship(
        createGroupEntity(getMockGroup()),
        getMockGroupMemberTypeUser(),
      ),
    ).toMatchSnapshot();
  });
});

describe('#createGroupHasGroupRelationship', () => {
  test('should convert to relationship', () => {
    expect(
      createGroupHasGroupRelationship({
        sourceGroupEntity: createGroupEntity(getMockGroup()),
        targetGroupEntity: createGroupEntity(getMockGroup({ id: '999' })),
        groupMember: getMockGroupMemberTypeGroup(),
      }),
    ).toMatchSnapshot();
  });
});

describe('#createGroupHasUserRelationship', () => {
  test('should convert to relationship', () => {
    expect(
      createGroupHasUserRelationship({
        sourceGroupEntity: createGroupEntity(getMockGroup()),
        targetUserEntity: createUserEntity(getMockUser()),
        groupMember: getMockGroupMemberTypeGroup(),
      }),
    ).toMatchSnapshot();
  });
});

describe('#createGroupSettingsEntity', () => {
  test('should convert to entity', () => {
    expect(
      createGroupSettingsEntity(getMockGroup(), getMockGroupSettings()),
    ).toMatchSnapshot();
  });
});
