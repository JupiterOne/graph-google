import { createRoleEntity } from './converters';

describe.skip('#createRoleEntity', () => {
  test('should convert to entity', () => {
    expect(
      createRoleEntity({
        account: {
          googleAccountId: 'abc123',
          name: 'mygoogleyo',
        },
        domainNames: ['jupiterone.com', 'jupiterone.io'],
        primaryDomain: 'jupiterone.com',
      }),
    ).toMatchSnapshot();
  });
});
