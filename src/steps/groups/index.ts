import {
  IntegrationStep,
  JobState,
  Entity,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, relationships } from '../../constants';
import { GSuiteGroupClient } from '../../gsuite/clients/GSuiteGroupClient';
import {
  createAccountHasGroupRelationship,
  createGroupEntity,
  createGroupHasGroupRelationship,
  MemberType,
  createGroupHasGroupMappedRelationship,
  createGroupHasUserRelationship,
  createGroupHasUserMappedRelationship,
} from './converters';
import { admin_directory_v1 } from 'googleapis';
import getAccountEntity from '../../utils/getAccountEntity';

async function createGroupEntities(
  context: IntegrationStepContext,
  client: GSuiteGroupClient,
) {
  const groupEntities: Entity[] = [];
  const accountEntity = await getAccountEntity(context);

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
  });

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
  groupEntities: Entity[],
  client: GSuiteGroupClient,
  callback: (
    groupEntity: Entity,
    groupMember: admin_directory_v1.Schema$Member,
  ) => Promise<void>,
) {
  for (const groupEntity of groupEntities) {
    const groupId = groupEntity.id as string;

    await client.iterateGroupMembers(groupId, async (groupMember) => {
      await callback(groupEntity, groupMember);
    });
  }
}

function createRelationshipFromGroupMemberTypeGroup(
  groupEntities: Entity[],
  sourceGroupEntity: Entity,
  groupMember: admin_directory_v1.Schema$Member,
): Relationship | undefined {
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
): Promise<Relationship | undefined> {
  const userId = groupMember.id as string;
  const targetUserEntity = await jobState.findEntity(userId);

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
  // of the group information up front.
  //
  // See: https://github.com/JupiterOne/graph-google/issues/27
  const groupEntities = await createGroupEntities(context, client);

  await iterateGroupMembers(
    groupEntities,
    client,
    async (groupEntity, groupMember) => {
      switch (groupMember.type) {
        case MemberType.GROUP: {
          const relationship = createRelationshipFromGroupMemberTypeGroup(
            groupEntities,
            groupEntity,
            groupMember,
          );
          if (relationship) await jobState.addRelationship(relationship);
          break;
        }
        case MemberType.USER:
          {
            const relationship = await createRelationshipFromGroupMemberTypeUser(
              groupEntity,
              groupMember,
              jobState,
            );
            if (relationship) await jobState.addRelationship(relationship);
          }
          break;
        default:
          context.logger.trace(
            {
              groupType: groupMember.type,
            },
            'Unknown group type encountered',
          );
          break;
      }
    },
  );
}

export const groupSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'step-fetch-groups',
    name: 'Groups',
    entities: [entities.GROUP],
    relationships: [
      relationships.GROUP_HAS_USER,
      relationships.GROUP_HAS_GROUP,
      relationships.ACCOUNT_HAS_GROUP,
    ],
    dependsOn: ['step-create-account'],
    executionHandler: fetchGroups,
  },
];
