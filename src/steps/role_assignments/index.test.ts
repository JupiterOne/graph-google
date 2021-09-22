import { integrationConfig } from '../../../test/config';
import { setupIntegrationRecording } from '../../../test/recording';
import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchRoleAssignments } from './index';
import { fetchRoles } from '../roles';
import { createAccountEntity } from '../account/converters';
import { fetchUsers } from '../users';

let recording: Recording;

afterEach(async () => {
  if (recording) await recording.stop();
});

describe.skip('#fetchRoleAssignments', () => {
  describe('#fetchRoleAssignments', () => {
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

      await fetchUsers(context);
      recording.server.any().intercept((req, res) => {
        res.status(400);
      });
      await fetchRoles(context);
      await fetchRoleAssignments(context);

      const entities = context.jobState.collectedEntities;
      const relationships = context.jobState.collectedRelationships;
      console.log(
        'context.jobState.collectedRelationships',
        context.jobState.collectedRelationships,
      );

      expect(entities.length).toBeGreaterThan(0);
      expect(relationships.length).toBeGreaterThan(0);
      expect(relationships).toMatchDirectRelationshipSchema({});

      // expect(context.jobState.collectedRelationships).toHaveLength(roleEntities.length);
    });
  });
});
