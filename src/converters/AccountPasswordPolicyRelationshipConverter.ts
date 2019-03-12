import { Account, User } from "../gsuite/GSuiteClient";

import {
  ACCOUNT_PASSWORD_POLICY_RELATIONSHIP_CLASS,
  ACCOUNT_PASSWORD_POLICY_RELATIONSHIP_TYPE,
  AccountPasswordPolicyRelationship
} from "../jupiterone";

import { generateAccountKey } from "./AccountEntityConverter";
import { generatePasswordPolicyKey } from "./PasswordPolicyEntityConverter";

export function createAccountPasswordPolicyRelationships(
  users: User[],
  account: Account
): AccountPasswordPolicyRelationship[] {
  return users.map((user: User) => {
    const parentKey = generateAccountKey(account.id);
    const childKey = generatePasswordPolicyKey(user.id);

    return {
      _key: `${parentKey}_has_${childKey}`,
      _type: ACCOUNT_PASSWORD_POLICY_RELATIONSHIP_TYPE,
      _class: ACCOUNT_PASSWORD_POLICY_RELATIONSHIP_CLASS,
      _fromEntityKey: parentKey,
      _toEntityKey: childKey
    };
  });
}
