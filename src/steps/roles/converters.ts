import generateEntityKey from '../../utils/generateEntityKey';
import { entities } from '../../constants';
import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { admin_directory_v1 } from 'googleapis';
import Schema$Role = admin_directory_v1.Schema$Role;

export interface CreateRoleEntityParams {
  account: { googleAccountId: string };
  role: Schema$Role;
}

export function createRoleEntity(data: CreateRoleEntityParams) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: entities.ROLE._class,
        _key: generateEntityKey(
          entities.ROLE._type,
          data.role.roleId as string,
        ),
        _type: entities.ROLE._type,
        // TODO/Rick: Verify Shape
        displayName: data.role.roleName as any,
        name: data.role.roleName,
        id: data.account.googleAccountId,
        vendor: 'Google',
      },
    },
  });
}
