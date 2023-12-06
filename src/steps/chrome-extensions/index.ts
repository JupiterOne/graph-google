import {
  IntegrationProviderAuthorizationError,
  IntegrationStep,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { entities, IngestionSources, Steps } from '../../constants';
import { createChromeExtensionEntity } from './converters';
import { GSuiteInstalledAppsClient } from '../../gsuite/clients/GSuiteInstalledAppsClient';
import { chromemanagement_v1 } from 'googleapis';
import { RawInstalledAppEntity } from './types';
import { authorizationErrorResponses } from '../../gsuite/clients/GSuiteClient';
import generateEntityKey from '../../utils/generateEntityKey';

const APP_EXTENSION_TYPE = 'EXTENSION';

export async function fetchChromeExtensions({
  instance,
  logger,
  jobState,
}: IntegrationStepContext): Promise<void> {
  const client = new GSuiteInstalledAppsClient({
    config: instance.config,
    logger: logger,
  });

  try {
    await client.iterateInstalledApps(APP_EXTENSION_TYPE, async (app) => {
      if (
        !isValidInstalledAppEntity(app) &&
        jobState.hasKey(
          generateEntityKey(entities.CHROME_EXTENSION._type, app.appId),
        )
      ) {
        return;
      }
      await jobState.addEntity(createChromeExtensionEntity(app));
    });
  } catch (err) {
    if (
      err instanceof IntegrationProviderAuthorizationError &&
      authorizationErrorResponses.includes(err.statusText)
    ) {
      logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
        description: `Could not ingest chrome browser extension data. Missing required scope(s) (scopes=${client.requiredScopes.join(
          ', ',
        )}). Additionally, the admin email provided in configuration must have the Admin console privilege Chrome Management -> View Extensions List Report enabled.`,
      });
      return;
    }

    throw err;
  }
}

function isValidInstalledAppEntity(
  app: chromemanagement_v1.Schema$GoogleChromeManagementV1InstalledApp,
): app is RawInstalledAppEntity {
  return 'appId' in app && typeof app.appId === 'string';
}

export const extensionSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CHROME_EXTENSIONS,
    ingestionSourceId: IngestionSources.CHROME_EXTENSIONS,
    name: 'Chrome Extensions',
    entities: [entities.CHROME_EXTENSION],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchChromeExtensions,
  },
];
