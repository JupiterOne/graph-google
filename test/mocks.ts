import { Entity } from '@jupiterone/integration-sdk-core';
import { admin_directory_v1 } from 'googleapis';
import {
  createAccountEntity,
  CreateAccountEntityParams,
} from '../src/steps/account/converters';

export function getMockUser(
  partial?: Partial<admin_directory_v1.Schema$User>,
): admin_directory_v1.Schema$User {
  return {
    kind: 'admin#directory#user',
    id: '123456789',
    etag: 'abcdef',
    primaryEmail: 'john.doe@jupiterone.io',
    name: {
      givenName: 'John',
      familyName: 'Doe',
      fullName: 'John Doe',
    },
    isAdmin: false,
    isDelegatedAdmin: false,
    lastLoginTime: '2020-08-27T00:57:59.000Z',
    creationTime: '2020-08-13T19:03:11.000Z',
    agreedToTerms: true,
    suspended: false,
    archived: false,
    changePasswordAtNextLogin: false,
    ipWhitelisted: false,
    emails: [
      {
        address: 'john.doe@jupiterone.io',
        type: 'work',
        primary: true,
      },
    ],
    relations: [
      {
        value: 'john.doe.manager@jupiterone.io',
        type: 'manager',
      },
    ],
    organizations: [
      {
        title: 'CMO',
        description: 'Full-time',
        primary: true,
        costCenter: '01A',
        customType: '',
        department: 'Marketing',
      },
    ],
    locations: [
      {
        type: 'desk',
        area: 'desk',
        buildingId: 'RTP',
      },
    ],
    customerId: 'abc123',
    orgUnitPath: '/Marketing',
    isMailboxSetup: true,
    isEnrolledIn2Sv: true,
    isEnforcedIn2Sv: true,
    includeInGlobalAddressList: true,
    recoveryEmail: 'john.doe.recovery@jupiterone.io',
    recoveryPhone: '+19999999999',
    customSchemas: {
      SSO: {
        role: [
          {
            type: 'work',
            value:
              'arn:aws:iam::123456789:role/Developer,arn:aws:iam::123456789:saml-provider/gsuite',
          },
        ],
      },
    },
    ...partial,
  };
}

export function getMockRole(
  partial?: Partial<admin_directory_v1.Schema$Role>,
): admin_directory_v1.Schema$Role {
  return {
    kind: 'admin#directory#role',
    roleId: '123456',
    etag: 'abcdef',
    roleName: 'some mocked role',
    isSystemRole: false,
    isSuperAdminRole: false,
    rolePrivileges: [
      { serviceId: 'abc', privilegeName: 'privilege1' },
      { serviceId: 'def', privilegeName: 'privilege2' },
    ],
    ...partial,
  };
}

export function getMockAccountEntity(
  partial?: Partial<CreateAccountEntityParams>,
): Entity {
  return createAccountEntity({
    account: {
      googleAccountId: 'abc',
      name: 'mygoogle',
    },
    domainNames: ['jupiterone.com', 'jupiterone.io'],
    primaryDomain: 'jupiterone.com',
    ...partial,
  });
}
