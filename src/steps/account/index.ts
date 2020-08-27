import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities } from '../../constants';
import { createAccountEntity } from './converters';

interface CollectDomainEntityDataResult {
  domainNames: string[];
  primaryDomain?: string;
}

async function collectDomainEntityData(
  context: IntegrationStepContext,
): Promise<CollectDomainEntityDataResult> {
  const domainNames: string[] = [];
  let primaryDomain: string | undefined;

  await context.jobState.iterateEntities(
    {
      _type: entities.DOMAIN._type,
    },
    async (e) => {
      const domainName = e.domainName as string;

      if (e.primary) {
        primaryDomain = domainName;
      }

      domainNames.push(domainName);
      return Promise.resolve();
    },
  );

  return {
    domainNames,
    primaryDomain,
  };
}

export async function createAccount(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState, instance } = context;
  const { domainNames, primaryDomain } = await collectDomainEntityData(context);

  await jobState.addEntity(
    createAccountEntity({
      account: {
        googleAccountId: instance.config.googleAccountId,
        name: instance.name,
      },
      domainNames,
      primaryDomain,
    }),
  );
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'step-create-account',
    name: 'Account',
    entities: [entities.ACCOUNT],
    relationships: [],
    dependsOn: ['step-fetch-domains'],
    executionHandler: createAccount,
  },
];
