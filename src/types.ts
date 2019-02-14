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
