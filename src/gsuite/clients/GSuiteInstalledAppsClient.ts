import { chromemanagement_v1 } from 'googleapis';

import { CreateGSuiteClientParams } from './GSuiteClient';
import { GSuiteChromeManagementClient } from './GSuiteChromeManagementClient';

export class GSuiteInstalledAppsClient extends GSuiteChromeManagementClient {
  constructor(params: CreateGSuiteClientParams) {
    super({
      ...params,
      requiredScopes: [
        'https://www.googleapis.com/auth/chrome.management.reports.readonly',
        ...(params.requiredScopes || []),
      ],
    });
  }

  public async iterateInstalledApps(
    callback: (
      data: chromemanagement_v1.Schema$GoogleChromeManagementV1InstalledApp,
    ) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async () => {
        return client.customers.reports.countInstalledApps({
          customer: `customers/${this.accountId}`,
        });
      },
      async (data) => {
        for (const app of data.installedApps || []) {
          await callback(app);
        }
      },
    );
  }

  public async iterateInstalledAppDevices(
    appId: string,
    callback: (
      data: chromemanagement_v1.Schema$GoogleChromeManagementV1Device,
    ) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async () => {
        return client.customers.reports.findInstalledAppDevices({
          customer: `customers/${this.accountId}`,
          appId,
        });
      },
      async (data) => {
        for (const device of data.devices || []) {
          await callback(device);
        }
      },
    );
  }
}
