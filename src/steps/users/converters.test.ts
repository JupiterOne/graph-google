import { getMockUser } from '../../../test/mocks';
import {
  createUserEntity,
  getCollectionAsFlattendFields,
  convertCustomSchemas,
} from './converters';

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

describe('#convertCustomSchemas', () => {
  const original: any = {
    string: 'a',
    array: ['a', 'b', 'c'],
    number: 123,
    aGoodTime: '2019-04-23T18:06:05Z',
    another_time: '2019-04-23T18:06:05Z',
    someDate: '2019-04-23T18:06:05Z',
    occurredOn: '2019-04-23T18:06:05Z',
    updatedAt: '2019-04-23T18:06:05Z',
    aBadTime: 'do I look like time to you?',
    anUndefinedTime: undefined,
    aNullTime: null,
    name: 'you',
    object: {
      name: 'me',
      firstLevel: {
        name: 'me again',
        secondLevel: {
          thirdLevel: 'hey',
        },
      },
      array: [
        {
          k: 'v',
        },
        {
          k: 'v',
        },
      ],
    },
    objectArray: [
      {
        wut: 'no matter',
      },
    ],
    arrayOfNull: [null],
    arrayOfUndefined: [undefined],
  };

  const converted: any = {
    string: 'a',
    array: ['a', 'b', 'c'],
    number: 123,
    aGoodTime: '2019-04-23T18:06:05Z',
    another_time: '2019-04-23T18:06:05Z',
    someDate: '2019-04-23T18:06:05Z',
    occurredOn: '2019-04-23T18:06:05Z',
    updatedAt: '2019-04-23T18:06:05Z',
    aBadTime: 'do I look like time to you?',
    name: 'you',
    'object.name': 'me',
    'object.firstLevel.name': 'me again',
    'object.firstLevel.secondLevel.thirdLevel': 'hey',
    'object.array': original.object.array.map(
      (a) => typeof a === 'object' && JSON.stringify(a),
    ),
    objectArray: original.objectArray.map(
      (a) => typeof a === 'object' && JSON.stringify(a),
    ),
    arrayOfNull: [null],
    arrayOfUndefined: [undefined],
    anUndefinedTime: undefined,
    aNullTime: null,
  };

  const originalWithoutPrefix: any = {
    one: 'i',
    two: 'am',
    three: {
      four: 'test',
    },
  };

  const convertedWithPrefix: any = {
    'test.one': 'i',
    'test.two': 'am',
    'test.three.four': 'test',
  };

  test('default options', () => {
    expect(convertCustomSchemas(original)).toEqual(converted);
  });

  test('expected prefix', () => {
    expect(convertCustomSchemas(originalWithoutPrefix, 'test')).toEqual(
      convertedWithPrefix,
    );
  });
});
