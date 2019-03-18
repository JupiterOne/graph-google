import {
  IntegrationExecutionContext,
  IntegrationExecutionResult,
  IntegrationInvocationEvent
} from "@jupiterone/jupiter-managed-integration-sdk";

import fetchGsuiteData from "./gsuite/fetchGsuiteData";
import initializeContext from "./initializeContext";
import fetchEntitiesAndRelationships from "./jupiterone/fetchEntitiesAndRelationships";
import publishChanges from "./persister/publishChanges";

export default async function executionHandler(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>
): Promise<IntegrationExecutionResult> {
  const { graph, persister, provider, account } = await initializeContext(
    context
  );

  const oldData = await fetchEntitiesAndRelationships(graph);
  const gsuiteData = await fetchGsuiteData(provider);

  return {
    operations: await publishChanges(persister, oldData, gsuiteData, account)
  };
}
