import {
  GraphClient,
  PersisterClient,
  PersisterOperationsResult,
} from "@jupiterone/jupiter-managed-integration-sdk";

export default async function deleteDeprecatedTypes(
  graph: GraphClient,
  persister: PersisterClient,
): Promise<PersisterOperationsResult> {
  const deprecatedEntityTypes = [
    "gsuite_group",
    "gsuite_user",
    "gsuite_user_group",
    "gsuite_password_policy",
  ];

  const deprecatedRelationshipTypes = [
    "gsuite_user_password_policy",
    "gsuite_user_group",
  ];

  const deprecatedEntities = [];
  const deprecatedRelationships = [];

  for (const type of deprecatedEntityTypes) {
    deprecatedEntities.push(...(await graph.findEntitiesByType(type)));
  }

  for (const type of deprecatedRelationshipTypes) {
    deprecatedRelationships.push(
      ...(await graph.findRelationshipsByType(type)),
    );
  }

  return persister.publishPersisterOperations([
    persister.processEntities(deprecatedEntities, []),
    persister.processRelationships(deprecatedRelationships, []),
  ]);
}
