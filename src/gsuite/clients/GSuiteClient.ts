import { JWT, JWTOptions } from 'google-auth-library';
import { admin_directory_v1, google } from 'googleapis';
import { GaxiosResponse } from 'gaxios';
import { IntegrationConfig } from '../../types';

export interface PageableResponse {
  nextPageToken?: string;
}

export type PageableGaxiosResponse<T> = GaxiosResponse<
  T & {
    nextPageToken?: string | null | undefined;
  }
>;

export default class GSuiteClient {
  readonly accountId: string;

  private client: admin_directory_v1.Admin;
  private credentials: JWTOptions;

  constructor(config: IntegrationConfig) {
    this.accountId = config.googleAccountId;
    this.credentials = {
      email: config.serviceAccountKeyConfig.client_email,
      key: config.serviceAccountKeyConfig.private_key,
      subject: config.domainAdminEmail,
    };
  }

  private async getClient(): Promise<admin_directory_v1.Admin> {
    const auth = new JWT({
      ...this.credentials,
      scopes: [
        'https://www.googleapis.com/auth/admin.directory.user.readonly',
        'https://www.googleapis.com/auth/admin.directory.group.readonly',
        'https://www.googleapis.com/auth/admin.directory.domain.readonly',
      ],
    });

    await auth.authorize();

    return google.admin({
      version: 'directory_v1',
      auth,
    });
  }

  async getAuthenticatedServiceClient(): Promise<admin_directory_v1.Admin> {
    if (!this.client) {
      this.client = await this.getClient();
    }

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
