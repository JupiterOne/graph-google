/**
 * Converts a gender property to a string.
 *
 * @param value a gender property as described by https://developers.google.com/admin-sdk/directory/v1/reference/users
 */
export default function toGenderProperty(value: any): string | undefined {
  if (typeof value === "string") {
    return value;
  } else if (typeof value === "object") {
    if (value.type === "other" && value.customGender) {
      return value.customGender;
    } else if (value.type !== "unknown") {
      return value.type;
    }
  }
}
