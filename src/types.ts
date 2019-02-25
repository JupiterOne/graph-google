import {
  GraphClient,
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
  PersisterClient
} from "@jupiterone/jupiter-managed-integration-sdk";

import GSuiteClient from "./gsuite/GSuiteClient";

export interface GSuiteExecutionContext
  extends IntegrationExecutionContext<IntegrationInvocationEvent> {
  graph: GraphClient;
  persister: PersisterClient;
  provider: GSuiteClient;
}

export interface GoogleIntegrationInstanceConfig {
  googleAccountId: string;
  domainAdminEmail: string;
}

/**
 * Google Service Account credentials, allowing code to run as the service
 * account, securely maintained by the execution environment and provided at
 * runtime in the `context.invocationArgs.serviceAccountCredentials`.
 */
export interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}
