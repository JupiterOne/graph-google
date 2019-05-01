import { IntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";

import { createGSuiteClient } from "./gsuite";

export default async function initializeContext(
  context: IntegrationExecutionContext,
) {
  const {
    instance,
    instance: { config },
  } = context;

  const provider = createGSuiteClient(instance, context);
  await provider.authenticate();

  const { persister, graph } = context.clients.getClients();

  const account = {
    id: config.googleAccountId,
    name: config.googleAccountName || instance.name,
  };

  return {
    graph,
    persister,
    provider,
    account,
  };
}
