import {
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
} from "@jupiterone/jupiter-managed-integration-sdk";
import GSuiteClient from "./GSuiteClient";

export default function createGSuiteClient(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
) {
  const {
    instance: { config },
    invocationArgs,
  } = context;

  const creds = (invocationArgs as any).serviceAccountCredentials;

  return new GSuiteClient(config.googleAccountId, {
    email: creds.client_email,
    key: creds.private_key,
    subject: config.domainAdminEmail,
  });
}
