import {
  createLocalInvocationEvent,
  executeSingleHandlerLocal
} from "@jupiterone/jupiter-managed-integration-sdk/local";
import { createLogger, TRACE } from "bunyan";
import { executionHandler } from "../src/index";

async function run(): Promise<void> {
  const logger = createLogger({ name: "local", level: TRACE });

  // TODO Populate for authentication as a Google Service Account
  // See https://developers.google.com/identity/protocols/OAuth2ServiceAccount
  const integrationConfig = {
    accountId: process.env.GSUITE_ACCOUNT_ID,
    creds: process.env.GSUITE_CREDS,
    subject: process.env.GSUITE_SUBJECT
  };

  logger.info(
    await executeSingleHandlerLocal(
      integrationConfig,
      logger,
      executionHandler,
      createLocalInvocationEvent()
    ),
    "Execution completed successfully!"
  );
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
