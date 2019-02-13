import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const GROUP_ENTITY_TYPE = "gsuite_group";
export const GROUP_ENTITY_CLASS = "UserGroup";

export interface GroupEntity extends EntityFromIntegration {
  groupId: string;
}
