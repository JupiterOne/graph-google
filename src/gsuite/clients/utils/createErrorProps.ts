import { IntegrationProviderAPIError } from '@jupiterone/integration-sdk-core';
import { GaxiosError } from 'gaxios';
import { GetConstructorArgs } from './typeFunctions';

const UNKNOWN_VALUE = 'UNKNOWN';

type J1ApiErrorProps = GetConstructorArgs<
  typeof IntegrationProviderAPIError
>[0];

export type GaxiosErrorResponse = {
  message: string;
  domain: string;
  reason: string;
};

export function createErrorProps(
  error: GaxiosError & { errors: GaxiosErrorResponse[] },
): J1ApiErrorProps {
  if (error.constructor.name === 'GaxiosError' && error.response) {
    return {
      cause: error,
      endpoint: error.response?.config?.url || UNKNOWN_VALUE,
      status: error.response?.status,
      statusText: error.errors[0].message || error.response?.statusText,
    };
  } else {
    return {
      // If it isn't GaxiosError, not sure what the args are so just take the error and move on
      cause: error,
      endpoint: UNKNOWN_VALUE,
      status: UNKNOWN_VALUE,
      statusText: UNKNOWN_VALUE,
    };
  }
}
