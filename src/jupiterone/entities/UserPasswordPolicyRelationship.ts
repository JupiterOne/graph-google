import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface UserPasswordPolicyRelationship
  extends RelationshipFromIntegration {}

export const USER_PASSWORD_POLICY_RELATIONSHIP_TYPE =
  "gsuite_user_password_policy";
export const USER_PASSWORD_POLICY_RELATIONSHIP_CLASS = "HAS";
