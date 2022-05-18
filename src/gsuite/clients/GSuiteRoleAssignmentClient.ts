import { admin_directory_v1 } from 'googleapis';
import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';
import Schema$RoleAssignments = admin_directory_v1.Schema$RoleAssignments;
import Schema$RoleAssignment = admin_directory_v1.Schema$RoleAssignment;

export class GSuiteRoleAssignmentClient extends GSuiteAdminClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.rolemanagement.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }

  public async iterateRoleAssignments(
    callback: (data: Schema$RoleAssignment) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi<Schema$RoleAssignments>(
      async (pageToken) =>
        client.roleAssignments.list({ customer: this.accountId, pageToken }),
      async (data) => {
        for (const roleAssignment of data.items || []) {
          await callback(roleAssignment);
        }
      },
    );
  }
}
