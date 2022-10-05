import {
  Recording,
  createMockStepExecutionContext,
} from '@jupiterone/integration-sdk-testing';

import { setupIntegrationRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../types';
import { integrationConfig } from '../../../test/config';
import { createAccount } from '../account';
import { fetchUserDevices } from '.';
import { entities } from '../../constants';

const tempNewAccountConfig = {
  ...integrationConfig,
  serviceAccountKeyFile: integrationConfig.serviceAccountKeyFile.replace(
    'j1-gc-integration-dev',
    'mineral-liberty-361818',
  ),
  googleAccountId: 'C03yf7qja',
  serviceAccountKeyConfig: {
    ...integrationConfig.serviceAccountKeyConfig,
    project_id: 'mineral-liberty-361818',
  },
};

describe('#fetchUserDevices', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupIntegrationRecording({
      directory: __dirname,
      name: 'fetchUserDevices',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: tempNewAccountConfig,
    });

    await createAccount(context);
    await fetchUserDevices(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedEntities.filter(
        (e) => e._type === entities.DEVICE._type,
      ),
    ).toMatchGraphObjectSchema({
      _class: entities.DEVICE._class,
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: entities.DEVICE._type },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
        },
      },
    });
  });
});
