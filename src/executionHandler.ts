import {
  IntegrationExecutionContext,
  IntegrationExecutionResult,
  IntegrationInvocationEvent,
  summarizePersisterOperationsResults,
} from "@jupiterone/jupiter-managed-integration-sdk";

import deleteDeprecatedTypes from "./deleteDeprecatedTypes";
import fetchGsuiteData from "./gsuite/fetchGsuiteData";
import initializeContext from "./initializeContext";
import fetchEntitiesAndRelationships from "./jupiterone/fetchEntitiesAndRelationships";
import publishChanges from "./persister/publishChanges";

export default async function executionHandler(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
): Promise<IntegrationExecutionResult> {
  const { graph, persister, provider, account } = await initializeContext(
    context,
  );

  const oldData = await fetchEntitiesAndRelationships(graph);
  const gsuiteData = await fetchGsuiteData(provider);

  return {
    operations: summarizePersisterOperationsResults(
      await publishChanges(persister, oldData, gsuiteData, account),
      await deleteDeprecatedTypes(graph, persister),
    ),
  };
}
