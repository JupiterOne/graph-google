import { cloudidentity_v1, google } from 'googleapis';
import { MINIMUM_ADMIN_DIRECTORY_OAUTH_SCOPES } from './GSuiteAdminClient';
import GSuiteClient, { CreateGSuiteClientParams } from './GSuiteClient';

export default class GSuiteCloudIdentityClient extends GSuiteClient<
  cloudidentity_v1.Cloudidentity
> {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes:
        params.requiredScopes || MINIMUM_ADMIN_DIRECTORY_OAUTH_SCOPES,
    });
  }

  protected async getClient(): Promise<cloudidentity_v1.Cloudidentity> {
    return google.cloudidentity({
      version: 'v1',
      auth: await this.getAuth(),
    });
  }
}
