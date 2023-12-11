import { admin_directory_v1 } from 'googleapis';

import {
  createDirectRelationship,
  Entity,
  getRawData,
  IntegrationProviderAuthorizationError,
  IntegrationStep,
  IntegrationWarnEventName,
  JobState,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import {
  entities,
  IngestionSources,
  relationships,
  Steps,
} from '../../constants';
import { GSuiteGroupClient } from '../../gsuite/clients/GSuiteGroupClient';
import { GSuiteGroupSettingsClient } from '../../gsuite/clients/GSuiteGroupSettingsClient';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import getAccountEntity from '../../utils/getAccountEntity';
import { getUserEntityKey } from '../users/converters';
import {
  createAccountHasGroupRelationship,
  createGroupEntity,
  createGroupHasGroupMappedRelationship,
  createGroupHasGroupRelationship,
  createGroupHasUserMappedRelationship,
  createGroupHasUserRelationship,
  createGroupSettingsEntity,
  MemberType,
} from './converters';
import { authorizationErrorResponses } from '../../gsuite/clients/GSuiteClient';

const GROUPS_LOG_INTERVAL = 50;

async function createGroupEntities(
  context: IntegrationStepContext,
  client: GSuiteGroupClient,
) {
  const groupEntities: Entity[] = [];
  const accountEntity = await getAccountEntity(context);

  let groupsProcessed = 0;

  try {
    await client.iterateGroups(async (group) => {
      const groupEntity = await context.jobState.addEntity(
        createGroupEntity(group),
      );

      groupEntities.push(groupEntity);

      await context.jobState.addRelationship(
        createAccountHasGroupRelationship({
          groupEntity,
          accountEntity,
        }),
      );

      groupsProcessed++;
      if (groupsProcessed % GROUPS_LOG_INTERVAL === 0) {
        context.logger.info(
          { groupsProcessed },
          'Generating entities for directory groups...',
        );
      }
    });
  } catch (err) {
    if (
      err instanceof IntegrationProviderAuthorizationError &&
      authorizationErrorResponses.filter((errorText) =>
        err.statusText.match(errorText),
      ).length > 0
    ) {
      context.logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
        description: `Could not ingest groups. Missing required scope(s) (scopes=${client.requiredScopes.join(
          ', ',
        )}). Additionally, Groups -> Read Admin API Privilege needs to be enabled.`,
      });
      return;
    }

    throw err;
  }

  context.logger.info(
    { groupsProcessed },
    'Generating entities for directory groups completed.',
  );

  return groupEntities;
}

function findGroupByEmail(groups: Entity[], email: string): Entity | undefined {
  return groups.find((g) => {
    if (g.email === email) {
      return true;
    }

    if (g.aliases && (g.aliases as string[]).find((e) => e === email)) {
      return true;
    }

    return false;
  });
}

async function iterateGroupMembers(
  context: IntegrationStepContext,
  groupEntities: Entity[],
  client: GSuiteGroupClient,
  callback: (
    groupEntity: Entity,
    groupMember: admin_directory_v1.Schema$Member,
  ) => Promise<void>,
) {
  for (const groupEntity of groupEntities) {
    const groupId = groupEntity.id as string;

    try {
      await client.iterateGroupMembers(groupId, async (groupMember) => {
        await callback(groupEntity, groupMember);
      });
    } catch (err) {
      if (
        err instanceof IntegrationProviderAuthorizationError &&
        authorizationErrorResponses.filter((errorText) =>
          err.statusText.match(errorText),
        ).length > 0
      ) {
        context.logger.publishWarnEvent({
          name: IntegrationWarnEventName.MissingPermission,
          description: `Could not ingest group members. Missing required scope(s) (scopes=${client.requiredScopes.join(
            ', ',
          )}). Additionally, Groups -> Read Admin API Privilege needs to be enabled.`,
        });
        return;
      }

      throw err;
    }
  }
}

function createRelationshipFromGroupMemberTypeGroup(
  groupEntities: Entity[],
  sourceGroupEntity: Entity,
  groupMember: admin_directory_v1.Schema$Member,
): Relationship {
  const targetGroupEntity = findGroupByEmail(
    groupEntities,
    groupMember.email as string,
  );

  return targetGroupEntity
    ? createGroupHasGroupRelationship({
        sourceGroupEntity,
        targetGroupEntity,
        groupMember,
      })
    : createGroupHasGroupMappedRelationship(sourceGroupEntity, groupMember);
}

async function createRelationshipFromGroupMemberTypeUser(
  sourceGroupEntity: Entity,
  groupMember: admin_directory_v1.Schema$Member,
  jobState: JobState,
): Promise<Relationship> {
  const userId = groupMember.id as string;
  const targetUserEntity = await jobState.findEntity(getUserEntityKey(userId));

  return targetUserEntity
    ? createGroupHasUserRelationship({
        sourceGroupEntity,
        targetUserEntity,
        groupMember,
      })
    : createGroupHasUserMappedRelationship(sourceGroupEntity, groupMember);
}

