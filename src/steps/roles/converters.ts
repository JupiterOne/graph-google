import generateEntityKey from '../../utils/generateEntityKey';
import { entities } from '../../constants';
import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { admin_directory_v1 } from 'googleapis';
import Schema$Role = admin_directory_v1.Schema$Role;

export function createRoleEntity(role: Schema$Role) {
  return createIntegrationEntity({
    entityData: {
      source: role,
      assign: {
        _class: entities.ROLE._class,
        _key: generateEntityKey(entities.ROLE._type, role.roleId as string),
        _type: entities.ROLE._type,
        // TODO/Rick: Is this the shape we want? I am including more properties rather than fewer for the sake of discussion but can whittle this down
        id: role.roleId as string,
        name: role.roleName,
        displayName: role.roleName as string,
        roleName: role.roleName,
        roleDescription: role.roleDescription,
        isSystemRole: role.isSystemRole,
        isSuperAdminRole: role.isSuperAdminRole,
        kind: role.kind,
        vendor: 'Google',
      },
    },
  });
}
