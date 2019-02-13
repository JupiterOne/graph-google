import { User } from "../../GSuite/GSuiteClient";
import {
  USER_ENTITY_CLASS,
  USER_ENTITY_TYPE,
  UserEntity
} from "../../JupiterOne";

export function generateUserId(id?: string) {
  return `gsuite-user-id-${id}`;
}

export function createUserEntities(data: User[]): UserEntity[] {
  return data.map(
    d =>
      ({
        _key: generateUserId(d.id),
        _type: USER_ENTITY_TYPE,
        _class: USER_ENTITY_CLASS,
        userId: d.id,
        displayName: (d.name && d.name.fullName) || "",
        firstName: d.name && d.name.givenName,
        lastName: d.name && d.name.familyName,
        suspended: d.suspended,
        archived: d.archived,
        active: !d.suspended || !d.archived,
        tags: d.keywords && d.keywords.map((k: { value: string }) => k.value),
        agreedToTerms: d.agreedToTerms,
        changePasswordAtNextLogin: d.changePasswordAtNextLogin,
        creationTime: d.creationTime,
        customerId: d.customerId,
        deletionTime: d.deletionTime,
        etag: d.etag,
        gender: d.gender,
        includeInGlobalAddressList: d.includeInGlobalAddressList,
        ipWhitelisted: d.ipWhitelisted,
        isAdmin: d.isAdmin,
        isDelegatedAdmin: d.isDelegatedAdmin,
        isEnforcedIn2Sv: d.isEnforcedIn2Sv,
        isEnrolledIn2Sv: d.isEnrolledIn2Sv,
        isMailboxSetup: d.isMailboxSetup,
        kind: d.kind,
        lastLoginTime: d.lastLoginTime,
        primaryEmail: d.primaryEmail,
        recoveryEmail: d.recoveryEmail,
        recoveryPhone: d.recoveryPhone,
        suspensionReason: d.suspensionReason,
        thumbnailPhotoUrl: d.thumbnailPhotoUrl
      } as UserEntity)
  );
}
