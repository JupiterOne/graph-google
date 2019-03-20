import { Group } from "../gsuite/GSuiteClient";
import {
  GROUP_ENTITY_CLASS,
  GROUP_ENTITY_TYPE,
  GroupEntity,
} from "../jupiterone";

import generateKey from "../utils/generateKey";

export function createGroupEntities(data: Group[]): GroupEntity[] {
  return data.map(group => {
    return {
      _class: GROUP_ENTITY_CLASS,
      _key: generateKey(GROUP_ENTITY_TYPE, group.id),
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
