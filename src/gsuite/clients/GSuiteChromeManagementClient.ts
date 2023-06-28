import { chromemanagement_v1, google } from 'googleapis';
import GSuiteClient, { CreateGSuiteClientParams } from './GSuiteClient';
import { MINIMUM_ADMIN_DIRECTORY_OAUTH_SCOPES } from './GSuiteAdminClient';

export class GSuiteChromeManagementClient extends GSuiteClient<
  chromemanagement_v1.Chromemanagement
> {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes:
        params.requiredScopes || MINIMUM_ADMIN_DIRECTORY_OAUTH_SCOPES,
    });
  }

  protected async getClient(): Promise<chromemanagement_v1.Chromemanagement> {
    return google.chromemanagement({
      version: 'v1',
      auth: await this.getAuth(),
    });
  }
}
