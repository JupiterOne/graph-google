import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './types';
import validateInvocation from './validateInvocation';
import { domainSteps } from './steps/domains';
import { accountSteps } from './steps/account';
import { userSteps } from './steps/users';
import { roleSteps } from './steps/roles';
import { roleAssignmentSteps } from './steps/role_assignments';
import { groupSteps } from './steps/groups';
import { tokenSteps } from './steps/tokens';
import { chromeOSDeviceSteps } from './steps/chrome-os-devices';
import { mobileDeviceSteps } from './steps/mobile_devices';
import { endpointDeviceSteps } from './steps/endpoint-devices';
import { extensionSteps } from './steps/chrome-extensions';
import { ingestionConfig } from './ingestSources';

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
  ingestionConfig,
  integrationSteps: [
    ...domainSteps,
    ...accountSteps,
    ...roleSteps,
    ...roleAssignmentSteps,
    ...userSteps,
    ...groupSteps,
    ...tokenSteps,
    ...chromeOSDeviceSteps,
    ...mobileDeviceSteps,
    ...endpointDeviceSteps,
    ...extensionSteps,
  ],
};
