import {
  IntegrationInstance,
  IntegrationInvocationContext,
} from "@jupiterone/jupiter-managed-integration-sdk";

import GSuiteClient from "./GSuiteClient";

export default function createGSuiteClient(
  instance: IntegrationInstance,
  context: IntegrationInvocationContext,
) {
  const { config } = instance;
  const { invocationArgs, logger } = context;

  const creds = (invocationArgs as any).serviceAccountCredentials;

  return new GSuiteClient(
    config.googleAccountId,
    {
      email: creds.client_email,
      key: creds.private_key,
      subject: config.domainAdminEmail,
    },
    logger,
  );
}
