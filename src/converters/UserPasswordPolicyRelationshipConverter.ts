import { User } from "../gsuite/GSuiteClient";

import {
  USER_PASSWORD_POLICY_RELATIONSHIP_CLASS,
  USER_PASSWORD_POLICY_RELATIONSHIP_TYPE,
  UserPasswordPolicyRelationship
} from "../jupiterone";

import { generatePasswordPolicyKey } from "./PasswordPolicyEntityConverter";
import { generateUserKey } from "./UserEntityConverter";

export function createUserPasswordPolicyRelationships(
  users: User[]
): UserPasswordPolicyRelationship[] {
  return users.map((user: User) => {
    const parentKey = generateUserKey(user.id);
    const childKey = generatePasswordPolicyKey(user.id);

    return {
      _key: `${parentKey}_has_${childKey}`,
      _type: USER_PASSWORD_POLICY_RELATIONSHIP_TYPE,
      _class: USER_PASSWORD_POLICY_RELATIONSHIP_CLASS,
      _fromEntityKey: parentKey,
      _toEntityKey: childKey
    };
  });
}
