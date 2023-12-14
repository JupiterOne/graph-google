import { chromemanagement_v1 } from 'googleapis';

import { CreateGSuiteClientParams } from './GSuiteClient';
import { GSuiteChromeManagementClient } from './GSuiteChromeManagementClient';
import pMap from 'p-map';

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

    const oneMonth = new Date();
    oneMonth.setMonth(oneMonth.getMonth() - 1);
    const oneMonthFormatted = oneMonth.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

    await this.iterateApi(
      async () => {
        return client.customers.reports.countInstalledApps({
          customer: `customers/${this.accountId}`,
          filter: `app_type=${appType} AND latest_profile_active_date>=${oneMonthFormatted} AND total_install_count>0`,
          pageSize: 1000,
        });
      },
      async (data) => {
        // TEMP 9845:
        this.logger.info(`Installed apps length ${data.installedApps?.length}`);
        await pMap(
          data.installedApps || [],
          async (app) => {
            await callback(app);
          },
          {
            concurrency: 5,
          },
        );
      },
    );
  }
}
