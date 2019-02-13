import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface UserGroupRelationship extends RelationshipFromIntegration {}

export const USER_GROUP_RELATIONSHIP_TYPE = "gsuite_user_group";
export const USER_GROUP_RELATIONSHIP_CLASS = "HAS";
