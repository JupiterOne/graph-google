import { PersisterClient } from "@jupiterone/jupiter-managed-integration-sdk";
import {
  createGroupEntities,
  createPasswordPolicyEntities,
  createUserEntities,
  createUserGroupRelationships,
  createUserPasswordPolicyRelationships
} from "../converters";

import { GSuiteDataModel } from "../gsuite/GSuiteClient";
import {
  GroupEntity,
  JupiterOneDataModel,
  PasswordPolicyEntity,
  UserEntity
} from "../jupiterone";

export default async function publishChanges(
  persister: PersisterClient,
  oldData: JupiterOneDataModel,
  gsuiteData: GSuiteDataModel
) {
  const newData = convert(gsuiteData);

  const entities = [
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
    )
  ];

  return await persister.publishPersisterOperations([entities, relationships]);
}

export function convert(gsuiteData: GSuiteDataModel): JupiterOneDataModel {
  return {
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
    )
  };
}
