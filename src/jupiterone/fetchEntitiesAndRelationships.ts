import { GraphClient } from "@jupiterone/jupiter-managed-integration-sdk";
import {
  AccountGroupRelationship,
  AccountUserRelationship,
  SiteUserRelationship,
  UserGroupRelationship,
} from "./entities";

import * as Entities from "./entities";

export interface JupiterOneEntitiesData {
  accounts: Entities.AccountEntity[];
  groups: Entities.GroupEntity[];
  users: Entities.UserEntity[];
  sites: Entities.SiteEntity[];
}

export interface JupiterOneRelationshipsData {
  userGroupRelationships: Entities.UserGroupRelationship[];
  siteUserRelationships: Entities.SiteUserRelationship[];
  accountUserRelationships: Entities.AccountUserRelationship[];
  accountGroupRelationships: Entities.AccountGroupRelationship[];
}

export interface JupiterOneDataModel {
  entities: JupiterOneEntitiesData;
  relationships: JupiterOneRelationshipsData;
}

export default async function fetchEntitiesAndRelationships(
  graph: GraphClient,
): Promise<JupiterOneDataModel> {
  const data: JupiterOneDataModel = {
    entities: await fetchEntities(graph),
    relationships: await fetchRelationships(graph),
  };

  return data;
}

async function fetchEntities(
  graph: GraphClient,
): Promise<JupiterOneEntitiesData> {
  const [accounts, users, groups, sites] = await Promise.all([
    graph.findEntitiesByType<Entities.AccountEntity>(
      Entities.ACCOUNT_ENTITY_TYPE,
    ),
    graph.findEntitiesByType<Entities.UserEntity>(Entities.USER_ENTITY_TYPE),
    graph.findEntitiesByType<Entities.GroupEntity>(Entities.GROUP_ENTITY_TYPE),
    graph.findEntitiesByType<Entities.SiteEntity>(Entities.SITE_ENTITY_TYPE),
  ]);

  return {
    accounts,
    users,
    groups,
    sites,
  };
}

export async function fetchRelationships(
  graph: GraphClient,
): Promise<JupiterOneRelationshipsData> {
  const [
    userGroupRelationships,
    siteUserRelationships,
    accountUserRelationships,
    accountGroupRelationships,
  ] = await Promise.all([
    graph.findRelationshipsByType<UserGroupRelationship>(
      Entities.USER_GROUP_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<SiteUserRelationship>(
      Entities.SITE_USER_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<AccountUserRelationship>(
      Entities.ACCOUNT_USER_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<AccountGroupRelationship>(
      Entities.ACCOUNT_GROUP_RELATIONSHIP_TYPE,
    ),
  ]);

  return {
    userGroupRelationships,
    siteUserRelationships,
    accountUserRelationships,
    accountGroupRelationships,
  };
}
