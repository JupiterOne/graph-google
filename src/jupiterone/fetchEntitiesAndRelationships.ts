import { GraphClient } from "@jupiterone/jupiter-managed-integration-sdk";
import {
  ACCOUNT_ENTITY_TYPE,
  ACCOUNT_GROUP_RELATIONSHIP_TYPE,
  ACCOUNT_PASSWORD_POLICY_RELATIONSHIP_TYPE,
  ACCOUNT_USER_RELATIONSHIP_TYPE,
  AccountEntity,
  AccountGroupRelationship,
  AccountPasswordPolicyRelationship,
  AccountUserRelationship,
  GROUP_ENTITY_TYPE,
  GroupEntity,
  PASSWORD_POLICY_ENTITY_TYPE,
  PasswordPolicyEntity,
  USER_ENTITY_TYPE,
  USER_GROUP_RELATIONSHIP_TYPE,
  USER_PASSWORD_POLICY_RELATIONSHIP_TYPE,
  UserEntity,
  UserGroupRelationship,
  UserPasswordPolicyRelationship
} from "./entities";

export interface JupiterOneDataModel {
  accounts: AccountEntity[];
  groups: GroupEntity[];
  users: UserEntity[];
  passwordPolicies: PasswordPolicyEntity[];
  userGroupRelationships: UserGroupRelationship[];
  userPasswordPolicyRelationships: UserPasswordPolicyRelationship[];
  accountUserRelationships: AccountUserRelationship[];
  accountGroupRelationships: AccountGroupRelationship[];
  accountPasswordPolicyRelationships: AccountPasswordPolicyRelationship[];
}

export default async function fetchEntitiesAndRelationships(
  graph: GraphClient
): Promise<JupiterOneDataModel> {
  const [
    accounts,
    users,
    groups,
    passwordPolicies,
    userGroupRelationships,
    userPasswordPolicyRelationships,
    accountUserRelationships,
    accountGroupRelationships,
    accountPasswordPolicyRelationships
  ] = await Promise.all([
    graph.findEntitiesByType<AccountEntity>(ACCOUNT_ENTITY_TYPE),
    graph.findEntitiesByType<UserEntity>(USER_ENTITY_TYPE),
    graph.findEntitiesByType<GroupEntity>(GROUP_ENTITY_TYPE),
    graph.findEntitiesByType<PasswordPolicyEntity>(PASSWORD_POLICY_ENTITY_TYPE),
    graph.findRelationshipsByType(USER_GROUP_RELATIONSHIP_TYPE),
    graph.findRelationshipsByType(USER_PASSWORD_POLICY_RELATIONSHIP_TYPE),
    graph.findRelationshipsByType(ACCOUNT_USER_RELATIONSHIP_TYPE),
    graph.findRelationshipsByType(ACCOUNT_GROUP_RELATIONSHIP_TYPE),
    graph.findRelationshipsByType(ACCOUNT_PASSWORD_POLICY_RELATIONSHIP_TYPE)
  ]);

  return {
    accounts,
    users,
    groups,
    passwordPolicies,
    userGroupRelationships,
    userPasswordPolicyRelationships,
    accountUserRelationships,
    accountGroupRelationships,
    accountPasswordPolicyRelationships
  };
}
