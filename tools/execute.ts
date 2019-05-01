/* tslint:disable:no-console */
import { executeIntegrationLocal } from "@jupiterone/jupiter-managed-integration-sdk";

import invocationConfig, { ServiceAccountCredentials } from "../src/index";

if (
  !process.env.GOOGLE_LOCAL_EXECUTION_ACCOUNT_ID ||
  !process.env.GOOGLE_LOCAL_EXECUTION_DOMAIN_ADMIN_EMAIL ||
  !process.env.GOOGLE_LOCAL_EXECUTION_SERVICE_ACCOUNT_CREDENTIALS
) {
  throw new Error(
    "Local execution requires environment variables, see README.md",
  );
}

const integrationConfig = {
  googleAccountId: process.env.GOOGLE_LOCAL_EXECUTION_ACCOUNT_ID,
  domainAdminEmail: process.env.GOOGLE_LOCAL_EXECUTION_DOMAIN_ADMIN_EMAIL,
};

const invocationArgs = {
  serviceAccountCredentials: JSON.parse(
    process.env.GOOGLE_LOCAL_EXECUTION_SERVICE_ACCOUNT_CREDENTIALS,
  ) as ServiceAccountCredentials,
};

executeIntegrationLocal(
  integrationConfig,
  invocationConfig,
  invocationArgs,
).catch(err => {
  console.error(err);
  process.exit(1);
});
