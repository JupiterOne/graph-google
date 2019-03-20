import { Account, Group } from "../gsuite/GSuiteClient";

import {
  ACCOUNT_ENTITY_TYPE,
  ACCOUNT_GROUP_RELATIONSHIP_CLASS,
  ACCOUNT_GROUP_RELATIONSHIP_TYPE,
  AccountGroupRelationship,
  GROUP_ENTITY_TYPE,
} from "../jupiterone";

import generateKey from "../utils/generateKey";

export function createAccountGroupRelationships(
  groups: Group[],
  account: Account,
) {
  const defaultValue: AccountGroupRelationship[] = [];

  return groups.reduce((acc, group) => {
    const parentKey = generateKey(ACCOUNT_ENTITY_TYPE, account.id);
    const childKey = generateKey(GROUP_ENTITY_TYPE, group.id);

    const relationship: AccountGroupRelationship = {
      _class: ACCOUNT_GROUP_RELATIONSHIP_CLASS,
      _fromEntityKey: parentKey,
      _key: `${parentKey}_has_${childKey}`,
      _type: ACCOUNT_GROUP_RELATIONSHIP_TYPE,
      _toEntityKey: childKey,
    };

    return [...acc, relationship];
  }, defaultValue);
}
