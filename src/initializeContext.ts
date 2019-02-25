import {
  IntegrationExecutionContext,
  IntegrationInvocationEvent
} from "@jupiterone/jupiter-managed-integration-sdk";
import createGSuiteClient from "./createGSuiteClient";

export default async function initializeContext(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>
) {
  const { config } = context.instance;

  const provider = createGSuiteClient(config);
  await provider.authenticate();

  const { persister, graph } = context.clients.getClients();

  return {
    graph,
    persister,
    provider
  };
}
