import GSuiteClient from './GSuiteClient';
import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';
import { admin_directory_v1 } from 'googleapis';
import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';

import { getMockIntegrationConfig } from '../../../test/config';

function getMockCredentials(): Credentials {
  return {};
}

describe('GSuiteClient.getAuthenticatedServiceClient', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should allow authorizing a new client', async () => {
    const instanceConfig = getMockIntegrationConfig();

    jest.spyOn(google.auth, 'JWT').mockReturnValueOnce({
      authorize: () => Promise.resolve(getMockCredentials()),
    } as any);

    const gsuiteClient = new GSuiteClient({
      config: instanceConfig,
      logger: createMockIntegrationLogger(),
    });

    const client = await gsuiteClient.getAuthenticatedServiceClient();

    expect(client instanceof admin_directory_v1.Admin).toEqual(true);
    expect(gsuiteClient.requiredScopes).toEqual([
      'https://www.googleapis.com/auth/admin.directory.user.readonly',
      'https://www.googleapis.com/auth/admin.directory.group.readonly',
      'https://www.googleapis.com/auth/admin.directory.domain.readonly',
    ]);
  });

  test('should allow passing custom oauth scopes and dedup', async () => {
    const instanceConfig = getMockIntegrationConfig();

    jest.spyOn(google.auth, 'JWT').mockReturnValueOnce({
      authorize: () => Promise.resolve(getMockCredentials()),
    } as any);

    const gsuiteClient = new GSuiteClient({
      config: instanceConfig,
      logger: createMockIntegrationLogger(),
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.group.readonly',
        'https://www.googleapis.com/auth/admin.directory.user.security',
      ],
    });

    const client = await gsuiteClient.getAuthenticatedServiceClient();

    expect(client instanceof admin_directory_v1.Admin).toEqual(true);
    expect(gsuiteClient.requiredScopes).toEqual([
      'https://www.googleapis.com/auth/admin.directory.user.readonly',
      'https://www.googleapis.com/auth/admin.directory.group.readonly',
      'https://www.googleapis.com/auth/admin.directory.domain.readonly',
      'https://www.googleapis.com/auth/admin.directory.user.security',
    ]);
  });

  test('should throw if authorize function throws', async () => {
    const instanceConfig = getMockIntegrationConfig();
    const mockResponseError = new Error('Mock error authorizing');

    (mockResponseError as any).response = {
      data: {
        error: 'unauthorized_client',
        error_description:
          'Client is unauthorized to retrieve access tokens using this method, or client not authorized for any of the scopes requested.',
      },
      status: 401,
      statusText: 'Unauthorized',
      request: { responseURL: 'https://www.googleapis.com/oauth2/v4/token' },
    };

    jest.spyOn(google.auth, 'JWT').mockReturnValueOnce({
      authorize: () => Promise.reject(mockResponseError),
    } as any);

    const gsuiteClient = new GSuiteClient({
      config: instanceConfig,
      logger: createMockIntegrationLogger(),
    });

    await expect(
      gsuiteClient.getAuthenticatedServiceClient(),
    ).rejects.toThrowError(
      'Provider authorization failed at https://www.googleapis.com/oauth2/v4/token: 401 Client is unauthorized to retrieve access tokens using this method, or client not authorized for any of the scopes requested. Please ensure that your API client in GSuite has the correct scopes. See the GSuite integration docs here: https://github.com/JupiterOne/graph-google/blob/master/docs/jupiterone.md#admin-api-enablement (scopes=https://www.googleapis.com/auth/admin.directory.user.readonly, https://www.googleapis.com/auth/admin.directory.group.readonly, https://www.googleapis.com/auth/admin.directory.domain.readonly)',
    );
  });

  test('should reuse existing client if called twice', async () => {
    const instanceConfig = getMockIntegrationConfig();

    const authorizeMockFn = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(getMockCredentials()))
      .mockRejectedValueOnce(new Error('Should not call twice'));

    jest.spyOn(google.auth, 'JWT').mockReturnValue({
      authorize: authorizeMockFn,
    } as any);

    const gsuiteClient = new GSuiteClient({
      config: instanceConfig,
      logger: createMockIntegrationLogger(),
    });

    const client = await gsuiteClient.getAuthenticatedServiceClient();
    const client1 = await gsuiteClient.getAuthenticatedServiceClient();

    expect(client instanceof admin_directory_v1.Admin).toEqual(true);
    expect(client1 instanceof admin_directory_v1.Admin).toEqual(true);
    expect(authorizeMockFn).toHaveBeenCalledTimes(1);
    expect(client).toBe(client1);
  });
});
