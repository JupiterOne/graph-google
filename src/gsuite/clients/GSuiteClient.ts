import { GaxiosError, GaxiosResponse } from 'gaxios';
import { JWTOptions } from 'google-auth-library';
import { Auth, google } from 'googleapis';

import {
  IntegrationError,
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../types';
import {
  GaxiosErrorResponse,
  createErrorProps,
} from './utils/createErrorProps';
import { retry } from '@lifeomic/attempt';

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
      } Please ensure that your API client in GSuite has the correct scopes. See the GSuite integration docs here: https://github.com/JupiterOne/graph-google/blob/main/docs/jupiterone.md#in-google-workspace (requiredScopes=${Array.from(
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
    callback: (data: T) => Promise<void> | void,
  ) {
    let nextPageToken: string | undefined;

    do {
      const result = await withErrorHandling(this.logger, fn)(nextPageToken);
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

export function withErrorHandling<T extends (...params: any) => any>(
  logger: IntegrationLogger,
  fn: T,
) {
  return (...params: any) => {
    return retry(
      async () => {
        return await fn(...params);
      },
      {
        delay: 2_000,
        timeout: 91_000,
        maxAttempts: 2,
        factor: 2.25,
        handleError(err, ctx) {
          const { error, isRetryableError } = handleError(err);

          logger.info(
            { err },
            `Handling API error. Attempt: ${ctx.attemptNum}.`,
          );

          if (!isRetryableError) {
            ctx.abort();
            throw error;
          }
        },
      },
    );
  };
}

/**
 * Codes unknown error into JupiterOne errors
 */
export function handleError(
  error: GaxiosError & { errors: GaxiosErrorResponse[] },
): {
  error: IntegrationError;
  isRetryableError: boolean;
} {
  if (error instanceof IntegrationError) {
    return {
      error,
      isRetryableError: false,
    };
  }

  let err: IntegrationError;
  let isRetryableError = false;
  const errorProps = createErrorProps(error);
  const code = Number(errorProps.status);

  if (code == 403) {
    err = new IntegrationProviderAuthorizationError(errorProps);

    if (error.message?.match && error.message.match(/Quota exceeded/i)) {
      isRetryableError = true;
    }
  } else if (
    code == 400 &&
    error.message?.match &&
    error.message.match(/billing/i)
  ) {
    err = new IntegrationProviderAuthorizationError(errorProps);
  } else if (code == 401) {
    err = new IntegrationProviderAuthorizationError(errorProps);
  } else if (code === 429 || code >= 500) {
    err = new IntegrationProviderAPIError(errorProps);
    isRetryableError = true;
  } else {
    err = new IntegrationProviderAPIError(errorProps);
  }

  return {
    error: err,
    isRetryableError,
  };
}
