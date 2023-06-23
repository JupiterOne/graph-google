import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const SetDataKeys = {
  DEVICE_EXTENSIONS_MAP: 'DEVICE_EXTENSIONS_MAP',
};

export const Steps = {
  DOMAINS: 'step-fetch-domains',
  ACCOUNT: 'step-create-account',
  ROLES: 'step-fetch-roles',
  ROLE_ASSIGNMENTS: 'step-fetch-role-assignments',
  USERS: 'step-fetch-users',
  TOKENS: 'step-fetch-tokens',
  GROUPS: 'step-fetch-groups',
  GROUP_SETTINGS: 'step-fetch-group-settings',
  MOBILE_DEVICES: 'step-fetch-mobile-devices',
  USER_DEVICES: 'step-fetch-user-devices',
  CHROME_OS_DEVICE: 'step-fetch-chrome-os-devices',
  CHROME_EXTENSIONS: 'step-fetch-chrome-extensions',
  BUILD_DEVICE_EXTENSION_RELATIONSHIPS:
    'step-build-device-extension-relationships',
};

export const entities: Record<
  | 'DOMAIN'
  | 'USER'
  | 'GROUP'
  | 'GROUP_SETTINGS'
  | 'ACCOUNT'
  | 'ROLE'
  | 'SITE'
  | 'TOKEN'
  | 'CHROME_OS_DEVICE'
  | 'MOBILE_DEVICE'
  | 'DEVICE'
  | 'CHROME_EXTENSION',
  StepEntityMetadata
> = {
  DOMAIN: {
    resourceName: 'Domain',
    _type: 'google_domain',
    _class: ['Domain'],
  },
  USER: {
    resourceName: 'User',
    _type: 'google_user',
    _class: ['User'],
  },
  GROUP: {
    resourceName: 'Group',
    _type: 'google_group',
    _class: ['UserGroup'],
  },
  GROUP_SETTINGS: {
    resourceName: 'Group Settings',
    _type: 'google_group_settings',
    _class: ['Configuration'],
  },
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'google_account',
    _class: ['Account'],
  },
  ROLE: {
    resourceName: 'Role',
    _type: 'google_role',
    _class: ['AccessRole'],
  },
  SITE: {
    resourceName: 'Site',
    _type: 'google_site',
    _class: ['Site'],
  },
  TOKEN: {
    resourceName: 'Token',
    _type: 'google_token',
    _class: ['AccessKey'],
  },
  CHROME_OS_DEVICE: {
    resourceName: 'Chrome OS Device',
    _type: 'google_chrome_os_device',
    _class: ['Device'],
  },
  MOBILE_DEVICE: {
    resourceName: 'Mobile Device',
    _type: 'google_mobile_device',
    _class: ['Device'],
  },
  DEVICE: {
    resourceName: 'Device',
    _type: 'google_device',
    _class: ['Device'],
  },
  CHROME_EXTENSION: {
    resourceName: 'Chrome Extension',
    _type: 'google_chrome_extension',
    _class: ['Application'],
  },
};

export const relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_ROLE'
  | 'ACCOUNT_MANAGES_MOBILE_DEVICE'
  | 'ACCOUNT_MANAGES_CHROME_OS_DEVICE'
  | 'SITE_HOSTS_USER'
  | 'GROUP_HAS_SETTINGS'
  | 'GROUP_HAS_USER'
  | 'GROUP_HAS_GROUP'
  | 'ACCOUNT_HAS_GROUP'
  | 'USER_ASSIGNED_TOKEN'
  | 'USER_ASSIGNED_ROLE'
  | 'TOKEN_ALLOWS_VENDOR'
  | 'ACCOUNT_MANAGES_DEVICE'
  | 'CHROME_OS_DEVICE_INSTALLED_CHROME_EXTENSION',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'google_account_has_user',
    _class: RelationshipClass.HAS,
    sourceType: entities.ACCOUNT._type,
    targetType: entities.USER._type,
  },
  ACCOUNT_HAS_ROLE: {
    _type: 'google_account_has_role',
    _class: RelationshipClass.HAS,
    sourceType: entities.ACCOUNT._type,
    targetType: entities.ROLE._type,
  },
  ACCOUNT_MANAGES_MOBILE_DEVICE: {
    _type: 'google_account_manages_mobile_device',
    _class: RelationshipClass.MANAGES,
    sourceType: entities.ACCOUNT._type,
    targetType: entities.MOBILE_DEVICE._type,
  },
  ACCOUNT_MANAGES_CHROME_OS_DEVICE: {
    _type: 'google_account_manages_chrome_os_device',
    _class: RelationshipClass.MANAGES,
    sourceType: entities.ACCOUNT._type,
    targetType: entities.CHROME_OS_DEVICE._type,
  },
  SITE_HOSTS_USER: {
    _type: 'google_site_has_user',
    // TODO: Change to HOSTS
    _class: RelationshipClass.HAS,
    sourceType: entities.SITE._type,
    targetType: entities.USER._type,
  },
  GROUP_HAS_SETTINGS: {
    _type: 'google_group_has_settings',
    _class: RelationshipClass.HAS,
    sourceType: entities.GROUP._type,
    targetType: entities.GROUP_SETTINGS._type,
  },
  GROUP_HAS_USER: {
    _type: 'google_group_has_user',
    _class: RelationshipClass.HAS,
    sourceType: entities.GROUP._type,
    targetType: entities.USER._type,
  },
  GROUP_HAS_GROUP: {
    _type: 'google_group_has_group',
    _class: RelationshipClass.HAS,
    sourceType: entities.GROUP._type,
    targetType: entities.GROUP._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'google_account_has_group',
    _class: RelationshipClass.HAS,
    sourceType: entities.ACCOUNT._type,
    targetType: entities.GROUP._type,
  },
  USER_ASSIGNED_TOKEN: {
    _type: 'google_user_assigned_token',
    _class: RelationshipClass.ASSIGNED,
    sourceType: entities.USER._type,
    targetType: entities.TOKEN._type,
  },
  USER_ASSIGNED_ROLE: {
    _type: 'google_user_assigned_role',
    _class: RelationshipClass.ASSIGNED,
    sourceType: entities.USER._type,
    targetType: entities.ROLE._type,
  },
  TOKEN_ALLOWS_VENDOR: {
    _type: 'google_token_allows_mapped_vendor',
    _class: RelationshipClass.ALLOWS,
    sourceType: entities.TOKEN._type,
    targetType: 'mapped_entity (class Vendor)',
  },
  ACCOUNT_MANAGES_DEVICE: {
    _type: 'google_account_manages_device',
    _class: RelationshipClass.MANAGES,
    sourceType: entities.ACCOUNT._type,
    targetType: entities.DEVICE._type,
  },
  CHROME_OS_DEVICE_INSTALLED_CHROME_EXTENSION: {
    _type: 'google_chrome_os_device_installed_chrome_extension',
    _class: RelationshipClass.INSTALLED,
    sourceType: entities.CHROME_OS_DEVICE._type,
    targetType: entities.CHROME_EXTENSION._type,
  },
};
