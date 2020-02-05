import { User } from "../gsuite/GSuiteClient";
import { USER_ENTITY_CLASS, USER_ENTITY_TYPE, UserEntity } from "../jupiterone";
import {
  capitalizeFirstLetter,
  decapitalizeFirstLetter,
} from "../utils/formatFirstLetter";
import getTime from "../utils/getTime";

import generateEntityKey from "../utils/generateEntityKey";
import setCollectionAsFlattenFields from "../utils/setCollectionAsFlattenFields";

export function createUserEntities(data: User[]): UserEntity[] {
  return data.map(user => {
    let userEntity: UserEntity = {
      _key: generateEntityKey(USER_ENTITY_TYPE, user.id),
      _type: USER_ENTITY_TYPE,
      _class: USER_ENTITY_CLASS,
      _rawData: [{ name: "default", rawData: user }],
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
    userEntity = assignCustomAttributes(user, userEntity);

    return userEntity;
  });
}

function assignUsername(user: User, userEntity: UserEntity): UserEntity {
  if (!user.primaryEmail) {
    return userEntity;
  }

  const usernameMatch = /(.*?)@.*/.exec(user.primaryEmail);
  if (!usernameMatch || !usernameMatch[1]) {
    return userEntity;
  }

  userEntity.username = usernameMatch[1];

  return userEntity;
}

function assignAddresses(user: User, userEntity: UserEntity): UserEntity {
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

function assignPhones(user: User, userEntity: UserEntity): UserEntity {
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

function assignRelations(user: User, userEntity: UserEntity): UserEntity {
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

function assignExternalIds(user: User, userEntity: UserEntity): UserEntity {
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

function assignEmails(user: User, userEntity: UserEntity): UserEntity {
  if (!user.emails) {
    return userEntity;
  }

  const emailsCollection = user.emails.filter(
    (e: { type: string }) => !!e.type,
  );

  return setCollectionAsFlattenFields<UserEntity>(
    userEntity,
    "Email",
    emailsCollection,
    "address",
  );
}

function assignManagementInfo(userEntity: UserEntity): UserEntity {
  if (!userEntity.managerRelation) {
    return userEntity;
  }

  if (userEntity.managerRelation.includes("@")) {
    userEntity.managerEmail = userEntity.managerRelation;
  } else {
    userEntity.manager = userEntity.managerRelation;
  }

  return userEntity;
}

function assignEmployeeInfo(user: User, userEntity: UserEntity): UserEntity {
  if (!user.organizations || user.organizations.length === 0) {
    return userEntity;
  }

  const primaryOrganization = user.organizations.find(o => !!o.primary);
  const employeeInfo = primaryOrganization || user.organizations[0];

  userEntity.title = employeeInfo.title;
  userEntity.customType = employeeInfo.customType;
  userEntity.department = employeeInfo.department;
  userEntity.role = employeeInfo.description;
  userEntity.costCenter = employeeInfo.costCenter;

  return userEntity;
}

function assignCustomAttributes(
  user: User,
  userEntity: UserEntity,
): UserEntity {
  if (!user.customSchemas) {
    return userEntity;
  }
  const categoryKeys = Object.keys(user.customSchemas);
  const categoryValues = Object.values(user.customSchemas);

  const userEntityWithCustomAttributes = categoryValues.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: any, item, itemIndex) => {
      const keys = Object.keys(item);
      const values = Object.values(item);

      for (let index = 0; index < keys.length; index++) {
        const categoryName = decapitalizeFirstLetter(categoryKeys[itemIndex]);
        const newPropertyName = keys[index];
        const newPropertyValue = values[index];

        const isPropertyDuplicate = newPropertyName in acc;

        const fixedNewPropertyName = isPropertyDuplicate
          ? categoryName + capitalizeFirstLetter(newPropertyName)
          : newPropertyName;
        acc[fixedNewPropertyName] = newPropertyValue;
      }

      return acc;
    },
    userEntity,
  );

  return userEntityWithCustomAttributes;
}
