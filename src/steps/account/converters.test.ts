import { createAccountEntity } from './converters';

describe('#createAccountEntity', () => {
  test('should convert to entity', () => {
    expect(
      createAccountEntity({
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
