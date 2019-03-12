import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface AccountUserRelationship extends RelationshipFromIntegration {
  id?: string;
}

export const ACCOUNT_USER_RELATIONSHIP_TYPE = "gsuite_account_user";
export const ACCOUNT_USER_RELATIONSHIP_CLASS = "HAS";
