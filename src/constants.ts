import {
  StepEntityMetadata,
  RelationshipClass,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

type EntityConstantKeys =
  | 'DOMAIN'
  | 'USER'
  | 'GROUP'
  | 'ACCOUNT'
  | 'SITE'
  | 'TOKEN';

export const entities: Record<EntityConstantKeys, StepEntityMetadata> = {
  DOMAIN: {
    resourceName: 'Domain',
    _type: 'google_domain',
    _class: 'Domain',
  },
  USER: {
    resourceName: 'User',
    _type: 'google_user',
    _class: 'User',
  },
  GROUP: {
    resourceName: 'Group',
    _type: 'google_group',
    _class: 'UserGroup',
  },
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'google_account',
    _class: 'Account',
  },
  SITE: {
    resourceName: 'Site',
    _type: 'google_site',
    _class: 'Site',
  },
  TOKEN: {
    resourceName: 'Token',
    _type: 'google_token',
    _class: 'AccessKey',
  },
};

type RelationshipConstantKeys =
  | 'ACCOUNT_HAS_USER'
  | 'SITE_HOSTS_USER'
  | 'GROUP_HAS_USER'
  | 'GROUP_HAS_GROUP'
  | 'ACCOUNT_HAS_GROUP'
  | 'USER_ASSIGNED_TOKEN';

export const relationships: Record<
  RelationshipConstantKeys,
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'google_account_has_user',
    _class: RelationshipClass.HAS,
    sourceType: entities.ACCOUNT._type,
    targetType: entities.USER._type,
  },
  SITE_HOSTS_USER: {
    _type: 'google_site_has_user',
    // TODO: Change to HOSTS
    _class: RelationshipClass.HAS,
    sourceType: entities.SITE._type,
    targetType: entities.USER._type,
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
};
