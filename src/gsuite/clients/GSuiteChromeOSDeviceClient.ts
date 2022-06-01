import { admin_directory_v1 } from 'googleapis';

import GSuiteAdminClient from './GSuiteAdminClient';
import { CreateGSuiteClientParams } from './GSuiteClient';

export class GSuiteChromeOSDeviceClient extends GSuiteAdminClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.device.chromeos.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }

  public async iterateChromeOSDevices(
    callback: (data: admin_directory_v1.Schema$ChromeOsDevice) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return client.chromeosdevices.list({
          customerId: this.accountId,
          pageToken: nextPageToken,
        });
      },
      async (data: admin_directory_v1.Schema$ChromeOsDevices) => {
        for (const device of data.chromeosdevices || []) {
          await callback(device);
        }
      },
    );
  }
}
