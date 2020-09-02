import GSuiteClient from './GSuiteClient';

import { admin_directory_v1 } from 'googleapis';

export class GSuiteTokenClient extends GSuiteClient {
  async iterateTokens(
    userKey: string,
    callback: (data: admin_directory_v1.Schema$Token) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();
    let tokenResponse: admin_directory_v1.Schema$Tokens;

    try {
      ({ data: tokenResponse } = await client.tokens.list({ userKey }));
    } catch (err) {
      this.logger.warn(
        {
          err,
        },
        `Could not list tokens for user. NOTE: The tokens of users who have higher permissions than the domain admin used by this integration cannot be listed.`,
      );
      return;
    }

    for (const token of tokenResponse.items || []) {
      await callback(token);
    }
  }
}
