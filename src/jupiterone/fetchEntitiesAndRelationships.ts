import { GraphClient } from "@jupiterone/jupiter-managed-integration-sdk";
import {
  ACCOUNT_ENTITY_TYPE,
  ACCOUNT_GROUP_RELATIONSHIP_TYPE,
  ACCOUNT_USER_RELATIONSHIP_TYPE,
  AccountEntity,
  AccountGroupRelationship,
  AccountUserRelationship,
  GROUP_ENTITY_TYPE,
  GroupEntity,
  USER_ENTITY_TYPE,
  USER_GROUP_RELATIONSHIP_TYPE,
  UserEntity,
  UserGroupRelationship,
} from "./entities";

export interface JupiterOneDataModel {
  accounts: AccountEntity[];
  groups: GroupEntity[];
  users: UserEntity[];
  userGroupRelationships: UserGroupRelationship[];
  accountUserRelationships: AccountUserRelationship[];
  accountGroupRelationships: AccountGroupRelationship[];
}

export default async function fetchEntitiesAndRelationships(
  graph: GraphClient,
): Promise<JupiterOneDataModel> {
  const [
    accounts,
    users,
    groups,
    userGroupRelationships,
    accountUserRelationships,
    accountGroupRelationships,
  ] = await Promise.all([
    graph.findEntitiesByType<AccountEntity>(ACCOUNT_ENTITY_TYPE),
    graph.findEntitiesByType<UserEntity>(USER_ENTITY_TYPE),
    graph.findEntitiesByType<GroupEntity>(GROUP_ENTITY_TYPE),
    graph.findRelationshipsByType(USER_GROUP_RELATIONSHIP_TYPE),
    graph.findRelationshipsByType(ACCOUNT_USER_RELATIONSHIP_TYPE),
    graph.findRelationshipsByType(ACCOUNT_GROUP_RELATIONSHIP_TYPE),
  ]);

  return {
    accounts,
    users,
    groups,
    userGroupRelationships,
    accountUserRelationships,
    accountGroupRelationships,
  };
}
