import { Group } from "../../GSuite/GSuiteClient";
import {
  GROUP_ENTITY_CLASS,
  GROUP_ENTITY_TYPE,
  GroupEntity
} from "../../JupiterOne";

export function generateGroupId(id?: string) {
  return `gsuite-group-id-${id}`;
}

export function createGroupEntities(data: Group[]): GroupEntity[] {
  return data.map(
    d =>
      ({
        _class: GROUP_ENTITY_CLASS,
        _key: generateGroupId(d.id),
        _type: GROUP_ENTITY_TYPE,
        adminCreated: d.adminCreated,
        directMembersCount: d.directMembersCount,
        displayName: d.name,
        email: d.email,
        groupId: d.id,
        kind: d.kind,
        name: d.name,
        summary: d.description
      } as GroupEntity)
  );
}
