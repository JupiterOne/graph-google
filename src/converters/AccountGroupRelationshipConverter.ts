import { Account, Group } from "../gsuite/GSuiteClient";

import {
  ACCOUNT_GROUP_RELATIONSHIP_CLASS,
  ACCOUNT_GROUP_RELATIONSHIP_TYPE,
  AccountGroupRelationship
} from "../jupiterone";

import { generateAccountKey } from "./AccountEntityConverter";
import { generateGroupKey } from "./GroupEntityConverter";

export function createAccountGroupRelationships(
  groups: Group[],
  account: Account
) {
  const defaultValue: AccountGroupRelationship[] = [];

  return groups.reduce((acc, group) => {
    const parentKey = generateAccountKey(account.id);
    const childKey = generateGroupKey(group.id);

    const relationship: AccountGroupRelationship = {
      _class: ACCOUNT_GROUP_RELATIONSHIP_CLASS,
      _fromEntityKey: parentKey,
      _key: `${parentKey}_has_${childKey}`,
      _type: ACCOUNT_GROUP_RELATIONSHIP_TYPE,
      _toEntityKey: childKey
    };

    return [...acc, relationship];
  }, defaultValue);
}
