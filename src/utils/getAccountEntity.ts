import { IntegrationStepContext } from '../types';
import { IntegrationMissingKeyError } from '@jupiterone/integration-sdk-core';
import { getAccountKey } from '../steps/account/converters';

export default async function getAccountEntity(
  context: IntegrationStepContext,
) {
  const { jobState, instance } = context;
  const { googleAccountId } = instance.config;

  const accountEntity = await jobState.findEntity(
    getAccountKey(googleAccountId),
  );

  if (!accountEntity) {
    throw new IntegrationMissingKeyError(
      `Could not find account entity (googleAccountId=${googleAccountId})`,
    );
  }

  return accountEntity;
}
