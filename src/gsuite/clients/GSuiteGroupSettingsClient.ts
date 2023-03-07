import { google, groupssettings_v1 } from 'googleapis';

import GSuiteClient, { CreateGSuiteClientParams } from './GSuiteClient';

import { IntegrationProviderAuthorizationError } from '@jupiterone/integration-sdk-core';
import { createErrorProps } from './utils/createErrorProps';

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
        groupUniqueId: encodeURIComponent(groupEmailAddress),
        alt: 'json',
      });

      settings = response.data;
    } catch (err) {
      if ([400, 404].includes(err.code)) {
        // These error codes get thrown when it couldn't find Group Settings
        // using the provided email address. Skipping past it but logging
        // for troubleshooting.
        // We've seen both 400 and 404 errors thrown for this.  It may be
        // the API was updated to start throwing 404 instead, but leaving
        // both as possible errors when a group isn't found.
        this.logger.warn(
          { groupEmailAddress },
          '[SKIP] Failed to fetch Group Settings for email address',
        );
        // Next check if we have an auth error.  Handling separate so we
        // can throw IntegrationProviderAuthorizationError specifically.
      } else if ([401, 403].includes(err.code)) {
        throw new IntegrationProviderAuthorizationError(createErrorProps(err));
      } else {
        // Other errors may be being thrown by `GSuiteClient` so we should
        // just throw this so that it isn't skipped over.
        throw err;
      }
    }

    return settings!;
  }
}
