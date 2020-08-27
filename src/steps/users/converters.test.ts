import { createUserEntity } from './converters';
import { getMockUser } from '../../../test/mocks';

describe('#createUserEntity', () => {
  test('should convert to entity', () => {
    expect(createUserEntity(getMockUser())).toMatchSnapshot();
  });
});
