import { PersisterClient } from "@jupiterone/jupiter-managed-integration-sdk";
import {
  createAccountEntity,
  createAccountGroupRelationships,
  createAccountPasswordPolicyRelationships,
  createAccountUserRelationships,
  createGroupEntities,
  createPasswordPolicyEntities,
  createUserEntities,
  createUserGroupRelationships,
  createUserPasswordPolicyRelationships
} from "../converters";

import { Account, GSuiteDataModel } from "../gsuite/GSuiteClient";
import {
  AccountEntity,
  GroupEntity,
  JupiterOneDataModel,
  PasswordPolicyEntity,
  UserEntity
} from "../jupiterone";

export default async function publishChanges(
  persister: PersisterClient,
  oldData: JupiterOneDataModel,
  gsuiteData: GSuiteDataModel,
  account: Account
) {
  const newData = convert(gsuiteData, account);

  const entities = [
    ...persister.processEntities<AccountEntity>(
      oldData.accounts,
      newData.accounts
    ),
    ...persister.processEntities<UserEntity>(oldData.users, newData.users),
    ...persister.processEntities<GroupEntity>(oldData.groups, newData.groups),
    ...persister.processEntities<PasswordPolicyEntity>(
      oldData.passwordPolicies,
      newData.passwordPolicies
    )
  ];

  const relationships = [
    ...persister.processRelationships(
      oldData.userGroupRelationships,
      newData.userGroupRelationships
    ),
    ...persister.processRelationships(
      oldData.userPasswordPolicyRelationships,
      newData.userPasswordPolicyRelationships
    ),
    ...persister.processRelationships(
      oldData.accountUserRelationships,
      newData.accountUserRelationships
    ),
    ...persister.processRelationships(
      oldData.accountGroupRelationships,
      newData.accountGroupRelationships
    ),
    ...persister.processRelationships(
      oldData.accountPasswordPolicyRelationships,
      newData.accountPasswordPolicyRelationships
    )
  ];

  return await persister.publishPersisterOperations([entities, relationships]);
}

export function convert(
  gsuiteData: GSuiteDataModel,
  account: Account
): JupiterOneDataModel {
  return {
    accounts: [createAccountEntity(account)],
    groups: createGroupEntities(gsuiteData.groups),
    passwordPolicies: createPasswordPolicyEntities(gsuiteData.users),
    users: createUserEntities(gsuiteData.users),
    userGroupRelationships: createUserGroupRelationships(
      gsuiteData.users,
      gsuiteData.groups,
      gsuiteData.members
    ),
    userPasswordPolicyRelationships: createUserPasswordPolicyRelationships(
      gsuiteData.users
    ),
    accountUserRelationships: createAccountUserRelationships(
      gsuiteData.users,
      account
    ),
    accountGroupRelationships: createAccountGroupRelationships(
      gsuiteData.groups,
      account
    ),
    accountPasswordPolicyRelationships: createAccountPasswordPolicyRelationships(
      gsuiteData.users,
      account
    )
  };
}
