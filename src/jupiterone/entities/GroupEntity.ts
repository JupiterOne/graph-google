import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const GROUP_ENTITY_TYPE = "google_group";
export const GROUP_ENTITY_CLASS = "UserGroup";

export interface GroupEntity extends EntityFromIntegration {
  adminCreated?: boolean;
  description?: string;
  directMembersCount?: string;
  email?: string;
  id: string;
  kind?: string;
  name?: string;
}
