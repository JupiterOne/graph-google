import { admin_directory_v1 } from 'googleapis';

import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';

export class GSuiteDomainClient extends GSuiteAdminClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.domain.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }

  public async iterateDomains(
    callback: (data: admin_directory_v1.Schema$Domains) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async () => {
        return client.domains.list({
          customer: this.accountId,
        });
      },
      async (data: admin_directory_v1.Schema$Domains2) => {
        for (const device of data.domains || []) {
          await callback(device);
        }
      },
    );
  }
}
