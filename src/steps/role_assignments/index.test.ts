import {
  Recording,
  createMockStepExecutionContext,
} from '@jupiterone/integration-sdk-testing';
import { setupIntegrationRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../types';
import { fetchRoleAssignments } from '.';
import { fetchUsers } from '../users';
import { createAccount } from '../account';
import { integrationConfig } from '../../../test/config';
import { fetchRoles } from '../roles';
import { relationships } from '../../constants';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';

describe('#fetchRoleAssignments', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupIntegrationRecording({
      directory: __dirname,
      name: 'fetchRoleAssignments',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data and set relationships', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await createAccount(context);
    await fetchUsers(context);
    await fetchRoles(context);
    await fetchRoleAssignments(context);

    const roleAssignmentRelationships = context.jobState.collectedRelationships.filter(
      (r) => r._type === relationships.USER_ASSIGNED_ROLE._type,
    );

    expect(roleAssignmentRelationships.length).toBeGreaterThan(0);
    expect(roleAssignmentRelationships).toMatchDirectRelationshipSchema({
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: relationships.USER_ASSIGNED_ROLE._type },
          _class: { const: RelationshipClass.ASSIGNED },
          roleAssignmentId: { type: 'string' },
          roleId: { type: 'string' },
          assignedTo: { type: 'string' },
          scopeType: { type: 'string' },
          kind: { const: 'admin#directory#roleAssignment' },
          etag: { type: 'string' },
        },
      },
    });
  });
});
