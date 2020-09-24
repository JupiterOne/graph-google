import { getMockUser } from '../../../test/mocks';
import { createUserEntity, getCollectionAsFlattendFields } from './converters';

describe('#createUserEntity', () => {
  test('should convert to entity', () => {
    expect(createUserEntity(getMockUser())).toMatchSnapshot();
  });
});

describe('#getCollectionAsFlattenedFields', () => {
  getCollectionAsFlattendFields({
    collection: [
      {
        type: 'work',
      },
    ],
    suffix: 'Address',
    valueMethod: 'formatted',
  });
});
