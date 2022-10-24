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
      // TODO - adam-in-ict - This is way over provisioned for testing purposes.  Should not be merged with all of these scopes.
      requiredScopes: [
        'https://www.googleapis.com/auth/cloud-identity',
        'https://www.googleapis.com/auth/cloud-identity.devices',
        'https://www.googleapis.com/auth/cloud-identity.devices.readonly',
        'https://www.googleapis.com/auth/cloud-identity.userinvitations',
        'https://www.googleapis.com/auth/cloud-identity.userinvitations.readonly',
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

    // Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer
    // in the format: `customers/{customer\}`, where customer is the customer to whom the device belongs.
    // If you're using this API for your own organization, use `customers/my_customer`. If you're using
    // this API to manage another organization, use `customers/{customer\}`, where customer is the customer
    // to whom the device belongs.
    const customerFilter = 'customers/' + this.accountId;
    // const customerFilter = "customers/my_customer";

    // const test = await client.groups.list({parent: "customers/C048tgq5f"});
    // console.log(`GroupTest `, test, JSON.stringify(test.data));

    // const test = await client.devices.get({name: "devices/98b296c5-7b49-4aa5-a915-d9d2de48f476", customer: customerFilter});
    // console.log(`APAPAP test`, test);

    await this.iterateApi(
      async (nextPageToken) => {
        return client.devices.list({
          customer: customerFilter,
          ...(view && { view }),
          pageToken: nextPageToken,
          pageSize: 20,
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
