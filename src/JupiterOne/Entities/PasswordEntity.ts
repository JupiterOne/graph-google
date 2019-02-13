import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface PasswordPolicyEntity extends EntityFromIntegration {}
export const PASSWORD_POLICY_ENTITY_TYPE = "gsuite_password_policy";
export const PASSWORD_POLICY_ENTITY_CLASS = "PasswordPolicy";
