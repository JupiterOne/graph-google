import { User } from "../gsuite/GSuiteClient";

import {
  SITE_ENTITY_TYPE,
  SITE_USER_RELATIONSHIP_CLASS,
  SITE_USER_RELATIONSHIP_TYPE,
  SiteUserRelationship,
  USER_ENTITY_TYPE,
} from "../jupiterone";

import generateKey from "../utils/generateKey";

export function createSiteUserRelationships(users: User[]) {
  const defaultValue: SiteUserRelationship[] = [];

  return users.reduce((acc, user) => {
    if (!user.locations) {
      return acc;
    }

    const childKey = generateKey(USER_ENTITY_TYPE, user.id);

    const userRelationships = user.locations.map(location => {
      const parentKey = generateKey(
        SITE_ENTITY_TYPE,
        `${user.id}_${location.buildingId}`,
      );

      const relationship: SiteUserRelationship = {
        _class: SITE_USER_RELATIONSHIP_CLASS,
        _fromEntityKey: parentKey,
        _key: `${parentKey}_hosts_${childKey}`,
        _type: SITE_USER_RELATIONSHIP_TYPE,
        _toEntityKey: childKey,
      };

      return relationship;
    });

    return [...acc, ...userRelationships];
  }, defaultValue);
}
