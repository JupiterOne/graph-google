import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface SiteUserRelationship extends RelationshipFromIntegration {
  id?: string;
}

export const SITE_USER_RELATIONSHIP_TYPE = "google_site_hosts_user";
export const SITE_USER_RELATIONSHIP_CLASS = "HOSTS";
