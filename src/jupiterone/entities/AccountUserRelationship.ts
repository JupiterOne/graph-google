import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface AccountUserRelationship extends RelationshipFromIntegration {
  id?: string;
}

export const ACCOUNT_USER_RELATIONSHIP_TYPE = "google_account_has_user";
export const ACCOUNT_USER_RELATIONSHIP_CLASS = "HAS";
