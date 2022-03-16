import { admin_directory_v1 } from 'googleapis';

import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';

export class GSuiteTokenClient extends GSuiteAdminClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.user.security',
      ],
    });
  }

  public async iterateTokens(
    userKey: string,
    callback: (data: admin_directory_v1.Schema$Token) => Promise<void>,
  ): Promise<number> {
    const client = await this.getAuthenticatedServiceClient();
    let tokenResponse: admin_directory_v1.Schema$Tokens;
    const tokenFailResp = 1;
    const tokenSuccessResp = 0;

    try {
      ({ data: tokenResponse } = await client.tokens.list({ userKey }));
    } catch (err) {
      return tokenFailResp;
    }

    for (const token of tokenResponse.items || []) {
      await callback(token);
    }

    return tokenSuccessResp;
  }
}
