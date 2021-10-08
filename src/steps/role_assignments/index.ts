import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { relationships, Steps } from '../../constants';
import { GSuiteRoleAssignmentClient } from '../../gsuite/clients/GSuiteRoleAssignmentClient';
import { getUserEntityKey } from '../users/converters';
import { getRoleEntityKey } from '../roles/converters';

export async function fetchRoleAssignments(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState, instance, logger } = context;
  const client = new GSuiteRoleAssignmentClient({
    config: instance.config,
    logger,
  });

  await client.iterateRoleAssignments(async (roleAssignment) => {
    const userEntity = await jobState.findEntity(
      getUserEntityKey(roleAssignment.assignedTo),
    );
    if (!userEntity) {
      context.logger.warn(
        { assignedTo: roleAssignment.assignedTo },
        "Couldn't find userEntity",
      );
      return;
    }

    const roleEntity = await jobState.findEntity(
      getRoleEntityKey(roleAssignment.roleId),
    );
    if (!roleEntity) {
      context.logger.warn(
        { roleId: roleAssignment.roleId },
        "Couldn't find roleEntity",
      );
      return;
    }

    const roleUserRelationship = createDirectRelationship({
      from: userEntity,
      _class: RelationshipClass.ASSIGNED,
      to: roleEntity,
      properties: {
        // condition: roleAssignment.condition --> is defined in the API docs but is not available in typings (https://developers.google.com/admin-sdk/directory/reference/rest/v1/roleAssignments#RoleAssignment)
        roleAssignmentId: roleAssignment.roleAssignmentId,
        roleId: roleAssignment.roleId,
        assignedTo: roleAssignment.assignedTo,
        scopeType: roleAssignment.scopeType,
        kind: roleAssignment.kind,
        etag: roleAssignment.etag,
        orgUnitId: roleAssignment.orgUnitId,
      },
    });

    await jobState.addRelationship(roleUserRelationship);
  });
}

export const roleAssignmentSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ROLE_ASSIGNMENTS,
    name: 'Role Assignments',
    entities: [],
    relationships: [relationships.USER_ASSIGNED_ROLE],
    dependsOn: [Steps.USERS, Steps.ROLES],
    executionHandler: fetchRoleAssignments,
  },
];