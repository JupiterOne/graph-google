import { admin_directory_v1 } from 'googleapis';
import {
  createTokenEntity,
  createUserTrustsTokenRelationship,
} from './converters';
import { getMockUser } from '../../../test/mocks';
import { createUserEntity } from '../users/converters';

function getMockToken(): admin_directory_v1.Schema$Token {
  return {
    kind: 'admin#directory#token',
    etag: 'abc123',
    clientId: '1234-abcdefg.apps.googleusercontent.com',
    displayText: 'Slack',
    anonymous: false,
    nativeApp: false,
    userKey: '123456789123456789',
    scopes: [
      'https://www.googleapis.com/auth/activity',
      'https://www.googleapis.com/auth/drive.activity',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid',
      'https://www.googleapis.com/auth/drive',
    ],
  };
}

describe('#createTokenEntity', () => {
  test('should convert to entity', () => {
    expect(createTokenEntity(getMockToken())).toMatchSnapshot();
  });
});

describe('#createUserTrustsTokenRelationship', () => {
  test('should convert to relationship', () => {
    expect(
      createUserTrustsTokenRelationship({
        userEntity: createUserEntity(getMockUser()),
        tokenEntity: createTokenEntity(getMockToken()),
      }),
    ).toMatchSnapshot();
  });
});
