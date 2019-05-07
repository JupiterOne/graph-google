import { User } from "../gsuite/GSuiteClient";
import { USER_ENTITY_CLASS, USER_ENTITY_TYPE, UserEntity } from "../jupiterone";
import getTime from "../utils/getTime";
import toGenderProperty from "./toGenderProperty";

import generateEntityKey from "../utils/generateEntityKey";
import setCollectionAsFlattenFields from "../utils/setCollectionAsFlattenFields";

export function createUserEntities(data: User[]): UserEntity[] {
  return data.map(user => {
    let userEntity: UserEntity = {
      _key: generateEntityKey(USER_ENTITY_TYPE, user.id),
      _type: USER_ENTITY_TYPE,
      _class: USER_ENTITY_CLASS,
      id: user.id,
      email: user.primaryEmail,
      displayName: (user.name && user.name.fullName) || "",
      firstName: user.name && user.name.givenName,
      lastName: user.name && user.name.familyName,
      mfaEnabled: !!(user.isEnforcedIn2Sv && user.isEnrolledIn2Sv),
      suspended: user.suspended,
      archived: user.archived,
      active: !user.suspended || !user.archived,
      agreedToTerms: user.agreedToTerms,
      changePasswordAtNextLogin: user.changePasswordAtNextLogin,
      creationTime: getTime(user.creationTime),
      deletionTime: getTime(user.deletionTime),
      lastLoginTime: getTime(user.lastLoginTime),
      customerId: user.customerId,
      gender: toGenderProperty(user.gender),
      hashFunction: user.hashFunction,
      includeInGlobalAddressList: user.includeInGlobalAddressList,
      ipWhitelisted: user.ipWhitelisted,
      isAdmin: user.isAdmin,
      isDelegatedAdmin: user.isDelegatedAdmin,
      isEnforcedIn2Sv: user.isEnforcedIn2Sv,
      isEnrolledIn2Sv: user.isEnrolledIn2Sv,
      isMailboxSetup: user.isMailboxSetup,
      kind: user.kind,
      orgUnitPath: user.orgUnitPath,
      primaryEmail: user.primaryEmail,
      recoveryEmail: user.recoveryEmail,
      recoveryPhone: user.recoveryPhone,
      suspensionReason: user.suspensionReason,
      thumbnailPhotoEtag: user.thumbnailPhotoEtag,
      thumbnailPhotoUrl: user.thumbnailPhotoUrl,
      aliases: user.aliases,
    };

    if (user.addresses) {
      userEntity = setCollectionAsFlattenFields(
        userEntity,
        "Address",
        user.addresses,
        "formatted",
      );
    }

    if (user.phones) {
      userEntity = setCollectionAsFlattenFields(
        userEntity,
        "Phone",
        user.phones,
        "value",
      );
    }

    if (user.relations) {
      userEntity = setCollectionAsFlattenFields(
        userEntity,
        "Relation",
        user.relations,
        "value",
      );
    }

    if (user.externalIds) {
      userEntity = setCollectionAsFlattenFields<UserEntity>(
        userEntity,
        "ExternalId",
        user.externalIds,
        "value",
      );
    }

    if (user.emails) {
      const emailsColletion = user.emails.filter(
        (e: { type: string }) => !!e.type,
      );
      userEntity = setCollectionAsFlattenFields<UserEntity>(
        userEntity,
        "Email",
        emailsColletion,
        "address",
      );
    }

    return userEntity;
  });
}
