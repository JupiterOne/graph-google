import { admin_directory_v1 } from 'googleapis';

import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';

export class GSuiteMobileDeviceClient extends GSuiteAdminClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.device.mobile.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }

  public async iterateMobileDevices(
    callback: (data: admin_directory_v1.Schema$MobileDevice) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.mobiledevices.list({
          customerId: this.accountId,
          pageToken: nextPageToken,
        });
      },
      async (data: admin_directory_v1.Schema$MobileDevices) => {
        for (const device of data.mobiledevices || []) {
          await callback(device);
        }
      },
    );
  }
}
