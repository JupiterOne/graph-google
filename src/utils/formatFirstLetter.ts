export function capitalizeFirstLetter(data: string) {
  return data.charAt(0).toUpperCase() + data.slice(1);
}

export function decapitalizeFirstLetter(data: string) {
  return data.charAt(0).toLowerCase() + data.slice(1);
}
