import generateEntityKey from '../../utils/generateEntityKey';
import { entities } from '../../constants';
import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { admin_directory_v1 } from 'googleapis';
import Schema$Role = admin_directory_v1.Schema$Role;

export function createRoleEntity(role: Schema$Role) {
  const roleId = role.roleId as string;
  const roleName = role.roleName as string;

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
        privileges: ((role.rolePrivileges as any) || []).map((privilege) => ({
          id: privilege.serviceId,
          name: privilege.privilegeName,
        })),
        isSystem: role.isSystemRole,
        isAdmin: role.isSuperAdminRole,
        kind: role.kind,
        vendor: 'Google',
      },
    },
  });
}
