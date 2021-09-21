import { createRoleEntity } from './converters';

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
