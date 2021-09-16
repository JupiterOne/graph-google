import { admin_directory_v1 } from 'googleapis';
import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';
import { CreateRoleEntityParams } from '../../steps/roles/converters';

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
    callback: (data: CreateRoleEntityParams) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.roles.list({
          customer: this.accountId,
          pageToken: nextPageToken,
        });
      },
      async (data: admin_directory_v1.Schema$Roles) => {
        for (const role of data.items || []) {
          await callback({
            account: { googleAccountId: this.accountId },
            role,
          });
        }
      },
    );
  }
}
