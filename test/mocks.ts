import { admin_directory_v1 } from 'googleapis';

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
        primary: true,
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
    ...partial,
  };
}
