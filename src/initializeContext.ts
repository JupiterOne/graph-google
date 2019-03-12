import {
  IntegrationExecutionContext,
  IntegrationInvocationEvent
} from "@jupiterone/jupiter-managed-integration-sdk";
import { createGSuiteClient } from "./gsuite";

export default async function initializeContext(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>
) {
  const provider = createGSuiteClient(context);

  await provider.authenticate();

  const { persister, graph } = context.clients.getClients();

  const account = {
    id: config.accountId,
    name: config.accountName || context.instance.name
  };

  return {
    graph,
    persister,
    provider,
    account
  };
}
