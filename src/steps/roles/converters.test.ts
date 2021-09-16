import { createRoleEntity } from './converters';

describe('#createRoleEntity', () => {
  test('should convert to entity', () => {
    expect(
      createRoleEntity({
        account: {
          googleAccountId: 'abc123',
        },
        role: { roleId: '123', roleName: 'some role' },
      }),
    ).toMatchSnapshot();
  });
});
