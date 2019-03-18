import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface UserGroupRelationship extends RelationshipFromIntegration {
  deliverySettings?: string;
  email?: string;
  id?: string;
  kind?: string;
  role?: string;
  status?: string;
  type?: string;
}

export const USER_GROUP_RELATIONSHIP_TYPE = "google_group_has_user";
export const USER_GROUP_RELATIONSHIP_CLASS = "HAS";
