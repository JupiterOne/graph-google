import { GraphClient } from "@jupiterone/jupiter-managed-integration-sdk";
import {
  GROUP_ENTITY_TYPE,
  GroupEntity,
  PASSWORD_POLICY_ENTITY_TYPE,
  PasswordPolicyEntity,
  USER_ENTITY_TYPE,
  USER_GROUP_RELATIONSHIP_TYPE,
  USER_PASSWORD_POLICY_RELATIONSHIP_TYPE,
  UserEntity
} from "./Entities";

import JupiterOneDataMoldel from "./JupiterOneDataModel";

export default class JupiterOneGraphClient {
  private graph: GraphClient;

  constructor(graph: GraphClient) {
    this.graph = graph;
  }

  public async fetchEntities(): Promise<JupiterOneDataMoldel> {
    const [
      users,
      groups,
      passwordPolicies,
      userGroupRelationships,
      userPasswordPolicyRelationships
    ] = await Promise.all([
      this.graph.findEntitiesByType<UserEntity>(USER_ENTITY_TYPE),
      this.graph.findEntitiesByType<GroupEntity>(GROUP_ENTITY_TYPE),
      this.graph.findEntitiesByType<PasswordPolicyEntity>(
        PASSWORD_POLICY_ENTITY_TYPE
      ),
      this.graph.findRelationshipsByType(USER_GROUP_RELATIONSHIP_TYPE),
      this.graph.findRelationshipsByType(USER_PASSWORD_POLICY_RELATIONSHIP_TYPE)
    ]);

    return {
      users,
      groups,
      passwordPolicies,
      userGroupRelationships,
      userPasswordPolicyRelationships
    };
  }
}
