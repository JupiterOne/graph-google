import GSuiteClient from './GSuiteClient';

import { admin_directory_v1 } from 'googleapis';

export class GSuiteGroupClient extends GSuiteClient {
  async iterateGroups(
    callback: (data: admin_directory_v1.Schema$Group) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.groups.list({
          customer: this.accountId,
          pageToken: nextPageToken,
        });
      },
      async (data: admin_directory_v1.Schema$Groups) => {
        for (const group of data.groups || []) {
          await callback(group);
        }
      },
    );
  }

  async iterateGroupMembers(
    groupId: string,
    callback: (data: admin_directory_v1.Schema$Member) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.members.list({
          groupKey: groupId,
          pageToken: nextPageToken,
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
