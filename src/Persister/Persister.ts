import { PersisterClient } from "@jupiterone/jupiter-managed-integration-sdk";
import { flatten } from "ramda";
import {
  createGroupEntities,
  createPasswordPolicyEntities,
  createUserEntities,
  createUserGroupRelationships,
  createUserPasswordPolicyRelationships
} from "./converters";

import GSuiteDataModel from "../GSuite/GSuiteDataModel";
import { JupiterOneDataModel } from "../JupiterOne";

export default class Persister {
  private persister: PersisterClient;

  constructor(persister: PersisterClient) {
    this.persister = persister;
  }

  public async publish(
    oldData: JupiterOneDataModel,
    gsuiteData: GSuiteDataModel
  ) {
    const newData = this.convert(gsuiteData);
    const entities = [
      [oldData.users, newData.users],
      [oldData.groups, newData.groups],
      [oldData.passwordPolicies, newData.passwordPolicies]
    ].map(([oldEntities, newEntities]) => {
      return this.persister.processEntities(oldEntities, newEntities);
    });

    const relationships = [
      [oldData.userGroupRelationships, newData.userGroupRelationships],
      [
        oldData.userPasswordPolicyRelationships,
        newData.userPasswordPolicyRelationships
      ]
    ].map(([oldRelatoinship, newRelationship]) => {
      return this.persister.processRelationships(
        oldRelatoinship,
        newRelationship
      );
    });

    return await this.persister.publishPersisterOperations([
      flatten(entities),
      flatten(relationships)
    ]);
  }

  protected convert(gsuiteData: GSuiteDataModel): JupiterOneDataModel {
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
}
