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

    userEntity = assignUsername(user, userEntity);
    userEntity = assignAddresses(user, userEntity);
    userEntity = assignPhones(user, userEntity);
    userEntity = assignRelations(user, userEntity);
    userEntity = assignExternalIds(user, userEntity);
    userEntity = assignEmails(user, userEntity);
    userEntity = assignManagementInfo(userEntity);
    userEntity = assignEmployeeInfo(user, userEntity);

    return userEntity;
  });
}

function assignUsername(user: User, userEntity: UserEntity) {
  if (!user.primaryEmail) {
    return userEntity;
  }

  const usernameMatch = user.primaryEmail.match("(.*?)@.*");
  if (!usernameMatch || !usernameMatch[1]) {
    return userEntity;
  }

  userEntity.username = usernameMatch[1];

  return userEntity;
}

function assignAddresses(user: User, userEntity: UserEntity) {
  if (!user.addresses) {
    return userEntity;
  }
  return setCollectionAsFlattenFields(
    userEntity,
    "Address",
    user.addresses,
    "formatted",
  );
}

function assignPhones(user: User, userEntity: UserEntity) {
  if (!user.phones) {
    return userEntity;
  }
  return setCollectionAsFlattenFields(
    userEntity,
    "Phone",
    user.phones,
    "value",
  );
}

function assignRelations(user: User, userEntity: UserEntity) {
  if (!user.relations) {
    return userEntity;
  }

  return setCollectionAsFlattenFields(
    userEntity,
    "Relation",
    user.relations,
    "value",
  );
}

function assignExternalIds(user: User, userEntity: UserEntity) {
  if (!user.externalIds) {
    return userEntity;
  }
  return setCollectionAsFlattenFields<UserEntity>(
    userEntity,
    "ExternalId",
    user.externalIds,
    "value",
  );
}

function assignEmails(user: User, userEntity: UserEntity) {
  if (!user.emails) {
    return userEntity;
  }

  const emailsColletion = user.emails.filter((e: { type: string }) => !!e.type);

  return setCollectionAsFlattenFields<UserEntity>(
    userEntity,
    "Email",
    emailsColletion,
    "address",
  );
}

function assignManagementInfo(userEntity: UserEntity) {
  if (!userEntity.managerRelation) {
    return userEntity;
  }

  if (userEntity.managerRelation.match("@")) {
    userEntity.managerEmail = userEntity.managerRelation;
  } else {
    userEntity.manager = userEntity.managerRelation;
  }

  return userEntity;
}

function assignEmployeeInfo(user: User, userEntity: UserEntity) {
  if (!user.organizations) {
    return userEntity;
  }

  const primaryOrganizaton = user.organizations.find(o => !!o.primary);

  if (!primaryOrganizaton) {
    return userEntity;
  }

  const employeeInfo = user.organizations[0];

  userEntity.title = employeeInfo.title;
  userEntity.customType = employeeInfo.customType;
  userEntity.department = employeeInfo.department;
  userEntity.employeeType = employeeInfo.description;
  userEntity.costCenter = employeeInfo.costCenter;

  return userEntity;
}
