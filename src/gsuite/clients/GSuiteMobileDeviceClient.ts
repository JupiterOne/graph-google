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

    const response = await client.mobiledevices.list({
      customerId: this.accountId,
    });

    for (const device of response.data.mobiledevices || []) {
      await callback(device);
    }
  }
}
