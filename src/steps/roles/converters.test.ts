import {
  createRoleEntity,
  getRolePrivilegeStrings,
  RolePrivilegeStrings,
} from './converters';
import { getMockRole } from '../../../test/mocks';
import { admin_directory_v1 } from 'googleapis';
import Schema$Role = admin_directory_v1.Schema$Role;

describe('#getRolePrivilegeStrings', () => {
  let role: Schema$Role;
  let privileges: RolePrivilegeStrings;

  beforeEach(() => {
    role = getMockRole();
  });

  test('converts role.rolePrivileges to ids and names', () => {
    privileges = getRolePrivilegeStrings(role);
    expect(privileges).toEqual({
      privilegeNames: ['privilege1', 'privilege2'],
      privilegeServiceIds: ['abc', 'def'],
    });
  });

  test('it does not add either falsy ids or names', () => {
    role.rolePrivileges = [{ serviceId: undefined, privilegeName: undefined }];
    privileges = getRolePrivilegeStrings(role);

    expect(privileges).toEqual({
      privilegeNames: [],
      privilegeServiceIds: [],
    });
  });
});

describe('#createRoleEntity', () => {
  const roleId = '123';
  const roleName = 'some role name';
  const description = 'some role description';

  test('should convert to entity', () => {
    expect(
      createRoleEntity({
        roleId,
        roleName,
        isSuperAdminRole: false,
        isSystemRole: false,
        kind: 'kind',
        roleDescription: description,
        rolePrivileges: [
          { serviceId: 'abc', privilegeName: 'privilege1' },
          { serviceId: 'def', privilegeName: 'privilege2' },
        ],
      }),
    ).toMatchSnapshot();
  });
});
