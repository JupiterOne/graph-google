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

    const sixMonths = new Date();
    sixMonths.setMonth(sixMonths.getMonth() - 1);
    const sixMonthsFormatted = sixMonths.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

    await this.iterateApi(
      async (nextPageToken) => {
        return client.customers.reports.countInstalledApps({
          pageToken: nextPageToken,
          customer: `customers/${this.accountId}`,
          filter: `app_type=${appType} AND latest_profile_active_date>=${sixMonthsFormatted} AND total_install_count>0`,
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
