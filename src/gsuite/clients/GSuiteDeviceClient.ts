import { cloudidentity_v1 } from 'googleapis';

import GSuiteCloudIdentityClient from './GSuiteCloudIdentityClient';
import { CreateGSuiteClientParams } from './GSuiteClient';

export enum VIEW {
  unspecified = 'VIEW_UNSPECIFIED',
  company = 'COMPANY_INVENTORY',
  user = 'USER_ASSIGNED_DEVICES',
}

export class GSuiteDeviceClient extends GSuiteCloudIdentityClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/cloud-identity.devices.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }

  public async iterateDevices(
    callback: (
      data: cloudidentity_v1.Schema$GoogleAppsCloudidentityDevicesV1Device,
    ) => Promise<void>,
    view?: VIEW,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.devices.list({
          ...(view && { view }),
          pageToken: nextPageToken,
          pageSize: 200,
        });
      },
      async (
        data: cloudidentity_v1.Schema$GoogleAppsCloudidentityDevicesV1ListDevicesResponse,
      ) => {
        for (const device of data.devices || []) {
          await callback(device);
        }
      },
    );
  }
}
