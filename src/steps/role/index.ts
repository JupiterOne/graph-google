import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, Steps } from '../../constants';
import { createRoleEntity } from './converters';

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

export async function createRole(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState, instance } = context;
  const { domainNames, primaryDomain } = await collectDomainEntityData(context);

  await jobState.addEntity(
    createRoleEntity({
      account: {
        googleAccountId: instance.config.googleAccountId,
        name: instance.name,
      },
      domainNames,
      primaryDomain,
    }),
  );
}

export const roleSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ROLE,
    name: 'Account',
    entities: [entities.ROLE],
    relationships: [],
    dependsOn: [Steps.DOMAINS],
    executionHandler: createRole,
  },
];
