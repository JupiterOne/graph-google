import { User } from "../gsuite/GSuiteClient";
import { USER_ENTITY_CLASS, USER_ENTITY_TYPE, UserEntity } from "../jupiterone";

export function generateUserKey(id?: string) {
  return `gsuite-user-id-${id}`;
}

export function createUserEntities(data: User[]): UserEntity[] {
  return data.map(user => {
    return {
      _key: generateUserKey(user.id),
      _type: USER_ENTITY_TYPE,
      _class: USER_ENTITY_CLASS,
      id: user.id,
      displayName: (user.name && user.name.fullName) || "",
      firstName: user.name && user.name.givenName,
      lastName: user.name && user.name.familyName,
      mfaEnabled: !!(user.isEnforcedIn2Sv && user.isEnrolledIn2Sv),
      suspended: user.suspended,
      archived: user.archived,
      active: !user.suspended || !user.archived,
      agreedToTerms: user.agreedToTerms,
      changePasswordAtNextLogin: user.changePasswordAtNextLogin,
      creationTime: user.creationTime,
      customerId: user.customerId,
      deletionTime: user.deletionTime,
      gender: user.gender,
      hashFunction: user.hashFunction,
      includeInGlobalAddressList: user.includeInGlobalAddressList,
      ipWhitelisted: user.ipWhitelisted,
      isAdmin: user.isAdmin,
      isDelegatedAdmin: user.isDelegatedAdmin,
      isEnforcedIn2Sv: user.isEnforcedIn2Sv,
      isEnrolledIn2Sv: user.isEnrolledIn2Sv,
      isMailboxSetup: user.isMailboxSetup,
      kind: user.kind,
      lastLoginTime: user.lastLoginTime,
      orgUnitPath: user.orgUnitPath,
      primaryEmail: user.primaryEmail,
      recoveryEmail: user.recoveryEmail,
      recoveryPhone: user.recoveryPhone,
      suspensionReason: user.suspensionReason,
      thumbnailPhotoEtag: user.thumbnailPhotoEtag,
      thumbnailPhotoUrl: user.thumbnailPhotoUrl
    };
  });
}
