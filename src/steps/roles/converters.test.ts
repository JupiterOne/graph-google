import { createRoleEntity } from './converters';

describe.skip('#createRoleEntity', () => {
  test('should convert to entity', () => {
    expect(
      createRoleEntity({
        account: {
          googleAccountId: 'abc123',
        },
        role: {} as any, // TODO/Rick
      }),
    ).toMatchSnapshot();
  });
});
