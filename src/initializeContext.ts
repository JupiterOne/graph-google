import {
  IntegrationExecutionContext,
  IntegrationInstanceConfigError,
  IntegrationInvocationEvent
} from "@jupiterone/jupiter-managed-integration-sdk";
import { JWTOptions } from "google-auth-library";

import { GSuiteClient } from "./gsuite";

export default async function initializeContext(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>
) {
  const { config } = context.instance;

  if (!config.creds) {
    throw new IntegrationInstanceConfigError(
      "config.creds should be a valid JWT json key"
    );
  }

  const creds = JSON.parse(config.creds);
  const jwtOptions: JWTOptions = {
    email: creds.client_email,
    key: creds.private_key,
    subject: config.subject
  };
  const provider = new GSuiteClient(config.accountId, jwtOptions);
  await provider.authenticate();

  const { persister, graph } = context.clients.getClients();

  return {
    graph,
    persister,
    provider
  };
}
