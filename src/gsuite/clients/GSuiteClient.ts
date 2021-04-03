import { GaxiosResponse } from 'gaxios';
import { JWTOptions } from 'google-auth-library';
import { Auth, google } from 'googleapis';

import {
  IntegrationError,
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../types';
import { createErrorProps } from './utils/createErrorProps';

export interface PageableResponse {
  nextPageToken?: string;
}

export type PageableGaxiosResponse<T> = GaxiosResponse<
  T & {
    nextPageToken?: string | null | undefined;
  }
>;

export interface CreateGSuiteClientParams {
  config: IntegrationConfig;
  logger: IntegrationLogger;
  requiredScopes?: string[];
}

export default abstract class GSuiteClient<T> {
  readonly accountId: string;
  readonly logger: IntegrationLogger;
  readonly requiredScopes: string[];

  protected _client: T;

  private credentials: JWTOptions;

  constructor({
    config,
    logger,
    requiredScopes = [],
  }: CreateGSuiteClientParams) {
    this.logger = logger;
    this.accountId = config.googleAccountId;

    this.requiredScopes = Array.from(new Set(requiredScopes));

    this.credentials = {
      email: config.serviceAccountKeyConfig.client_email,
      key: config.serviceAccountKeyConfig.private_key,
      subject: config.domainAdminEmail,
    };
  }

  protected async getAuth(): Promise<Auth.JWT> {
    const auth = new google.auth.JWT({
      ...this.credentials,
      scopes: this.requiredScopes,
    });

    try {
      await auth.authorize();
    } catch (err) {
      const status = err.response?.status;
      const endpoint = err.response?.request?.responseURL;
      const statusText = `${
        err.response?.data?.error_description
      } Please ensure that your API client in GSuite has the correct scopes. See the GSuite integration docs here: https://github.com/JupiterOne/graph-google/blob/master/docs/jupiterone.md#admin-api-enablement (requiredScopes=${Array.from(
        this.requiredScopes,
      ).join(', ')})`;

      throw new IntegrationProviderAuthorizationError({
        cause: err,
        endpoint,
        status,
        statusText,
      });
    }

    return auth;
  }

  protected abstract getClient(): Promise<T>;

  protected async iterateApi<T>(
    fn: (nextPageToken?: string) => Promise<PageableGaxiosResponse<T>>,
    callback: (data: T) => Promise<void>,
  ) {
    let nextPageToken: string | undefined;

    do {
      const result = await withErrorHandling(fn)(nextPageToken);
      nextPageToken = result.data.nextPageToken || undefined;
      await callback(result.data);
    } while (nextPageToken);
  }

  public async getAuthenticatedServiceClient(): Promise<T> {
    if (this._client) {
      return this._client;
    }

    this._client = await this.getClient();
    return this._client;
  }
}

export function withErrorHandling<T extends (...params: any) => any>(fn: T) {
  return async (...params: any) => {
    try {
      return await fn(...params);
    } catch (error) {
      handleError(error);
    }
  };
}

/**
 * Codes unknown error into JupiterOne errors
 */
function handleError(error: any): never {
  // If the error was already handled, forward it on
  if (error instanceof IntegrationError) {
    throw error;
  }
  let ErrorConstructor = IntegrationProviderAPIError;
  if ([401, 403].includes(error.code)) {
    ErrorConstructor = IntegrationProviderAuthorizationError;
  }
  const err = new ErrorConstructor(createErrorProps(error));
  throw err;
}
