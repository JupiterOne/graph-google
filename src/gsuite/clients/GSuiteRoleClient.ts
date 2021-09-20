import { admin_directory_v1 } from 'googleapis';
import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';
import Schema$Role = admin_directory_v1.Schema$Role;
import Schema$Roles = admin_directory_v1.Schema$Roles;

export class GSuiteRoleClient extends GSuiteAdminClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.rolemanagement.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }

  public async iterateRoles(
    callback: (data: Schema$Role) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi<Schema$Roles>(
      async (nextPageToken) => {
        return client.roles.list({
          customer: this.accountId,
          pageToken: nextPageToken,
        });
      },
      async (data) => {
        for (const role of data.items || []) {
          await callback(role);
        }
      },
    );
  }
}
