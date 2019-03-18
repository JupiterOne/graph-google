import {
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
} from "@jupiterone/jupiter-managed-integration-sdk";
import { createGSuiteClient } from "./gsuite";

export default async function initializeContext(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
) {
  const { config } = context.instance;

  const provider = createGSuiteClient(context);
  await provider.authenticate();

  const { persister, graph } = context.clients.getClients();

  const account = {
    id: config.googleAccountId,
    name: config.googleAccountName || context.instance.name,
  };

  return {
    graph,
    persister,
    provider,
    account,
  };
}
