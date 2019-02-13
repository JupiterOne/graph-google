import {
  IntegrationExecutionContext,
  IntegrationExecutionResult,
  IntegrationInvocationEvent
} from "@jupiterone/jupiter-managed-integration-sdk";

import initializeContext from "./initializeContext";

export default async function executionHandler(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>
): Promise<IntegrationExecutionResult> {
  const { graph, persister, provider } = await initializeContext(context);

  const oldData = await graph.fetchEntities();
  const gsuiteData = await provider.fetchEntities();

  return {
    operations: await persister.publish(oldData, gsuiteData)
  };
}
