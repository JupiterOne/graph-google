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
    let settings: groupssettings_v1.Schema$Groups;

    try {
      const response = await client.groups.get({
        groupUniqueId: groupEmailAddress,
        alt: 'json',
      });
      settings = response.data;
    } catch (err) {
      if (err.code == 400) {
        // This error code gets thrown when it couldn't find Group Settings
        // using the provided email address. Skipping past it but logging
        // for troubleshooting.
        this.logger.warn(
          { groupEmailAddress },
          '[SKIP] Failed to fetch Group Settings for email address',
        );
        this.logger.publishEvent({
          name: 'list_group_setting_error',
          description: `Could not find group to retrieve settings for group with email address ${groupEmailAddress}`,
        });
        // Next check if we have an auth error.  Handling separate so we
        // can modify the warning.
      } else if ([401, 403].includes(err.code)) {
        this.logger.warn(
          { groupEmailAddress },
          '[SKIP] Failed to fetch Group Settings due to insufficient permissions',
        );
        this.logger.publishEvent({
          name: 'list_group_setting_error',
          description: `Insufficient permissions to retrieve settings for group with email address ${groupEmailAddress}`,
        });
      } else {
        // Other errors may be being thrown by `GSuiteClient` so we should
        // just throw this so that it isn't skipped over.
        throw err;
      }
    }

    return settings!;
  }
}
