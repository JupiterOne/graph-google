import { admin_directory_v1 } from 'googleapis';
import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';

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
    callback: ({ account, role: Schema$Role }) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.groups.list({
          customer: this.accountId,
          pageToken: nextPageToken,
        });
      },
      async (data: admin_directory_v1.Schema$Roles) => {
        for (const role of data.items || []) {
          await callback({ account: { accountId: this.accountId }, role });
        }
      },
    );
  }
}
