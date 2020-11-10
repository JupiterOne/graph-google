import {
  createGroupEntity,
  createGroupHasGroupMappedRelationship,
  createGroupHasUserMappedRelationship,
  createGroupHasGroupRelationship,
  createGroupHasUserRelationship,
} from './converters';
import { admin_directory_v1 } from 'googleapis';
import { createUserEntity } from '../users/converters';
import { getMockUser } from '../../../test/mocks';

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
    aliases: ['randomdistro@jupiterone.com'],
    nonEditableAliases: ['randomdistro@jupiterone.io.test-google-a.com'],
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
