import {
  IntegrationExecutionContext,
  IntegrationInstanceAuthenticationError,
  IntegrationInstanceConfigError,
  IntegrationInvocationEvent
} from "@jupiterone/jupiter-managed-integration-sdk";

import { GSuiteClient } from "./GSuite";

/**
 * Performs validation of the execution before the execution handler function is
 * invoked.
 *
 * At a minimum, integrations should ensure that the instance configuration is
 * valid. It is also helpful to perform authentication with the provider to
 * ensure that credentials are valid. The function will be awaited to support
 * connecting to the provider for this purpose.
 *
 * @param context
 */
export default async function invocationValidator(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>
) {
  const { config } = context.instance;
  if (!config.providerAPIKey) {
    throw new IntegrationInstanceConfigError(
      "providerAPIKey missing in config"
    );
  }
  try {
    const provider = new GSuiteClient(config.accountId, {
      email: config.email,
      key: config.key,
      subject: config.subject
    });
    await provider.authenticate();
  } catch (err) {
    throw new IntegrationInstanceAuthenticationError(err);
  }
}
