import { User } from "../gsuite/GSuiteClient";
import {
  PASSWORD_POLICY_ENTITY_CLASS,
  PASSWORD_POLICY_ENTITY_TYPE,
  PasswordPolicyEntity
} from "../jupiterone";

export function generatePasswordPolicyKey(userId?: string) {
  return `gsuite-password-policy-user-${userId}`;
}

export function createPasswordPolicyEntities(
  data: User[]
): PasswordPolicyEntity[] {
  return data.map(user => {
    const primaryEmail = user.emails.find((email: any) => email.primary);

    return {
      _class: PASSWORD_POLICY_ENTITY_CLASS,
      _key: generatePasswordPolicyKey(user.id),
      _type: PASSWORD_POLICY_ENTITY_TYPE,
      requireMFA: !!(user.isEnforcedIn2Sv && user.isEnrolledIn2Sv),
      isEnforcedIn2Sv: user.isEnforcedIn2Sv,
      isEnrolledIn2Sv: user.isEnrolledIn2Sv,
      userEmail: primaryEmail ? primaryEmail.address : ""
    };
  });
}
