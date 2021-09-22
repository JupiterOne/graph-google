import generateEntityKey from '../../utils/generateEntityKey';
import { entities } from '../../constants';
import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { admin_directory_v1 } from 'googleapis';
import Schema$Role = admin_directory_v1.Schema$Role;

export type RolePrivilegeStrings = {
  privilegeIds: string[];
  privilegeNames: string[];
};

export function getRolePrivilegeStrings(
  role: Schema$Role,
): RolePrivilegeStrings {
  return (role.rolePrivileges || []).reduce(
    (privileges, role) => {
      if (role.serviceId) privileges.privilegeIds.push(role.serviceId);
      if (role.privilegeName)
        privileges.privilegeNames.push(role.privilegeName);

      return privileges;
    },
    { privilegeIds: [], privilegeNames: [] } as RolePrivilegeStrings,
  );
}

export function createRoleEntity(role: Schema$Role) {
  const roleId = role.roleId as string;
  const roleName = role.roleName as string;

  const { privilegeIds, privilegeNames } = getRolePrivilegeStrings(role);

  return createIntegrationEntity({
    entityData: {
      source: role,
      assign: {
        _class: entities.ROLE._class,
        _type: entities.ROLE._type,
        _key: generateEntityKey(entities.ROLE._type, roleId),
        id: roleId,
        name: roleName,
        displayName: roleName,
        description: role.roleDescription,
        isSystem: role.isSystemRole,
        isAdmin: role.isSuperAdminRole,
        privilegeIds,
        privilegeNames,
        kind: role.kind,
        vendor: 'Google',
      },
    },
  });
}
