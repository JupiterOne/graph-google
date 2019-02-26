import {
  createLocalInvocationEvent,
  executeSingleHandlerLocal
} from "@jupiterone/jupiter-managed-integration-sdk/local";
import { createLogger, TRACE } from "bunyan";
import { executionHandler } from "../src/index";

async function run(): Promise<void> {
  const logger = createLogger({ name: "local", level: TRACE });

  if (
    !process.env.GOOGLE_ACCOUNT_ID ||
    !process.env.GOOGLE_DOMAIN_ADMIN_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
  ) {
    throw new Error("Local execution requires G Suite environment variables");
  }

  const serviceAccountCredentials = JSON.parse(
    process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
  );

  const integrationConfig = {
    googleAccountId: process.env.GOOGLE_ACCOUNT_ID,
    domainAdminEmail: process.env.GOOGLE_DOMAIN_ADMIN_EMAIL
  };

  logger.info(
    await executeSingleHandlerLocal(
      integrationConfig,
      logger,
      executionHandler,
      { serviceAccountCredentials },
      createLocalInvocationEvent()
    ),
    "Execution completed successfully!"
  );
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
