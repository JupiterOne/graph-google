import { Credentials } from 'google-auth-library';
import { admin_directory_v1, google } from 'googleapis';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';
import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';

import { getMockIntegrationConfig } from '../../../test/config';
import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams, withErrorHandling } from './GSuiteClient';

function getMockCredentials(): Credentials {
  return {};
}

class TestGSuiteAdminClient extends GSuiteAdminClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.user.readonly',
        'https://www.googleapis.com/auth/admin.directory.group.readonly',
        'https://www.googleapis.com/auth/admin.directory.domain.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }
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

    const gsuiteClient = new TestGSuiteAdminClient({
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

    const gsuiteClient = new TestGSuiteAdminClient({
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

    const gsuiteClient = new TestGSuiteAdminClient({
      config: instanceConfig,
      logger: createMockIntegrationLogger(),
    });

    await expect(
      gsuiteClient.getAuthenticatedServiceClient(),
    ).rejects.toThrowError(
      'Provider authorization failed at https://www.googleapis.com/oauth2/v4/token: 401 Client is unauthorized to retrieve access tokens using this method, or client not authorized for any of the scopes requested. Please ensure that your API client in GSuite has the correct scopes. See the GSuite integration docs here: https://github.com/JupiterOne/graph-google/blob/main/docs/jupiterone.md#in-google-workspace (requiredScopes=https://www.googleapis.com/auth/admin.directory.user.readonly, https://www.googleapis.com/auth/admin.directory.group.readonly, https://www.googleapis.com/auth/admin.directory.domain.readonly)',
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

    const gsuiteClient = new TestGSuiteAdminClient({
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

describe('withErrorHandling', () => {
  [IntegrationProviderAuthorizationError, IntegrationProviderAPIError].forEach(
    (J1Error) => {
      test('should forward on errors that have already been handled', async () => {
        const mockForbiddenError = new J1Error({
          endpoint: 'test endpoint',
          status: 999,
          statusText: 'test',
        }) as any;
        const executionHandler = jest
          .fn()
          .mockRejectedValue(mockForbiddenError);
        const handledFunction = withErrorHandling(executionHandler);
        await expect(handledFunction()).rejects.toThrow(J1Error);
      });
    },
  );

  test('should handle errors of unknown format', async () => {
    const mockUnknownError = new Error() as any;
    const executionHandler = jest.fn().mockRejectedValue(mockUnknownError);
    const handledFunction = withErrorHandling(executionHandler);
    await expect(handledFunction()).rejects.toThrow(
      IntegrationProviderAPIError,
    );
  });

  test('should throw an IntegrationProviderAuthorizationError on 401 errors', async () => {
    const mockForbiddenError = new Error() as any;
    mockForbiddenError.code = 401;
    mockForbiddenError.message = mockForbiddenError.name =
      'unauthorized_client';
    const executionHandler = jest.fn().mockRejectedValue(mockForbiddenError);
    const handledFunction = withErrorHandling(executionHandler);
    await expect(handledFunction()).rejects.toThrow(
      IntegrationProviderAuthorizationError,
    );
  });

  test('should throw an IntegrationProviderAuthorizationError on 403 errors', async () => {
    const mockForbiddenError = new Error() as any;
    mockForbiddenError.code = 403;
    mockForbiddenError.message = 'Not Authorized to access this resource/api';
    mockForbiddenError.name = 'Error';
    const executionHandler = jest.fn().mockRejectedValue(mockForbiddenError);
    const handledFunction = withErrorHandling(executionHandler);
    await expect(handledFunction()).rejects.toThrow(
      IntegrationProviderAuthorizationError,
    );
  });

  test('should throw an IntegrationProviderAPIError on all unknown errors', async () => {
    const executionHandler = jest
      .fn()
      .mockRejectedValue(new Error('Something esploded'));
    const handledFunction = withErrorHandling(executionHandler);
    await expect(handledFunction()).rejects.toThrow(
      IntegrationProviderAPIError,
    );
  });

  test('should pass parameters to the wrapped function return the result if no errors', async () => {
    const executionHandler = jest
      .fn()
      .mockImplementation((...params) => Promise.resolve(params));
    const handledFunction = withErrorHandling(executionHandler);
    await expect(handledFunction('param1', 'param2')).resolves.toEqual([
      'param1',
      'param2',
    ]);
  });
});
