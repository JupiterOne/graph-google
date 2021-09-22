import { createAccountEntity } from '../account/converters';
import { integrationConfig } from '../../../test/config';
import { setupIntegrationRecording } from '../../../test/recording';
import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchRoles } from './index';
import { entities } from '../../constants';

let recording: Recording;

afterEach(async () => {
  if (recording) await recording.stop();
});

describe('#fetchRoles', () => {
  function getSetupEntities() {
    const accountEntity = createAccountEntity({
      account: {
        googleAccountId: integrationConfig.googleAccountId,
        name: 'mygoogle',
      },
      domainNames: ['jupiterone.com', 'jupiterone.io'],
      primaryDomain: 'jupiterone.com',
    });

    return { accountEntity };
  }

  const schema = {
    properties: {
      isAdmin: {
        description: 'Is the role an administrator role?',
        type: 'boolean',
      },
      isSystem: {
        description: 'Is this a system role?',
        type: 'boolean',
      },
      privilegeIds: {
        description: "The role's privileges",
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
    required: [],
  };

  beforeEach(() => {
    recording = setupIntegrationRecording({
      directory: __dirname,
      name: 'fetchRoles',
    });
  });

  test('should collect data', async () => {
    const { accountEntity } = getSetupEntities();
    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
      entities: [accountEntity],
    });

    await fetchRoles(context);
    const roleEntities = context.jobState.collectedEntities;

    expect(roleEntities.length).toBeGreaterThan(0);
    expect(roleEntities).toMatchGraphObjectSchema({
      _class: entities.ROLE._class,
      schema,
    });

    expect(context.jobState.collectedRelationships).toHaveLength(
      roleEntities.length,
    );
  });
});
