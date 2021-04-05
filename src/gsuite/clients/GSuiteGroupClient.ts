import { admin_directory_v1 } from 'googleapis';

import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';

export class GSuiteGroupClient extends GSuiteAdminClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.group.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }

  public async iterateGroups(
    callback: (data: admin_directory_v1.Schema$Group) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.groups.list({
          customer: this.accountId,
          pageToken: nextPageToken,
          maxResults: 200,
        });
      },
      async (data: admin_directory_v1.Schema$Groups) => {
        for (const group of data.groups || []) {
          await callback(group);
        }
      },
    );
  }

  public async iterateGroupMembers(
    groupId: string,
    callback: (data: admin_directory_v1.Schema$Member) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.members.list({
          groupKey: groupId,
          pageToken: nextPageToken,
          maxResults: 200,
        });
      },
      async (data: admin_directory_v1.Schema$Members) => {
        for (const member of data.members || []) {
          await callback(member);
        }
      },
    );
  }
}
