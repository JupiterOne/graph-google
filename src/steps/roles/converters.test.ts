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

    test('converts role.rolePrivileges to ids and names', () => {
      expect(privileges).toEqual([
        {
          id: 'abc',
          name: 'privilege1',
        },
        {
          id: 'def',
          privilegeName: 'privilege2',
        },
      ]);
    });

    test('it does not add falsy ids or names', () => {
      role.rolePrivileges = [
        { serviceId: undefined, privilegeName: 'privilege1' },
        { serviceId: 'def', privilegeName: 'privilege2' },
      ];
      privileges = getRolePrivilegeStrings(role);

      expect(privileges).toEqual([]);
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
