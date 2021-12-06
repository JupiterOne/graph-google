import {
  Recording,
  createMockStepExecutionContext,
} from '@jupiterone/integration-sdk-testing';
import { setupIntegrationRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../types';
import { fetchMobileDevices } from '.';
import { integrationConfig } from '../../../test/config';
import { entities } from '../../constants';

describe('#fetchMobileDevices', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupIntegrationRecording({
      directory: __dirname,
      name: 'fetchMobileDevices',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchMobileDevices(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: entities.MOBILE_DEVICE._class,
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: entities.MOBILE_DEVICE._type },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          deviceName: { type: 'string' },
          model: { type: 'string' },
          email: { type: 'string' },
          status: { type: 'string' },
        },
      },
    });
  });
});
