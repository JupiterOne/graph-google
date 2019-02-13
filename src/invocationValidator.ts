import {
  IntegrationExecutionContext,
  IntegrationInstanceAuthenticationError,
  IntegrationInstanceConfigError,
  IntegrationInvocationEvent
} from "@jupiterone/jupiter-managed-integration-sdk";
import { JWTOptions } from "google-auth-library";

import { GSuiteClient } from "./gsuite";

/**
 * Performs validation of the execution before the execution handler function is
 * invoked.
 *
 * At a minimum, integrations should ensure that the instance configuration is
 * valid. It is also helpful to perform authentication with the provider to
 * ensure that credentials are valid. The function will be awaited to support
 * connecting to the provider for this purpose.
 *
 * @param executionContext
 */
export default async function invocationValidator(
  executionContext: IntegrationExecutionContext<IntegrationInvocationEvent>
) {
  const { config } = executionContext.instance;

  if (!config.accountId || !config.creds || !config.subject) {
    throw new IntegrationInstanceConfigError(
      "config requires all of { accountId, creds, subject }"
    );
  }

  const creds = JSON.parse(config.creds);
  const jwtOptions: JWTOptions = {
    email: creds.client_email,
    key: creds.private_key,
    subject: config.subject
  };
  const provider = new GSuiteClient(config.accountId, jwtOptions);

  try {
    await provider.authenticate();
  } catch (err) {
    throw new IntegrationInstanceAuthenticationError(err);
  }
}
