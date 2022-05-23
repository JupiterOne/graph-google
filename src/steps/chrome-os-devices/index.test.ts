import {
  Recording,
  createMockStepExecutionContext,
} from '@jupiterone/integration-sdk-testing';
import { setupIntegrationRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../types';
import { fetchChromeOSDevices } from '.';
import { integrationConfig } from '../../../test/config';
import { entities } from '../../constants';
import { getMockAccountEntity } from '../../../test/mocks';

describe('#fetchChromeOSDevices', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupIntegrationRecording({
      directory: __dirname,
      name: 'fetchChromeOSDevices',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await context.jobState.addEntity(
      getMockAccountEntity({
        account: {
          googleAccountId: context.instance.config.googleAccountId,
          name: 'mygoogle',
        },
      }),
    );

    await fetchChromeOSDevices(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedEntities.filter(
        (e) => e._type === entities.MOBILE_DEVICE._type,
      ),
    ).toMatchGraphObjectSchema({
      _class: [entities.CHROME_OS_DEVICE._class],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: entities.CHROME_OS_DEVICE._type },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          deviceName: { type: 'string' },
          primary: { type: 'boolean' },
          verified: { type: 'boolean' },
        },
      },
    });
  });
});
