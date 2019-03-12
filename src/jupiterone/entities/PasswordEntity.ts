import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface PasswordPolicyEntity extends EntityFromIntegration {
  requireMFA: boolean;
  isEnforcedIn2Sv?: boolean;
  isEnrolledIn2Sv?: boolean;
}
export const PASSWORD_POLICY_ENTITY_TYPE = "gsuite_user_password_policy";
export const PASSWORD_POLICY_ENTITY_CLASS = "PasswordPolicy";
