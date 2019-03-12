import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface AccountPasswordPolicyRelationship
  extends RelationshipFromIntegration {
  id?: string;
}

export const ACCOUNT_PASSWORD_POLICY_RELATIONSHIP_TYPE =
  "gsuite_account_password_policy";
export const ACCOUNT_PASSWORD_POLICY_RELATIONSHIP_CLASS = "HAS";
