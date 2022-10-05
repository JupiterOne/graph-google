import { admin_directory_v1, google } from 'googleapis';
import GSuiteClient, { CreateGSuiteClientParams } from './GSuiteClient';

/**
 * Set of scopes that have been provided since the first release of the
 * integration and expected to be authorized by all integration instances.
 */
export const MINIMUM_ADMIN_DIRECTORY_OAUTH_SCOPES: string[] = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
  'https://www.googleapis.com/auth/admin.directory.group.readonly',
  'https://www.googleapis.com/auth/admin.directory.domain.readonly',
];

export default class GSuiteAdminClient extends GSuiteClient<
  admin_directory_v1.Admin
> {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes:
        params.requiredScopes || MINIMUM_ADMIN_DIRECTORY_OAUTH_SCOPES,
    });
  }

  protected async getClient(): Promise<admin_directory_v1.Admin> {
    return google.admin({
      version: 'directory_v1',
      auth: await this.getAuth(),
    });
  }
}
