import { GSuiteClient } from "./gsuite";
import { GoogleIntegrationInstanceConfig } from "./types";

export default function createGSuiteClient(
  config: GoogleIntegrationInstanceConfig
) {
  const {
    googleAccountId: accountId,
    serviceAccountCredentials: creds
  } = config;

  return new GSuiteClient(accountId, {
    email: creds.client_email,
    key: creds.private_key,
    subject: config.domainAdminEmail
  });
}
