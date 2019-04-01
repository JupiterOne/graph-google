/**
 * Generates a valid `_key` value for entities.
 *
 * `_key` values must be unique within a JupiterOne account. It is important to
 * scope the value by type to ensure this uniqueness. `id` must not be
 * `undefined` to avoid duplicate values, such as `provider_user_undefined`.
 *
 * @param type entity _type
 * @param id an identifier known to the provider
 */
export default function generateEntityKey(type: string, id: string | number) {
  return `${type}_${id}`;
}
