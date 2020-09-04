import { JWTOptions } from 'google-auth-library';
import { admin_directory_v1, google } from 'googleapis';
import { GaxiosResponse } from 'gaxios';
import { IntegrationConfig } from '../../types';
import {
  IntegrationLogger,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

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

const DEFAULT_GSUITE_OAUTH_SCOPES: string[] = [
  // These scopes have been set since the beginning of this integration, so
  // all integration instances should have these scopes.
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
  'https://www.googleapis.com/auth/admin.directory.group.readonly',
  'https://www.googleapis.com/auth/admin.directory.domain.readonly',
];

export default class GSuiteClient {
  readonly accountId: string;
  readonly logger: IntegrationLogger;
  readonly requiredScopes: string[];

  private client: admin_directory_v1.Admin;
  private credentials: JWTOptions;

  constructor({
    config,
    logger,
    requiredScopes = [],
  }: CreateGSuiteClientParams) {
    this.logger = logger;
    this.accountId = config.googleAccountId;

    this.requiredScopes = Array.from(
      new Set([...DEFAULT_GSUITE_OAUTH_SCOPES, ...requiredScopes]),
    );

    this.credentials = {
      email: config.serviceAccountKeyConfig.client_email,
      key: config.serviceAccountKeyConfig.private_key,
      subject: config.domainAdminEmail,
    };
  }

  private async getClient(): Promise<admin_directory_v1.Admin> {
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

    return google.admin({
      version: 'directory_v1',
      auth,
    });
  }

  async getAuthenticatedServiceClient(): Promise<admin_directory_v1.Admin> {
    if (this.client) {
      return this.client;
    }

    this.client = await this.getClient();
    return this.client;
  }

  async iterateApi<T>(
    fn: (nextPageToken?: string) => Promise<PageableGaxiosResponse<T>>,
    callback: (data: T) => Promise<void>,
  ) {
    let nextPageToken: string | undefined;

    do {
      const result = await fn(nextPageToken);
      nextPageToken = result.data.nextPageToken || undefined;
      await callback(result.data);
    } while (nextPageToken);
  }
}
