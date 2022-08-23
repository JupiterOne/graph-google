import {
  ExplicitRelationship,
  MappedRelationship,
} from '@jupiterone/integration-sdk-core';
import {
  Recording,
  createMockStepExecutionContext,
  filterGraphObjects,
} from '@jupiterone/integration-sdk-testing';

import { setupIntegrationRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../types';
import { integrationConfig } from '../../../test/config';
import { createAccount } from '../account';
import { fetchUserDevices } from '.';

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

    const filteredRelationships = filterGraphObjects(
      context.jobState.collectedRelationships,
      (r) => !r._mapping,
    ) as {
      targets: ExplicitRelationship[];
      rest: MappedRelationship[];
    };

    const mappedRelationships = filteredRelationships.rest;
    expect(mappedRelationships.length).toBeGreaterThan(0);

    expect(
      mappedRelationships
        .filter((e) => e._type === 'google_account_manages_user_endpoint')
        .some(
          (mappedRelationship) =>
            mappedRelationship._key ===
            'google_account_C03yf7qja|manages|FORWARD:_type=user_endpoint:deviceId=067b8390-538b-48ef-9b94-d3362f86dd1e',
        ),
    ).toBe(true);
  });
});
