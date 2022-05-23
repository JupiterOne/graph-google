import {
  Recording,
  createMockStepExecutionContext,
} from '@jupiterone/integration-sdk-testing';
import { setupIntegrationRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../types';
import { fetchGroups, fetchGroupSettings } from '.';
import { fetchUsers } from '../users';
import { createAccount } from '../account';
import { integrationConfig } from '../../../test/config';
import { entities } from '../../constants';

describe('#fetchGroups', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupIntegrationRecording({
      directory: __dirname,
      name: 'fetchGroups',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });
    await createAccount(context);
    await fetchUsers(context);
    await fetchGroups(context);
    await fetchGroupSettings(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedEntities.filter((e) =>
        e._class.includes('UserGroup'),
      ),
    ).toMatchGraphObjectSchema({
      _class: [entities.GROUP._class],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: entities.GROUP._type },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          id: { type: 'string' },
          vendor: { type: 'string' },
          displayName: { type: 'string' },
          domains: { type: 'array' },
          name: { type: 'string' },
        },
      },
    });

    expect(
      context.jobState.collectedEntities.filter((e) =>
        e._class.includes('Configuration'),
      ),
    ).toMatchGraphObjectSchema({
      _class: [entities.GROUP_SETTINGS._class],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: entities.GROUP_SETTINGS._type },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          id: { type: 'string' },
          email: { type: 'string' },
          displayName: { type: 'string' },
          name: { type: 'string' },
        },
      },
    });
  });

  test('Group Settings - skip over if 400 recieved', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });
    await createAccount(context);
    await fetchUsers(context);

    recording.server.any().intercept((req, res) => {
      res.status(400);
    });
    await fetchGroupSettings(context);
    // Recieved a 400 which means the settings will be skipped for this
    // call and resolve to undefined.
    await expect(fetchGroupSettings(context)).resolves.toBe(undefined);
  });
});
