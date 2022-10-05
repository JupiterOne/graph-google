import { cloudidentity_v1 } from 'googleapis';

import GSuiteCloudIdentityClient from './GSuiteCloudIdentityClient';
import { CreateGSuiteClientParams } from './GSuiteClient';

export class GSuiteDeviceUserClient extends GSuiteCloudIdentityClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/cloud-identity.devices.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }

  public async iterateDeviceUsers(
    deviceName: string,
    callback: (
      data: cloudidentity_v1.Schema$GoogleAppsCloudidentityDevicesV1DeviceUser,
    ) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.devices.deviceUsers.list({
          pageToken: nextPageToken,
          parent: deviceName,
        });
      },
      async (
        data: cloudidentity_v1.Schema$GoogleAppsCloudidentityDevicesV1ListDeviceUsersResponse,
      ) => {
        for (const device of data.deviceUsers || []) {
          await callback(device);
        }
      },
    );
  }
}
