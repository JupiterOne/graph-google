import { RelationshipDirection } from "@jupiterone/jupiter-managed-integration-sdk";
import { Group, Member, MemberType, User } from "../gsuite/GSuiteClient";

import {
  GROUP_ENTITY_CLASS,
  GROUP_ENTITY_TYPE,
  MappedUserGroupRelationshipFromIntegration,
  USER_ENTITY_CLASS,
  USER_ENTITY_TYPE,
  USER_GROUP_RELATIONSHIP_CLASS,
  USER_GROUP_RELATIONSHIP_TYPE,
  UserGroupRelationship,
  UserGroupRelationshipFromIntegration,
} from "../jupiterone";

import generateEntityKey from "../utils/generateEntityKey";

interface UsersDict {
  [email: string]: User;
}

export function createUserGroupRelationships(
  users: User[],
  groups: Group[],
  members: Member[],
): UserGroupRelationship[] {
  const defaultValue: UserGroupRelationship[] = [];
  const usersDict: UsersDict = {};

  users.forEach((user: User) => {
    user.emails.forEach((e: { address: string }) => {
      usersDict[e.address] = user;
    });
  });

  return members.reduce((acc, member) => {
    const relationship = createRelationship(member, usersDict, groups);
    return relationship ? [...acc, relationship] : acc;
  }, defaultValue);
}

function findGroupByEmail(groups: Group[], email: string): Group | undefined {
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

function findUserByEmail(users: UsersDict, email: string): User | undefined {
  return users[email];
}

function createRelationship(
  member: Member,
  users: UsersDict,
  groups: Group[],
): UserGroupRelationship | null {
  if (!member.email) {
    return null;
  }

  const parentKey = generateEntityKey(GROUP_ENTITY_TYPE, member.groupId);

  switch (member.memberType) {
    case MemberType.GROUP: {
      const group = findGroupByEmail(groups, member.email);
      if (group && group.id) {
        const groupKey = generateEntityKey(GROUP_ENTITY_TYPE, group.id);
        return createUsualRelationship(parentKey, groupKey, member);
      }
      const childKey = generateEntityKey("group", member.email);
      return createMappedRelationship(
        parentKey,
        childKey,
        member,
        GROUP_ENTITY_CLASS,
      );
    }
    case MemberType.USER: {
      const user = findUserByEmail(users, member.email);
      if (user && user.id) {
        const userKey = generateEntityKey(USER_ENTITY_TYPE, user.id);
        return createUsualRelationship(parentKey, userKey, member);
      }
      const childKey = generateEntityKey("user", member.email);
      return createMappedRelationship(
        parentKey,
        childKey,
        member,
        USER_ENTITY_CLASS,
      );
    }
    default:
      return null;
  }
}

function createUsualRelationship(
  parentKey: string,
  childKey: string,
  member: Member,
): UserGroupRelationshipFromIntegration {
  const relationship: UserGroupRelationshipFromIntegration = {
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
  return relationship;
}

function createMappedRelationship(
  parentKey: string,
  childKey: string,
  member: Member,
  targetEntityClass: string,
): MappedUserGroupRelationshipFromIntegration {
  const relationship: MappedUserGroupRelationshipFromIntegration = {
    _class: USER_GROUP_RELATIONSHIP_CLASS,
    _key: `${parentKey}_has_${childKey}`,
    _type: USER_GROUP_RELATIONSHIP_TYPE,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: parentKey,
      skipTargetCreation: false,
      targetFilterKeys: [["_class", "email"]],
      targetEntity: {
        _class: targetEntityClass,
        email: member.email,
      },
    },
  };
  return relationship;
}
