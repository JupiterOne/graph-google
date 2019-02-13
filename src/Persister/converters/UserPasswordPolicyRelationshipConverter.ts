import { User } from "../../GSuite/GSuiteClient";

import {
  USER_PASSWORD_POLICY_RELATIONSHIP_CLASS,
  USER_PASSWORD_POLICY_RELATIONSHIP_TYPE,
  UserPasswordPolicyRelationship
} from "../../JupiterOne";

import { generatePasswordPolicyId } from "./PasswordPolicyEntityConverter";
import { generateUserId } from "./UserEntityConverter";

export function createUserPasswordPolicyRelationships(
  users: User[]
): UserPasswordPolicyRelationship[] {
  return users.map((user: User) => {
    const parentId = generateUserId(user.id);
    const childId = generatePasswordPolicyId(user.id);

    return {
      _key: `${parentId}_has_${childId}`,
      _type: USER_PASSWORD_POLICY_RELATIONSHIP_TYPE,
      _class: USER_PASSWORD_POLICY_RELATIONSHIP_CLASS,
      _fromEntityKey: parentId,
      _toEntityKey: childId
    } as UserPasswordPolicyRelationship;
  });
}
