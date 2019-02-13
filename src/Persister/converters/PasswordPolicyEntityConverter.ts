import { User } from "../../GSuite/GSuiteClient";
import {
  PASSWORD_POLICY_ENTITY_CLASS,
  PASSWORD_POLICY_ENTITY_TYPE,
  PasswordPolicyEntity
} from "../../JupiterOne";

export function generatePasswordPolicyId(userId?: string) {
  return `gsuite-password-policy-user-id-${userId}`;
}

export function createPasswordPolicyEntities(
  data: User[]
): PasswordPolicyEntity[] {
  return data.map(
    d =>
      ({
        _class: PASSWORD_POLICY_ENTITY_CLASS,
        _key: generatePasswordPolicyId(d.id),
        _type: PASSWORD_POLICY_ENTITY_TYPE,
        requireMFA: d.isEnforcedIn2Sv && d.isEnrolledIn2Sv,
        isEnforcedIn2Sv: d.isEnforcedIn2Sv,
        isEnrolledIn2Sv: d.isEnrolledIn2Sv
      } as PasswordPolicyEntity)
  );
}
