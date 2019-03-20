/* tslint:disable:no-console */
import {
  createLocalInvocationEvent,
  executeSingleHandlerLocal,
} from "@jupiterone/jupiter-managed-integration-sdk";
import { createLogger, TRACE } from "bunyan";
import { executionHandler } from "../src/index";

async function run(): Promise<void> {
  const logger = createLogger({ name: "local", level: TRACE });

  if (
    !process.env.GOOGLE_LOCAL_EXECUTION_ACCOUNT_ID ||
    !process.env.GOOGLE_LOCAL_EXECUTION_DOMAIN_ADMIN_EMAIL ||
    !process.env.GOOGLE_LOCAL_EXECUTION_SERVICE_ACCOUNT_CREDENTIALS
  ) {
    throw new Error(
      "Local execution requires environment variables, see README.md",
    );
  }

  const serviceAccountCredentials = JSON.parse(
    process.env.GOOGLE_LOCAL_EXECUTION_SERVICE_ACCOUNT_CREDENTIALS,
  );

  const integrationConfig = {
    googleAccountId: process.env.GOOGLE_LOCAL_EXECUTION_ACCOUNT_ID,
    domainAdminEmail: process.env.GOOGLE_LOCAL_EXECUTION_DOMAIN_ADMIN_EMAIL,
  };

  logger.info(
    await executeSingleHandlerLocal(
      integrationConfig,
      logger,
      executionHandler,
      { serviceAccountCredentials },
      createLocalInvocationEvent(),
    ),
    "Execution completed successfully!",
  );
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
