import {
  Recording,
  createMockStepExecutionContext,
} from '@jupiterone/integration-sdk-testing';
import { setupIntegrationRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../types';
import { fetchDomains } from '.';
import { integrationConfig } from '../../../test/config';
import { entities } from '../../constants';

describe('#fetchDomains', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupIntegrationRecording({
      directory: __dirname,
      name: 'fetchDomains',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchDomains(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: [entities.DOMAIN._class],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: entities.DOMAIN._type },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          emailDomain: { type: 'string' },
          primary: { type: 'boolean' },
          verified: { type: 'boolean' },
        },
      },
    });
  });
});
