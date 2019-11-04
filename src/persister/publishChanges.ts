import {
  EntityFromIntegration,
  EntityOperation,
  PersisterClient,
  RelationshipOperation,
} from "@jupiterone/jupiter-managed-integration-sdk";
import {
  createAccountEntity,
  createAccountGroupRelationships,
  createAccountUserRelationships,
  createGroupEntities,
  createSiteEntities,
  createSiteUserRelationships,
  createUserEntities,
  createUserGroupRelationships,
} from "../converters";

import { Account, GSuiteDataModel } from "../gsuite/GSuiteClient";

import {
  JupiterOneDataModel,
  JupiterOneEntitiesData,
  JupiterOneRelationshipsData,
} from "../jupiterone";

type EntitiesKeys = keyof JupiterOneEntitiesData;
type RelationshipsKeys = keyof JupiterOneRelationshipsData;

export default async function publishChanges(
  persister: PersisterClient,
  oldData: JupiterOneDataModel,
  gsuiteData: GSuiteDataModel,
  account: Account,
) {
  const newData = convert(gsuiteData, account);

  const entities = createEntitiesOperations(
    oldData.entities,
    newData.entities,
    persister,
  );
  const relationships = createRelationshipsOperations(
    oldData.relationships,
    newData.relationships,
    persister,
  );

  return await persister.publishPersisterOperations([entities, relationships]);
}

function createEntitiesOperations(
  oldData: JupiterOneEntitiesData,
  newData: JupiterOneEntitiesData,
  persister: PersisterClient,
): EntityOperation[] {
  const defatultOperations: EntityOperation[] = [];
  const entities: EntitiesKeys[] = Object.keys(oldData) as EntitiesKeys[];

  return entities.reduce((operations, entityName) => {
    const oldEntities = oldData[entityName];
    const newEntities = newData[entityName];

    return [
      ...operations,
      ...persister.processEntities<EntityFromIntegration>(
        oldEntities,
        newEntities,
      ),
    ];
  }, defatultOperations);
}

function createRelationshipsOperations(
  oldData: JupiterOneRelationshipsData,
  newData: JupiterOneRelationshipsData,
  persister: PersisterClient,
): RelationshipOperation[] {
  const defatultOperations: RelationshipOperation[] = [];
  const relationships: RelationshipsKeys[] = Object.keys(
    oldData,
  ) as RelationshipsKeys[];

  return relationships.reduce((operations, relationshipName) => {
    const oldRelationhips = oldData[relationshipName];
    const newRelationhips = newData[relationshipName];

    return [
      ...operations,
      ...persister.processRelationships(oldRelationhips, newRelationhips),
    ];
  }, defatultOperations);
}

export function convert(
  gsuiteData: GSuiteDataModel,
  account: Account,
): JupiterOneDataModel {
  return {
    entities: convertEntities(gsuiteData, account),
    relationships: convertRelationships(gsuiteData, account),
  };
}

export function convertEntities(
  gsuiteData: GSuiteDataModel,
  account: Account,
): JupiterOneEntitiesData {
  return {
    accounts: [createAccountEntity(account, gsuiteData.domains)],
    groups: createGroupEntities(gsuiteData.groups),
    users: createUserEntities(gsuiteData.users),
    sites: createSiteEntities(gsuiteData.users),
  };
}

export function convertRelationships(
  gsuiteData: GSuiteDataModel,
  account: Account,
): JupiterOneRelationshipsData {
  return {
    userGroupRelationships: createUserGroupRelationships(
      gsuiteData.users,
      gsuiteData.groups,
      gsuiteData.members,
    ),
    siteUserRelationships: createSiteUserRelationships(gsuiteData.users),
    accountUserRelationships: createAccountUserRelationships(
      gsuiteData.users,
      account,
    ),
    accountGroupRelationships: createAccountGroupRelationships(
      gsuiteData.groups,
      account,
    ),
  };
}
