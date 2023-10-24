import { IntegrationIngestionConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { IngestionSources } from './constants';

export const ingestionConfig: IntegrationIngestionConfigFieldMap = {
  [IngestionSources.DOMAINS]: {
    title: 'Google Workspace Domains',
    description: 'Internet addresses for Google services access.',
    defaultsToDisabled: false,
  },
  [IngestionSources.ROLES]: {
    title: 'Google Workspace Roles',
    description: 'Set of permissions for users.',
    defaultsToDisabled: false,
  },
  [IngestionSources.ROLE_ASSIGNMENTS]: {
    title: 'Google Workspace Roles Assignments',
    description: 'Linking users/groups to roles.',
    defaultsToDisabled: false,
  },
  [IngestionSources.USERS]: {
    title: 'Google Workspace Users',
    description: 'Individuals with account access.',
    defaultsToDisabled: false,
  },
  [IngestionSources.TOKENS]: {
    title: 'Google Workspace Tokens',
    description: 'Digital keys for account access/security.',
    defaultsToDisabled: false,
  },
  [IngestionSources.GROUPS]: {
    title: 'Google Workspace Groups',
    description: 'Collections of users for shared access.',
    defaultsToDisabled: false,
  },
  [IngestionSources.GROUP_SETTINGS]: {
    title: 'Google Workspace Group Settings',
    description: 'Rules controlling group functions.',
    defaultsToDisabled: false,
  },
  [IngestionSources.MOBILE_DEVICES]: {
    title: 'Google Workspace Mobile Devices',
    description: "User's mobile hardware using services.",
    defaultsToDisabled: false,
  },
  [IngestionSources.USER_DEVICES]: {
    title: 'Google Workspace User Devices',
    description: 'Hardware registered to users.',
    defaultsToDisabled: false,
  },
  [IngestionSources.CHROME_OS_DEVICE]: {
    title: 'Google Workspace ChromeOS Devices',
    description: "Google's operating system devices.",
    defaultsToDisabled: false,
  },
  [IngestionSources.CHROME_EXTENSIONS]: {
    title: 'Google Workspace Chrome Extensions',
    description: 'Browser functionality add-ons.',
    defaultsToDisabled: false,
  },
};
