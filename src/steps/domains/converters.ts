import generateEntityKey from '../../utils/generateEntityKey';
import { admin_directory_v1 } from 'googleapis';
import { entities } from '../../constants';
import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';

export function createDomainEntity(data: admin_directory_v1.Schema$Domains) {
  const domainName = data.domainName as string;

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        // Normally we opt not to use the entity _type in the key, but _key
        // cannot be shorter than 10 chars and domain names can be short...
        _key: generateEntityKey(entities.DOMAIN._type, domainName),
        _type: entities.DOMAIN._type,
        _class: entities.DOMAIN._class,
        // The "creationTime" field is a string in UNIX timestamp format
        createdOn: data.creationTime && parseInt(data.creationTime as string),
        id: domainName,
        displayName: domainName,
        name: domainName,
        emailDomain: domainName,
        primary: data.isPrimary === true,
        verified: data.verified === true,
      },
    },
  });
}
