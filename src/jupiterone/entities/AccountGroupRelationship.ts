import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface AccountGroupRelationship extends RelationshipFromIntegration {
  id?: string;
}

export const ACCOUNT_GROUP_RELATIONSHIP_TYPE = "gsuite_account_group";
export const ACCOUNT_GROUP_RELATIONSHIP_CLASS = "HAS";
