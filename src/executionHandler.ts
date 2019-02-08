import {
  IntegrationExecutionContext,
  IntegrationExecutionResult,
  IntegrationInvocationEvent
} from '@jupiterone/jupiter-managed-integration-sdk';

export default async function executionHandler(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>
): Promise<IntegrationExecutionResult> {
  return {
    operations: {
      created: 0,
      deleted: 0,
      updated: 0
    }
  };
}
