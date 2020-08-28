import generateEntityKey from '../../utils/generateEntityKey';
import { entities } from '../../constants';
import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';

interface CreateAccountEntityParams {
  account: {
    googleAccountId: string;
    name: string;
  };
  domainNames: string[];
  primaryDomain?: string;
}

export function getAccountKey(googleAccountId: string) {
  return generateEntityKey(entities.ACCOUNT._type, googleAccountId);
}

export function createAccountEntity(data: CreateAccountEntityParams) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: entities.ACCOUNT._class,
        _key: getAccountKey(data.account.googleAccountId),
        _type: entities.ACCOUNT._type,
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
