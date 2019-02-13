import { Group, Member, User } from "../../GSuite/GSuiteClient";

import {
  USER_GROUP_RELATIONSHIP_CLASS,
  USER_GROUP_RELATIONSHIP_TYPE,
  UserGroupRelationship
} from "../../JupiterOne";

import { generateGroupId } from "./GroupEntityConverter";
import { generateUserId } from "./UserEntityConverter";

export function createUserGroupRelationships(
  users: User[],
  groups: Group[],
  members: Member[]
) {
  return members.reduce(
    (acc, member) => {
      const parentId = generateGroupId(member.groupId);
      const childId = findChildId(member, users, groups);

      if (!childId) {
        return acc;
      }

      const relationship = {
        _class: USER_GROUP_RELATIONSHIP_CLASS,
        _fromEntityKey: parentId,
        _key: `${parentId}_has_${childId}`,
        _type: USER_GROUP_RELATIONSHIP_TYPE,
        _toEntityKey: childId,
        delivery_settings: member.delivery_settings,
        email: member.email,
        kind: member.kind,
        role: member.role,
        status: member.status,
        type: member.type
      };

      return [...acc, relationship] as UserGroupRelationship[];
    },
    [] as UserGroupRelationship[]
  );
}

function findGroupByEmail(groups: Group[], email: string) {
  return groups.find(g => {
    if (g.email === email) {
      return true;
    }

    if (g.aliases && g.aliases.find(e => e === email)) {
      return true;
    }

    return false;
  });
}

function findUserByEmail(users: User[], email: string) {
  return users.find(u => {
    return u.emails.find((e: { address: string }) => {
      return e.address === email;
    });
  });
}

function findChildId(
  member: Member,
  users: User[],
  groups: Group[]
): string | null {
  if (!member.email) {
    return null;
  }

  if (member.isGroup) {
    const group = findGroupByEmail(groups, member.email);
    return generateGroupId(group && group.id);
  }

  if (member.isUser) {
    const user = findUserByEmail(users, member.email);
    return generateUserId(user && user.id);
  }

  return null;
}
