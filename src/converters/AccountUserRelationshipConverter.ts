import { Account, User } from "../gsuite/GSuiteClient";

import {
  ACCOUNT_USER_RELATIONSHIP_CLASS,
  ACCOUNT_USER_RELATIONSHIP_TYPE,
  AccountUserRelationship
} from "../jupiterone";

import { generateAccountKey } from "./AccountEntityConverter";
import { generateUserKey } from "./UserEntityConverter";

export function createAccountUserRelationships(
  users: User[],
  account: Account
) {
  const defaultValue: AccountUserRelationship[] = [];

  return users.reduce((acc, user) => {
    const parentKey = generateAccountKey(account.id);
    const childKey = generateUserKey(user.id);

    const relationship: AccountUserRelationship = {
      _class: ACCOUNT_USER_RELATIONSHIP_CLASS,
      _fromEntityKey: parentKey,
      _key: `${parentKey}_has_${childKey}`,
      _type: ACCOUNT_USER_RELATIONSHIP_TYPE,
      _toEntityKey: childKey
    };

    return [...acc, relationship];
  }, defaultValue);
}
