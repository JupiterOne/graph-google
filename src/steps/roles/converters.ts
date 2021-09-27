import generateEntityKey from '../../utils/generateEntityKey';
import { entities } from '../../constants';
import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { admin_directory_v1 } from 'googleapis';
import Schema$Role = admin_directory_v1.Schema$Role;

export type RolePrivilegeStrings = {
  privilegeServiceIds: string[];
  privilegeNames: string[];
};

export function getRoleEntityKey(roleId: string | null | undefined) {
  return generateEntityKey(entities.ROLE._type, roleId);
}

export function getRolePrivilegeStrings(
  role: Schema$Role,
): RolePrivilegeStrings {
  return (role.rolePrivileges || []).reduce(
    (privileges, role) => {
      if (role.serviceId) privileges.privilegeServiceIds.push(role.serviceId);
      if (role.privilegeName)
        privileges.privilegeNames.push(role.privilegeName);

      return privileges;
    },
    { privilegeServiceIds: [], privilegeNames: [] } as RolePrivilegeStrings,
  );
}

export function createRoleEntity(role: Schema$Role) {
  const roleId = role.roleId as string;
  const roleName = role.roleName as string;

  const { privilegeServiceIds, privilegeNames } = getRolePrivilegeStrings(role);

  return createIntegrationEntity({
    entityData: {
      source: role,
      assign: {
        _class: entities.ROLE._class,
        _type: entities.ROLE._type,
        _key: getRoleEntityKey(roleId),
        id: roleId,
        name: roleName,
        displayName: roleName,
        description: role.roleDescription,
        systemRole: role.isSystemRole,
        superAdmin: role.isSuperAdminRole,
        privilegeServiceIds,
        privilegeNames,
        kind: role.kind,
        vendor: 'Google',
      },
    },
  });
}
