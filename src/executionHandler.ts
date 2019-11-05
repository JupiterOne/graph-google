import {
  IntegrationExecutionContext,
  IntegrationExecutionResult,
  IntegrationInstanceConfigError,
  summarizePersisterOperationsResults,
} from "@jupiterone/jupiter-managed-integration-sdk";
import deleteDeprecatedTypes from "./deleteDeprecatedTypes";
import fetchGsuiteData from "./gsuite/fetchGsuiteData";
import initializeContext from "./initializeContext";
import fetchEntitiesAndRelationships from "./jupiterone/fetchEntitiesAndRelationships";
import publishChanges from "./persister/publishChanges";

export default async function executionHandler(
  context: IntegrationExecutionContext,
): Promise<IntegrationExecutionResult> {
  const { graph, persister, provider, account } = await initializeContext(
    context,
  );

  const oldData = await fetchEntitiesAndRelationships(graph);
  let gsuiteData;
  try {
    gsuiteData = await fetchGsuiteData(provider);
  } catch (err) {
    if (err.code === 403) {
      throw new IntegrationInstanceConfigError(
        "Please grant access this integration access to domains, groups, group members, and users!",
      );
    } else {
      throw err;
    }
  }

  return {
    operations: summarizePersisterOperationsResults(
      await publishChanges(persister, oldData, gsuiteData, account),
      await deleteDeprecatedTypes(graph, persister),
    ),
  };
}
