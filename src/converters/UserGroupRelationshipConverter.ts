import { Group, Member, MemberType, User } from "../gsuite/GSuiteClient";

import {
  GROUP_ENTITY_TYPE,
  USER_ENTITY_TYPE,
  USER_GROUP_RELATIONSHIP_CLASS,
  USER_GROUP_RELATIONSHIP_TYPE,
  UserGroupRelationship,
} from "../jupiterone";

import generateEntityKey from "../utils/generateEntityKey";

interface UsersDict {
  [email: string]: User;
}

export function createUserGroupRelationships(
  users: User[],
  groups: Group[],
  members: Member[],
) {
  const defaultValue: UserGroupRelationship[] = [];
  const usersDict: UsersDict = {};
  users.forEach((user: User) => {
    user.emails.forEach((e: { address: string }) => {
      usersDict[e.address] = user;
    });
  });

  return members.reduce((acc, member) => {
    const parentKey = generateEntityKey(GROUP_ENTITY_TYPE, member.groupId);
    const childKey = findChildKey(member, usersDict, groups);

    if (!childKey) {
      return acc;
    }

    const relationship: UserGroupRelationship = {
      _class: USER_GROUP_RELATIONSHIP_CLASS,
      _fromEntityKey: parentKey,
      _key: `${parentKey}_has_${childKey}`,
      _type: USER_GROUP_RELATIONSHIP_TYPE,
      _toEntityKey: childKey,
      deliverySettings: member.delivery_settings,
      email: member.email,
      id: member.id,
      kind: member.kind,
      role: member.role,
      status: member.status,
      type: member.type,
    };

    return [...acc, relationship];
  }, defaultValue);
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

function findUserByEmail(users: UsersDict, email: string) {
  return users[email];
}

function findChildKey(
  member: Member,
  users: UsersDict,
  groups: Group[],
): string | null {
  if (!member.email) {
    return null;
  }

  switch (member.memberType) {
    case MemberType.GROUP:
      const group = findGroupByEmail(groups, member.email);
      return generateEntityKey(GROUP_ENTITY_TYPE, group && group.id);
    case MemberType.USER:
      const user = findUserByEmail(users, member.email);
      if (user && user.id) {
        return generateEntityKey(USER_ENTITY_TYPE, user.id);
      } else {
        return null;
      }
    default:
      return null;
  }
}
