import generateEntityKey from '../../utils/generateEntityKey';
import { entities } from '../../constants';
import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';

// TODO/Rick: Interface is still for Account, update to role
interface CreateRoleEntityParams {
  account: { googleAccountId: string; name: string };
  domainNames: string[];
  primaryDomain?: string;
}

export function createRoleEntity(data: CreateRoleEntityParams) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: entities.ROLE._class,
        _key: generateEntityKey(
          entities.ROLE._type,
          data.account.googleAccountId,
        ),
        _type: entities.ROLE._type,
        // TODO/Rick: Shape
        displayName: data.account.name,
        name: data.account.name,
        domains: data.domainNames,
        primaryDomain: data.primaryDomain,
        accountId: data.primaryDomain,
        id: data.account.googleAccountId,
        vendor: 'Google',
      },
    },
  });
}
