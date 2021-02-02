import generateEntityKey from '../../utils/generateEntityKey';
import {
  parseTimePropertyValue,
  createIntegrationEntity,
  Entity,
  createDirectRelationship,
  RelationshipClass,
  convertProperties,
} from '@jupiterone/integration-sdk-core';
import { admin_directory_v1 } from 'googleapis';
import { entities } from '../../constants';

interface GSuiteDataCollection {
  type: string;
}

interface GetCollectionAsFlattendFieldsParams<T extends GSuiteDataCollection> {
  collection: T[];
  suffix: string;
  valueMethod: string;
}

export function getCollectionAsFlattendFields<T extends GSuiteDataCollection>({
  collection,
  suffix,
  valueMethod,
}: GetCollectionAsFlattendFieldsParams<T>): Record<string, any> {
  const flattendRecordFields: Record<string, any> = {};

  collection.forEach((item) => {
    flattendRecordFields[`${item.type}${suffix}`] = item[valueMethod];
    if (/.+@.+\..+/.exec(item[valueMethod])) {
      flattendRecordFields[`${item.type}Email`] = item[valueMethod];
    }
  });

  return flattendRecordFields;
}

export function getUserEntityKey(userId: string) {
  return generateEntityKey(entities.USER._type, userId);
}

export function createUserEntity(data: admin_directory_v1.Schema$User) {
  const userId = data.id as string;
  const username = getUsername(data) as string;
  const name = data.name?.fullName || username;

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getUserEntityKey(userId),
        _type: entities.USER._type,
        _class: entities.USER._class,
        id: userId,
        email: data.primaryEmail,
        name,
        displayName: name,
        username: getUsername(data),
        firstName: data.name?.givenName,
        lastName: data.name?.familyName,
        mfaEnabled: !!data.isEnrolledIn2Sv,
        suspended: data.suspended,
        archived: data.archived,
        active: !data.suspended && !data.archived && data.agreedToTerms,
        agreedToTerms: data.agreedToTerms,
        changePasswordAtNextLogin: data.changePasswordAtNextLogin,
        createdOn: parseTimePropertyValue(data.creationTime),
        creationTime: parseTimePropertyValue(data.creationTime),
        deletedOn: parseTimePropertyValue(data.deletionTime),
        deletionTime: parseTimePropertyValue(data.deletionTime),
        lastLoginOn: parseTimePropertyValue(data.lastLoginTime),
        lastLoginTime: parseTimePropertyValue(data.lastLoginTime),
        customerId: data.customerId,
        hashFunction: data.hashFunction,
        includeInGlobalAddressList: data.includeInGlobalAddressList,
        ipWhitelisted: data.ipWhitelisted,
        admin: data.isAdmin || data.isDelegatedAdmin,
        isAdmin: data.isAdmin,
        isDelegatedAdmin: data.isDelegatedAdmin,
        isEnforcedIn2Sv: data.isEnforcedIn2Sv,
        isEnrolledIn2Sv: data.isEnrolledIn2Sv,
        isMailboxSetup: data.isMailboxSetup,
        kind: data.kind,
        orgUnitPath: data.orgUnitPath,
        primaryEmail: data.primaryEmail,
        recoveryEmail: data.recoveryEmail,
        recoveryPhone: data.recoveryPhone,
        suspensionReason: data.suspensionReason,
        thumbnailPhotoUrl: data.thumbnailPhotoUrl,
        aliases: data.aliases,
        ...getAddresses(data),
        ...getPhones(data),
        ...getRelations(data),
        ...getExternalIds(data),
        // TODO: This will filter out emails that do not have a "type" property.
        // Should we also add an array of emails to the entity?
        ...getEmails(data),
        ...getManagementInfo(data),
        ...getEmployeeInfo(data),
      },
    },
  });
}

export function createSiteEntity(
  userId: string,
  data: admin_directory_v1.Schema$UserLocation,
) {
  const name = [data.buildingId, data.floorName, data.floorSection].join(', ');

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _type: entities.SITE._type,
        _class: entities.SITE._class,
        _key: generateEntityKey(
          entities.SITE._type,
          `${userId}_${data.buildingId}`,
        ),
        name,
        displayName: name,
        id: data.buildingId as string,
        type: data.type,
        area: data.area,
        buildingId: data.buildingId,
        floorName: data.floorName,
        floorSection: data.floorSection,
      },
    },
  });
}

export function createSiteHostsUserRelationship(params: {
  siteEntity: Entity;
  userEntity: Entity;
}) {
  return createDirectRelationship({
    // TODO: Change to HOSTS
    _class: RelationshipClass.HAS,
    from: params.siteEntity,
    to: params.userEntity,
  });
}

export function createAccountHasUserRelationship(params: {
  accountEntity: Entity;
  userEntity: Entity;
}) {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: params.accountEntity,
    to: params.userEntity,
  });
}

function getUsername(data: admin_directory_v1.Schema$User): string | null {
  const usernameMatch = /(.*?)@.*/.exec(data.primaryEmail as string);
  return usernameMatch && usernameMatch[1];
}

function getAddresses(data: admin_directory_v1.Schema$User) {
  return (
    data.addresses &&
    getCollectionAsFlattendFields({
      collection: data.addresses,
      suffix: 'Address',
      valueMethod: 'formatted',
    })
  );
}

function getPhones(data: admin_directory_v1.Schema$User) {
  return (
    data.phones &&
    getCollectionAsFlattendFields({
      collection: data.phones,
      suffix: 'Phone',
      valueMethod: 'value',
    })
  );
}

function getRelations(data: admin_directory_v1.Schema$User) {
  return (
    data.relations &&
    getCollectionAsFlattendFields({
      collection: data.relations,
      suffix: 'Relation',
      valueMethod: 'value',
    })
  );
}

function getExternalIds(data: admin_directory_v1.Schema$User) {
  return (
    data.externalIds &&
    getCollectionAsFlattendFields({
      collection: data.externalIds,
      suffix: 'ExternalId',
      valueMethod: 'value',
    })
  );
}

function getEmails(data: admin_directory_v1.Schema$User) {
  return (
    data.emails &&
    getCollectionAsFlattendFields({
      collection: data.emails.filter((e: { type: string }) => !!e.type),
      suffix: 'Email',
      valueMethod: 'address',
    })
  );
}

interface UserManagementInfo {
  managerEmail?: string;
  manager?: string;
}

function getManagementInfo(
  data: admin_directory_v1.Schema$User,
): UserManagementInfo | undefined {
  const managerRelation = (data as any).managerRelation;

  return (
    managerRelation &&
    (managerRelation.include('@')
      ? { managerEmail: managerRelation }
      : { manager: managerRelation })
  );
}

interface EmployeeInfo {
  title: string;
  customType: string;
  department: string;
  employeeType: string;
  costCenter: string;
}

function getEmployeeInfo(
  data: admin_directory_v1.Schema$User,
): EmployeeInfo | undefined {
  if (!data.organizations || data.organizations.length === 0) {
    return;
  }

  const primaryOrganization = data.organizations.find((o) => !!o.primary);
  const org = primaryOrganization || data.organizations[0];

  const employeeInfo = {
    ...convertProperties(org),
    // `employeeInfo.description` corresponds to "Type of Employee" in the
    // Google Admin UI under "Employee Information" section.
    employeeType: org.description,
  };

  delete employeeInfo.primary;
  return employeeInfo;
}
