import { admin_directory_v1 } from 'googleapis';
import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';

export class GSuiteUserClient extends GSuiteAdminClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.user.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }

  public async iterateUsers(
    callback: (data: admin_directory_v1.Schema$User) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.users.list({
          customer: this.accountId,
          projection: 'full',
          pageToken: nextPageToken,
        });
      },
      async (data: admin_directory_v1.Schema$Users) => {
        for (const user of data.users || []) {
          await callback(user);
        }
      },
    );
  }
}
