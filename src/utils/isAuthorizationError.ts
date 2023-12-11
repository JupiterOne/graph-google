import { authorizationErrorResponses } from '../gsuite/clients/GSuiteClient';

export function isAuthorizationError(statusText: string): boolean {
  return (
    authorizationErrorResponses.filter((errorText) =>
      statusText.match(errorText),
    ).length > 0
  );
}
