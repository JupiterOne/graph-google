import {
  createLocalInvocationEvent,
  executeSingleHandlerLocal
} from "@jupiterone/jupiter-managed-integration-sdk";
import { createLogger, TRACE } from "bunyan";
import { executionHandler } from "../src/index";

async function run(): Promise<void> {
  const logger = createLogger({ name: "local", level: TRACE });

  // TODO Populate for authentication as a Google Service Account
  // See https://developers.google.com/identity/protocols/OAuth2ServiceAccount
  const integrationConfig = {
    // providerApiToken: process.env.PROVIDER_LOCAL_EXECUTION_API_TOKEN
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
