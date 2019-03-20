import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const SITE_ENTITY_TYPE = "google_site";
export const SITE_ENTITY_CLASS = "Site";

export interface SiteEntity extends EntityFromIntegration {
  type?: string;
  area?: string;
  buildingId?: string;
  floorName?: string;
  floorSection?: string;
}
