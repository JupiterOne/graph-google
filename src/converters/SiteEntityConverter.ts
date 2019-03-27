import { User } from "../gsuite/GSuiteClient";
import { SITE_ENTITY_CLASS, SITE_ENTITY_TYPE, SiteEntity } from "../jupiterone";

import generateEntityKey from "../utils/generateEntityKey";

export function createSiteEntities(data: User[]): SiteEntity[] {
  const defaultValue: SiteEntity[] = [];

  return data.reduce((sites, user) => {
    if (!user.locations) {
      return sites;
    }

    const userSites = user.locations.map(location => {
      const displayName = [
        location.buildingId,
        location.floorName,
        location.floorSection,
      ].join(", ");

      return {
        _key: generateEntityKey(
          SITE_ENTITY_TYPE,
          `${user.id}_${location.buildingId}`,
        ),
        _type: SITE_ENTITY_TYPE,
        _class: SITE_ENTITY_CLASS,
        displayName,
        id: location.buildingId,
        type: location.type,
        area: location.area,
        buildingId: location.buildingId,
        floorName: location.floorName,
        floorSection: location.floorSection,
      };
    });

    return [...sites, ...userSites];
  }, defaultValue);
}
