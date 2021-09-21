import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './types';
import validateInvocation from './validateInvocation';
import { domainSteps } from './steps/domains';
import { accountSteps } from './steps/account';
import { userSteps } from './steps/users';
import { roleSteps } from './steps/roles';
import { groupSteps } from './steps/groups';
import { tokenSteps } from './steps/tokens';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields: {
    googleAccountId: {
      type: 'string',
    },
    domainAdminEmail: {
      type: 'string',
    },
    serviceAccountKeyFile: {
      type: 'string',
      mask: true,
    },
  },
  validateInvocation,
  integrationSteps: [
    ...domainSteps,
    ...roleSteps,
    ...accountSteps,
    ...userSteps,
    ...groupSteps,
    ...tokenSteps,
  ],
};
