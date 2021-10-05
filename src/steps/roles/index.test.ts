import { createAccountEntity } from '../account/converters';
import { integrationConfig } from '../../../test/config';
import { setupIntegrationRecording } from '../../../test/recording';
import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchRoles } from './index';
import { entities } from '../../constants';

describe('#fetchRoles', () => {
  let properties = {};
  let recording: Recording;

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

  beforeEach(() => {
    properties = {
      systemRole: { type: 'boolean' },
      superAdmin: { type: 'boolean' },
      privilegeServiceIds: { type: 'array', items: { type: 'string' } },
      privilegeNames: { type: 'array', items: { type: 'string' } },
    };
    recording = setupIntegrationRecording({
      directory: __dirname,
      name: 'fetchRoles',
    });
  });

  afterEach(async () => {
    if (recording) await recording.stop();
  });

  test('should collect all data using a valid schema', async () => {
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
      schema: { properties },
    });

    expect(context.jobState.collectedRelationships).toHaveLength(
      roleEntities.length,
    );
  });
});
