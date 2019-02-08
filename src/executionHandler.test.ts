import { createTestIntegrationExecutionContext } from '@jupiterone/jupiter-managed-integration-sdk';
import executionHandler from './executionHandler';

test("executionHandler", async () => {
  const executionContext = createTestIntegrationExecutionContext();
  await executionHandler(executionContext);
});
