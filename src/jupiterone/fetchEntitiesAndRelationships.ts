import { GraphClient } from "@jupiterone/jupiter-managed-integration-sdk";
import {
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
  groups: GroupEntity[];
  users: UserEntity[];
  passwordPolicies: PasswordPolicyEntity[];
  userGroupRelationships: UserGroupRelationship[];
  userPasswordPolicyRelationships: UserPasswordPolicyRelationship[];
}

export default async function fetchEntitiesAndRelationships(
  graph: GraphClient
): Promise<JupiterOneDataModel> {
  const [
    users,
    groups,
    passwordPolicies,
    userGroupRelationships,
    userPasswordPolicyRelationships
  ] = await Promise.all([
    graph.findEntitiesByType<UserEntity>(USER_ENTITY_TYPE),
    graph.findEntitiesByType<GroupEntity>(GROUP_ENTITY_TYPE),
    graph.findEntitiesByType<PasswordPolicyEntity>(PASSWORD_POLICY_ENTITY_TYPE),
    graph.findRelationshipsByType(USER_GROUP_RELATIONSHIP_TYPE),
    graph.findRelationshipsByType(USER_PASSWORD_POLICY_RELATIONSHIP_TYPE)
  ]);

  return {
    users,
    groups,
    passwordPolicies,
    userGroupRelationships,
    userPasswordPolicyRelationships
  };
}
