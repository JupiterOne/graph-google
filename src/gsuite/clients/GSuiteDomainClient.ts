import GSuiteClient from './GSuiteClient';

import { admin_directory_v1 } from 'googleapis';

export class GSuiteDomainClient extends GSuiteClient {
  async iterateDomains(
    callback: (data: admin_directory_v1.Schema$Domains) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    const response = await client.domains.list({
      customer: this.accountId,
    });

    for (const domain of response.data.domains || []) {
      await callback(domain);
    }
  }
}
