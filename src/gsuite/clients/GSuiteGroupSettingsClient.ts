import { google, groupssettings_v1 } from 'googleapis';

import GSuiteClient, { CreateGSuiteClientParams } from './GSuiteClient';

export class GSuiteGroupSettingsClient extends GSuiteClient<
  groupssettings_v1.Groupssettings
> {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: ['https://www.googleapis.com/auth/apps.groups.settings'],
    });
  }

  protected async getClient(): Promise<groupssettings_v1.Groupssettings> {
    return google.groupssettings({
      version: 'v1',
      auth: await this.getAuth(),
    });
  }

  public async getGroupSettings(
    groupEmailAddress: string,
  ): Promise<groupssettings_v1.Schema$Groups> {
    const client = await this.getAuthenticatedServiceClient();

    const response = await client.groups.get({
      groupUniqueId: groupEmailAddress,
      alt: 'json',
    });

    return response.data;
  }
}
