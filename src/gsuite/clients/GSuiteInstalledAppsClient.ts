import { chromemanagement_v1 } from 'googleapis';

import { CreateGSuiteClientParams } from './GSuiteClient';
import { GSuiteChromeManagementClient } from './GSuiteChromeManagementClient';

type AppTypes = 'EXTENSION' | 'APP' | 'THEME' | 'HOSTED_APP' | 'ANDROID_APP';

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
    appType: AppTypes,
    callback: (
      data: chromemanagement_v1.Schema$GoogleChromeManagementV1InstalledApp,
    ) => Promise<void>,
  ): Promise<void> {
    const client = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async () => {
        return client.customers.reports.countInstalledApps({
          customer: `customers/${this.accountId}`,
          filter: `app_type=${appType} `,
        });
      },
      async (data) => {
        for (const app of data.installedApps || []) {
          await callback(app);
        }
      },
    );
  }
}
