import { IntegrationError } from '@jupiterone/integration-sdk-core';

// Unsafe meaning it may be falsy
export type UnsafeIdKey = string | number | null | undefined;

/**
 * Generates a valid `_key` value for entities.
 *
 * `_key` values must be unique within a JupiterOne account. A key prefix helps
 * ensure uniqueness when the `id` is not certain to be unique across resources
 * types.
 *
 * @param prefix key prefix
 * @param id an identifier known to the provider
 * @throws IntegrationError when id is falsy
 */
export default function generateEntityKey(prefix: string, id: UnsafeIdKey) {
  if (!id) {
    throw new IntegrationError({
      code: 'UNDEFINED_KEY_ERROR',
      message: `Cannot generate a valid _key with ${JSON.stringify(id)}`,
    });
  }

  return `${prefix}_${id}`;
}
