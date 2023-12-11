import { admin_directory_v1 } from 'googleapis';

import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';
import pMap from 'p-map';

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
    const tokenAuthFailResp = 1;
    const tokenDefaultResp = 0;

    try {
      ({ data: tokenResponse } = await client.tokens.list({ userKey }));
    } catch (err) {
      if (
        err.response.data.error.code == 401 ||
        err.response.data.error.code == 403
      ) {
        return tokenAuthFailResp;
      } else {
        // For non-permissions issues, continue to log all instances of it
        this.logger.warn({ err }, 'Could not list tokens for user.');
        this.logger.publishEvent({
          name: 'list_token_error',
          description: `Could not list tokens for user.`,
        });
        return tokenDefaultResp;
      }
    }

    await pMap(
      tokenResponse.items || [],
      async (token) => {
        await callback(token);
      },
      {
        concurrency: 5,
      },
    );

    return tokenDefaultResp;
  }
}
