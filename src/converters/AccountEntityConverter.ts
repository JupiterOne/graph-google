import { Account, Domains } from "../gsuite/GSuiteClient";
import {
  ACCOUNT_ENTITY_CLASS,
  ACCOUNT_ENTITY_TYPE,
  AccountEntity,
} from "../jupiterone";

import generateEntityKey from "../utils/generateEntityKey";

export function createAccountEntity(
  account: Account,
  domains: Domains,
): AccountEntity {
  return {
    _class: ACCOUNT_ENTITY_CLASS,
    _key: generateEntityKey(ACCOUNT_ENTITY_TYPE, account.id),
    _type: ACCOUNT_ENTITY_TYPE,
    displayName: account.name,
    name: account.name,
    domains: domains.domains,
    primaryDomain: domains.primaryDomain,
    accountId: domains.primaryDomain,
    id: account.id,
    vendor: "Google",
  };
}