export async function fetchGroups(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState, instance, logger } = context;
  const client = new GSuiteGroupClient({
    config: instance.config,
    logger,
  });

  // Create all of the group entities up front and later iterate the group
  // members. There may be mapped relationships we have to create, so we need
  // all of the group information up front.
  //
  // See: https://github.com/JupiterOne/graph-google/issues/27
  const groupEntities = await createGroupEntities(context, client);

  let groupsProcessed = 0;
  let totalGroupMembersProcessed = 0;

  let currentGroupKey;
  let currentGroupMembersProcessed;

  if (!groupEntities) return;

  await iterateGroupMembers(
    context,
    groupEntities,
    client,
    async (groupEntity, groupMember) => {
      if (!currentGroupKey || currentGroupKey !== groupEntity._key) {
        currentGroupMembersProcessed = 0;
        currentGroupKey = groupEntity._key;
        groupsProcessed++;
      }

      currentGroupMembersProcessed++;
      totalGroupMembersProcessed++;

      switch (groupMember.type) {
        case MemberType.GROUP:
          await jobState.addRelationship(
            createRelationshipFromGroupMemberTypeGroup(
              groupEntities,
              groupEntity,
              groupMember,
            ),
          );
          break;
        case MemberType.USER: {
          const relationship = await createRelationshipFromGroupMemberTypeUser(
            groupEntity,
            groupMember,
            jobState,
          );
          // Due to the fact that multiple users can have the same email address,
          // mapped group->member relationships are liable to be duplicated. Handle
          // these specific cases.
          if (
            typeof relationship.email === 'string' &&
            jobState.hasKey(relationship._key)
          ) {
            logger.warn(
              {
                relationship,
              },
              `There are multiple users in the group ${groupEntity.displayName} with the same email address: ${groupMember.email}. This is against Google's policies.` +
                groupEntity.webLink
                ? ` Please fix this issue here: ${groupEntity.webLink}`
                : '',
            );
          } else {
            await jobState.addRelationship(relationship);
          }
          break;
        }
        default:
          context.logger.trace(
            {
              groupType: groupMember.type,
            },
            'Unknown group type encountered',
          );
          break;
      }

      if (groupsProcessed % GROUPS_LOG_INTERVAL === 0) {
        context.logger.info(
          {
            groupsProcessed,
            totalGroupMembersProcessed,
            currentGroupMembersProcessed,
          },
          'Generating member relationships for directory groups...',
        );
      }
    },
  );

  context.logger.info(
    {
      groupsProcessed,
      totalGroupMembersProcessed,
      currentGroupMembersProcessed,
    },
    'Generating member relationships for directory groups completed.',
  );
}

export async function fetchGroupSettings(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState, instance, logger } = context;

  const client = new GSuiteGroupSettingsClient({
    config: instance.config,
    logger,
  });

  const quotaExceededWarnings: string[] = [];

  await jobState.iterateEntities(
    { _type: entities.GROUP._type },
    async (groupEntity) => {
      try {
        const group = getRawData(
          groupEntity,
        ) as admin_directory_v1.Schema$Group;
        const groupSettings = await client.getGroupSettings(group.email!);

        if (groupSettings) {
          await context.jobState.addRelationship(
            createDirectRelationship({
              _class: relationships.GROUP_HAS_SETTINGS._class,
              from: groupEntity,
              to: await context.jobState.addEntity(
                createGroupSettingsEntity(group, groupSettings),
              ),
            }),
          );
        }
      } catch (err) {
        if (
          err instanceof IntegrationProviderAuthorizationError &&
          authorizationErrorResponses.filter((errorText) =>
            err.statusText.match(errorText),
          ).length > 0
        ) {
          context.logger.publishWarnEvent({
            name: IntegrationWarnEventName.MissingPermission,
            description: `Could not ingest group setttings. Missing required scope(s) (scopes=${client.requiredScopes.join(
              ', ',
            )}). Additionally, Groups -> Read Admin API Privilege needs to be enabled.`,
          });
          return;
        }

        if (
          err instanceof IntegrationProviderAuthorizationError &&
          err.status === 403 &&
          err.statusText.match(/Quota exceeded/i)
        ) {
          if (!quotaExceededWarnings.includes(err.statusText)) {
            quotaExceededWarnings.push(err.statusText);
          }

          return;
        }

        throw err;
      }
    },
  );

  for (const quotaExceededWarning of quotaExceededWarnings) {
    context.logger.publishWarnEvent({
      name: IntegrationWarnEventName.IngestionLimitEncountered,
      description: quotaExceededWarning,
    });
  }
}

export const groupSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.GROUPS,
    ingestionSourceId: IngestionSources.GROUPS,
    name: 'Groups',
    entities: [entities.GROUP],
    relationships: [
      relationships.GROUP_HAS_USER,
      relationships.GROUP_HAS_GROUP,
      relationships.ACCOUNT_HAS_GROUP,
    ],
    dependsOn: [Steps.ACCOUNT, Steps.USERS],
    executionHandler: fetchGroups,
  },
  {
    id: Steps.GROUP_SETTINGS,
    ingestionSourceId: IngestionSources.GROUP_SETTINGS,
    name: 'Group Settings',
    entities: [entities.GROUP_SETTINGS],
    relationships: [relationships.GROUP_HAS_SETTINGS],
    dependsOn: [Steps.GROUPS],
    executionHandler: fetchGroupSettings,
  },
];
