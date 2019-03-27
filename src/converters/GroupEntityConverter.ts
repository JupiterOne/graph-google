import { Group } from "../gsuite/GSuiteClient";
import {
  GROUP_ENTITY_CLASS,
  GROUP_ENTITY_TYPE,
  GroupEntity,
} from "../jupiterone";

import generateEntityKey from "../utils/generateEntityKey";

export function createGroupEntities(data: Group[]): GroupEntity[] {
  return data.map(group => {
    return {
      _class: GROUP_ENTITY_CLASS,
      _key: generateEntityKey(GROUP_ENTITY_TYPE, group.id),
      _type: GROUP_ENTITY_TYPE,
      id: group.id,
      adminCreated: group.adminCreated,
      directMembersCount: group.directMembersCount,
      displayName: group.name,
      email: group.email,
      kind: group.kind,
      name: group.name,
      description: group.description,
    };
  });
}
