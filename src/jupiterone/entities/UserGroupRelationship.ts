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

export const USER_GROUP_RELATIONSHIP_TYPE = "google_user_group";
export const USER_GROUP_RELATIONSHIP_CLASS = "HAS";
